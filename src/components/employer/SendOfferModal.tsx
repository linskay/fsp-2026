import React, { useState } from 'react';
import { Send, Building2, Trophy, ShieldCheck, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { CandidateProfile, Vacancy } from '../../types';
import { FspConsentCheckbox, FspPrivacyModal } from '../common/FspPrivacyModal';

interface SendOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile | null;
  vacancies: Vacancy[];
  onSendOffer: (offerData: {
    candidateId: string;
    candidateName: string;
    vacancyId: string;
    vacancyTitle: string;
    proposedSalary: number;
    message: string;
    projectDetails: string;
    perksOffered: string[];
  }) => void;
}

export const SendOfferModal: React.FC<SendOfferModalProps> = ({
  isOpen,
  onClose,
  candidate,
  vacancies,
  onSendOffer
}) => {
  if (!isOpen || !candidate) return null;

  const [selectedVacancyId, setSelectedVacancyId] = useState(vacancies[0]?.id || '');
  const currentVacancy = vacancies.find(v => v.id === selectedVacancyId) || vacancies[0];

  const [proposedSalary, setProposedSalary] = useState<number>(
    currentVacancy ? Math.floor((currentVacancy.salaryMin + currentVacancy.salaryMax) / 2) : 450000
  );
  const [message, setMessage] = useState(
    `Здравствуйте, ${candidate.fullName}! Наша команда впечатлена вашими достижениями в ФСП (${candidate.fspRank}) и отличным прохождением алгоритмического тестирования. Приглашаем вас присоединиться к нашей команде!`
  );
  const [projectDetails, setProjectDetails] = useState(
    currentVacancy?.description || 'Высоконагруженная распределенная система финансового процессинга и микросервисов.'
  );
  const [consent152Fz, setConsent152Fz] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVacancy || !consent152Fz) return;

    onSendOffer({
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      vacancyId: currentVacancy.id,
      vacancyTitle: currentVacancy.title,
      proposedSalary: Number(proposedSalary),
      message,
      projectDetails,
      perksOffered: currentVacancy.perks || ['ДМС', 'Гибкий график', 'Премии']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#131d33] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Отправить персональное приглашение кандидату
              </h3>
              <p className="text-xs text-slate-400">
                Обратная механика найма ФСП: кандидат получит оффер с прозрачной зарплатой
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Target Summary */}
        <div className="p-5 bg-[#0b0f19] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
              {candidate.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {candidate.fullName}
                <span className="text-xs font-normal text-amber-400 flex items-center gap-1 font-semibold">
                  <Trophy className="w-3.5 h-3.5" />
                  {candidate.fspRank}
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                {candidate.title} • ELO: <span className="text-emerald-400 font-bold">{candidate.fspRating}</span>
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[11px]">Ожидания кандидата:</span>
            <span className="text-slate-200 font-mono font-bold">
              {candidate.salaryExpectationMin.toLocaleString('ru-RU')} – {candidate.salaryExpectationMax.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Vacancy selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Выберите вашу вакансию:
            </label>
            <select
              value={selectedVacancyId}
              onChange={(e) => {
                setSelectedVacancyId(e.target.value);
                const vac = vacancies.find(v => v.id === e.target.value);
                if (vac) {
                  setProposedSalary(Math.floor((vac.salaryMin + vac.salaryMax) / 2));
                  setProjectDetails(vac.description);
                }
              }}
              className="w-full bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.salaryMin.toLocaleString('ru-RU')} – {v.salaryMax.toLocaleString('ru-RU')} ₽)
                </option>
              ))}
            </select>
          </div>

          {/* Salary in RUB (Mandatory Fork Validation) */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Предлагаемый оклад в оффере (₽ на руки):</span>
                <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Вилка вакансии: {currentVacancy?.salaryMin.toLocaleString('ru-RU')} – {currentVacancy?.salaryMax.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min={currentVacancy?.salaryMin || 100000}
                max={(currentVacancy?.salaryMax || 1000000) * 1.3}
                step={5000}
                value={proposedSalary}
                onChange={(e) => setProposedSalary(Number(e.target.value))}
                required
                className="w-full bg-slate-950 text-emerald-400 font-mono text-base font-bold rounded-xl p-3 pl-4 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-4 top-3 text-slate-400 text-xs font-mono font-bold">
                РУБ / МЕСЯЦ
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400">
              💡 Правило ФСП Арены: указание оклада обязательно. Соискатель сразу видит точную цифру.
            </p>
          </div>

          {/* Personal message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Персональное обращение к кандидату:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
              placeholder="Расскажите, почему именно этот кандидат заинтересовал команду..."
            />
          </div>

          {/* Project Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Описание проекта и задач:
            </label>
            <textarea
              rows={2}
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300">
            🔒 <strong>Регламент платформы:</strong> Прямой номер телефона и Telegram кандидата откроются в вашей ATS панели после того, как он нажмет «Принять оффер».
          </div>

          {/* 152-FZ Consent Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <FspConsentCheckbox
              checked={consent152Fz}
              onChange={setConsent152Fz}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!consent152Fz}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Отправить оффер соискателю</span>
            </button>
          </div>

        </form>

      </div>

      <FspPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
