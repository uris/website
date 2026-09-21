# Uris Design & Dev

An interactive portfolio and AI workspace built with Next.js App Router, React, and TypeScript.

## Requirements

- Node.js 24 recommended (also supported: 20.19+ or 22.12+)
- npm
- Docker and Docker Compose for production deployment

## Local development

Install dependencies and start the development server:

```sh
npm ci
npm run dev
```

The site is available at `http://localhost:3000`.

## Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` creates the production build.
- `npm run start` runs the production server.
- `npm run check` runs Biome and TypeScript checks without changing files.
- `npm run lint` runs Biome with automatic fixes.
- `npm run format` formats files with Biome.

## Tests

Install Chromium once after installing npm dependencies:

```sh
npm run test:install
npm run test:run
```

On Linux CI, use `npx playwright install --with-deps chromium` to install browser system dependencies as well. Run the install command again after upgrading Playwright.

- `npm test` watches both test projects.
- `npm run test:unit` runs Node tests for logic, stores, and route handlers.
- `npm run test:browser` renders React components in headless Chromium through Vitest's Playwright provider.
- `npm run test:browser:headed` watches browser tests in a visible browser.
- `npm run test:ui` opens the Vitest UI.
- `npm run test:coverage` (or `npm run coverage`) runs both projects and writes HTML, JSON, and LCOV reports to `reports/coverage/`.

Unit tests live in `tests/unit/**/*.test.ts`; browser component tests live in `tests/browser/**/*.test.tsx`. Both resolve the aliases from `tsconfig.json`. Browser tests load the application and Slice styles and automatically unmount React trees after each test. Reset stores, storage, timers, and mocks explicitly when a suite changes them.

These component tests run through Vite, without starting Next.js or contacting the private backend. Full Next.js routing, server rendering, hydration, and image optimization need separate end-to-end tests; see the local [testing and coverage plan](docs/TESTING.md) (not tracked in Git).

The Website Tests GitHub Actions workflow runs checks and combined coverage on pull requests and pushes to `main`, and uploads reports. Coverage currently establishes a baseline without enforcing percentage thresholds. The existing deployment workflow runs independently; tests do not yet gate deployment.

## Server rendering

The site is ready for server rendering with the Next.js App Router.

- The root layout renders on the server and reads the `slice-theme` and `slice-system-theme` cookies to select the initial theme. This prevents a client-only theme flash on first load.
- Interactive UI is isolated in client components, including the theme provider, AI workspace, settings panels, and project interactions.
- Project detail pages are server components. Known project slugs are statically generated during `npm run build`, while the shared layout can still respond to each request's theme cookie.
- Route handlers under `app/server` provide the contact, project, skills, and OpenAI session endpoints.

## Environment

Create a local `.env.local` file with the private backend origin:

```dotenv
PRIVATE_API_BASE_URL=http://localhost:3001
```

This value is accessed only by server-side route handlers and is not exposed to the browser. Production needs the same variable available to the website container.

## Production build

The [Dockerfile](/Users/urisdacosta/RiderProjects/website/Dockerfile) creates a multi-stage production image using Next.js `standalone` output. It builds the application, copies only the standalone runtime and static assets, then serves it on port `3000`.

## Deployment

Pushing to `main` runs [the deployment workflow](/Users/urisdacosta/RiderProjects/website/.github/workflows/deploy.yml). The workflow connects to the Google Cloud VM, pulls the latest repository contents, and rebuilds the `website` Compose service from `~/projects`.

The VM must have:

- `~/projects/docker-compose.yml` (or equivalent) defining a `website` service that builds this repository.
- Docker and the `docker-compose` command installed.
- An SSH key at `~/.ssh/github_actions` with access to `git@github.com:uris/website.git`.
- `PRIVATE_API_BASE_URL` configured for the container.

The workflow uses `set -e`, so any failed pull or image build now fails the GitHub Actions job instead of appearing as a successful deployment.
