# Uris Design & Dev

An interactive portfolio and AI workspace built with Next.js App Router, React, and TypeScript.

## Requirements

- Node.js 20 or later
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
