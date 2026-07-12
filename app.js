(() => {
  if (!document.querySelector('link[href="brand-tokens.css"]')) {
    const brandTokens = document.createElement('link');
    brandTokens.rel = 'stylesheet';
    brandTokens.href = 'brand-tokens.css';
    document.head.insertBefore(brandTokens, document.querySelector('link[href="styles.css"]') || null);
  }

  const brand = document.querySelector('.site-header .brand');
  if (brand && !brand.classList.contains('company-brand')) {
    brand.classList.add('company-brand');
    brand.setAttribute('aria-label', 'Johnson & Johnson MedTech candidate vision home');
    brand.innerHTML = '<span class="company-wordmark"><strong>Johnson &amp; Johnson</strong><em>MedTech</em></span><span class="candidate-qualifier">Candidate vision <b>by Russell Dudek</b></span>';
  }
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy && !heroCopy.querySelector('.hero-company-lockup')) {
    heroCopy.insertAdjacentHTML('afterbegin','<div class="hero-company-lockup"><span class="company-wordmark"><strong>Johnson &amp; Johnson</strong><em>MedTech</em></span><span>Candidate vision for Director, MedTech Digital Factory - OTC<br><b>by Russell Dudek</b></span></div>');
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  }

  const stageData = {
    commitment:['Customer commitment','What did we promise, to whom, by when, and with what evidence?','Customer | Work | Control | Economics',0.06],
    validation:['Validation','Are the order, terms, pricing, data, and regulatory conditions complete enough to proceed?','Customer | Data | Policy | Quality',0.18],
    availability:['Availability and fulfillment','Can supply, allocation, configuration, and fulfillment decisions support the commitment?','Supply | Priority | Handoff | Economics',0.34],
    delivery:['Delivery','Is the physical and digital handoff visible, timely, and exception-aware?','Customer | Logistics | Proof | Recovery',0.50],
    invoice:['Invoice','Did the transaction become a clear, accurate, supportable financial claim?','Accuracy | Control | Cycle time | Rework',0.66],
    payment:['Payment','What is preventing cash realization, and who has authority to resolve it?','Customer | Finance | Dispute | Authority',0.79],
    learning:['Learning','Which exception should be eliminated, standardized, assisted, or intentionally retained?','Recurrence | Adoption | Reuse | Value',0.92],
    reuse:['Reusable improvement','Can the proven intervention become a governed process product rather than a one-off fix?','Scale | Ownership | Governance | Economics',0.99]
  };

  const path = document.getElementById('order-trace-path');
  const packets = [...document.querySelectorAll('.trace-packet')];
  const marker = document.querySelector('.trace-decision');
  const title = document.querySelector('[data-stage-title]');
  const copy = document.querySelector('[data-stage-copy]');
  const lens = document.querySelector('[data-stage-lens]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf;

  function setPoint(el, t) {
    if (!path || !el) return;
    const len = path.getTotalLength();
    const p = path.getPointAtLength(Math.max(0, Math.min(1,t)) * len);
    el.setAttribute('cx', p.x);
    el.setAttribute('cy', p.y);
  }

  function animatePackets(ts=0) {
    if (!path || reduced.matches) return;
    packets.forEach((el,i) => setPoint(el, ((ts/11500)+(i*.31))%1));
    raf = requestAnimationFrame(animatePackets);
  }

  function applyMotionPreference() {
    cancelAnimationFrame(raf);
    if (reduced.matches) {
      [0.12,0.48,0.83].forEach((t,i)=>setPoint(packets[i],t));
    } else raf=requestAnimationFrame(animatePackets);
  }

  document.querySelectorAll('.stage-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.stage;
      const data = stageData[key];
      document.querySelectorAll('.stage-button').forEach(b=>b.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      if (title) title.textContent=data[0];
      if (copy) copy.textContent=data[1];
      if (lens) lens.innerHTML=data[2].split(' | ').map(x=>`<span>${x}</span>`).join('');
      setPoint(marker,data[3]);
    });
  });
  if (path) { setPoint(marker,.06); applyMotionPreference(); reduced.addEventListener?.('change',applyMotionPreference); }

  const scenarios = {
    order:{title:'Order data fails validation',stage:'Validation',classification:'Data integrity and policy ambiguity',intervention:'Redesign the input contract, validate at source, and assist only the unresolved edge cases.',authority:'Commercial and finance owners retain authority over nonstandard terms and policy exceptions.',metric:'First-pass validation; exception recurrence; correction cycle time',scale:'Scale only after the error taxonomy is stable and ownership is explicit.',progress:'38%'},
    allocation:{title:'Demand exceeds available supply',stage:'Availability and fulfillment',classification:'Legitimate variation plus prioritization conflict',intervention:'Create a transparent allocation decision product with agreed rules, escalation boundaries, and customer-impact visibility.',authority:'Business owners retain allocation authority; the system exposes consequences and consistency.',metric:'Commitment reliability; expedite burden; aged allocations',scale:'Reuse the decision logic only where product and market rules are equivalent.',progress:'58%'},
    delivery:{title:'Delivery proof is incomplete',stage:'Delivery',classification:'Handoff and evidence gap',intervention:'Make proof-of-delivery and chain-of-custody evidence part of the standard work, with assisted recovery for missing signals.',authority:'Customer service determines when evidence is sufficient for resolution.',metric:'Proof completeness; dispute rate; recovery time',scale:'Scale after field adoption and exception recovery are instrumented.',progress:'72%'},
    invoice:{title:'Invoice is disputed',stage:'Invoice and payment',classification:'Cross-functional mismatch',intervention:'Trace the dispute to pricing, terms, fulfillment, evidence, or customer master data before automating outreach.',authority:'Finance owns settlement; commercial owners approve relationship-sensitive concessions.',metric:'Dispute recurrence; days to resolution; avoidable credits',scale:'Retire recurring root causes before increasing automation volume.',progress:'84%'},
    adoption:{title:'A digital solution is not being used',stage:'Learning and reuse',classification:'Adoption burden and workflow mismatch',intervention:'Return to the real work, identify behavior and ownership friction, and redesign the intervention around the smallest useful change.',authority:'Workflow owners decide whether the standard improves work enough to sustain.',metric:'Retained use; time saved in real work; exception migration',scale:'Do not scale until behavior change and value are visible together.',progress:'24%'}
  };
  document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=scenarios[btn.dataset.scenario];
    document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    document.querySelector('[data-sim-title]').textContent=d.title;
    for (const key of ['stage','classification','intervention','authority','metric','scale']) {
      document.querySelector(`[data-sim-${key}]`).textContent=d[key];
    }
    document.querySelector('.sim-output').style.setProperty('--progress',d.progress);
  }));

  if (document.querySelector('.trace-stage') && !document.querySelector('script[data-order-trace-loader]')) {
    const journeyScript = document.createElement('script');
    journeyScript.src = 'order-trace-loader-v2.js?v=20260712-clipfix1';
    journeyScript.dataset.orderTraceLoader = 'true';
    document.body.appendChild(journeyScript);
  }
})();
