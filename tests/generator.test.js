import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function normalizeNewlines(value) {
  return value?.replace(/\r\n/g, '\n');
}

describe('determinismo de geração e tolerância a CRLF/LF', () => {
  it('trata finais de linha CRLF (Windows) e LF (Unix) como equivalentes', () => {
    const textUnix = 'line1\nline2\nline3\n';
    const textWindows = 'line1\r\nline2\r\nline3\r\n';
    const textMixed = 'line1\r\nline2\nline3\r\n';

    assert.equal(normalizeNewlines(textWindows), normalizeNewlines(textUnix));
    assert.equal(normalizeNewlines(textMixed), normalizeNewlines(textUnix));
  });

  it('detecta alterações reais no conteúdo independente do tipo de final de linha', () => {
    const originalLF = 'export const value = 42;\n';
    const originalCRLF = 'export const value = 42;\r\n';
    const modifiedLF = 'export const value = 43;\n';
    const modifiedCRLF = 'export const value = 43;\r\n';

    assert.equal(normalizeNewlines(originalCRLF), normalizeNewlines(originalLF));
    assert.notEqual(normalizeNewlines(modifiedLF), normalizeNewlines(originalLF));
    assert.notEqual(normalizeNewlines(modifiedCRLF), normalizeNewlines(originalLF));
    assert.notEqual(normalizeNewlines(modifiedCRLF), normalizeNewlines(originalCRLF));
  });

  it('executa scripts/generate.mjs --check e confirma 0 divergências na árvore atual', async () => {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const child = spawn(process.execPath, ['scripts/generate.mjs', '--check'], { cwd: root });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    const code = await new Promise((resolve) => child.on('close', resolve));
    assert.equal(code, 0, `check:generated falhou:\n${stderr}`);
    assert.match(stdout, /0 arquivos divergentes/);
  });
});
