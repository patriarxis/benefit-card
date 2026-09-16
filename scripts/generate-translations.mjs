import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { categoryOf, latestPartner, partners } from './partners.data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'assets', 'content');

const asset = {
  logo: '/assets/images/flexcar-horizontal-logo.svg',
  mark: '/assets/images/flexcar-mark.svg',
  card: '/assets/images/cards/flexcar-card.png',
  bannerBg: '/assets/images/latest-partners/banner.svg',
  partnerLogo: '/assets/images/latest-partners/partner-logo.svg',
};

function buildPartner(p) {
  const category = categoryOf(p);
  const offers = [
    {
      title: p.headlineOffer,
      titleExt: p.offerTitleExt ?? `${p.headlineOffer} ${p.offerDesc}`,
      description: p.offerDesc,
      descriptionExt:
        'Available to active FlexCar Benefits Card holders. Terms may apply.',
    },
    ...(p.extraOffers ?? []),
  ];

  return {
    slug: p.slug,
    name: p.name,
    logoSrc: `/assets/images/partners/logos/${p.slug}.svg`,
    bannerSrc: `/assets/images/partners/banners/${p.slug}.svg`,
    category: { ...category },
    // Pre-resolved so the listing can badge the best offer, and the hero stat strip
    // can max over the numbers, without either one parsing copy at render time.
    headlineOffer: p.headlineOffer,
    headlineDiscount: p.headlineDiscount,
    links: [
      {
        icon: 'globe',
        text: 'Website',
        url: `https://example.com/${p.slug}`,
      },
    ],
    body: {
      label: 'About',
      description: p.about,
      descriptionExt: `${p.about} FlexCar cardholders get this partner rate all year round — no vouchers, no minimum spend.`,
    },
    offersLabel: 'What you save',
    offers,
    disclaimer: 'Demo offer for illustration only. Not a real promotion.',
    process: {
      label: 'How to redeem',
      description: p.process,
    },
    button: {
      text: 'See the offer',
      info: 'Full terms inside',
    },
  };
}

const ui = {
  'hero-eyebrow': 'Included for every FlexCar employee',
  'hero-title-top': 'Save every day with the',
  'hero-title-bottom': 'FlexCar Exclusive Benefits Card',
  'hero-subtitle':
    'One card, dozens of partner discounts — on dining, wellness, fitness, travel and everyday shopping.',
  'cta-text': 'Browse all discounts',
  'scroll-message': 'Scroll to explore',
  'big-text': 'Real savings, every week',
  'how-title': 'How it works',
  'how-subtitle':
    'Three steps between you and a cheaper weekly shop, dinner, or gym membership.',
  'listing-title': 'Discounts and benefits',
  'listing-subtitle':
    'Every FlexCar partner offer, in one place. Filter by category or search for a brand.',
};

/** Values are computed from the partner list at runtime; these are just the labels. */
const heroStats = [
  { metric: 'partners', label: 'Partner brands' },
  { metric: 'maxDiscount', label: 'Biggest discount', prefix: '-', suffix: '%' },
  { metric: 'categories', label: 'Categories' },
];

const newest = latestPartner();

const storySteps = [
  { id: '01', label: 'The FlexCar Benefits Card' },
  {
    id: '02',
    label: 'Unlock partner discounts',
    title: 'Unlock partner discounts',
    body: 'Your Exclusive Benefits Card opens up standing offers from local favourites and national brands — at no extra cost to you.',
  },
  {
    id: '03',
    label: 'Savings that fit your week',
    title: 'Savings that fit your week',
    body: 'Coffee on Monday, the gym on Wednesday, dinner on Friday. The card pays off on the things you already do.',
    showBigText: true,
  },
  {
    id: '04',
    label: 'New partner, new savings',
    title: 'New partner\nNew savings',
    body: `Say hello to ${newest.name}, our newest partner. Cardholders get ${newest.headlineOffer} ${newest.offerDesc} from today.`,
  },
];

const howItWorks = [
  {
    icon: 'credit-card',
    step: '01',
    title: 'Get your card',
    body: 'Every FlexCar subscriber gets an Exclusive Benefits Card — digital, activated the moment your contract starts.',
  },
  {
    icon: 'hand-tap',
    step: '02',
    title: 'Show it at checkout',
    body: 'In store, mention the benefit. Online, use the partner code. No vouchers to print and nothing to claim back.',
  },
  {
    icon: 'seal-percent',
    step: '03',
    title: 'Save on the spot',
    body: 'The discount comes off the price there and then, as often as you like, for as long as you drive with us.',
  },
];

const listing = {
  filterLabel: 'Filter by category',
  allLabel: 'All',
  searchLabel: 'Search partners',
  searchPlaceholder: 'Search a brand or an offer',
  clearLabel: 'Clear search',
  emptyTitle: 'No partners match your filters',
  emptyBody: 'Try another category, or clear the search to see every benefit.',
  countOne: '1 partner',
  countMany: '{count} partners',
  benefitsOne: '1 benefit',
  benefitsMany: '{count} benefits',
};

const footer = {
  tagline: 'Exclusive Benefits Card',
  phone: '+30 211 000 4821',
  email: 'benefits@flexcar.demo',
  links: [
    { title: 'About', url: 'https://example.com/flexcar/about' },
    { title: 'Careers', url: 'https://example.com/flexcar/careers' },
    { title: 'Help', url: 'https://example.com/flexcar/help' },
    { title: 'Partners', url: 'https://example.com/flexcar/partners' },
  ],
  social: [
    { icon: 'facebook-logo', url: 'https://example.com/flexcar/facebook' },
    { icon: 'instagram-logo', url: 'https://example.com/flexcar/instagram' },
    { icon: 'linkedin-logo', url: 'https://example.com/flexcar/linkedin' },
  ],
  copyrights: '© FlexCar',
  privacyPolicy: {
    title: 'Privacy Policy',
    url: 'https://example.com/flexcar/privacy',
  },
};

fs.mkdirSync(root, { recursive: true });

const payload = {
  ...asset,
  ui,
  heroStats,
  storySteps,
  howItWorks,
  listing,
  footer,
  partners: partners.map(buildPartner),
};

const out = path.join(root, 'en.json');
fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(
  `wrote ${out} partners=${payload.partners.length} steps=${storySteps.length}`,
);
