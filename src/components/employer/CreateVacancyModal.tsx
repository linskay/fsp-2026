import React, { useState } from 'react';
import { Plus, X, Building2, Trophy, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Grade, Specialization, Vacancy } from '../../types';
import { FspConsentCheckbox, FspPrivacyModal } from '../common/FspPrivacyModal';

interface CreateVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVacancy: (vacancy: Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>) => void;
  currentEmployerName: string;
}

export const CreateVacancyModal: React.FC<CreateVacancyModalProps> = ({
  isOpen,
  onClose,
  onAddVacancy,
  currentEmployerName
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState<Specialization>('backend');
  const [gradeRequired, setGradeRequired] = useState<Grade>('senior');
  const [salaryMin, setSalaryMin] = useState<number>(380000);
  const [salaryMax, setSalaryMax] = useState<number>(520000);
  const [location, setLocation] = useState('Москва / Удаленно по РФ');
  const [workFormat, setWorkFormat] = useState<'удаленно' | 'гибрид' | 'офис'>('удаленно');
  const [techStackInput, setTechStackInput] = useState('Java 21, Spring Boot 3, PostgreSQL, Kafka, Redis, Docker');
  const [description, setDescription] = useState('');
  const [perksInput, setPerksInput] = useState('Годовой бонус до 30%, ДМС со стоматологией, Техника Apple');
  const [fspBonusPreference, setFspBonusPreference] = useState('Приоритет кандидатам с разрядом КМС / МС ФСП');
  const [minFspRatingRequired, setMinFspRatingRequired] = useState<number>(2200);
  const [consent152Fz, setConsent152Fz] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Укажите название позиции');
      return;
    }
    if (salaryMax < salaryMin) {
      setError('Максимальная зарплата не может быть меньше минимальной');
      return;
    }
    if (!consent152Fz) {
      setError('Необходимо принять согласие на обработку персональных данных (152-ФЗ)');
      return;
    }

    const techStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);
    const perks = perksInput.split(',').map(s => s.trim()).filter(Boolean);

    onAddVacancy({
      employerId: 'emp-1',
      companyName: currentEmployerName,
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      title,
      specialization,
      gradeRequired,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      location,
      workFormat,
      techStack,
      description: description || 'Разработка отказоустойчивых сервисов и алгоритмических модулей.',
      perks,
      fspBonusPreference,
      minFspRatingRequired: Number(minFspRatingRequired),
      active: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0d121f] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 modal-animate">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#0d121f] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Публикация потребности / вакансии
              </h3>
              <p className="text-xs text-slate-400">
                С обязательным указанием прозрачной зарплатной вилки в рублях «от-до»
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Название вакансии / роли: *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="например, Senior Backend Engineer (HighLoad Core)"
              className="w-full bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Grid Spec & Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Специализация:
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value as any)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-slate-700"
              >
                <option value="backend">Backend Разработка</option>
                <option value="frontend">Frontend Разработка</option>
                <option value="fullstack">Fullstack Разработка</option>
                <option value="devops">DevOps & Cloud SRE</option>
                <option value="ai_ml">AI / Machine Learning</option>
                <option value="highload">HighLoad & Distributed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Целевой грейд ФСП:
              </label>
              <select
                value={gradeRequired}
                onChange={(e) => setGradeRequired(e.target.value as any)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-slate-700"
              >
                <option value="junior">Junior (ФСП Tier-3)</option>
                <option value="middle">Middle (ФСП Tier-2)</option>
                <option value="senior">Senior (ФСП Tier-1)</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>

          {/* Mandatory Salary Fork in RUB */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Обязательная вилка заработной платы (в рублях):</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                Требование платформы ФСП
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">От (руб / мес):</span>
                <input
                  type="number"
                  step={5000}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-sm font-bold rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">До (руб / мес):</span>
                <input
                  type="number"
                  step={5000}
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-sm font-bold rounded-xl p-2.5 border border-slate-700"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 На FSP Career Arena запрещены вакансии «по договоренности». Четкая вилка повышает отклик топ-спортсменов в 4.8 раза.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Стек технологий (через запятую):
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Описание задач и проекта:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите задачи команды, архитектуру и масштаб..."
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-700"
            />
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
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              Опубликовать вакансию
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
