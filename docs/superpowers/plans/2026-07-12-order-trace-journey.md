# Order Trace Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the circular Order Trace hero with a clear, directional eight-stage journey and interactive decision brief.

**Architecture:** Keep the existing static HTML/CSS/JavaScript campaign. Replace only the hero markup, add an isolated CSS override file, and add a focused journey controller that coexists with the existing shared `app.js` behavior.

**Tech Stack:** Semantic HTML5, CSS custom properties, vanilla JavaScript, Chromium headless rendering.

## Global Constraints

- Preserve the eight canonical lifecycle stages and existing campaign thesis.
- Use no invented employer metrics, risk percentages, savings forecasts, or internal J&J claims.
- Preserve the independent-candidate distinction.
- Use J&J red, white, charcoal, and documented campaign tokens.
- Retain keyboard accessibility and complete `prefers-reduced-motion` behavior.
- Commit approved changes to `russelldudek/jnj` on `main`.

---

### Task 1: Replace the hero structure

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `.hero-copy`, `.stage-button`, `data-stage-*`, `.hero-actions`, and shared `app.js` conventions.
- Produces: `.hero-journey`, `.journey-shell`, `.journey-workspace`, `.journey-rail`, `.journey-decision`, and dynamic `data-journey-*` targets.

- [ ] Replace the circular SVG, orbit buttons, and floating readout with the approved two-pane journey structure.
- [ ] Preserve all eight `data-stage` values and `aria-pressed` semantics.
- [ ] Set Validation as the initial demonstrative state without changing the canonical lifecycle order.
- [ ] Add `order-trace-journey.css` after `styles.css`.
- [ ] Add `order-trace-journey.js` after `app.js`.
- [ ] Verify that no old orbit markup remains.

### Task 2: Build the visual system

**Files:**
- Create: `order-trace-journey.css`

**Interfaces:**
- Consumes: brand tokens from `brand-tokens.css` and shared CSS variables exposed by `styles.css`.
- Produces: responsive journey layout, stage states, progress trace, packet transition, decision brief, and reduced-motion treatment.

- [ ] Implement the white narrative pane and dark decision workspace.
- [ ] Implement the eight-stage horizontal trace with upstream/current/downstream states.
- [ ] Implement the moving order packet and progress fill using dedicated CSS variables.
- [ ] Implement the decision brief grid with clear hierarchy and restrained red emphasis.
- [ ] Implement desktop, laptop, tablet, and mobile layouts.
- [ ] Implement complete reduced-motion overrides.
- [ ] Verify touch targets, focus states, legibility, and intentional horizontal scrolling only inside the journey rail.

### Task 3: Implement journey behavior

**Files:**
- Create: `order-trace-journey.js`

**Interfaces:**
- Consumes: `.journey-step[data-stage]`, dynamic content targets, and the existing canonical stage keys.
- Produces: selected-stage state, upstream/downstream classes, packet position, current position text, and dynamic decision brief content.

- [ ] Define stage metadata for owners, evidence, consequences, and intervention stance without quantified claims.
- [ ] Implement `selectStage(key, options)` as the single state transition function.
- [ ] Update `aria-pressed`, stage classes, trace progress, packet position, and all decision-brief fields.
- [ ] Implement Arrow Left/Right, Home, and End keyboard controls.
- [ ] Scroll the selected stage into view only when needed.
- [ ] Initialize the hero to Validation.

### Task 4: Render and interaction QA

**Files:**
- Create: local-only QA screenshots during implementation.
- Update: `qa/render-report.json` only when the connector workflow can regenerate authoritative repository screenshots.

**Interfaces:**
- Consumes: the finished hero source and browser runtime.
- Produces: evidence that the approved concept is legible and functional at required viewports.

- [ ] Render at 1440×900 and inspect hierarchy, lifecycle readability, and decision brief.
- [ ] Render at 1280×800 and inspect first-viewport fit.
- [ ] Render at 768×1024 and verify vertical composition and rail scrolling.
- [ ] Render at 390×844 and verify no page-level horizontal overflow.
- [ ] Activate multiple stages and verify content, packet position, selected state, and keyboard behavior.
- [ ] Render with reduced motion and verify state remains fully legible.

### Task 5: Commit and verify `main`

**Files:**
- Create: `docs/superpowers/specs/2026-07-12-order-trace-journey-design.md`
- Create: `docs/superpowers/plans/2026-07-12-order-trace-journey.md`
- Modify: `index.html`
- Create: `order-trace-journey.css`
- Create: `order-trace-journey.js`

**Interfaces:**
- Consumes: verified local implementation.
- Produces: final committed source on the campaign repository `main` branch.

- [ ] Commit the design specification.
- [ ] Commit the implementation plan.
- [ ] Commit the hero markup, CSS, and JavaScript.
- [ ] Re-fetch every changed file from `ref=main`.
- [ ] Capture the final `main` head SHA.
- [ ] Keep the campaign state blocked until live GitHub Pages verification passes.