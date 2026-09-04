# G-P Gia

## Header

**Title:** Trusted HR expertise, turned into action

**Subtitle:** Gia is an AI-native, global HR workspace fluent across 50+ countries. Its guidance is built and reviewed by in-market legal and HR professionals, then turned into work teams can inspect, refine, and use.

**Design and tech stack:** User research, concept design, early prototyping and testing, design language, product design, React, Node.js BFF, Redis, DynamoDB, WebSockets, and collaborative document editing.

**Links:** None required for the case study.

**Visual:** `HeroImage`. Use a complete shipped-product workspace shot that makes the two pillars visible in one frame: an HR question and sourced guidance beside a generated, editable artifact. Do not use raw design files or proprietary code.

**Alt text:** Gia workspace showing an HR question, sourced guidance, and a generated document.

## Highlights

### Trust has to be visible

In high-stakes HR and legal-adjacent work, a fluent answer is not enough. That is especially true when teams work across 50+ countries, where local context can materially change how guidance should be understood and applied. Gia's guidance is built and reviewed by in-market legal and HR professionals, giving users a stronger foundation than a general-purpose model can provide from an uncurated prompt alone.

**Visual:** `ProjectHighlight`. Use a shipped-product crop that shows an answer with citations or source material in view. If the interface makes expert authorship or source provenance visible, include it. The key is the relationship between the answer and the expert-reviewed evidence, not the visual density of the interface.

**Alt text:** Gia answer with visible citations and approved source material.

### Guidance becomes a usable artifact

Gia moves beyond the traditional chat endpoint. Research and guidance can become an HR document that a team can review, edit, collaborate on, and carry into a real process.

**Visual:** `ProjectHighlight`. Use a before-and-after product sequence, or a single frame that clearly connects a research answer to a generated editable document.

**Alt text:** Gia research guidance transformed into an editable HR document.

### A workspace, not a prompt box

The experience keeps the question, supporting evidence, generated work, and next steps in view together. People do not have to choose between asking the system and doing the work.

**Visual:** `ProjectHighlight`. Use a wider workspace view that shows the relationship among conversation, source material, and a working document.

**Alt text:** Gia workspace combining conversation, source material, and a working document.

### Collaboration is part of the outcome

Generated work is a starting point, not a handoff. Gia supports the human review and collaboration needed to turn an informed draft into something a team is ready to use.

**Visual:** `ProjectHighlight`. Use a product shot of an artifact being edited, reviewed, or collaboratively worked on. Preserve any confidential user or company information in the capture.

**Alt text:** Team reviewing or collaboratively editing a generated HR artifact in Gia.

### Compliance changes become actionable work

Gia is not limited to waiting for a question. When a team adds its own HR content, documents, and contracts to its knowledge base, Gia can assess relevant regulatory updates against that material and surface where current policy may need attention.

The product changes the starting point from "What should I ask?" to "Something changed. Here is where it may affect your organization, and here is what you need to review or do next."

**Visual:** `ProjectHighlight`. Use a shipped-product compliance-monitoring state that makes the causal chain clear: regulatory update, affected company material, impact assessment, and a recommended next action. Remove or anonymize sensitive document details.

**Alt text:** Gia compliance monitor showing a regulatory update, its potential impact on company HR policy, and the next action to review.

### Trustworthy interaction needs a dependable system

The product paired a polished React workspace with a Node.js BFF, durable data and cache layers, realtime updates, and collaborative document editing. The technical foundation existed to make the product feel clear and dependable at every step.

**Visual:** `ProjectHighlight`. Use a conceptual architecture diagram rather than proprietary code or internal system documentation. Show only the product-facing relationships: React workspace, Node.js BFF, AI and source services, Redis, DynamoDB, WebSockets, and collaborative documents.

**Alt text:** Conceptual Gia architecture connecting the workspace, BFF, source services, realtime updates, and collaborative documents.

## Generative AI needed to meet a higher bar for trust

HR teams work with decisions where context, policy, and compliance matter. For global teams working across 50+ countries, the country-specific context is part of the answer, not an edge case. That creates an unusually high threshold for trust: a generic chat interface could make an answer feel fast, but it could not make the answer appropriately trustworthy or ready to act on.

Gia was designed to raise the quality bar for HR guidance. Instead of relying only on broad, general-purpose model knowledge, it starts with material written and reviewed by the in-market legal and HR professionals closest to the work. The goal was a meaningfully stronger answer for professional HR questions, with the provenance to understand and verify it.

The core product question was: how can generative AI meet that higher threshold of trust while helping a professional research and move work forward, with the evidence, uncertainty, and human judgment still visible?

**Visual:** `HeroImage`. Use a restrained conceptual comparison between an opaque answer and Gia's reviewable workflow. The diagram should clarify the product premise without making claims about hidden model reasoning.

**Alt text:** Comparison between an opaque AI answer and Gia's expert-grounded, reviewable workflow.

## Trust was a product feature

Gia was designed around a deliberately stronger knowledge foundation: material written and reviewed by in-market legal and HR professionals, citations that stay connected to the answer, and clearer paths for a professional to inspect the underlying guidance. Its global scope means that trusted expertise needs to be useful across 50+ countries without flattening the local context that gives HR guidance meaning.

- **Expert-built knowledge:** In-market legal and HR professionals write and review the source material that grounds the experience.
- **Grounded guidance:** The experience centers on that reviewed material rather than asking users to accept a black-box response.
- **Global context:** Gia is fluent across 50+ countries, so users can approach country-specific HR work with the local context it requires.
- **Visible citations:** Source material is part of the interface, so users can understand where guidance came from and investigate further.
- **Transparent guardrails:** Gia does not fill gaps with invented information. When it cannot find suitable information for a confident answer, it says so and points the user toward resources that can help.
- **Professional control:** The system helps people form a confident judgment; it does not pretend to replace that judgment.

**Visual:** No standalone visual required if the first highlight already shows the source-and-answer relationship. Otherwise, use a tightly cropped sourced-answer state from the shipped product.

## Teaching Gia with in-market expertise

The knowledge foundation alone was not enough. We also needed a practical way for the lawyers and HR professionals closest to each country to shape how Gia handled real work.

I helped create an internal Teach Gia tool where in-market experts could work from seed questions based on real HR incidents and events. They could evaluate the question, identify the decision at hand and the information required to make it responsibly, review the relevant material, then either generate a response or ask for the additional context needed to proceed.

This made the product more than a general model placed in front of a source library. Expert feedback could iteratively improve how Gia approached country-specific HR questions, including when the right next step was to ask for more information, acknowledge that it did not have suitable information, or direct the user to useful resources rather than produce an overconfident answer.

- **Start with real scenarios:** Seed questions make the teaching process relevant to the situations HR teams actually encounter.
- **Clarify the decision:** Experts identify what needs to be decided before jumping to a response.
- **Identify required information:** The workflow distinguishes between what is known and what must be gathered to proceed responsibly.
- **Review evidence:** The response remains grounded in the relevant expert material and local context.
- **Respond, ask, or redirect:** Gia can produce a useful answer when the context supports it, ask for the missing information a professional would need, or clearly say it cannot answer and point to helpful resources.
- **Improve through review:** Repeated expert evaluation helps sharpen Gia's behavior over time.

**Visual:** `HeroImage`. Use a conceptual teaching-workflow diagram, not screenshots of the internal tool or private prompts. Show the loop at a high level: seed question -> clarify decision and required information -> review expert material -> answer or request context -> expert evaluation -> improved behavior.

**Alt text:** Conceptual Teach Gia workflow showing in-market experts using real HR scenarios to evaluate questions, review evidence, generate or request context, and improve Gia's responses.

## From research to action

A conversation was only the beginning of the workflow. The product needed to help users go from a question to understanding, verification, creation, collaboration, and action without losing the context that made the work trustworthy.

**Ask -> Understand -> Verify -> Create -> Collaborate -> Act.** This progression became the organizing principle for both the product experience and the underlying system.

**Visual:** `HeroImage`. Use a conceptual workflow diagram or a sequence of anonymized shipped-product crops. The artifact must be visibly connected to research and review, not presented as a one-click document-generation trick.

**Alt text:** Gia workflow from question through sourced research, document creation, collaboration, and action.

## Compliance monitoring turns change into a next step

For customers, the risk is not only answering a hard HR question incorrectly. It is missing an external change that could affect the policies, documents, and contracts they already use.

Gia's compliance monitor gives teams a more proactive workflow. After they add their own relevant HR content to the knowledge base, Gia can analyze regulatory updates, assess potential impact on existing policy, and point people to the documents and actions that need review.

- **See the change:** A relevant regulatory update is surfaced instead of waiting for a user to know that a question needs asking.
- **Connect it to company context:** Gia evaluates the update against the team's own HR policies, documents, and contracts in the knowledge base.
- **Understand the impact:** The user can see why the change may matter and which current material warrants attention.
- **Move into action:** The output becomes a concrete review or follow-up path, not a generic alert.

**Visual:** `HeroImage`. Use an annotated product sequence or a conceptual flow: regulatory update -> customer knowledge base -> impact assessment -> policy or document review -> next action. Keep the screenshot content anonymized and do not show private documents in full.

**Alt text:** Gia compliance-monitor workflow from regulatory update through company-document impact assessment to a recommended policy review action.

## Architecture in service of the workflow

I led implementation of the React frontend and Node.js BFF, pairing the interaction model with Redis, DynamoDB, WebSockets, and collaborative document editing. This is intentionally a conceptual view of the system, not a disclosure of proprietary internals.

The architecture supported a responsive workspace where source-aware answers, working documents, and team edits could stay coordinated as the user moved from exploration into action.

- **React workspace:** Brings research, evidence, generated artifacts, and editing into one coherent product experience.
- **Node.js BFF:** Owns the application-facing boundary between the UI and product services.
- **Redis and DynamoDB:** Support responsive product state and durable data where the workflow needs it.
- **WebSockets and collaborative editing:** Keep shared document work and realtime interface updates coordinated.

**Visual:** `HeroImage`. Use a sparse conceptual architecture diagram. Keep labels at a product-appropriate level and omit internal implementation details, credentials, data models, and proprietary service topology.

**Alt text:** Conceptual Gia architecture from React workspace through a Node.js BFF to source services, Redis, DynamoDB, WebSockets, and collaborative documents.

## What I intentionally did not build

- **Not a generic chatbot:** The goal was a professional environment for high-stakes, global HR work, not an open-ended answer box.
- **Not only reactive:** Gia can monitor regulatory changes against a customer's own knowledge base and surface where HR policies or documents may need action.
- **Not fabricated certainty:** When Gia lacks suitable information for a confident answer, it says so and directs users toward helpful resources rather than making up an answer.
- **Not a black box:** Expert-authored and reviewed material, sources, citations, and review were part of the product because opacity is a poor foundation for compliance confidence.
- **Not a one-shot prompt workflow:** In-market experts could iteratively teach and evaluate Gia with real HR scenarios, including when the correct response was to ask for more context.
- **Not a document generator in isolation:** Artifacts remain connected to the research and human review that gives them context.
- **Not a substitute for professional judgment:** Gia makes expertise easier to access, understand, and apply while keeping people accountable for the decisions they make.
- **Not a case study about proprietary implementation:** Screenshots show the shipped product; diagrams explain the conceptual system without exposing code or design files.

## My role

I owned user research, concept design, early prototyping and testing, the design language, and the full UI/UX. I then led implementation of the React frontend and Node.js BFF, including the realtime and collaborative document-editing workflows that carried the experience from idea to shipped product.

The work centered on two linked ideas: make generative AI trustworthy enough for high-stakes HR work, then make it actionable enough to help teams move real work forward.
