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
  Star
} from 'lucide-react';
import { UserRole } from '../../types';
import { FspLogo, FspStarIcon } from '../brand/FspLogo';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenOAuth: (provider?: 'github' | 'hh' | 'yandex') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenOAuth
}) => {
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
    <div className="relative overflow-hidden bg-[#060813] text-slate-100 font-['JetBrains_Mono'] selection:bg-[#2b35ff] selection:text-white">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[750px] h-[750px] bg-[#2b35ff]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-72 right-10 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[1400px] left-10 w-[650px] h-[650px] bg-[#ff2b42]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(43, 53, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 53, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ========================================================================= */}
      {/* 2.1 ВНУТРЕННИЙ МИНИ-ХЕДЕР НАВИГАЦИИ ПО ЛЕНДИНГУ */}
      {/* ========================================================================= */}
      <div className="border-b border-[#141d38]/80 bg-[#070b1a]/90 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Quick Section Nav Links */}
          <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto text-xs font-bold text-slate-400">
            <button 
              onClick={() => scrollToSection('hero-section')}
              className="px-3 py-1 rounded-lg hover:text-[#00f0ff] hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              О платформе
            </button>
            <button 
              onClick={() => {
                setHeroRole('candidate');
                scrollToSection('hero-section');
              }}
              className="px-3 py-1 rounded-lg hover:text-[#00f0ff] hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              Для кандидатов
            </button>
            <button 
              onClick={() => {
                setHeroRole('employer');
                scrollToSection('hero-section');
              }}
              className="px-3 py-1 rounded-lg hover:text-[#ff2b42] hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              Для работодателей
            </button>
            <button 
              onClick={() => scrollToSection('bento-grid')}
              className="px-3 py-1 rounded-lg hover:text-yellow-400 hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              Bento Grid Мозаика
            </button>
            <button 
              onClick={() => scrollToSection('calculator-section')}
              className="px-3 py-1 rounded-lg hover:text-emerald-400 hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              Калькулятор ELO
            </button>
            <button 
              onClick={() => scrollToSection('live-profile-demo')}
              className="px-3 py-1 rounded-lg hover:text-purple-400 hover:bg-[#101833] transition-colors whitespace-nowrap"
            >
              AI-Summary Демо
            </button>
          </div>

          {/* Action Triggers: [Войти] & [Регистрация] */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenOAuth()}
              className="px-3 py-1 rounded-xl bg-[#121b36] hover:bg-[#1a274e] border border-[#2b35ff]/40 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden sm:inline">Быстрый</span> Войти
            </button>
            <button
              onClick={() => {
                onOpenOAuth('github');
              }}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] text-white text-xs font-bold shadow-md shadow-[#2b35ff]/30 hover:shadow-[#00f0ff]/40 transition-all cursor-pointer"
            >
              Регистрация
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.2 ИНТЕРАКТИВНАЯ HERO-СЕКЦИЯ (ПЕРВЫЙ ЭКРАН С «ВАУ-ЭФФЕКТОМ») */}
      {/* ========================================================================= */}
      <section id="hero-section" className="relative z-10 pt-10 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Official Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a112c] border border-[#2b35ff]/50 shadow-[0_0_25px_rgba(43,53,255,0.3)] text-xs text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-black text-[#00f0ff]">ФСП РФ</span>
            <span className="text-slate-500">|</span>
            <span>Официальная платформа Федерации спортивного программирования</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d142b]/80 border border-slate-700/60 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Верификация 152-ФЗ РФ & Keycloak SSO</span>
          </div>
        </div>

        {/* Hero Title (H1) & Subtitle according to ТЗ */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            FSP Career Arena — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#4d6aff] to-[#ff2b42] drop-shadow-[0_0_35px_rgba(43,53,255,0.4)]">
              ИТ-найм нового поколения
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Платформа обратного подбора ИТ-специалистов с верифицированным профилем достижений Федерации спортивного программирования.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ИНТЕРАКТИВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ (ROLE SWITCHER) */}
        {/* ========================================================================= */}
        <div className="mt-8 flex justify-center">
          <div className="p-1.5 rounded-2xl bg-[#090e24] border-2 border-[#2b35ff]/50 shadow-[0_0_30px_rgba(43,53,255,0.25)] inline-flex items-center gap-2">
            <button
              onClick={() => setHeroRole('candidate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                heroRole === 'candidate'
                  ? 'bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] text-white shadow-lg shadow-[#2b35ff]/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-[#121b38]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Я — Кандидат / Разработчик</span>
            </button>

            <button
              onClick={() => setHeroRole('employer')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                heroRole === 'employer'
                  ? 'bg-gradient-to-r from-[#ff2b42] to-[#b31427] text-white shadow-lg shadow-[#ff2b42]/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-[#121b38]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Я — Работодатель / HR</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Role Workspace Display */}
        <div className="mt-8 max-w-5xl mx-auto">
          {heroRole === 'candidate' ? (
            /* CANDIDATE HERO INTERACTIVE PREVIEW & OAUTH */
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0a112c]/95 border-2 border-[#2b35ff]/60 shadow-[0_0_40px_rgba(43,53,255,0.25)] backdrop-blur-xl relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Info & OAuth Entry */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2b35ff]/30 text-[#00f0ff] text-[11px] font-bold uppercase">
                      Режим соискателя
                    </span>
                    <span className="text-xs text-slate-400">Верификация в 1 клик</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Конвертируй свой рейтинг ELO и код с GitHub в лучшие карьерные предложения
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Никаких сотен холодных откликов. Компании сами присылают офферы с конкретной рублевой вилкой на основе ваших спортивных достижений.
                  </p>

                  {/* OAuth Actions */}
                  <div className="space-y-2.5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          onOpenOAuth('github');
                          onSelectRole('candidate');
                        }}
                        className="py-3 px-4 rounded-xl bg-[#1e293b] hover:bg-[#2c3b52] border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
                      >
                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Войти через GitHub</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenOAuth('hh');
                          onSelectRole('candidate');
                        }}
                        className="py-3 px-4 rounded-xl bg-[#16213e] hover:bg-[#1e2e56] border border-[#2b35ff]/40 text-[#00f0ff] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#ff2b42] flex items-center justify-center text-[9px] font-black text-white">
                          hh
                        </div>
                        <span>Яндекс ID / hh.ru</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectRole('candidate')}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:from-[#3b47ff] hover:to-[#1de9b6] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2b35ff]/30 cursor-pointer"
                    >
                      <span>Перейти в кабинет кандидата (Александр Белов, ELO 2740)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Live Interactive Esports Profile Card */}
                <div className="lg:col-span-6 rounded-2xl bg-[#070b1c] border border-[#2b35ff]/50 p-5 shadow-2xl relative space-y-4">
                  
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                          alt="Александр Белов" 
                          className="w-12 h-12 rounded-xl object-cover border border-[#00f0ff]"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#070b1c] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">Александр Белов</h4>
                          <span className="px-1.5 py-0.5 rounded bg-[#2b35ff]/30 text-[#00f0ff] text-[10px] font-bold">
                            МС РФ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Lead Java / Highload Engineer</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-[#00f0ff] font-mono">2740 ELO</div>
                      <div className="text-[9px] text-emerald-400 font-bold">TOP 0.1% В РФ</div>
                    </div>
                  </div>

                  {/* GitHub & Verification Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-[#0a1128] border border-slate-800">
                      <div className="font-bold text-white font-mono">1,842</div>
                      <div className="text-[9px] text-slate-400">GitHub коммитов</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0a1128] border border-slate-800">
                      <div className="font-bold text-yellow-400 font-mono">24 победы</div>
                      <div className="text-[9px] text-slate-400">Турниры ФСП</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0a1128] border border-slate-800">
                      <div className="font-bold text-emerald-400 font-mono">480 000 ₽</div>
                      <div className="text-[9px] text-slate-400">Ожидаемый оклад</div>
                    </div>
                  </div>

                  {/* Incoming Offer Pill */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#091a14] to-[#071324] border border-emerald-500/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        ₽
                      </div>
                      <div>
                        <div className="font-bold text-white">Входящий оффер: СберТех</div>
                        <div className="text-[10px] text-emerald-400 font-bold">520 000 ₽ (на руки) • Remote</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ждет ответа
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ) : (
            /* EMPLOYER HERO INTERACTIVE PREVIEW & OAUTH */
            <div className="rounded-3xl p-6 sm:p-8 bg-[#110a1c]/95 border-2 border-[#ff2b42]/60 shadow-[0_0_40px_rgba(255,43,66,0.2)] backdrop-blur-xl relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff2b42]/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Info & Employer Action */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#ff2b42]/30 text-[#ff2b42] text-[11px] font-bold uppercase">
                      Режим работодателя
                    </span>
                    <span className="text-xs text-slate-400">Прямой поиск по ELO</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Никаких слепых откликов. Выбирай проверенных разработчиков с подтвержденными навыками
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Доступ к категоризированной базе спортивных программистов России. Просматривайте реальные метрики, чистоту кода и отправляйте оффер в 1 клик.
                  </p>

                  {/* Employer Actions */}
                  <div className="space-y-2.5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onSelectRole('employer')}
                        className="py-3 px-4 rounded-xl bg-[#ff2b42] hover:bg-[#ff4458] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
                      >
                        <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Войти как компания</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenOAuth('hh');
                          onSelectRole('employer');
                        }}
                        className="py-3 px-4 rounded-xl bg-[#1e132b] hover:bg-[#2a1a3c] border border-[#ff2b42]/40 text-[#ff7888] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#ff2b42] flex items-center justify-center text-[9px] font-black text-white">
                          hh
                        </div>
                        <span>hh.ru для бизнеса</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectRole('employer')}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff2b42] to-[#ff6b7d] hover:from-[#ff4155] hover:to-[#ff2b42] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff2b42]/30 cursor-pointer"
                    >
                      <span>Открыть HR-панель поиска (База 50 000+ атлетов)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Employer HR Filter & Candidate Bank Preview */}
                <div className="lg:col-span-6 rounded-2xl bg-[#090610] border border-[#ff2b42]/40 p-5 shadow-2xl relative space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#ff2b42]" />
                      <span className="text-xs font-bold text-white">Фильтр базы соискателей</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">1,480 найдено</span>
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-1 rounded-md bg-[#ff2b42]/20 text-[#ff8090] font-bold">
                      ELO ≥ 2400 (КМС / МС)
                    </span>
                    <span className="px-2 py-1 rounded-md bg-[#2b35ff]/20 text-blue-300 font-bold">
                      Java 21 / Highload
                    </span>
                    <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                      Вилка 350-500k ₽
                    </span>
                  </div>

                  {/* Candidate list item preview */}
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-[#120a1c] border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#ff2b42]/20 text-[#ff2b42] font-black flex items-center justify-center text-xs">
                          2740
                        </div>
                        <div>
                          <div className="font-bold text-white">Александр Б. (Мастер спорта)</div>
                          <div className="text-[10px] text-slate-400">Senior Java • Москва / Remote</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectRole('employer')}
                        className="px-2.5 py-1 rounded-lg bg-[#ff2b42] text-white text-[10px] font-bold hover:bg-[#ff4458]"
                      >
                        Оффер →
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#120a1c] border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-xs">
                          2520
                        </div>
                        <div>
                          <div className="font-bold text-white">Екатерина М. (КМС)</div>
                          <div className="text-[10px] text-slate-400">Fullstack / React + Go • СПБ</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectRole('employer')}
                        className="px-2.5 py-1 rounded-lg bg-[#ff2b42] text-white text-[10px] font-bold hover:bg-[#ff4458]"
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
      {/* 2.3 СЕТКА ПРЕИМУЩЕСТВ (BENTO GRID МОЗАИКА) */}
      {/* ========================================================================= */}
      <section id="bento-grid" className="relative z-10 py-16 lg:py-24 bg-[#050711] border-t border-[#141d38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Bento Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase bg-[#2b35ff]/15 px-3 py-1 rounded-full border border-[#2b35ff]/30">
              BENTO GRID МОЗАИКА
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Технологическое превосходство платформы
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Вместо скучной стены текста — интерактивные модули и верифицированные инструменты
            </p>
          </div>

          {/* BENTO GRID CONTAINER (4 MAIN TILES) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* ПЛИТКА №1 (Обратная механика найма) - Large 7 cols */}
            <div className="md:col-span-7 rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#2b35ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(43,53,255,0.2)] flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#2b35ff]/20 border border-[#2b35ff]/40 flex items-center justify-center text-[#00f0ff]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#2b35ff]/20 text-[#00f0ff] text-[10px] font-bold">
                    МЕХАНИКА №1
                  </span>
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
                    <div className="font-bold text-yellow-400 text-[11px]">3. 152-ФЗ контакт</div>
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
            <div className="md:col-span-5 rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#00f0ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(0,240,255,0.2)] flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-yellow-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold">
                    МЕХАНИКА №2
                  </span>
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
            <div className="md:col-span-6 rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#2b35ff] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(43,53,255,0.2)] flex flex-col justify-between group relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    МЕХАНИКА №3 • ИНТЕРАКТИВНЫЙ ТЕСТ
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">
                  LeetCode & Judge0 Алгоритмическая Песочница
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Изолированное тестирование в Docker-песочнице. Попробуйте нажать <strong>«Запустить тест»</strong> прямо сейчас:
                </p>

                {/* Mini Code Terminal */}
                <div className="rounded-2xl bg-[#060914] border border-slate-800 p-3 font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1.5">
                    <span>Task: Max Flow (Dinic Algo)</span>
                    <span className="text-[#00f0ff]">Java 21 / Judge0 CE</span>
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
            <div className="md:col-span-6 rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#ff2b42] transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(255,43,66,0.2)] flex flex-col justify-between group relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff2b42]/20 border border-[#ff2b42]/40 flex items-center justify-center text-[#ff2b42]">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#ff2b42]/20 text-[#ff2b42] text-[10px] font-bold">
                    МЕХАНИКА №4 • ЧЕСТНЫЕ УСЛОВИЯ
                  </span>
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
                <span className="text-slate-400">Бэкенд-валидация Jakarta Bean</span>
                <span className="text-emerald-400 font-bold">100% контроль</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.4 ИНТЕРАКТИВНОЕ ДЕМО / LIVE-ВИДЖЕТ ПРОФИЛЯ С AI-SUMMARY */}
      {/* ========================================================================= */}
      <section id="live-profile-demo" className="relative z-10 py-16 lg:py-24 bg-[#060a1c] border-t border-[#141d38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-purple-400 tracking-widest uppercase bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
              ИНТЕРАКТИВНЫЙ LIVE-ВИДЖЕТ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              AI-Summary & Цифровой профиль спортсмена ФСП
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Глубокая ИИ-аналитика кода, стиля решений, алгоритмической сложности и практического опыта
            </p>
          </div>

          {/* Live Developer Profile Card with AI Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0c1432] to-[#070c1e] border-2 border-[#2b35ff]/50 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header: Candidate Info & ELO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" 
                  alt="Александр Белов" 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00f0ff] shadow-lg shadow-[#00f0ff]/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">Александр Белов</h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#2b35ff]/40 text-[#00f0ff] text-xs font-bold">
                      Мастер спорта РФ
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Lead Java / Highload Engineer • Москва / Remote</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>GitHub: @alex-belov-fsp</span>
                    <span>•</span>
                    <span className="text-emerald-400">152-ФЗ Верифицирован</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#060917] border border-[#2b35ff]/40 text-center sm:text-right">
                <div className="text-2xl font-black text-[#00f0ff] font-mono">2740 ELO</div>
                <div className="text-[10px] text-yellow-400 font-bold uppercase">Кубок России 2024 (1 место)</div>
              </div>
            </div>

            {/* AI-Generated Technical Portrait Box */}
            <div className="rounded-2xl bg-[#090d22] border border-purple-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span>AI-Summary профиля (LLM YandexGPT Pro / Gemini 2.5)</span>
                </div>
                <span className="text-[10px] text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md font-bold">
                  Чистота кода: 98/100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-[#060917]/70 p-4 rounded-xl border border-purple-500/20">
                «Высококлассный системный архитектор с безупречным алгоритмическим бэкграундом. Решает задачи уровня Hard за среднее время 18 минут. В кодовой базе на GitHub преобладают многопоточные распределенные сервисы на Java 21, Spring Boot 3 и Kafka с минимальным memory footprint и доказанной алгоритмической сложностью O(V+E). Рекомендуется на позиции Lead / Principal Highload Engineer.»
              </p>

              {/* Key strengths tag pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  ✓ Оптимизация GC и Lock-free структуры
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold">
                  ✓ Динамическое программирование и графы
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                  ✓ Архитектура распределенных брокеров (Kafka/gRPC)
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400">
                Желаемый оклад: <strong className="text-emerald-400 font-mono text-base">480 000 ₽</strong> (на руки)
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
      <section id="calculator-section" className="relative z-10 py-16 bg-[#04060e] border-t border-[#141d38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-gradient-to-r from-[#0b122c] via-[#080d22] to-[#0b122c] border-2 border-[#2b35ff]/40 p-6 sm:p-10 shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider">Интерактивный расчет</span>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                Калькулятор: ELO рейтинг ФСП → Рыночная вилка в ₽
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Потяните ползунок, чтобы увидеть среднюю вилку оклада и спортивный разряд разработчика
              </p>
            </div>

            {/* Slider Component */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-400">Рейтинг соискателя:</span>
                <span className="text-2xl font-black text-[#00f0ff] font-mono">{eloSlider} ELO</span>
              </div>

              <input
                type="range"
                min="1200"
                max="3000"
                step="50"
                value={eloSlider}
                onChange={(e) => setEloSlider(Number(e.target.value))}
                className="w-full h-3 bg-[#060814] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1200 ELO (Junior)</span>
                <span>2000 ELO (I разряд)</span>
                <span>2400 ELO (КМС)</span>
                <span>2800+ ELO (Мастер спорта)</span>
              </div>
            </div>

            {/* Result display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#060917] border border-[#1e2a4a] text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Рекомендуемая вилка</div>
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                  {currentCalc.min.toLocaleString('ru-RU')} – {currentCalc.max.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#060917] border border-[#1e2a4a] text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Спортивный разряд ФСП</div>
                <div className="text-sm sm:text-base font-black text-yellow-400 font-mono">
                  {currentCalc.rank}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#060917] border border-[#1e2a4a] text-center">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Квалификационный грейд</div>
                <div className="text-sm sm:text-base font-black text-[#00f0ff] font-mono">
                  {currentCalc.grade}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
