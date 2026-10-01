import { calculators, categories, getCalculator, searchCalculators, loadCalculator } from '../catalog/registry.js';
import { parseNumber, parseList, formatNumber } from '../core/numbers.js';

const $ = (id) => document.getElementById(id);
const storageKey = 'omnicalc-v1';
const pageSize = 12;
let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* Armazenamento opcional. */ }
const favorites = new Set(Array.isArray(stored.favorites) ? stored.favorites.filter((id) => getCalculator(id)) : []);
let history = Array.isArray(stored.history) ? stored.history.filter((entry) => entry && getCalculator(entry.id)).slice(0, 50) : [];
let category = '';
let tab = 'all';
let page = 0;
let selected = null;
let loaded = null;
let request = 0;
let lastResult = null;
let toastTimer;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({ favorites: [...favorites], history })); }
  catch { $('storage-status').textContent = 'Armazenamento indisponível; dados mantidos nesta sessão.'; }
}
function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 2400);
}
function favoriteButton(id) {
  const button = element('button', 'favorite', favorites.has(id) ? '★' : '☆');
  button.type = 'button';
  button.setAttribute('aria-label', `${favorites.has(id) ? 'Remover dos' : 'Adicionar aos'} favoritos: ${getCalculator(id).name}`);
  button.setAttribute('aria-pressed', String(favorites.has(id)));
  button.addEventListener('click', () => toggleFavorite(id));
  return button;
}
function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  persist();
  updateDetailFavorite();
  renderCatalog();
}
function updateDetailFavorite() {
  $('favorite-count').textContent = favorites.size;
  const favorite = favorites.has(selected);
  $('detail-favorite').textContent = favorite ? '★' : '☆';
  $('detail-favorite').setAttribute('aria-pressed', String(favorite));
  $('detail-favorite').setAttribute('aria-label', favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
}
function renderCategories() {
  const counts = new Map(categories.map((name) => [name, calculators.filter((item) => item.category === name).length]));
  $('categories').replaceChildren();
  for (const name of ['', ...categories]) {
    const button = element('button', `category-button${category === name ? ' active' : ''}`);
    button.type = 'button';
    button.append(element('span', '', name || 'Todas as ferramentas'), element('small', '', name ? counts.get(name) : calculators.length));
    button.setAttribute('aria-pressed', String(category === name));
    button.addEventListener('click', () => { category = name; page = 0; renderCategories(); renderCatalog(); });
    $('categories').append(button);
  }
}
function renderCatalog() {
  updateDetailFavorite();
  const matched = searchCalculators({ query: $('search').value, category, favorites: tab === 'favorites' ? favorites : null });
  const allowed = new Set(matched.map((item) => item.id));
  const items = tab === 'history'
    ? history.filter((entry) => allowed.has(entry.id)).map((entry) => ({ ...getCalculator(entry.id), entry }))
    : matched;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  page = Math.min(page, totalPages - 1);
  $('category-title').textContent = tab === 'history' ? 'Seu histórico' : category || 'Todas as ferramentas';
  $('result-count').textContent = `${items.length.toLocaleString('pt-BR')} ${tab === 'history' ? 'cálculos' : 'ferramentas'}`;
  $('cards').replaceChildren();
  for (const item of items.slice(page * pageSize, (page + 1) * pageSize)) {
    const card = element('article', `tool-card${selected === item.id ? ' selected' : ''}`);
    const open = element('button', 'card-open');
    open.type = 'button';
    const glyph = element('span', 'card-glyph', item.kind === 'conversion' ? '⇄' : item.category === 'Redes' ? '⌘' : 'ƒ');
    glyph.setAttribute('aria-hidden', 'true');
    open.append(glyph, element('span', 'card-title', item.name));
    const subtitle = item.entry ? `${item.entry.display} · ${new Date(item.entry.timestamp).toLocaleString('pt-BR')}` : item.category;
    open.append(element('span', 'card-subtitle', subtitle));
    open.addEventListener('click', () => choose(item.id, item.entry?.input));
    card.append(open, favoriteButton(item.id));
    $('cards').append(card);
  }
  if (!items.length) $('cards').append(element('div', 'empty-state', tab === 'favorites' ? 'Marque uma estrela para guardar suas ferramentas favoritas.' : tab === 'history' ? 'Seu próximo cálculo aparece aqui.' : 'Nenhuma ferramenta encontrada. Tente outro termo.'));
  $('page-label').textContent = `${page + 1} / ${totalPages}`;
  $('previous').disabled = page === 0;
  $('next').disabled = page === totalPages - 1;
  $('pagination').hidden = items.length <= pageSize;
  $('clear-history').hidden = tab !== 'history' || history.length === 0;
}
function fieldsFor(definition) {
  return definition.kind === 'conversion'
    ? [{ key: 'value', label: `Valor em ${definition.inputUnit}`, example: 25, type: 'number' }]
    : definition.fields;
}
function fillExamples() {
  if (!loaded) return;
  for (const field of fieldsFor(loaded.definition)) {
    $(`input-${field.key}`).value = typeof field.example === 'number' ? String(field.example).replace('.', ',') : field.example;
  }
}
function clearOutput() {
  lastResult = null;
  $('result').hidden = true;
  $('error').hidden = true;
}
async function choose(id, restoredInput = null) {
  if (!getCalculator(id)) { toast('Ferramenta não encontrada.'); return; }
  const current = ++request;
  selected = id;
  loaded = null;
  clearOutput();
  $('detail-title').textContent = getCalculator(id).name;
  $('calculator-form').hidden = true;
  updateDetailFavorite();
  renderCatalog();
  try {
    const module = await loadCalculator(id);
    if (current !== request) return;
    loaded = module;
    const definition = module.definition;
    $('detail-category').textContent = definition.category;
    $('detail-description').textContent = definition.kind === 'conversion'
      ? `${definition.inputUnit} → ${definition.outputUnit}. Digite um valor e veja a conversão, passo a passo.`
      : 'Preencha os campos abaixo. Use o exemplo para começar.';
    $('formula').textContent = definition.formula || `(valor × ${definition.sourceFactor} + ${definition.sourceOffset} − ${definition.targetOffset}) ÷ ${definition.targetFactor}`;
    $('fields').replaceChildren();
    for (const field of fieldsFor(definition)) {
      const wrapper = element('div', 'field');
      const label = element('label', '', field.label);
      label.htmlFor = `input-${field.key}`;
      const input = element(field.type === 'list' ? 'textarea' : 'input');
      input.id = `input-${field.key}`;
      input.name = field.key;
      if (input.tagName === 'INPUT') input.type = 'text';
      if (field.type === 'number') input.inputMode = 'decimal';
      input.required = true;
      input.autocomplete = 'off';
      input.addEventListener('input', clearOutput);
      wrapper.append(label, input);
      $('fields').append(wrapper);
    }
    fillExamples();
    if (restoredInput) {
      for (const field of fieldsFor(definition)) {
        const value = restoredInput[field.key];
        $(`input-${field.key}`).value = Array.isArray(value) ? value.join('; ') : String(value ?? '').replace(field.type === 'text' ? /$^/ : '.', ',');
      }
    }
    $('calculator-form').hidden = false;
    if (location.hash.slice(1) !== id) window.history.replaceState(null, '', `#${id}`);
    if (restoredInput) await calculate(false);
  } catch {
    if (current !== request) return;
    $('error').textContent = 'Não foi possível carregar a ferramenta. Reinicie o servidor local e tente novamente.';
    $('error').hidden = false;
  }
}
async function calculate(saveHistory = true) {
  if (!loaded) return;
  clearOutput();
  try {
    const input = {};
    for (const field of fieldsFor(loaded.definition)) {
      const raw = $(`input-${field.key}`).value;
      input[field.key] = field.type === 'list' ? parseList(raw) : field.type === 'text' ? raw.trim() : parseNumber(raw);
    }
    const result = loaded.calculate(input);
    $('result-value').textContent = formatNumber(result.value);
    $('result-unit').textContent = result.unit || '';
    $('steps').replaceChildren();
    for (const step of result.steps || []) {
      const row = element('div', 'step-row');
      row.append(element('span', '', step.label), element('b', '', step.text ?? `${formatNumber(step.value)} ${step.unit || ''}`));
      $('steps').append(row);
    }
    lastResult = `${formatNumber(result.value)} ${result.unit || ''}`.trim();
    $('result').hidden = false;
    if (saveHistory) {
      history.unshift({ id: selected, input, timestamp: Date.now(), display: lastResult });
      history = history.slice(0, 50);
      persist();
      if (tab === 'history') { page = 0; renderCatalog(); }
    }
  } catch (error) {
    $('error').textContent = error.message || 'Não foi possível calcular.';
    $('error').hidden = false;
  }
}

$('catalog-count').textContent = `${calculators.length.toLocaleString('pt-BR')} ferramentas`;
$('search').addEventListener('input', () => { page = 0; renderCatalog(); });
$('previous').addEventListener('click', () => { page--; renderCatalog(); });
$('next').addEventListener('click', () => { page++; renderCatalog(); });
$('detail-favorite').addEventListener('click', () => { if (selected) toggleFavorite(selected); });
$('example').addEventListener('click', () => { fillExamples(); clearOutput(); });
$('reset').addEventListener('click', () => { $('calculator-form').reset(); clearOutput(); });
$('calculator-form').addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
$('clear-history').addEventListener('click', () => { history = []; persist(); renderCatalog(); toast('Histórico limpo.'); });
$('copy').addEventListener('click', async () => {
  if (!lastResult) return;
  try { await navigator.clipboard.writeText(lastResult); toast('Resultado copiado.'); }
  catch { toast('Não foi possível copiar. Selecione o resultado na tela.'); }
});
for (const button of document.querySelectorAll('[data-tab]')) {
  button.addEventListener('click', () => {
    tab = button.dataset.tab;
    page = 0;
    for (const other of document.querySelectorAll('[data-tab]')) {
      other.classList.toggle('active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    }
    renderCatalog();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault(); $('search').focus();
  }
});
window.addEventListener('hashchange', () => choose(decodeURIComponent(location.hash.slice(1))));
renderCategories();
renderCatalog();
const initial = decodeURIComponent(location.hash.slice(1));
choose(getCalculator(initial) ? initial : 'length-km-to-m');
