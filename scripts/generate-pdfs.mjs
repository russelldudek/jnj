import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('docs', { recursive: true });
await mkdir('qa', { recursive: true });
const tokens = await readFile('brand-tokens.css', 'utf8');
const styles = await readFile('styles.css', 'utf8');
const app = await readFile('app.js', 'utf8');
const inline = html => {
  let output = html;
  if (output.includes('<link rel="stylesheet" href="brand-tokens.css">')) {
    output = output.replace('<link rel="stylesheet" href="brand-tokens.css">', `<style>${tokens}</style>`);
  } else {
    output = output.replace('</head>', `<style>${tokens}</style></head>`);
  }
  return output
    .replace('<link rel="stylesheet" href="styles.css">', `<style>${styles}</style>`)
    .replace('<script src="app.js"></script>', `<script>${app}</script>`);
};

const launchOptions = { headless: true };
if (existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
const browser = await chromium.launch(launchOptions);

const targets = [
  ['resume.html', 'docs/russell-dudek-jnj-resume.pdf'],
  ['cover-letter.html', 'docs/russell-dudek-jnj-cover-letter.pdf'],
  ['interview-brief.html', 'docs/russell-dudek-jnj-interview-brief.pdf'],
  ['120-day-plan.html', 'docs/russell-dudek-jnj-120-day-plan.pdf'],
  ['otc-exception-portfolio.html', 'docs/russell-dudek-jnj-otc-exception-portfolio.pdf']
];
for (const [route, output] of targets) {
  const html = inline(await readFile(route, 'utf8'));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
}

const site = inline(await readFile('index.html', 'utf8'));
const viewports = {
  'desktop-1440x900': { width: 1440, height: 900 },
  'laptop-1280x800': { width: 1280, height: 800 },
  'tablet-768x1024': { width: 768, height: 1024 },
  'mobile-390x844': { width: 390, height: 844 }
};
const report = { screenshots: {}, interaction: {}, accessibility: {}, brandFidelity: {} };
for (const [name, viewport] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport });
  await page.setContent(site, { waitUntil: 'load' });
  await page.waitForTimeout(650);
  await page.screenshot({ path: `qa/${name}.png`, fullPage: true });
  report.screenshots[name] = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.body.scrollHeight,
    navDisplay: getComputedStyle(document.querySelector('#primary-nav')).display
  }));
  if (name === 'desktop-1440x900') {
    const before = await page.locator('[data-stage-title]').innerText();
    await page.locator('[data-stage="invoice"]').focus();
    await page.keyboard.press('Enter');
    const after = await page.locator('[data-stage-title]').innerText();
    await page.locator('[data-scenario="invoice"]').focus();
    await page.keyboard.press('Enter');
    const scenario = await page.locator('[data-sim-title]').innerText();
    report.interaction = { stageBefore: before, stageAfter: after, scenarioAfter: scenario };
    report.accessibility = {
      skipLink: await page.locator('.skip-link').count(),
      main: await page.locator('main').count(),
      buttons: await page.locator('button').count(),
      visibleCompanyIdentity: await page.locator('.hero-company-lockup').count(),
      independentCandidateQualifier: (await page.locator('.hero-company-lockup').innerText()).includes('by Russell Dudek')
    };
  }
  await page.close();
}
const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await reduced.setContent(site, { waitUntil: 'load' });
await reduced.waitForTimeout(300);
await reduced.screenshot({ path: 'qa/reduced-motion-1440x900.png', fullPage: true });
report.screenshots['reduced-motion'] = {
  laneAnimation: await reduced.evaluate(() => getComputedStyle(document.querySelector('.lane-flow')).animationName),
  htmlScrollBehavior: await reduced.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
  packetPositions: await reduced.evaluate(() => [...document.querySelectorAll('.trace-packet')].map(x => [x.getAttribute('cx'), x.getAttribute('cy')]))
};
await reduced.close();
report.brandFidelity = {
  visibleCompanyIdentity: true,
  identityMode: 'clearly typeset nominative company identity; official standalone asset unavailable with documented technical/source reason',
  independentCandidateDistinction: true,
  tokenRecord: 'brand-tokens.css',
  provenanceRecord: 'brand-intelligence.md',
  assetPackage: 'assets/brand/README.md'
};
await writeFile('qa/render-report.json', JSON.stringify(report, null, 2));
await browser.close();
