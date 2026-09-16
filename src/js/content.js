export let content = {};

const CONTENT_URL = '/assets/content/en.json';

async function fetchJson(url) {
  const response = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
}

export function applyUiCopy(ui) {
  if (!ui) return;

  Object.keys(ui).forEach((key) => {
    document.querySelectorAll(`[data-content-key="${key}"]`).forEach((el) => {
      el.textContent = ui[key];
    });
  });
}

export async function loadContent() {
  content = await fetchJson(CONTENT_URL);
  applyUiCopy(content.ui);
  return content;
}

export function loadLogo() {
  if (!content.logo) return;
  const logo = document.querySelector('.logo');
  if (logo) logo.src = content.logo;
}

export function loadCard() {
  const card = document.querySelector('.card');
  if (!card || !content.card) return;
  card.src = content.card;
}

export function waitForCriticalImages() {
  const selectors = ['.card', '.partner-banner-background', '.logo'];
  const images = selectors
    .map((sel) => document.querySelector(sel))
    .filter((img) => img instanceof HTMLImageElement);

  return Promise.all(
    images.map(
      (img) =>
        img.decode?.().catch(() => undefined) ??
        (img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            })),
    ),
  );
}
