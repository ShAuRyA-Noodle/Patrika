# पत्रिका · Patrika

A bilingual (Hindi and English) poetry journal for the poet **Neelu Shori** (नीलू शोरी).

Patrika is a quiet, editorial reading experience built around three poems on silence, suffering, and the floods a woman is never allowed to spill. Devanagari verse is set in a dedicated serif, with romanized titles and brief English glosses so the work reads across both languages.

## Highlights

- **Editorial typography.** Fraunces and Cormorant Garamond for Latin, Tiro Devanagari Hindi for the verse, JetBrains Mono for labels.
- **Ivory and oxblood theme.** Warm near-black ink on ivory paper with a single restrained accent. Quiet by design.
- **Motion that respects the reader.** Smooth scrolling via Lenis and tasteful reveals via Framer Motion, all gated behind `prefers-reduced-motion`.
- **Fully static.** Every route is prerendered at build time. No backend, no API routes, no user input.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 18](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scroll
- TypeScript

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the journal.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the project with ESLint |

## Project structure

```
src/
  app/          Layout, fonts, global styles, the single page
  components/   Hero, Archive, PoemCard, PoemScroll, and motion helpers
  lib/poems.ts  The poems and their metadata
public/poems/   Manuscript scans of the original handwritten verse
```

## Adding or editing poems

All content lives in [`src/lib/poems.ts`](src/lib/poems.ts) as a typed `POEMS` array. Each entry carries a Devanagari title, a romanized subtitle, the author signature, a date, a short card blurb, and the stanzas themselves. Lines are auto detected as Devanagari or Latin and styled accordingly.

## Credits

Poems by Neelu Shori (नीलू शोरी). Design and build for the Patrika journal.
