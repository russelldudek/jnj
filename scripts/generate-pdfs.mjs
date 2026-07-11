import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'inherit' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1200);
await mkdir('docs', { recursive: true });
const browser = await chromium.launch({ headless: true });
const targets = [
  ['resume.html', 'docs/russell-dudek-jnj-resume.pdf'],
  ['cover-letter.html', 'docs/russell-dudek-jnj-cover-letter.pdf'],
  ['interview-brief.html', 'docs/russell-dudek-jnj-interview-brief.pdf'],
  ['120-day-plan.html', 'docs/russell-dudek-jnj-120-day-plan.pdf'],
  ['otc-exception-portfolio.html', 'docs/russell-dudek-jnj-otc-exception-portfolio.pdf']
];
for (const [route, output] of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
}
await browser.close();
server.kill('SIGTERM');
