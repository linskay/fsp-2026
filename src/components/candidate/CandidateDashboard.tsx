import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Check, 
  X, 
  MessageSquare, 
  Send, 
  Code2, 
  FileText, 
  Clock, 
  Building2, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Phone,
  SendHorizontal
} from 'lucide-react';
import { AlgorithmTask, CandidateProfile, Invitation, SubmissionResult, GitHubProfileData, HhResumeData, CandidateAiSummary } from '../../types';
import { CodeArenaIDE } from '../arena/CodeArenaIDE';
import { ResumeParserModal } from './ResumeParserModal';
import { CandidateAiSummaryModal } from './CandidateAiSummaryModal';
import { FspPrivacyModal, FSP_PRIVACY_PDF_URL } from '../common/FspPrivacyModal';
import { FspStarIcon, FspCircuitBackground } from '../brand/FspLogo';
import { EloTierProgressBar } from './EloTierProgressBar';
import { UserAvatar } from '../brand/UserAvatar';
import { LeetCodeStatsCard } from './LeetCodeStatsCard';
import { Github, Star, GitBranch, Share2, Bot, BrainCircuit, LineChart } from 'lucide-react';

function getEloPercentile(elo: number): string {
  if (elo >= 2700) return 'Топ 0.1% по РФ';
  if (elo >= 2500) return 'Топ 0.5% по РФ';
  if (elo >= 2300) return 'Топ 1.5% по РФ';
  if (elo >= 2000) return 'Топ 5.0% по РФ';
  return 'Топ 12% по РФ';
}

function getFspTier(grade: string, elo: number): string {
  if (elo >= 2650) return 'ФСП Tier-1 (Элита)';
  if (elo >= 2300) return 'ФСП Tier-2 (Мастер)';
  return 'ФСП Tier-3 (Атлет)';
}

interface EloMilestone {
  pts: number;
  label: string;
  stage: string;
  color?: string;
}

function getDynamicEloProgression(currentElo: number, rank: string): EloMilestone[] {
  const p1 = Math.round((currentElo * 0.78) / 10) * 10;
  const p2 = Math.round((currentElo * 0.85) / 10) * 10;
  const p3 = Math.round((currentElo * 0.94) / 10) * 10;
  const p4 = Math.round((currentElo * 0.97) / 10) * 10;
  const p5 = currentElo;

  let s3 = 'Чемпионат РФ';
  let s4 = 'Высшая Лига ФСП';
  if (currentElo < 2300) {
    s3 = 'Городской кубок';
    s4 = '1-й спорт. разряд';
  } else if (currentElo < 2550) {
    s3 = 'Чемпионат ФО';
    s4 = 'Норматив КМС';
  }

  return [
    { pts: p1, label: 'Отбор ФСП', stage: 'Квалификация' },
    { pts: p2, label: 'Кубок Региона', stage: 'Плей-офф' },
    { pts: p3, label: s3, stage: 'Финал РФ', color: 'text-amber-400' },
    { pts: p4, label: s4, stage: 'Гранд-финал' },
    { pts: p5, label: 'Judge0 Sandbox', stage: 'Текущий пик', color: 'text-[#00f0ff]' },
  ];
}

interface CandidateDashboardProps {
  candidate: CandidateProfile;
  allCandidates?: CandidateProfile[];
  onSelectCandidate?: (candidateId: string) => void;
  invitations: Invitation[];
  tasks: AlgorithmTask[];
  githubData: GitHubProfileData | null;
  hhData: HhResumeData | null;
  yandexConnected: boolean;
  onOpenOAuthModal: () => void;
  onAcceptInvitation: (invitationId: string) => void;
  onDeclineInvitation: (invitationId: string, reason: string) => void;
  onSendMessage: (invitationId: string, text: string) => void;
  onTaskSolved: (result: SubmissionResult) => void;
  onUpdateCandidate: (updated: Partial<CandidateProfile>) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  candidate,
  allCandidates,
  onSelectCandidate,
  invitations,
  tasks,
  githubData,
  hhData,
  yandexConnected,
  onOpenOAuthModal,
  onAcceptInvitation,
  onDeclineInvitation,
  onSendMessage,
  onTaskSolved,
  onUpdateCandidate
}) => {
  const milestones = getDynamicEloProgression(candidate.fspRating, candidate.fspRank);
  const minElo = Math.min(...milestones.map(m => m.pts)) - 50;
  const maxElo = Math.max(...milestones.map(m => m.pts)) + 20;

  const sparkPoints = milestones.map((m, idx) => {
    const x = 30 + (idx * (440 / (milestones.length - 1)));
    const ratio = (m.pts - minElo) / (maxElo - minElo);
    const y = 65 - ratio * 50;
    return { ...m, x, y };
  });

  const sparkLinePath = `M ${sparkPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const sparkAreaPath = `M ${sparkPoints[0].x} 75 L ${sparkPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${sparkPoints[sparkPoints.length - 1].x} 75 Z`;

  const nextAttemptDate = new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const [activeTab, setActiveTab] = useState<'invitations' | 'arena' | 'chat' | 'portfolio'>('invitations');
  const [selectedInvitationForChat, setSelectedInvitationForChat] = useState<string | null>(
    invitations.find(i => i.status === 'accepted')?.id || invitations[0]?.id || null
  );
  const [chatInputText, setChatInputText] = useState('');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAiSummaryModalOpen, setIsAiSummaryModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [declineModalInvId, setDeclineModalInvId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('Не подходит зарплатная вилка');
  const [showConsentModalForInvId, setShowConsentModalForInvId] = useState<string | null>(null);

  // Filter invitations for this candidate
  const myInvitations = invitations.filter(i => i.candidateId === candidate.id);
  const acceptedInvitations = myInvitations.filter(i => i.status === 'accepted');
  const activeChatInvitation = myInvitations.find(i => i.id === selectedInvitationForChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() || !selectedInvitationForChat) return;
    onSendMessage(selectedInvitationForChat, chatInputText);
    setChatInputText('');
  };

  const confirmAcceptInvitation = () => {
    if (showConsentModalForInvId) {
      onAcceptInvitation(showConsentModalForInvId);
      setSelectedInvitationForChat(showConsentModalForInvId);
      setShowConsentModalForInvId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Candidate Hero Banner with Strict 2-Column Grid */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090d1a] border border-[#1b2542] p-6 sm:p-8 shadow-2xl">
        <FspCircuitBackground />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 cols): Athlete Avatar, Rank, ELO & Verified Status */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-start gap-4">
              <UserAvatar
                name={candidate.fullName}
                src={candidate.avatarUrl}
                size="xl"
                rank={candidate.fspRank}
              />

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {candidate.fullName}
                  </h1>

                  {/* Dynamic Candidate Selector for paired inspection */}
                  {allCandidates && allCandidates.length > 1 && onSelectCandidate && (
                    <select
                      value={candidate.id}
                      onChange={(e) => onSelectCandidate(e.target.value)}
                      className="px-2 py-0.5 rounded-lg bg-[#0c1224] border border-[#2b35ff]/50 text-xs text-[#00f0ff] font-semibold cursor-pointer focus:outline-none hover:border-[#00f0ff] transition-colors"
                      title="Переключить соискателя для проверки динамических данных"
                    >
                      {allCandidates.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#090d1a] text-white">
                          {c.fullName} ({c.fspRating} ELO, {c.fspRank})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2b35ff]/20 text-[#00f0ff] border border-[#2b35ff]/40 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Keycloak SSO Verified
                </div>
                <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 pt-0.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {candidate.fspRank}
                </div>
              </div>
            </div>

            {/* Key Metrics Grid (100% Dynamic) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[#0c1224] rounded-2xl border border-[#162038] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  ФСП Рейтинг ELO
                </span>
                <span className="text-lg font-black text-[#00f0ff] font-mono block">
                  {candidate.fspRating} pts
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  {getEloPercentile(candidate.fspRating)}
                </span>
              </div>

              <div className="p-3.5 bg-[#0c1224] rounded-2xl border border-[#162038] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Подтвержденный грейд
                </span>
                <span className="text-lg font-black text-purple-400 font-mono block">
                  {candidate.currentGradeAssigned.toUpperCase()}
                </span>
                <span className="text-[10px] text-purple-300 font-medium block">
                  {getFspTier(candidate.currentGradeAssigned, candidate.fspRating)}
                </span>
              </div>

              <div className="p-3.5 bg-[#0c1224] rounded-2xl border border-[#162038] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Точность тестов
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono block">
                  {candidate.testScorePercent}% ({candidate.avgExecutionTimeMs} ms)
                </span>
              </div>

              <div className="p-3.5 bg-[#0c1224] rounded-2xl border border-[#162038] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Решено задач
                </span>
                <span className="text-base font-bold text-white font-mono block">
                  {candidate.solvedTasksCount} / {candidate.totalTasksAttempted}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Role info, Bio, Stack, 152-FZ & Actions */}
          <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-[#162038] lg:pl-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#00f0ff]">
                  {candidate.title}
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {candidate.city} (РФ) • {candidate.preferredFormat === 'remote' ? 'Удаленно' : 'Гибрид'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {candidate.about}
              </p>
            </div>

            {/* Verified Stack Chips */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Подтвержденный стек технологий:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-xl bg-[#0c1224] text-slate-200 text-xs font-medium border border-[#1c2848]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* 152-FZ Privacy Status & OAuth Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#162038]">
              <div className="bg-[#070b16] p-3 rounded-2xl border border-[#162038] text-xs space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#00f0ff] font-bold">
                  <Lock className="w-3 h-3 text-[#00f0ff]" />
                  <span>152-ФЗ Защита контактов</span>
                </div>
                <p className="text-slate-300 text-[11px] font-mono">
                  Маскировано: <span className="text-[#00f0ff] font-bold">{candidate.phoneMasked}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenOAuthModal}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#2b35ff]/30 to-[#00f0ff]/20 hover:from-[#2b35ff]/50 hover:to-[#00f0ff]/40 text-white text-xs font-bold border border-[#2b35ff]/60 transition-all shadow-lg shadow-[#2b35ff]/10"
                >
                  <Github className="w-4 h-4 text-[#00f0ff]" />
                  <span>OAuth & Импорт</span>
                  {githubData && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>

                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#0f152a] hover:bg-[#151e3c] text-white text-xs font-bold border border-[#2b35ff]/40 transition-all shadow-lg hover:border-[#00f0ff]/80"
                >
                  <FileText className="w-4 h-4 text-[#00f0ff]" />
                  <span>Паспорт ФСП</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* FSP Badges & AI-Summary / ELO Hero Footer */}
        <div className="relative z-10 space-y-4 mt-6 pt-6 border-t border-[#162038]">
          
          {/* AI-Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080d1e] border border-[#2b35ff]/30 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141d36]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    AI-Summary (Технический портрет соискателя)
                    <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                      {candidate.aiSummary?.modelUsed || 'YandexGPT Pro'}
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAiSummaryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#2b35ff]/20 hover:bg-[#2b35ff]/40 text-[#00f0ff] hover:text-white border border-[#2b35ff]/40 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Обновить AI-Summary</span>
              </button>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-mono pt-3">
              "{candidate.aiSummary?.summaryText || `${candidate.currentGradeAssigned?.toUpperCase() || 'SENIOR'}-разработчик (${candidate.title}). Стек: ${candidate.skills.slice(0, 5).join(', ')}. Решает задачи в среднем за ${candidate.avgExecutionTimeMs || 15} мс с точностью ${candidate.testScorePercent || 98}%. Рейтинг ФСП: ${candidate.fspRating} ELO (${candidate.fspRank}). Рекомендуется на Highload и критические сервисы.`}"
            </p>

            {candidate.aiSummary?.keyStrengths && (
              <div className="flex flex-wrap gap-1.5 pt-3">
                {candidate.aiSummary.keyStrengths.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-[#0e1730] text-[11px] text-[#00f0ff] border border-[#2b35ff]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ELO Progression Sport-Tech Cyber Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080d1e] border border-[#162038] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#00f0ff]" />
                Динамика киберспортивного рейтинга ФСП ELO (Турниры & LeetCode Hard)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Текущий: {candidate.fspRating} pts ({candidate.fspRank})
              </span>
            </div>

            {/* Visual SVG Sparkline (100% Dynamic Math) */}
            <div className="relative pt-2">
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 500 80" fill="none">
                <defs>
                  <linearGradient id={`eloGrad-${candidate.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2b35ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Dynamic Area */}
                <path
                  d={sparkAreaPath}
                  fill={`url(#eloGrad-${candidate.id})`}
                />
                {/* Dynamic Line */}
                <path
                  d={sparkLinePath}
                  stroke="#00f0ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Dynamic Points */}
                {sparkPoints.map((p, idx) => {
                  const isLast = idx === sparkPoints.length - 1;
                  return (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={isLast ? 6 : 4}
                      fill={isLast ? '#00f0ff' : '#ffffff'}
                      stroke={isLast ? '#ffffff' : '#2b35ff'}
                      strokeWidth={2}
                      className={isLast ? 'animate-pulse' : ''}
                    />
                  );
                })}
              </svg>

              {/* Dynamic Checkpoint Milestones */}
              <div className="grid grid-cols-5 gap-1 text-[10px] text-slate-400 font-mono text-center pt-2">
                {sparkPoints.map((m, idx) => {
                  const isLast = idx === sparkPoints.length - 1;
                  return (
                    <div key={idx}>
                      <div className={isLast ? 'text-[#00f0ff] font-black' : (m.color ? `${m.color} font-bold` : 'text-slate-300 font-bold')}>
                        {m.pts.toLocaleString('ru-RU')} {isLast ? 'pts' : ''}
                      </div>
                      <div className={`text-[9px] ${isLast ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badges and Connected Accounts Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              {candidate.fspBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 text-xs font-medium border border-[#1c2848] shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Connected OAuth Badges */}
            <div className="flex items-center gap-2 text-xs">
              {candidate.leetcodeStats && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-amber-500/40">
                  <span className="text-[10px] font-black text-amber-400">LC</span>
                  <span>LeetCode ({candidate.leetcodeStats.totalSolved} решено, {candidate.leetcodeStats.badge || 'Top 1%'})</span>
                </span>
              )}
              {githubData && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-[#2b35ff]/40 shadow-sm" title="Синхронизировано через public_repo (приватные репозитории защищены)">
                  <Github className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-white">@{githubData.username}</span>
                  <span className="text-slate-400">({githubData.commitsCountYear} открытых комм.)</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                    public_repo
                  </span>
                </span>
              )}
              {hhData && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-[#ff2b42]/40">
                  <span className="text-[10px] font-black text-[#ff2b42]">hh</span>
                  <span>Резюме ({hhData.experienceYears} лет опыта)</span>
                </span>
              )}
              {yandexConnected && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-[#ffcc00]/40">
                  <span className="text-[10px] font-black text-[#ffcc00]">Я</span>
                  <span>Яндекс ID</span>
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ELO TIER PROGRESS BAR COMPONENT */}
      {/* ========================================================================= */}
      <EloTierProgressBar
        currentElo={candidate.fspRating}
        onOpenArena={() => setActiveTab('arena')}
      />

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#1b233a] pb-4 overflow-x-auto gap-4">
        <div className="flex items-center gap-2 bg-[#0a0e1c] p-1.5 rounded-2xl border border-[#1b233a]">
          
          <button
            onClick={() => setActiveTab('invitations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'invitations'
                ? 'bg-[#2b35ff] text-white shadow-lg shadow-[#2b35ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Входящие офферы от компаний</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ff2b42] text-white text-[10px] font-bold">
              {myInvitations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-[#2b35ff] text-white shadow-lg shadow-[#2b35ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>LeetCode, GitHub & hh.ru</span>
            {(githubData || hhData || candidate.leetcodeStats) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'arena'
                ? 'bg-[#2b35ff] text-white shadow-lg shadow-[#2b35ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Алгоритмическая Арена (IDE)</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[#00f0ff] text-[10px] font-bold border border-cyan-500/30">
              Грейд: {candidate.currentGradeAssigned.toUpperCase()}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-[#2b35ff] text-white shadow-lg shadow-[#2b35ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Чат с работодателями (152-ФЗ)</span>
            {acceptedInvitations.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {acceptedInvitations.length} активных
              </span>
            )}
          </button>

        </div>

        {/* Retake Cooldown status pill */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-[#0a0e1c] px-3.5 py-2 rounded-xl border border-[#1b233a]">
          <Clock className="w-4 h-4 text-[#00f0ff]" />
          <span>Кулдаун пересдачи: <strong className="text-slate-200">1 раз в 3 мес.</strong> (след. попытка: {nextAttemptDate})</span>
        </div>
      </div>

      {/* Tab: Portfolio & OAuth Integrations */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0f1d] border border-[#1d2645]">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                Синхронизация портфолио разработчика (Spring Security OAuth2)
              </h3>
              <p className="text-xs text-slate-400">
                Данные автоматически наполняются из GitHub и hh.ru при входе через OAuth2 Client.
              </p>
            </div>

            <button
              onClick={onOpenOAuthModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:brightness-110 text-white text-xs font-bold transition-all shadow-lg shadow-[#2b35ff]/20 flex items-center gap-2 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Управление OAuth подключениями</span>
            </button>
          </div>

          {/* LeetCode & LeetHub Algorithmic Synchronization Card */}
          <LeetCodeStatsCard
            stats={candidate.leetcodeStats}
            candidateName={candidate.fullName}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col (6 cols): GitHub Profile & Repos */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-[#090d1a] border border-[#162038] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#12182c] rounded-2xl border border-[#2b35ff]/30 text-white">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        GitHub Активность & Репозитории
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {githubData ? `@${githubData.username}` : 'Не подключен'}
                      </p>
                    </div>
                  </div>

                  {githubData ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Подключено
                    </span>
                  ) : (
                    <button
                      onClick={onOpenOAuthModal}
                      className="text-xs text-[#00f0ff] hover:underline font-bold"
                    >
                      Подключить
                    </button>
                  )}
                </div>

                {githubData ? (
                  <div className="space-y-4">
                    {/* Alina / FSP Privacy Guarantee: private repos are NEVER scanned */}
                    <div className="p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-emerald-300 text-[11px] block">
                          Контур безопасности 152-ФЗ (OAuth Scope: public_repo):
                        </span>
                        <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                          Закрытые репозитории пользователей НЕ сканируются. Анализируются только открытые проекты и публичные коммиты профиля.
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 bg-[#0d1326] rounded-xl border border-[#17203a]">
                        <span className="text-[10px] text-slate-400 block uppercase">Коммиты (год)</span>
                        <span className="text-sm font-black text-[#00f0ff] font-mono">{githubData.commitsCountYear}</span>
                      </div>
                      <div className="p-2.5 bg-[#0d1326] rounded-xl border border-[#17203a]">
                        <span className="text-[10px] text-slate-400 block uppercase">Репозитории</span>
                        <span className="text-sm font-black text-white font-mono">{githubData.reposCount}</span>
                      </div>
                      <div className="p-2.5 bg-[#0d1326] rounded-xl border border-[#17203a]">
                        <span className="text-[10px] text-slate-400 block uppercase">Основной стек</span>
                        <span className="text-xs font-bold text-purple-400">{githubData.mainLanguage}</span>
                      </div>
                    </div>

                    {/* Top Repos List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Импортированные проекты с открытым исходным кодом:
                      </span>
                      {githubData.topRepos.map(repo => (
                        <div key={repo.name} className="p-3.5 rounded-2xl bg-[#0c1224] border border-[#192442] space-y-1.5 hover:border-[#2b35ff]/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-mono">
                              {repo.name}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {repo.stars}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {repo.description}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                            <span className="px-2 py-0.5 rounded bg-[#141e38] text-[#00f0ff] font-mono">
                              {repo.language}
                            </span>
                            <span>{repo.updatedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 space-y-2">
                    <Github className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs">Подключите GitHub, чтобы автоматически подгрузить код и коммиты</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col (6 cols): hh.ru Resume & Work Experience */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-[#090d1a] border border-[#162038] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff2b42]/20 border border-[#ff2b42]/30 text-[#ff2b42] flex items-center justify-center font-black text-sm">
                      hh
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Импортированное резюме из hh.ru
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {hhData ? `ID: ${hhData.resumeId}` : 'Не загружено'}
                      </p>
                    </div>
                  </div>

                  {hhData ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Синхронизировано
                    </span>
                  ) : (
                    <button
                      onClick={onOpenOAuthModal}
                      className="text-xs text-[#ff2b42] hover:underline font-bold"
                    >
                      Импортировать
                    </button>
                  )}
                </div>

                {hhData ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[#0d1326] border border-[#17203a] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{hhData.title}</div>
                        <div className="text-[11px] text-slate-400">Опыт в ИТ: {hhData.experienceYears} лет</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400 font-mono">
                          {hhData.desiredSalary.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-[10px] text-slate-500">желаемый оклад</div>
                      </div>
                    </div>

                    {/* Work history */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Трудовой стаж и проекты (автопарсинг hh.ru):
                      </span>
                      {hhData.workHistory.map((work, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#0c1224] border border-[#192442] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-[#2b35ff]" />
                              {work.company}
                            </span>
                            <span className="text-[10px] text-slate-400">{work.period}</span>
                          </div>
                          <div className="text-[11px] text-[#00f0ff] font-bold">{work.position}</div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{work.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="p-3 rounded-xl bg-[#0a0e1c] border border-[#162038] text-[11px] text-slate-300">
                      <strong className="text-slate-400 block mb-0.5">Образование:</strong>
                      {hhData.education}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs">Нажмите «Импортировать», чтобы перенести резюме с hh.ru в 1 клик</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 1: Reverse Hiring Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Обратный найм: предложения от проверенных работодателей
              </h2>
              <p className="text-xs text-slate-400">
                Работодатели сами находят вас по рейтингу ФСП и предлагают конкретную вилку зарплаты в рублях.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Всего предложений: <strong className="text-white">{myInvitations.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {myInvitations.map((inv) => {
              const isAccepted = inv.status === 'accepted';
              const isDeclined = inv.status === 'declined';

              return (
                <div
                  key={inv.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isAccepted
                      ? 'bg-[#0a1618] border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                      : isDeclined
                      ? 'bg-[#080c18] border-[#182035] opacity-50'
                      : 'bg-[#0b0f1d] border-[#1d2645] hover:border-[#2b35ff]/60 shadow-xl'
                  }`}
                >
                  <div className="p-6 space-y-5">
                    
                    {/* Vacancy & Company Top */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#121932] p-2 flex items-center justify-center border border-[#2b35ff]/30 font-bold text-lg text-white shrink-0">
                          {inv.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">
                              {inv.vacancyTitle}
                            </h3>
                          </div>
                          <p className="text-xs text-[#00f0ff] font-semibold mt-0.5">
                            {inv.companyName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Получено: {new Date(inv.sentAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      {/* Mandatory Salary Fork & Proposed Salary */}
                      <div className="sm:text-right bg-[#070a14] p-3 rounded-2xl border border-[#1b233a] shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Предлагаемый оклад в оффере:
                        </span>
                        <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                          {inv.proposedSalary.toLocaleString('ru-RU')} ₽ / мес
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Вилка: {inv.salaryMin.toLocaleString('ru-RU')} – {inv.salaryMax.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>

                    {/* Offer Message */}
                    <div className="bg-[#070b16] p-4 rounded-2xl border border-[#182038] text-xs text-slate-300 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Персональное обращение технического лидера:
                      </div>
                      <p className="italic text-slate-200 leading-relaxed">
                        "{inv.message}"
                      </p>
                      <div className="pt-2 border-t border-[#182038] text-[11px] text-slate-400">
                        <strong className="text-slate-300">Проект:</strong> {inv.projectDetails}
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="flex flex-wrap gap-2">
                      {inv.perksOffered.map((perk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-[#10162e] text-slate-300 text-xs font-medium border border-[#1e294b]">
                          ✦ {perk}
                        </span>
                      ))}
                    </div>

                    {/* Actions & 152-FZ Disclosure Box */}
                    <div className="pt-4 border-t border-[#182038] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Privacy Disclosure status */}
                      <div className="text-xs">
                        {isAccepted ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                            <Unlock className="w-4 h-4" />
                            <span>Приглашение принято. Контакты раскрыты работодателю по 152-ФЗ.</span>
                          </div>
                        ) : isDeclined ? (
                          <div className="text-slate-500 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            <span>Приглашение отклонено ({inv.declineReason || 'Причина не указана'}).</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Lock className="w-4 h-4 text-[#00f0ff]" />
                            <span>Ваши контакты скрыты. Они откроются HR только после согласия.</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isAccepted && !isDeclined && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setDeclineModalInvId(inv.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#121930] hover:bg-[#182244] text-slate-300 text-xs font-semibold transition-all border border-[#1e294b]"
                          >
                            Отклонить
                          </button>
                          <button
                            onClick={() => setShowConsentModalForInvId(inv.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:opacity-95 text-slate-950 text-xs font-black shadow-lg shadow-[#2b35ff]/30 transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>Принять оффер & Раскрыть контакты</span>
                          </button>
                        </div>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => {
                            setSelectedInvitationForChat(inv.id);
                            setActiveTab('chat');
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Перейти в диалог с HR</span>
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Tab 2: Code Arena IDE */}
      {activeTab === 'arena' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Алгоритмическая песочница и подтверждение грейда
              </h2>
              <p className="text-xs text-slate-400">
                Решайте задачи банка ФСП в интерактивной IDE с изолированным запуском тестов (Judge0 Sandbox).
              </p>
            </div>
          </div>

          <CodeArenaIDE
            tasks={tasks}
            onTaskSolved={onTaskSolved}
          />
        </div>
      )}

      {/* Tab 3: Chat with Employers */}
      {activeTab === 'chat' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          
          {/* Left Sidebar: Conversations */}
          <div className="md:col-span-4 bg-[#0b0f19] border-r border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Принятые офферы и чаты:
            </h3>

            <div className="space-y-2">
              {acceptedInvitations.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                  Пока нет принятых офферов. Примите приглашение на вкладке «Входящие офферы», чтобы открыть чат с HR.
                </div>
              ) : (
                acceptedInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvitationForChat(inv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      selectedInvitationForChat === inv.id
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{inv.companyName}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {inv.proposedSalary.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {inv.vacancyTitle}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-2">
                      <Unlock className="w-3 h-3" />
                      <span>Контакты раскрыты по 152-ФЗ</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Area: Messages */}
          <div className="md:col-span-8 flex flex-col justify-between bg-[#0e1424]">
            {activeChatInvitation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-[#11192e] border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {activeChatInvitation.companyName} — {activeChatInvitation.vacancyTitle}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Согласованный оклад: <strong className="text-emerald-400 font-mono">{activeChatInvitation.proposedSalary.toLocaleString('ru-RU')} ₽</strong> • Прямая связь
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Верифицированный канал связи</span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="p-4 space-y-3 overflow-y-auto max-h-[380px] flex-1">
                  {activeChatInvitation.chatMessages.map((msg) => {
                    const isMe = msg.sender === 'candidate';
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none'
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

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3.5 bg-[#11192e] border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Напишите сообщение HR-лидеру компании..."
                    className="flex-1 bg-slate-900 text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2 h-full">
                <MessageSquare className="w-10 h-10 text-slate-600" />
                <p className="text-sm">Выберите диалог слева для общения</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 152-ФЗ Consent Modal */}
      {showConsentModalForInvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Согласие на раскрытие контактов (152-ФЗ)
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Вы подтверждаете интерес к офферу от работодателя. В соответствии с Федеральным законом № 152-ФЗ «О персональных данных», ваши контактные данные:
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-slate-300">
                Телефон: <strong className="text-emerald-400">{candidate.phoneReal}</strong>
              </div>
              <div className="text-slate-300">
                Telegram: <strong className="text-blue-400">{candidate.telegramReal}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              будут безопасно переданы HR-департаменту компании для назначения финального интервью.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConsentModalForInvId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Отмена
              </button>
              <button
                onClick={confirmAcceptInvitation}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Подтверждаю и согласен
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineModalInvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Отклонить приглашение работодателя
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Укажите причину (для обратной связи):</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl p-3 border border-slate-700"
              >
                <option value="Не подходит уровень предлагаемой зарплаты">Не подходит уровень предлагаемой зарплаты</option>
                <option value="Не интересует данный стек технологий">Не интересует данный стек технологий</option>
                <option value="Уже принял другой оффер на платформе">Уже принял другой оффер на платформе</option>
                <option value="Не подходит формат работы (удаленно/офис)">Не подходит формат работы (удаленно/офис)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeclineModalInvId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onDeclineInvitation(declineModalInvId, declineReason);
                  setDeclineModalInvId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume & Passport Modal */}
      <ResumeParserModal
        candidate={candidate}
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onParsedUpdate={(updated) => onUpdateCandidate(updated)}
      />

      {/* AI Summary Modal */}
      <CandidateAiSummaryModal
        isOpen={isAiSummaryModalOpen}
        onClose={() => setIsAiSummaryModalOpen(false)}
        candidate={candidate}
        onSaveSummary={(newSummary) => onUpdateCandidate({ aiSummary: newSummary })}
      />

      {/* 152-FZ Privacy Policy Modal */}
      <FspPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

    </div>
  );
};
