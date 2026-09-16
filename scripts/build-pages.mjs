// Gera index.html, corretores/index.html e imobiliarias/index.html a partir de
// templates/page.template.html + scripts/lib/pages-data.mjs.
//
// Uso: node scripts/build-pages.mjs
//
// As 3 páginas compartilham 100% do HTML (nav, seções, footer, script.js) e só
// diferem no hero, na seção "Problema" e nas tags de SEO — para editar qualquer
// outra parte do site (serviços, FAQ, footer etc.), edite o template, nunca os
// arquivos gerados diretamente.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from './lib/pages-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'page.template.html');

function renderCrossLinks(current) {
  return pages
    .filter(p => p.slug !== current.slug)
    .map(p => `            <li><a href="/${p.slug}${p.slug ? '/' : ''}">${p.navLabel}</a></li>`)
    .join('\n');
}

function renderPage(template, page) {
  const replacements = {
    __TITLE__: page.title,
    __META_DESCRIPTION__: page.metaDescription,
    __CANONICAL__: page.canonical,
    __OG_TITLE__: page.ogTitle,
    __OG_DESCRIPTION__: page.ogDescription,
    __TWITTER_TITLE__: page.twitterTitle,
    __TWITTER_DESCRIPTION__: page.twitterDescription,
    __HERO_EYEBROW__: page.heroEyebrow,
    __HERO_H1__: page.heroH1,
    __HERO_SUB__: page.heroSub,
    __PROBLEMA_HEADLINE__: page.problemaHeadline,
    __PROBLEMA_BODY__: page.problemaBody,
    __CROSS_LINKS__: renderCrossLinks(page),
  };

  let html = template;
  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }
  return html;
}

function buildPages() {
  const template = readFileSync(TEMPLATE_PATH, 'utf8');

  for (const page of pages) {
    const html = renderPage(template, page);
    const outPath = path.join(ROOT, page.outFile);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
  }
}

function rebuildSitemap() {
  const file = path.join(ROOT, 'sitemap.xml');
  const xml = readFileSync(file, 'utf8');
  const eol = xml.includes('\r\n') ? '\r\n' : '\n';
  const today = new Date().toISOString().slice(0, 10);

  const urls = pages
    .map(p => `  <url>${eol}    <loc>${p.canonical}</loc>${eol}    <lastmod>${today}</lastmod>${eol}    <changefreq>monthly</changefreq>${eol}    <priority>${p.slug ? '0.9' : '1.0'}</priority>${eol}  </url>`)
    .join(eol);

  const block = `<!-- HOME PAGES:START (gerado automaticamente por scripts/build-pages.mjs — não editar à mão) -->${eol}${urls}${eol}  <!-- HOME PAGES:END -->`;

  const markerRe = /<!-- HOME PAGES:START[\s\S]*?<!-- HOME PAGES:END -->/;
  const homeUrlRe = /  <url>\r?\n\s*<loc>https:\/\/www\.imobilmkt\.com\.br\/<\/loc>[\s\S]*?<\/url>\r?\n/;

  let next;
  if (markerRe.test(xml)) {
    next = xml.replace(markerRe, block);
  } else if (homeUrlRe.test(xml)) {
    // Primeira execução: substitui a entrada estática da home pelo bloco gerado.
    next = xml.replace(homeUrlRe, `  ${block}${eol}`);
  } else {
    throw new Error('Não encontrei a entrada da home nem o bloco HOME PAGES em sitemap.xml.');
  }
  writeFileSync(file, next, 'utf8');
}

buildPages();
rebuildSitemap();
console.log(`OK: ${pages.length} páginas geradas a partir de templates/page.template.html e sitemap.xml atualizado.`);
