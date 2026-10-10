#!/usr/bin/env python3
"""
FSP Career Arena 2026 — Official Manifesto PDF Compiler
Generates official publication-ready PDF document from docs/MANIFEST.md
Supports full native Russian Cyrillic Unicode typography via DejaVu Sans.
"""

import os
import re
import sys
import shutil
from fpdf import FPDF

class ManifestPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('DejaVu', 'B', 8)
            self.set_text_color(100, 116, 139)
            self.cell(0, 8, 'ФЕДЕРАЦИЯ СПОРТИВНОГО ПРОГРАММИРОВАНИЯ РОССИИ — МАНИФЕСТ 2026', border='B', align='L')
            self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f'Страница {self.page_no()} | Карьерная Арена ФСП — Проектная Документация (Пункт 3.4 ТЗ)', align='C')

def clean_text(text: str) -> str:
    # Удаляем эмодзи, которые отсутствуют в стандартных TrueType шрифтах
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    # Заменяем специальные спецсимволы
    text = text.replace('\u2022', '-').replace('\u2013', '-').replace('\u2014', ' - ')
    return text

def create_manifest_pdf():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manifest_path = os.path.join(root_dir, 'docs', 'MANIFEST.md')
    pdf_out_path = os.path.join(root_dir, 'docs', 'MANIFEST.pdf')
    dist_pdf_path = os.path.join(root_dir, 'dist-docs', 'MANIFEST.pdf')
    public_pdf_path = os.path.join(root_dir, 'public', 'MANIFEST.pdf')
    public_docs_pdf = os.path.join(root_dir, 'public', 'docs', 'MANIFEST.pdf')
    
    os.makedirs(os.path.join(root_dir, 'dist-docs'), exist_ok=True)
    os.makedirs(os.path.join(root_dir, 'public', 'docs'), exist_ok=True)

    if not os.path.exists(manifest_path):
        print(f"Error: Manifest file not found at {manifest_path}")
        sys.exit(1)

    with open(manifest_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    pdf = ManifestPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=15)

    # Register DejaVu Unicode Fonts for native Russian
    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
    ]
    
    regular_font = font_paths[0] if os.path.exists(font_paths[0]) else None
    bold_font = font_paths[1] if os.path.exists(font_paths[1]) else None
    mono_font = font_paths[2] if os.path.exists(font_paths[2]) else None

    if regular_font and bold_font:
        pdf.add_font('DejaVu', '', regular_font)
        pdf.add_font('DejaVu', 'B', bold_font)
        if mono_font:
            pdf.add_font('DejaVuMono', '', mono_font)
        font_family = 'DejaVu'
    else:
        print("[WARN] DejaVu font not found, falling back to Helvetica")
        font_family = 'Helvetica'

    pdf.add_page()

    # Cover Header Banner
    pdf.set_fill_color(11, 17, 30) # #0b111e Dark Navy
    pdf.rect(0, 0, 210, 48, 'F')
    
    pdf.set_xy(15, 12)
    pdf.set_font(font_family, 'B', 18)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 8, 'ФСП КАРЬЕРНАЯ АРЕНА', ln=True)

    pdf.set_xy(15, 22)
    pdf.set_font(font_family, 'B', 10)
    pdf.set_text_color(0, 229, 255) # Cyan
    pdf.cell(0, 6, 'ОФИЦИАЛЬНЫЙ АРХИТЕКТУРНЫЙ МАНИФЕСТ И ПРОЕКТНАЯ ДОКУМЕНТАЦИЯ', ln=True)

    pdf.set_xy(15, 30)
    pdf.set_font(font_family, '', 8.5)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(0, 6, 'Регламент платформы: Архитектура, Алгоритмы, Тестирование, 152-ФЗ, Интеграции, Деплой', ln=True)

    # Accent Cyan Line
    pdf.set_fill_color(0, 229, 255)
    pdf.rect(0, 48, 210, 1.5, 'F')

    pdf.set_xy(15, 56)
    pdf.set_font(font_family, '', 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 6, 'Команда разработки: «NO PHP — NO PROBLEMS — 2026» | Хакатон ФСП РФ 2026', ln=True)
    pdf.ln(4)

    lines = md_text.split('\n')
    in_code_block = False
    code_lines = []

    for line in lines:
        stripped = line.strip()

        # Handle Code Blocks
        if stripped.startswith('```'):
            if in_code_block:
                in_code_block = False
                pdf.set_fill_color(241, 245, 249) # #f1f5f9
                pdf.set_text_color(15, 23, 42)
                pdf.set_font(font_family if not mono_font else 'DejaVuMono', '', 7.5)
                block_content = clean_text('\n'.join(code_lines))
                pdf.multi_cell(180, 4.2, block_content, fill=True, border=1)
                pdf.ln(3)
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        if not stripped:
            pdf.ln(2)
            continue

        # Headings
        if stripped.startswith('# '):
            continue # Already handled in cover
        elif stripped.startswith('## '):
            heading_text = clean_text(stripped[3:].strip())
            heading_text = re.sub(r'^[^\w\sА-Яа-яA-Za-z0-9]+', '', heading_text).strip()
            pdf.ln(4)
            pdf.set_font(font_family, 'B', 13)
            pdf.set_text_color(3, 105, 161) # #0369a1
            pdf.cell(0, 8, heading_text, ln=True)
            pdf.set_fill_color(0, 229, 255)
            pdf.rect(pdf.get_x(), pdf.get_y(), 180, 0.5, 'F')
            pdf.ln(2)
        elif stripped.startswith('### '):
            heading_text = clean_text(stripped[4:].strip())
            heading_text = re.sub(r'^[^\w\sА-Яа-яA-Za-z0-9]+', '', heading_text).strip()
            pdf.ln(2)
            pdf.set_font(font_family, 'B', 10.5)
            pdf.set_text_color(30, 41, 59)
            pdf.cell(0, 6, heading_text, ln=True)
            pdf.ln(1)
        elif stripped.startswith('- ') or stripped.startswith('* '):
            item_text = clean_text(stripped[2:].strip())
            item_text = re.sub(r'\*\*(.*?)\*\*', r'\1', item_text)
            pdf.set_font(font_family, '', 8.5)
            pdf.set_text_color(51, 65, 85)
            pdf.cell(5, 4.5, '-')
            pdf.multi_cell(175, 4.5, item_text)
        elif stripped.startswith('|'):
            if '---' in stripped:
                continue
            cols = [clean_text(c.strip()) for c in stripped.split('|')[1:-1]]
            if not cols:
                continue
            pdf.set_font(font_family, '', 8)
            pdf.set_text_color(30, 41, 59)
            col_width = 180 / max(len(cols), 1)
            for c in cols:
                clean_c = re.sub(r'\*\*(.*?)\*\*', r'\1', c)
                pdf.cell(col_width, 5.5, clean_c[:34], border=1)
            pdf.ln()
        else:
            p_text = clean_text(stripped)
            p_text = re.sub(r'\*\*(.*?)\*\*', r'\1', p_text)
            p_text = re.sub(r'`(.*?)`', r'\1', p_text)
            pdf.set_font(font_family, '', 8.5)
            pdf.set_text_color(51, 65, 85)
            pdf.multi_cell(180, 4.5, p_text)
            pdf.ln(1.5)

    pdf.output(pdf_out_path)
    pdf.output(dist_pdf_path)
    shutil.copyfile(pdf_out_path, public_pdf_path)
    shutil.copyfile(pdf_out_path, public_docs_pdf)
    
    print(f"[OK] Generated Native Russian Cyrillic PDF Manifest at: {pdf_out_path}")
    print(f"[OK] Copied to public and dist folders")

if __name__ == '__main__':
    create_manifest_pdf()
