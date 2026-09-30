export class CalculationError extends Error {
  constructor(message, code = 'INVALID_INPUT') {
    super(message);
    this.name = 'CalculationError';
    this.code = code;
  }
}

export function finiteNumber(value, label = 'Valor') {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CalculationError(`${label} deve ser um número finito.`);
  }
  return value;
}

export function finiteResult(value) {
  if (!Number.isFinite(value)) {
    throw new CalculationError('O resultado excede os limites numéricos.', 'OVERFLOW');
  }
  return Object.is(value, -0) ? 0 : value;
}

export function absoluteTemperature(base) {
  if (base < -1e-10) {
    throw new CalculationError('Temperatura abaixo do zero absoluto.', 'ABSOLUTE_ZERO');
  }
  return Math.max(0, base);
}

export function parseNumber(text) {
  const normalized = String(text).trim().replace(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) {
    throw new CalculationError('Digite um número; use vírgula ou ponto decimal, sem separador de milhar.');
  }
  return finiteNumber(Number(normalized));
}

export function parseList(text) {
  const parts = String(text).split(/[;\n]+/).map((part) => part.trim()).filter(Boolean);
  if (!parts.length) throw new CalculationError('Informe pelo menos um número.');
  return parts.map(parseNumber);
}

export function formatNumber(value) {
  finiteNumber(value);
  if (value !== 0 && (Math.abs(value) < 1e-6 || Math.abs(value) >= 1e12)) {
    return value.toExponential(8).replace('.', ',');
  }
  return new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 12 }).format(value);
}
