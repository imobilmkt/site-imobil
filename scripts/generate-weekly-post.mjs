// Gera um post novo de blog toda semana: pesquisa notícias reais do mercado
// imobiliário brasileiro via web search da API da Anthropic, escreve o
// artigo citando as fontes encontradas, valida que nada foi inventado, e
// publica (escreve os arquivos + regenera índice/sitemap/llms.txt).
//
// Uso local:
//   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-weekly-post.mjs
//
// No GitHub Actions, ver .github/workflows/weekly-blog-post.yml — o commit
// e push são feitos pelo workflow depois que este script termina com sucesso.
//
// IMPORTANTE: este script publica direto, sem revisão humana (conforme
// pedido explicitamente). A única rede de segurança é a validação abaixo:
// se a IA não citar fontes reais encontradas na busca, ou se algum campo
// obrigatório vier fora do formato esperado, o script falha (exit 1) e
// NADA é publicado — em vez de publicar algo potencialmente inventado.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { renderPostHtml } from './lib/post-template.mjs';
import { ROOT, readManifest, writeManifest, rebuildAll } from './rebuild-blog-index.mjs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
// Se a Anthropic promover a ferramenta de busca para uma versão mais nova,
// atualize só esta constante (e remova o header beta se ela virar GA).
const WEB_SEARCH_TOOL_TYPE = 'web_search_20250305';
const WEB_SEARCH_BETA_HEADER = 'web-search-2025-03-05';
const MODEL = 'claude-sonnet-5';

const ALLOWED_TAGS = ['Corretores', 'Construtoras', 'Arquitetos', 'Mercado'];
const ALLOWED_COVER_IMAGES = [
  'presenca-1.jpg', 'presenca-2.jpg', 'presenca-3.jpg',
  'empreendimento-1.jpg', 'empreendimento-2.jpg', 'vitrine-empreendimento.jpg',
  'equipe-campo.jpg', 'equipe-dupla.jpg', 'equipe-parque.jpg',
  'cta-central-vendas.jpg', 'hero-predio.jpg',
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function callAnthropic(body, { beta } = {}) {
  const headers = {
    'content-type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': ANTHROPIC_VERSION,
  };
  if (beta) headers['anthropic-beta'] = beta;

  const res = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Anthropic API respondeu ${res.status}: ${text.slice(0, 2000)}`);
  }
  return JSON.parse(text);
}

function collectCitationsAndText(content) {
  const citations = new Map(); // url -> {url, title}
  let text = '';

  for (const block of content) {
    if (block.type === 'text') {
      text += block.text + '\n';
      for (const c of block.citations || []) {
        if (c.url) citations.set(c.url, { url: c.url, title: c.title || c.url });
      }
    }
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const r of block.content) {
        if (r.url) citations.set(r.url, { url: r.url, title: r.title || r.url });
      }
    }
  }
  return { text, citations: [...citations.values()] };
}

async function research(existingTitles) {
  const prompt = `Busque notícias e informações REAIS e RECENTES (últimos 10 dias, hoje é ${todayISO()}) sobre o mercado imobiliário brasileiro que seriam relevantes para corretores de imóveis, construtoras, incorporadoras e escritórios de arquitetura — por exemplo: juros/financiamento imobiliário (SELIC, Minha Casa Minha Vida, taxas de bancos), lançamentos de grandes incorporadoras, dados do mercado (VGV, índices de venda, FipeZap), mudanças regulatórias (registro de imóveis, distrato, zoneamento), ou tendências de consumo.

Encontre pelo menos 3 fontes distintas e confiáveis (veículos de imprensa, órgãos oficiais, associações do setor). Para cada uma, resuma em 2-3 frases o que ela diz e por que interessa a esse público.

Evite repetir temas já cobertos nestes artigos existentes do blog:
${existingTitles.map(t => `- ${t}`).join('\n') || '(nenhum ainda)'}
`;

  const data = await callAnthropic(
    {
      model: MODEL,
      max_tokens: 4096,
      tools: [{ type: WEB_SEARCH_TOOL_TYPE, name: 'web_search', max_uses: 6 }],
      messages: [{ role: 'user', content: prompt }],
    },
    { beta: WEB_SEARCH_BETA_HEADER }
  );

  return collectCitationsAndText(data.content);
}

function publishArticleToolSchema() {
  return {
    name: 'publish_article',
    description: 'Publica um artigo novo no blog da IMOBIL com todos os campos necessários.',
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['slug', 'title', 'metaDescription', 'tag', 'coverImage', 'coverAlt', 'readTimeMinutes', 'bodyHtml', 'faq', 'sources'],
      properties: {
        slug: {
          type: 'string',
          description: 'kebab-case, minúsculo, sem acentos, sem caracteres especiais, 4-8 palavras, único.',
          pattern: '^[a-z0-9]+(-[a-z0-9]+)*$',
        },
        title: { type: 'string', description: 'Título do artigo (H1), direto e específico.' },
        metaDescription: { type: 'string', description: 'Até 160 caracteres, para SEO.' },
        tag: { type: 'string', enum: ALLOWED_TAGS },
        coverImage: { type: 'string', enum: ALLOWED_COVER_IMAGES },
        coverAlt: { type: 'string', description: 'Texto alternativo descritivo da imagem de capa.' },
        readTimeMinutes: { type: 'integer', minimum: 3, maximum: 12 },
        bodyHtml: {
          type: 'string',
          description:
            'Corpo do artigo em HTML semântico usando SOMENTE as tags <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>. ' +
            'NÃO inclua <script>, <style>, atributos on*, nem javascript: em hrefs. ' +
            'NÃO inclua H1 (o título já vira H1 automaticamente), nem seção de FAQ, CTA ou "Fontes" (isso é adicionado automaticamente depois do corpo). ' +
            'Sempre que usar um dado/fato vindo de uma fonte pesquisada, cite inline com <a href="URL_EXATA_DA_FONTE" target="_blank" rel="noopener">texto</a>, usando a URL exatamente como veio da pesquisa.',
        },
        faq: {
          type: 'array',
          minItems: 3,
          maxItems: 5,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['question', 'answer'],
            properties: { question: { type: 'string' }, answer: { type: 'string' } },
          },
        },
        sources: {
          type: 'array',
          minItems: 2,
          maxItems: 5,
          description: 'Fontes REALMENTE usadas no artigo. url deve ser copiada EXATAMENTE de uma das fontes fornecidas na pesquisa — nunca invente uma URL.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'publisher', 'url'],
            properties: {
              title: { type: 'string' },
              publisher: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
      },
    },
  };
}

async function writeArticle({ researchText, citations, existingTitles }) {
  const citationsList = citations.map((c, i) => `${i + 1}. ${c.title} — ${c.url}`).join('\n');

  const prompt = `Você escreve para o blog da IMOBIL, agência de marketing digital 100% especializada no mercado imobiliário brasileiro (site: imobilmkt.com.br). O público do blog é profissional: corretores de imóveis, construtoras, incorporadoras e escritórios de arquitetura — NÃO é o comprador final de imóvel.

Tom: direto, confiante, orientado a benefício prático, sem enrolação, em português do Brasil.

Aqui está o resultado de uma pesquisa real feita agora (${todayISO()}):

--- PESQUISA ---
${researchText}
--- FIM DA PESQUISA ---

Fontes disponíveis (use SOMENTE estas URLs, copiadas exatamente, para qualquer citação — nunca invente uma URL nova):
${citationsList}

Escreva UM artigo novo para o blog, conectando essa(s) notícia(s)/dado(s) real(is) a uma implicação prática para corretores, construtoras/incorporadoras OU arquitetos (escolha o ângulo mais forte — não precisa forçar os três). O artigo deve ensinar algo concreto, não ser só um resumo de notícia.

Não repita temas já cobertos:
${existingTitles.map(t => `- ${t}`).join('\n') || '(nenhum ainda)'}

Responda chamando a ferramenta publish_article.`;

  const data = await callAnthropic({
    model: MODEL,
    max_tokens: 8000,
    tools: [publishArticleToolSchema()],
    tool_choice: { type: 'tool', name: 'publish_article' },
    messages: [{ role: 'user', content: prompt }],
  });

  const toolUse = data.content.find(b => b.type === 'tool_use' && b.name === 'publish_article');
  if (!toolUse) throw new Error('A resposta não incluiu a chamada da ferramenta publish_article.');
  return toolUse.input;
}

function validateArticle(article, { citationUrls, existingSlugs }) {
  const errors = [];

  if (!article.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(article.slug)) {
    errors.push(`slug inválido: ${article.slug}`);
  } else if (existingSlugs.has(article.slug)) {
    errors.push(`slug já existe: ${article.slug}`);
  }

  if (!article.title || article.title.length < 10) errors.push('title ausente ou curto demais');
  if (!article.metaDescription || article.metaDescription.length > 170) errors.push('metaDescription ausente ou longa demais');
  if (!ALLOWED_TAGS.includes(article.tag)) errors.push(`tag inválida: ${article.tag}`);
  if (!ALLOWED_COVER_IMAGES.includes(article.coverImage)) errors.push(`coverImage inválida: ${article.coverImage}`);
  if (!article.coverAlt) errors.push('coverAlt ausente');
  if (!Number.isInteger(article.readTimeMinutes)) errors.push('readTimeMinutes ausente');

  if (!article.bodyHtml || article.bodyHtml.length < 500) {
    errors.push('bodyHtml ausente ou curto demais');
  } else if (/<script|<style|on\w+\s*=|javascript:/i.test(article.bodyHtml)) {
    errors.push('bodyHtml contém tags/atributos não permitidos (possível injeção)');
  }

  if (!Array.isArray(article.faq) || article.faq.length < 3) errors.push('faq precisa ter pelo menos 3 itens');

  if (!Array.isArray(article.sources) || article.sources.length < 2) {
    errors.push('sources precisa ter pelo menos 2 itens');
  } else {
    for (const s of article.sources) {
      if (!s.url || !citationUrls.has(s.url)) {
        errors.push(`fonte citada não veio da pesquisa real (possível URL inventada): ${s?.url}`);
      }
    }
  }

  if (article.bodyHtml) {
    const inlineHrefs = [...article.bodyHtml.matchAll(/href\s*=\s*"([^"]*)"/gi)].map(m => m[1]);
    for (const href of inlineHrefs) {
      if (!citationUrls.has(href)) {
        errors.push(`link inline no corpo do artigo não é uma URL de fonte real da pesquisa (possível URL inventada): ${href}`);
      }
    }
  }

  if (errors.length) {
    throw new Error('Validação do artigo falhou:\n- ' + errors.join('\n- '));
  }
}

async function main() {
  if (!API_KEY) {
    console.error('Erro: variável de ambiente ANTHROPIC_API_KEY não definida.');
    process.exit(1);
  }

  const manifest = readManifest();
  const existingSlugs = new Set(manifest.map(p => p.slug));
  const existingTitles = manifest.map(p => p.title);

  console.log('Pesquisando notícias reais do mercado imobiliário...');
  const { text: researchText, citations } = await research(existingTitles);

  if (citations.length === 0) {
    console.error('Nenhuma fonte real foi retornada pela busca. Abortando sem publicar.');
    process.exit(1);
  }
  console.log(`Encontradas ${citations.length} fontes candidatas.`);

  console.log('Escrevendo o artigo...');
  const article = await writeArticle({ researchText, citations, existingTitles });

  const citationUrls = new Set(citations.map(c => c.url));
  validateArticle(article, { citationUrls, existingSlugs });
  console.log(`Artigo validado: "${article.title}" (slug: ${article.slug})`);

  const datePublished = todayISO();
  const postDir = path.join(ROOT, 'blog', article.slug);
  mkdirSync(postDir, { recursive: true });

  const prevPost = manifest[0] ? { slug: manifest[0].slug, title: manifest[0].title } : null;
  const html = renderPostHtml({
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    tag: article.tag,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt,
    datePublished,
    readTimeMinutes: article.readTimeMinutes,
    bodyHtml: article.bodyHtml,
    faq: article.faq,
    sources: article.sources,
    otherPosts: prevPost ? [prevPost, null] : [],
  });

  writeFileSync(path.join(postDir, 'index.html'), html, 'utf8');

  manifest.unshift({
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    tag: article.tag,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt,
    datePublished,
    readTimeMinutes: article.readTimeMinutes,
  });
  writeManifest(manifest);
  rebuildAll(manifest);

  console.log(`Publicado: blog/${article.slug}/`);

  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `slug=${article.slug}\ntitle=${article.title}\n`, { flag: 'a' });
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
