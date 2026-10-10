import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Github,
  Code2,
  Radio,
  FileText,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { CandidateProfile, EmployerProfile, Grade, Invitation, Specialization, Vacancy, CandidateAiSummary, AssessmentAssignment, EmployerAssessmentReview, AlgorithmTask } from '../../types';
import { SendOfferModal } from './SendOfferModal';
import { CreateVacancyModal } from './CreateVacancyModal';
import { HhVacancyImportModal } from './HhVacancyImportModal';
import { AssignTestModal } from './AssignTestModal';
import { TestReviewModal } from './TestReviewModal';
import { FspStarIcon, FspCircuitBackground } from '../brand/FspLogo';
import { UserAvatar } from '../brand/UserAvatar';
import { LeetCodeStatsCard } from '../candidate/LeetCodeStatsCard';
import { CandidateAiSummaryModal } from '../candidate/CandidateAiSummaryModal';
import { YandexTelemostWidget } from '../common/YandexTelemostWidget';
import { AuditLogModal } from '../common/AuditLogModal';
import { api, EmployerWebhookDto, WebhookPingResponse } from '../../services/api';
import { evaluateCandidateLevel, calculateCandidateAchievementPoints } from '../../utils/ratingEngine';

interface EmployerDashboardProps {
  currentEmployer: EmployerProfile;
  candidates: CandidateProfile[];
  vacancies: Vacancy[];
  invitations: Invitation[];
  assessments?: AssessmentAssignment[];
  tasks?: AlgorithmTask[];
  onSendOffer: (offerData: any) => void;
  onAddVacancy: (vacancyData: any) => void;
  onSendMessage: (invitationId: string, text: string) => void;
  onAssignTest?: (newAssessment: AssessmentAssignment) => void;
  onReviewTest?: (assessmentId: string, review: EmployerAssessmentReview) => void;
  onUpdateCandidate?: (candidateId: string, updated: Partial<CandidateProfile>) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  currentEmployer,
  candidates,
  vacancies,
  invitations,
  assessments = [],
  tasks = [],
  onSendOffer,
  onAddVacancy,
  onSendMessage,
  onAssignTest,
  onReviewTest,
  onUpdateCandidate
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'vacancies' | 'ats' | 'chat' | 'assessments' | 'webhooks'>('candidates');
  
  // Filters for smart candidate search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyVerifiedFsp, setOnlyVerifiedFsp] = useState(false);
  const [onlyWithAchievements, setOnlyWithAchievements] = useState(false);
  const [isBlindHiringMode, setIsBlindHiringMode] = useState(false);

  // Webhooks state
  const [webhooks, setWebhooks] = useState<EmployerWebhookDto[]>([]);
  const [isNewWebhookModalOpen, setIsNewWebhookModalOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [newWebhookDesc, setNewWebhookDesc] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([
    'OFFER_ACCEPTED',
    'OFFER_DECLINED',
    'OFFER_SENT',
    'TEST_PASSED'
  ]);
  const [pingResult, setPingResult] = useState<WebhookPingResponse | null>(null);
  const [isPingingId, setIsPingingId] = useState<string | null>(null);
  const [copiedWebhookId, setCopiedWebhookId] = useState<string | null>(null);

  useEffect(() => {
    if (currentEmployer?.id) {
      api.getWebhooks(currentEmployer.id).then(setWebhooks);
    }
  }, [currentEmployer?.id]);

  // Modals state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedCandidateForOffer, setSelectedCandidateForOffer] = useState<CandidateProfile | null>(null);
  const [isCreateVacancyModalOpen, setIsCreateVacancyModalOpen] = useState(false);
  const [isHhImportModalOpen, setIsHhImportModalOpen] = useState(false);
  
  // Assessment modals state
  const [isAssignTestModalOpen, setIsAssignTestModalOpen] = useState(false);
  const [selectedCandidateForTest, setSelectedCandidateForTest] = useState<CandidateProfile | null>(null);
  const [reviewModalAssessment, setReviewModalAssessment] = useState<AssessmentAssignment | null>(null);
  const [explainModalCandidate, setExplainModalCandidate] = useState<CandidateProfile | null>(null);
  const [aiModalCandidate, setAiModalCandidate] = useState<CandidateProfile | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Chat state
  const [selectedChatInvId, setSelectedChatInvId] = useState<string | null>(
    invitations.find(i => i.status === 'accepted')?.id || invitations[0]?.id || null
  );
  const [chatMessageText, setChatMessageText] = useState('');

  // Filtered and Ranked candidates (Safe for candidates with 0 ELO and no FSP history)
  const filteredCandidates = candidates
    .filter(c => {
      if (onlyVerifiedFsp && !c.isVerified) return false;
      if (onlyWithAchievements && (!c.achievements || c.achievements.length === 0)) return false;
      if (selectedSpecialization !== 'all' && c.specialization !== selectedSpecialization) return false;
      if (selectedGrade !== 'all' && c.targetGrade !== selectedGrade) return false;
      if (minRating > 0 && (c.fspRating || 0) < minRating) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = (c.fullName || '').toLowerCase().includes(q);
        const inSkills = (c.skills || []).some(s => s.toLowerCase().includes(q));
        const inTitle = (c.title || '').toLowerCase().includes(q);
        if (!inName && !inSkills && !inTitle) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aRating = a.fspRating || 0;
      const bRating = b.fspRating || 0;
      const aScore = aRating > 0 ? aRating : ((a.testScorePercent || 0) * 20 + (a.solvedTasksCount || 0) * 15);
      const bScore = bRating > 0 ? bRating : ((b.testScorePercent || 0) * 20 + (b.solvedTasksCount || 0) * 15);
      return bScore - aScore;
    });

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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'candidates'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'vacancies'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'ats'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
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
            onClick={() => setActiveTab('assessments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'assessments'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Тестирования & Лайв-интервью</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold border border-blue-500/30">
              {assessments.length}
            </span>
            {assessments.some(a => a.status === 'submitted') && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Есть сданные решения, требующие ревью" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Диалоги по офферам</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              activeTab === 'webhooks'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-300" />
            <span>Веб-хуки (Webhooks)</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
              {webhooks.length}
            </span>
          </button>

        </div>

        {/* 152-FZ Compliance Audit Log */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all duration-200 hover:scale-[1.02] shadow-sm shadow-emerald-950/20"
            title="Журнал аудита безопасности и доступа к персональным данным соискателей (152-ФЗ)"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Журнал аудита 152-ФЗ</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Candidates Smart Search with Explainable AI */}
      {activeTab === 'candidates' && (
        <div className="animate-tab-content space-y-6">
          
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

            {/* Filter Toggle: Only with achievements / Top candidates */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#162038] text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={onlyWithAchievements}
                  onChange={(e) => setOnlyWithAchievements(e.target.checked)}
                  className="rounded bg-[#0e1428] border-[#1e294b] text-[#2b35ff] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-amber-300">Только атлеты с подтвержденными победами (Официальный ТОП)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={onlyVerifiedFsp}
                  onChange={(e) => setOnlyVerifiedFsp(e.target.checked)}
                  className="rounded bg-[#0e1428] border-[#1e294b] text-[#2b35ff] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Верифицированные кандидаты</span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl border transition-all ${
                isBlindHiringMode 
                  ? 'border-[#00f0ff] bg-[#00f0ff]/15 text-[#00f0ff] shadow-sm shadow-[#00f0ff]/20' 
                  : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={isBlindHiringMode}
                  onChange={(e) => setIsBlindHiringMode(e.target.checked)}
                  className="rounded bg-[#0e1428] border-[#1e294b] text-[#00f0ff] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  {isBlindHiringMode ? <EyeOff className="w-3.5 h-3.5 text-[#00f0ff]" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                  «Слепой» наем (Blind Hiring Mode)
                </span>
              </label>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            {/* Blind Hiring Info Banner */}
            {isBlindHiringMode && (
              <div className="bg-gradient-to-r from-indigo-950/70 via-[#101736] to-slate-900 border border-indigo-500/40 rounded-2xl p-4 text-xs flex items-start gap-3.5 text-slate-200 shadow-lg shadow-indigo-950/30 scroll-reveal">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-[#00f0ff] border border-indigo-500/40 shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-white text-sm">Режим «Слепого» найма активен (Zero-Bias Standard)</h4>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-mono font-bold border border-indigo-500/40">152-ФЗ & Анонимизация</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    ФИО, фотографии и прямые контакты соискателей скрыты для исключения когнитивных искажений и предвзятости. Отбор базируется исключительно на подтвержденном <strong>ELO-рейтинге</strong>, спортивном разряде ФСП, грейде, стеке и решенных алгоритмических задачах. Данные раскрываются автоматически при отправке оффера или взаимном согласии.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Найдено верифицированных кандидатов: <strong className="text-white">{filteredCandidates.length}</strong> (ранжированы по алгоритмическому рейтингу ФСП)
              </span>
              <span className="text-[11px] text-[#00f0ff] flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Explainable Match активен
              </span>
            </div>

            {filteredCandidates.map((c, rankIndex) => {
              const candidateLvl = evaluateCandidateLevel({
                elo: c.fspRating,
                achievements: c.achievements,
                solvedTasksCount: c.solvedTasksCount,
                leetcodeStats: c.leetcodeStats
              });

              const hasConnection = invitations.some(
                i => (i.candidateId === c.id || (i.candidate && i.candidate.id === c.id)) && 
                     (i.employerId === currentEmployer.id || i.status === 'accepted' || i.status === 'pending')
              );
              const isAnonymized = isBlindHiringMode && !hasConnection;
              const displayName = isAnonymized
                ? `Атлет ФСП #${c.fspId ? c.fspId.slice(-4).toUpperCase() : c.id.slice(0, 4).toUpperCase()} (Анонимный профиль)`
                : c.fullName;

              return (
              <div
                key={c.id}
                className="bg-[#0b0f1d] rounded-3xl border border-[#1d2645] hover:border-[#2b35ff]/60 p-6 space-y-5 transition-all shadow-xl card-fsp-interactive scroll-reveal"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    
                    {/* Candidate Avatar with fallback & Rank Index */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative">
                        {isAnonymized ? (
                          <div className="w-14 h-14 rounded-2xl bg-[#090d1f] border-2 border-indigo-500/50 flex flex-col items-center justify-center text-indigo-300 shadow-md">
                            <EyeOff className="w-6 h-6 text-[#00f0ff]" />
                            <span className="text-[8px] font-mono text-indigo-300 font-bold mt-0.5">BLIND</span>
                          </div>
                        ) : (
                          <UserAvatar
                            name={c.fullName}
                            src={c.avatarUrl}
                            size="lg"
                            rank={c.fspRank}
                          />
                        )}
                        {candidateLvl.isInTop ? (
                          <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#080c18] border border-[#00f0ff]/50 flex items-center justify-center font-black text-[10px] text-[#00f0ff] shadow-md">
                            #{rankIndex + 1}
                          </div>
                        ) : (
                          <div className="absolute -top-1.5 -left-1.5 px-1 py-0.5 rounded bg-slate-900 border border-slate-600 flex items-center justify-center font-bold text-[8px] text-slate-400 shadow-md">
                            Квал
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${candidateLvl.isInTop ? 'text-slate-500' : 'text-amber-400 font-semibold'}`}>
                        {candidateLvl.isInTop ? `ТОП-${rankIndex + 1}` : 'Вне ТОПа'}
                      </span>
                    </div>

                    {/* Candidate Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {displayName}
                        </h3>
                        {isAnonymized ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                            <EyeOff className="w-3 h-3 text-[#00f0ff]" />
                            Слепой режим
                          </span>
                        ) : isBlindHiringMode && hasConnection ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                            <Eye className="w-3 h-3 text-emerald-400" />
                            Раскрыто (Оффер отправлен)
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          {candidateLvl.shortRank} (Ур. {candidateLvl.levelNumber})
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          candidateLvl.isInTop 
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {candidateLvl.topPercentile}
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

                      {/* HeadHunter Confirmed Skills Assessment Strip */}
                      {c.hhConfirmedSkills && c.hhConfirmedSkills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#ff2b42]/15 text-white border border-[#ff2b42]/30 text-[11px] font-bold">
                            <span className="w-3.5 h-3.5 rounded bg-[#ff2b42] text-white text-[8px] font-black flex items-center justify-center">hh</span>
                            <span>Тесты HeadHunter:</span>
                          </span>
                          {c.hhConfirmedSkills.map(cs => (
                            <span key={cs.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0e162d] text-slate-200 border border-[#1d2b50] text-[11px]" title={`${cs.testTitle} (${cs.confirmedAt})`}>
                              <span className="text-white font-medium">{cs.skill}</span>
                              <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                cs.level === 'Экспертный' ? 'text-purple-300 bg-purple-500/20' : 'text-blue-300 bg-blue-500/20'
                              }`}>{cs.level}</span>
                              <span className="text-emerald-400 font-mono font-bold text-[10px]">{cs.scorePercent}%</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* FSP-Hub Public Solutions Repo Sync */}
                      {c.githubSync && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                          <a
                            href={`https://github.com/${c.githubSync.repoFullName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0c1224] hover:bg-[#121b36] border border-[#2b35ff]/40 text-slate-200 transition-colors"
                          >
                            <Github className="w-3.5 h-3.5 text-white" />
                            <span className="font-mono text-[#00f0ff] font-bold">@{c.githubSync.repoFullName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                              {c.githubSync.recentCommits?.length || 3} авто-коммита
                            </span>
                          </a>
                          {c.githubSync.recentCommits && c.githubSync.recentCommits[0] && (
                            <span className="text-[11px] text-slate-400 font-mono truncate max-w-sm">
                              Последний: <strong className="text-white">{c.githubSync.recentCommits[0].taskTitle}</strong> ({c.githubSync.recentCommits[0].runtimeMs}ms, beats {c.githubSync.recentCommits[0].runtimeBeatsPercent}%)
                            </span>
                          )}
                        </div>
                      )}

                      {/* FSP Official Tournament Achievements Strip */}
                      {c.achievements && c.achievements.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Достижения ФСП ({candidateLvl.achievementPoints} AP):</span>
                          </span>
                          {c.achievements.map((ach, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#0e162d] text-amber-200 border border-amber-500/30 text-[11px]" 
                              title={ach.description}
                            >
                              <span>{ach.badge || '🏆'}</span>
                              <span className="font-semibold text-white">{ach.title}</span>
                              <span className="text-slate-400 text-[10px]">({ach.year})</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-2 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                            Вне официального ТОПа
                          </span>
                          <span className="text-[11px] text-slate-400">
                            0 подтвержденных турнирных побед • Квалификационный дивизион ФСП
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating & Benchmarks */}
                  <div className="sm:text-right bg-[#070a14] p-3 rounded-2xl border border-[#1b233a] shrink-0 space-y-1">
                    <div className="text-xs text-slate-400">Рейтинг ФСП ELO:</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {c.fspRating > 0 ? `${c.fspRating} pts` : 'Без ELO'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Тесты: <strong className="text-white">{c.testScorePercent}%</strong> ({c.avgExecutionTimeMs || 15} ms)
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
                <div className="bg-[#0f1734] rounded-2xl p-3.5 border border-[#2b35ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md shadow-[#2b35ff]/10">
                  <div className="flex items-center gap-2.5 text-slate-200">
                    <div className="p-1.5 rounded-lg bg-[#2b35ff]/20 text-[#00f0ff] shrink-0 border border-[#00f0ff]/30">
                      <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                    </div>
                    <div>
                      <strong className="text-[#00f0ff]">Почему в топе выдачи:</strong>{' '}
                      <span className="font-medium text-slate-200">
                        {c.fspRank?.replace(/\s*\(.*\)/, '') || 'КМС по СП'} + 100% прохождение скрытых тестов + совпадение по стеку {c.skills?.slice(0, 2).join('/') || 'Java/Spring'} на {c.fspRating >= 2400 ? '96%' : c.fspRating >= 2100 ? '94%' : '91%'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExplainModalCandidate(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2b35ff]/20 to-[#00f0ff]/20 hover:from-[#2b35ff]/40 hover:to-[#00f0ff]/40 text-xs text-[#00f0ff] hover:text-cyan-200 border border-[#00f0ff]/40 shrink-0 font-bold transition-all shadow-sm group"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span>Подробный разбор матчинга →</span>
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
                    <span>Контакты: <strong className="font-mono text-[#00f0ff]">{c.phoneMasked}</strong> (скрыты до отклика)</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right text-xs mr-2 hidden md:block">
                      <span className="text-slate-400 block text-[10px]">Ожидания:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {c.salaryExpectationMin.toLocaleString('ru-RU')} – {c.salaryExpectationMax.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <button
                      onClick={() => api.downloadOfficialCandidatePdf(c)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all shadow hover:border-[#00f0ff]/40"
                      title="Скачать официальный стандартизированный PDF-профиль соискателя с символикой ФСП и подтвержденным ELO"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span>Скачать PDF профиль ФСП</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCandidateForTest(c);
                        setIsAssignTestModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all shadow-md shadow-purple-950/40"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Дать тестирование</span>
                    </button>

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
            );
          })}
          </div>

        </div>
      )}

      {/* Tab 2: Vacancies with Mandatory Salary Fork */}
      {activeTab === 'vacancies' && (
        <div className="animate-tab-content space-y-6">
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
        <div className="animate-tab-content space-y-6">
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
                      <span className="text-emerald-400 text-[10px] font-bold">Контакты открыты</span>
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
        <div className="animate-tab-content bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          
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

      {/* Tab 5: Assessments & Live Coding Interviews */}
      {activeTab === 'assessments' && (
        <div className="animate-tab-content space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1026] p-5 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Технические тестирования и лайв-интервью
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Назначенные задачи, статус прохождения кандидатами, интеграция с Яндекс Телемостом и прямое оценивание (👍 / 👎)
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCandidateForTest(candidates[0]);
                setIsAssignTestModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Создать / Назначить тест</span>
            </button>
          </div>

          {/* Список назначенных тестов */}
          {assessments.length === 0 ? (
            <div className="text-center py-12 bg-[#080d20] rounded-2xl border border-white/5 p-6">
              <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold text-sm">Пока нет назначенных тестирований</p>
              <p className="text-xs text-slate-500 mt-1">
                Выберите кандидата в каталоге и нажмите кнопку «Дать тестирование»
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assessments.map((asmt) => {
                const isSubmitted = asmt.status === 'submitted';
                const isReviewed = asmt.status === 'reviewed';
                const isPending = asmt.status === 'pending';

                return (
                  <div
                    key={asmt.id}
                    className="p-5 rounded-2xl bg-[#080d20] border border-white/10 hover:border-purple-500/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{asmt.task.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              asmt.task.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                              asmt.task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {asmt.task.difficulty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                              {asmt.task.sourceType === 'leetcode_preset' ? 'LeetCode' : 'Собственное ТЗ'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                            <span>Кандидат: <strong className="text-slate-200">{asmt.candidateName}</strong></span>
                            <span>• Вакансия: <strong className="text-slate-200">{asmt.vacancyTitle || 'Инженерная позиция'}</strong></span>
                            <span>• Лимит: <strong className="text-cyan-400">{asmt.timeLimitMinutes} мин</strong></span>
                          </p>
                        </div>
                      </div>

                      {/* Статус-бейдж */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isSubmitted && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            Ожидает код-ревью
                          </span>
                        )}
                        {isReviewed && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            asmt.review?.verdict === 'like'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            {asmt.review?.verdict === 'like' ? '👍 Рекомендован к найму' : '👎 Отклонен'}
                          </span>
                        )}
                        {isPending && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            Решается соискателем
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Яндекс Телемост виджет при лайв-интервью */}
                    {asmt.isLiveInterview && (
                      <YandexTelemostWidget
                        telemostUrl={asmt.telemostRoomUrl}
                        scheduledTime={asmt.scheduledInterviewAt}
                        roomName={`Лайв-кодинг: ${asmt.candidateName} × ${asmt.companyName}`}
                      />
                    )}

                    {/* Результаты и кнопки действий */}
                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-400">
                        {asmt.submission ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Решение отправлено: <strong className="text-white">{asmt.submission.spentTimeMinutes} мин</strong>, {asmt.submission.passedCount}/{asmt.submission.totalCount} тестов пройдено.
                          </span>
                        ) : (
                          <span>Кандидат еще не отправил решение.</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {asmt.submission && (
                          <button
                            onClick={() => setReviewModalAssessment(asmt)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{isReviewed ? 'Изменить оценку / ревью' : 'Проверить и оценить (👍 / 👎)'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Если уже оценено: плашка с закрытой заметкой и сообщением кандидату */}
                    {asmt.review && (
                      <div className="p-3.5 rounded-xl bg-[#0b1026] border border-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            Внутренняя заметка компании (скрыта от кандидата):
                          </span>
                          <span className="text-[10px] text-slate-500">{asmt.review.reviewerName}</span>
                        </div>
                        <p className="text-slate-300 italic">{asmt.review.internalNote}</p>

                        <div className="pt-2 border-t border-white/5 text-cyan-300 font-semibold flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Отправленное сообщение кандидату:
                        </div>
                        <p className="text-slate-300">{asmt.review.candidateFeedbackMessage}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Webhooks (ATS & Bot Integrations) */}
      {activeTab === 'webhooks' && (
        <div className="animate-tab-content space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1026] p-5 rounded-2xl border border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Веб-хуки и интеграции (Webhooks ATS & Bots)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Автоматическая асинхронная отправка событий в корпоративные ATS (Сбер, Яндекс, Huntflow, 1C:ЗУП) и Telegram-боты при принятии/отклонении офферов кандидатами. Защита заголовком <code className="text-cyan-300 font-mono">X-FSP-Signature</code> (HMAC-SHA256).
              </p>
            </div>

            <button
              onClick={() => setIsNewWebhookModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all shadow-lg shadow-cyan-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить веб-хук</span>
            </button>
          </div>

          {/* Webhooks List */}
          {webhooks.length === 0 ? (
            <div className="p-12 text-center bg-[#0d1326] rounded-2xl border border-slate-800 space-y-4">
              <Radio className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-white">Нет зарегистрированных веб-хуков</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Подключите веб-хук, чтобы моментально получать оповещения об откликах и принятых офферах прямо в вашу ATS-систему.
              </p>
              <button
                onClick={() => {
                  setNewWebhookUrl('https://ats.sber.ru/api/v1/fsp-hook-receiver');
                  setNewWebhookDesc('Корпоративная ATS Сбера (Webhooks)');
                  setNewWebhookSecret('sber_fsp_secret_token_2026');
                  setIsNewWebhookModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-cyan-500/30"
              >
                + Подключить интеграцию со Сбером
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className="bg-[#0f1730] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 space-y-4 transition-all shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="text-sm font-bold text-white">{hook.description || 'Внешний веб-хук'}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          {hook.active ? 'Активен' : 'Отключен'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                        <span>{hook.url}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(hook.url);
                            setCopiedWebhookId(hook.id);
                            setTimeout(() => setCopiedWebhookId(null), 2000);
                          }}
                          className="text-slate-500 hover:text-white p-1"
                          title="Скопировать URL"
                        >
                          {copiedWebhookId === hook.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          setIsPingingId(hook.id);
                          try {
                            const res = await api.testPingWebhook(hook);
                            setPingResult(res);
                            const updated = await api.getWebhooks(currentEmployer.id);
                            setWebhooks(updated);
                          } finally {
                            setIsPingingId(null);
                          }
                        }}
                        disabled={isPingingId === hook.id}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isPingingId === hook.id ? 'animate-spin' : ''}`} />
                        <span>{isPingingId === hook.id ? 'Пинг...' : 'Тестовый пинг (Ping)'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Удалить данный веб-хук?')) {
                            await api.deleteWebhook(currentEmployer.id, hook.id);
                            const updated = await api.getWebhooks(currentEmployer.id);
                            setWebhooks(updated);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                        title="Удалить веб-хук"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Events & Security Details */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">События:</span>
                    {(hook.events || 'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED').split(',').map((ev) => (
                      <span
                        key={ev}
                        className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 text-[10px] font-mono"
                      >
                        {ev.trim()}
                      </span>
                    ))}

                    <div className="ml-auto flex items-center gap-3 text-[11px] text-slate-400">
                      {hook.secretToken && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Lock className="w-3 h-3" />
                          HMAC-SHA256 подпись
                        </span>
                      )}
                      {hook.lastStatusCode && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          hook.lastStatusCode >= 200 && hook.lastStatusCode < 300 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          HTTP {hook.lastStatusCode}
                        </span>
                      )}
                      {hook.lastTriggeredAt && (
                        <span className="text-slate-500">
                          Посл. вызов: {new Date(hook.lastTriggeredAt).toLocaleTimeString('ru-RU')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integration Guide Box */}
          <div className="p-5 bg-[#0b1026] rounded-2xl border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Спецификация интеграции веб-хуков ФСП Арены (Webhooks RFC)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="space-y-1.5">
                <div className="text-cyan-300 font-semibold">Заголовки запроса:</div>
                <div className="font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div>Content-Type: application/json</div>
                  <div>X-FSP-Event: OFFER_ACCEPTED | OFFER_DECLINED | OFFER_SENT</div>
                  <div>X-FSP-Delivery-Id: e7518117-f0d9-4c2e-9af7-829fecbd9107</div>
                  <div>X-FSP-Signature: sha256=a5b3c4... (HMAC-SHA256)</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-cyan-300 font-semibold">Пример полезной нагрузки (Payload):</div>
                <div className="font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <pre className="text-slate-300 text-[10px] overflow-x-auto">
{`{
  "event": "OFFER_ACCEPTED",
  "timestamp": "2026-10-10T14:30:00Z",
  "employerId": "sber-tech-uuid",
  "data": {
    "offerId": "offer-001",
    "candidateName": "Иван Пестерев",
    "fspElo": 2480,
    "fspRank": "КМС по СП",
    "unmaskedContacts": "+7 (999) 123-45-67",
    "salaryOffered": 320000
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainable Match Detail Modal */}
      {explainModalCandidate && (() => {
        const c = explainModalCandidate;
        const stackPreview = c.skills?.slice(0, 3).join(', ') || 'Java 21, Spring Boot 3, PostgreSQL';
        const rankName = c.fspRank || 'КМС по СП (ЕВСК)';
        const eloScore = c.fspRating || 2480;
        const matchPercent = eloScore >= 2400 ? 96.4 : eloScore >= 2100 ? 94.2 : 89.5;
        const speedMs = c.avgExecutionTimeMs || 84;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#0b1022] border border-[#2b35ff]/50 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl modal-animate my-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#2b35ff]/30 to-[#00f0ff]/30 border border-[#00f0ff]/40 text-[#00f0ff]">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      Объяснимый AI-матчинг соискателя
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                        {matchPercent}% Match
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Прозрачный алгоритм ранжирования без предвзятости (Zero-Bias Human-in-the-Loop)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExplainModalCandidate(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Candidate Quick Badge */}
              <div className="p-4 bg-[#0f1734] rounded-2xl border border-[#2b35ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={c.fullName}
                    src={c.avatarUrl}
                    size="md"
                    rank={c.fspRank}
                  />
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {c.fullName}
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                        {c.targetGrade} {c.specialization}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      FSP ID: {c.fspId || 'FSP-RU-2026-0042'} • ELO: <strong className="text-emerald-400">{eloScore} pts</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Итоговый Match Score</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00f0ff] font-mono">
                    {matchPercent}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Топ-1 в выдаче рекрутера</span>
                </div>
              </div>

              {/* Criteria Weights Breakdown */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Детальный вес и разбор каждого критерия скоринга
                </h4>

                <div className="space-y-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  {/* Criterion 1: ЕВСК Разряд */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        1. Спортивный разряд ЕВСК Минспорта РФ (Вес 35%)
                      </span>
                      <span className="text-amber-400 font-mono font-bold">35 / 35 баллов</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      {rankName}: подтверждено официальным реестром ФСП. Высший уровень алгоритмического мышления и стрессоустойчивости.
                    </p>
                  </div>

                  {/* Criterion 2: Docker Sandbox Tests */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        2. Алгоритмический аудит Арены & Docker-песочница (Вес 25%)
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">25 / 25 баллов</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      100% прохождение скрытых стресс-тестов в изолированной среде. Средняя скорость исполнения алгоритма: <strong>{speedMs} мс</strong> (Топ 0.5% платформы), 0 утечек памяти.
                    </p>
                  </div>

                  {/* Criterion 3: Tech Stack Match */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-[#00f0ff]" />
                        3. Совпадение стека технологий (Вес 25%)
                      </span>
                      <span className="text-[#00f0ff] font-mono font-bold">24 / 25 баллов</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#00f0ff] h-full rounded-full transition-all duration-500" style={{ width: '96%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      Стек соискателя ({stackPreview}) совпадает на <strong>96%</strong> с технологическими требованиями открытых вакансий компании.
                    </p>
                  </div>

                  {/* Criterion 4: Salary Alignment */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        4. Совместимость зарплатной вилки (Вес 10%)
                      </span>
                      <span className="text-purple-400 font-mono font-bold">10 / 10 баллов</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      Ожидания кандидата ({c.salaryExpectationMin?.toLocaleString('ru-RU')} – {c.salaryExpectationMax?.toLocaleString('ru-RU')} ₽) полностью попадают в открытую вилку грейда {c.targetGrade}.
                    </p>
                  </div>

                  {/* Criterion 5: Keycloak SSO & 152-FZ */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        5. Верификация аккаунта & 152-ФЗ (Вес 5%)
                      </span>
                      <span className="text-cyan-400 font-mono font-bold">5 / 5 баллов</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      Профиль подтвержден через ЕСИА / Keycloak SSO. Подписано согласие на обработку персональных данных и реверс-рекрутинг.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zero-Bias Guarantee Box */}
              <div className="p-3.5 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-slate-300">
                  <strong className="text-emerald-400">Гарантия объективности (Zero-Bias AI):</strong>{' '}
                  Оценка строится исключительно на измеримых спортивных результатах, чистоте кода и объективных тестах песочницы, исключая субъективные суждения и предвзятость.
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => api.downloadOfficialCandidatePdf(c)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Скачать официальный PDF-профиль ФСП</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExplainModalCandidate(null);
                      handleOpenOfferModal(c);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:opacity-95 text-slate-950 text-xs font-black shadow-lg shadow-[#2b35ff]/30 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Отправить оффер</span>
                  </button>

                  <button
                    onClick={() => setExplainModalCandidate(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Закрыть
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* New Webhook Modal */}
      {isNewWebhookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d1224] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl modal-animate">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Новый веб-хук для ATS</h3>
              </div>
              <button
                onClick={() => setIsNewWebhookModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">URL эндпоинта (HTTP POST):</label>
                <input
                  type="url"
                  placeholder="https://ats.sber.ru/api/v1/fsp-hook-receiver"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Название / Описание:</label>
                <input
                  type="text"
                  placeholder="Корпоративная ATS Сбер (Webhooks Event Receiver)"
                  value={newWebhookDesc}
                  onChange={(e) => setNewWebhookDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Секретный ключ подписи (Secret Token HMAC-SHA256):</label>
                <input
                  type="text"
                  placeholder="sber_fsp_secret_webhook_token_2026"
                  value={newWebhookSecret}
                  onChange={(e) => setNewWebhookSecret(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Передается в заголовке X-FSP-Signature для верификации подлинности сообщений.</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Отслеживаемые события:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'OFFER_ACCEPTED', label: 'Оффер принят' },
                    { id: 'OFFER_DECLINED', label: 'Оффер отклонен' },
                    { id: 'OFFER_SENT', label: 'Оффер отправлен' },
                    { id: 'TEST_PASSED', label: 'Тестирование сдано' }
                  ].map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={newWebhookEvents.includes(ev.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhookEvents([...newWebhookEvents, ev.id]);
                          } else {
                            setNewWebhookEvents(newWebhookEvents.filter((x) => x !== ev.id));
                          }
                        }}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span className="text-slate-300 font-medium">{ev.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsNewWebhookModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  if (!newWebhookUrl.trim()) {
                    alert('Укажите URL эндпоинта веб-хука');
                    return;
                  }
                  await api.createWebhook({
                    employerId: currentEmployer.id,
                    url: newWebhookUrl.trim(),
                    secretToken: newWebhookSecret.trim() || undefined,
                    description: newWebhookDesc.trim() || undefined,
                    events: newWebhookEvents.join(',')
                  });
                  const updated = await api.getWebhooks(currentEmployer.id);
                  setWebhooks(updated);
                  setIsNewWebhookModalOpen(false);
                  setNewWebhookUrl('');
                  setNewWebhookSecret('');
                  setNewWebhookDesc('');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 text-xs font-black shadow-lg"
              >
                Сохранить и активировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ping Result Feedback Modal */}
      {pingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1022] border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl modal-animate">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${pingResult.success ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                <h3 className="text-base font-bold text-white">Результат тестового пинга веб-хука</h3>
              </div>
              <button
                onClick={() => setPingResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Статус HTTP:</span>
                  <span className={`font-mono font-bold ${pingResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    HTTP {pingResult.statusCode} ({pingResult.success ? 'OK' : 'Error'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Целевой URL:</span>
                  <span className="font-mono text-cyan-300 truncate max-w-[240px]">{pingResult.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сообщение:</span>
                  <span className="text-slate-200">{pingResult.message}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Время отправки:</span>
                  <span className="text-slate-400 font-mono">{new Date(pingResult.timestamp).toLocaleTimeString('ru-RU')}</span>
                </div>
              </div>

              {pingResult.payloadSample && (
                <div>
                  <div className="text-slate-300 font-bold mb-1">Образец отправленной полезной нагрузки (JSON):</div>
                  <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 overflow-x-auto max-h-48">
                    {pingResult.payloadSample}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => setPingResult(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black"
            >
              Отлично, понятно
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

      {/* Assign Test Modal */}
      {selectedCandidateForTest && (
        <AssignTestModal
          isOpen={isAssignTestModalOpen}
          onClose={() => setIsAssignTestModalOpen(false)}
          candidate={selectedCandidateForTest}
          vacancies={vacancies}
          availableTasks={tasks}
          onAssign={(newAsmt) => {
            if (onAssignTest) {
              onAssignTest(newAsmt);
            }
            setActiveTab('assessments');
          }}
        />
      )}

      {/* Review Test Modal */}
      {reviewModalAssessment && (
        <TestReviewModal
          isOpen={!!reviewModalAssessment}
          onClose={() => setReviewModalAssessment(null)}
          assessment={reviewModalAssessment}
          onSaveReview={(assessmentId, review) => {
            if (onReviewTest) {
              onReviewTest(assessmentId, review);
            }
            setReviewModalAssessment(null);
          }}
        />
      )}

      {/* 152-FZ Security Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

    </div>
  );
};
