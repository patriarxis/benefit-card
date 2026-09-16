import { content } from './content.js';

/**
 * Category chips + text search for the partner listing.
 *
 * Owns the filter bar DOM and the filter state; `partners.js` hands over the partner
 * list plus a render callback and gets called back with the matching subset on every
 * change (including once during init, so it is the only render path).
 */

const ALL = '__all__';

const state = { category: ALL, query: '' };

let partnersRef = [];
let onChangeRef = null;
let chipsRoot = null;
let searchInput = null;
let clearButton = null;
let countEl = null;
let emptyEl = null;

/** Built once per partner: lets "cafe" match "Café" and "spa" match an offer body. */
const haystacks = new WeakMap();

function copy() {
  return content.listing ?? {};
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function haystackFor(partner) {
  let value = haystacks.get(partner);
  if (value === undefined) {
    value = normalize(
      [
        partner.name,
        partner.category?.title,
        partner.headlineOffer,
        partner.body?.description,
        ...(partner.offers ?? []).flatMap((offer) => [
          offer.title,
          offer.description,
        ]),
      ]
        .filter(Boolean)
        .join(' '),
    );
    haystacks.set(partner, value);
  }
  return value;
}

function matches(partner) {
  if (state.category !== ALL && partner.category?.title !== state.category) {
    return false;
  }
  if (!state.query) return true;
  return haystackFor(partner).includes(state.query);
}

function categoryCounts() {
  const counts = new Map();
  partnersRef.forEach((partner) => {
    const title = partner.category?.title;
    if (title) counts.set(title, (counts.get(title) ?? 0) + 1);
  });
  return counts;
}

function buildChips() {
  if (!chipsRoot) return;

  chipsRoot.innerHTML = '';
  chipsRoot.setAttribute(
    'aria-label',
    copy().filterLabel ?? 'Filter by category',
  );

  const entries = [[ALL, partnersRef.length], ...categoryCounts()];

  entries.forEach(([value, count]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip';
    chip.dataset.filterValue = value;
    chip.setAttribute('aria-pressed', String(value === state.category));

    const label = document.createElement('span');
    label.className = 'filter-chip-label';
    label.textContent = value === ALL ? (copy().allLabel ?? 'All') : value;

    const badge = document.createElement('span');
    badge.className = 'filter-chip-count';
    badge.textContent = String(count);

    chip.append(label, badge);
    chip.addEventListener('click', () => {
      state.category = value;
      emit();
    });

    chipsRoot.appendChild(chip);
  });
}

function syncChips() {
  chipsRoot?.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.setAttribute(
      'aria-pressed',
      String(chip.dataset.filterValue === state.category),
    );
  });
}

function renderCount(total) {
  if (!countEl) return;
  const template =
    total === 1
      ? (copy().countOne ?? '1 partner')
      : (copy().countMany ?? '{count} partners');
  countEl.textContent = template.replace('{count}', String(total));
}

function renderEmpty(total) {
  if (!emptyEl) return;
  emptyEl.hidden = total > 0;

  const title = emptyEl.querySelector('[data-listing-empty-title]');
  const body = emptyEl.querySelector('[data-listing-empty-body]');
  if (title) {
    title.textContent = copy().emptyTitle ?? 'No partners match your filters';
  }
  if (body) body.textContent = copy().emptyBody ?? '';
}

function emit() {
  const result = partnersRef.filter(matches);

  syncChips();
  renderCount(result.length);
  renderEmpty(result.length);
  if (clearButton) clearButton.hidden = !state.query;

  onChangeRef?.(result);
}

export function initFilters({ partners, onChange }) {
  partnersRef = Array.isArray(partners) ? partners : [];
  onChangeRef = onChange;

  state.category = ALL;
  state.query = '';

  chipsRoot = document.querySelector('[data-filter-chips]');
  searchInput = document.querySelector('[data-filter-search]');
  clearButton = document.querySelector('[data-filter-clear]');
  countEl = document.querySelector('[data-filter-count]');
  emptyEl = document.querySelector('[data-listing-empty]');

  // No filter bar on the page: still render the full list.
  if (!chipsRoot && !searchInput) {
    onChangeRef?.(partnersRef);
    return;
  }

  buildChips();

  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = copy().searchPlaceholder ?? 'Search partners';
    searchInput.setAttribute(
      'aria-label',
      copy().searchLabel ?? 'Search partners',
    );
    searchInput.addEventListener('input', () => {
      state.query = normalize(searchInput.value.trim());
      emit();
    });
  }

  if (clearButton) {
    clearButton.setAttribute('aria-label', copy().clearLabel ?? 'Clear search');
    clearButton.addEventListener('click', () => {
      state.query = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      emit();
    });
  }

  emit();
}
