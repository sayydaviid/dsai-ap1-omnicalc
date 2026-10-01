// Gerado por scripts/generate.mjs; editar o catálogo, não este arquivo.
import { finiteNumber, finiteResult, absoluteTemperature } from '../core/numbers.js';

export const definition = Object.freeze({
  id: "pressure-atm-to-psi",
  name: "Atmosfera padrão → Libra-força por polegada quadrada",
  category: "Pressão",
  categoryId: "pressure",
  kind: 'conversion',
  inputUnit: "atm",
  outputUnit: "psi",
  baseUnit: "Pa",
  sourceFactor: 101325,
  sourceOffset: 0,
  targetFactor: 6894.757293168361,
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
