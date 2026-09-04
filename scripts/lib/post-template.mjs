// Renderiza o HTML de um post de blog e do card de listagem, reaproveitando
// exatamente a estrutura (nav, footer, cursor, whatsapp float, scripts) dos
// posts escritos manualmente em blog/*/index.html.

const WHATSAPP_HREF =
  'https://wa.me/556195006618?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20o%20diagn%C3%B3stico%20gratuito%20do%20meu%20marketing%20digital%20imobili%C3%A1rio.';

const WHATSAPP_ICON_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>`;

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function headBlock({ title, description, canonicalUrl, ogImage, jsonLd, ogType = 'article' }) {
  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- ═══ SEO primário ═══ -->
  <title>${escapeHtml(title)} | IMOBIL</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="author" content="IMOBIL Marketing Imobiliário" />
  <meta name="theme-color" content="#13100B" />
  <meta name="geo.region" content="BR-DF" />
  <meta name="geo.placename" content="Brasília" />

  <!-- ═══ Open Graph ═══ -->
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="IMOBIL Marketing Imobiliário" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />

  <!-- ═══ Twitter Card ═══ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />
  <link rel="stylesheet" href="/style.css" />

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18193501352"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18193501352');
  </script>

  <!-- ═══ Dados estruturados (Schema.org) ═══ -->
  <script type="application/ld+json">
  ${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>`;
}

function navBlock() {
  return `<nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo" aria-label="IMOBIL Home">
        <svg viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">
          <rect x="0"  y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
          <rect x="13" y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
          <rect x="26" y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
          <rect x="13" y="13" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
          <rect x="26" y="13" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
          <rect x="26" y="0"  width="10" height="10" fill="#DDC095" rx="1.5"/>
        </svg>
        <span class="nav-wordmark">IMOBIL</span>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="/#sobre" class="nav-link">Sobre</a></li>
        <li><a href="/#clientes" class="nav-link">Clientes</a></li>
        <li><a href="/#solucao" class="nav-link">Solução</a></li>
        <li><a href="/#servicos" class="nav-link">Serviços</a></li>
        <li><a href="/#resultados" class="nav-link">Resultados</a></li>
        <li><a href="/#diferenciais" class="nav-link">Diferenciais</a></li>
        <li><a href="/blog/" class="nav-link">Blog</a></li>
      </ul>
      <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" class="btn btn-nav" onclick="gtag_report_conversion()">Falar agora</a>
      <button class="nav-hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

function cursorAndWhatsappBlock() {
  return `<!-- Custom cursor -->
  <div class="cursor" id="cursor"></div>
  <div class="cursor-trail" id="cursorTrail"></div>

  <!-- WhatsApp floating button -->
  <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Falar pelo WhatsApp" onclick="gtag_report_conversion()">
    ${WHATSAPP_ICON_SVG}
    <span class="wf-pulse"></span>
  </a>`;
}

function footerBlock() {
  return `<footer class="footer" id="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="IMOBIL">
            <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
              <rect x="0"  y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
              <rect x="13" y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
              <rect x="26" y="26" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
              <rect x="13" y="13" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
              <rect x="26" y="13" width="10" height="10" fill="#FFFFFF" rx="1.5"/>
              <rect x="26" y="0"  width="10" height="10" fill="#DDC095" rx="1.5"/>
            </svg>
            <span class="footer-wordmark">IMOBIL</span>
          </a>
          <p class="footer-tagline">Marketing que move o<br>mercado imobiliário.</p>
          <p class="footer-tagline">Sede em Brasília – DF.<br>Atendimento em todo o Brasil.</p>
        </div>
        <div class="footer-nav">
          <h4 class="footer-nav-title">Navegação</h4>
          <ul>
            <li><a href="/#sobre">Sobre</a></li>
            <li><a href="/#clientes">Clientes</a></li>
            <li><a href="/#solucao">Solução</a></li>
            <li><a href="/#servicos">Serviços</a></li>
            <li><a href="/#resultados">Resultados</a></li>
            <li><a href="/#diferenciais">Diferenciais</a></li>
            <li><a href="/#faq">Perguntas frequentes</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4 class="footer-nav-title">Contato</h4>
          <ul>
            <li>
              <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" onclick="gtag_report_conversion()">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                +55 61 9500-6618
              </a>
            </li>
            <li>
              <a href="mailto:imobilmkt@gmail.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                imobilmkt@gmail.com
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/imobilmkt" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @imobilmkt
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 IMOBIL Marketing Imobiliário. Todos os direitos reservados.</p>
        <p class="footer-tagline-bottom">Marketing que move o mercado imobiliário.</p>
      </div>
    </div>
  </footer>

  <script src="/script.js" defer></script>
  <script>
    function gtag_report_conversion() {
      gtag('event', 'conversion', {
        'send_to': 'AW-18193501352/xTPTCKTsyLQcEKiZq-ND',
        'value': 1.0,
        'currency': 'BRL',
        'transport_type': 'beacon'
      });
      return true;
    }
  </script>`;
}

/**
 * @param {object} p
 * @param {string} p.slug
 * @param {string} p.title
 * @param {string} p.metaDescription
 * @param {string} p.tag - Corretores | Construtoras | Arquitetos | Mercado
 * @param {string} p.coverImage - filename inside /img/
 * @param {string} p.coverAlt
 * @param {string} p.datePublished - YYYY-MM-DD
 * @param {number} p.readTimeMinutes
 * @param {string} p.bodyHtml - HTML do corpo do artigo (h2/h3/p/ul/li/strong/a)
 * @param {{question:string, answer:string}[]} p.faq
 * @param {{title:string, publisher:string, url:string}[]} p.sources
 * @param {{slug:string,title:string}[]} p.otherPosts - para os links de navegação entre posts
 */
export function renderPostHtml(p) {
  const canonicalUrl = `https://www.imobilmkt.com.br/blog/${p.slug}/`;
  const ogImage = `https://www.imobilmkt.com.br/img/${p.coverImage}`;
  const dateLabel = new Date(p.datePublished + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

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
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        headline: p.title,
        description: p.metaDescription,
        image: ogImage,
        datePublished: p.datePublished,
        dateModified: p.datePublished,
        inLanguage: 'pt-BR',
        articleSection: p.tag,
        author: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        publisher: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        mainEntityOfPage: canonicalUrl,
        citation: p.sources.map(s => ({ '@type': 'WebPage', name: s.title, url: s.url })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.imobilmkt.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.imobilmkt.com.br/blog/' },
          { '@type': 'ListItem', position: 3, name: p.title, item: canonicalUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  const faqHtml = p.faq.map(f => `
        <details class="faq-item reveal">
          <summary class="faq-question">${escapeHtml(f.question)}</summary>
          <div class="faq-answer">
            <p>${f.answer}</p>
          </div>
        </details>`).join('\n');

  const sourcesHtml = p.sources.map(s => `
        <li><a href="${s.url}" target="_blank" rel="noopener nofollow">${escapeHtml(s.title)}</a> — ${escapeHtml(s.publisher)}</li>`).join('\n');

  const prevPost = p.otherPosts?.[0];
  const nextPost = p.otherPosts?.[1];

  return `<!DOCTYPE html>
<html lang="pt-BR">
${headBlock({ title: p.title, description: p.metaDescription, canonicalUrl, ogImage, jsonLd })}
<body>

  ${cursorAndWhatsappBlock()}

  <!-- ═══════════════════════ NAVBAR ═══════════════════════ -->
  ${navBlock()}

  <!-- ═══════════════════════ ARTIGO ═══════════════════════ -->
  <section class="article-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="breadcrumb">
        <a href="/">Início</a> <span class="bc-sep">/</span>
        <a href="/blog/">Blog</a> <span class="bc-sep">/</span>
        <span class="bc-current">${escapeHtml(p.title)}</span>
      </nav>
      <span class="post-tag">${escapeHtml(p.tag)}</span>
      <h1 class="article-title" style="margin-top:20px;">${escapeHtml(p.title)}</h1>
      <div class="article-meta">
        <span>IMOBIL Marketing Imobiliário</span>
        <span class="am-dot"></span>
        <span>${dateLabel}</span>
        <span class="am-dot"></span>
        <span>${p.readTimeMinutes} min de leitura</span>
      </div>
      <div class="article-cover">
        <img src="/img/${p.coverImage}" alt="${escapeHtml(p.coverAlt)}" loading="eager" width="1200" height="600">
      </div>
    </div>
  </section>

  <section class="container">
    <article class="article-body">

      ${p.bodyHtml}

      <div class="article-cta-box reveal">
        <p>Quer aplicar isso no marketing digital da sua imobiliária, construtora ou escritório?</p>
        <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" class="btn btn-primary" onclick="gtag_report_conversion()">
          Falar com um especialista <span class="btn-arrow">→</span>
        </a>
      </div>

      <h2>Perguntas frequentes</h2>
      <div class="faq-list article-faq">${faqHtml}
      </div>

      <h2>Fontes</h2>
      <ul class="article-sources">${sourcesHtml}
      </ul>

    </article>

    <div class="article-nav-links">
      ${prevPost ? `<a href="/blog/${prevPost.slug}/">← ${escapeHtml(prevPost.title)}</a>` : '<a href="/blog/">← Voltar para o blog</a>'}
      ${nextPost ? `<a href="/blog/${nextPost.slug}/">${escapeHtml(nextPost.title)} →</a>` : '<a href="/blog/">Voltar para o blog →</a>'}
    </div>
  </section>

  <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
  ${footerBlock()}
</body>
</html>
`;
}

/**
 * Regenera a página de listagem /blog/ inteira a partir do manifesto de posts
 * (blog/posts.json). Mais seguro do que remendar HTML a cada execução
 * automatizada.
 * @param {object[]} posts - manifesto completo, mais novo primeiro
 */
export function renderBlogIndexHtml(posts) {
  const canonicalUrl = 'https://www.imobilmkt.com.br/blog/';
  const ogImage = 'https://www.imobilmkt.com.br/img/hero-predio.jpg';
  const title = 'Blog | Marketing Imobiliário para Imobiliárias, Construtoras e Arquitetos';
  const description = 'Artigos sobre marketing digital para o mercado imobiliário: geração de leads para corretores, lançamento de empreendimentos para construtoras e presença online para arquitetos.';

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
        '@type': 'Blog',
        '@id': `${canonicalUrl}#blog`,
        url: canonicalUrl,
        name: 'Blog IMOBIL — Marketing Imobiliário',
        description,
        inLanguage: 'pt-BR',
        publisher: { '@id': 'https://www.imobilmkt.com.br/#organization' },
        blogPost: posts.map(p => ({ '@id': `https://www.imobilmkt.com.br/blog/${p.slug}/#article` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.imobilmkt.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
        ],
      },
    ],
  };

  const cardsHtml = posts.map((post, i) => renderCardHtml(post, i)).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
${headBlock({ title, description, canonicalUrl, ogImage, jsonLd, ogType: 'website' })}
<body>

  ${cursorAndWhatsappBlock()}

  <!-- ═══════════════════════ NAVBAR ═══════════════════════ -->
  ${navBlock()}

  <!-- ═══════════════════════ BLOG HERO ═══════════════════════ -->
  <section class="blog-hero">
    <div class="container">
      <div class="section-label reveal">
        <span class="sl-num">Blog</span>
        <span class="sl-bar"></span>
        <span class="sl-text">Marketing imobiliário</span>
      </div>
      <h1 class="section-title reveal reveal-delay-1">
        Conteúdo para quem vive do <span class="accent-word">mercado imobiliário</span>.
      </h1>
      <p class="blog-hero-sub reveal reveal-delay-2">
        Artigos práticos sobre geração de leads, lançamento de empreendimentos e presença digital para corretores, imobiliárias, construtoras, incorporadoras e escritórios de arquitetura.
      </p>
    </div>
  </section>

  <!-- ═══════════════════════ GRID DE POSTS ═══════════════════════ -->
  <section class="container">
    <div class="blog-grid">
${cardsHtml}    </div>
  </section>

  <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
  ${footerBlock()}
</body>
</html>
`;
}

export function renderCardHtml(p, index = 0) {
  const delayClass = index > 0 && index <= 3 ? ` reveal-delay-${index}` : '';
  return `      <a href="/blog/${p.slug}/" class="post-card reveal${delayClass}">
        <div class="post-card-img">
          <img src="/img/${p.coverImage}" alt="${escapeHtml(p.coverAlt)}" loading="lazy" width="800" height="500">
        </div>
        <div class="post-card-body">
          <span class="post-tag">${escapeHtml(p.tag)}</span>
          <h2 class="post-card-title">${escapeHtml(p.title)}</h2>
          <p class="post-card-desc">${escapeHtml(p.metaDescription)}</p>
          <span class="post-card-arrow">Ler artigo <span class="btn-arrow">→</span></span>
        </div>
      </a>
`;
}
