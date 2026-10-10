#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true
});

function cleanAndParseMdx(text) {
  // 1. Extract and strip frontmatter
  const frontmatterMatch = text.match(/^---([\s\S]*?)---\n/);
  let title = '';
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*["']?([^"'\n]+)["']?/);
    if (titleMatch) title = titleMatch[1];
  }
  let clean = text.replace(/^---[\s\S]*?---\n/, '');

  // 2. Pre-process Mintlify / JSX custom components into HTML markers before Markdown parsing
  clean = clean.replace(/<CardGroup[\s\S]*?>/g, '<div class="card-grid">');
  clean = clean.replace(/<\/CardGroup>/g, '</div>');

  clean = clean.replace(/<Card\s+title="([^"]+)"(?:\s+icon="([^"]*)")?[\s\S]*?>([\s\S]*?)<\/Card>/g, (match, cardTitle, icon, content) => {
    return `<div class="doc-card"><div class="doc-card-title">${cardTitle}</div><div class="doc-card-body">${content.trim()}</div></div>`;
  });

  clean = clean.replace(/<Note>([\s\S]*?)<\/Note>/g, '<div class="callout note"><strong>Примечание:</strong> $1</div>');
  clean = clean.replace(/<Tip>([\s\S]*?)<\/Tip>/g, '<div class="callout tip"><strong>Совет:</strong> $1</div>');

  clean = clean.replace(/<AccordionGroup>([\s\S]*?)<\/AccordionGroup>/g, '<div class="accordion-group">$1</div>');
  clean = clean.replace(/<Accordion\s+title="([^"]+)">([\s\S]*?)<\/Accordion>/g, (match, accTitle, accContent) => {
    return `<details class="doc-accordion"><summary class="doc-accordion-summary">${accTitle}</summary><div class="doc-accordion-content">${accContent.trim()}</div></details>`;
  });

  // Convert className to class
  clean = clean.replace(/className=/g, 'class=');

  // 3. Parse Markdown to real HTML
  const parsedHtml = marked.parse(clean);

  return { title, html: parsedHtml };
}

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const outDir = path.join(rootDir, 'dist-docs');
const publicDir = path.join(rootDir, 'public');
const publicDocsDir = path.join(publicDir, 'docs');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(publicDocsDir, { recursive: true });

const pageConfigs = [
  { file: 'introduction.mdx', id: 'introduction', label: 'Введение в FSP Career Arena' },
  { file: 'quickstart.mdx', id: 'quickstart', label: 'Быстрый старт (Quickstart)' },
  { file: path.join('architecture', 'overview.mdx'), id: 'arch-overview', label: 'Архитектура экосистемы' },
  { file: path.join('architecture', 'backend.mdx'), id: 'arch-backend', label: 'Бэкенд-сервисы (Java 21 + Spring Boot 3)' },
  { file: path.join('architecture', 'mobile.mdx'), id: 'arch-mobile', label: 'Мобильное приложение (Kotlin 2.0 Compose)' },
  { file: path.join('architecture', 'ai-engine.mdx'), id: 'arch-ai', label: 'ИИ-анализатор (Multi-Model AI)' },
  { file: path.join('api-reference', 'endpoints.mdx'), id: 'api-endpoints', label: 'Спецификация REST API (Swagger)' },
  { file: 'team.mdx', id: 'team', label: 'Команда разработчиков' }
];

const renderedSections = [];
const navItems = [];

for (const cfg of pageConfigs) {
  const fullPath = path.join(docsDir, cfg.file);
  if (fs.existsSync(fullPath)) {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { title, html } = cleanAndParseMdx(raw);
    renderedSections.push(`
      <article id="${cfg.id}" class="doc-section">
        <div class="doc-section-anchor"></div>
        ${html}
      </article>
      <hr class="doc-divider" />
    `);
    navItems.push({ id: cfg.id, label: title || cfg.label });
  }
}

const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FSP Career Arena 2026 — Интерактивная документация и регламент</title>
  <link rel="icon" type="image/svg+xml" href="/logo/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      mermaid.initialize({ startOnLoad: true, theme: 'dark', fontFamily: 'JetBrains Mono, monospace' });
    });
  </script>
  <style>
    :root {
      --bg-main: #0b111e;
      --bg-surface: #10192d;
      --bg-card: #15223c;
      --border: #1e2e4f;
      --border-accent: #00e5ff;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --accent-cyan: #00e5ff;
      --accent-blue: #38bdf8;
      --accent-emerald: #10b981;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-main);
      color: var(--text-main);
      line-height: 1.65;
      font-size: 15px;
    }

    /* Header Nav */
    header.fsp-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 17, 30, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #fff;
    }

    .brand-logo-badge {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #00e5ff, #2563eb);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 14px;
      color: #0b111e;
    }

    .brand-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .brand-sub {
      font-size: 12px;
      color: var(--accent-cyan);
      font-weight: 600;
      margin-left: 6px;
    }

    .header-links {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .btn-header {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-header-ghost {
      color: var(--text-muted);
      border: 1px solid var(--border);
      background: var(--bg-surface);
    }
    .btn-header-ghost:hover {
      color: #fff;
      border-color: var(--accent-cyan);
    }

    .btn-header-primary {
      background: linear-gradient(135deg, #00e5ff, #0284c7);
      color: #0b111e;
      border: none;
      font-weight: 800;
    }
    .btn-header-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    /* Layout Split */
    .doc-layout {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 65px);
    }

    /* Sidebar */
    aside.doc-sidebar {
      width: 300px;
      position: sticky;
      top: 65px;
      height: calc(100vh - 65px);
      overflow-y: auto;
      padding: 24px 18px;
      border-right: 1px solid var(--border);
      background: var(--bg-main);
      flex-shrink: 0;
    }

    .sidebar-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      margin-bottom: 12px;
      padding-left: 8px;
    }

    .sidebar-nav {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sidebar-nav a {
      display: block;
      padding: 8px 12px;
      border-radius: 8px;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }

    .sidebar-nav a:hover {
      background: var(--bg-surface);
      color: var(--accent-cyan);
      border-color: var(--border);
    }

    /* Main Content */
    main.doc-content {
      flex: 1;
      padding: 36px 48px;
      max-width: 980px;
    }

    /* Typography & Markdown styling */
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      margin-top: 20px;
      margin-bottom: 14px;
      line-height: 1.3;
      border-bottom: 2px solid var(--border);
      padding-bottom: 10px;
    }

    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 32px;
      margin-bottom: 14px;
    }

    h3 {
      font-size: 16px;
      font-weight: 700;
      color: #e2e8f0;
      margin-top: 24px;
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 16px;
      color: #cbd5e1;
    }

    strong {
      color: #fff;
      font-weight: 600;
    }

    a {
      color: var(--accent-cyan);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    ul, ol {
      margin-bottom: 18px;
      padding-left: 24px;
      color: #cbd5e1;
    }

    li {
      margin-bottom: 6px;
    }

    /* Pre & Code */
    pre {
      background: #080d19 !important;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      overflow-x: auto;
      margin: 18px 0;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 13px;
      line-height: 1.55;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 13px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: #38bdf8;
    }

    pre code {
      background: transparent;
      padding: 0;
      color: #e2e8f0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 22px 0;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      font-size: 13.5px;
    }

    th {
      background: #0f192f;
      color: #fff;
      text-align: left;
      padding: 12px 14px;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 11px 14px;
      border-bottom: 1px solid var(--border);
      color: #cbd5e1;
    }

    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: rgba(255, 255, 255, 0.015); }

    /* Custom Component Cards */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin: 22px 0;
    }

    .doc-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      transition: all 0.2s ease;
    }

    .doc-card:hover {
      border-color: var(--accent-cyan);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px -8px rgba(0, 229, 255, 0.15);
    }

    .doc-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .doc-card-body {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Callouts */
    .callout {
      border-left: 4px solid var(--accent-cyan);
      background: rgba(0, 229, 255, 0.06);
      border-radius: 0 12px 12px 0;
      padding: 14px 18px;
      margin: 20px 0;
      font-size: 14px;
      color: #e2e8f0;
    }

    .callout.tip {
      border-left-color: #10b981;
      background: rgba(16, 185, 129, 0.06);
    }

    /* Accordions */
    .doc-accordion {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .doc-accordion-summary {
      padding: 14px 18px;
      font-weight: 700;
      cursor: pointer;
      color: #fff;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .doc-accordion-summary:hover {
      background: rgba(255, 255, 255, 0.02);
      color: var(--accent-cyan);
    }

    .doc-accordion-content {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.15);
      font-size: 13.5px;
    }

    /* Images and Screenshots */
    .doc-content img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.7);
      margin: 20px 0 28px 0;
      display: block;
      transition: all 0.2s ease;
    }

    .doc-content img:hover {
      border-color: var(--accent-cyan);
      box-shadow: 0 20px 48px -10px rgba(0, 229, 255, 0.2);
    }

    /* Divider */
    .doc-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: 48px 0;
    }

    /* Print styles */
    @media print {
      header.fsp-header, aside.doc-sidebar, .header-links { display: none !important; }
      body { background: #fff !important; color: #000 !important; }
      main.doc-content { max-width: 100% !important; padding: 0 !important; }
      pre, code { background: #f8fafc !important; color: #000 !important; border: 1px solid #ccc !important; }
      table, th, td { border-color: #ccc !important; color: #000 !important; }
      th { background: #eee !important; }
      .doc-card { border-color: #ccc !important; background: #fff !important; }
      .doc-card-title { color: #000 !important; }
      h1, h2, h3 { color: #000 !important; }
    }

    @media (max-width: 900px) {
      aside.doc-sidebar { display: none; }
      main.doc-content { padding: 24px 20px; }
    }
  </style>
</head>
<body>

  <header class="fsp-header">
    <a href="/" class="brand-group">
      <div class="brand-logo-badge">ФСП</div>
      <div>
        <span class="brand-title">Карьерная Арена 2026</span>
        <span class="brand-sub">Документация</span>
      </div>
    </a>
    <div class="header-links">
      <a href="https://huggingface.co/spaces/Linskay/demo-2026" target="_blank" class="btn-header btn-header-ghost">🚀 Живое демо</a>
      <a href="https://linskay-demo-2026.hf.space/swagger" target="_blank" class="btn-header btn-header-ghost">📚 Swagger UI</a>
      <a href="/docs/MANIFEST.pdf" target="_blank" class="btn-header btn-header-primary">📥 Скачать PDF Манифест</a>
    </div>
  </header>

  <div class="doc-layout">
    <aside class="doc-sidebar">
      <div class="sidebar-title">Содержание документации</div>
      <ul class="sidebar-nav">
        ${navItems.map(item => `<li><a href="#${item.id}">${item.label}</a></li>`).join('\n        ')}
      </ul>
      <div style="margin-top: 36px; padding: 16px; border-radius: 12px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); font-size: 11.5px; color: #94a3b8;">
        <strong style="color: #00e5ff; display: block; margin-bottom: 4px;">Пункт 3.4 ТЗ ФСП РФ</strong>
        Полное закрытие требований жюри по архитектуре, валидации, защите от слива тестов и 152-ФЗ.
      </div>
    </aside>

    <main class="doc-content">
      ${renderedSections.join('\n')}
      
      <div style="text-align: center; padding: 30px 0; color: #64748b; font-size: 12px;">
        © 2026 Федерация спортивного программирования России • Команда «NO PHP — NO PROBLEMS — 2026»
      </div>
    </main>
  </div>

</body>
</html>
`;

// Write to dist-docs, public/docs/index.html and public/docs.html
fs.writeFileSync(path.join(outDir, 'fsp-career-arena-docs.html'), fullHtml, 'utf8');
fs.writeFileSync(path.join(publicDocsDir, 'index.html'), fullHtml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'docs.html'), fullHtml, 'utf8');

// Copy images to public/docs/images and dist-docs/docs/images
const imagesSrcDir = path.join(docsDir, 'images');
const imagesTarget1 = path.join(publicDocsDir, 'images');
const imagesTarget2 = path.join(outDir, 'docs', 'images');
if (fs.existsSync(imagesSrcDir)) {
  fs.mkdirSync(imagesTarget1, { recursive: true });
  fs.mkdirSync(imagesTarget2, { recursive: true });
  fs.readdirSync(imagesSrcDir).forEach(file => {
    fs.copyFileSync(path.join(imagesSrcDir, file), path.join(imagesTarget1, file));
    fs.copyFileSync(path.join(imagesSrcDir, file), path.join(imagesTarget2, file));
  });
}

console.log('[OK] Compiled interactive documentation portal with full Markdown parsing');
console.log('     -> ' + path.join(publicDocsDir, 'index.html'));
