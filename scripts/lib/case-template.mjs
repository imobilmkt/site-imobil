// Renderiza as páginas de case (/cases/) reaproveitando o mesmo chrome
// (head, nav, footer, cursor, whatsapp) dos posts do blog, definido em
// post-template.mjs. Nenhum número de investimento, CPL ou resultado
// financeiro aparece aqui — são dados confidenciais por contrato com cada
// cliente (ver scripts/lib/cases-data.mjs).

import {
  escapeHtml,
  headBlock,
  navBlock,
  cursorAndWhatsappBlock,
  footerBlock,
} from './post-template.mjs';

const WHATSAPP_HREF =
  'https://wa.me/556195006618?text=Ol%C3%A1!%20Quero%20agendar%20uma%20reuni%C3%A3o%20para%20descobrir%20como%20atrair%20mais%20clientes%20com%20marketing%20digital%20imobili%C3%A1rio.';

const CHALLENGE_BY_SEGMENT = [
  {
    match: (s) => /corretor/i.test(s),
    text: 'Corretores autônomos costumam concorrer por atenção dentro dos grandes portais imobiliários e depender muito de indicação para fechar negócio — o que dificulta ter um fluxo previsível de novos contatos todo mês.',
  },
  {
    match: (s) => /imobili[aá]ria/i.test(s),
    text: 'Imobiliárias competem com portais e redes sociais por visibilidade, e nem sempre têm uma operação de tráfego pago estruturada para captar quem já está pesquisando por imóveis na própria região.',
  },
  {
    match: (s) => /construtora|incorporadora/i.test(s),
    text: 'Construtoras e incorporadoras precisam gerar demanda qualificada para cada empreendimento dentro de um prazo específico — o que exige uma operação de tráfego pago estruturada, e não apenas presença orgânica nas redes.',
  },
  {
    match: (s) => /arquitetura/i.test(s),
    text: 'Escritórios de arquitetura costumam ter um portfólio forte no Instagram, mas sem uma presença digital estruturada fora da rede social, boa parte do trabalho fica invisível para quem pesquisa no Google.',
  },
];

function challengeTextFor(segmentLabel) {
  const match = CHALLENGE_BY_SEGMENT.find((c) => c.match(segmentLabel));
  return match ? match.text : 'Negócios do mercado imobiliário costumam ter dificuldade em transformar presença digital em contato qualificado de forma previsível.';
}

function methodStepsFor(focus) {
  const steps = [
    { title: 'Diagnóstico', text: 'análise do negócio, do público-alvo e da concorrência local.' },
    { title: 'Estratégia de tráfego segmentado', text: 'campanhas no Google Ads e/ou Meta Ads direcionadas a quem está pesquisando ativamente por imóveis na região.' },
    { title: 'Landing page de conversão', text: 'página própria otimizada para transformar clique em contato, em vez de depender só de portal ou Instagram.' },
    { title: 'Criação de criativos', text: 'anúncios, textos e peças alinhados ao posicionamento do cliente.' },
    { title: 'Gestão e otimização contínua', text: 'acompanhamento de métricas e ajuste de campanha ao longo do tempo.' },
  ];
  const lastStep = focus === 'marca'
    ? { title: 'Entrega', text: 'fortalecimento de marca e posicionamento digital, em vez de geração direta de leads.' }
    : { title: 'Entrega', text: 'leads qualificados, prontos para negociar.' };
  return [...steps, lastStep];
}

function focusLabel(focus) {
  return focus === 'marca' ? 'Crescimento de marca' : 'Leads qualificados';
}

export function renderCaseHtml(c) {
  const canonicalUrl = `https://www.imobilmkt.com.br/cases/${c.slug}/`;
  const instagramUrl = `https://www.instagram.com/${c.instagramHandle}/`;
  const logoUrl = `https://www.imobilmkt.com.br/img/clientes/${encodeURIComponent(c.logo.file)}`;
  const title = `Case ${c.name}: Método IMB para ${c.segmentLabel.toLowerCase()}`;
  const metaDescription = `Como a IMOBIL aplicou o Método IMB no marketing digital de ${c.name}, ${c.segmentLabel.toLowerCase()} em ${c.location}, com foco em ${focusLabel(c.focus).toLowerCase()}.`;
  const steps = methodStepsFor(c.focus);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.imobilmkt.com.br/#organization',
        name: 'IMOBIL Marketing Imobiliário',
        url: 'https://www.imobilmkt.com.br/',
        logo: 'https://www.imobilmkt.com.br/img/logo-imobil.svg',
      },
      {
        '@type': 'Organization',
        '@id': `${canonicalUrl}#client`,
        name: c.name,
        url: instagramUrl,
        image: logoUrl,
        sameAs: [instagramUrl],
      },
      {
        '@type': 'CreativeWork',
        '@id': `${canonicalUrl}#case`,
        name: title,
        description: metaDescription,
        url: canonicalUrl,
        inLanguage: 'pt-BR',
        about: { '@id': `${canonicalUrl}#client` },
        author: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        creator: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        publisher: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        mainEntityOfPage: canonicalUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.imobilmkt.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Cases', item: 'https://www.imobilmkt.com.br/cases/' },
          { '@type': 'ListItem', position: 3, name: c.name, item: canonicalUrl },
        ],
      },
    ],
  };

  const stepsHtml = steps.map((s, i) => `
        <li class="case-step reveal${i > 0 && i <= 3 ? ` reveal-delay-${i}` : ''}">
          <span class="case-step-num">${i + 1}</span>
          <div>
            <h3>${escapeHtml(s.title)}</h3>
            <p>${escapeHtml(s.text)}</p>
          </div>
        </li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
${headBlock({ title, description: metaDescription, canonicalUrl, ogImage: logoUrl, jsonLd, ogType: 'article' })}
<body>

  ${cursorAndWhatsappBlock()}

  <!-- ═══════════════════════ NAVBAR ═══════════════════════ -->
  ${navBlock()}

  <!-- ═══════════════════════ CASE ═══════════════════════ -->
  <section class="article-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="breadcrumb">
        <a href="/">Início</a> <span class="bc-sep">/</span>
        <a href="/cases/">Cases</a> <span class="bc-sep">/</span>
        <span class="bc-current">${escapeHtml(c.name)}</span>
      </nav>
      <span class="post-tag">${escapeHtml(c.segmentLabel)}</span>
      <h1 class="article-title" style="margin-top:20px;">${escapeHtml(c.name)}</h1>
      <div class="article-meta">
        <span>${escapeHtml(c.location)}</span>
        <span class="am-dot"></span>
        <span>Foco: ${escapeHtml(focusLabel(c.focus))}</span>
      </div>
      <div class="case-logo-wrap">
        <img src="/img/clientes/${encodeURIComponent(c.logo.file)}" alt="${escapeHtml(c.logo.alt)}" loading="eager" width="${c.logo.width}" height="${c.logo.height}">
      </div>
    </div>
  </section>

  <section class="container">
    <article class="article-body">

      <h2>Sobre ${escapeHtml(c.name)}</h2>
      <p>${escapeHtml(c.about)}</p>
      <p><a href="${instagramUrl}" target="_blank" rel="noopener">@${escapeHtml(c.instagramHandle)} no Instagram →</a></p>

      <h2>O desafio do segmento</h2>
      <p>${escapeHtml(challengeTextFor(c.segmentLabel))}</p>

      <h2>O que a IMOBIL fez: Método IMB</h2>
      <p>Para ${escapeHtml(c.name)}, a IMOBIL aplicou o Método IMB, o mesmo processo usado em todos os clientes do setor imobiliário, com foco em ${escapeHtml(focusLabel(c.focus).toLowerCase())}:</p>
      <ol class="case-steps">${stepsHtml}
      </ol>

      <div class="article-cta-box reveal">
        <p>Quer aplicar o Método IMB no marketing digital do seu negócio?</p>
        <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" class="btn btn-primary" onclick="gtag_report_conversion()">
          Falar com um especialista <span class="btn-arrow">→</span>
        </a>
      </div>

    </article>

    <div class="article-nav-links">
      <a href="/cases/">← Ver todos os cases</a>
    </div>
  </section>

  <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
  ${footerBlock()}
</body>
</html>
`;
}

export function renderCaseCardHtml(c, index = 0) {
  const delayClass = index > 0 && index <= 3 ? ` reveal-delay-${index}` : '';
  return `      <a href="/cases/${c.slug}/" class="post-card case-card reveal${delayClass}">
        <div class="case-card-logo">
          <img src="/img/clientes/${encodeURIComponent(c.logo.file)}" alt="${escapeHtml(c.logo.alt)}" loading="lazy" width="${c.logo.width}" height="${c.logo.height}">
        </div>
        <div class="post-card-body">
          <span class="post-tag">${escapeHtml(c.segmentLabel)}</span>
          <h2 class="post-card-title">${escapeHtml(c.name)}</h2>
          <p class="post-card-desc">${escapeHtml(c.location)} · Foco: ${escapeHtml(focusLabel(c.focus))}</p>
          <span class="post-card-arrow">Ver case <span class="btn-arrow">→</span></span>
        </div>
      </a>
`;
}

export function renderCasesIndexHtml(cases) {
  const canonicalUrl = 'https://www.imobilmkt.com.br/cases/';
  const ogImage = 'https://www.imobilmkt.com.br/img/hero-predio.jpg';
  const title = 'Cases de Clientes | Marketing Imobiliário';
  const description = 'Clientes reais atendidos pela IMOBIL no mercado imobiliário: corretores, imobiliárias, construtoras e escritórios de arquitetura, com o Método IMB aplicado em cada um.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.imobilmkt.com.br/#organization',
        name: 'IMOBIL Marketing Imobiliário',
        url: 'https://www.imobilmkt.com.br/',
        logo: 'https://www.imobilmkt.com.br/img/logo-imobil.svg',
      },
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        hasPart: cases.map((c) => ({ '@id': `https://www.imobilmkt.com.br/cases/${c.slug}/#case` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.imobilmkt.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Cases', item: canonicalUrl },
        ],
      },
    ],
  };

  const cardsHtml = cases.map((c, i) => renderCaseCardHtml(c, i)).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
${headBlock({ title, description, canonicalUrl, ogImage, jsonLd, ogType: 'website' })}
<body>

  ${cursorAndWhatsappBlock()}

  <!-- ═══════════════════════ NAVBAR ═══════════════════════ -->
  ${navBlock()}

  <!-- ═══════════════════════ CASES HERO ═══════════════════════ -->
  <section class="blog-hero">
    <div class="container">
      <div class="section-label reveal">
        <span class="sl-num">Cases</span>
        <span class="sl-bar"></span>
        <span class="sl-text">Clientes reais</span>
      </div>
      <h1 class="section-title reveal reveal-delay-1">
        Clientes reais do <span class="accent-word">mercado imobiliário</span>.
      </h1>
      <p class="blog-hero-sub reveal reveal-delay-2">
        Corretores, imobiliárias, construtoras e escritórios de arquitetura que aplicaram o Método IMB no marketing digital do próprio negócio.
      </p>
    </div>
  </section>

  <!-- ═══════════════════════ GRID DE CASES ═══════════════════════ -->
  <section class="container">
    <div class="blog-grid case-grid">
${cardsHtml}    </div>
  </section>

  <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
  ${footerBlock()}
</body>
</html>
`;
}
