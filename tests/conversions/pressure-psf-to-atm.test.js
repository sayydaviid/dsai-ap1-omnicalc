// Gerado; exemplos fixos calculados por oráculo racional no gerador.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, definition, toBase, fromBase } from '../../src/conversions/pressure-psf-to-atm.js';
import { calculate as reverse } from '../../src/conversions/pressure-atm-to-psf.js';
import { close } from '../helpers.js';

describe("pressure-psf-to-atm", () => {
  it('converte um valor unitário com exemplo fixo', () => {
    close(calculate({ value: 1 }).value, 0.00047254141604081756);
  });

  it('converte um valor fracionário com exemplo fixo', () => {
    close(calculate({ value: 12.5 }).value, 0.0059067677005102195);
  });

  it('converte uma quantidade maior com exemplo fixo', () => {
    close(calculate({ value: 1000 }).value, 0.47254141604081756);
  });

  it('preserva o valor na conversão de ida e volta', () => {
    const forward = calculate({ value: 25 });
    close(reverse({ value: forward.value }).value, 25);
  });

  it('expõe resultado intermediário consistente com o resultado final', () => {
    const base = toBase(25);
    close(fromBase(base), calculate({ value: 25 }).value);
  });

  it('identifica corretamente unidades e etapas', () => {
    const result = calculate({ value: 25 });
    assert.equal(definition.id, "pressure-psf-to-atm");
    assert.equal(result.inputUnit, "psf");
    assert.equal(result.unit, "atm");
    assert.equal(result.baseUnit, "Pa");
    assert.equal(result.steps.length, 2);
    assert.equal(result.steps[1].value, result.value);
  });

  it('rejeita entrada ausente, textual ou não finita', () => {
    for (const value of [undefined, null, '25', NaN, Infinity, -Infinity]) {
      assert.throws(() => calculate({ value }), { code: 'INVALID_INPUT' });
    }
    assert.throws(() => calculate(), { code: 'INVALID_INPUT' });
  });

  it('rejeita intermediários não finitos', () => {
    assert.throws(() => fromBase(Infinity), { code: 'INVALID_INPUT' });
    assert.throws(() => toBase(NaN), { code: 'INVALID_INPUT' });
  });

  it("preserva sinal de uma quantidade negativa", () => {
    close(calculate({ value: -25 }).value, -0.011813535401020439);
  });
});
