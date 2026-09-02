# Uris Design

## Header

**Title:** AI-native portfolio workspace

**Subtitle:** A design-engineered portfolio where hiring teams can browse work normally or ask focused questions through a grounded realtime assistant. Built with Next.js, WebRTC, OpenAI Realtime, and Slice.

**Design and tech stack:** Next.js 16, React 19, TypeScript, WebRTC, OpenAI Realtime API, App Router, static generation, dynamic imports, Zustand, Slice, shared API layer, and Biome.

**Links:** uris.design, GitHub, and OpenAI Realtime API.

**Visual:** `HeroImage` placeholder. Replace with an editorial product shot or short loop of the complete workspace: an active conversation beside the project or skills view it opened.

**Alt text:** Realtime portfolio workspace with an assistant conversation beside an opened project view.

## Highlights

### Ask better portfolio questions

Visitors can ask the same focused questions that come up in a hiring conversation, then move directly to the work that answers them.

**Visual:** `ProjectHighlight` placeholder. Show a realistic question about design systems, AI, or realtime work and the assistant's answer.

**Alt text:** Assistant conversation answering a portfolio question about design systems, AI, or realtime work.

### Conversation helps drive the interface

Vi is not a detached chat widget. It can guide people to the evidence behind its answer, tying conversation to navigation.

**Visual:** `ProjectHighlight` placeholder. Show a skills or project panel opened by the conversation. Make the cause and effect clear: question, response, evidence.

**Alt text:** A portfolio skills or project panel opened in response to an assistant conversation.

### Voice is optional and interruptible

Voice accelerates discovery for visitors who want it, while conventional browsing and text remain first-class paths.

**Visual:** `ProjectHighlight` placeholder. Show the active voice state: microphone controls, transcript, assistant response, and a visible text or navigation path. A muted loop is preferred if it improves clarity.

**Alt text:** Voice conversation interface showing microphone controls, a transcript, and an assistant response.

### AI with clear boundaries

The assistant works from structured portfolio data and a small set of defined actions, rather than being given broad, opaque authority.

**Visual:** `ProjectHighlight` placeholder. Show a simple tool-surface graphic with three groups: retrieve project or skills data, open a known view, and update selected UI settings.

**Alt text:** Diagram showing the assistant's bounded actions: portfolio retrieval, view navigation, and selected settings updates.

### A real system behind the interface

The experience combines static delivery, realtime WebRTC events, stateful UI, and reusable design-system primitives in one application.

**Visual:** `ProjectHighlight` placeholder. Use an architecture graphic or annotated code-and-UI composition showing: structured content -> Next.js -> realtime session and tools -> workspace UI.

**Alt text:** Architecture diagram connecting structured content, Next.js, realtime tools, and the portfolio workspace.

## From brochure to conversation

Hiring managers rarely review a portfolio in a linear order. They arrive with questions: Can this person design systems? Have they built with AI? Can they ship complex frontend work? Standard portfolios make reviewers hunt for answers across disconnected pages.

I treated the portfolio as a product problem. The goal was not to replace browsing with a chatbot, but to give visitors a faster way to discover the relevant evidence when they already know what they want to learn.

**Visual:** `HeroImage` placeholder. Show the question-to-evidence flow from a visitor's perspective: ask a question, receive a response, inspect the opened case study.

**Alt text:** Flow from a visitor question to an assistant response and the relevant case study opened in the workspace.

## A workspace, not a chat overlay

The site supports two complementary modes. A visitor can explore projects, skills, and contact information directly, or ask Vi for a shortcut. Conversation is an optional discovery layer, not a gatekeeper.

When a question becomes specific, the assistant can retrieve relevant context and open the matching project, skills area, or contact surface. The interface follows the conversation, so the answer is always connected to something the visitor can inspect for themselves.

- **Browse directly:** Project and skill content remains visible and usable without AI or microphone access.
- **Ask a focused question:** The assistant helps visitors find the right work or implementation detail without forcing a fixed reading order.
- **Inspect the evidence:** Navigation opens the relevant view so claims stay connected to the underlying project material and visible content.
- **Stay in control:** Voice can be muted, interrupted, or avoided in favor of text and standard navigation.

## Useful AI needs visible limits

The difficult part was not connecting a model to a microphone. It was defining what the assistant should know and what it should be allowed to do.

Vi begins with structured summaries of the portfolio and can request more complete project or skills data through explicit tools. Its actions are deliberately narrow: retrieve portfolio information, guide visitors to a known view, and adjust selected interface settings. It cannot take arbitrary actions.

- **Grounded answers:** Project and skills content comes from structured server data rather than a prompt-only approximation.
- **Explicit contracts:** Tool definitions constrain the accepted input and available actions.
- **Predictable navigation:** The assistant can open known portfolio views, not manipulate the browser freely.
- **Auditable interaction:** Typed events and bounded callbacks keep realtime behavior easier to reason about and extend.

**Visual:** `HeroImage` placeholder. Use the final tool-surface diagram after the list if it is not already shown in the highlights. Otherwise, use a focused interface state that makes the boundary visible.

**Alt text:** Diagram showing the assistant's bounded actions: portfolio retrieval, view navigation, and selected settings updates.

## Architecture shaped around the experience

The application has two different jobs: deliver a fast, well-structured portfolio by default, then support a live conversation only when a visitor chooses to engage. The architecture reflects that split.

- **Fast content delivery:** Known project routes and their structured content are generated ahead of time, keeping the portfolio useful before any interactive layer loads.
- **Realtime conversation:** WebRTC carries the live audio stream, while a dedicated data channel carries model events, transcripts, and tool activity.
- **State ownership:** Separate stores own connection lifecycle, assistant speech state, response history, and streaming output.
- **Clear application boundary:** A Next.js route handler represents the app-facing session boundary while a shared API layer owns the external realtime integration.
- **Progressive interactivity:** Stateful workspace, settings, and AI surfaces run on the client without making the entire content experience client-only.

**Visual:** `HeroImage` placeholder. Use a sparse four-layer diagram: structured content, Next.js delivery and session boundary, realtime transport and tools, workspace UI and state.

**Alt text:** Architecture diagram showing structured content, Next.js delivery, realtime tools, and workspace UI state.

## Slice UI Kit as the foundation

This project is a real-world proving ground for Slice, my UI and browser runtime library. Shared primitives for theme, layout, notifications, media devices, and WebRTC keep the interface cohesive while exercising the system in a live application.

The portfolio and the library strengthen each other: the product tests Slice under responsive layout, device selection, connection state, streaming content, and changing interface surfaces.

**Visual:** `HeroImage` placeholder. Pair a focused workspace UI crop with the corresponding Slice primitive or API snippet. Link to the Slice case study rather than repeating its implementation details here.

**Alt text:** Portfolio workspace UI paired with the Slice primitives that support its layout, media, and realtime behavior.

## What I intentionally did not build

- **Not a voice-only portfolio:** Conventional browsing remains the reliable baseline and supports different preferences and environments.
- **Not an autonomous agent:** The assistant has a small, defined tool surface because predictability matters more than novelty.
- **Not a generic chat widget:** Conversation can change the relevant view; it is connected to the product instead of layered over it.
- **Not a fully client-rendered app:** Static project delivery protects the fast content experience, while client state is used where it provides real value.
- **Not a one-off visual prototype:** The experience is built on reusable architecture and Slice primitives that are extensible and can support other products.

## My role

I owned the product concept, information architecture, interaction model, UI system, Next.js application architecture, realtime integration, state model, and the shared API boundary. I also built the underlying Slice primitives the workspace relies on.

The result is a compact example of how I work on product teams: start with a human interaction and a clear product constraint, then carry it through interface design, frontend systems, and the implementation details that make it dependable.
