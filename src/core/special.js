import { CalculationError, finiteNumber, finiteResult } from './numbers.js';

const numberField = (key, label, example, extra = {}) => ({ key, label, example, type: 'number', ...extra });
const listField = { key: 'values', label: 'Números separados por ; ou linha', example: '2; 4; 4; 4; 5; 5; 7; 9', type: 'list' };
const a = numberField('a', 'Primeiro valor', 12);
const b = numberField('b', 'Segundo valor', 4);
const nonnegative = (key, label, example) => numberField(key, label, example, { min: 0 });

function nonzero(value) {
  if (value === 0) throw new CalculationError('O divisor não pode ser zero.', 'DIVISION_BY_ZERO');
  return value;
}
function average(values) {
  // Atualização incremental evita estourar a soma de uma lista longa.
  let mean = 0;
  values.forEach((value, index) => { mean += (value - mean) / (index + 1); });
  return finiteResult(mean);
}
function standardDeviation(values, sample) {
  if (sample && values.length < 2) {
    throw new CalculationError('Desvio amostral exige pelo menos dois valores.');
  }
  let mean = 0;
  let m2 = 0;
  values.forEach((value, index) => {
    const delta = value - mean;
    mean += delta / (index + 1);
    m2 += delta * (value - mean);
  });
  return finiteResult(Math.sqrt(m2 / (values.length - (sample ? 1 : 0))));
}
function ipv4(value) {
  if (typeof value !== 'string' || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) {
    throw new CalculationError('Informe um endereço IPv4 válido.');
  }
  const parts = value.split('.').map(Number);
  if (parts.some((part) => part > 255)) throw new CalculationError('Cada octeto deve estar entre 0 e 255.');
  return parts.reduce((total, part) => total * 256 + part, 0);
}
const dotted = (value) => [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.');
function subnet({ ip, prefix }) {
  const address = ipv4(ip);
  const size = 2 ** (32 - prefix);
  const network = Math.floor(address / size) * size;
  const broadcast = network + size - 1;
  const small = prefix >= 31;
  const rows = [
    { label: 'Rede', text: `${dotted(network)}/${prefix}` },
    { label: 'Máscara', text: dotted(2 ** 32 - size) },
    { label: 'Broadcast (limite superior)', text: dotted(broadcast) },
    { label: 'Primeiro endereço utilizável', text: dotted(network + (small ? 0 : 1)) },
    { label: 'Último endereço utilizável', text: dotted(broadcast - (small ? 0 : 1)) },
  ];
  return { value: small ? size : size - 2, unit: 'hosts', steps: rows };
}

function tool(id, name, category, fields, formula, run, unit = '') {
  return { id, name, category, categoryId: `special-${category.toLowerCase()}`, kind: 'special', fields, formula, run, unit };
}
const capital = nonnegative('principal', 'Capital inicial', 1000);
const rate = numberField('rate', 'Taxa por período (%)', 10, { min: 0 });
const periods = numberField('periods', 'Número de períodos', 2, { min: 0, integer: true });

export const specialCalculators = [
  tool('addition', 'Soma', 'Matemática', [a, b], 'a + b', ({ a, b }) => a + b),
  tool('subtraction', 'Subtração', 'Matemática', [a, b], 'a − b', ({ a, b }) => a - b),
  tool('multiplication', 'Multiplicação', 'Matemática', [a, b], 'a × b', ({ a, b }) => a * b),
  tool('division', 'Divisão', 'Matemática', [a, b], 'a ÷ b', ({ a, b }) => a / nonzero(b)),
  tool('power', 'Potência', 'Matemática', [a, b], 'a elevado a b', ({ a, b }) => a ** b),
  tool('square-root', 'Raiz quadrada', 'Matemática', [nonnegative('value', 'Valor', 144)], '√valor', ({ value }) => Math.sqrt(value)),
  tool('percentage', 'Porcentagem de um valor', 'Matemática', [numberField('value', 'Valor total', 250), numberField('percent', 'Porcentagem (%)', 20)], 'valor × percentual ÷ 100', ({ value, percent }) => value * percent / 100),
  tool('percent-change', 'Variação percentual', 'Matemática', [numberField('initial', 'Valor inicial', 100), numberField('final', 'Valor final', 125)], '(final − inicial) ÷ inicial × 100', ({ initial, final }) => (final - initial) / nonzero(initial) * 100, '%'),
  tool('rule-of-three', 'Regra de três direta', 'Matemática', [a, b, numberField('c', 'Terceiro valor', 24)], 'a está para b como c está para x; x = b × c ÷ a', ({ a, b, c }) => b * c / nonzero(a)),
  tool('discount', 'Desconto percentual', 'Finanças', [nonnegative('price', 'Preço original', 200), numberField('percent', 'Desconto (%)', 15, { min: 0, max: 100 })], 'preço × (1 − desconto ÷ 100)', ({ price, percent }) => price * (1 - percent / 100)),
  tool('simple-interest', 'Montante com juros simples', 'Finanças', [capital, rate, periods], 'capital × (1 + taxa ÷ 100 × períodos)', ({ principal, rate, periods }) => principal * (1 + rate / 100 * periods)),
  tool('compound-interest', 'Montante com juros compostos', 'Finanças', [capital, rate, periods], 'capital × (1 + taxa ÷ 100) ^ períodos', ({ principal, rate, periods }) => principal * (1 + rate / 100) ** periods),
  tool('circle-area', 'Área do círculo', 'Geometria', [nonnegative('radius', 'Raio (mesma unidade do resultado²)', 3)], 'π × raio²', ({ radius }) => Math.PI * radius ** 2, 'unid.²'),
  tool('rectangle-area', 'Área do retângulo', 'Geometria', [nonnegative('width', 'Largura', 4), nonnegative('height', 'Altura', 5)], 'largura × altura', ({ width, height }) => width * height, 'unid.²'),
  tool('hypotenuse', 'Hipotenusa', 'Geometria', [nonnegative('a', 'Primeiro cateto', 3), nonnegative('b', 'Segundo cateto', 4)], '√(a² + b²)', ({ a, b }) => Math.hypot(a, b), 'unid.'),
  tool('cylinder-volume', 'Volume do cilindro', 'Geometria', [nonnegative('radius', 'Raio', 2), nonnegative('height', 'Altura', 5)], 'π × raio² × altura', ({ radius, height }) => Math.PI * radius ** 2 * height, 'unid.³'),
  tool('mean', 'Média aritmética', 'Estatística', [listField], 'soma dos valores ÷ quantidade', ({ values }) => average(values)),
  tool('median', 'Mediana', 'Estatística', [listField], 'valor central da lista ordenada', ({ values }) => {
    const sorted = [...values].sort((x, y) => x - y);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : sorted[middle - 1] / 2 + sorted[middle] / 2;
  }),
  tool('population-deviation', 'Desvio padrão populacional', 'Estatística', [listField], '√(soma dos desvios² ÷ n)', ({ values }) => standardDeviation(values, false)),
  tool('sample-deviation', 'Desvio padrão amostral', 'Estatística', [listField], '√(soma dos desvios² ÷ (n − 1))', ({ values }) => standardDeviation(values, true)),
  tool('transfer-time', 'Tempo de transferência', 'Redes', [nonnegative('megabytes', 'Tamanho (MB decimais)', 100), numberField('mbps', 'Velocidade (Mbit/s)', 20, { min: 0 })], 'megabytes × 8 ÷ megabits por segundo; sem overhead', ({ megabytes, mbps }) => megabytes * 8 / nonzero(mbps), 's'),
  tool('ipv4-subnet', 'Sub-rede IPv4 / CIDR', 'Redes', [{ key: 'ip', label: 'Endereço IPv4', type: 'text', example: '192.168.100.118' }, numberField('prefix', 'Prefixo CIDR (0–32)', 24, { min: 0, max: 32, integer: true })], 'bloco = 2 ^ (32 − prefixo); /31 usa RFC 3021', subnet),
];

const byId = new Map(specialCalculators.map((item) => [item.id, item]));
export function calculateSpecial(id, input) {
  const definition = byId.get(id);
  if (!definition) throw new CalculationError('Calculadora não encontrada.', 'NOT_FOUND');
  const values = {};
  for (const field of definition.fields) {
    const value = input?.[field.key];
    if (field.type === 'list') {
      if (!Array.isArray(value) || value.length === 0) throw new CalculationError('A lista não pode estar vazia.');
      values[field.key] = value.map((entry) => finiteNumber(entry, field.label));
    } else if (field.type === 'text') {
      if (typeof value !== 'string') throw new CalculationError(`${field.label} é obrigatório.`);
      values[field.key] = value.trim();
    } else {
      finiteNumber(value, field.label);
      if (field.min !== undefined && value < field.min) throw new CalculationError(`${field.label}: mínimo ${field.min}.`);
      if (field.max !== undefined && value > field.max) throw new CalculationError(`${field.label}: máximo ${field.max}.`);
      if (field.integer && !Number.isInteger(value)) throw new CalculationError(`${field.label} deve ser inteiro.`);
      values[field.key] = value;
    }
  }
  const output = definition.run(values);
  const result = typeof output === 'number' ? { value: output, unit: definition.unit, steps: [] } : output;
  return { ...result, value: finiteResult(result.value), formula: definition.formula };
}
