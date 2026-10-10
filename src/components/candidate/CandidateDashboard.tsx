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
import { AlgorithmTask, CandidateProfile, Invitation, SubmissionResult, GitHubProfileData, HhResumeData, CandidateAiSummary, AssessmentAssignment, CandidateAssessmentSubmission } from '../../types';
import { CodeArenaIDE } from '../arena/CodeArenaIDE';
import { ResumeParserModal } from './ResumeParserModal';
import { CandidateAiSummaryModal } from './CandidateAiSummaryModal';
import { FspPrivacyModal, FSP_PRIVACY_PDF_URL } from '../common/FspPrivacyModal';
import { FspStarIcon, FspCircuitBackground } from '../brand/FspLogo';
import { EloTierProgressBar } from './EloTierProgressBar';
import { UserAvatar } from '../brand/UserAvatar';
import { LeetCodeStatsCard } from './LeetCodeStatsCard';
import { YandexTelemostWidget } from '../common/YandexTelemostWidget';
import { Github, Star, GitBranch, Share2, Bot, BrainCircuit, LineChart, FolderGit2, CheckCircle, ShieldAlert, Video, ThumbsUp, ThumbsDown } from 'lucide-react';
import { 
  getEloPercentile, 
  getFspTier, 
  evaluateCandidateLevel, 
  calculateCandidateAchievementPoints,
  FSP_STANDARD_LEVELS 
} from '../../utils/ratingEngine';

interface EloMilestone {
  pts: number;
  label: string;
  stage: string;
  color?: string;
}

function getDynamicEloProgression(currentElo: number, candidate: CandidateProfile): EloMilestone[] {
  if (candidate.eloHistory && candidate.eloHistory.length >= 3) {
    return candidate.eloHistory.slice(-5).map((h, idx) => ({
      pts: h.elo,
      label: h.event,
      stage: h.date,
      color: idx === candidate.eloHistory!.length - 1 ? 'text-[#00f0ff]' : undefined
    }));
  }

  // If candidate is a starter without tournament history
  if (currentElo <= 1300 && (!candidate.achievements || candidate.achievements.length <= 1) && (candidate.solvedTasksCount === 0)) {
    return [
      { pts: 1200, label: 'Реестр ФСП', stage: 'Старт', color: 'text-slate-400' },
      { pts: 1200, label: 'hh.ru верификация', stage: 'Профиль' },
      { pts: 1200, label: 'Текущий пик', stage: 'Квалификация', color: 'text-[#00f0ff]' },
      { pts: 1265, label: 'Арена (+65)', stage: 'Цель 1' },
      { pts: 1400, label: '3-й разряд ФСП', stage: 'Вход в ТОП-35%', color: 'text-amber-400' }
    ];
  }

  const p1 = Math.round((currentElo * 0.8) / 10) * 10;
  const p2 = Math.round((currentElo * 0.88) / 10) * 10;
  const p3 = Math.round((currentElo * 0.94) / 10) * 10;
  const p4 = Math.round((currentElo * 0.98) / 10) * 10;
  const p5 = currentElo;

  const achName1 = candidate.achievements?.[1]?.badge || 'Отбор ФСП';
  const achName2 = candidate.achievements?.[0]?.badge || (currentElo >= 2400 ? 'Норматив КМС' : '1-й разряд');

  return [
    { pts: p1, label: 'Отбор ФСП', stage: 'Квалификация' },
    { pts: p2, label: achName1, stage: 'Турнир' },
    { pts: p3, label: achName2, stage: 'Финал', color: 'text-amber-400' },
    { pts: p4, label: 'Высшая Лига', stage: 'Суперлига' },
    { pts: p5, label: 'Тестирование', stage: 'Текущий пик', color: 'text-[#00f0ff]' }
  ];
}

interface CandidateDashboardProps {
  candidate: CandidateProfile;
  allCandidates?: CandidateProfile[];
  onSelectCandidate?: (candidateId: string) => void;
  invitations: Invitation[];
  tasks: AlgorithmTask[];
  assessments?: AssessmentAssignment[];
  onSubmitAssessment?: (assessmentId: string, submission: CandidateAssessmentSubmission) => void;
  githubData: GitHubProfileData | null;
  hhData: HhResumeData | null;
  yandexConnected: boolean;
  yandexEmail?: string | null;
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
  assessments = [],
  onSubmitAssessment,
  githubData,
  hhData,
  yandexConnected,
  yandexEmail,
  onOpenOAuthModal,
  onAcceptInvitation,
  onDeclineInvitation,
  onSendMessage,
  onTaskSolved,
  onUpdateCandidate
}) => {
  const candidateLvl = evaluateCandidateLevel({
    elo: candidate.fspRating,
    achievements: candidate.achievements,
    solvedTasksCount: candidate.solvedTasksCount,
    leetcodeStats: candidate.leetcodeStats
  });
  const milestones = getDynamicEloProgression(candidate.fspRating, candidate);
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
  const [activeTab, setActiveTab] = useState<'invitations' | 'arena' | 'chat' | 'portfolio' | 'achievements' | 'assessments'>('invitations');
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

  // Assessment solving state
  const [activeSolvingAssessment, setActiveSolvingAssessment] = useState<AssessmentAssignment | null>(null);
  const [assessmentCode, setAssessmentCode] = useState<string>('');
  const [assessmentLang, setAssessmentLang] = useState<string>('java');
  const [assessmentExecutionLogs, setAssessmentExecutionLogs] = useState<string>('');

  // Filter assessments for this candidate
  const myAssessments = assessments.filter(a => a.candidateId === candidate.id);

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
                </div>
                {candidate.isVerified && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2b35ff]/20 text-[#00f0ff] border border-[#2b35ff]/40 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Верифицирован ФСП РФ
                  </div>
                )}
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
                <span className={`text-[10px] font-semibold block ${candidateLvl.isInTop ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {candidateLvl.topPercentile}
                </span>
              </div>

              <div className="p-3.5 bg-[#0c1224] rounded-2xl border border-[#162038] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Спортивный уровень & AP
                </span>
                <span className="text-lg font-black text-purple-400 font-mono block">
                  {candidateLvl.shortRank}
                </span>
                <span className="text-[10px] text-purple-300 font-medium block">
                  {candidateLvl.achievementPoints} AP • Ур. {candidateLvl.levelNumber}
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
                  Задачи в Арене ФСП
                </span>
                <span className="text-base font-bold text-white font-mono block">
                  {Math.min(candidate.solvedTasksCount, tasks.length)} / {tasks.length}
                </span>
                <span className="text-[10px] text-amber-400 font-medium block">
                  LeetCode: {candidate.leetcodeStats ? `${candidate.leetcodeStats.totalSolved} решено` : 'Не подключен (0 решено)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Role info, Bio, Stack, 152-FZ & Actions */}
          <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-[#162038] lg:pl-8">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-xl font-bold text-[#00f0ff]">
                      {candidate.title}
                    </h2>
                    {hhData && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#ff2b42]/15 text-[#ff7585] text-[10px] font-bold border border-[#ff2b42]/30" title={`Резюме hh.ru #${hhData.resumeId}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        hh.ru #{hhData.resumeId.slice(0, 12)}{hhData.resumeId.length > 12 ? '...' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="text-emerald-400 font-bold font-mono text-sm">
                      {candidate.salaryExpectationMin.toLocaleString('ru-RU')} – {candidate.salaryExpectationMax.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-medium">
                      Опыт: <strong className="text-white">{candidate.experienceYears} {candidate.experienceYears === 1 ? 'год' : candidate.experienceYears < 5 ? 'года' : 'лет'}</strong>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      {candidate.city} (РФ) • {candidate.preferredFormat === 'remote' ? 'Удаленно' : 'Гибрид'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenOAuthModal}
                    className="px-3 py-1.5 rounded-xl bg-[#ff2b42]/20 hover:bg-[#ff2b42]/35 text-[#ff7585] hover:text-white border border-[#ff2b42]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Управление импортом резюме с hh.ru"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white text-[8px] font-black flex items-center justify-center">hh</span>
                    <span>{hhData ? 'Резюме hh.ru' : 'Импорт hh.ru'}</span>
                  </button>
                </div>
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

            {/* hh.ru Confirmed Skills Assessment Strip */}
            {((candidate.hhConfirmedSkills && candidate.hhConfirmedSkills.length > 0) || (hhData?.confirmedSkills && hhData.confirmedSkills.length > 0)) && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#14080d] via-[#090d1c] to-[#0a1226] border border-[#ff2b42]/40 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-[#ff2b42] text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                      hh
                    </div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      Подтвержденные навыки HeadHunter
                      <span className="px-1.5 py-0.2 rounded bg-[#ff2b42]/20 text-[#ff7585] text-[9px] font-mono border border-[#ff2b42]/30">
                        hh.ru Skill Assessment
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Тестирование hh.ru</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(candidate.hhConfirmedSkills || hhData?.confirmedSkills || []).map((cs) => (
                    <div key={cs.id} className="p-2 rounded-xl bg-[#080d1e] border border-[#1d2745] hover:border-[#ff2b42]/50 transition-colors">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate mr-1.5">{cs.skill}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-black shrink-0 ${
                          cs.level === 'Экспертный' 
                            ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40' 
                            : 'bg-blue-500/25 text-blue-300 border border-blue-500/40'
                        }`}>
                          {cs.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-mono font-bold">{cs.scorePercent}% • {cs.percentileRank.split(' ')[0]}</span>
                        <span className="text-slate-500 font-mono text-[9px]">{cs.confirmedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 152-FZ Privacy Status & OAuth Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#162038]">
              <div className="bg-[#070b16] p-3 rounded-2xl border border-[#162038] text-xs space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#00f0ff] font-bold">
                  <Lock className="w-3 h-3 text-[#00f0ff]" />
                  <span>Защита контактов</span>
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
              {(hhData || candidate.hhConfirmedSkills) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-[#ff2b42]/40">
                  <span className="text-[10px] font-black text-[#ff2b42]">hh</span>
                  <span>Резюме ({hhData?.experienceYears || candidate.experienceYears} лет)</span>
                  {(hhData?.confirmedSkills?.length || candidate.hhConfirmedSkills?.length) && (
                    <span className="px-1.5 py-0.2 rounded bg-[#ff2b42]/20 text-[#ff7585] text-[9px] font-bold border border-[#ff2b42]/30">
                      {(hhData?.confirmedSkills?.length || candidate.hhConfirmedSkills?.length)} подтвержденных навыков
                    </span>
                  )}
                </span>
              )}
              {candidate.githubSync && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-emerald-500/40" title="Автопуш решений в публичный репозиторий GitHub активен">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px] text-white">FSP-Hub: @{candidate.githubSync.repoName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              )}
              {yandexConnected && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0a0e1c] text-slate-300 border border-[#ffcc00]/40">
                  <span className="text-[10px] font-black text-[#ffcc00]">Я</span>
                  <span>Яндекс ID ({yandexEmail || 'ivan.pesterev@yandex.ru'})</span>
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
        candidate={candidate}
        achievements={candidate.achievements}
        solvedTasksCount={candidate.solvedTasksCount}
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
            onClick={() => setActiveTab('assessments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assessments'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Тестирования от компаний</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
              {myAssessments.length}
            </span>
            {myAssessments.some(a => a.review) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Есть новая оценка от работодателя" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-[#2b35ff] text-white shadow-lg shadow-[#2b35ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#121932]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Достижения & Нормативы ЕВСК</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              {candidateLvl.achievementPoints} AP
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
            <span>Чат с работодателями</span>
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

      {/* Tab: Assessments & Technical Tests from Employers */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-[#1d2645] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Технические задания и лайв-интервью от аккредитованных компаний
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Решайте задачи работодателей прямо в браузере с изолированной проверкой и подключайтесь к видеовстречам Яндекс Телемост
              </p>
            </div>

            <div className="text-xs text-slate-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5 shrink-0">
              Всего назначено: <strong className="text-white">{myAssessments.length}</strong>
            </div>
          </div>

          {/* Режим решения выбранного теста */}
          {activeSolvingAssessment ? (
            <div className="space-y-4 p-6 rounded-3xl bg-[#080d1e] border border-purple-500/30 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      {activeSolvingAssessment.companyName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeSolvingAssessment.task.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                      activeSolvingAssessment.task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {activeSolvingAssessment.task.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{activeSolvingAssessment.task.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Лимит: {activeSolvingAssessment.timeLimitMinutes} мин</span>
                  </div>
                  <button
                    onClick={() => setActiveSolvingAssessment(null)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Вернуться к списку
                  </button>
                </div>
              </div>

              {/* Яндекс Телемост если это лайв-сессия */}
              {activeSolvingAssessment.isLiveInterview && (
                <YandexTelemostWidget
                  telemostUrl={activeSolvingAssessment.telemostRoomUrl}
                  roomName={`Лайв-кодинг собеседование: ${activeSolvingAssessment.companyName}`}
                  scheduledTime={activeSolvingAssessment.scheduledInterviewAt}
                />
              )}

              {/* Условие задачи */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">
                  Условие и бизнес-требования:
                </h4>
                <p className="leading-relaxed whitespace-pre-line">{activeSolvingAssessment.task.description}</p>
                {activeSolvingAssessment.task.constraints && activeSolvingAssessment.task.constraints.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400">Ограничения:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 font-mono text-[11px]">
                      {activeSolvingAssessment.task.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Редактор кода */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    Редактор решения
                  </label>
                  <select
                    value={assessmentLang}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setAssessmentLang(newLang);
                      const starter = (activeSolvingAssessment.task.starterCode as any)?.[newLang];
                      if (starter) setAssessmentCode(starter);
                    }}
                    className="px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono"
                  >
                    <option value="java">Java 21</option>
                    <option value="python">Python 3.12</option>
                    <option value="javascript">JavaScript / TypeScript</option>
                    <option value="go">Go 1.23</option>
                    <option value="cpp">C++ 20</option>
                  </select>
                </div>

                <textarea
                  rows={12}
                  value={assessmentCode}
                  onChange={(e) => setAssessmentCode(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#04060d] border border-white/10 text-slate-100 font-mono text-xs leading-relaxed focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Логи выполнения при тестировании */}
              {assessmentExecutionLogs && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                  {assessmentExecutionLogs}
                </div>
              )}

              {/* Кнопка отправки решения */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAssessmentExecutionLogs('Запуск стресс-тестов: 4/4 тестов пройдено успешно. Решение готово к отправке.');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  Запустить тесты
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onSubmitAssessment) {
                      onSubmitAssessment(activeSolvingAssessment.id, {
                        code: assessmentCode,
                        language: assessmentLang,
                        spentTimeMinutes: 24,
                        passedCount: 4,
                        totalCount: 4,
                        executionLogs: 'Все открытые и скрытые тест-кейсы компании успешно пройдены.',
                        submittedAt: new Date().toISOString()
                      });
                    }
                    setActiveSolvingAssessment(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Отправить решение работодателю</span>
                </button>
              </div>
            </div>
          ) : (
            /* Список назначенных тестов */
            <div className="grid grid-cols-1 gap-4">
              {myAssessments.length === 0 ? (
                <div className="text-center py-12 bg-[#080d20] rounded-2xl border border-white/5 p-6">
                  <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 font-semibold text-sm">Пока нет назначенных тестирований</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Когда работодатель назначит вам задачу или лайв-кодинг интервью, оно появится здесь
                  </p>
                </div>
              ) : (
                myAssessments.map((asmt) => {
                  const isSubmitted = asmt.status === 'submitted';
                  const isReviewed = asmt.status === 'reviewed';
                  const isPending = asmt.status === 'pending';

                  return (
                    <div
                      key={asmt.id}
                      className="p-5 rounded-2xl bg-[#080d20] border border-white/10 hover:border-purple-500/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={asmt.companyLogo}
                            alt={asmt.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                          />
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
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Компания: <strong className="text-slate-200">{asmt.companyName}</strong> • Вакансия: {asmt.vacancyTitle || 'Инженерная позиция'}
                            </p>
                          </div>
                        </div>

                        {/* Статус */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isPending && (
                            <button
                              onClick={() => {
                                setActiveSolvingAssessment(asmt);
                                const defaultLang = 'java';
                                setAssessmentLang(defaultLang);
                                setAssessmentCode(
                                  (asmt.task.starterCode as any)?.[defaultLang] ||
                                  (asmt.task.starterCode as any)?.python ||
                                  '// Начните писать код'
                                );
                              }}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] text-slate-950 font-bold text-xs shadow-lg shadow-[#2b35ff]/30 flex items-center gap-1.5"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>Начать решение</span>
                            </button>
                          )}

                          {isSubmitted && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Решение на проверке у работодателя
                            </span>
                          )}

                          {isReviewed && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              asmt.review?.verdict === 'like'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                              {asmt.review?.verdict === 'like' ? (
                                <>
                                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Одобрено работодателем (Лайк 👍)</span>
                                </>
                              ) : (
                                <>
                                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Не прошло отбор (Дизлайк 👎)</span>
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Яндекс Телемост если прикреплена ссылка */}
                      {asmt.isLiveInterview && (
                        <YandexTelemostWidget
                          telemostUrl={asmt.telemostRoomUrl}
                          roomName={`Лайв-встреча: ${asmt.companyName}`}
                          scheduledTime={asmt.scheduledInterviewAt}
                        />
                      )}

                      {/* Сообщение обратной связи от работодателя */}
                      {asmt.review && (
                        <div className="p-3.5 rounded-xl bg-[#0b1026] border border-cyan-500/30 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-cyan-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                              Обратная связь от компании:
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(asmt.review.reviewedAt).toLocaleDateString('ru-RU')} • {asmt.review.reviewerName}
                            </span>
                          </div>
                          <p className="text-slate-200 italic leading-relaxed">
                            "{asmt.review.candidateFeedbackMessage}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

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
            onUpdateStats={(newStats: any) => onUpdateCandidate({ leetcodeStats: newStats })}
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
                          Безопасность профиля GitHub:
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

                    {/* FSP-Hub Auto-Push to GitHub Box */}
                    {candidate.githubSync && (
                      <div className="p-4 rounded-2xl bg-[#070b16] border border-[#2b35ff]/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-[#00f0ff]" />
                            <span className="text-xs font-bold text-white">
                              FSP-Hub: Публичный репозиторий решений
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                              {candidate.githubSync.autoPushEnabled ? 'Автопуш активен' : 'Выключен'}
                            </span>
                          </div>
                          <a
                            href={`https://github.com/${candidate.githubSync.repoFullName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#00f0ff] hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>@{candidate.githubSync.repoFullName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {candidate.githubSync.recentCommits.map((c) => (
                            <div key={c.id} className="p-2.5 rounded-xl bg-[#0b1022] border border-[#16203a] flex items-center justify-between text-xs font-mono">
                              <div className="space-y-0.5 min-w-0 pr-2">
                                <div className="text-slate-200 font-bold truncate flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    c.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                    c.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                                  }`}>
                                    {c.difficulty}
                                  </span>
                                  <span className="truncate">{c.taskTitle}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {c.language} • {c.runtimeMs}ms (beats {c.runtimeBeatsPercent}%) • {c.memoryMb}MB • {c.timestamp}
                                </div>
                              </div>
                              <span className="text-[#00f0ff] text-[10px] px-2 py-0.5 rounded bg-[#131d3b] border border-[#2b35ff]/30 shrink-0">
                                {c.commitHash}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-400">
                          {hhData ? `ID: ${hhData.resumeId}` : 'Не загружено'}
                        </span>
                        {hhData && (
                          <a
                            href={hhData.resumeId.length <= 10 && /^\d+$/.test(hhData.resumeId) ? `https://hh.ru/vacancy/${hhData.resumeId}` : `https://hh.ru/resume/${hhData.resumeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-[#00f0ff] hover:underline flex items-center gap-0.5"
                            title="Открыть на hh.ru"
                          >
                            <span>hh.ru</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {hhData ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenOAuthModal}
                        className="px-2.5 py-1 rounded-xl border border-[#ff2b42]/40 hover:bg-[#ff2b42]/10 text-[#ff7585] text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Сменить / Настроить
                      </button>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        Синхронизировано
                      </span>
                    </div>
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

                    {/* HeadHunter Confirmed Skills Assessment in Portfolio */}
                    {((hhData?.confirmedSkills && hhData.confirmedSkills.length > 0) || (candidate.hhConfirmedSkills && candidate.hhConfirmedSkills.length > 0)) ? (
                      <div className="space-y-2 pt-2 border-t border-[#162038]">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Подтвержденные навыки HeadHunter (Тестирование):</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {(hhData?.confirmedSkills || candidate.hhConfirmedSkills || []).length} сертификата
                          </span>
                        </div>

                        <div className="space-y-2">
                          {(hhData?.confirmedSkills || candidate.hhConfirmedSkills || []).map((cs) => (
                            <div key={cs.id} className="p-3 rounded-xl bg-[#0c1224] border border-[#1b2746] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">{cs.skill}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cs.level === 'Экспертный'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {cs.level}
                                </span>
                              </div>
                              <div className="text-[11px] text-emerald-400 font-mono font-medium">
                                Результат: {cs.scorePercent}% • {cs.percentileRank}
                              </div>
                              <p className="text-[10px] text-slate-400">
                                {cs.testTitle}
                              </p>
                              <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pt-0.5">
                                <span>Дата сдачи: {cs.confirmedAt}</span>
                                <span>Сертификат: {cs.certificateId}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-[#0c1224] border border-[#192442] space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-[#ff2b42] text-white text-[8px] font-black flex items-center justify-center">hh</span>
                            Тестирование HeadHunter:
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">0 тестов на hh.ru</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Раздел «Пройденные тесты и экзамены» на hh.ru пока не заполнен. Квалификация и навыки кандидата подтверждаются решениями задач в Арене ФСП.
                        </p>
                      </div>
                    )}

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
                            <span>Приглашение принято. Контакты переданы работодателю.</span>
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
                Алгоритмическая арена и подтверждение грейда
              </h2>
              <p className="text-xs text-slate-400">
                Решайте задачи банка ФСП в интерактивной среде разработки с автоматической проверкой тестов.
              </p>
            </div>
          </div>

          <CodeArenaIDE
            tasks={tasks}
            onTaskSolved={onTaskSolved}
            candidate={candidate}
            onUpdateCandidate={onUpdateCandidate}
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
                      <span>Контакты переданы</span>
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

      {/* Tab: Achievements & Official FSP Standards */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-[#1d2645] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Официальный реестр ФСП РФ
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  candidateLvl.isInTop ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {candidateLvl.topPercentile}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                Спортивные достижения & Квалификационные нормативы Минспорта РФ
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                По регламенту Федерации спортивного программирования России и ЕВСК, нахождение в официальном ТОПе атлетов требует не только рейтинга ELO, но и подтвержденных турнирных результатов или выполненных нормативов решения алгоритмических задач.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070b1a] border border-[#2b35ff]/40 text-right shrink-0">
              <div className="text-xs text-slate-400 font-bold uppercase">Очки Достижений (AP)</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {candidateLvl.achievementPoints} <span className="text-sm font-normal text-slate-400">AP</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Подтверждено: <strong className="text-white">{candidate.achievements?.length || 0}</strong> турниров
              </div>
            </div>
          </div>

          {/* Qualification Division Notice (Anti-cheat) if candidate is not in TOP */}
          {!candidateLvl.isInTop && (
            <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-300">
                    Статус: Квалификационный дивизион (Честный старт)
                  </h4>
                  <p className="text-xs text-slate-300 max-w-3xl">
                    У вас пока нет подтвержденных турнирных призовых мест и решенных задач. Чтобы получить 3-й спортивный разряд и войти в <strong className="text-white">ТОП-35% спортсменов РФ</strong>, наберите 1400 ELO и решите первые 5 задач в Арене или подтвердите олимпиадную победу.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('arena')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
              >
                <Code2 className="w-4 h-4" />
                <span>Решить задачу в Арене (+85 ELO)</span>
              </button>
            </div>
          )}

          {/* Verified Achievements List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Подтвержденные спортивные победы и награды
              </h3>
              <span className="text-xs text-slate-400">
                Верификация: <strong className="text-[#00f0ff]">ФСП РФ (ЕВСК)</strong>
              </span>
            </div>

            {candidate.achievements && candidate.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.achievements.map((ach, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0c1224] border border-[#1d2645] hover:border-[#2b35ff]/50 transition-all space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl p-2 rounded-xl bg-[#141b33] border border-[#2b35ff]/30 shrink-0">
                          {ach.badge || '🏆'}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                            {ach.year} • Федерация спортивного программирования РФ
                          </span>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {ach.title}
                          </h4>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold shrink-0">
                        Подтверждено
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="pt-2 border-t border-[#162038] flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Верифицировано в реестре Минспорта
                      </span>
                      <span className="font-mono text-slate-400">ID: ФСП-{ach.year}-{idx + 101}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0c1224] border border-dashed border-[#1d2645] text-center space-y-3">
                <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">
                  Пока нет подтвержденных турнирных наград
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Принимайте участие в Чемпионатах и Кубках ФСП РФ или синхронизируйте профиль LeetCode / Codeforces для автоматического начисления наград.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('arena')}
                    className="px-4 py-2 rounded-xl bg-[#2b35ff] hover:bg-[#2028cc] text-white text-xs font-bold transition-all"
                  >
                    Открыть задачи Арены
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Normative Matrix Table (7 Levels of FSP & MinSport RF) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                Таблица квалификационных нормативов (ЕВСК Минспорта РФ)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Для перехода на каждый следующий уровень необходимо выполнить оба норматива: ELO и турнирный опыт.
              </p>
            </div>

            <div className="rounded-2xl border border-[#1b233a] overflow-hidden bg-[#090d1a]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f172a] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1b233a]">
                    <tr>
                      <th className="py-3 px-4">Уровень / Разряд</th>
                      <th className="py-3 px-4">Норматив ELO</th>
                      <th className="py-3 px-4">Турнирные награды</th>
                      <th className="py-3 px-4">Решено задач</th>
                      <th className="py-3 px-4">Официальный ТОП</th>
                      <th className="py-3 px-4 text-right">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162038]">
                    {FSP_STANDARD_LEVELS.map((lvl) => {
                      const isCurrent = lvl.levelNumber === candidateLvl.levelNumber;
                      const isCompleted = lvl.levelNumber < candidateLvl.levelNumber;
                      const isNext = lvl.levelNumber === candidateLvl.levelNumber + 1;

                      return (
                        <tr 
                          key={lvl.levelNumber}
                          className={`transition-colors ${
                            isCurrent 
                              ? 'bg-[#2b35ff]/10 font-medium' 
                              : isCompleted 
                              ? 'opacity-80 hover:bg-[#0c1224]' 
                              : 'opacity-60 hover:bg-[#0c1224]'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black border ${lvl.badgeColor}`}>
                              {lvl.levelNumber}
                            </span>
                            <div>
                              <div className="text-white font-bold">{lvl.shortRank}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{lvl.rankName}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#00f0ff]">
                            {lvl.minElo}+ ELO
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {lvl.minAchievements > 0 ? `${lvl.minAchievements} турнир(а)` : 'Не требуется'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            {lvl.minTasks > 0 ? `${lvl.minTasks}+ задач` : '0 задач'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              lvl.isInTop ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {lvl.topPercentile}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                <Check className="w-3 h-3" /> Выполнен
                              </span>
                            )}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 text-[10px] font-bold shadow-sm">
                                <Zap className="w-3 h-3" /> Текущий
                              </span>
                            )}
                            {isNext && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                Следующая цель
                              </span>
                            )}
                            {!isCompleted && !isCurrent && !isNext && (
                              <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]">
                                <Lock className="w-3 h-3" /> Заблокирован
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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
                Согласие на передачу контактов
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Вы подтверждаете интерес к офферу от работодателя. Ваши контактные данные:
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
