import assert from 'node:assert/strict';

export function close(actual, expected, relative = 2e-10, absolute = 2e-9) {
  assert.ok(Number.isFinite(actual), `Resultado não finito: ${actual}`);
  const tolerance = Math.max(absolute, relative * Math.max(Math.abs(actual), Math.abs(expected)));
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `${actual} != ${expected} (tolerância ${tolerance})`);
}
