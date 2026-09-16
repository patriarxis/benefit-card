# NovaDrive Benefit Card (Demo)

Fictional demo of a benefits-card landing page — GSAP scroll-driven card story, partner deals grid, and detail modals.

All branding, partners, and copy are **demo/fictional** (NovaDrive).

## Stack

- **Vite** — local dev + production build
- **Vanilla ES modules**
- **GSAP + ScrollTrigger** — pinned scroll story (`matchMedia`, `invalidateOnRefresh`)
- **@phosphor-icons/web** — fill + bold icon weights
- **JSON content** — `public/assets/content/en.json` (single English source of truth)

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Scripts

| Command                  | Description                         |
| ------------------------ | ----------------------------------- |
| `npm run dev`            | Local development server            |
| `npm run build`          | Production build → `dist/`          |
| `npm run preview`        | Preview the production build        |
| `npm run generate:content` | Regenerate `content/en.json`      |
| `npm run generate:assets`  | Regenerate placeholder SVG assets |

## Project structure

```
index.html
src/
  main.js                 # Bootstrap: content → story → pin timeline
  styles/main.css
  js/
    content.js            # Load / apply English content
    story.js              # Render storySteps into the stage
    presentation.js       # create/destroy ScrollTrigger story
    partners.js / modal.js / footer.js / partner-ui.js
    icons.js / theme.js / config.js
public/assets/
  images/                 # Logos, card, partner placeholders
  content/en.json         # UI copy, storySteps, partners, footer
```

## Notes

- Scroll story uses a **GSAP-pinned** `.scroll-story` stage with **threshold-triggered** step animations (no scrub — crossing a scroll band plays/reverses a full beat).
- Resize debounces `ScrollTrigger.refresh()` — it does not jump scroll to top.
- `prefers-reduced-motion` skips the scrubbed pin and shows a static stage.
- Category/link/UI icons use Phosphor; partner logos/banners stay local SVGs.
