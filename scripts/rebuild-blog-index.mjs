// Regenera blog/index.html, o bloco de blog em sitemap.xml e a seção "## Blog"
// de llms.txt a partir do manifesto blog/posts.json.
//
// Uso: node scripts/rebuild-blog-index.mjs
//
// Roda sozinho (sem chamar a API) sempre que blog/posts.json muda — inclusive
// chamado no fim de generate-weekly-post.mjs depois de adicionar o post novo.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderBlogIndexHtml } from './lib/post-template.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function readManifest() {
  return JSON.parse(readFileSync(path.join(ROOT, 'blog', 'posts.json'), 'utf8'));
}

export function writeManifest(posts) {
  writeFileSync(path.join(ROOT, 'blog', 'posts.json'), JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

export function rebuildBlogIndex(posts) {
  writeFileSync(path.join(ROOT, 'blog', 'index.html'), renderBlogIndexHtml(posts), 'utf8');
}

export function rebuildSitemap(posts) {
  const file = path.join(ROOT, 'sitemap.xml');
  const xml = readFileSync(file, 'utf8');
  const today = new Date().toISOString().slice(0, 10);

  const blogUrls = [
    `  <url>\n    <loc>https://www.imobilmkt.com.br/blog/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`,
    ...posts.map(p => `  <url>\n    <loc>https://www.imobilmkt.com.br/blog/${p.slug}/</loc>\n    <lastmod>${p.datePublished}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`),
  ].join('\n');

  const block = `<!-- BLOG:START (gerado automaticamente por scripts/rebuild-blog-index.mjs — não editar à mão) -->\n${blogUrls}\n  <!-- BLOG:END -->`;

  const markerRe = /<!-- BLOG:START[\s\S]*?<!-- BLOG:END -->/;
  let next;
  if (markerRe.test(xml)) {
    next = xml.replace(markerRe, block);
  } else {
    next = xml.replace('</urlset>', `  ${block}\n</urlset>`);
  }
  writeFileSync(file, next, 'utf8');
}

export function rebuildLlms(posts) {
  const file = path.join(ROOT, 'llms.txt');
  const txt = readFileSync(file, 'utf8');

  const list = posts
    .map(p => `- [${p.title}](https://www.imobilmkt.com.br/blog/${p.slug}/) — ${p.metaDescription}`)
    .join('\n');

  const block = `<!-- BLOG:START (gerado automaticamente por scripts/rebuild-blog-index.mjs — não editar à mão) -->\n${list}\n<!-- BLOG:END -->`;

  const markerRe = /<!-- BLOG:START[\s\S]*?<!-- BLOG:END -->/;
  let next;
  if (markerRe.test(txt)) {
    next = txt.replace(markerRe, block);
  } else if (/## Blog\n\n/.test(txt)) {
    next = txt.replace('## Blog\n\n', `## Blog\n\n${block}\n\n`);
  } else {
    throw new Error('Não encontrei a seção "## Blog" em llms.txt para inserir a lista.');
  }
  writeFileSync(file, next, 'utf8');
}

export function rebuildAll(posts) {
  rebuildBlogIndex(posts);
  rebuildSitemap(posts);
  rebuildLlms(posts);
}

// Só executa quando chamado diretamente (`node scripts/rebuild-blog-index.mjs`),
// não quando importado por generate-weekly-post.mjs.
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const posts = readManifest();
  rebuildAll(posts);
  console.log(`OK: blog/index.html, sitemap.xml e llms.txt regenerados a partir de ${posts.length} posts.`);
}
