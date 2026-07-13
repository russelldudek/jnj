import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('docs', { recursive: true });
await mkdir('qa', { recursive: true });
const tokens = await readFile('brand-tokens.css', 'utf8');
const styles = await readFile('styles.css', 'utf8');
const inline = html => {
  let output = html;
  if (output.includes('<link rel="stylesheet" href="brand-tokens.css">')) {
    output = output.replace('<link rel="stylesheet" href="brand-tokens.css">', `<style>${tokens}</style>`);
  } else {
    output = output.replace('</head>', `<style>${tokens}</style></head>`);
  }
  return output
    .replace('<link rel="stylesheet" href="styles.css">', `<style>${styles}</style>`)
    .replace(/<script src="app\.js"><\/script>/g, '');
};

const launchOptions = { headless: true };
if (existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
const browser = await chromium.launch(launchOptions);
const targets = [
  ['resume.html', 'docs/russell-dudek-jnj-resume.pdf', 2],
  ['cover-letter.html', 'docs/russell-dudek-jnj-cover-letter.pdf', 1],
  ['interview-brief.html', 'docs/russell-dudek-jnj-interview-brief.pdf', 4],
  ['120-day-plan.html', 'docs/russell-dudek-jnj-120-day-plan.pdf', 3],
  ['otc-exception-portfolio.html', 'docs/russell-dudek-jnj-otc-exception-portfolio.pdf', 2]
];
const layout = {};
for (const [route, output, expectedPages] of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(inline(await readFile(route, 'utf8')), { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  layout[route] = {
    expectedPages,
    sheets: await page.locator('.sheet').evaluateAll(sheets => sheets.map((sheet, index) => {
      const sheetRect = sheet.getBoundingClientRect();
      const reservedSelector = '.page-number,.doc-id,.footer-source';
      const flowChildren = [...sheet.children].filter(element => !element.matches(reservedSelector));
      const reserved = [...sheet.querySelectorAll(reservedSelector)];
      const contentBottom = Math.max(sheetRect.top, ...flowChildren.map(element => element.getBoundingClientRect().bottom));
      const reservedTop = reserved.length ? Math.min(...reserved.map(element => element.getBoundingClientRect().top)) : sheetRect.bottom;
      return {
        page: index + 1,
        horizontalOverflow: sheet.scrollWidth > sheet.clientWidth + 1,
        contentBeyondSheet: contentBottom > sheetRect.bottom + 1,
        footerClearancePx: Number((reservedTop - contentBottom).toFixed(2))
      };
    }))
  };
  await page.pdf({
    path: output,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await page.close();
}
await browser.close();
await writeFile('qa/all-document-layout-report.json', JSON.stringify({
  date: new Date().toISOString(),
  targets: layout
}, null, 2));
