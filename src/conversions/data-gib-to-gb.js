// Gerado por scripts/generate.mjs; editar o catálogo, não este arquivo.
import { finiteNumber, finiteResult, absoluteTemperature } from '../core/numbers.js';

export const definition = Object.freeze({
  id: "data-gib-to-gb",
  name: "Gibibyte binário → Gigabyte decimal",
  category: "Armazenamento digital",
  categoryId: "data",
  kind: 'conversion',
  inputUnit: "GiB",
  outputUnit: "GB",
  baseUnit: "B",
  sourceFactor: 1073741824,
  sourceOffset: 0,
  targetFactor: 1000000000,
  targetOffset: 0,
  absolute: false,
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
