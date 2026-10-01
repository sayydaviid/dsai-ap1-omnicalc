import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { close } from './helpers.js';
import { dimensions, enumerateConversions } from '../src/catalog/units.js';
import { calculators, loadCalculator, searchCalculators } from '../src/catalog/registry.js';
import { parseNumber, parseList, formatNumber } from '../src/core/numbers.js';

describe('catálogo e exemplos de referência independentes', () => {
  it('contém exatamente os pares direcionais esperados, sem IDs duplicados', () => {
    const expected = dimensions.reduce((total, item) => total + item.units.length * (item.units.length - 1), 0);
    assert.equal(enumerateConversions().length, expected);
    assert.equal(new Set(calculators.map((item) => item.id)).size, calculators.length);
    assert.ok(expected >= 1000);
  });
  const examples = [
    ['length-inch-to-cm', 1, 2.54],
    ['length-mile-to-km', 1, 1.609344],
    ['length-nautical-mile-to-m', 1, 1852],
    ['area-acre-to-m2', 1, 4046.8564224],
    ['volume-gallon-us-to-l', 1, 3.785411784],
    ['volume-gallon-uk-to-l', 1, 4.54609],
    ['mass-pound-to-kg', 1, 0.45359237],
    ['time-hour-to-min', 2, 120],
    ['speed-km-hour-to-m-s', 36, 10],
    ['pressure-atm-to-pa', 1, 101325],
    ['energy-kwh-to-j', 1, 3600000],
    ['energy-cal-to-j', 1, 4.184],
    ['power-cv-to-w', 1, 735.49875],
    ['force-kgf-to-n', 1, 9.80665],
    ['frequency-rpm-to-hz', 60, 1],
    ['angle-turn-to-degree', 1, 360],
    ['data-mb-to-byte', 1, 1000000],
    ['data-mib-to-byte', 1, 1048576],
    ['data-byte-to-bit', 1, 8],
    ['temperature-celsius-to-fahrenheit', 0, 32],
    ['temperature-celsius-to-fahrenheit', 100, 212],
    ['temperature-fahrenheit-to-celsius', -40, -40],
    ['temperature-celsius-to-kelvin', -273.15, 0],
    ['temperature-fahrenheit-to-kelvin', -459.67, 0],
  ];
  for (const [id, value, expected] of examples) {
    it(`${id}: ${value} → ${expected}`, async () => {
      const module = await loadCalculator(id);
      close(module.calculate({ value }).value, expected);
    });
  }
  it('rejeita overflow e zero absoluto inválido', async () => {
    const length = await loadCalculator('length-km-to-m');
    assert.throws(() => length.calculate({ value: Number.MAX_VALUE }), { code: 'OVERFLOW' });
    const temperature = await loadCalculator('temperature-kelvin-to-celsius');
    assert.throws(() => temperature.calculate({ value: -0.01 }), { code: 'ABSOLUTE_ZERO' });
  });
  it('busca ignora acentos e combina termos e categorias', () => {
    assert.ok(searchCalculators({ query: 'frequencia' }).length > 0);
    assert.ok(searchCalculators({ query: 'quilometro metro', category: 'Comprimento' }).length > 0);
    assert.equal(searchCalculators({ category: 'Redes' }).length, 2);
    assert.equal(searchCalculators({ favorites: new Set(['addition']) })[0].id, 'addition');
    assert.equal(searchCalculators({ query: 'inexistentezzz' }).length, 0);
  });
  it('não permite carregar IDs que não estão no catálogo', async () => {
    await assert.rejects(loadCalculator('../../.env'), { code: 'NOT_FOUND' });
  });
});

describe('entrada brasileira e precisão de exibição', () => {
  it('aceita decimais e notação científica sem aceitar expressão', () => {
    assert.equal(parseNumber(' 1,5 '), 1.5);
    assert.equal(parseNumber('-2.4e3'), -2400);
    assert.deepEqual(parseList('1,5; 2\n3'), [1.5, 2, 3]);
    for (const value of ['', '1.000,5', 'Infinity', '0x10', '1+2', '1e999']) {
      assert.throws(() => parseNumber(value));
    }
  });
  it('não exibe valores pequenos como zero nem aceita lista vazia', () => {
    assert.match(formatNumber(1e-12), /e-12/);
    assert.throws(() => parseList(' ;\n'));
  });
});
