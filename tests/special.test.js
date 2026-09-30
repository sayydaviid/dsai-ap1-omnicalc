import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSpecial as calc, specialCalculators } from '../src/core/special.js';
import { close } from './helpers.js';

describe('calculadoras especiais', () => {
  const cases = [
    ['addition', { a: 12, b: 4 }, 16],
    ['subtraction', { a: 12, b: 4 }, 8],
    ['multiplication', { a: 12, b: 4 }, 48],
    ['division', { a: 12, b: 4 }, 3],
    ['power', { a: 2, b: 10 }, 1024],
    ['square-root', { value: 144 }, 12],
    ['percentage', { value: 250, percent: 20 }, 50],
    ['percent-change', { initial: 100, final: 125 }, 25],
    ['rule-of-three', { a: 12, b: 4, c: 24 }, 8],
    ['discount', { price: 200, percent: 15 }, 170],
    ['simple-interest', { principal: 1000, rate: 10, periods: 2 }, 1200],
    ['compound-interest', { principal: 1000, rate: 10, periods: 2 }, 1210],
    ['circle-area', { radius: 3 }, 28.274333882308138],
    ['rectangle-area', { width: 4, height: 5 }, 20],
    ['hypotenuse', { a: 3, b: 4 }, 5],
    ['cylinder-volume', { radius: 2, height: 5 }, 62.83185307179586],
    ['mean', { values: [2, 4, 4, 4, 5, 5, 7, 9] }, 5],
    ['median', { values: [9, 1, 7, 3] }, 5],
    ['median', { values: [9, 1, 7] }, 7],
    ['population-deviation', { values: [2, 4, 4, 4, 5, 5, 7, 9] }, 2],
    ['sample-deviation', { values: [2, 4, 4, 4, 5, 5, 7, 9] }, 2.138089935299395],
    ['transfer-time', { megabytes: 100, mbps: 20 }, 40],
    ['ipv4-subnet', { ip: '192.168.100.118', prefix: 24 }, 254],
  ];
  for (const [id, input, expected] of cases) {
    it(`${id} retorna exemplo conhecido`, () => close(calc(id, input).value, expected));
  }
  it('todos os exemplos da interface são calculáveis', () => {
    for (const tool of specialCalculators) {
      const input = Object.fromEntries(tool.fields.map((field) => [field.key,
        field.type === 'list' ? [2, 4, 4, 4, 5, 5, 7, 9] : field.example]));
      assert.ok(Number.isFinite(calc(tool.id, input).value));
    }
  });
  it('aplica regras RFC 3021 para /31 e endereço único /32', () => {
    const p31 = calc('ipv4-subnet', { ip: '10.0.0.3', prefix: 31 });
    assert.equal(p31.value, 2);
    assert.equal(p31.steps[3].text, '10.0.0.2');
    const p32 = calc('ipv4-subnet', { ip: '10.0.0.3', prefix: 32 });
    assert.equal(p32.value, 1);
    assert.equal(p32.steps[3].text, '10.0.0.3');
    assert.equal(calc('ipv4-subnet', { ip: '10.0.0.3', prefix: 0 }).value, 4294967294);
  });
  it('calcula rede, máscara e broadcast', () => {
    const result = calc('ipv4-subnet', { ip: '192.168.100.118', prefix: 24 });
    assert.equal(result.steps[0].text, '192.168.100.0/24');
    assert.equal(result.steps[1].text, '255.255.255.0');
    assert.equal(result.steps[2].text, '192.168.100.255');
  });
  it('não altera a lista original ao calcular mediana', () => {
    const values = [9, 1, 7, 3];
    calc('median', { values });
    assert.deepEqual(values, [9, 1, 7, 3]);
  });
  const failures = [
    ['division', { a: 1, b: 0 }],
    ['square-root', { value: -1 }],
    ['power', { a: 1e100, b: 100 }],
    ['mean', { values: [] }],
    ['sample-deviation', { values: [1] }],
    ['transfer-time', { megabytes: 100, mbps: 0 }],
    ['compound-interest', { principal: 100, rate: 5, periods: 1.5 }],
    ['discount', { price: 100, percent: 110 }],
    ['ipv4-subnet', { ip: '999.1.2.3', prefix: 24 }],
    ['ipv4-subnet', { ip: '10.0.0.1', prefix: 33 }],
    ['addition', { a: '2', b: 3 }],
  ];
  for (const [id, input] of failures) {
    it(`${id} rejeita ${JSON.stringify(input)}`, () => assert.throws(() => calc(id, input)));
  }
});
