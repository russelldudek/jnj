(() => {
  const version = '20260712-visualqa3';

  const appendStylesheet = (href, datasetKey) => {
    if (document.querySelector(`link[data-${datasetKey}]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    stylesheet.setAttribute(`data-${datasetKey}`, 'true');
    document.head.appendChild(stylesheet);
  };

  // This cross-route layer is appended after the shared site CSS because app.js
  // runs at the end of each document body.
  appendStylesheet(`site-visual-qa.css?v=${version}`, 'site-visual-qa');

  // The journey stylesheet is injected asynchronously by the existing app core.
  // Wait until the redesigned hero exists, then append the regression layer last
  // so its marker-lane and 1280px composition corrections win the cascade.
  const observer = new MutationObserver(() => {
    if (document.querySelector('.hero-journey')) {
      appendStylesheet(`order-trace-visual-qa.css?v=${version}`, 'order-trace-visual-qa');
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const core = document.createElement('script');
  core.src = `app-core.js?v=${version}`;
  core.dataset.roleforgeAppCore = 'true';
  core.addEventListener('error', () => observer.disconnect());
  document.body.appendChild(core);
})();
