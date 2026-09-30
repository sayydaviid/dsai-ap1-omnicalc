// Gerado por scripts/generate.mjs; editar o catálogo, não este arquivo.
import { finiteNumber, finiteResult, absoluteTemperature } from '../core/numbers.js';

export const definition = Object.freeze({
  id: "time-week-to-julian-decade",
  name: "Semana de 7 dias → Década juliana",
  category: "Tempo",
  categoryId: "time",
  kind: 'conversion',
  inputUnit: "sem",
  outputUnit: "10 a jul",
  baseUnit: "s",
  sourceFactor: 604800,
  sourceOffset: 0,
  targetFactor: 315576000,
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
