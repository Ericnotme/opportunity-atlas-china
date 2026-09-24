import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
for (const route of ['compare', 'rankings', 'methodology', 'improv', 'nextmove']) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${route}/index.html`);
}
const nextTitle = '下一手 · 你还没点，我先猜。';
const nextDescription = '四次直觉选择，一个提前封好的预判，一招带回现实。每天换场景的免费小游戏，猜错也认账。';
const nextHtml = readFileSync('dist/index.html', 'utf8')
  .replace(/<title>.*?<\/title>/, `<title>${nextTitle}</title>`)
  .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*/g, `$1${nextDescription}`)
  .replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*/g, `$1${nextTitle}`)
  .replace(/<meta (?:property="og:image"|name="twitter:image")[^>]*>/g, '')
  .replace('content="summary_large_image"', 'content="summary"');
writeFileSync('dist/nextmove/index.html', nextHtml);
copyFileSync('dist/index.html', 'dist/404.html');
