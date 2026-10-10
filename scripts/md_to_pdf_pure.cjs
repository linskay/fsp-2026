const fs = require('fs');
const path = require('path');

function createPdf(manifestMdPath, outputPath) {
  const content = fs.readFileSync(manifestMdPath, 'utf8');
  const lines = content.split('\n');

  // Convert Cyrillic to readable Latin/translit or clean characters for standard Helvetica PDF encoding
  const ruToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };

  function translit(str) {
    return str.split('').map(ch => ruToLat[ch] || ch).join('');
  }

  function escapePdf(str) {
    return translit(str)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[\u0080-\uffff]/g, '');
  }

  const pages = [];
  let currentPageOps = [];
  let currentY = 750; // Points from bottom

  function startNewPage() {
    if (currentPageOps.length > 0) {
      pages.push(currentPageOps.join('\n'));
    }
    currentPageOps = [];
    currentY = 750;

    // Header on every page
    currentPageOps.push(
      '0.05 0.08 0.18 rg\n' +
      '0 790 595 52 re f\n' +
      '0.00 0.90 1.00 RG 2 w\n' +
      '0 790 m 595 790 l S\n' +
      'BT\n/F2 10 Tf\n1 1 1 rg\n' +
      '40 812 Td (RUSSIAN SPORTS PROGRAMMING FEDERATION - FSP CAREER ARENA 2026) Tj\n' +
      'ET\n' +
      'BT\n/F1 8 Tf\n0.00 0.90 1.00 rg\n' +
      '40 798 Td (OFFICIAL TECHNICAL SPECIFICATION & PROJECT MANIFESTO - ITEM 3.4) Tj\n' +
      'ET'
    );
  }

  function checkPageBreak(requiredHeight) {
    if (currentY - requiredHeight < 60) {
      // Footer before breaking
      currentPageOps.push(
        '0.8 0.8 0.8 RG 1 w\n' +
        '40 45 m 555 45 l S\n' +
        'BT\n/F1 8 Tf\n0.5 0.5 0.5 rg\n' +
        `40 32 Td (FSP Career Arena | Page ${pages.length + 1} | Team: NO PHP - NO PROBLEMS - 2026) Tj\n` +
        'ET'
      );
      startNewPage();
    }
  }

  startNewPage();

  // Cover title banner on page 1
  currentPageOps.push(
    '0.95 0.97 1.00 rg\n' +
    '40 650 515 85 re f\n' +
    '0.1 0.4 0.8 RG 1 w\n' +
    '40 650 515 85 re s\n' +
    'BT\n/F2 16 Tf\n0.05 0.15 0.35 rg\n' +
    '55 705 Td (FSP CAREER ARENA: PROJECT MANIFESTO) Tj\n' +
    'ET\n' +
    'BT\n/F2 10 Tf\n0.15 0.25 0.45 rg\n' +
    '55 685 Td (Comprehensive Technical Documentation & System Specifications) Tj\n' +
    'ET\n' +
    'BT\n/F1 9 Tf\n0.35 0.45 0.55 rg\n' +
    '55 665 Td (Reverse Recruiting, ELO Algorithms, 152-FZ Privacy, Judge0 Sandboxing) Tj\n' +
    'ET'
  );
  currentY = 620;

  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();

    if (raw.startsWith('```')) {
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      checkPageBreak(14);
      currentPageOps.push(
        '0.96 0.97 0.98 rg\n' +
        `40 ${currentY - 3} 515 12 re f\n` +
        'BT\n/F3 7.5 Tf\n0.15 0.2 0.3 rg\n' +
        `45 ${currentY} Td (${escapePdf(raw.slice(0, 95))}) Tj\n` +
        'ET'
      );
      currentY -= 13;
      continue;
    }

    if (!raw) {
      currentY -= 6;
      continue;
    }

    if (raw.startsWith('# ')) {
      continue; // Handled in banner
    } else if (raw.startsWith('## ')) {
      checkPageBreak(32);
      const title = raw.replace(/^##\s*/, '').replace(/^[^\w\s]+/, '').trim();
      currentPageOps.push(
        '0.00 0.85 0.95 RG 2 w\n' +
        `40 ${currentY - 4} m 555 ${currentY - 4} l S\n` +
        'BT\n/F2 12 Tf\n0.05 0.25 0.55 rg\n' +
        `40 ${currentY} Td (${escapePdf(title)}) Tj\n` +
        'ET'
      );
      currentY -= 22;
    } else if (raw.startsWith('### ')) {
      checkPageBreak(24);
      const sub = raw.replace(/^###\s*/, '').replace(/^[^\w\s]+/, '').trim();
      currentPageOps.push(
        'BT\n/F2 10 Tf\n0.15 0.2 0.3 rg\n' +
        `40 ${currentY} Td (${escapePdf(sub)}) Tj\n` +
        'ET'
      );
      currentY -= 17;
    } else if (raw.startsWith('- ') || raw.startsWith('* ')) {
      checkPageBreak(14);
      const item = raw.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      currentPageOps.push(
        'BT\n/F1 8.5 Tf\n0.2 0.25 0.35 rg\n' +
        `45 ${currentY} Td (- ${escapePdf(item.slice(0, 95))}) Tj\n` +
        'ET'
      );
      currentY -= 13;
    } else if (raw.startsWith('|')) {
      if (raw.includes('---')) continue;
      checkPageBreak(14);
      const clean = raw.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')).join('  |  ');
      currentPageOps.push(
        '0.94 0.96 0.98 rg\n' +
        `40 ${currentY - 2} 515 12 re f\n` +
        'BT\n/F1 8 Tf\n0.2 0.25 0.35 rg\n' +
        `44 ${currentY} Td (${escapePdf(clean.slice(0, 95))}) Tj\n` +
        'ET'
      );
      currentY -= 13;
    } else {
      checkPageBreak(14);
      const text = raw.replace(/\*\*/g, '').replace(/`/g, '');
      currentPageOps.push(
        'BT\n/F1 8.5 Tf\n0.2 0.25 0.35 rg\n' +
        `40 ${currentY} Td (${escapePdf(text.slice(0, 100))}) Tj\n` +
        'ET'
      );
      currentY -= 13;
    }
  }

  // Final page footer
  currentPageOps.push(
    '0.8 0.8 0.8 RG 1 w\n' +
    '40 45 m 555 45 l S\n' +
    'BT\n/F1 8 Tf\n0.5 0.5 0.5 rg\n' +
    `40 32 Td (FSP Career Arena | Page ${pages.length + 1} | Team: NO PHP - NO PROBLEMS - 2026) Tj\n` +
    'ET'
  );
  pages.push(currentPageOps.join('\n'));

  // Assemble full PDF document
  const objects = [];
  function addObject(content) {
    objects.push(content);
    return objects.length;
  }

  // 1: Catalog
  // 2: Pages
  // 3..: Page objects
  // Fonts: F1, F2, F3
  const catalogIdx = 1;
  const pagesIdx = 2;
  const font1Idx = 3;
  const font2Idx = 4;
  const font3Idx = 5;

  const fontDefs = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '', // Placeholder for Pages
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>',
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>',
    '<</Type/Font/Subtype/Type1/BaseFont/Courier/Encoding/WinAnsiEncoding>>'
  ];

  objects.push(...fontDefs);

  const pageObjIds = [];

  pages.forEach(pContent => {
    const streamLen = Buffer.byteLength(pContent, 'utf8');
    const contentObjIdx = addObject(`<</Length ${streamLen}>>\nstream\n${pContent}\nendstream`);
    const pageObjIdx = addObject(
      `<</Type/Page/Parent ${pagesIdx} 0 R/MediaBox[0 0 595 842]/Resources<<` +
      `/Font<</F1 ${font1Idx} 0 R/F2 ${font2Idx} 0 R/F3 ${font3Idx} 0 R>>>>` +
      `/Contents ${contentObjIdx} 0 R>>`
    );
    pageObjIds.push(pageObjIdx);
  });

  // Update Pages obj
  objects[pagesIdx - 1] = `<</Type/Pages/Kids[${pageObjIds.map(id => id + ' 0 R').join(' ')}]/Count ${pageObjIds.length}>>`;

  // Write file
  let pdf = '%PDF-1.4\n';
  const offsets = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (let i = 0; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<</Size ${objects.length + 1}/Root ${catalogIdx} 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  fs.writeFileSync(outputPath, pdf, 'binary');
  console.log(`[SUCCESS] Compiled PDF with ${pages.length} pages to: ${outputPath} (${pdf.length} bytes)`);
}

const root = path.resolve(__dirname, '..');
const manifestMd = path.join(root, 'docs', 'MANIFEST.md');
const outPdf1 = path.join(root, 'docs', 'MANIFEST.pdf');
const outPdf2 = path.join(root, 'dist-docs', 'MANIFEST.pdf');

fs.mkdirSync(path.join(root, 'dist-docs'), { recursive: true });
createPdf(manifestMd, outPdf1);
fs.copyFileSync(outPdf1, outPdf2);
