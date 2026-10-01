import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createStaticServer } from '../scripts/serve.mjs';

describe('servidor estático', () => {
  let server;
  let origin;
  before(async () => {
    server = createStaticServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    origin = `http://127.0.0.1:${server.address().port}`;
  });
  after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); });
  it('serve interface e módulos com MIME correto', async () => {
    const html = await fetch(`${origin}/`);
    assert.equal(html.status, 200);
    assert.match(await html.text(), /OmniCalc/);
    const js = await fetch(`${origin}/src/ui/app.js`);
    assert.match(js.headers.get('content-type'), /text\/javascript/);
    assert.match(js.headers.get('content-security-policy'), /object-src 'none'/);
    assert.equal(js.status, 200);
  });
  it('HEAD mantém cabeçalhos sem corpo', async () => {
    const response = await fetch(`${origin}/`, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.ok(Number(response.headers.get('content-length')) > 0);
    assert.equal(await response.text(), '');
  });
  it('bloqueia arquivos internos, métodos indevidos e caminhos codificados', async () => {
    for (const name of ['/package.json', '/.git/config', '/prompts/sessoes/README.md', '/SPEC/2026-09-30-interface.md', '/src/%2e%2e%2fpackage.json', '/src/no-such-file.js']) {
      const response = await fetch(`${origin}${name}`);
      assert.notEqual(response.status, 200, name);
    }
    assert.equal((await fetch(`${origin}/`, { method: 'POST' })).status, 405);
    assert.equal((await fetch(`${origin}/src/%zz`)).status, 400);
  });
});
