import './styles/main.css';
import '@phosphor-icons/web/fill';
import '@phosphor-icons/web/bold';
import {
  content,
  loadCard,
  loadContent,
  loadLogo,
  waitForCriticalImages,
} from './js/content.js';
import { createIcon } from './js/icons.js';
import { renderStorySteps } from './js/story.js';
import { renderListing } from './js/partners.js';
import { renderFooter } from './js/footer.js';
import { createScrollStory } from './js/presentation.js';

function parsePartnerBanner() {
  const partnerBannerBg = document.querySelector('.partner-banner-background');
  const partnerBannerLogo = document.querySelector('.partner-banner-logo');
  const partnerBannerPartnerLogo = document.querySelector(
    '.partner-banner-partner-logo',
  );

  if (content.bannerBg && partnerBannerBg) {
    partnerBannerBg.src = content.bannerBg;
  }
  if (content.logo && partnerBannerLogo) {
    partnerBannerLogo.src = content.logo;
  }
  if (content.partnerLogo && partnerBannerPartnerLogo) {
    partnerBannerPartnerLogo.src = content.partnerLogo;
  }
}

/**
 * Hero stat strip. Values are derived from the partner list rather than authored,
 * so the numbers above the fold cannot drift from the listing below it.
 */
function renderHeroStats() {
  const root = document.querySelector('[data-hero-stats]');
  const stats = content.heroStats;
  if (!root || !Array.isArray(stats)) return;

  const partners = content.partners ?? [];
  const values = {
    partners: partners.length,
    categories: new Set(
      partners.map((partner) => partner.category?.title).filter(Boolean),
    ).size,
    maxDiscount: Math.max(
      0,
      ...partners.map((partner) => partner.headlineDiscount ?? 0),
    ),
  };

  root.innerHTML = '';

  stats.forEach((stat) => {
    const value = values[stat.metric];
    if (!value) return;

    const item = document.createElement('li');
    item.className = 'hero-stat';

    const valueEl = document.createElement('span');
    valueEl.className = 'hero-stat-value';
    valueEl.textContent = `${stat.prefix ?? ''}${value}${stat.suffix ?? ''}`;

    const labelEl = document.createElement('span');
    labelEl.className = 'hero-stat-label';
    labelEl.textContent = stat.label;

    item.append(valueEl, labelEl);
    root.appendChild(item);
  });
}

function renderHowItWorks() {
  const root = document.querySelector('[data-how-steps]');
  const steps = content.howItWorks;
  if (!root || !Array.isArray(steps)) return;

  root.innerHTML = '';

  steps.forEach((step) => {
    const item = document.createElement('li');
    item.className = 'how-step';

    const icon = document.createElement('span');
    icon.className = 'how-step-icon';
    icon.appendChild(
      createIcon(step.icon || 'sparkle', {
        weight: 'fill',
        className: 'how-step-glyph',
      }),
    );

    const index = document.createElement('span');
    index.className = 'how-step-index';
    index.textContent = step.step ?? '';

    const title = document.createElement('h3');
    title.className = 'how-step-title';
    title.textContent = step.title ?? '';

    const body = document.createElement('p');
    body.className = 'how-step-body';
    body.textContent = step.body ?? '';

    item.append(icon, index, title, body);
    root.appendChild(item);
  });
}

function bindCta() {
  const cta = document.querySelector('.cta');
  const listing = document.querySelector('.listing');
  if (!cta || !listing) return;

  cta.addEventListener('click', () => {
    const targetPosition =
      listing.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
}

async function boot() {
  try {
    await loadContent();
    loadLogo();
    loadCard();
    parsePartnerBanner();
    renderHeroStats();
    renderStorySteps();
    renderHowItWorks();
    renderListing();
    renderFooter();
    bindCta();

    await waitForCriticalImages();
    // Fonts can shift layout; wait if supported
    if (document.fonts?.ready) {
      await document.fonts.ready.catch(() => undefined);
    }

    createScrollStory();
  } catch (error) {
    console.error('Failed to boot Benefit Card page:', error);
  }
}

addEventListener('DOMContentLoaded', boot);
