# Uris Design: Design Engineer Case Study Notes

## Review basis

This review is based on both the current project narrative and the implemented application. The technical claims below were verified in the repository:

- The app uses Next.js App Router, static project content, server-side transforms, and client-side interactive surfaces.
- The voice experience uses WebRTC with a dedicated `oai-events` data channel.
- Realtime events update connection, speech, transcript, and response state through dedicated handlers and Zustand stores.
- The assistant receives project summaries at session start and can request structured project and skills data through explicit tools.
- The tool surface is intentionally constrained to project details, skills, navigation, and selected UI settings. It is not an unrestricted agent.
- Slice is a real dependency and foundation for UI, media/device, theme, and WebRTC primitives.

This is not a performance, accessibility, security, or analytics audit. Do not claim conversion, engagement, or usability outcomes unless you have evidence for them.

## Hiring-manager take

This is a strong portfolio piece because it is a working product, not an AI wrapper. It shows a rare overlap of product thinking, interaction design, frontend architecture, realtime systems, and design-system ownership.

The current content explains the feature set well, but it leads with implementation. To pitch a design engineer, lead with the user experience and the decisions that made the system trustworthy and useful. A hiring manager should quickly understand:

1. What problem you chose to solve.
2. What interaction model you designed and why it is better than a conventional portfolio for this context.
3. Which constraints and tradeoffs shaped the experience.
4. How you translated that experience into a robust frontend system.
5. What this says about how you would work on their product team.

## Recommended positioning

Use this as the central framing:

> I designed and built an AI-native portfolio workspace that lets hiring teams explore my work through conversation as well as browsing. The experience combines an intentional interaction model with a production-minded Next.js architecture: grounded portfolio data, bounded AI actions, live WebRTC voice, and reusable UI and browser primitives from Slice.

This is stronger than "I made an AI portfolio." It makes the hybrid role clear: you set product direction and interaction rules, then build the system that delivers them.

## The story to tell

### 1. Start with a credible user problem

Avoid implying that every portfolio needs a voice assistant. The sharper claim is that hiring conversations are naturally question-led, while standard portfolios make reviewers hunt for answers across disconnected pages.

Suggested copy:

> Hiring managers rarely review a portfolio in a linear order. They arrive with a question: Can this person design systems? Have they built with AI? Can they ship complex frontend work? I designed this workspace to turn those questions into a guided path through the evidence, without replacing conventional browsing.

### 2. Make the interaction design visible

The design-engineering value is not simply that Vi can talk. It is that conversation has a clear job: discover, explain, and navigate. Explain why the workspace uses a central conversation surface, panels, and direct navigation rather than placing a generic chat bubble over a conventional site.

Suggested copy:

> Conversation is an optional discovery layer, not a gatekeeper. Visitors can browse normally, then use Vi when they want an answer or a shortcut. When a question becomes specific, the assistant can open the relevant project, skill area, or contact surface so the interface follows the conversation.

### 3. Highlight restraint as a product decision

This is one of the best parts of the implementation. The assistant is grounded in structured project and skills data, and its actions are limited to defined tools. State that plainly: it shows you understand that useful AI interfaces need predictable boundaries.

Suggested copy:

> I intentionally kept the assistant's authority narrow. It can retrieve portfolio information, guide visitors to relevant content, and adjust selected interface settings, but it cannot take arbitrary actions. That keeps the experience legible, testable, and aligned with the user's intent.

### 4. Connect the architecture to experience quality

Technical details land better when they explain an experience outcome. For example, static delivery supports fast initial exploration; client state and WebRTC only activate when someone chooses to engage; typed event handling keeps a live conversation coherent when audio, transcripts, and navigation change together.

Suggested copy:

> The implementation is split along experience boundaries: content remains fast and server-rendered, while the realtime layer hydrates only where interaction needs it. Dedicated state and event handling keep voice, streaming transcripts, tool calls, and UI updates coordinated without turning the interface into a tangle of transport logic.

### 5. Make Slice a proof point, not a footnote

Slice is valuable evidence of systems thinking. Explain what it enabled in this product and link to its own case study. Hiring managers will care that the product validates the library under real constraints, rather than only using a component kit for styling.

Suggested copy:

> The workspace is also a real-world proving ground for Slice, my UI and browser runtime library. Shared primitives for theme, layout, media devices, notifications, and WebRTC let the product stay cohesive while exercising the system in a live application.

## Proposed page facsimile

This is the recommended order and content for the published case study. It is deliberately shaped to work with the current project-page renderer: a header, carousel, titled sections, paragraphs, lists, stats, and supporting images/code.

### 1. Header: establish the product and your role

**Title:** AI-native portfolio workspace

**Subtitle:** A design-engineered portfolio where hiring teams can browse work normally or ask focused questions through a grounded realtime assistant. Built with Next.js, WebRTC, OpenAI Realtime, and Slice.

**Role line:** I owned the product concept, information architecture, interaction model, UI system, frontend architecture, and realtime implementation.

**What this section must communicate:** This is a real product experiment that demonstrates both design judgment and engineering depth. Do not open with a long technology list; the stack can sit beneath the proposition as supporting evidence.

**Recommended visual:** A full workspace screenshot showing a question in the conversation panel and the corresponding project or skill view open beside it. The visitor should understand the concept at a glance.

### 2. Carousel: make the product legible before explaining it

Use five concise visual cards. Each should answer one question a reviewer will have.

**Card: Ask a better portfolio question**

Show a prompt such as "Show me your design-systems work." Copy: "Visitors can ask the same focused questions that come up in a hiring conversation, then move directly to the work that answers them."

**Card: Conversation changes the interface**

Show the assistant opening a relevant project or skills view. Copy: "Vi is not a detached chat widget. It can guide people to the evidence behind its answer, tying conversation to navigation."

**Card: Voice is optional and interruptible**

Show the voice controls and transcript state. Copy: "Voice accelerates discovery for visitors who want it, while conventional browsing and text remain first-class paths."

**Card: AI with clear boundaries**

Show either an annotated tool-call state or a simple tool-surface graphic. Copy: "The assistant works from structured portfolio data and a small set of defined actions, rather than being given broad, opaque authority."

**Card: A real system behind the interface**

Show a clean architecture crop or the Slice relationship. Copy: "The experience combines static delivery, realtime WebRTC events, stateful UI, and reusable design-system primitives in one application."

### 3. The opportunity: hiring review is question-led, not linear

**Section title:** From brochure to conversation

**Content:**

> Hiring managers rarely review a portfolio in a linear order. They arrive with a question: Can this person design systems? Have they built with AI? Can they ship complex frontend work? Standard portfolios make reviewers hunt for answers across disconnected pages.
>
> I treated the portfolio as a product problem. The goal was not to replace browsing with a chatbot, but to give visitors a faster way to discover the relevant evidence when they already know what they want to learn.

**What this proves:** Product framing. You recognized a real behavior, defined a constrained problem, and avoided claiming that AI is universally necessary.

### 4. The interaction model: browsing first, conversation when it helps

**Section title:** A workspace, not a chat overlay

**Content:**

> The site supports two complementary modes. A visitor can explore projects, skills, and contact information directly, or ask Vi for a shortcut. Conversation is an optional discovery layer, not a gatekeeper.
>
> When a question becomes specific, the assistant can retrieve relevant context and open the matching project, skills area, or contact surface. The interface follows the conversation, so the answer is always connected to something the visitor can inspect for themselves.

**Recommended list:**

- **Browse directly** - Project and skill content remains visible and usable without AI or microphone access.
- **Ask a focused question** - The assistant helps visitors find the right work or implementation detail without forcing a fixed reading order.
- **Inspect the evidence** - Navigation opens the relevant view so claims stay connected to the underlying project material.
- **Stay in control** - Voice can be muted, interrupted, or avoided in favor of text and standard navigation.

**Recommended visual:** A simple three-step sequence: question -> assistant response -> relevant project panel opens. This is the most important interaction to show.

### 5. AI trust and scope: explain the restraint

**Section title:** Useful AI needs visible limits

**Content:**

> The difficult part was not connecting a model to a microphone. It was defining what the assistant should know and what it should be allowed to do.
>
> Vi begins with structured summaries of the portfolio and can request more complete project or skills data through explicit tools. Its actions are deliberately narrow: retrieve portfolio information, guide visitors to a known view, and adjust selected interface settings. It cannot take arbitrary actions.

**Recommended list:**

- **Grounded answers** - Project and skills content comes from structured server data rather than a prompt-only approximation.
- **Explicit contracts** - Tool definitions constrain the accepted input and available actions.
- **Predictable navigation** - The assistant can open known portfolio views, not manipulate the browser freely.
- **Auditable interaction** - Typed events and bounded callbacks keep the realtime behavior easier to reason about and extend.

**What this proves:** AI product judgment. This section should feel as important as the realtime implementation because it demonstrates maturity around trust, scope, and user control.

### 6. System design: connect technical choices to product quality

**Section title:** Architecture shaped around the experience

**Intro copy:**

> The application has two different jobs: deliver a fast, well-structured portfolio by default, then support a live conversation only when a visitor chooses to engage. The architecture reflects that split.

**Recommended list:**

- **Fast content delivery** - Known project routes and their structured content are generated ahead of time, keeping the portfolio useful before any interactive layer loads.
- **Realtime conversation** - WebRTC carries the live audio stream, while a dedicated data channel carries model events, transcripts, and tool activity.
- **State ownership** - Separate stores own connection lifecycle, assistant speech state, response history, and streaming output so a live interaction remains predictable.
- **Clear application boundary** - A Next.js route handler represents the app-facing session boundary while a shared API layer owns the external realtime integration.
- **Progressive interactivity** - Stateful workspace, settings, and AI surfaces run on the client without making the entire content experience client-only.

**Recommended visual:** A four-part architecture graphic: structured content -> Next.js delivery and session boundary -> realtime transport and tools -> workspace UI and state. Keep it diagrammatic and sparse; this is an explanation, not a systems map.

### 7. Design-system proof: Slice in a real product

**Section title:** Slice as an operational foundation

**Content:**

> This project is also a real-world proving ground for Slice, my UI and browser runtime library. Instead of treating a design system as a collection of styled components, I used shared primitives for theme, layout, notifications, media devices, and WebRTC.
>
> That reuse matters because the live product tests the system under practical constraints: responsive layout, device selection, connection state, streaming content, and changing interface surfaces. The portfolio and the library strengthen each other.

**Recommended visual:** Pair a small Slice code or API snippet with the corresponding part of the workspace UI. Link directly to the Slice case study for deeper implementation detail.

### 8. Hard decisions: show the tradeoffs that define the work

**Section title:** What I intentionally did not build

**Intro copy:**

> The product is more credible because its scope is intentional. I optimized for a useful hiring interaction, not maximum AI spectacle.

**Recommended list:**

- **Not a voice-only portfolio** - Conventional browsing remains the most reliable baseline and supports different preferences and environments.
- **Not an autonomous agent** - The assistant has a small, defined tool surface because predictability matters more than novelty here.
- **Not a generic chat widget** - Conversation can change the relevant view; it is connected to the product instead of layered over it.
- **Not a fully client-rendered app** - Static project delivery protects the fast content experience, while client state is used where it provides real value.
- **Not a one-off visual prototype** - The experience is built on reusable architecture and Slice primitives that can support other products.

**What this proves:** The ability to make product decisions, manage scope, and articulate tradeoffs. This is a high-signal section for senior reviewers.

### 9. By the numbers: use only factual, non-vanity proof points

**Section title:** The build at a glance

**Recommended stats:**

- `1` - Live assistant
- `WebRTC` - Voice transport
- `SSG` - Project delivery model
- `5` - Defined assistant actions (project details, skills, navigation, settings, all-project view)
- `Next.js 16` - Application framework
- `Slice` - Shared UI and browser runtime layer

Avoid using "24/7 screening surface" as a stat. It reads like a marketing claim rather than meaningful proof.

### 10. My role: name the full span of ownership

**Section title:** Design engineer, end to end

**Content:**

> I owned the product concept, information architecture, interaction model, UI system, Next.js application architecture, realtime integration, state model, and the shared API boundary. I also built the underlying Slice primitives the workspace relies on.
>
> The result is a compact example of how I work on product teams: start with a human interaction and a clear product constraint, then carry it through interface design, frontend systems, and the implementation details that make it dependable.

**Close with:** "This is the kind of work I want to bring to teams building thoughtful AI-native products: experiences where design intent, technical constraints, and user trust are considered together."

## Evidence worth adding

- A 45-90 second walkthrough showing a real question, live response, tool invocation, and navigation to evidence.
- A simple architecture graphic: structured content -> Next.js/server boundary -> Realtime session -> typed events and stores -> workspace UI.
- One annotated interaction flow that explains voice states: idle, listening, responding, interrupted, and recovered.
- A small decision table contrasting "generic chat widget" with "grounded, navigation-aware workspace."
- One example of a design-system primitive from Slice appearing in the product and the implementation constraint it removed.

If user research is unavailable, use qualitative evidence instead: the questions the system is built to answer, a few representative flows, and the decisions you made after testing it yourself. Do not manufacture metrics.

## Important product-polish recommendation

The assistant instructions currently ask Vi to be "flirtatious." For a portfolio aimed at hiring managers, remove that direction. It creates avoidable ambiguity in a professional evaluation context and does not strengthen the product story. "Warm, concise, and helpful" expresses the desired personality without the risk.

Also tighten the existing subtitle and correct the sentence beginning "Imagine that as a candidate you can save simply point..." before publishing.

## What this demonstrates

- Product judgment: choosing when AI improves discovery and when conventional navigation is better.
- Interaction design: making a live assistant visible, optional, interruptible, and connected to the interface.
- Frontend engineering: building a responsive, stateful realtime product with clear server/client boundaries.
- Systems thinking: using structured content and explicit tool contracts to keep behavior grounded and extensible.
- Design-system ownership: applying Slice as an operational foundation, not just a visual layer.

## Bottom line

The strongest pitch is: "I can shape an AI-native product experience end to end, from interaction model and trust boundaries to the frontend architecture that makes it real." The implementation already supports this claim. Reworking the case study around the decisions, constraints, and evidence will make that value much easier for a hiring manager to recognize quickly.
