# Order Trace Journey Redesign

## Purpose

Replace the current circular Order Trace interface with a directional, end-to-end journey that makes progression, decision ownership, evidence, downstream consequence, and intervention logic immediately understandable.

The redesign must preserve the campaign thesis and eight-stage lifecycle while removing the oversized oval buttons, floating center card, visual overlap, excessive glow, and weak hierarchy visible in the current hero.

## Approved Direction

The approved direction is **B — Order Trace Journey**, based on the generated concept mockup reviewed in chat.

The visual system uses:

- a restrained white narrative pane for the candidate thesis;
- a dark MedTech decision workspace for the lifecycle;
- eight ordered checkpoints connected by a single horizontal trace;
- one order packet that moves to the selected checkpoint;
- an active decision brief directly beneath the trace;
- J&J red as the dominant interaction color;
- white, charcoal, soft gray, and restrained teal support colors;
- no invented employer metrics, financial forecasts, or quantified risk scores.

## Information Architecture

### Narrative pane

The left pane retains:

- the Johnson & Johnson / MedTech candidate identity;
- “Make every order explainable.”;
- the existing campaign thesis;
- the role line;
- primary links to the operating model and résumé;
- the OTC working-hypothesis disclosure;
- four concise value outcomes: protect commitments, reduce recurrence, clarify authority, and compound reusable capability.

### Journey workspace

The right pane contains:

1. an “End-to-end journey” heading and a current-position label;
2. the eight lifecycle checkpoints in their canonical order;
3. a single connected trace line;
4. an order packet that transitions between checkpoints;
5. upstream/current/downstream visual states;
6. a decision brief for the selected checkpoint.

### Decision brief

The selected stage displays:

- current decision point and stage number;
- the decision question;
- primary decision owners;
- required evidence;
- likely downstream consequence when unresolved;
- recommended intervention stance;
- the four existing decision lenses.

All stage-specific content is framed as an operating hypothesis, not an assertion about J&J internal operations.

## Interaction Model

- Clicking or keyboard-activating a checkpoint selects it.
- Arrow Left/Right moves between checkpoints.
- Home selects Customer Commitment.
- End selects Reusable Improvement.
- The order packet transitions to the selected checkpoint.
- The trace progress fill updates to the selected checkpoint.
- The selected decision brief updates in place.
- On narrow screens, the selected checkpoint scrolls into view.

## Motion

The role-derived motion is the order packet moving through the OTC lifecycle. The motion must be calm and explanatory, not decorative.

- packet transition duration: approximately 650 ms;
- active checkpoint receives one restrained pulse on state change;
- no continuous orbit, looping glow, or distracting parallax;
- `prefers-reduced-motion: reduce` removes packet transitions, pulse animation, and smooth scrolling while preserving every state and control.

## Responsive Behavior

### Desktop

- two-column hero: narrative pane plus decision workspace;
- all eight checkpoints visible when space permits;
- decision brief uses a multi-column grid.

### Laptop

- narrative pane narrows;
- checkpoint labels remain legible;
- decision brief reduces column count.

### Tablet

- hero becomes vertically composed;
- lifecycle rail scrolls horizontally with snap points;
- decision brief becomes two columns.

### Mobile

- narrative pane appears first;
- lifecycle rail is a horizontal scroll region;
- checkpoint controls retain at least 44 px touch targets;
- decision brief becomes a single column;
- no horizontal page overflow outside the intended rail scroller.

## Accessibility

- semantic buttons for all checkpoints;
- `aria-pressed` communicates selection;
- `aria-live="polite"` announces decision-brief changes;
- visible keyboard focus states;
- keyboard navigation for the journey;
- all content remains available with motion disabled;
- color is not the sole state indicator.

## File Changes

- Modify `index.html` to replace the current circular hero markup and load the new assets.
- Create `order-trace-journey.css` for the redesign as an isolated override layer.
- Create `order-trace-journey.js` for stage metadata, selection, keyboard handling, and packet movement.
- Preserve `styles.css`, `brand-tokens.css`, and `app.js` for shared campaign behavior.
- Add this design record and the implementation plan under `docs/superpowers/`.

## Non-Goals

- No changes to résumé, cover letter, interview brief, entry plan, or PDFs.
- No fabricated performance metrics or internal J&J data.
- No change to the eight-stage lifecycle or campaign thesis.
- No migration to a JavaScript framework.
- No replacement of the full campaign information architecture.

## Acceptance Criteria

- The oval orbit interface is fully removed.
- The lifecycle reads left-to-right in under five seconds.
- The selected checkpoint, order packet, decision question, owners, evidence, consequence, and intervention are visually connected.
- Every checkpoint works with mouse, touch, Enter/Space, and Arrow Left/Right.
- Reduced-motion behavior is complete.
- The hero renders without clipping at 1440×900, 1280×800, 768×1024, and 390×844.
- No invented metrics appear.
- Changes are committed to `russelldudek/jnj` on `main`.