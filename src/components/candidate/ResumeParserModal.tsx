import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, ShieldCheck, Download, Printer, X, Code, Briefcase, Award } from 'lucide-react';
import { CandidateProfile } from '../../types';
import { FspStarIcon } from '../brand/FspLogo';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#131d33] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {activeMode === 'upload' ? 'AI-Парсер PDF-резюме & Синхронизация с ФСП' : 'Стандартизированный паспорт разработчика ФСП'}
              </h3>
              <p className="text-xs text-slate-400">
                Автоматическое извлечение стека и верификация по 152-ФЗ
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
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Печать / Сохранить в PDF</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
