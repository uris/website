# Website analytics

PostHog tracks navigation and meaningful portfolio/Vi interactions. Implementation lives together in `src/analytics/`; the root `instrumentation-client.ts` calls `initializeAnalytics()` before React hydration. Automatic page events and custom capture use the same environment controls.

## Enable analytics

Set these in `.env.local` for local builds, preserving your existing backend settings:

```dotenv
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=<your public project token>
NEXT_PUBLIC_POSTHOG_HOST=<your project's ingestion host>
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_DEV_ENABLED=false
```

Analytics stays off if the enabled flag, token, or host is missing. Non-production builds also require `NEXT_PUBLIC_ANALYTICS_DEV_ENABLED=true`. This lets you test from localhost or a LAN address without per-component overrides. Prefer a separate PostHog test project for development. A local production build follows production settings, regardless of hostname.

Restart the development server after changing settings. Next.js embeds public variables during the build, so deployed changes require rebuilding. These are public project settings, not a personal API key.

## Docker / VM deployment

The Dockerfile accepts all four settings as build arguments. In the VM's existing Compose `website` service, add these under its existing `build` configuration (retain the current context and other options):

```yaml
services:
  website:
    build:
      context: ./website
      args:
        NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: ${NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN}
        NEXT_PUBLIC_POSTHOG_HOST: ${NEXT_PUBLIC_POSTHOG_HOST}
        NEXT_PUBLIC_ANALYTICS_ENABLED: ${NEXT_PUBLIC_ANALYTICS_ENABLED:-false}
        NEXT_PUBLIC_ANALYTICS_DEV_ENABLED: "false"
```

Put the first three values in the environment used by Compose, e.g. the `.env` beside the VM's Compose file, then rebuild the website. Runtime `environment:` entries alone do not configure the browser bundle. The VM's Compose file is outside this repository and has not been modified by this integration.

## Navigation and project views

The top-level window enables `capture_pageview: 'history_change'` and `capture_pageleave: true`. Embedded windows disable both. This covers the initial visit and workspace History API path changes without counting `/projects/[slug]` iframe loads again. Do not add manual pageviews for the same route changes.

`WorkspaceProjectViewTracker` observes the active project surface and selection. `ProjectDetailsPage` includes the same client tracker with `presentation: 'standalone'`, but that tracker returns without capturing when embedded. Therefore:

| Action | Custom project event |
| --- | --- |
| Open or switch a project in `/work/[slug]` | `viewed_project`, `presentation: workspace` |
| Visit `/projects/[slug]` directly | `viewed_project`, `presentation: standalone` |
| Load/reload the project iframe or change theme | No extra `viewed_project` |
| Leave a project and return | A new `viewed_project` |
| Visit Skills or Contact | No custom view event; use the pageview |

Project properties use stable slugs, not display titles. `presentation` describes the containing view; it does not currently identify whether a grid click, Vi command or browser history opened the project. Analytics does not explicitly strip query parameters from PostHog's default URL metadata.

## Events

| Event | Meaning | Explicit properties |
| --- | --- | --- |
| `$pageview` / `$pageleave` | Top-level visits and history navigation; embedded frames excluded | PostHog page metadata |
| `viewed_project` | A project becomes active in the workspace or is visited directly | `project_slug`, `presentation` |
| `vi_session_attempted` | A new connection attempt passes the duplicate-attempt guard | `vi_session_id` |
| `vi_session_started` | A valid `session.created` is processed and initial session setup succeeds | `vi_session_id` |
| `vi_session_ended` | A started session disconnects or the document exits | `vi_session_id`, `duration_seconds`, `reason` |
| `vi_session_failed` | Setup fails before the session starts | `vi_session_id`, `stage` (`microphone`, `token`, `webrtc`, `session_setup`) |
| `vi_request_submitted` | A user text/audio conversation item is accepted | `vi_session_id`, `input_mode` |
| `vi_tool_completed` | A registered tool's result is sent back to Vi | `vi_session_id`, `tool`, `success` |
| `contact_submitted` | The contact endpoint confirms success | None |

`vi_session_id` is a random local ID generated per connection attempt; it is distinct from PostHog's browsing session and the provider's session ID. Accepted messages are deduplicated by item ID within the conversation. Greetings, assistant responses, speech-start signals and transcript fragments are not counted as user requests.

Tool calls are deduplicated by call ID. Combined theme/volume calls wait for both UI results. Completion means the app sent the result over its data channel, not that the model acknowledged receipt. Missing UI listeners or invalid calls that never produce an output do not produce completion events. User cancellations and later disconnections are not labeled setup failures.

The explicitly supplied custom properties contain no prompts, transcripts, contact details, raw tool arguments or provider identifiers. Automatic interaction capture, dead-click capture and session replay are explicitly disabled. Custom tracking failures are swallowed so they cannot interrupt Vi or contact submission.

Visits to Skills and Contact are measured through automatic pageviews. `contact_submitted` separately measures successful submissions.

## Verify in PostHog

Enable development tracking deliberately, restart the dev server, and inspect incoming events:

1. Open a workspace project: one top-level pageview and one `viewed_project`.
2. Change theme: no additional project view from iframe reloads.
3. Open `/projects/uris-design` directly: one standalone project view.
4. Start Vi: one attempt followed by one start. Deny microphone permission on a fresh attempt: a failure with `stage: microphone`.
5. Send text or speak: one accepted-request event per turn, not per transcript fragment.
6. Ask Vi to fetch skills or navigate: completion after its result, with the original tool name.
7. Disconnect Vi: exactly one `vi_session_ended` with the same `vi_session_id`, a nonnegative `duration_seconds`, and `reason: user_disconnect`. A second disconnect does not add another end event.
8. Refresh or leave during a session: best-effort end event with `reason: page_exit`. Switching tabs should not end it.
9. Cancel before the session starts: no start/end event. Failed setup produces a stage-specific failure, not a completed session.
10. Submit contact details: `contact_submitted` appears only on confirmed success, not on a failed request.
11. Disable analytics and restart/rebuild: no new automatic or custom events from the new page load.

Historical events are unchanged. Existing project reports using the old `project` title property should switch to `project_slug` for new data.

## Vi session duration

`vi_session_ended.duration_seconds` measures elapsed connected time from successful session setup, including idle time while connected. It excludes microphone/token setup time. Use average, median or sum of this numeric property in PostHog; the shared `vi_session_id` links the end to its start.

End reasons are `user_disconnect`, `connection_closed`, `connection_error`, `handler_error`, `page_exit`, and `replaced`. Each started session emits at most one end event. Cancelled or failed connection attempts have no end event.

On `pagehide`, the site records the end and closes Vi, including when the browser puts the page into its back/forward cache. Switching tabs does not end a session. End events use immediate beacon delivery, but browser crashes, forced termination and network loss can still prevent delivery; durations are therefore best-effort analytics, not billing records.

## Code organization

All analytics implementation lives in `src/analytics/`:

- `config.ts`: environment settings and the shared enable check.
- `initializeAnalytics.ts`: PostHog initialization and automatic page-event configuration.
- `events.ts`: event names and their property types.
- `trackAppEvent.ts`: shared event capture and error isolation.
- `viAnalytics.ts`: Vi lifecycle, duration and deduplication.
- `useAppEvent.ts`: React wrapper for shared event capture.
- `PostHogProvider.tsx`: supplies the initialized PostHog client to React.
- `ProjectViewTracker.tsx`: workspace and standalone project-view tracking.

Vi lifecycle functions use event-aligned names: `trackViSessionAttempted`, `trackViSessionStarted`, `trackViSessionEnded`, and `trackViSessionFailed`. Requests and completed tools use `trackViRequestSubmitted` and `trackViToolCompleted`; `registerViToolCall` registers expected results before execution. `trackViSessionEnded` also clears per-session state, and emits no end event for an attempt that never started.

The root `instrumentation-client.ts` is the Next.js startup entry point and calls `initializeAnalytics()`. Feature components and stores only call tracking functions at the relevant lifecycle points. Tests remain under the existing `tests/unit` and `tests/browser` folders.

## Extending tracking

Declare an event and its property shape in `events.ts`. Call `trackAppEvent` from stores/imperative handlers or `useAppEvent()` from React; the hook takes no environment override. Both use the shared configuration and isolate capture errors from application behavior.

Use the lifecycle helpers in `viAnalytics.ts` for Vi events so duration, shared session IDs and deduplication remain consistent. Capture outcomes where they are confirmed, rather than button clicks or component renders. Add behavior tests for new completion/failure paths and repeated notifications.

## Checks and troubleshooting

`npm run check` validates types and formatting. `npm run test:run` exercises environment gating, iframe/project tracking, Vi lifecycle/duration and deduplication, tool results and contact submission. Tests use mocks; they do not verify your live project token, VM build arguments or dashboard delivery.

If events are missing, check all enable flags and the ingestion host, restart/rebuild after changing settings, and inspect browser network requests. Development and test builds need the development opt-in in addition to the main flag. Tracking blockers or an unavailable network can prevent delivery. An enabled production build also tracks when served locally.

For reporting, use `vi_session_started` counts for successful sessions, average/median `duration_seconds` on `vi_session_ended` for connected time, and accepted-request counts grouped by `vi_session_id` for turns per conversation. Keep incomplete sessions in mind: not every start is guaranteed to have a delivered end event. Live dashboard delivery and production enablement still need verification in the deployed environment.
