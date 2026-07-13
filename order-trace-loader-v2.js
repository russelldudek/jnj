(() => {
  if (!document.querySelector('link[data-order-trace-journey-style]')) {
    const journeyStyles = document.createElement('link');
    journeyStyles.rel = 'stylesheet';
    journeyStyles.href = 'order-trace-journey.css?v=20260713-publicqa2';
    journeyStyles.dataset.orderTraceJourneyStyle = 'true';
    document.head.appendChild(journeyStyles);
  }

  const hero = document.querySelector('.hero');
  if (!hero || hero.classList.contains('hero-journey')) return;

  const replacement = document.createElement('div');
  replacement.innerHTML = `<section class="hero hero-journey" aria-labelledby="hero-title">
  <div class="journey-shell">
    <aside class="journey-intro">
      <div class="hero-copy">
        <h1 id="hero-title">Make every order <em>explainable.</em></h1>
        <p class="lead">A MedTech Digital Factory should convert recurring friction into governed process products — making every exception visible, every decision accountable, and every improvement reusable.</p>
        <div class="role-line">Director, MedTech Digital Factory - OTC<span>Johnson &amp; Johnson MedTech | Candidate vision by Russell Dudek</span></div>
        <div class="hero-actions"><a class="btn primary" href="#simulator">Explore the operating model</a><a class="btn light" href="resume.html">View role-aligned resume</a></div>
        <div class="journey-value-list" aria-label="Value created by the Order Trace">
          <div class="journey-value"><b>01</b><div><strong>Protect commitments</strong><span>Keep the customer promise visible across every handoff.</span></div></div>
          <div class="journey-value"><b>02</b><div><strong>Reduce recurrence</strong><span>Intervene where friction begins, not only where it surfaces.</span></div></div>
          <div class="journey-value"><b>03</b><div><strong>Clarify authority</strong><span>Make human judgment, escalation, and evidence explicit.</span></div></div>
          <div class="journey-value"><b>04</b><div><strong>Compound learning</strong><span>Turn proven improvements into governed process products.</span></div></div>
        </div>
      </div>
    </aside>

    <div class="journey-workspace" aria-label="Interactive Order Trace journey">
      <div class="journey-toolbar">
        <div><h2>The end-to-end journey</h2><p>Select a checkpoint to inspect the decision, ownership, evidence, consequence, and intervention.</p></div>
        <div class="journey-status"><span data-journey-position>Decision 2 of 8</span></div>
      </div>

      <div class="journey-rail-wrap" aria-label="Order-to-Cash lifecycle checkpoints">
        <div class="journey-rail" role="group" aria-label="Select a lifecycle decision point">
          <div class="journey-line" aria-hidden="true"></div><div class="journey-line-progress" aria-hidden="true"></div><div class="journey-packet" aria-hidden="true"></div>
          <button class="journey-step" data-stage="commitment" aria-pressed="false"><span class="journey-step-index">01</span><span class="journey-step-node"><span>01</span></span><span class="journey-step-label">Customer commitment</span><span class="journey-step-summary">Define the promise and its evidence.</span></button>
          <button class="journey-step" data-stage="validation" aria-pressed="true"><span class="journey-step-index">02</span><span class="journey-step-node"><span>02</span></span><span class="journey-step-label">Validation</span><span class="journey-step-summary">Confirm data, terms, policy, and quality.</span></button>
          <button class="journey-step" data-stage="availability" aria-pressed="false"><span class="journey-step-index">03</span><span class="journey-step-node"><span>03</span></span><span class="journey-step-label">Availability + fulfillment</span><span class="journey-step-summary">Match supply and priority to the promise.</span></button>
          <button class="journey-step" data-stage="delivery" aria-pressed="false"><span class="journey-step-index">04</span><span class="journey-step-node"><span>04</span></span><span class="journey-step-label">Delivery</span><span class="journey-step-summary">Make handoff, proof, and recovery visible.</span></button>
          <button class="journey-step" data-stage="invoice" aria-pressed="false"><span class="journey-step-index">05</span><span class="journey-step-node"><span>05</span></span><span class="journey-step-label">Invoice</span><span class="journey-step-summary">Create an accurate financial claim.</span></button>
          <button class="journey-step" data-stage="payment" aria-pressed="false"><span class="journey-step-index">06</span><span class="journey-step-node"><span>06</span></span><span class="journey-step-label">Payment</span><span class="journey-step-summary">Resolve barriers with explicit authority.</span></button>
          <button class="journey-step" data-stage="learning" aria-pressed="false"><span class="journey-step-index">07</span><span class="journey-step-node"><span>07</span></span><span class="journey-step-label">Learning</span><span class="journey-step-summary">Classify recurrence and adoption burden.</span></button>
          <button class="journey-step" data-stage="reuse" aria-pressed="false"><span class="journey-step-index">08</span><span class="journey-step-node"><span>08</span></span><span class="journey-step-label">Reusable improvement</span><span class="journey-step-summary">Scale only what transfers with value.</span></button>
        </div>
      </div>

      <div class="journey-legend" aria-hidden="true"><span class="legend-upstream"><i></i>Upstream decision</span><span class="legend-current"><i></i>Current decision</span><span><i></i>Downstream decision</span></div>

      <div class="journey-decision" aria-live="polite">
        <div class="journey-decision-header"><strong>Current decision point</strong><span class="journey-hypothesis-tag">Operating hypothesis for discovery</span></div>
        <div class="journey-decision-grid">
          <div class="journey-decision-cell journey-primary"><span data-journey-checkpoint>02 · Selected checkpoint</span><h2 data-stage-title>Validation</h2><p data-stage-copy>Are the order, terms, pricing, data, and regulatory conditions complete enough to proceed?</p><div class="lens" data-stage-lens><span>Customer</span><span>Data</span><span>Policy</span><span>Quality</span></div></div>
          <div class="journey-decision-cell"><span>Decision ownership</span><ul class="journey-list" data-journey-owners><li>Order management</li><li>Commercial operations</li><li>Quality / regulatory</li><li>Finance</li></ul></div>
          <div class="journey-decision-cell"><span>Required evidence</span><ul class="journey-list" data-journey-evidence><li>Complete order data</li><li>Pricing and terms</li><li>Regulatory status</li><li>Shipping and contract approvals</li></ul></div>
          <div class="journey-decision-cell"><span>If unresolved</span><ul class="journey-list" data-journey-consequences><li>Fulfillment hold</li><li>Delivery delay</li><li>Revenue and customer trust at risk</li></ul></div>
          <div class="journey-decision-cell journey-action"><span>Recommended intervention</span><p data-journey-action>Close material data and approval gaps before releasing the order to fulfillment.</p><a href="#simulator">Explore intervention logic <span aria-hidden="true">→</span></a></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
  hero.replaceWith(replacement.firstElementChild);

  if (!document.querySelector('script[data-order-trace-journey-script]')) {
    const journeyScript = document.createElement('script');
    journeyScript.src = 'order-trace-journey.js?v=20260713-publicqa2';
    journeyScript.dataset.orderTraceJourneyScript = 'true';
    document.body.appendChild(journeyScript);
  }
})();
