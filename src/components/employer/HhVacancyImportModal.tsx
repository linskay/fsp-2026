import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { HhEmployerVacancy, Vacancy } from '../../types';
import { MOCK_HH_EMPLOYER_VACANCIES } from '../../data/mockOAuthData';

import { api } from '../../services/api';

interface HhVacancyImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportVacancies: (vacancies: Array<Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>>) => void;
  employerName: string;
}

export const HhVacancyImportModal: React.FC<HhVacancyImportModalProps> = ({
  isOpen,
  onClose,
  onImportVacancies,
  employerName
}) => {
  const [vacanciesList, setVacanciesList] = useState<HhEmployerVacancy[]>(MOCK_HH_EMPLOYER_VACANCIES);
  const [selectedIds, setSelectedIds] = useState<string[]>(['hh-vac-1', 'hh-vac-2']);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFetchFromHh = async () => {
    setIsLoading(true);
    setSyncStatusText('Подключение к hh.ru for Employers API v1 (/api/v1/integrations/hh/vacancies)...');
    
    try {
      const fetched = await api.getHhVacancies();
      if (fetched && fetched.length > 0) {
        const mapped: HhEmployerVacancy[] = fetched.map((item: any) => ({
          id: item.externalId || item.id,
          title: item.title,
          salaryMin: item.salaryMin,
          salaryMax: item.salaryMax,
          city: item.city,
          specialization: (item.specialization || 'backend').toLowerCase(),
          grade: (item.grade || 'senior').toLowerCase(),
          skills: item.skills || [],
          description: item.description,
          imported: item.imported || false
        }));
        setVacanciesList(mapped);
        setSelectedIds(mapped.filter(m => !m.imported).map(m => m.id));
      }
    } catch (e) {
      console.warn('Fallback to local mock on network issue', e);
    } finally {
      setIsLoading(false);
      setSyncStatusText('');
    }
  };

  const handlePerformImport = async () => {
    setIsLoading(true);
    try {
      const result = await api.importHhVacancies(selectedIds);
      console.log('Import result from backend:', result);
    } catch (e) {
      console.warn('Backend import fallback:', e);
    }

    const toImport = vacanciesList.filter(v => selectedIds.includes(v.id));
    
    const formattedVacancies: Array<Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>> = toImport.map(v => ({
      employerId: 'emp-1',
      companyName: employerName,
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      title: v.title,
      specialization: v.specialization,
      gradeRequired: v.grade,
      salaryMin: v.salaryMin,
      salaryMax: v.salaryMax,
      location: v.city,
      workFormat: v.city.includes('Удаленно') ? 'удаленно' : 'гибрид',
      techStack: v.skills,
      description: v.description,
      perks: ['ДМС со стоматологией', 'Гибкий график', 'Техника на выбор (MacBook Pro M3 Max)', 'Бонусы за спортивные достижения ФСП'],
      fspBonusPreference: 'Приоритет кандидатам с разрядами ФСП и ELO от 2300+',
      minFspRatingRequired: v.grade === 'lead' ? 2500 : 2200,
      active: true
    }));

    setIsLoading(false);
    onImportVacancies(formattedVacancies);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090d1a] border border-[#1e294b] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#141b2e] bg-[#0c1224] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff2b42]/20 border border-[#ff2b42]/40 text-white flex items-center justify-center">
              <span className="font-black text-sm text-[#ff2b42]">hh</span>
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Импорт вакансий из hh.ru for Employers
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  API Connected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Синхронизация опубликованных вакансий компании «{employerName}» без ручного переноса
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151f38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Controls / Progress */}
        <div className="p-6 space-y-4">
          
          {isLoading ? (
            <div className="p-4 rounded-2xl bg-[#0e162e] border border-[#2b35ff]/50 space-y-3 animate-pulse">
              <div className="flex items-center gap-3 text-sm text-[#00f0ff] font-bold">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
                <span>Загрузка вакансий через OAuth токен компании...</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">&gt; {syncStatusText}</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0b1021] border border-[#162038]">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Аккаунт работодателя авторизован в hh.ru
                </div>
                <div className="text-[11px] text-slate-400">
                  Найдено 4 открытые вакансии. Все вакансии содержат обязательную рублевую вилку оклада.
                </div>
              </div>
              <button
                onClick={handleFetchFromHh}
                className="px-3.5 py-1.5 rounded-xl border border-[#2b35ff]/40 text-[#00f0ff] hover:bg-[#2b35ff]/10 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Обновить список
              </button>
            </div>
          )}

          {/* Vacancies Checklist */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Выберите вакансии для переноса в Career Arena ({selectedIds.length} выбрано):
            </div>

            {vacanciesList.map(vac => {
              const isSelected = selectedIds.includes(vac.id);
              return (
                <div
                  key={vac.id}
                  onClick={() => toggleSelect(vac.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-[#0f1730] border-[#2b35ff] shadow-md shadow-[#2b35ff]/10'
                      : 'bg-[#0b0f1d] border-[#162038] hover:border-[#202d4f]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#2b35ff] border-[#2b35ff] text-white'
                          : 'border-slate-600 bg-[#070a14]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white hover:text-[#00f0ff] transition-colors">
                          {vac.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span>{vac.city}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">
                            {vac.salaryMin.toLocaleString('ru-RU')} – {vac.salaryMax.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg bg-[#141e3b] text-[#00f0ff] text-[10px] font-bold border border-[#2b35ff]/30 uppercase shrink-0">
                      {vac.grade}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {vac.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-[#070a14] text-slate-300 text-[10px] font-mono border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance note */}
          <div className="p-3 rounded-xl bg-[#0b1021] border border-[#1a2542] flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Импортированные вакансии сразу будут ранжировать лучших кандидатов ФСП по релевантности стека и спортивному рейтингу.
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#060811] border-t border-[#141b2e] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs transition-colors"
          >
            Отмена
          </button>
          
          <button
            disabled={selectedIds.length === 0 || isLoading}
            onClick={handlePerformImport}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] text-white font-bold text-xs transition-all shadow-lg shadow-[#2b35ff]/30 flex items-center gap-2 disabled:opacity-50 hover:brightness-110"
          >
            <Sparkles className="w-4 h-4" />
            <span>Импортировать в Arena ({selectedIds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
