/**
 * Single source of truth for the fictional partner roster.
 *
 * Both generators read this file — `generate-demo-assets.mjs` for the artwork and
 * `generate-translations.mjs` for the copy — so a partner's colour, monogram and
 * headline offer cannot drift apart.
 *
 * `headlineDiscount` is the numeric twin of `headlineOffer`: the listing renders the
 * string as a badge and the hero stat strip maxes over the numbers, so neither has to
 * parse copy at runtime. Use `null` for offers that aren't a percentage.
 */

export const CATEGORIES = {
  dining: { icon: 'fork-knife', title: 'Dining' },
  cafe: { icon: 'coffee', title: 'Café & Wine' },
  wellness: { icon: 'flower-lotus', title: 'Wellness' },
  fitness: { icon: 'barbell', title: 'Fitness' },
  retail: { icon: 'shopping-bag', title: 'Retail' },
  travel: { icon: 'suitcase-rolling', title: 'Travel' },
};

export const partners = [
  {
    slug: 'marina-bistro',
    name: 'Marina Bistro',
    mono: 'MB',
    color: '#c2410c',
    shape: 'circle',
    category: 'dining',
    headlineOffer: '-15%',
    headlineDiscount: 15,
    offerDesc: 'on weekday lunch menus',
    about: 'Coastal-inspired bistro serving seasonal plates and weekend brunch.',
    process: 'Reserve online and mention your FlexCar Benefits Card.',
    extraOffers: [
      {
        title: 'Free dessert',
        titleExt: 'Complimentary dessert with any entrée',
        description: 'with any entrée',
        descriptionExt: 'Available Mon–Thu for cardholders.',
      },
    ],
  },
  {
    slug: 'leaf-and-grain',
    name: 'Leaf & Grain',
    mono: 'LG',
    color: '#4d7c0f',
    shape: 'diamond',
    category: 'dining',
    headlineOffer: '-15%',
    headlineDiscount: 15,
    offerDesc: 'on bowls & salads',
    about: 'Fresh bowls, salads, and grain plates made with local produce.',
    process: 'Show your FlexCar Benefits Card before ordering.',
  },
  {
    slug: 'oak-brew',
    name: 'Oak & Brew',
    mono: 'OB',
    color: '#7c4a24',
    shape: 'arc',
    category: 'cafe',
    headlineOffer: '-20%',
    headlineDiscount: 20,
    offerDesc: 'on drinks & pastries',
    about:
      'A neighborhood café roasting single-origin beans and baking fresh pastries daily.',
    process: 'Show your FlexCar Benefits Card at checkout.',
  },
  {
    slug: 'vineyard-lane',
    name: 'Vineyard Lane',
    mono: 'VL',
    color: '#7e1f3f',
    shape: 'circle',
    category: 'cafe',
    headlineOffer: '-10%',
    headlineDiscount: 10,
    offerDesc: 'on tasting experiences',
    about: 'Guided tastings and curated bottles from independent vineyards.',
    process: 'Book online using your member email.',
  },
  {
    slug: 'lumora',
    name: 'Lumora Wellness',
    mono: 'LW',
    color: '#6d28d9',
    shape: 'bars',
    category: 'wellness',
    headlineOffer: '-25%',
    headlineDiscount: 25,
    offerDesc: 'on spa packages',
    about:
      'Lumora offers massage, skincare, and recovery treatments in a calm urban spa.',
    process: 'Book via the partner site with code FLEXCAR.',
  },
  {
    slug: 'aurora-dental',
    name: 'Aurora Dental',
    mono: 'AD',
    color: '#0e7490',
    shape: 'diamond',
    category: 'wellness',
    headlineOffer: '-20%',
    headlineDiscount: 20,
    offerDesc: 'on cleanings & whitening',
    about:
      'Preventive dentistry and cosmetic treatments with same-week appointments.',
    process: 'Mention the FlexCar benefit when you book your appointment.',
  },
  {
    slug: 'pulse-gym',
    name: 'Pulse Gym',
    mono: 'PG',
    color: '#0369a1',
    shape: 'bars',
    category: 'fitness',
    headlineOffer: '1 month free',
    headlineDiscount: null,
    offerDesc: 'when you join annually',
    about: 'Modern gym with strength floors, classes, and recovery zones.',
    process: 'Visit any location with your card and photo ID.',
    extraOffers: [
      {
        title: '-10%',
        titleExt: '-10% on merch & accessories',
        description: 'on merch',
        descriptionExt: 'In-club retail only.',
      },
    ],
  },
  {
    slug: 'cadence-studio',
    name: 'Cadence Studio',
    mono: 'CS',
    color: '#be123c',
    shape: 'arc',
    category: 'fitness',
    headlineOffer: '-30%',
    headlineDiscount: 30,
    offerDesc: 'on class packs',
    about: 'Boutique cycling and pilates studio with small-group coaching.',
    process: 'Apply the benefit at checkout in the studio app.',
  },
  {
    slug: 'northmarket',
    name: 'North Market',
    mono: 'NM',
    color: '#b45309',
    shape: 'diamond',
    category: 'retail',
    headlineOffer: '-10%',
    headlineDiscount: 10,
    offerDesc: 'on full-price items',
    about:
      'Curated lifestyle retail for home, apparel, and everyday essentials.',
    process: 'Scan your digital card at the point of sale.',
  },
  {
    slug: 'clearvue',
    name: 'ClearVue Optics',
    mono: 'CV',
    color: '#1d4ed8',
    shape: 'circle',
    category: 'retail',
    headlineOffer: '-20%',
    headlineDiscount: 20,
    offerDesc: 'on frames & lenses',
    about:
      'ClearVue Optics provides designer frames and precision lens fitting.',
    process: 'Present your FlexCar Benefits Card in-store.',
  },
  {
    slug: 'harbor-suites',
    name: 'Harbor Suites',
    mono: 'HS',
    color: '#164e63',
    shape: 'bars',
    category: 'travel',
    headlineOffer: '-12%',
    headlineDiscount: 12,
    offerDesc: 'on weekend stays',
    about: 'Boutique city suites with flexible check-in and workspace lounges.',
    process: 'Use promo code FLEXSTAY when booking.',
  },
  {
    slug: 'coastline-escapes',
    name: 'Coastline Escapes',
    mono: 'CE',
    color: '#0f766e',
    shape: 'arc',
    category: 'travel',
    headlineOffer: '-18%',
    headlineDiscount: 18,
    offerDesc: 'on island getaways',
    about: 'Short-haul coastal trips, ferry packages, and off-season escapes.',
    process: 'Book through the partner site with your member email.',
  },
];

/** The partner featured in the closing beat of the scroll story. */
export const LATEST_PARTNER_SLUG = 'lumora';

export function latestPartner() {
  return (
    partners.find((p) => p.slug === LATEST_PARTNER_SLUG) ?? partners[0]
  );
}

export function categoryOf(partner) {
  return CATEGORIES[partner.category];
}
