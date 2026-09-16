import { createIcon } from './icons.js';
import { bindHref, isPlaceholderHref } from './href.js';
import {
  createCategoryEl,
  createDiscountBadge,
  createLogoTile,
  createOfferDetail,
} from './partner-ui.js';

/** Element to hand focus back to on close — the partner card that opened the modal. */
let lastFocused = null;

function onKeydown(event) {
  if (event.key === 'Escape') closePartnerModal();
}

export function openPartnerModal(partner) {
  const body = document.body;
  body.classList.add('no-scroll');
  lastFocused = document.activeElement;

  const backdrop = document.createElement('div');
  backdrop.classList.add('backdrop');
  backdrop.addEventListener('click', closePartnerModal);

  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'partner-modal-title');

  const closeModalBtn = document.createElement('button');
  closeModalBtn.classList.add('close-modal-btn');
  closeModalBtn.type = 'button';
  closeModalBtn.setAttribute('aria-label', 'Close');
  closeModalBtn.appendChild(
    createIcon('x', { weight: 'bold', className: 'close-modal-icon' }),
  );
  closeModalBtn.addEventListener('click', closePartnerModal);

  modal.appendChild(closeModalBtn);
  modal.appendChild(createPartnerModal(partner));
  modalContainer.appendChild(modal);

  body.appendChild(modalContainer);
  body.appendChild(backdrop);

  document.addEventListener('keydown', onKeydown);
  closeModalBtn.focus();
}

export function closePartnerModal() {
  document.removeEventListener('keydown', onKeydown);
  document.querySelector('.backdrop')?.remove();
  document.querySelector('.modal-container')?.remove();
  document.body.classList.remove('no-scroll');

  lastFocused?.focus?.();
  lastFocused = null;
}

function createPartnerModal(partner) {
  const partnerModal = document.createElement('div');
  partnerModal.className = 'partner-modal';

  const hero = document.createElement('div');
  hero.className = 'partner-modal-hero';

  const partnerBanner = document.createElement('img');
  partnerBanner.src = partner.bannerSrc;
  partnerBanner.alt = '';
  partnerBanner.className = 'partner-modal-banner';
  hero.appendChild(partnerBanner);

  const identity = document.createElement('div');
  identity.className = 'partner-modal-identity';
  identity.appendChild(
    createLogoTile(partner, { className: 'partner-logo-tile--modal' }),
  );

  const identityCopy = document.createElement('div');
  identityCopy.className = 'partner-modal-identity-copy';

  const partnerName = document.createElement('h2');
  partnerName.id = 'partner-modal-title';
  partnerName.className = 'partner-modal-name';
  partnerName.textContent = partner.name;

  const meta = document.createElement('div');
  meta.className = 'partner-modal-meta';
  meta.appendChild(createCategoryEl(partner.category));

  partner.links?.forEach((link) => {
    const linkA = document.createElement('a');
    linkA.className = 'partner-modal-link';
    bindHref(linkA, link.url);
    if (!isPlaceholderHref(link.url)) {
      linkA.target = '_blank';
      linkA.rel = 'noopener noreferrer';
    }
    const linkText = document.createElement('span');
    linkText.className = 'partner-modal-link-text';
    linkText.textContent = link.text;
    linkA.append(
      createIcon(link.icon || 'globe', {
        weight: 'fill',
        className: 'partner-modal-link-icon',
      }),
      linkText,
    );
    meta.appendChild(linkA);
  });

  identityCopy.append(partnerName, meta);
  identity.append(
    identityCopy,
    createDiscountBadge(partner, { className: 'partner-discount--modal' }),
  );

  const body = document.createElement('div');
  body.className = 'partner-modal-body';

  if (partner.body?.descriptionExt || partner.body?.description) {
    const lead = document.createElement('p');
    lead.className = 'partner-modal-lead';
    lead.textContent =
      partner.body.descriptionExt ?? partner.body.description ?? '';
    body.appendChild(lead);
  }

  if (partner.offers?.length) {
    const offers = document.createElement('section');
    offers.className = 'partner-modal-offers';
    offers.setAttribute('aria-label', partner.offersLabel || 'Offers');

    if (partner.offersLabel) {
      const offersLabel = document.createElement('p');
      offersLabel.className = 'partner-modal-kicker';
      offersLabel.textContent = partner.offersLabel;
      offers.appendChild(offersLabel);
    }

    const offersList = document.createElement('ul');
    offersList.className = 'partner-modal-offers-list';
    partner.offers.forEach((offer) => {
      offersList.appendChild(createOfferDetail(offer));
    });
    offers.appendChild(offersList);
    body.appendChild(offers);
  }

  partnerModal.append(hero, identity, body);

  if (partner.process?.label || partner.process?.description) {
    const redeem = document.createElement('div');
    redeem.className = 'partner-modal-redeem';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'partner-modal-redeem-icon';
    iconWrap.appendChild(
      createIcon('hand-tap', {
        weight: 'fill',
        className: 'partner-modal-redeem-glyph',
      }),
    );

    const redeemCopy = document.createElement('div');
    redeemCopy.className = 'partner-modal-redeem-copy';

    const processLabel = document.createElement('p');
    processLabel.className = 'partner-modal-redeem-label';
    processLabel.textContent = partner.process.label ?? '';

    const processDescription = document.createElement('p');
    processDescription.className = 'partner-modal-redeem-description';
    processDescription.textContent = partner.process.description ?? '';

    redeemCopy.append(processLabel, processDescription);
    redeem.append(iconWrap, redeemCopy);
    partnerModal.appendChild(redeem);
  }

  return partnerModal;
}
