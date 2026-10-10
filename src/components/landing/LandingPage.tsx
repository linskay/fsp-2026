import React, { useState } from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Github, 
  Building2, 
  UserCheck, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Lock, 
  FileText, 
  Scale, 
  TrendingUp, 
  Users, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Target,
  Award,
  Cpu,
  Flame,
  Check,
  Briefcase,
  Play,
  RotateCcw,
  Sliders,
  Filter,
  Eye,
  Bot,
  Terminal,
  Activity,
  Send,
  Search,
  Star,
  Key
} from 'lucide-react';
import { UserRole, CandidateProfile, HhResumeData, GitHubProfileData } from '../../types';
import { INITIAL_CANDIDATES } from '../../data/mockData';
import { FspLogo, FspStarIcon } from '../brand/FspLogo';
import { UserAvatar } from '../brand/UserAvatar';
import { evaluateCandidateLevel, getEloPercentile } from '../../utils/ratingEngine';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenOAuth: (provider?: 'github' | 'hh' | 'yandex') => void;
  onOpenLogin?: () => void;
  candidate?: CandidateProfile;
  hhData?: HhResumeData | null;
  githubData?: GitHubProfileData | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenOAuth,
  onOpenLogin,
  candidate,
  hhData,
  githubData
}) => {
  const displayCandidate = candidate || INITIAL_CANDIDATES[0];
  const isIvan = displayCandidate.id === 'cand-pesterev' || displayCandidate.fullName.includes('Пестерев');
  const rankShort = displayCandidate.fspRank.includes('КМС') || displayCandidate.fspRank.includes('Кандидат') 
    ? 'КМС РФ' 
    : displayCandidate.fspRank.includes('1-й') 
    ? '1-й разряд'
    : displayCandidate.fspRank.includes('2-й')
    ? '2-й разряд'
    : displayCandidate.fspRank.includes('3-й')
    ? '3-й разряд'
    : displayCandidate.fspRank.includes('Junior') || displayCandidate.fspRank.includes('Начинающий')
    ? 'Junior'
    : 'МС РФ';
  const desiredSalaryStr = hhData 
    ? `${hhData.desiredSalary.toLocaleString('ru-RU')} ₽` 
    : (displayCandidate.salaryExpectationMin ? `${displayCandidate.salaryExpectationMin.toLocaleString('ru-RU')} ₽` : '120 000 ₽');
  const commitsCount = githubData?.commitsCountYear || (isIvan ? 842 : 520);
  const lcSolved = displayCandidate.leetcodeStats ? displayCandidate.leetcodeStats.totalSolved : 0;
  const lcBadge = displayCandidate.leetcodeStats?.badge || 'Без LC';
  const lcHard = displayCandidate.leetcodeStats?.hardSolved || 0;
  const candidateLvl = evaluateCandidateLevel({
    elo: displayCandidate.fspRating,
    achievements: displayCandidate.achievements,
    solvedTasksCount: displayCandidate.solvedTasksCount,
    leetcodeStats: displayCandidate.leetcodeStats
  });
  const topPercentageStr = candidateLvl.topPercentile;
  const githubLogin = displayCandidate.githubUrl ? displayCandidate.githubUrl.split('/').pop() : (isIvan ? 'ipesterev' : 'alina-dev');

  // Hero Interactive Role Switcher: 'candidate' | 'employer'
  const [heroRole, setHeroRole] = useState<'candidate' | 'employer'>('candidate');
  
  // Interactive Bento Grid: LeetCode Mini-Sandbox state
  const [sandboxCode, setSandboxCode] = useState<string>(
`// Решение задачи: Поиск максимального потока (Алгоритм Диница)
public class Solution {
    public int maxFlow(int[][] capacity, int source, int sink) {
        // Оптимизированный алгоритм Диница: O(V^2 * E)
        DinicFlow dinic = new DinicFlow(capacity.length);
        return dinic.computeMaxFlow(capacity, source, sink);
    }
}`
  );
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testVerdict, setTestVerdict] = useState<{
    status: 'ACCEPTED' | 'IDLE';
    timeMs: number;
    memoryMb: number;
    eloBonus: number;
    passedCount: string;
  } | null>(null);

  // ELO & Salary Calculator State
  const [eloSlider, setEloSlider] = useState<number>(2550);

  // Dynamic salary calculation based on ELO
  const calculateSalary = (elo: number) => {
    let min = Math.round((140000 + (elo - 1200) * 240) / 10000) * 10000;
    let max = Math.round(min * 1.35 / 10000) * 10000;
    let rank = '3-й спортивный разряд';
    let grade = 'Junior / Middle';

    if (elo >= 2700) {
      rank = 'Мастер спорта России (МС)';
      grade = 'Lead / Principal Engineer';
    } else if (elo >= 2400) {
      rank = 'Кандидат в мастера спорта (КМС)';
      grade = 'Senior Engineer';
    } else if (elo >= 2000) {
      rank = '1-й спортивный разряд';
      grade = 'Strong Middle / Senior';
    } else if (elo >= 1600) {
      rank = '2-й спортивный разряд';
      grade = 'Middle Engineer';
    }

    return { min, max, rank, grade };
  };

  const currentCalc = calculateSalary(eloSlider);

  // Run Sandbox Test Simulator
  const handleRunSandboxTest = () => {
    setIsRunningTest(true);
    setTestVerdict(null);
    setTimeout(() => {
      setIsRunningTest(false);
      setTestVerdict({
        status: 'ACCEPTED',
        timeMs: 32,
        memoryMb: 14.8,
        eloBonus: 85,
        passedCount: '12 / 12 тестов'
      });
    }, 900);
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#04060d] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[1300px] left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 ambient-cyber-grid"
      />

      {/* ========================================================================= */}
      {/* 2.2 ИНТЕРАКТИВНАЯ HERO-СЕКЦИЯ (HIGH-END ДИЗАЙН) */}
      {/* ========================================================================= */}
      <section id="hero-section" className="relative z-10 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Title (H1) & Subtitle with Luxury Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-4 px-2">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-[-0.03em] text-white leading-[1.08]">
            FSP Career Arena — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 drop-shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              ИТ-найм нового поколения
            </span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-slate-300/90 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            Цифровая платформа обратного найма разработчиков. Компании соревнуются за кандидатов и делают предложения с гарантированной рублевой вилкой на основе рейтинга ELO.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ИНТЕРАКТИВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ (ROLE SWITCHER) */}
        {/* ========================================================================= */}
        <div className="mt-8 flex justify-center px-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
            <button
              onClick={() => setHeroRole('candidate')}
              className={`flex items-center gap-2.5 px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                heroRole === 'candidate'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Я — Кандидат</span>
            </button>

            <button
              onClick={() => setHeroRole('employer')}
              className={`flex items-center gap-2.5 px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                heroRole === 'employer'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Я — Работодатель</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Role Workspace Display */}
        <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
          {heroRole === 'candidate' ? (
            /* CANDIDATE HERO INTERACTIVE PREVIEW & OAUTH */
            <div className="glass-card-pro rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left: Info & OAuth Entry */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Обратный найм: компании откликаются первыми</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    Конвертируй свой рейтинг ELO и код в лучшие карьерные офферы
                  </h3>

                  <p className="text-sm text-slate-300/90 leading-relaxed font-normal">
                    Никаких сотен холодных откликов. Работодатели сами отправляют вам предложения с прозрачной вилкой в рублях на основе ваших алгоритмических побед.
                  </p>

                  {/* Candidate Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button
                      onClick={() => onSelectRole('candidate')}
                      className="flex-1 py-3.5 px-6 rounded-xl btn-wow-primary text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer group shadow-lg shadow-blue-500/25"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Кабинет соискателя</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenLogin) onOpenLogin();
                        else onSelectRole('candidate');
                      }}
                      className="py-3.5 px-5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Авторизоваться</span>
                    </button>
                  </div>
                </div>

                {/* Right: Conceptual 3-Step Reverse Recruiting Guide */}
                <div className="lg:col-span-6 rounded-2xl bg-[#090d20]/80 border border-white/[0.08] p-5 sm:p-6 shadow-2xl relative space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Модель Reverse Recruiting</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      3 простых шага
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {/* Step 1 */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-all flex items-start gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                        01
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Верификация ELO & Кода</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Тесты в Арене и коммиты GitHub подтверждают ваш честный уровень без ручного скрининга резюме.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-all flex items-start gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                        02
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Работодатели находят вас сами</span>
                          <Lock className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Компании ищут по стеку и ELO. Ваши персональные данные скрыты до взаимного согласия (152-ФЗ РФ).
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                        03
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>Прямой оффер с вилкой в рублях</span>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Получайте офферы с фиксированной вилкой «от-до». Контакты открываются только при обоюдном клике «Принять».
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% защита от спама
                    </span>
                    <button
                      onClick={() => onSelectRole('arena')}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Попробовать Арену</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* EMPLOYER HERO INTERACTIVE PREVIEW & OAUTH */
            <div className="glass-card-pro rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left: Info & Employer Action */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>Для IT-компаний и финтех-лидеров</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    Никаких слепых откликов. Нанимайте проверенных разработчиков
                  </h3>

                  <p className="text-sm text-slate-300/90 leading-relaxed font-normal">
                    Доступ к верифицированной базе спортивных программистов России. Просматривайте реальные метрики тестирования, чистоту кода и отправляйте прямой оффер с вилкой.
                  </p>

                  {/* Employer Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button
                      onClick={() => onSelectRole('employer')}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 cursor-pointer group"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Панель работодателя</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenLogin) onOpenLogin();
                        else onSelectRole('employer');
                      }}
                      className="py-3.5 px-5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      <span>Войти как компания</span>
                    </button>
                  </div>
                </div>

                {/* Right: Employer HR Filter & Candidate Bank Preview */}
                <div className="lg:col-span-6 rounded-2xl bg-[#090d20]/80 border border-white/[0.08] p-5 sm:p-6 shadow-2xl relative space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-white">Фильтр базы соискателей</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">1 480 проверено</span>
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold">
                      ELO ≥ {Math.floor(displayCandidate.fspRating / 100) * 100} ({rankShort.replace(' РФ', '')})
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                      {displayCandidate.skills.slice(0, 2).join(' / ') || 'Java / Backend'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Вилка {displayCandidate.salaryExpectationMin ? `${Math.round(displayCandidate.salaryExpectationMin / 1000)}-${Math.round(displayCandidate.salaryExpectationMax / 1000)}k ₽` : '108-138k ₽'}
                    </span>
                  </div>

                  {/* Candidate list item preview */}
                  <div className="space-y-2 pt-1">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs hover:border-white/[0.12] transition-colors">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={displayCandidate.fullName} src={displayCandidate.avatarUrl} size="sm" rank={displayCandidate.fspRank} />
                        <div>
                          <div className="font-bold text-white text-xs">{displayCandidate.fullName.split(' ')[0]} {displayCandidate.fullName.split(' ')[1]?.[0]}. ({rankShort.replace(' РФ', '')})</div>
                          <div className="text-[10px] text-slate-400">{displayCandidate.title} • {displayCandidate.city} / Remote</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectRole('employer')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Оффер →
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs hover:border-white/[0.12] transition-colors">
                      <div className="flex items-center gap-3">
                        <UserAvatar name="Екатерина Михайлова" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" size="sm" rank="КМС" />
                        <div>
                          <div className="font-bold text-white text-xs">Екатерина М. (КМС)</div>
                          <div className="text-[10px] text-slate-400">Fullstack / React + Go • СПБ</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectRole('employer')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Оффер →
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2.3 СЕТКА ПРЕИМУЩЕСТВ */}
      {/* ========================================================================= */}
      <section id="bento-grid" className="relative z-10 py-12 lg:py-20 bg-[#050711] border-t border-[#141d38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Advantages Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Технологическое превосходство платформы
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Вместо скучной стены текста — интерактивные модули и верифицированные инструменты
            </p>
          </div>

          {/* GRID CONTAINER (4 MAIN TILES) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            
            {/* ПЛИТКА №1 (Обратная механика найма) - Large 7 cols */}
            <div className="md:col-span-7 rounded-3xl p-6 sm:p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#2b35ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(43,53,255,0.2)] flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2b35ff]/20 border border-[#2b35ff]/40 flex items-center justify-center text-[#00f0ff]">
                  <Zap className="w-6 h-6" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Обратная механика найма без спама и отказов
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Работодатель сам просматривает категоризированную базу и направляет приглашение конкретному специалисту, избавляя обе стороны от рутины и слепых откликов.
                </p>

                {/* Visual Flow diagram */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-[#060a18] border border-slate-800 space-y-1">
                    <div className="font-bold text-[#00f0ff] text-[11px]">1. Выбор по ELO</div>
                    <div className="text-[10px] text-slate-400">HR выбирает нужный стек и разряд</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#060a18] border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-400 text-[11px]">2. Оффер с вилкой</div>
                    <div className="text-[10px] text-slate-400">Конкретные рубли и задачи сразу</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#060a18] border border-slate-800 space-y-1">
                    <div className="font-bold text-yellow-400 text-[11px]">3. Прямой контакт</div>
                    <div className="text-[10px] text-slate-400">Контакты открываются по согласию</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Конверсия в диалог: <strong className="text-emerald-400 font-mono">87.4%</strong></span>
                <button 
                  onClick={() => onSelectRole('candidate')}
                  className="text-[#00f0ff] font-bold flex items-center gap-1 hover:underline"
                >
                  Посмотреть входящие офферы →
                </button>
              </div>
            </div>

            {/* ПЛИТКА №2 (Киберспорт и рейтинг ELO) - 5 cols */}
            <div className="md:col-span-5 rounded-3xl p-6 sm:p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#00f0ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(0,240,255,0.2)] flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-yellow-400">
                  <Trophy className="w-6 h-6" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Киберспортивный ELO рейтинг и разряды ФСП
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Объективное и проверяемое подтверждение практических навыков через олимпиады, хакатоны и алгоритмическое тестирование.
                </p>

                {/* ELO Tier Badges */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#060a18] border border-slate-800">
                    <span className="text-slate-300">Мастер спорта России (МС)</span>
                    <span className="text-yellow-400 font-bold font-mono">2700+ ELO</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#060a18] border border-slate-800">
                    <span className="text-slate-300">Кандидат в мастера (КМС)</span>
                    <span className="text-[#00f0ff] font-bold font-mono">2400+ ELO</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#060a18] border border-slate-800">
                    <span className="text-slate-300">1-й спортивный разряд</span>
                    <span className="text-emerald-400 font-bold font-mono">2000+ ELO</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Реестр Минспорта РФ</span>
                <span className="text-emerald-400 font-bold">Аккредитовано</span>
              </div>
            </div>

            {/* ПЛИТКА №3 (LeetCode-песочница с интерактивным запуском теста) - 6 cols */}
            <div className="md:col-span-6 rounded-3xl p-6 sm:p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#2b35ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(43,53,255,0.2)] flex flex-col justify-between group relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Code2 className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-black text-white">
                  Интерактивная среда тестирования
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Автоматическая проверка алгоритмов. Нажмите <strong>«Запустить тест»</strong> прямо сейчас:
                </p>

                {/* Mini Code Terminal */}
                <div className="rounded-2xl bg-[#060914] border border-slate-800 p-3 font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1.5">
                    <span>Task: Max Flow (Dinic Algo)</span>
                    <span className="text-[#00f0ff]">Java 21 / OpenJDK</span>
                  </div>

                  <div className="text-slate-400 max-h-24 overflow-y-auto leading-tight">
                    <div><span className="text-[#00f0ff]">public int</span> <span className="text-yellow-300">maxFlow</span>(int[][] cap) {'{'}</div>
                    <div className="pl-3 text-emerald-400">// Dinic algorithm execution</div>
                    <div className="pl-3">return dinic.compute(cap);</div>
                    <div>{'}'}</div>
                  </div>

                  {/* Run Button & Live Result */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={handleRunSandboxTest}
                      disabled={isRunningTest}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:from-[#3b47ff] hover:to-[#1de9b6] text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isRunningTest ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Компиляция и тесты...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Запустить тест</span>
                        </>
                      )}
                    </button>

                    {testVerdict && (
                      <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 animate-bounce-short">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{testVerdict.status} ({testVerdict.timeMs}ms, +{testVerdict.eloBonus} ELO)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">100+ задач с LeetCode</span>
                <button 
                  onClick={() => onSelectRole('arena')}
                  className="text-[#00f0ff] font-bold hover:underline"
                >
                  Открыть полную Арену →
                </button>
              </div>
            </div>

            {/* ПЛИТКА №4 (Честные зарплатные вилки) - 6 cols */}
            <div className="md:col-span-6 rounded-3xl p-6 sm:p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#ff2b42] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(255,43,66,0.2)] flex flex-col justify-between group relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ff2b42]/20 border border-[#ff2b42]/40 flex items-center justify-center text-[#ff2b42]">
                  <Scale className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-black text-white">
                  Обязательные вилки зарплат («от-до» в рублях)
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Платформа запрещает создание вакансий и офферов с формулировкой «по договоренности». Все условия прозрачны до начала любого диалога.
                </p>

                {/* Salary Validation Badge Box */}
                <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Backend Senior:</span>
                    <span className="text-emerald-400 font-bold font-mono">350 000 – 480 000 ₽</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Highload Lead:</span>
                    <span className="text-emerald-400 font-bold font-mono">480 000 – 650 000 ₽</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ML / AI Specialist:</span>
                    <span className="text-emerald-400 font-bold font-mono">400 000 – 580 000 ₽</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Фиксация вилок в оффере</span>
                <span className="text-emerald-400 font-bold">100% контроль</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.4 ИНТЕРАКТИВНОЕ ДЕМО / LIVE-ВИДЖЕТ ПРОФИЛЯ С AI-SUMMARY */}
      {/* ========================================================================= */}
      <section id="live-profile-demo" className="relative z-10 py-12 lg:py-20 bg-[#060a1c] border-t border-[#141d38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              AI-Summary & Цифровой профиль спортсмена ФСП
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Глубокая аналитика решений, алгоритмической сложности и практического стека
            </p>
          </div>

          {/* Live Developer Profile Card with AI Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0c1432] to-[#070c1e] border-2 border-[#2b35ff]/50 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header: Candidate Info & ELO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={displayCandidate.avatarUrl} 
                  alt={displayCandidate.fullName} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00f0ff] shadow-lg shadow-[#00f0ff]/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{displayCandidate.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#2b35ff]/40 text-[#00f0ff] text-xs font-bold">
                      {displayCandidate.fspRank}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{displayCandidate.title} • {displayCandidate.city} / Remote</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>GitHub: @{githubLogin}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Верифицирован ФСП</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#060917] border border-[#2b35ff]/40 text-center sm:text-right">
                <div className="text-2xl font-black text-[#00f0ff] font-mono">{displayCandidate.fspRating} ELO</div>
                <div className="text-[10px] text-yellow-400 font-bold uppercase">
                  {displayCandidate.achievements?.[0]?.badge || (candidateLvl.isInTop ? 'Призер ФСП РФ' : 'Квалификационный дивизион ФСП')}
                </div>
              </div>
            </div>

            {/* AI-Generated Technical Portrait Box */}
            <div className="rounded-2xl bg-[#090d22] border border-purple-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span>AI-Summary технического профиля</span>
                </div>
                <span className="text-[10px] text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md font-bold">
                  Чистота кода: {displayCandidate.aiSummary?.codeCleanlinessScore || 98}/100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-[#060917]/70 p-4 rounded-xl border border-purple-500/20">
                «{displayCandidate.aiSummary?.summaryText || (isIvan 
                  ? `Java-разработчик (@ipesterev) с 5 годами опыта и спортивным рейтингом ${displayCandidate.fspRating} ELO. Стек: Java, Spring Boot, PostgreSQL, Docker, REST API. Профиль верифицирован через hh.ru (120 000 ₽ на руки, удаленно).`
                  : 'Высококлассный системный архитектор с безупречным алгоритмическим бэкграундом. Решает задачи уровня Hard за среднее время 18 минут.')}»
              </p>

              {/* Key strengths tag pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                {displayCandidate.aiSummary?.keyStrengths && displayCandidate.aiSummary.keyStrengths.length > 0 ? (
                  displayCandidate.aiSummary.keyStrengths.map((str, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      ✓ {str}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      ✓ Опыт в разработке: 5 лет 1 месяц (Java-разработчик)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold">
                      ✓ Стек: Java, Spring Boot, PostgreSQL, Docker, REST API
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                      ✓ Желаемый оклад: 120 000 ₽ на руки (Удаленно)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400">
                Желаемый оклад: <strong className="text-emerald-400 font-mono text-base">{desiredSalaryStr}</strong> (на руки)
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onSelectRole('candidate')}
                  className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#1a254c] hover:bg-[#223268] text-xs font-bold text-slate-200 cursor-pointer"
                >
                  Профиль кандидата
                </button>
                <button
                  onClick={() => onSelectRole('employer')}
                  className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] text-white font-black text-xs shadow-md shadow-[#2b35ff]/30 hover:shadow-[#00f0ff]/40 cursor-pointer"
                >
                  Направить оффер →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР: ELO → РЫНОЧНАЯ ВИЛКА В РУБЛЯХ */}
      {/* ========================================================================= */}
      <section id="calculator-section" className="relative z-10 py-16 bg-[#04060e] border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl glass-card-pro border border-cyan-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Метрика рыночной стоимости</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Калькулятор: ELO ФСП → Зарплатная вилка в ₽
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Интерактивный расчет зарплатного потенциала на основе спортивного рейтинга
                </p>
              </div>

              <div className="text-right sm:shrink-0 bg-white/[0.03] px-4 py-2.5 rounded-2xl border border-white/[0.08]">
                <div className="text-xs text-slate-400 font-medium">Текущий рейтинг</div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-tight">{eloSlider} ELO</div>
              </div>
            </div>

            {/* Slider Component */}
            <div className="space-y-3">
              <input
                type="range"
                min="1200"
                max="3000"
                step="50"
                value={eloSlider}
                onChange={(e) => setEloSlider(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1200 (Junior)</span>
                <span>1800 (Middle)</span>
                <span>2400 (КМС / Senior)</span>
                <span>2800+ (МС РФ / Lead)</span>
              </div>
            </div>

            {/* Result display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase mb-1">Рыночная вилка</div>
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                  {currentCalc.min.toLocaleString('ru-RU')} – {currentCalc.max.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase mb-1">Спортивный разряд</div>
                <div className="text-xs sm:text-sm font-bold text-amber-300">
                  {currentCalc.rank}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase mb-1">Грейд разработчика</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300">
                  {currentCalc.grade}
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06]">
              <span className="text-xs text-slate-400 text-center sm:text-left">
                Задачи в Арене оцениваются динамически по времени исполнения и чистоте кода
              </span>
              <button
                onClick={() => onSelectRole('arena')}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl btn-wow-primary text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 group"
              >
                <span>Подтвердить свой ELO в Арене</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
