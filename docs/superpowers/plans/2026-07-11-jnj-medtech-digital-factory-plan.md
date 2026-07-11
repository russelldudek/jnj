# J&J MedTech Digital Factory Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a complete RoleForge candidate campaign for Johnson & Johnson MedTech Director, Digital Factory - OTC.

**Architecture:** A static, GitHub Pages-safe HTML/CSS/JavaScript campaign with one shared visual system, an SVG-based Order Trace motion artifact, a stateful Friction Compression Simulator, explicit print-sheet document layouts, and generated PDFs committed under `docs/`.

**Tech Stack:** Semantic HTML5, CSS3, vanilla JavaScript, SVG, Chromium headless PDF generation, Python QA scripts, GitHub connector publication.

## Global Constraints

- Canonical branch is `main`.
- All paths must be repository-relative and GitHub Pages-safe.
- Resume is exactly two US Letter pages.
- Cover letter is exactly one US Letter page.
- All printable pages expose real PDF downloads.
- Motion must explain the role and support `prefers-reduced-motion`.
- Candidate claims must match `memory/candidate-evidence.yaml`.
- `OTC = Order-to-Cash` remains a labeled hypothesis unless verified.

---

### Task 1: Campaign shell and visual system
- [x] Create `index.html`, `styles.css`, `app.js`, and `assets/order-trace-mark.svg`.
- [x] Implement semantic navigation, skip link, focus styles, responsive menu, and GitHub Pages-safe paths.
- [x] Implement the signature trace hero and full-page section pacing.

### Task 2: Role-derived motion and interaction
- [x] Animate trace packets with SVG path geometry and requestAnimationFrame.
- [x] Add lifecycle-stage selection and the Friction Compression Simulator.
- [x] Add complete reduced-motion behavior and keyboard-operable controls.

### Task 3: Printable artifact set
- [x] Create `resume.html`, `cover-letter.html`, `interview-brief.html`, `120-day-plan.html`, and `otc-exception-portfolio.html`.
- [x] Add reciprocal resume/cover-letter navigation.
- [x] Add visible real-PDF download controls and separate Print controls.

### Task 4: PDF generation and QA
- [ ] Generate PDFs with Chromium from local HTTP routes.
- [ ] Verify page counts and render every PDF to PNG.
- [ ] Inspect full-page balance, clipping, orphan headings, split modules, and blank pages.

### Task 5: Responsive and accessibility QA
- [ ] Render the complete site at 1440x900, 1280x800, 768x1024, 390x844, and reduced-motion mode.
- [ ] Verify no overflow, clipped diagrams, hidden controls, or covered content.
- [ ] Verify keyboard navigation, visible focus, skip navigation, and state clarity.

### Task 6: Publish and audit
- [ ] Commit the complete source, assets, HTML routes, scripts, PDFs, and README to `main`.
- [ ] Re-fetch the manifest explicitly from `ref=main`.
- [ ] Capture final audited main SHA.
- [ ] Re-read canonical RoleForge source and run the Canonical Skill Alignment Audit.
- [ ] Run the Campaign Completion Audit and update portfolio learning only after all gates pass.