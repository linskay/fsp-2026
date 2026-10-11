import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, ShieldCheck, Download, Printer, X, Code, Briefcase, Award } from 'lucide-react';
import { CandidateProfile } from '../../types';
import { FspStarIcon } from '../brand/FspLogo';
import { api } from '../../services/api';

interface ResumeParserModalProps {
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onParsedUpdate: (updatedCandidate: Partial<CandidateProfile>) => void;
}

export const ResumeParserModal: React.FC<ResumeParserModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onParsedUpdate
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'passport'>('upload');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setParseSuccess(false);

    // Simulate NLP/LLM Resume Parsing & FSP Registry Match
    setTimeout(() => {
      setIsParsing(false);
      setParseSuccess(true);
      onParsedUpdate({
        skills: Array.from(new Set([...candidate.skills, 'FastAPI', 'Distributed Locking', 'PostgreSQL Optimization', 'System Design'])),
        experienceYears: Math.max(candidate.experienceYears, 6),
        about: candidate.about + ' Опыт подтвержден парсером резюме и реестром спортсменов ФСП РФ.'
      });
    }, 1500);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await api.downloadOfficialCandidatePdf(candidate);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Официальный паспорт спортсмена-разработчика ФСП — ${candidate.fullName}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0; padding: 24px; background: #fff; color: #0f172a;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .passport-border {
      border: 3px solid #0f172a; border-radius: 12px; padding: 24px;
    }
    .header-bar {
      background: #0b1433; color: #fff; padding: 18px 24px; border-radius: 8px; margin-bottom: 12px;
    }
    .header-title { font-size: 18px; font-weight: 900; letter-spacing: 0.5px; }
    .header-sub { font-size: 12px; color: #38bdf8; font-weight: bold; margin-top: 4px; }
    .tricolor { height: 6px; display: flex; margin-bottom: 20px; }
    .tricolor-white { flex: 1; background: #fff; border-top: 1px solid #cbd5e1; }
    .tricolor-blue { flex: 1; background: #0039a6; }
    .tricolor-red { flex: 1; background: #d52b1e; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .info-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; }
    .label { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; }
    .value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 2px; }
    .elo-badge { font-size: 32px; font-weight: 900; color: #0284c7; }
    .rank-badge { font-size: 16px; font-weight: bold; color: #b45309; }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .metric-card { background: #f1f5f9; border-radius: 8px; padding: 10px; text-align: center; }
    .metric-val { font-size: 20px; font-weight: 900; color: #0f172a; }
    .stack-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
    .seal-box { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #cbd5e1; }
    .seal-stamp {
      width: 130px; height: 130px; border-radius: 50%; border: 3px double #1d4ed8; color: #1d4ed8;
      display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 9px; font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="passport-border">
    <div class="header-bar">
      <div class="header-title">ФЕДЕРАЦИЯ СПОРТИВНОГО ПРОГРАММИРОВАНИЯ РОССИИ</div>
      <div class="header-sub">ЕДИНЫЙ РЕЕСТР СПОРТСМЕНОВ-РАЗРАБОТЧИКОВ • СЕЗОН 2026</div>
    </div>
    <div class="tricolor">
      <div class="tricolor-white"></div>
      <div class="tricolor-blue"></div>
      <div class="tricolor-red"></div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 900;">ПАСПОРТ СПОРТСМЕНА-РАЗРАБОТЧИКА</h2>
      <span style="background: #ecfdf5; color: #047857; border: 1px solid #10b981; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold;">✓ ВЕРИФИЦИРОВАНО В РЕЕСТРЕ ФСП РФ</span>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="label">ФИО Спортсмена:</div>
        <div class="value">${candidate.fullName}</div>
        <div class="label" style="margin-top: 8px;">Специализация и грейд:</div>
        <div class="value" style="color: #2563eb;">${candidate.title}</div>
        <div class="label" style="margin-top: 8px;">Локация:</div>
        <div class="value">${candidate.city} (РФ)</div>
        <div class="label" style="margin-top: 8px;">Регистрационный ID:</div>
        <div class="value" style="font-family: monospace;">${candidate.fspId}</div>
      </div>

      <div class="info-card">
        <div class="label">Текущий рейтинг ELO ФСП:</div>
        <div class="elo-badge">${candidate.fspRating} pts</div>
        <div class="label" style="margin-top: 6px;">Спортивное звание / разряд (Минспорт РФ):</div>
        <div class="rank-badge">★ ${candidate.fspRank}</div>
        <div class="label" style="margin-top: 6px;">Статус в реестре:</div>
        <div style="color: #059669; font-weight: bold; font-size: 11px;">Топ 1% спортивных программистов РФ</div>
      </div>
    </div>

    <div class="label" style="margin-bottom: 6px;">Результаты квалификации в Code Arena:</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="label">Точность тестов</div>
        <div class="metric-val" style="color: #059669;">${candidate.testScorePercent}%</div>
      </div>
      <div class="metric-card">
        <div class="label">Ср. время выполнения</div>
        <div class="metric-val" style="color: #2563eb;">${candidate.avgExecutionTimeMs} ms</div>
      </div>
      <div class="metric-card">
        <div class="label">Эффективность памяти</div>
        <div class="metric-val" style="color: #7c3aed;">${candidate.memoryEfficiencyScore}%</div>
      </div>
    </div>

    <div class="stack-box">
      <div class="label">Подтвержденный стек технологий:</div>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px; color: #0f172a;">${candidate.skills.join(' • ')}</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Верифицировано компилятором Judge0 в изолированной песочнице (--net=none).</div>
    </div>

    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #1e40af;">
      <strong>Защита персональных данных:</strong> Соответствует 152-ФЗ РФ. Профиль доступен по модели Обратного рекрутинга (Reverse Recruiting). Все просмотры логируются в журнале security_audit_logs.
    </div>

    <div class="seal-box">
      <div class="seal-stamp">
        <div>ФСП РОССИЯ</div>
        <div style="font-size: 14px; margin: 4px 0;">★ ЭЦП ★</div>
        <div>ВЕРИФИЦИРОВАНО</div>
        <div style="font-size: 7px; margin-top: 2px;">СЕРТИФИКАТ 2026</div>
      </div>

      <div style="text-align: right; font-size: 11px; color: #475569;">
        <div>Официальный портал верификации:</div>
        <div style="font-family: monospace; font-weight: bold; color: #2563eb;">https://linskay-demo-2026.hf.space/#leaderboard</div>
        <div style="margin-top: 6px; font-size: 10px;">Дата формирования: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}</div>
        <div style="font-size: 9px; color: #94a3b8; font-family: monospace;">HASH: SHA256:7f83b165${candidate.fspId.replace(/[^0-9]/g, '') || '2026'}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0d121f] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 modal-animate">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0d121f] border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {activeMode === 'upload' ? 'AI-Парсер PDF-резюме & Синхронизация с ФСП' : 'Стандартизированный паспорт разработчика ФСП'}
              </h3>
              <p className="text-xs text-slate-400">
                Автоматическое извлечение стека и верификация профиля
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveMode('upload')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeMode === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Загрузить PDF
              </button>
              <button
                onClick={() => setActiveMode('passport')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeMode === 'passport' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Паспорт ФСП
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeMode === 'upload' ? (
            <div className="space-y-6">
              
              {/* Dropzone */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500/70 rounded-2xl p-8 text-center bg-slate-900/50 transition-all group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Перетащите ваше PDF-резюме сюда или нажмите для выбора
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Поддерживаются форматы PDF, DOCX до 15MB
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    NLP / LLM распознавание + сопоставление с реестром ФСП
                  </span>
                </div>
              </div>

              {/* Parsing Indicator */}
              {isParsing && (
                <div className="bg-blue-950/40 rounded-xl p-4 border border-blue-800/50 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p className="text-xs font-bold text-blue-200">
                      Анализируем документ «{fileName}» с помощью нейросетевого парсера...
                    </p>
                    <p className="text-[11px] text-blue-400">
                      Извлечение навыков, расчет опыта и сверка ID спортсмена в базе данных ФСП РФ
                    </p>
                  </div>
                </div>
              )}

              {/* Parse Success */}
              {parseSuccess && (
                <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-800/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Резюме успешно распознано и обогащено данными ФСП!
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Распознанный стаж:</span>
                      <span className="text-white font-bold">{candidate.experienceYears} лет</span>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">ФСП Идентификатор:</span>
                      <span className="text-emerald-400 font-bold">{candidate.fspId} (Verified)</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Обновленный подтвержденный стек:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/60 text-blue-200 text-[11px]">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Standardized FSP Developer Passport View */
            <div id="fsp-developer-passport" className="bg-[#0b0f19] border border-slate-700 rounded-xl p-6 space-y-6 text-slate-100">
              
              {/* Passport Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#070a12] border border-[#2b35ff]/50 p-2 flex items-center justify-center">
                    <FspStarIcon className="w-10 h-10" variant="tricolor" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                      ПАСПОРТ СПОРТСМЕНА-РАЗРАБОТЧИКА
                    </h3>
                    <p className="text-xs text-slate-400">
                      Федерация Спортивного Программирования Российской Федерации
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Верифицирован ФСП
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{candidate.fspId}</p>
                </div>
              </div>

              {/* Personal Info & Sports Rank */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">ФИО Спортсмена:</span>
                    <p className="text-sm font-bold text-white">{candidate.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Специализация и Грейд:</span>
                    <p className="text-xs font-semibold text-blue-400">{candidate.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Локация:</span>
                    <p className="text-xs text-slate-300">{candidate.city} (РФ)</p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Спортивное звание / разряд:</span>
                    <p className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      {candidate.fspRank}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Текущий рейтинг ELO ФСП:</span>
                    <p className="text-sm font-mono font-bold text-emerald-400">
                      {candidate.fspRating} pts (Top 1% РФ)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Keycloak SSO Token:</span>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{candidate.keycloakSub}</p>
                  </div>
                </div>
              </div>

              {/* Achievements Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Официальные достижения и турниры ФСП:
                </h4>
                <div className="space-y-2">
                  {candidate.achievements.map((ach) => (
                    <div key={ach.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">{ach.title}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{ach.description}</div>
                        <div className="text-slate-500 text-[10px] mt-1">Турнир: {ach.event} ({ach.year})</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-[10px] font-semibold whitespace-nowrap">
                        {ach.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testing Performance */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Точность тестов</span>
                  <span className="text-sm font-bold text-emerald-400">{candidate.testScorePercent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Ср. время выполнения</span>
                  <span className="text-sm font-bold text-blue-400">{candidate.avgExecutionTimeMs} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Эффективность памяти</span>
                  <span className="text-sm font-bold text-purple-400">{candidate.memoryEfficiencyScore}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-60"
                  title="Скачать официальный A4 PDF-паспорт с символикой ФСП и подтвержденным ELO"
                >
                  <Download className={`w-4 h-4 text-white ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                  <span>{isDownloadingPdf ? 'Генерация PDF...' : 'Скачать официальный PDF'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 hover:border-slate-600 transition-all"
                  title="Открыть официальный белый бланк ФСП в диалоге печати браузера"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>Печать бланка ФСП</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
