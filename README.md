# Next.js Website

This project uses Next.js App Router with TypeScript.

## Scripts

- `npm run dev` starts the Next development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs Biome checks

## Routing Layout

- [`app/layout.tsx`](/Users/urisdacosta/RiderProjects/website/app/layout.tsx) defines the shared root layout
- [`app/(ai)/page.tsx`](/Users/urisdacosta/RiderProjects/website/app/(ai)/page.tsx) is the AI workspace entry route
- [`app/(content)/projects/[slug]/page.tsx`](/Users/urisdacosta/RiderProjects/website/app/(content)/projects/[slug]/page.tsx) is a server-rendered project summary route stub

## Theming Note

[`app/providers.tsx`](/Users/urisdacosta/RiderProjects/website/app/providers.tsx) delays loading `@apple-pie/slice`'s `ThemeProvider` until the client. This avoids server-side `matchMedia` access during the initial migration. A later pass should make the theme system SSR-aware so the provider can participate in the first render cleanly.
