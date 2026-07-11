# J&J RoleForge Campaign QA Record

## Campaign classification

- Repository before reconstruction: planned (empty)
- Repository after source build: building pending commit and live Pages verification
- Canonical branch: main

## Rendered visual review

The complete candidate vision was rendered and inspected at:

- 1440 x 900 desktop
- 1280 x 800 laptop
- 768 x 1024 tablet
- 390 x 844 mobile
- 1440 x 900 with reduced motion

Repairs made during review:

- eliminated mobile horizontal overflow;
- recomposed the mobile header and Order Trace positions;
- rebalanced resume page one by moving a complete evidence module from page two;
- rebuilt resume page two around complementary leadership and selected operating mechanisms;
- removed skip navigation and document controls from print/PDF output;
- increased cover-letter typography and vertical rhythm for a balanced one-page composition.

## Role-derived motion and interaction

- SVG path packets move along the Order Trace lifecycle.
- Selecting a stage moves the decision marker and changes the explanatory lenses.
- The Friction Compression Simulator changes lifecycle stage, exception class, intervention, human authority, proof metric, and scale decision.
- Stage and scenario controls work with keyboard Enter activation.
- Reduced-motion mode stops continuous motion, disables animated lane behavior, and preserves all content and state controls.

## Documents and PDFs

- Resume: 2 Letter pages; page one visually balanced.
- Cover letter: 1 Letter page.
- Interview brief: 4 Letter pages.
- 120-day plan: 3 Letter pages.
- OTC Exception Portfolio Canvas: 2 Letter pages.

Every printable HTML page presents a visible `Download PDF` link to a generated file. Resume and cover letter cross-link visibly in web view and hide the reciprocal controls in print.

## Accessibility and functional checks

- Semantic main region and skip navigation present.
- Visible focus styling is defined.
- Responsive navigation opens on mobile.
- No horizontal overflow at required viewport sizes.
- Interactive state is not dependent on hover.
- Internal relative links and PDF paths resolve in the source manifest.
- Source paths are repository-relative for GitHub Pages deployment.

## Remaining publication gate

The source and PDF set must be committed to `main`, re-fetched from `ref=main`, and compared with the live GitHub Pages deployment. Campaign state remains building until those checks pass.
