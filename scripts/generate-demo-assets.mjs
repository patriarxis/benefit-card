import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { latestPartner, partners } from './partners.data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'public', 'assets', 'images');

const RED_1 = '#e90037';
const RED_2 = '#b72026';
const TILE = '#f4f4f4';
const FONT = 'Ubuntu, Arial, Helvetica, sans-serif';

/** Partner names contain `&`, which is not legal as a literal in SVG text. */
function xml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function reset(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Background motifs for the partner tiles. Each one deliberately bleeds past the
 * 160x160 viewBox so it reads as a cropped graphic rather than a floating shape.
 */
const SHAPES = {
  circle: (c) => `<circle cx="158" cy="4" r="52" fill="${c}" fill-opacity="0.16"/>`,
  diamond: (c) =>
    `<path d="M152 -44 L204 8 L152 60 L100 8 Z" fill="${c}" fill-opacity="0.16"/>`,
  bars: (c) => `<g fill="${c}" fill-opacity="0.16">
    <rect x="2" y="104" width="15" height="60" rx="7.5"/>
    <rect x="25" y="124" width="15" height="40" rx="7.5"/>
    <rect x="48" y="90" width="15" height="74" rx="7.5"/>
  </g>`,
  arc: (c) =>
    `<circle cx="160" cy="0" r="68" fill="none" stroke="${c}" stroke-opacity="0.2" stroke-width="18"/>`,
};

/** 160x160 by construction, so the square crop in the partner card is always clean. */
function partnerLogo(partner, { tile = TILE } = {}) {
  const motif = (SHAPES[partner.shape] ?? SHAPES.circle)(partner.color);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
  <rect width="160" height="160" fill="${tile}"/>
  ${motif}
  <rect x="36" y="36" width="88" height="88" rx="22" fill="${partner.color}"/>
  <text x="80" y="81" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="34" font-weight="700" letter-spacing="-1" fill="#fff">${xml(partner.mono)}</text>
</svg>
`;
}

/** Only ever seen as the modal header, so a colour wash plus motif is enough. */
function partnerBanner(partner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="320" viewBox="0 0 960 320" fill="none">
  <rect width="960" height="320" fill="${partner.color}"/>
  <circle cx="838" cy="46" r="132" fill="#fff" fill-opacity="0.10"/>
  <circle cx="112" cy="296" r="104" fill="#000" fill-opacity="0.10"/>
  <circle cx="720" cy="280" r="88" fill="#fff" fill-opacity="0.06"/>
</svg>
`;
}

reset(path.join(assets, 'partners', 'logos'));
reset(path.join(assets, 'partners', 'banners'));

for (const partner of partners) {
  write(
    path.join(assets, 'partners', 'logos', `${partner.slug}.svg`),
    partnerLogo(partner),
  );
  write(
    path.join(assets, 'partners', 'banners', `${partner.slug}.svg`),
    partnerBanner(partner),
  );
}

// Backdrop for the closing "new partner" beat. Kept purely graphical: the step's
// own intro copy and the two logos sit on top of it.
write(
  path.join(assets, 'latest-partners', 'banner.svg'),
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="400" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="${RED_2}"/>
      <stop offset="1" stop-color="${RED_1}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#bg)"/>
  <circle cx="1020" cy="52" r="196" fill="#fff" fill-opacity="0.08"/>
  <circle cx="232" cy="376" r="148" fill="#000" fill-opacity="0.08"/>
  <circle cx="742" cy="330" r="92" fill="#fff" fill-opacity="0.05"/>
</svg>
`,
);

const latest = latestPartner();
write(
  path.join(assets, 'latest-partners', 'partner-logo.svg'),
  partnerLogo(latest, { tile: '#ffffff' }),
);

console.log(
  `Created demo image assets: ${partners.length} partner logos + banners, latest-partner banner (${latest.name})`,
);
