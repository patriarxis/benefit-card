import { createIcon } from './icons.js';

/**
 * Presentational building blocks shared by the listing card and the partner modal.
 *
 * Everything here is built from `<span>`s rather than block elements: the partner card
 * is a single `<button>`, whose content model only allows phrasing content.
 */

export function createCategoryEl(category) {
  const wrapper = document.createElement('span');
  wrapper.className = 'partner-category';

  wrapper.appendChild(
    createIcon(category?.icon || 'tag', {
      weight: 'fill',
      className: 'partner-category-icon',
    }),
  );

  const title = document.createElement('span');
  title.className = 'partner-category-title';
  title.textContent = category?.title ?? '';
  wrapper.appendChild(title);

  return wrapper;
}

/** The partner's biggest offer, as a high-contrast red badge. */
export function createDiscountBadge(partner, { className = '' } = {}) {
  const badge = document.createElement('span');
  badge.className = ['partner-discount', className].filter(Boolean).join(' ');
  badge.textContent = partner.headlineOffer ?? '';
  return badge;
}

/** Square tile that crops the 160x160 partner logo cleanly at any card width. */
export function createLogoTile(partner, { className = '' } = {}) {
  const tile = document.createElement('span');
  tile.className = ['partner-logo-tile', className].filter(Boolean).join(' ');

  const img = document.createElement('img');
  img.className = 'partner-logo';
  img.src = partner.logoSrc;
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  tile.appendChild(img);

  return tile;
}

export function createOfferDetail(offer) {
  const offerItem = document.createElement('li');
  offerItem.className = 'partner-modal-offer';

  const value = document.createElement('p');
  value.className = 'partner-modal-offer-value';
  value.textContent = offer.title ?? '';

  const name = document.createElement('p');
  name.className = 'partner-modal-offer-name';
  name.textContent = offer.description || offer.titleExt || '';

  const offerDescription = document.createElement('p');
  offerDescription.className = 'partner-modal-offer-description';
  offerDescription.textContent = offer.descriptionExt ?? '';

  offerItem.append(value, name);
  if (offerDescription.textContent) offerItem.appendChild(offerDescription);
  return offerItem;
}
