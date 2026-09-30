import { mkdir, readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { enumerateConversions } from '../src/catalog/units.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const conversions = enumerateConversions();
const check = process.argv.includes('--check');
const sourceDir = path.join(root, 'src/conversions');
const testDir = path.join(root, 'tests/conversions');
const q = JSON.stringify;

// Oráculo de geração: operações racionais BigInt sobre as constantes decimais.
// Não importa nem executa a implementação gerada para obter resultados esperados.
function rational(number) {
  let [mantissa, exponent = '0'] = String(number).split('e');
  const fractional = (mantissa.split('.')[1] ?? '').length;
  const digits = mantissa.replace('.', '');
  const scale = fractional - Number(exponent);
  return scale >= 0
    ? [BigInt(digits), 10n ** BigInt(scale)]
    : [BigInt(digits) * 10n ** BigInt(-scale), 1n];
}
const add = ([a, b], [c, d]) => [a * d + c * b, b * d];
const multiply = ([a, b], [c, d]) => [a * c, b * d];
const divide = ([a, b], [c, d]) => [a * d, b * c];
function expected(item, value) {
  const base = add(multiply(rational(value), rational(item.from.factor)), rational(item.from.offset));
  const difference = add(base, rational(-item.to.offset));
  const [numerator, denominator] = divide(difference, rational(item.to.factor));
  return Number(numerator) / Number(denominator);
}

function source(item) {
  return `// Gerado por scripts/generate.mjs; editar o catálogo, não este arquivo.
import { finiteNumber, finiteResult, absoluteTemperature } from '../core/numbers.js';

export const definition = Object.freeze({
  id: ${q(item.id)},
  name: ${q(item.name)},
  category: ${q(item.category)},
  categoryId: ${q(item.categoryId)},
  kind: 'conversion',
  inputUnit: ${q(item.from.symbol)},
  outputUnit: ${q(item.to.symbol)},
  baseUnit: ${q(item.base)},
  sourceFactor: ${item.from.factor},
  sourceOffset: ${item.from.offset},
  targetFactor: ${item.to.factor},
  targetOffset: ${item.to.offset},
  absolute: ${item.absolute},
  example: 25,
});

export function toBase(value) {
  finiteNumber(value);
  const scaled = value * definition.sourceFactor;
  const base = finiteResult(scaled + definition.sourceOffset);
  if (definition.absolute) {
    return absoluteTemperature(base);
  }
  return base;
}

export function fromBase(base) {
  finiteNumber(base, 'Valor na unidade-base');
  const checked = definition.absolute ? absoluteTemperature(base) : base;
  const shifted = checked - definition.targetOffset;
  return finiteResult(shifted / definition.targetFactor);
}

export function calculate(input) {
  const value = finiteNumber(input?.value);
  const baseValue = toBase(value);
  const result = fromBase(baseValue);
  return {
    value: result,
    unit: definition.outputUnit,
    inputValue: value,
    inputUnit: definition.inputUnit,
    baseValue,
    baseUnit: definition.baseUnit,
    formula: '(valor × fator de origem + deslocamento de origem − deslocamento de destino) ÷ fator de destino',
    steps: [
      { label: 'Na unidade-base', value: baseValue, unit: definition.baseUnit },
      { label: 'Na unidade de destino', value: result, unit: definition.outputUnit },
    ],
  };
}
`;
}

function tests(item) {
  const inverseId = `${item.categoryId}-${item.to.id}-to-${item.from.id}`;
  return `// Gerado; exemplos fixos calculados por oráculo racional no gerador.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, definition, toBase, fromBase } from '../../src/conversions/${item.id}.js';
import { calculate as reverse } from '../../src/conversions/${inverseId}.js';
import { close } from '../helpers.js';

describe(${q(item.id)}, () => {
  it('converte um valor unitário com exemplo fixo', () => {
    close(calculate({ value: 1 }).value, ${expected(item, 1)});
  });

  it('converte um valor fracionário com exemplo fixo', () => {
    close(calculate({ value: 12.5 }).value, ${expected(item, 12.5)});
  });

  it('converte uma quantidade maior com exemplo fixo', () => {
    close(calculate({ value: 1000 }).value, ${expected(item, 1000)});
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
    assert.equal(definition.id, ${q(item.id)});
    assert.equal(result.inputUnit, ${q(item.from.symbol)});
    assert.equal(result.unit, ${q(item.to.symbol)});
    assert.equal(result.baseUnit, ${q(item.base)});
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

  it(${q(item.absolute ? 'rejeita temperatura abaixo do zero absoluto' : 'preserva sinal de uma quantidade negativa')}, () => {
${item.absolute
    ? `    assert.throws(() => calculate({ value: ${(-1 - item.from.offset) / item.from.factor} }), { code: 'ABSOLUTE_ZERO' });`
    : `    close(calculate({ value: -25 }).value, ${expected(item, -25)});`}
  });
});
`;
}

let changed = 0;
async function emit(filename, content) {
  const previous = await readFile(filename, 'utf8').catch(() => null);
  if (previous === content) return;
  changed++;
  if (check) return;
  await writeFile(filename, content);
}
async function removeStale(directory, names) {
  for (const filename of await readdir(directory)) {
    if (!filename.endsWith('.js') || names.has(filename)) continue;
    const full = path.join(directory, filename);
    const content = await readFile(full, 'utf8');
    if (!content.startsWith('// Gerado')) continue;
    changed++;
    if (!check) await unlink(full);
  }
}
await mkdir(sourceDir, { recursive: true });
await mkdir(testDir, { recursive: true });
for (const item of conversions) {
  await emit(path.join(sourceDir, `${item.id}.js`), source(item));
  await emit(path.join(testDir, `${item.id}.test.js`), tests(item));
}
await removeStale(sourceDir, new Set(conversions.map((item) => `${item.id}.js`)));
await removeStale(testDir, new Set(conversions.map((item) => `${item.id}.test.js`)));
const index = conversions.map((item) => ({
  id: item.id, name: item.name, category: item.category, categoryId: item.categoryId,
  kind: item.kind, inputUnit: item.from.symbol, outputUnit: item.to.symbol,
}));
await emit(path.join(root, 'src/catalog/conversions.js'),
  `// Gerado por scripts/generate.mjs.\nexport const conversions = ${q(index)};\n`);
if (check && changed) {
  console.error(`Falha: ${changed} arquivos desatualizados. Execute npm run generate.`);
  process.exitCode = 1;
} else {
  console.log(`${conversions.length} conversões; ${changed} arquivos ${check ? 'divergentes' : 'atualizados'}.`);
}
