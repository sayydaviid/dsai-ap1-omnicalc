import { conversions } from './conversions.js';
import { specialCalculators, calculateSpecial } from '../core/special.js';
import { CalculationError } from '../core/numbers.js';

export const calculators = [...specialCalculators, ...conversions];
const byId = new Map(calculators.map((calculator) => [calculator.id, calculator]));
export const categories = [...new Set(calculators.map((calculator) => calculator.category))];
export const normalize = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function searchCalculators({ query = '', category = '', favorites = null } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return calculators.filter((calculator) => {
    if (category && calculator.category !== category) return false;
    if (favorites && !favorites.has(calculator.id)) return false;
    const text = normalize(`${calculator.name} ${calculator.category} ${calculator.inputUnit ?? ''} ${calculator.outputUnit ?? ''}`);
    return terms.every((term) => text.includes(term));
  });
}
export function getCalculator(id) { return byId.get(id); }

export async function loadCalculator(id) {
  const summary = byId.get(id);
  if (!summary) throw new CalculationError('Calculadora não encontrada.', 'NOT_FOUND');
  if (summary.kind === 'special') {
    return { definition: summary, calculate: (input) => calculateSpecial(id, input) };
  }
  // id vem somente do mapa interno; nunca de um caminho fornecido pelo usuário.
  return import(`../conversions/${summary.id}.js`);
}
