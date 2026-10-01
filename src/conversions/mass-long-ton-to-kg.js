// Gerado por scripts/generate.mjs; editar o catálogo, não este arquivo.
import { finiteNumber, finiteResult, absoluteTemperature } from '../core/numbers.js';

export const definition = Object.freeze({
  id: "mass-long-ton-to-kg",
  name: "Tonelada longa imperial → Quilograma",
  category: "Massa",
  categoryId: "mass",
  kind: 'conversion',
  inputUnit: "long ton",
  outputUnit: "kg",
  baseUnit: "kg",
  sourceFactor: 1016.0469088,
  sourceOffset: 0,
  targetFactor: 1,
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
