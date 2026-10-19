// Gera as páginas de case em /cases/ a partir de scripts/lib/cases-data.mjs,
// e atualiza os blocos marcados CASES:START/END em sitemap.xml e llms.txt.
// Rodar com: node scripts/build-cases.mjs

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cases } from './lib/cases-data.mjs';
import { renderCaseHtml, renderCasesIndexHtml } from './lib/case-template.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function writeCasePages() {
  for (const c of cases) {
    const dir = join(ROOT, 'cases', c.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), renderCaseHtml(c), 'utf8');
  }
  writeFileSync(join(ROOT, 'cases', 'index.html'), renderCasesIndexHtml(cases), 'utf8');
}

function rebuildSitemap() {
  const sitemapPath = join(ROOT, 'sitemap.xml');
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    `  <url>\n    <loc>https://www.imobilmkt.com.br/cases/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    ...cases.map((c) => `  <url>\n    <loc>https://www.imobilmkt.com.br/cases/${c.slug}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`),
  ].join('\n');

  const block = `<!-- CASES:START (gerado automaticamente por scripts/build-cases.mjs — não editar à mão) -->\n${urls}\n  <!-- CASES:END -->`;

  const hasBlock = /<!-- CASES:START[\s\S]*?CASES:END -->/.test(sitemap);
  const updated = hasBlock
    ? sitemap.replace(/<!-- CASES:START[\s\S]*?CASES:END -->/, block)
    : sitemap.replace('</urlset>', `  ${block}\n</urlset>`);

  writeFileSync(sitemapPath, updated, 'utf8');
}

function rebuildLlms() {
  const llmsPath = join(ROOT, 'llms.txt');
  const llms = readFileSync(llmsPath, 'utf8');

  const list = cases.map((c) => `- [${c.name}](https://www.imobilmkt.com.br/cases/${c.slug}/) — ${c.segmentLabel}, ${c.location}. ${c.about}`).join('\n');
  const block = `<!-- CASES:START (gerado automaticamente por scripts/build-cases.mjs — não editar à mão) -->\n${list}\n<!-- CASES:END -->`;

  const hasBlock = /<!-- CASES:START[\s\S]*?CASES:END -->/.test(llms);
  let updated;
  if (hasBlock) {
    updated = llms.replace(/<!-- CASES:START[\s\S]*?CASES:END -->/, block);
  } else {
    const section = `\n## Cases de sucesso\n\nClientes reais do mercado imobiliário atendidos pela IMOBIL, publicados em https://www.imobilmkt.com.br/cases/:\n\n${block}\n`;
    updated = llms.includes('## Contato')
      ? llms.replace('## Contato', `${section}\n## Contato`)
      : `${llms}\n${section}`;
  }

  writeFileSync(llmsPath, updated, 'utf8');
}

function main() {
  writeCasePages();
  rebuildSitemap();
  rebuildLlms();
  console.log(`OK: ${cases.length} páginas de case geradas em /cases/, sitemap.xml e llms.txt atualizados.`);
}

main();
