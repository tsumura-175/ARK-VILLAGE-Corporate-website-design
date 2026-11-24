import { readFileSync, writeFileSync } from 'node:fs';
import { posix } from 'node:path';

const project = new URL('../', import.meta.url);
const source = new URL('./site-layout/', import.meta.url);
const regions = ['site-header', 'mobile-menu', 'site-footer'];
const templates = regions.map(name => readFileSync(new URL(name + '.html.tmpl', source), 'utf8').trimEnd());
const pages = JSON.parse(readFileSync(new URL('pages.json', source), 'utf8'));
const [option, ...extraArguments] = process.argv.slice(2);

if ((option && option !== '--check') || extraArguments.length) {
  throw new Error('Usage: node scripts/generate-site-layout.mjs [--check]');
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function render(template, file, settings) {
  const directory = posix.dirname(file);
  const root = directory === '.' ? '' : '../'.repeat(directory.split('/').length);
  const html = template.replaceAll('{{root}}', root).replace(
    /<a\b[^>]*\bhref="\{\{([^{}"]+)\}\}"[^>]*>/g,
    (anchor, route) => {
      const destination = route === 'home' ? (settings.home ?? root + 'index.html') : (settings.links?.[route] ?? root + route);
      const current = route === settings.current ? 'page' : route === settings.section ? 'location' : '';
      const link = anchor.replace('{{' + route + '}}', () => escapeAttribute(destination));
      return current ? link.slice(0, -1) + ' aria-current="' + current + '">' : link;
    },
  );
  if (html.includes('{{')) throw new Error('Unresolved site layout placeholder in ' + file);
  return html;
}

function replaceRegion(html, name, fragment, newline, file) {
  const start = '    <!-- BEGIN GENERATED: ' + name + ' -->';
  const end = '    <!-- END GENERATED: ' + name + ' -->';
  const startAt = html.indexOf(start);
  const endAt = html.indexOf(end);
  if (startAt === -1 || endAt < startAt || html.lastIndexOf(start) !== startAt || html.lastIndexOf(end) !== endAt) {
    throw new Error('Expected one generated ' + name + ' region in ' + file);
  }
  return html.slice(0, startAt + start.length) + newline + fragment + newline + html.slice(endAt);
}

const changes = [];
for (const [file, settings] of Object.entries(pages)) {
  const path = new URL(file, project);
  const html = readFileSync(path, 'utf8');
  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  const next = regions.reduce((output, name, index) => {
    const fragment = render(templates[index], file, settings).replace(/\r?\n/g, newline);
    return replaceRegion(output, name, fragment, newline, file);
  }, html);
  if (next !== html) changes.push({ file, path, next });
}

if (option === '--check') {
  for (const { file } of changes) console.error('Regenerate site layout: ' + file);
  process.exitCode = changes.length ? 1 : 0;
} else {
  for (const { path, next } of changes) writeFileSync(path, next, 'utf8');
  console.log('Updated ' + changes.length + ' of ' + Object.keys(pages).length + ' pages.');
}
