# Uris Design & Dev

An interactive portfolio and AI workspace built with Next.js 16 App Router, React 19, TypeScript, Zustand, and the Slice component library. Visitors can browse project case studies, explore skills, send a message, or talk to Vi through a realtime voice/text session.

## Local development

Use Node.js 24, or a compatible Node.js 20.19+ / 22.12+ release, and npm. The production Docker image currently uses Node.js 20 Alpine.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Skip the copy if `.env.local` already exists; merge any missing settings instead. The development server runs at `http://localhost:3000`.

Project and skills content live in this repository. Vi session credentials and contact delivery require a separate private backend:

```dotenv
PRIVATE_API_BASE_URL=http://localhost:3001
```

The website uses this server-only origin for `/openai/realtime/session` and `/sendgrid/contact-uris`. Configure it for both local development and the production container. Permanent provider credentials belong in that backend, not in public frontend variables. Microphone access requires a secure browser context, such as localhost or HTTPS, and user permission.

## Routes and navigation

| Route | Purpose |
| --- | --- |
| `/` | Main AI workspace |
| `/work` | Workspace with the project list |
| `/work/[slug]` | Workspace with a selected project |
| `/skills` | Workspace with the Skills surface |
| `/contact` | Workspace with the Contact surface |
| `/projects/[slug]` | Project content, used inside the workspace iframe or opened directly |

The workspace uses Zustand for UI state and the browser History API to update URLs without replacing the whole workspace. `usePop` restores the selected surface/project on initial load and back/forward navigation. Vi can also open views through its UI tools.

Project details render in an iframe so their scrolling and layout remain separate from the workspace. The parent and child exchange theme, layout and interaction messages through Slice browser channels scoped to the workspace window. An iframe reload is not a new project visit for analytics.

## Vi and contact behavior

Vi obtains a temporary realtime credential through `/server/openai/realtime/session/request`, then uses WebRTC for conversation traffic. The client updates session instructions and tools, handles accepted voice/text messages, streams replies, and lets tools retrieve portfolio context or change the UI.

Connection handling guards against duplicate attempts, cancels pending credential requests, rejects stale callbacks after disconnect, and releases microphone/transport resources. Incoming provider event IDs are deduplicated. Leaving the document closes Vi; switching tabs does not end the session.

Contact input is validated on both client and server. The form prevents duplicate submissions while pending, clears only after confirmed success, and preserves the draft on failure.

## Source organization

| Location | Responsibility |
| --- | --- |
| `app/` | App Router pages, layouts, providers and server endpoints |
| `src/landing/`, `src/features/`, `src/surfaces/` | Workspace composition and visible surfaces |
| `src/components/` | Shared UI components |
| `src/stores/` | Vi, response, navigation, layout and contact state |
| `src/projects/content/` | Project documents, case-study components and related content |
| `src/projects/_registry/`, `src/projects/server/` | Valid slugs, server loading and transforms for tiles, summaries and AI context |
| `src/content/skills/`, `src/skills/` | Skills content and helpers |
| `src/analytics/` | Analytics configuration, event types, tracking helpers and React integration |
| `tests/unit/`, `tests/browser/` | Unit/integration and browser component tests |

The root layout reads the `slice-theme` and `slice-system-theme` cookies for the initial server-rendered theme. Interactive behavior stays in client components. The project route is a server component with known slugs supplied through `generateStaticParams`; its shared layout also reads request cookies.

Server endpoints provide project summaries, project AI data, skills, contact submission and realtime session credentials. Portfolio content endpoints read local server-side content; the contact and credential endpoints call the private backend.

## Analytics

PostHog measures top-level pageviews, project views, Vi session attempts/starts/ends/failures, accepted requests, completed tools and successful contact submissions. Skills and Contact visits use pageviews rather than redundant custom view events.

Analytics is off unless explicitly enabled with a public project token and ingestion host. Non-production builds need a second opt-in:

```dotenv
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=<public project token>
NEXT_PUBLIC_POSTHOG_HOST=<project ingestion host>
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_DEV_ENABLED=false
```

Set the development flag to `true` to test locally, then restart the dev server. Public settings are embedded at build time; changing a deployed container's runtime environment alone does not update them.

All implementation lives in `src/analytics/`. The required root `instrumentation-client.ts` calls its initializer before React hydration. Automatic iframe page events are disabled; custom project tracking is owned by the top-level workspace or standalone project page. Automatic interaction capture and session replay are disabled.

See [ANALYTICS.md](ANALYTICS.md) for event definitions, duration semantics, Docker configuration, code locations and verification steps.

## Scripts and tests

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm run start` | Build / serve the production application |
| `npm run check` | Check Biome formatting/lint and TypeScript without modifying files |
| `npm run lint` / `npm run format` | Apply Biome fixes / formatting |
| `npm test` | Watch unit and browser tests |
| `npm run test:run` | Run both test projects once |
| `npm run test:unit` | Run Node tests for stores, handlers, validation and analytics |
| `npm run test:browser` | Run browser component tests in headless Chromium |
| `npm run test:browser:headed` | Watch browser tests with visible Chromium |
| `npm run test:ui` | Open the Vitest UI |
| `npm run test:coverage` | Write HTML, JSON and LCOV reports to `reports/coverage/` |

Install the test browser after installing dependencies or updating Playwright:

```sh
npm run test:install
npm run check
npm run test:run
```

On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies as well. `npm run coverage` is an alias for the coverage command.

Unit tests include a simulated Vi session through real website handlers with mocked transport/backend dependencies. Browser tests run React components through Vite and Playwright, not a running Next.js server. They do not establish production routing, hydration or live PostHog delivery; verify those separately. PostHog dependencies are prebundled in Vitest to avoid reloading browser tests during a run.

There is currently no test GitHub Actions workflow in this repository. The deployment workflow does not run or gate on tests. Run checks and tests before pushing changes intended for deployment; coverage has no enforced percentage threshold.

## Build and deployment

The [Dockerfile](Dockerfile) uses a multi-stage build with Next.js `standalone` output. The runtime contains the standalone server, static assets and public files, and serves port `3000`.

Pushing to `main` runs [Deploy Website](.github/workflows/deploy.yml). It connects to the configured VM, pulls the repository and runs `docker-compose up -d --build website` from `~/projects`. `set -e` makes pull/build errors fail the job.

The VM needs Docker, the `docker-compose` command, a Compose `website` service, the repository SSH key at `~/.ssh/github_actions`, and the private backend origin in the container's runtime environment.

PostHog settings must also be passed through Compose `build.args` before building the image. The Dockerfile accepts all four public analytics variables; both enable flags default to `false`. The VM's Compose file is managed outside this repository. See the [Docker setup in ANALYTICS.md](ANALYTICS.md#docker--vm-deployment) for the configuration snippet.
