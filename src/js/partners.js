import { content } from './content.js';
import { initFilters } from './filters.js';
import { openPartnerModal } from './modal.js';
import {
  createCategoryEl,
  createDiscountBadge,
  createLogoTile,
} from './partner-ui.js';

/**
 * One partner card: a single `<button>`, so the whole tile is one tab stop and one
 * click target rather than a clickable div wrapping a second, separate button.
 */
function createPartnerCard(partner) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'partner-card';
  card.addEventListener('click', () => openPartnerModal(partner));

  const head = document.createElement('span');
  head.className = 'partner-card-head';
  head.appendChild(createLogoTile(partner));

  const headline = document.createElement('span');
  headline.className = 'partner-headline';
  headline.appendChild(createDiscountBadge(partner));

  const note = document.createElement('span');
  note.className = 'partner-discount-note';
  note.textContent = partner.offers?.[0]?.description ?? '';
  headline.appendChild(note);

  head.appendChild(headline);

  const body = document.createElement('span');
  body.className = 'partner-card-body';

  const name = document.createElement('span');
  name.className = 'partner-name';
  name.textContent = partner.name;

  const description = document.createElement('span');
  description.className = 'partner-description';
  description.textContent = partner.body?.description ?? '';

  body.append(name, createCategoryEl(partner.category), description);
  card.append(head, body);

  return card;
}

function renderPartners(partners) {
  const listingContainer = document.querySelector('.listing-list');
  if (!listingContainer) return;

  listingContainer.innerHTML = '';

  partners.forEach((partner) => {
    const item = document.createElement('li');
    item.className = 'listing-item';
    item.appendChild(createPartnerCard(partner));
    listingContainer.appendChild(item);
  });
}

export function renderListing() {
  const partners = content.partners;
  if (!partners?.length) return;

  // initFilters calls back immediately with the unfiltered list, so this is the
  // only place the grid gets rendered.
  initFilters({ partners, onChange: renderPartners });
}
