#!/usr/bin/env python3
"""
FSP Career Arena 2026 — Documentation to PDF Exporter
Компилирует MDX-документацию проекта в единый презентационный PDF / HTML документ (Whitepaper)
для жюри и официального релиза Федерации спортивного программирования.
"""

import os
import re

def clean_mdx_content(text: str) -> str:
    # Удалить frontmatter
    text = re.sub(r'^---[\s\S]*?---\n', '', text)
    # Заменить Mintlify компоненты на чистый HTML
    text = re.sub(r'<CardGroup[\s\S]*?>', '<div class="card-group">', text)
    text = text.replace('</CardGroup>', '</div>')
    text = re.sub(r'<Card title="([^"]+)"[\s\S]*?>', r'<div class="card"><h3>\1</h3>', text)
    text = text.replace('</Card>', '</div>')
    text = re.sub(r'<Note>', '<div class="callout note"><strong>Примечание:</strong> ', text)
    text = text.replace('</Note>', '</div>')
    text = re.sub(r'<Tip>', '<div class="callout tip"><strong>Совет:</strong> ', text)
    text = text.replace('</Tip>', '</div>')
    text = re.sub(r'<AccordionGroup>', '<div class="accordions">', text)
    text = text.replace('</AccordionGroup>', '</div>')
    text = re.sub(r'<Accordion title="([^"]+)">', r'<div class="accordion"><h4>\1</h4>', text)
    text = text.replace('</Accordion>', '</div>')
    return text

def build_single_document():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs_dir = os.path.join(root_dir, "docs")
    out_dir = os.path.join(root_dir, "dist-docs")
    os.makedirs(out_dir, exist_ok=True)

    pages = [
        "introduction.mdx",
        "quickstart.mdx",
        os.path.join("architecture", "overview.mdx"),
        os.path.join("architecture", "backend.mdx"),
        os.path.join("architecture", "mobile.mdx"),
        os.path.join("architecture", "ai-engine.mdx"),
        os.path.join("api-reference", "overview.mdx"),
        os.path.join("api-reference", "endpoints.mdx"),
        "team.mdx"
    ]

    combined_html = [
        "<!DOCTYPE html>",
        "<html lang='ru'>",
        "<head>",
        "<meta charset='utf-8'>",
        "<title>FSP Career Arena 2026 — Официальная Документация</title>",
        "<style>",
        "@page { size: A4; margin: 20mm; }",
        "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }",
        "h1 { color: #0369A1; border-bottom: 2px solid #00E5FF; padding-bottom: 8px; margin-top: 40px; page-break-before: always; }",
        "h1:first-of-type { page-break-before: avoid; margin-top: 10px; }",
        "h2, h3 { color: #1E293B; }",
        ".cover { text-align: center; padding: 80px 20px; page-break-after: always; }",
        ".cover h1 { font-size: 32px; border: none; color: #0284C7; }",
        ".cover .badge { display: inline-block; padding: 6px 14px; background: #00E5FF22; color: #0284C7; border: 1px solid #00E5FF; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }",
        ".cover .team { margin-top: 40px; font-weight: bold; font-size: 18px; color: #475569; }",
        "pre, code { background: #F1F5F9; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; }",
        "pre { padding: 12px; overflow-x: auto; border: 1px solid #E2E8F0; }",
        "table { width: 100%; border-collapse: collapse; margin: 20px 0; }",
        "th, td { border: 1px solid #CBD5E1; padding: 10px; text-align: left; }",
        "th { background: #F8FAFC; }",
        ".card-group { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }",
        ".card { border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; background: #F8FAFC; }",
        ".callout { padding: 14px; border-left: 4px solid #00E5FF; background: #F0F9FF; margin: 16px 0; border-radius: 0 8px 8px 0; }",
        "@media print { .no-print { display: none; } body { padding: 0; } }",
        "</style>",
        "</head>",
        "<body>",
        "<div class='cover'>",
        "<div class='badge'>ФЕДЕРАЦИЯ СПОРТИВНОГО ПРОГРАММИРОВАНИЯ РФ</div>",
        "<h1>FSP Career Arena 2026</h1>",
        "<p style='font-size: 18px; color: #64748B;'>Официальная техническая документация и архитектурный регламент платформы</p>",
        "<div class='team'>👥 Команда разработчиков: «NO PHP — NO PROBLEMS — 2026»</div>",
        "<p style='color: #94A3B8; margin-top: 40px;'>Версия 1.0.0 • Дата: Октябрь 2026</p>",
        "</div>"
    ]

    for p in pages:
        full_path = os.path.join(docs_dir, p)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                content = clean_mdx_content(f.read())
                combined_html.append(f"<section>\n{content}\n</section>\n")

    combined_html.append("</body></html>")
    out_html = os.path.join(out_dir, "fsp-career-arena-docs.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write("\n".join(combined_html))

    print(f"[DOCS-EXPORTER] Успешно сформирован презентационный документ:")
    print(f"  -> HTML: {out_html}")
    print(f"  -> Для сохранения в PDF откройте файл в браузере и нажмите 'Печать -> Сохранить как PDF' (Ctrl+P)")

if __name__ == "__main__":
    build_single_document()
