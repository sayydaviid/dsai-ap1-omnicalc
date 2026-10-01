import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

export function createStaticServer(root = projectRoot) {
  return http.createServer(async (request, response) => {
    const send = (status, text) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : text);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      send(405, 'Método não permitido.');
      return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { send(400, 'Caminho inválido.'); return; }
    if (pathname === '/') pathname = '/index.html';
    if (!['/index.html', '/favicon.svg'].includes(pathname) && !pathname.startsWith('/src/')) {
      send(404, 'Arquivo não encontrado.'); return;
    }
    if (pathname.includes('\\') || pathname.includes('\0')) {
      send(400, 'Caminho inválido.'); return;
    }
    const filename = path.resolve(root, `.${pathname}`);
    const rootPrefix = path.resolve(root) + path.sep;
    if (!filename.startsWith(rootPrefix)) { send(403, 'Acesso negado.'); return; }
    // Revalidar após resolver ../ codificado; não basta conferir a URL original.
    const relative = path.relative(root, filename).split(path.sep).join('/');
    if (!['index.html', 'favicon.svg'].includes(relative) && !relative.startsWith('src/')) {
      send(403, 'Acesso negado.'); return;
    }
    if (!types[path.extname(filename)]) { send(404, 'Arquivo não encontrado.'); return; }
    try {
      const canonical = await realpath(filename);
      const canonicalRoot = (await realpath(root)) + path.sep;
      if (!canonical.startsWith(canonicalRoot) || !(await stat(canonical)).isFile()) {
        send(403, 'Acesso negado.'); return;
      }
      const content = await readFile(canonical);
      response.writeHead(200, {
        'Content-Type': `${types[path.extname(filename)]}; charset=utf-8`,
        'Content-Length': content.length,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch { send(404, 'Arquivo não encontrado.'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv.includes('--dist') ? path.join(projectRoot, 'dist') : projectRoot;
  const port = Number(process.env.PORT || 5173);
  const server = createStaticServer(root);
  server.on('error', (error) => {
    console.error(error.code === 'EADDRINUSE' ? `Porta ${port} em uso. Feche a outra instância ou configure PORT.` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}`;
    console.log(`\nOmniCalc pronto em ${url}\nDeixe este terminal aberto. Ctrl+C encerra.\n`);
    if (process.argv.includes('--open')) {
      const command = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
      const browser = spawn(command, args, { detached: true, stdio: 'ignore' });
      browser.on('error', () => console.log(`Abra manualmente: ${url}`));
      browser.unref();
    }
  });
}
