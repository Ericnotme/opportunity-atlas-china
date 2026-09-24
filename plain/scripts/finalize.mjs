import { copyFileSync, mkdirSync } from 'node:fs';
for (const route of ['compare', 'rankings', 'methodology', 'improv']) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${route}/index.html`);
}
copyFileSync('dist/index.html', 'dist/404.html');
