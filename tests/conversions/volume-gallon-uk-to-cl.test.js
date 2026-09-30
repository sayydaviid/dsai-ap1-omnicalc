// Gerado; exemplos fixos calculados por oráculo racional no gerador.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, definition, toBase, fromBase } from '../../src/conversions/volume-gallon-uk-to-cl.js';
import { calculate as reverse } from '../../src/conversions/volume-cl-to-gallon-uk.js';
import { close } from '../helpers.js';

describe("volume-gallon-uk-to-cl", () => {
  it('converte um valor unitário com exemplo fixo', () => {
    close(calculate({ value: 1 }).value, 454.609);
  });

  it('converte um valor fracionário com exemplo fixo', () => {
    close(calculate({ value: 12.5 }).value, 5682.6125);
  });

  it('converte uma quantidade maior com exemplo fixo', () => {
    close(calculate({ value: 1000 }).value, 454609);
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
    assert.equal(definition.id, "volume-gallon-uk-to-cl");
    assert.equal(result.inputUnit, "gal imp");
    assert.equal(result.unit, "cL");
    assert.equal(result.baseUnit, "m³");
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
    close(calculate({ value: -25 }).value, -11365.225);
  });
});
