# FlexCar Exclusive Benefits Card (Demo)

Fictional landing page for a FlexCar employee benefits card: a GSAP-pinned scroll story, a how-it-works strip, a filterable partner grid, and offer-detail modals.

All branding, partners, and copy are **demo/fictional**. Offers are not real promotions.

## Stack

- **Vite** — local dev + production build
- **Vanilla ES modules**
- **GSAP + ScrollTrigger** — pinned scroll story (`matchMedia`, `invalidateOnRefresh`)
- **@phosphor-icons/web** — fill + bold icon weights
- **JSON content** — `public/assets/content/en.json` (single English source of truth at runtime)

## Quick start

```bash
npm install
npm run dev
```

Opens http://localhost:5173/

## Scripts

| Command                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `npm run dev`              | Local development server                                 |
| `npm run build`            | Production build → `dist/`                               |
| `npm run preview`          | Preview the production build                             |
| `npm run generate:content` | Rebuild `public/assets/content/en.json` from partner data |
| `npm run generate:assets`  | Rebuild placeholder partner SVG logos and banners        |

## What’s on the page

1. **Pinned scroll story** — hero copy, physical card, step labels, and a closing “new partner” banner. Crossing a scroll band plays a full beat; there is no scrub.
2. **How it works** — three steps rendered from content.
3. **Partner listing** — category chips, text search, and a result count. Clicking a card opens a modal with offers, redemption copy, and links.
4. **Footer** — brand, nav, social, and contact from content.

Hero stats (partner count, biggest percentage discount, category count) are derived from the partner list at boot, so they cannot drift from the grid below.

## Project structure

```
index.html
src/
  main.js                 # Bootstrap: content → story → listing → pin timeline
  styles/main.css
  js/
    content.js            # Fetch / apply English content
    story.js              # Render storySteps into the stage
    presentation.js       # create/destroy ScrollTrigger story
    partners.js           # Partner grid
    filters.js            # Category chips + search
    modal.js              # Partner detail dialog
    partner-ui.js         # Shared card / modal building blocks
    footer.js / href.js / icons.js / config.js
scripts/
  partners.data.mjs       # Fictional roster (source of truth for generators)
  generate-translations.mjs
  generate-demo-assets.mjs
public/assets/
  images/                 # Logos, card art, generated partner SVGs
  content/en.json         # UI copy, storySteps, howItWorks, partners, footer
```

## Content and demo assets

`scripts/partners.data.mjs` is the authoring file. Both generators read it, so a partner’s colour, monogram, and headline offer stay in sync.

To add or change a partner:

1. Edit the roster (and `CATEGORIES` / `LATEST_PARTNER_SLUG` if needed) in `scripts/partners.data.mjs`.
2. Run `npm run generate:content` and `npm run generate:assets`.
3. Drop real artwork over the generated SVGs if you have it. The card image is not generated: keep it at `public/assets/images/cards/flexcar-card.png`.

Do not hand-edit `en.json` if you still use the generator — the next `generate:content` run will overwrite it.

`headlineDiscount` is the numeric twin of `headlineOffer`. The listing badges the string; the hero stat strip maxes over the numbers. Use `null` for offers that are not a percentage (for example “1 month free”).

## Scroll story notes

- Each beat in `presentation.js` is a complete stage description. Forward, reverse, and jumps land on the same state.
- Desktop vs mobile card transforms switch at `1024px` via `gsap.matchMedia`.
- Resize / orientation change debounces `ScrollTrigger.refresh()` and re-measures the panel; it does not jump scroll to the top.
- `prefers-reduced-motion` skips the pin and shows a static CSS stage (`.is-reduced-motion`).
- Category / UI icons use Phosphor; partner logos and banners stay local SVGs.
