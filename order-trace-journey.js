(() => {
  const workspace = document.querySelector('.journey-shell');
  const buttons = [...document.querySelectorAll('.journey-step[data-stage]')];
  if (!workspace || !buttons.length) return;

  const stageMeta = {
    commitment: {
      title: 'Customer commitment',
      question: 'What did we promise, to whom, by when, and with what evidence?',
      lenses: ['Customer', 'Work', 'Control', 'Economics'],
      owners: ['Commercial', 'Customer service'],
      evidence: ['Customer identity and need', 'Terms and promised date', 'Service and delivery conditions'],
      consequences: ['Expectation mismatch', 'Downstream rework', 'Relationship recovery burden'],
      action: 'Create one visible commitment record before downstream work begins.'
    },
    validation: {
      title: 'Validation',
      question: 'Are the order, terms, pricing, data, and regulatory conditions complete enough to proceed?',
      lenses: ['Customer', 'Data', 'Policy', 'Quality'],
      owners: ['Order management', 'Commercial operations', 'Quality / regulatory', 'Finance'],
      evidence: ['Complete order data', 'Pricing and terms', 'Regulatory status', 'Shipping and contract approvals'],
      consequences: ['Fulfillment hold', 'Delivery delay', 'Revenue and customer trust at risk'],
      action: 'Close material data and approval gaps before releasing the order to fulfillment.'
    },
    availability: {
      title: 'Availability and fulfillment',
      question: 'Can supply, allocation, configuration, and fulfillment decisions support the commitment?',
      lenses: ['Supply', 'Priority', 'Handoff', 'Economics'],
      owners: ['Supply planning', 'Fulfillment', 'Business owner'],
      evidence: ['Product and configuration match', 'Available-to-promise signal', 'Allocation rules and exceptions'],
      consequences: ['Expedite burden', 'Commitment miss', 'Inconsistent prioritization'],
      action: 'Expose allocation trade-offs and preserve accountable business authority.'
    },
    delivery: {
      title: 'Delivery',
      question: 'Is the physical and digital handoff visible, timely, and exception-aware?',
      lenses: ['Customer', 'Logistics', 'Proof', 'Recovery'],
      owners: ['Fulfillment', 'Logistics', 'Customer service'],
      evidence: ['Shipment status', 'Chain-of-custody evidence', 'Proof of delivery', 'Exception communication'],
      consequences: ['Resolution delay', 'Dispute risk', 'Customer recovery work'],
      action: 'Make delivery evidence part of standard work, with assisted recovery for missing signals.'
    },
    invoice: {
      title: 'Invoice',
      question: 'Did the transaction become a clear, accurate, supportable financial claim?',
      lenses: ['Accuracy', 'Control', 'Cycle time', 'Rework'],
      owners: ['Finance', 'Commercial operations'],
      evidence: ['Approved price and terms', 'Fulfillment evidence', 'Customer master data', 'Tax and policy conditions'],
      consequences: ['Invoice dispute', 'Credit and rebill work', 'Cash delay'],
      action: 'Trace the mismatch to its source before increasing invoice automation.'
    },
    payment: {
      title: 'Payment',
      question: 'What is preventing cash realization, and who has authority to resolve it?',
      lenses: ['Customer', 'Finance', 'Dispute', 'Authority'],
      owners: ['Accounts receivable', 'Commercial owner', 'Finance authority'],
      evidence: ['Open balance and aging', 'Dispute status', 'Commitment and delivery evidence', 'Settlement authority'],
      consequences: ['Longer cash cycle', 'Repeated outreach', 'Relationship erosion'],
      action: 'Route the issue with explicit authority and preserve the customer context.'
    },
    learning: {
      title: 'Learning',
      question: 'Which exception should be eliminated, standardized, assisted, escalated, or intentionally retained?',
      lenses: ['Recurrence', 'Adoption', 'Reuse', 'Value'],
      owners: ['Workflow owner', 'Digital Factory', 'Quality and data partners'],
      evidence: ['Exception taxonomy', 'Recurrence and cycle patterns', 'Adoption behavior', 'Customer and control impact'],
      consequences: ['Local fixes recur', 'Burden migrates', 'Weak solutions survive'],
      action: 'Classify the recurring friction before selecting technology or scale.'
    },
    reuse: {
      title: 'Reusable improvement',
      question: 'Can the proven intervention become a governed process product rather than a one-off fix?',
      lenses: ['Scale', 'Ownership', 'Governance', 'Economics'],
      owners: ['Process-product owner', 'Enterprise digital and data', 'Adopting markets'],
      evidence: ['Stable decision logic', 'Transferable data and controls', 'Named ownership', 'Retained value in use'],
      consequences: ['Scaled burden', 'Low adoption', 'Local exceptions reappear'],
      action: 'Scale only when operating conditions, authority, evidence, and ownership transfer together.'
    }
  };

  const targets = {
    title: document.querySelector('[data-stage-title]'),
    copy: document.querySelector('[data-stage-copy]'),
    lens: document.querySelector('[data-stage-lens]'),
    owners: document.querySelector('[data-journey-owners]'),
    evidence: document.querySelector('[data-journey-evidence]'),
    consequences: document.querySelector('[data-journey-consequences]'),
    action: document.querySelector('[data-journey-action]'),
    position: document.querySelector('[data-journey-position]')
  };

  let activeIndex = 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function renderList(target, items) {
    if (!target) return;
    target.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }

  function selectStage(key, options = {}) {
    const nextIndex = buttons.findIndex(button => button.dataset.stage === key);
    const data = stageMeta[key];
    if (nextIndex < 0 || !data) return;

    activeIndex = nextIndex;
    buttons.forEach((button, index) => {
      const current = index === activeIndex;
      button.setAttribute('aria-pressed', String(current));
      button.classList.toggle('is-upstream', index < activeIndex);
      button.classList.toggle('is-downstream', index > activeIndex);
      button.classList.toggle('is-transitioning', current && !reduceMotion.matches);
      if (current && !reduceMotion.matches) {
        window.setTimeout(() => button.classList.remove('is-transitioning'), 700);
      }
    });

    const progress = activeIndex / (buttons.length - 1);
    const position = 6.5 + (87 * progress);
    const fill = 87 * progress;
    workspace.style.setProperty('--journey-position', `${position}%`);
    workspace.style.setProperty('--journey-fill', `${fill}%`);

    if (targets.title) targets.title.textContent = data.title;
    if (targets.copy) targets.copy.textContent = data.question;
    if (targets.lens) targets.lens.innerHTML = data.lenses.map(item => `<span>${item}</span>`).join('');
    renderList(targets.owners, data.owners);
    renderList(targets.evidence, data.evidence);
    renderList(targets.consequences, data.consequences);
    if (targets.action) targets.action.textContent = data.action;
    if (targets.position) targets.position.textContent = `Decision ${activeIndex + 1} of ${buttons.length}`;

    if (options.focus) buttons[activeIndex].focus();
    if (options.scroll !== false) {
      buttons[activeIndex].scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => selectStage(button.dataset.stage));
    button.addEventListener('keydown', event => {
      let next = activeIndex;
      if (event.key === 'ArrowRight') next = Math.min(buttons.length - 1, activeIndex + 1);
      else if (event.key === 'ArrowLeft') next = Math.max(0, activeIndex - 1);
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      selectStage(buttons[next].dataset.stage, { focus: true });
    });
  });

  selectStage('validation', { scroll: false });
})();
