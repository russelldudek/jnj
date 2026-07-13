import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173/';
const outputDirectory = process.env.AUDIT_OUTPUT || 'qa/public-site-audit';
const internalLabel = ['Role', 'Forge'].join('');
const forbiddenPhrases = [
  internalLabel,
  ['the original posting URL is preserved,', 'but its full body was not retrievable.'].join(' '),
  'full posting body was not retrievable'
];
const routes = [
  'index.html',
  'resume.html',
  'cover-letter.html',
  'interview-brief.html',
  '120-day-plan.html',
  'otc-exception-portfolio.html'
];
const documentRoutes = new Set(routes.filter(route => route !== 'index.html'));
const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 }
};

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = {
  date: new Date().toISOString(),
  baseURL,
  browser: 'Chromium via Playwright',
  routes: {},
  interactions: {},
  reducedMotion: {},
  findings: [],
  pass: false
};

const addFinding = finding => report.findings.push(finding);
const rectanglesOverlap = (a, b, clearance = 0) => !(
  a.right + clearance <= b.left ||
  b.right + clearance <= a.left ||
  a.bottom + clearance <= b.top ||
  b.bottom + clearance <= a.top
);

async function auditLinks(page, route, viewportName) {
  const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => ({
    href: element.getAttribute('href'),
    text: element.textContent.trim(),
    visible: Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  })));
  const checks = [];
  for (const link of links) {
    if (!link.href || link.href.startsWith('#') || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) continue;
    const url = new URL(link.href, page.url());
    if (url.origin !== new URL(baseURL).origin) continue;
    const response = await page.request.get(url.href);
    const status = response.status();
    checks.push({ href: link.href, status, text: link.text });
    if (status >= 400) addFinding(`${route} ${viewportName}: broken internal link ${link.href} (${status})`);
  }
  return checks;
}

async function auditDocumentGeometry(page, route, viewportName) {
  if (!documentRoutes.has(route)) return [];
  return page.locator('.sheet').evaluateAll(sheets => sheets.map((sheet, index) => {
    const sheetRect = sheet.getBoundingClientRect();
    const reservedSelector = '.page-number,.doc-id,.footer-source';
    const flowChildren = [...sheet.children].filter(element => !element.matches(reservedSelector));
    const reserved = [...sheet.querySelectorAll(reservedSelector)];
    const contentBottom = Math.max(sheetRect.top, ...flowChildren.map(element => element.getBoundingClientRect().bottom));
    const reservedTop = reserved.length ? Math.min(...reserved.map(element => element.getBoundingClientRect().top)) : sheetRect.bottom;
    return {
      page: index + 1,
      sheetWidth: Number(sheetRect.width.toFixed(2)),
      sheetHeight: Number(sheetRect.height.toFixed(2)),
      scrollWidth: sheet.scrollWidth,
      clientWidth: sheet.clientWidth,
      scrollHeight: sheet.scrollHeight,
      clientHeight: sheet.clientHeight,
      horizontalOverflow: sheet.scrollWidth > sheet.clientWidth + 1,
      contentBeyondSheet: contentBottom > sheetRect.bottom + 1,
      footerClearancePx: Number((reservedTop - contentBottom).toFixed(2))
    };
  }));
}

for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const route of routes) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);
    const status = response?.status() ?? 0;
    const title = await page.title();
    const bodyText = await page.locator('body').innerText();
    const bodyHTML = await page.locator('body').innerHTML();
    const h1Count = await page.locator('h1').count();
    const duplicateIds = await page.evaluate(() => {
      const counts = new Map();
      for (const element of document.querySelectorAll('[id]')) counts.set(element.id, (counts.get(element.id) || 0) + 1);
      return [...counts.entries()].filter(([, count]) => count > 1).map(([id, count]) => ({ id, count }));
    });
    const pageGeometry = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight
    }));
    const brokenImages = await page.locator('img').evaluateAll(images => images
      .filter(image => image.complete && image.naturalWidth === 0)
      .map(image => image.getAttribute('src')));
    const forbidden = forbiddenPhrases.filter(phrase => {
      const needle = phrase.toLowerCase();
      return bodyText.toLowerCase().includes(needle) || bodyHTML.toLowerCase().includes(needle);
    });
    const links = await auditLinks(page, route, viewportName);
    const documentGeometry = await auditDocumentGeometry(page, route, viewportName);
    const downloadPDFVisible = documentRoutes.has(route)
      ? await page.getByRole('link', { name: 'Download PDF' }).isVisible().catch(() => false)
      : null;

    if (status !== 200) addFinding(`${route} ${viewportName}: HTTP ${status}`);
    if (!title.trim()) addFinding(`${route} ${viewportName}: missing page title`);
    if (!bodyText.trim()) addFinding(`${route} ${viewportName}: blank body`);
    if (h1Count < 1) addFinding(`${route} ${viewportName}: no H1`);
    if (duplicateIds.length) addFinding(`${route} ${viewportName}: duplicate IDs ${JSON.stringify(duplicateIds)}`);
    if (pageGeometry.scrollWidth > pageGeometry.clientWidth + 2) addFinding(`${route} ${viewportName}: page-level horizontal overflow ${pageGeometry.scrollWidth}/${pageGeometry.clientWidth}`);
    if (consoleErrors.length) addFinding(`${route} ${viewportName}: console errors ${consoleErrors.join(' | ')}`);
    if (brokenImages.length) addFinding(`${route} ${viewportName}: broken images ${brokenImages.join(', ')}`);
    if (forbidden.length) addFinding(`${route} ${viewportName}: forbidden public text ${forbidden.join(', ')}`);
    if (documentRoutes.has(route) && !downloadPDFVisible) addFinding(`${route} ${viewportName}: Download PDF control not visible`);
    for (const geometry of documentGeometry) {
      if (geometry.horizontalOverflow) addFinding(`${route} ${viewportName} page ${geometry.page}: sheet horizontal overflow`);
      if (geometry.contentBeyondSheet && viewport.width >= 1100) addFinding(`${route} ${viewportName} page ${geometry.page}: content extends beyond sheet`);
      if (geometry.footerClearancePx < 0) addFinding(`${route} ${viewportName} page ${geometry.page}: content overlaps footer by ${Math.abs(geometry.footerClearancePx)}px`);
    }

    if (route === 'resume.html' || route === 'cover-letter.html') {
      for (const required of ['412.287.8640', 'russelldudek@gmail.com', 'linkedin.com/in/russelldudek', 'russelldudek.github.io/jnj/']) {
        if (!bodyText.includes(required)) addFinding(`${route} ${viewportName}: missing contact value ${required}`);
      }
    }
    if (route === 'resume.html' && !(await page.getByRole('link', { name: 'View Cover Letter' }).isVisible().catch(() => false))) {
      addFinding(`${route} ${viewportName}: View Cover Letter not visible`);
    }
    if (route === 'cover-letter.html' && !(await page.getByRole('link', { name: 'View Resume' }).isVisible().catch(() => false))) {
      addFinding(`${route} ${viewportName}: View Resume not visible`);
    }

    if (viewportName === 'mobile') {
      const toggle = page.locator('.nav-toggle');
      if (await toggle.count()) {
        await toggle.click();
        const expanded = await toggle.getAttribute('aria-expanded');
        const navVisible = await page.locator('#primary-nav').isVisible();
        if (expanded !== 'true' || !navVisible) addFinding(`${route} mobile: navigation toggle failed`);
      }
    }

    const screenshotPath = path.join(outputDirectory, `${route.replace('.html', '')}-${viewportName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    report.routes[`${route}:${viewportName}`] = {
      status,
      title,
      h1Count,
      duplicateIds,
      pageGeometry,
      documentGeometry,
      consoleErrors,
      brokenImages,
      forbidden,
      links,
      screenshot: screenshotPath
    };
    await context.close();
  }
}

{
  const context = await browser.newContext({ viewport: viewports.desktop });
  const page = await context.newPage();
  await page.goto(new URL('index.html', baseURL).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const steps = page.locator('.journey-step');
  const count = await steps.count();
  if (count !== 8) addFinding(`index interaction: expected 8 journey steps, found ${count}`);
  const states = [];
  for (let index = 0; index < count; index += 1) {
    const step = steps.nth(index);
    await step.click();
    await page.waitForTimeout(80);
    const label = (await step.locator('.journey-step-label').innerText()).trim();
    const title = (await page.locator('[data-stage-title]').innerText()).trim();
    const pressed = await step.getAttribute('aria-pressed');
    const marker = await page.locator('.journey-packet').boundingBox();
    const stageLabel = await step.locator('.journey-step-label').boundingBox();
    const stageSummary = await step.locator('.journey-step-summary').boundingBox();
    const overlapLabel = marker && stageLabel ? rectanglesOverlap(marker, stageLabel, 2) : false;
    const overlapSummary = marker && stageSummary ? rectanglesOverlap(marker, stageSummary, 2) : false;
    if (pressed !== 'true') addFinding(`index interaction: ${label} did not become selected`);
    if (!title) addFinding(`index interaction: ${label} produced an empty decision title`);
    if (overlapLabel || overlapSummary) addFinding(`index interaction: marker overlaps text at ${label}`);
    states.push({ index: index + 1, label, title, pressed, overlapLabel, overlapSummary });
  }
  await steps.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  const keyboardPressed = await steps.nth(2).getAttribute('aria-pressed');
  if (keyboardPressed !== 'true') addFinding('index interaction: ArrowRight keyboard navigation failed');

  const scenarios = page.locator('[data-scenario]');
  const scenarioStates = [];
  for (let index = 0; index < await scenarios.count(); index += 1) {
    const button = scenarios.nth(index);
    await button.click();
    const title = (await page.locator('[data-sim-title]').innerText()).trim();
    const pressed = await button.getAttribute('aria-pressed');
    if (pressed !== 'true' || !title) addFinding(`index simulator: scenario ${index + 1} failed`);
    scenarioStates.push({ index: index + 1, title, pressed });
  }
  report.interactions = { journeyStates: states, keyboardPressed, scenarioStates };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: viewports.desktop, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(new URL('index.html', baseURL).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const reduced = await page.evaluate(() => {
    const packet = document.querySelector('.journey-packet');
    const progress = document.querySelector('.journey-line-progress');
    const packetStyle = packet ? getComputedStyle(packet) : null;
    const progressStyle = progress ? getComputedStyle(progress) : null;
    return {
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      packetAnimation: packetStyle?.animationName || null,
      packetTransition: packetStyle?.transitionDuration || null,
      progressAnimation: progressStyle?.animationName || null,
      progressTransition: progressStyle?.transitionDuration || null
    };
  });
  if (!reduced.mediaMatches) addFinding('reduced motion: media query did not match');
  if (reduced.packetAnimation && reduced.packetAnimation !== 'none') addFinding(`reduced motion: packet animation remains ${reduced.packetAnimation}`);
  report.reducedMotion = reduced;
  await page.screenshot({ path: path.join(outputDirectory, 'index-reduced-motion.png'), fullPage: true });
  await context.close();
}

await browser.close();
report.pass = report.findings.length === 0;
await writeFile('qa/full-site-public-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, findings: report.findings, checks: Object.keys(report.routes).length }, null, 2));
if (!report.pass) throw new Error(`Full-site public audit failed with ${report.findings.length} finding(s).`);
