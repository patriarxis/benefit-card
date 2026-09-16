import { BRAND_NAME } from './config.js';
import { content } from './content.js';
import { bindHref, isPlaceholderHref } from './href.js';
import { createIcon } from './icons.js';

export function renderFooter() {
  const root = document.querySelector('[data-footer]');
  const data = content.footer;
  if (!root || !data) return;

  const logo = root.querySelector('[data-footer-logo]');
  if (logo) {
    logo.src = content.logo;
    logo.alt = BRAND_NAME;
  }

  const tagline = root.querySelector('[data-footer-tagline]');
  if (tagline) {
    tagline.textContent = data.tagline ?? '';
    tagline.hidden = !data.tagline;
  }

  const nav = root.querySelector('[data-footer-nav]');
  if (nav) {
    nav.replaceChildren(...(data.links ?? []).map(toTextLink));
  }

  const social = root.querySelector('[data-footer-social]');
  if (social) {
    social.replaceChildren(...(data.social ?? []).map(toSocialLink));
  }

  const email = root.querySelector('[data-footer-email]');
  if (email && data.email) {
    email.href = `mailto:${data.email}`;
    email.textContent = data.email;
  }

  const phone = root.querySelector('[data-footer-phone]');
  if (phone && data.phone) {
    phone.href = `tel:${data.phone.replace(/\s+/g, '')}`;
    phone.textContent = data.phone;
  }

  const copy = root.querySelector('[data-footer-copy]');
  if (copy) {
    copy.textContent = `${data.copyrights} ${new Date().getFullYear()}`;
  }

  const privacy = root.querySelector('[data-footer-privacy]');
  if (privacy && data.privacyPolicy) {
    bindHref(privacy, data.privacyPolicy.url);
    privacy.textContent = data.privacyPolicy.title;
  }
}

function toTextLink(item) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  bindHref(a, item.url);
  a.textContent = item.title;
  li.appendChild(a);
  return li;
}

function toSocialLink(item) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  bindHref(a, item.url);
  if (!isPlaceholderHref(item.url)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.setAttribute('aria-label', socialLabel(item.icon));
  a.appendChild(
    createIcon(item.icon || 'share-network', {
      weight: 'fill',
      className: 'site-footer__social-icon',
    }),
  );
  li.appendChild(a);
  return li;
}

function socialLabel(icon = '') {
  const label = icon
    .replace(/-logo$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bLinkedin\b/, 'LinkedIn');
  return label || 'Social';
}
