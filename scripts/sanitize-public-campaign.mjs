import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'node_modules']);
const textExtensions = new Set([
  '.html', '.js', '.mjs', '.css', '.md', '.json', '.yml', '.yaml', '.txt', '.xml', '.svg'
]);
const internalLabel = ['Role', 'Forge'].join('');
const internalLabelLower = internalLabel.toLowerCase();
const retrievalSentence = [
  'the original posting URL is preserved,',
  'but its full body was not retrievable.'
].join(' ');

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
}

await walk(root);

const replacements = [
  [new RegExp(`<p class="source-note"[^>]*>\\s*<span class="hypothesis">Working hypothesis<\\/span>\\s*OTC refers to Order-to-Cash;\\s*${retrievalSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<\\/p>`, 'gi'), ''],
  [new RegExp(`OTC refers to Order-to-Cash;\\s*${retrievalSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), ''],
  [new RegExp(retrievalSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ''],
  [new RegExp(`${internalLabel} Project`, 'g'), 'campaign workspace'],
  [new RegExp(`${internalLabel} portfolio cases`, 'g'), 'portfolio cases'],
  [new RegExp(`${internalLabel} document styling`, 'g'), 'campaign document styling'],
  [new RegExp(`${internalLabel} campaign`, 'g'), 'candidate campaign'],
  [new RegExp(`${internalLabel} source of truth`, 'g'), 'campaign source of truth'],
  [new RegExp(`${internalLabel}`, 'g'), 'candidate campaign system'],
  [new RegExp('roleforgeAppCore', 'g'), 'campaignAppCore'],
  [new RegExp('data-roleforge-app-core', 'g'), 'data-campaign-app-core'],
  [new RegExp('roleforge/', 'g'), 'campaign/'],
  [new RegExp(`\\b${internalLabelLower}\\b`, 'gi'), 'campaign system']
];

const changed = [];
for (const file of files) {
  let content = await readFile(file, 'utf8');
  const original = content;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  content = content.replace(/\n{3,}/g, '\n\n');
  if (content !== original) {
    await writeFile(file, content);
    changed.push(path.relative(root, file));
  }
}

const findings = [];
for (const file of files) {
  const relative = path.relative(root, file);
  const content = await readFile(file, 'utf8');
  const lower = content.toLowerCase();
  if (lower.includes(internalLabelLower)) findings.push(`${relative}: internal framework label`);
  if (lower.includes(retrievalSentence.toLowerCase())) findings.push(`${relative}: posting-retrieval caveat`);
}

const pathFindings = files
  .map(file => path.relative(root, file))
  .filter(file => file.toLowerCase().includes(internalLabelLower));
for (const finding of pathFindings) findings.push(`${finding}: internal framework label in path`);

console.log(JSON.stringify({ changed, findings }, null, 2));
if (findings.length) {
  throw new Error(`Public campaign sanitation failed:\n${findings.join('\n')}`);
}
