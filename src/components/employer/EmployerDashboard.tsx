import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Trophy, 
  Award, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Unlock, 
  Plus, 
  ChevronRight, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  Phone, 
  SendHorizontal, 
  HelpCircle,
  ExternalLink,
  SlidersHorizontal,
  FolderGit2,
  Bot,
  RefreshCw
} from 'lucide-react';
import { CandidateProfile, EmployerProfile, Grade, Invitation, Specialization, Vacancy, CandidateAiSummary } from '../../types';
import { SendOfferModal } from './SendOfferModal';
import { CreateVacancyModal } from './CreateVacancyModal';
import { HhVacancyImportModal } from './HhVacancyImportModal';
import { FspStarIcon, FspCircuitBackground } from '../brand/FspLogo';
import { UserAvatar } from '../brand/UserAvatar';
import { LeetCodeStatsCard } from '../candidate/LeetCodeStatsCard';
import { CandidateAiSummaryModal } from '../candidate/CandidateAiSummaryModal';

interface EmployerDashboardProps {
  currentEmployer: EmployerProfile;
  candidates: CandidateProfile[];
  vacancies: Vacancy[];
  invitations: Invitation[];
  onSendOffer: (offerData: any) => void;
  onAddVacancy: (vacancyData: any) => void;
  onSendMessage: (invitationId: string, text: string) => void;
  onUpdateCandidate?: (candidateId: string, updated: Partial<CandidateProfile>) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  currentEmployer,
  candidates,
  vacancies,
  invitations,
  onSendOffer,
  onAddVacancy,
  onSendMessage,
  onUpdateCandidate
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'vacancies' | 'ats' | 'chat'>('candidates');
  
  // Filters for smart candidate search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(1800);
  const [onlyVerifiedFsp, setOnlyVerifiedFsp] = useState(true);

  // Modals state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedCandidateForOffer, setSelectedCandidateForOffer] = useState<CandidateProfile | null>(null);
  const [isCreateVacancyModalOpen, setIsCreateVacancyModalOpen] = useState(false);
  const [isHhImportModalOpen, setIsHhImportModalOpen] = useState(false);
  const [explainModalCandidate, setExplainModalCandidate] = useState<CandidateProfile | null>(null);
  const [aiModalCandidate, setAiModalCandidate] = useState<CandidateProfile | null>(null);

  // Chat state
  const [selectedChatInvId, setSelectedChatInvId] = useState<string | null>(
    invitations.find(i => i.status === 'accepted')?.id || invitations[0]?.id || null
  );
  const [chatMessageText, setChatMessageText] = useState('');

  // Filtered and Ranked candidates
  const filteredCandidates = candidates
    .filter(c => {
      if (onlyVerifiedFsp && !c.isVerified) return false;
      if (selectedSpecialization !== 'all' && c.specialization !== selectedSpecialization) return false;
      if (selectedGrade !== 'all' && c.targetGrade !== selectedGrade) return false;
      if (c.fspRating < minRating) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = c.fullName.toLowerCase().includes(q);
        const inSkills = c.skills.some(s => s.toLowerCase().includes(q));
        const inTitle = c.title.toLowerCase().includes(q);
        if (!inName && !inSkills && !inTitle) return false;
      }
      return true;
    })
    .sort((a, b) => b.fspRating - a.fspRating); // FSP ELO ranking

  // ATS Invitations
  const employerInvitations = invitations.filter(i => i.employerId === currentEmployer.id || i.companyName.includes('Сбер'));
  const activeChatInv = employerInvitations.find(i => i.id === selectedChatInvId);

  const handleOpenOfferModal = (candidate: CandidateProfile) => {
    setSelectedCandidateForOffer(candidate);
    setIsOfferModalOpen(true);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !selectedChatInvId) return;
    onSendMessage(selectedChatInvId, chatMessageText);
    setChatMessageText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Employer Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1020] via-[#0f1730] to-[#070a12] border border-[#2b35ff]/30 p-6 sm:p-8 shadow-2xl">
        <FspCircuitBackground />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0b0f19] border border-[#2b35ff]/40 flex items-center justify-center p-2 shrink-0">
              <Building2 className="w-9 h-9 text-[#60a5fa]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentEmployer.companyName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2b35ff]/20 text-[#60a5fa] border border-[#2b35ff]/40 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentEmployer.fspPartnerLevel}
                </span>
              </div>

              <p className="text-xs text-slate-300 max-w-2xl">
                {currentEmployer.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                <span>Рекрутер: <strong className="text-slate-200">{currentEmployer.hrName}</strong></span>
                <span>•</span>
                <span>Активных вакансий: <strong className="text-[#60a5fa] font-bold">{vacancies.length}</strong></span>
                <span>•</span>
                <span>Отправлено офферов: <strong className="text-emerald-400 font-bold">{employerInvitations.length}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsHhImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#ff2b42]/20 hover:bg-[#ff2b42]/30 text-white text-xs font-bold border border-[#ff2b42]/40 shadow-lg shadow-[#ff2b42]/10 transition-all hover:scale-105"
            >
              <div className="w-4 h-4 rounded-full bg-[#ff2b42] text-white text-[9px] font-black flex items-center justify-center">
                hh
              </div>
              <span>Импорт из hh.ru (API)</span>
            </button>

            <button
              onClick={() => setIsCreateVacancyModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2b35ff] hover:bg-[#2029df] text-white text-xs font-bold shadow-lg shadow-[#2b35ff]/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Опубликовать вакансию (с вилкой ₽)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-4">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'candidates'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Умный поиск кандидатов (ФСП Ранжирование)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold">
              {filteredCandidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vacancies'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Мои вакансии (с вилками)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold">
              {vacancies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ats'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ATS Трекер приглашений</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              {employerInvitations.filter(i => i.status === 'accepted').length} принято
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Диалоги по офферам</span>
          </button>

        </div>
      </div>

      {/* Tab 1: Candidates Smart Search with Explainable AI */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-[#0a0e1c] p-4 sm:p-5 rounded-3xl border border-[#1b233a] space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search text */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по стеку (Java, Go, React), имени..."
                  className="w-full bg-[#0e1428] text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-[#1e294b] focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Spec */}
              <div>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full bg-[#0e1428] text-slate-200 text-xs rounded-xl p-2.5 border border-[#1e294b] focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="all">Все специализации</option>
                  <option value="backend">Backend Инженеры</option>
                  <option value="frontend">Frontend Инженеры</option>
                  <option value="fullstack">Fullstack Разработка</option>
                  <option value="devops">DevOps / SRE</option>
                  <option value="highload">HighLoad & Distributed</option>
                </select>
              </div>

              {/* Grade */}
              <div>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-[#0e1428] text-slate-200 text-xs rounded-xl p-2.5 border border-[#1e294b] focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="all">Любой подтвержденный грейд</option>
                  <option value="senior">Senior (ФСП Tier-1)</option>
                  <option value="middle">Middle (ФСП Tier-2)</option>
                  <option value="junior">Junior (ФСП Tier-3)</option>
                </select>
              </div>

              {/* Rating ELO */}
              <div className="flex items-center gap-2 bg-[#0e1428] px-3 py-2 rounded-xl border border-[#1e294b]">
                <Zap className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Мин. ELO:</span>
                    <span className="text-[#00f0ff] font-bold">{minRating} pts</span>
                  </div>
                  <input
                    type="range"
                    min={1200}
                    max={2700}
                    step={50}
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-[#2b35ff] h-1 bg-[#182035] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Найдено верифицированных кандидатов: <strong className="text-white">{filteredCandidates.length}</strong> (ранжированы по алгоритмическому рейтингу ФСП)
              </span>
              <span className="text-[11px] text-[#00f0ff] flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Explainable Match активен
              </span>
            </div>

            {filteredCandidates.map((c, rankIndex) => (
              <div
                key={c.id}
                className="bg-[#0b0f1d] rounded-3xl border border-[#1d2645] hover:border-[#2b35ff]/60 p-6 space-y-5 transition-all shadow-xl"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    
                    {/* Candidate Avatar with fallback & Rank Index */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative">
                        <UserAvatar
                          name={c.fullName}
                          src={c.avatarUrl}
                          size="lg"
                          rank={c.fspRank}
                        />
                        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#080c18] border border-[#00f0ff]/50 flex items-center justify-center font-black text-[10px] text-[#00f0ff] shadow-md">
                          #{rankIndex + 1}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1">ТОП-{rankIndex + 1}</span>
                    </div>

                    {/* Candidate Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {c.fullName}
                        </h3>
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          {c.fspRank}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
                          Грейд: {c.currentGradeAssigned.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-[#00f0ff] font-semibold">
                        {c.title}
                      </p>

                      <p className="text-xs text-slate-300 max-w-3xl pt-1 leading-relaxed">
                        {c.about}
                      </p>

                      {/* LeetCode Algorithmic Statistics Strip */}
                      {c.leetcodeStats && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                            <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-[10px]">
                              LC
                            </span>
                            <span className="text-white font-bold font-mono">
                              {c.leetcodeStats.totalSolved}
                            </span>
                            <span className="text-slate-400 text-[11px]">задач решено</span>
                            <span className="text-slate-600">|</span>
                            <span className="text-emerald-400 text-[11px] font-mono font-medium">Easy: {c.leetcodeStats.easySolved}</span>
                            <span className="text-amber-400 text-[11px] font-mono font-medium">Med: {c.leetcodeStats.mediumSolved}</span>
                            <span className="text-rose-400 text-[11px] font-mono font-medium">Hard: {c.leetcodeStats.hardSolved}</span>
                            {c.leetcodeStats.badge && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                {c.leetcodeStats.badge}
                              </span>
                            )}
                          </div>

                          {c.leetcodeStats.syncedGithubRepo && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0c1224] border border-[#2b35ff]/30 text-[11px] text-slate-300 font-mono">
                              <FolderGit2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                              <span>{c.leetcodeStats.syncedGithubRepo}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Автосинхронизация LeetHub активна" />
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-slate-500">
                            Рейтинг: #{c.leetcodeStats.ranking.toLocaleString('ru-RU')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating & Benchmarks */}
                  <div className="sm:text-right bg-[#070a14] p-3 rounded-2xl border border-[#1b233a] shrink-0 space-y-1">
                    <div className="text-xs text-slate-400">Рейтинг ФСП ELO:</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {c.fspRating} pts
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Тесты: <strong className="text-white">{c.testScorePercent}%</strong> ({c.avgExecutionTimeMs} ms)
                    </div>
                  </div>
                </div>

                {/* AI-Summary Synthesis Box if available */}
                {c.aiSummary && (
                  <div className="bg-[#080d1e] rounded-2xl p-4 border border-purple-500/30 text-xs space-y-2.5 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-[12px] flex items-center gap-2">
                          AI-Портрет кандидата ({c.aiSummary.modelUsed}):
                          {c.aiSummary.recommendationLevel && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              {c.aiSummary.recommendationLevel}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Чистота кода: <strong className="text-emerald-400 font-mono">{c.aiSummary.codeCleanlinessScore}/100</strong></span>
                        <span>•</span>
                        <span>Решение задач: <strong className="text-cyan-300 font-mono">~{c.aiSummary.averageSolveTimeMinutes} мин</strong></span>
                        <button
                          onClick={() => setAiModalCandidate(c)}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-white border border-purple-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-1"
                          title="Открыть и настроить детальный ИИ-портрет соискателя"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                          <span>ИИ-Досье</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[12px] text-slate-200 italic font-mono leading-relaxed">
                      "{c.aiSummary.summaryText}"
                    </p>

                    {/* Key Strengths & Recommended Roles */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {c.aiSummary.keyStrengths?.map((str, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-0.5 rounded-lg bg-[#0e1730] text-[10px] text-[#00f0ff] border border-[#2b35ff]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{str}</span>
                        </span>
                      ))}
                      {c.aiSummary.recommendedRoles?.map((role, rIdx) => (
                        <span key={rIdx} className="px-2.5 py-0.5 rounded-lg bg-purple-950/40 text-[10px] text-purple-300 border border-purple-500/20">
                          🎯 {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explainable AI Highlight Box */}
                <div className="bg-[#0f1734] rounded-2xl p-3.5 border border-[#2b35ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Sparkles className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <div>
                      <strong className="text-[#00f0ff]">Почему в топе выдачи:</strong>{' '}
                      {c.fspRank.includes('Мастер') || c.fspRank.includes('Победитель')
                        ? `Победа в чемпионате РФ по СП + решение задач за ${c.avgExecutionTimeMs}мс + 100% совпадение стека.`
                        : `КМС по СП + 100% прохождение скрытых тестов Judge0 + стаж ${c.experienceYears} лет.`}
                    </div>
                  </div>

                  <button
                    onClick={() => setExplainModalCandidate(c)}
                    className="text-xs text-[#00f0ff] hover:text-cyan-300 underline underline-offset-2 shrink-0 font-bold"
                  >
                    Подробный разбор матчинга →
                  </button>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-lg bg-[#0e1428] text-slate-300 text-xs font-medium border border-[#1e294b]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer / Masked Contacts & Offer Action */}
                <div className="pt-3 border-t border-[#182038] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* 152-FZ Masked Contacts status */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Контакты: <strong className="font-mono text-[#00f0ff]">{c.phoneMasked}</strong> (защищены 152-ФЗ)</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs mr-2 hidden md:block">
                      <span className="text-slate-400 block text-[10px]">Ожидания:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {c.salaryExpectationMin.toLocaleString('ru-RU')} – {c.salaryExpectationMax.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenOfferModal(c)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:opacity-95 text-slate-950 text-xs font-black shadow-lg shadow-[#2b35ff]/30 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Отправить оффер с вилкой</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 2: Vacancies with Mandatory Salary Fork */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Активные потребности и вакансии компании
              </h2>
              <p className="text-xs text-slate-400">
                Каждая вакансия содержит обязательную вилку зарплаты в рублях без скрытых условий.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHhImportModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ff2b42]/20 hover:bg-[#ff2b42]/30 text-white text-xs font-bold border border-[#ff2b42]/40"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white text-[8px] font-black flex items-center justify-center">
                  hh
                </div>
                <span>Импорт из hh.ru</span>
              </button>

              <button
                onClick={() => setIsCreateVacancyModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2b35ff] hover:bg-[#2029df] text-white text-xs font-bold shadow-md shadow-[#2b35ff]/30"
              >
                <Plus className="w-4 h-4" />
                <span>Создать новую вакансию</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => (
              <div
                key={v.id}
                className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      Грейд: {v.gradeRequired.toUpperCase()} • {v.specialization.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {v.title}
                    </h3>
                  </div>

                  <div className="text-right bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Вилка в ₽:</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {v.salaryMin.toLocaleString('ru-RU')} – {v.salaryMax.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {v.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {v.techStack.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Отправлено приглашений: <strong className="text-white">{v.invitationsCount || 0}</strong></span>
                  <span className="text-emerald-400 font-semibold">● Вакансия активна</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ATS Tracking Kanban */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              ATS Трекер приглашений и офферов
            </h2>
            <p className="text-xs text-slate-400">
              Статусы отслеживания обратного найма. Контакты раскрываются только на этапе «Принято кандидатом».
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Column 1: Sent */}
            <div className="bg-[#0b0f19] rounded-3xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Отправлено ({employerInvitations.filter(i => i.status === 'sent').length})
                </span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>

              {employerInvitations.filter(i => i.status === 'sent').map(inv => {
                const cand = candidates.find(c => c.id === inv.candidateId);
                return (
                  <div key={inv.id} className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <UserAvatar name={inv.candidateName} src={cand?.avatarUrl} size="xs" rank={cand?.fspRank} />
                      <span>{inv.candidateName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{inv.vacancyTitle}</div>
                    <div className="font-mono text-emerald-400 font-bold">{inv.proposedSalary.toLocaleString('ru-RU')} ₽</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" /> Контакты заблокированы
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Viewed */}
            <div className="bg-[#0b0f19] rounded-3xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Просмотрено ({employerInvitations.filter(i => i.status === 'viewed').length})
                </span>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>

              {employerInvitations.filter(i => i.status === 'viewed').map(inv => {
                const cand = candidates.find(c => c.id === inv.candidateId);
                return (
                  <div key={inv.id} className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <UserAvatar name={inv.candidateName} src={cand?.avatarUrl} size="xs" rank={cand?.fspRank} />
                      <span>{inv.candidateName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{inv.vacancyTitle}</div>
                    <div className="font-mono text-emerald-400 font-bold">{inv.proposedSalary.toLocaleString('ru-RU')} ₽</div>
                    <div className="text-[10px] text-yellow-400">Ожидает ответа соискателя</div>
                  </div>
                );
              })}
            </div>

            {/* Column 3: Accepted (Revealed contacts!) */}
            <div className="bg-[#0b0f19] rounded-3xl p-4 border border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Принято 🎉 ({employerInvitations.filter(i => i.status === 'accepted').length})
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              {employerInvitations.filter(i => i.status === 'accepted').map(inv => {
                const cand = candidates.find(c => c.id === inv.candidateId);
                return (
                  <div key={inv.id} className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-2.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={inv.candidateName}
                          src={cand?.avatarUrl}
                          size="xs"
                          rank={cand?.fspRank}
                        />
                        <span>{inv.candidateName}</span>
                      </div>
                      <span className="text-emerald-400 text-[10px] font-bold">152-ФЗ ОК</span>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-xl border border-emerald-500/30 text-[11px] space-y-1 font-mono">
                      <div className="text-slate-300">
                        📞 Тел: <strong className="text-emerald-300">{cand?.phoneReal || '+7 (916) 459-33-42'}</strong>
                      </div>
                      <div className="text-slate-300">
                        💬 TG: <strong className="text-blue-300">{cand?.telegramReal || '@alex_belov_dev'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedChatInvId(inv.id);
                        setActiveTab('chat');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Открыть диалог</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Column 4: Declined */}
            <div className="bg-[#0b0f19] rounded-3xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Отклонено ({employerInvitations.filter(i => i.status === 'declined').length})
                </span>
                <Lock className="w-4 h-4 text-slate-500" />
              </div>

              {employerInvitations.filter(i => i.status === 'declined').map(inv => (
                <div key={inv.id} className="bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2 opacity-60">
                  <div className="font-bold text-slate-400">{inv.candidateName}</div>
                  <div className="text-[10px] text-slate-500">Причина: {inv.declineReason || 'Не указана'}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Chat with Candidate */}
      {activeTab === 'chat' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          
          <div className="md:col-span-4 bg-[#0b0f19] border-r border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Принятые офферы кандидатов:
            </h3>

            <div className="space-y-2">
              {employerInvitations.filter(i => i.status === 'accepted').map(inv => {
                const cand = candidates.find(c => c.id === inv.candidateId);
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedChatInvId(inv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      selectedChatInvId === inv.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={inv.candidateName} src={cand?.avatarUrl} size="xs" rank={cand?.fspRank} />
                        <span className="font-bold text-xs">{inv.candidateName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {inv.proposedSalary.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{inv.vacancyTitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between bg-[#0e1424]">
            {activeChatInv ? (
              <>
                <div className="p-4 bg-[#11192e] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={activeChatInv.candidateName}
                      src={candidates.find(c => c.id === activeChatInv.candidateId)?.avatarUrl}
                      size="sm"
                      rank={candidates.find(c => c.id === activeChatInv.candidateId)?.fspRank}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {activeChatInv.candidateName} ({activeChatInv.vacancyTitle})
                      </h4>
                      <p className="text-xs text-slate-400">
                        Согласованный оффер: <strong className="text-emerald-400 font-mono">{activeChatInv.proposedSalary.toLocaleString('ru-RU')} ₽</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    Контакты открыты
                  </span>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto max-h-[380px] flex-1">
                  {activeChatInv.chatMessages.map(msg => {
                    const isEmployer = msg.sender === 'employer';
                    return (
                      <div key={msg.id} className={`flex ${isEmployer ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                            isEmployer
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="text-[9px] opacity-70 block text-right">
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendChat} className="p-3.5 bg-[#11192e] border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    placeholder="Напишите сообщение кандидату..."
                    className="flex-1 bg-slate-900 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center p-8 text-center text-slate-400 h-full text-sm">
                Выберите диалог слева
              </div>
            )}
          </div>

        </div>
      )}

      {/* Explainable Match Detail Modal */}
      {explainModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-bold text-white">
                  Объяснимость алгоритма ранжирования ФСП
                </h3>
              </div>
              <button
                onClick={() => setExplainModalCandidate(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Кандидат:</span>
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={explainModalCandidate.fullName}
                    src={explainModalCandidate.avatarUrl}
                    size="xs"
                    rank={explainModalCandidate.fspRank}
                  />
                  <span className="text-white font-bold">{explainModalCandidate.fullName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">1. Спортивные титулы ФСП (+35%):</span>
                  <span className="text-amber-400 font-bold">{explainModalCandidate.fspRank} (100/100)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2. Скорость алгоритмов в Judge0 (+30%):</span>
                  <span className="text-emerald-400 font-bold">{explainModalCandidate.avgExecutionTimeMs} ms (Топ 0.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3. Совпадение стека технологий (+25%):</span>
                  <span className="text-blue-400 font-bold">100% (Java 21, Spring 3, Postgres)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">4. Верификация Keycloak SSO (+10%):</span>
                  <span className="text-purple-400 font-bold">Подтверждено</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-right">
                <span className="text-xs text-slate-400">Итоговый Match Score:</span>
                <div className="text-xl font-black text-emerald-400 font-mono">99.4%</div>
              </div>
            </div>

            <button
              onClick={() => setExplainModalCandidate(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
      <SendOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        candidate={selectedCandidateForOffer}
        vacancies={vacancies}
        onSendOffer={onSendOffer}
      />

      {/* Create Vacancy Modal */}
      <CreateVacancyModal
        isOpen={isCreateVacancyModalOpen}
        onClose={() => setIsCreateVacancyModalOpen(false)}
        onAddVacancy={onAddVacancy}
        currentEmployerName={currentEmployer.companyName}
      />

      {/* hh.ru Vacancies Import Modal */}
      <HhVacancyImportModal
        isOpen={isHhImportModalOpen}
        onClose={() => setIsHhImportModalOpen(false)}
        employerName={currentEmployer.companyName}
        onImportVacancies={(importedList) => {
          importedList.forEach(vac => onAddVacancy(vac));
        }}
      />

      {/* Candidate AI Summary Modal */}
      {aiModalCandidate && (
        <CandidateAiSummaryModal
          isOpen={!!aiModalCandidate}
          onClose={() => setAiModalCandidate(null)}
          candidate={aiModalCandidate}
          onSaveSummary={(updatedSummary) => {
            if (onUpdateCandidate) {
              onUpdateCandidate(aiModalCandidate.id, { aiSummary: updatedSummary });
            }
            setAiModalCandidate(null);
          }}
        />
      )}

    </div>
  );
};
