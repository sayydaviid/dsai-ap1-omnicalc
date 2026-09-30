import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const name of ['index.html', 'favicon.svg', 'src']) {
  await cp(path.join(root, name), path.join(dist, name), { recursive: true });
}
// Cache somente para módulos e estilos. Histórico/prefs não são enviados ao servidor.
await writeFile(path.join(dist, '_headers'),
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\n");
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!html.includes('./src/ui/app.js')) throw new Error('Build sem entrada da aplicação.');
console.log('Build estático criado em dist/. Use npm run preview para abrir localmente.');
