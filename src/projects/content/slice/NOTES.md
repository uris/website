# Slice

## Header

**Title:** Composable React UI and browser runtime

**Subtitle:** A React SDK that brings a design system, UI components, browser APIs, and realtime primitives into one composable package, so teams spend less time wiring libraries together and more time building product.

**Design and tech stack:** React 18/19, TypeScript, npm, Storybook, Rollup, PostCSS, Vitest, Playwright, Zustand, Motion, SSR, WebRTC, and open source.

**Links:** Slice UI Kit, npm, and GitHub.

**Visual:** `HeroImage` using the shared Slice placeholder with the cyan bubble background. Replace it with an editorial composition of a polished Slice-powered interface, a concise code example, and one browser or realtime capability. It should communicate that Slice is a product foundation, not just a component gallery.

**Alt text:** Slice UI Kit interface, component code, and browser runtime capabilities shown as one composable React system.

## Highlights

### One design language, implemented in code

Slice starts with a configurable design language for color, spacing, type, motion, icons, and more. The same system is used by components and layout primitives, so product teams are not re-solving visual consistency at every layer.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a visual that shows the token hierarchy and the resulting interface together.

**Alt text:** Slice color tokens and theme controls used to define a consistent interface design language.

### Accessible components for application work

Slice includes reusable primitives for inputs, overlays, media, uploads, panels, containers, and grids. Each component is designed and tested to meet accessibility expectations, so keyboard interaction, semantics, and assistive-technology support are part of the component work rather than a follow-up task.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a composed media component in a real interface context rather than an isolated component demo.

**Alt text:** Slice video component rendered inside an accessible application interface with reusable controls and layout primitives.

### Server-rendering compatibility without a separate path

The library preserves React client directives through the build and provides the pieces needed for server rendering and client hydration. This lets the same package work naturally in Next.js and Remix applications.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a short code crop paired with a rendered server-first interface.

**Alt text:** Slice server-rendering setup showing React client directives preserved for a Next.js or Remix application.

### Browser APIs with an interface you can compose

Microphone, camera, screen sharing, WebRTC, WebSocket, SSE, IndexedDB, audio visualization, and recording are exposed as React hooks and Zustand stores. The API hides repetitive lifecycle work without hiding the controls a product needs.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a visual that highlights the relationship between a browser capability, typed state, and a UI control.

**Alt text:** Slice browser API hooks and stores connecting a device or browser capability to application UI state.

### Realtime and AI-ready primitives

Slice provides building blocks for live audio, video, screen sharing, data channels, and streamed UI. It is designed to make realtime and AI product work easier to compose, not to hide the underlying system entirely.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a realtime visual; a short motion loop is ideal if it can show a live response or stream state changing in the interface.

**Alt text:** Slice realtime primitives supporting a streamed assistant response and live application state.

### One package does not mean one large bundle

The package exposes granular import paths so applications can import the pieces they need. Its small peer and optional dependency surface keeps ownership with the consuming application rather than bundling every integration by default.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a focused import example beside the resulting package footprint or export structure.

**Alt text:** Slice granular imports and export paths allowing an application to include only the modules it uses.

### Designed for performance and responsive app behavior

Components are built with fast mount and remount behavior in mind, and the runtime includes worker abstractions for moving expensive work, such as multi-file uploads, off the main thread.

**Visual:** `ProjectHighlight` using the shared Slice placeholder. Replace it with a focused benchmark or performance trace only when the measurement methodology is available.

**Alt text:** Slice performance tooling and component behavior designed to keep responsive application work off the main thread when appropriate.

## The integration problem

Most frontend products need the same foundational capabilities: a visual system, reliable components, application layout, browser access, state, and increasingly realtime interaction. The usual solution is a collection of separate packages, followed by custom glue to make their types, state, lifecycle, and design rules work together.

Slice is an attempt to make those seams intentional. It provides a single composable foundation where hooks, stores, components, and theme tokens are designed to work together from the start.

**Visual:** `HeroImage` using the shared Slice placeholder. Replace it with a standalone diagram or before-and-after composition contrasting disconnected package categories with the Slice model of UI, state, browser APIs, and realtime primitives sharing one system.

**Alt text:** Comparison between disconnected frontend packages and Slice as a composable foundation for UI, state, browser APIs, and realtime features.

## A single package, designed to stay composable

Slice is not a monolithic framework and it is not a requirement to adopt every layer. Teams can use a component, a hook, a store, or a provider independently, while retaining the option to compose them together when a feature crosses those boundaries.

- **Shared types:** Hooks return values that components can accept without mapping or adapter code.
- **Shared state model:** Browser and realtime capabilities can be accessed through hooks or Zustand stores, depending on the product need.
- **Shared visual language:** Theme tokens, components, and layouts use the same design vocabulary.
- **Granular adoption:** Export paths let consumers use specific modules rather than importing the entire library.

**Visual:** No standalone visual required. The highlights above establish the individual layers; this section explains how they fit together.

## Everything composes

The useful abstraction is one that removes repeated wiring without making the underlying capability impossible to control. Slice uses shared types so a hook can return exactly the option shape a component expects, turning common browser interactions into direct product code.

**Code example:** Bind the selected microphone to a dropdown using `useMicrophoneStore()` and `Dropdown` props.

**Visual:** No image required. Let the short code example carry the proof.

## Distribution is part of the product

For a public SDK, the package boundary matters as much as the API. Slice publishes granular export paths so consumers can import individual components, hooks, stores, and utilities without paying for unrelated capabilities.

The build has to preserve React directives, produce matching JavaScript and TypeScript entry points, and keep chunk boundaries predictable across environments. That is more than build tooling; it is part of the developer experience the library delivers.

**Visual:** `HeroImage` using the shared Slice placeholder. Replace it with a standalone build and export-map diagram or an annotated Rollup configuration crop showing source modules flowing into granular package entry points, then into a consuming application.

**Alt text:** Slice build pipeline producing granular JavaScript and TypeScript package entry points for consuming React applications.

## Thoroughly documented

Thorough documentation takes time, but it is one of the highest-leverage parts of a public library. A component or hook is only useful when a developer can understand what it does, see how to use it, and make an informed decision about whether it fits their product.

Slice documents the component and API surface, practical examples, and the decisions behind the system. Contributor documentation and architecture notes make the project easier to extend without requiring every new contributor to rediscover the build, export, state, and runtime model from scratch.

**Visual:** `HeroImage` using the shared Slice placeholder. Replace it with a documentation composition pairing a public API or Storybook page with a contributor or architecture document, making the relationship between using Slice and extending Slice clear.

**Alt text:** Slice documentation showing component usage alongside contributor and architecture guidance for extending the library.

## What I intentionally did not build

- **Not just a component library:** Components are one layer in a system that also includes theme, layout, hooks, stores, and browser runtime behavior.
- **Not a monolithic framework:** Consumers can adopt individual modules and keep control of their application architecture.
- **Not a black-box WebRTC wrapper:** The library abstracts lifecycle complexity while keeping product-level controls available.
- **Not an unbounded dependency bundle:** Peer and optional dependencies remain external so consumers decide what their application needs.
- **Not a finished claim of maturity:** Slice is actively maintained and pre-1.0; describe only the features and guarantees that are documented today.

## Lessons learned

The hard part of a public library is not only writing the code. Documentation, examples, Storybook, contributor guidance, architecture notes, export maps, testing, release automation, and clear API boundaries are all part of whether another developer can successfully use it.

WebRTC was a particularly useful example. Building a good abstraction required understanding ICE negotiation, data-channel lifecycle, and replacing tracks without unnecessary renegotiation. The challenge was to remove the repetitive complexity without taking away the controls a real product needs.

**Visual:** Optional standalone visual. Use a restrained lifecycle diagram for a WebRTC connection only if it clarifies the abstraction; otherwise keep this section text-led.

## My role

I am the sole author and maintainer of Slice: product direction, component and API design, theme system, browser and realtime abstractions, build engineering, documentation, testing, CI/CD, and npm publishing.

The library has been published through 34 releases. More importantly, it is used as a real foundation in Uris Design, where its theme, layout, media-device, notification, and WebRTC primitives operate together in a live product.
