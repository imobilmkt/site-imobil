# Home / páginas por público — `build-pages.mjs`

O site tem 3 versões da home, todas com o mesmo design e seções, mas com
hero e SEO diferentes por público:

- `index.html` — home genérica (corretores + imobiliárias + construtoras)
- `corretores/index.html` — foco em corretor de imóveis autônomo
- `imobiliarias/index.html` — foco em imobiliária/construtora

As 3 são **geradas**, não editadas à mão. A fonte da verdade é:

- `templates/page.template.html` — o HTML completo do site, com
  `__PLACEHOLDERS__` no lugar do hero, da seção "Problema" e das tags de SEO
  (title, meta description, OG, Twitter, JSON-LD). Qualquer mudança em nav,
  serviços, FAQ, footer etc. deve ser feita **aqui**.
- `lib/pages-data.mjs` — o texto de cada placeholder, uma entrada por página
  (home / corretores / imobiliarias).

Depois de editar qualquer um dos dois, rode:

```bash
node scripts/build-pages.mjs
```

Isso regrava `index.html`, `corretores/index.html`, `imobiliarias/index.html`
e o bloco `HOME PAGES` em `sitemap.xml` (canonical de cada página, para não
gerar aviso de conteúdo duplicado no Search Console). Revise com `git diff`
antes de dar commit/push.

---

# Blog automatizado — geração semanal de posts

Linha editorial: todo artigo é um conteúdo de **boas práticas de marketing
digital para imobiliárias e corretores** — a notícia/dado real é só o gancho,
o foco é sempre "o que fazer agora no digital" (site, SEO local, anúncios,
redes sociais, CRM/atendimento de leads, WhatsApp etc.), não um resumo de
notícia. Essa instrução está no prompt de `writeArticle()` em
`generate-weekly-post.mjs`.

Todo post (novo ou já publicado) tem dois CTAs para WhatsApp dentro do corpo:
um `.article-inline-cta` ("Diagnóstico gratuito") inserido automaticamente
no meio do artigo — por `insertMidArticleCta()` em `lib/post-template.mjs`,
antes de um `<h2>` perto da metade — e o `.article-cta-box` ("Falar com um
especialista") de sempre, no fim do corpo. Não peça para a IA incluir CTA no
`bodyHtml`; os dois são adicionados depois, pelo template.

Toda segunda-feira (13:00 UTC / 10:00 em Brasília), o workflow
`.github/workflows/weekly-blog-post.yml` roda sozinho e:

1. Pesquisa notícias reais e recentes do mercado imobiliário brasileiro
   (busca na web via Claude, não "memória" do modelo).
2. Escreve um artigo novo conectando essa notícia a uma implicação prática
   para corretores, construtoras/incorporadoras ou arquitetos.
3. Cita as fontes reais encontradas, com link.
4. Publica direto: escreve o arquivo do post, atualiza a listagem do blog,
   `sitemap.xml` e `llms.txt`, e dá commit + push em `main` — **sem revisão
   humana**, conforme pedido.

## Rede de segurança (mesmo sem humano no loop)

Como não há aprovação manual, o script `generate-weekly-post.mjs` só publica
se passar em todas estas checagens; se qualquer uma falhar, ele encerra com
erro e **nada é publicado**:

- Toda fonte citada no artigo precisa ter uma URL que veio literalmente da
  busca real (não pode ser uma URL inventada pelo modelo).
- Pelo menos 2 fontes, pelo menos 3 perguntas de FAQ.
- `slug` não pode colidir com um post já existente.
- O corpo do artigo é rejeitado se contiver `<script>`, `<style>`,
  atributos `on*` ou `javascript:` (proteção contra injeção).

Isso reduz o risco de publicar uma notícia mal interpretada ou uma fonte
inventada, mas **não substitui revisão humana** — vale checar o blog de vez
em quando.

## Configuração necessária (fazer uma vez)

Adicionar a secret do repositório no GitHub (Settings → Secrets and
variables → Actions → New repository secret):

```
ANTHROPIC_API_KEY = sk-ant-...
```

Sem essa secret, o workflow falha imediatamente (o script recusa rodar sem
a chave).

## Rodar manualmente

- Pelo GitHub: aba **Actions** → "Publicar post semanal no blog" → **Run workflow**.
- Localmente (não publica no GitHub, só gera os arquivos):
  ```bash
  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-weekly-post.mjs
  ```
  Depois é só revisar com `git diff` e, se quiser, `git commit`/`git push` você mesmo.

## Arquivos

- `generate-weekly-post.mjs` — pesquisa, escreve, valida e publica um post.
- `rebuild-blog-index.mjs` — regenera `blog/index.html`, o bloco de blog em
  `sitemap.xml` e a seção `## Blog` de `llms.txt` a partir de
  `blog/posts.json`. Pode ser rodado sozinho (`node scripts/rebuild-blog-index.mjs`)
  se você editar `posts.json` na mão.
- `lib/post-template.mjs` — o HTML de cada post e da listagem é gerado por
  aqui, reaproveitando o mesmo design (nav, footer, cores, FAQ) do resto do
  site. Se o design do site mudar (nova seção no nav, novo footer), atualize
  este arquivo — os posts antigos não são re-renderizados automaticamente.
- `blog/posts.json` — o "banco de dados" dos posts (título, slug, tag,
  imagem de capa, data). É a fonte da verdade para a listagem/sitemap/llms.txt.

## Ajustar a cadência

Trocar o `cron` em `.github/workflows/weekly-blog-post.yml`. Formato
`min hora dia-do-mês mês dia-da-semana`, sempre em UTC.

## Se um dia quiser adicionar um checkpoint humano

Trocar o job final de "commit + push direto" por "abrir um Pull Request"
(`peter-evans/create-pull-request`, por exemplo) em vez de dar push em
`main`. Isso dá um ponto de aprovação de poucos segundos sem perder a
automação das etapas de pesquisa/redação/validação.
