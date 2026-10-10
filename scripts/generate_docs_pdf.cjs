#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function cleanMdxContent(text) {
  return text
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/<CardGroup[\s\S]*?>/g, '<div class="card-group">')
    .replace(/<\/CardGroup>/g, '</div>')
    .replace(/<Card title="([^"]+)"[\s\S]*?>/g, '<div class="card"><h3>$1</h3>')
    .replace(/<\/Card>/g, '</div>')
    .replace(/<Note>/g, '<div class="callout note"><strong>Примечание:</strong> ')
    .replace(/<\/Note>/g, '</div>')
    .replace(/<Tip>/g, '<div class="callout tip"><strong>Совет:</strong> ')
    .replace(/<\/Tip>/g, '</div>')
    .replace(/<AccordionGroup>/g, '<div class="accordions">')
    .replace(/<\/AccordionGroup>/g, '</div>')
    .replace(/<Accordion title="([^"]+)">/g, '<div class="accordion"><h4>$1</h4>')
    .replace(/<\/Accordion>/g, '</div>');
}

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const outDir = path.join(rootDir, 'dist-docs');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  'introduction.mdx',
  'quickstart.mdx',
  path.join('architecture', 'overview.mdx'),
  path.join('architecture', 'backend.mdx'),
  path.join('architecture', 'mobile.mdx'),
  path.join('architecture', 'ai-engine.mdx'),
  path.join('api-reference', 'overview.mdx'),
  path.join('api-reference', 'endpoints.mdx'),
  'team.mdx'
];

const htmlParts = [
  '<!DOCTYPE html>',
  '<html lang="ru">',
  '<head>',
  '<meta charset="utf-8">',
  '<title>FSP Career Arena 2026 — Документация & Регламент</title>',
  '<style>',
  '@page { size: A4; margin: 20mm; }',
  'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0F172A; line-height: 1.6; max-width: 820px; margin: 0 auto; padding: 24px; }',
  'h1 { color: #0369A1; border-bottom: 2px solid #00E5FF; padding-bottom: 8px; margin-top: 40px; page-break-before: always; }',
  'h1:first-of-type { page-break-before: avoid; margin-top: 10px; }',
  'h2, h3 { color: #1E293B; margin-top: 24px; }',
  '.cover { text-align: center; padding: 100px 20px; page-break-after: always; }',
  '.cover h1 { font-size: 36px; border: none; color: #0284C7; margin-bottom: 12px; }',
  '.cover .badge { display: inline-block; padding: 8px 18px; background: #E0F2FE; color: #0284C7; border: 1px solid #00E5FF; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 24px; }',
  '.cover .team { margin-top: 50px; font-weight: 700; font-size: 20px; color: #0F172A; }',
  'pre, code { background: #F1F5F9; border-radius: 6px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 13px; }',
  'pre { padding: 14px; overflow-x: auto; border: 1px solid #E2E8F0; }',
  'table { width: 100%; border-collapse: collapse; margin: 20px 0; }',
  'th, td { border: 1px solid #CBD5E1; padding: 10px 14px; text-align: left; }',
  'th { background: #F8FAFC; font-weight: 600; }',
  '.card-group { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }',
  '.card { border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; background: #F8FAFC; }',
  '.callout { padding: 14px 18px; border-left: 4px solid #00E5FF; background: #F0F9FF; margin: 20px 0; border-radius: 0 8px 8px 0; }',
  '@media print { .no-print { display: none; } body { padding: 0; max-width: 100%; } }',
  '</style>',
  '</head>',
  '<body>',
  '<div class="cover">',
  '<div class="badge">ФЕДЕРАЦИЯ СПОРТИВНОГО ПРОГРАММИРОВАНИЯ РФ</div>',
  '<h1>FSP Career Arena 2026</h1>',
  '<p style="font-size: 18px; color: #64748B;">Официальная техническая документация и архитектурный регламент платформы</p>',
  '<div class="team">👥 Команда разработчиков: «NO PHP — NO PROBLEMS — 2026»</div>',
  '<p style="color: #94A3B8; margin-top: 50px;">Версия 1.0.0 • Октябрь 2026</p>',
  '</div>'
];

for (const p of pages) {
  const fullPath = path.join(docsDir, p);
  if (fs.existsSync(fullPath)) {
    const raw = fs.readFileSync(fullPath, 'utf8');
    htmlParts.push(`<section>\n${cleanMdxContent(raw)}\n</section>\n`);
  }
}

htmlParts.push('</body></html>');

const outHtml = path.join(outDir, 'fsp-career-arena-docs.html');
fs.writeFileSync(outHtml, htmlParts.join('\n'), 'utf8');
console.log(`[DOCS-EXPORTER] Создан презентационный файл документации: ${outHtml}`);
console.log(`[DOCS-EXPORTER] Для генерации PDF откройте файл в браузере и выберите 'Сохранить как PDF' (Ctrl+P)`);
