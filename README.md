# Johnson & Johnson MedTech Digital Factory - OTC

Independent candidate campaign for Russell Dudek.

## Campaign metadata

- Suggested chat name: Johnson & Johnson - MedTech Digital Factory OTC
- Company: Johnson & Johnson MedTech
- Canonical role: Director, MedTech Digital Factory - OTC
- Repository: `russelldudek/jnj`
- Canonical branch: `main`
- Job posting: https://www.careers.jnj.com/en/jobs/r-087466/director-medtech-digital-factory-otc/?source=LinkedIn
- Print standard: US Letter
- Current campaign state: blocked pending GitHub Pages deployment and live repository-path verification

## Strategic thesis

A Digital Factory should convert recurring OTC friction into governed process products - making every order explainable, every exception visible, and every improvement reusable.

OTC is treated as Order-to-Cash as an operating assumption to validate during discovery against J&J's internal mandate and process boundaries.

## Order Trace Journey

The original circular Order Trace hero was replaced on July 12, 2026 with a directional, end-to-end journey.

The redesigned experience uses:

- eight ordered lifecycle checkpoints;
- a moving order packet and progress trace;
- upstream, current, and downstream decision states;
- a dynamic decision brief covering ownership, required evidence, unresolved consequences, and intervention stance;
- click, touch, Arrow Left/Right, Home, and End interaction;
- complete reduced-motion behavior;
- responsive horizontal rail behavior on laptop, tablet, and mobile without page-level overflow.

The redesign is implemented through `order-trace-loader-v2.js`, `order-trace-journey.css`, and `order-trace-journey.js`. Browser QA is recorded in the committed QA reports.

## Manifest

- `index.html`
- `resume.html`
- `cover-letter.html`
- `interview-brief.html`
- `120-day-plan.html`
- `otc-exception-portfolio.html`
- `brand-intelligence.md`
- `brand-tokens.css`
- `styles.css`
- `app.js`
- `app-core.js`
- `order-trace-loader-v2.js`
- `order-trace-journey.css`
- `order-trace-journey.js`
- `assets/order-trace-mark.svg`
- `assets/brand/README.md`
- `docs/russell-dudek-jnj-resume.pdf`
- `docs/russell-dudek-jnj-cover-letter.pdf`
- `docs/russell-dudek-jnj-interview-brief.pdf`
- `docs/russell-dudek-jnj-120-day-plan.pdf`
- `docs/russell-dudek-jnj-otc-exception-portfolio.pdf`
- `research-notes.md`
- `artifact-manifest.json`
- `campaign-metadata.json`
- Design and implementation records under `docs/superpowers/`
- Rendered and audit evidence under `qa/`

## Brand fidelity

The campaign uses a clearly typeset Johnson & Johnson / MedTech nominative identity because the connected official-page sources did not expose a stable downloadable standalone logo asset. The source URLs, color confidence, licensed/system typography substitute, identity rationale, and independent-candidate distinction are documented in `brand-intelligence.md`, `brand-tokens.css`, `assets/brand/README.md`, and `qa/brand-fidelity-audit.md`.

The Order Trace mark is a supplemental candidate-created operating-system symbol, not an employer logo.

## Publication

The complete source and generated PDF set are committed to `main`. Completion is blocked because the available connector cannot enable or inspect GitHub Pages. Pages must deploy from `main` and `/ (root)`, after which the live HTML routes, reciprocal document links, redesigned journey motion, brand identity, and PDF downloads must be verified.

This is an independent candidate campaign and is not an official Johnson & Johnson publication.
