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
  Briefcase
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
  const [eloSlider, setEloSlider] = useState<number>(2400);
  const [activeTab, setActiveTab] = useState<'benefits' | 'calculator' | 'comparison' | 'fsp_stats'>('benefits');

  // Dynamic salary calculation based on ELO
  const calculateSalary = (elo: number) => {
    let min = Math.round((120000 + (elo - 1200) * 230) / 10000) * 10000;
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

  return (
    <div className="relative overflow-hidden bg-[#060813] text-slate-100 font-['JetBrains_Mono']">
      
      {/* Dynamic Ambient Glows & Cyber Grid */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-[#2b35ff]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[550px] h-[550px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[600px] h-[600px] bg-[#ff2b42]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Cyber Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(43, 53, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 53, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* ========================================================================= */}
      {/* 2.1 HERO-СЕКЦИЯ (ПЕРВЫЙ ЭКРАН) */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-8 pb-16 lg:pt-12 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Official Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1026] border border-[#2b35ff]/40 shadow-[0_0_20px_rgba(43,53,255,0.25)] text-xs text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#00f0ff]">ФСП РФ</span>
            <span className="text-slate-400">|</span>
            <span>Официальная платформа спортивного программирования</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a]/80 border border-slate-700/60 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Верификация 152-ФЗ и Keycloak SSO</span>
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
            Цифровая платформа-агрегатор с верифицированным профилем достижений Федерации спортивного программирования России (ФСП).
          </p>

          {/* Key tags pill row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-[#0c142b] border border-[#2b35ff]/40 text-blue-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
              Обратная механика найма
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0c142b] border border-[#2b35ff]/40 text-blue-300 font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              Киберспортивный ELO рейтинг
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0c142b] border border-[#2b35ff]/40 text-blue-300 font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Обязательные рублевые вилки
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.2 ДВОЙНАЯ ТОЧКА ВХОДА (ИНТЕРАКТИВНЫЙ БЛОК ЛОГИНА И РЕГИСТРАЦИИ) */}
        {/* ========================================================================= */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {/* КАРТОЧКА А: Для кандидатов и разработчиков */}
          <div className="group relative rounded-3xl p-7 lg:p-8 bg-[#0a1128]/90 border-2 border-[#2b35ff]/50 hover:border-[#00f0ff] transition-all duration-300 shadow-[0_0_35px_rgba(43,53,255,0.2)] hover:shadow-[0_0_50px_rgba(0,240,255,0.3)] backdrop-blur-xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Corner Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2b35ff] to-[#00f0ff] p-0.5 shadow-lg shadow-[#2b35ff]/40">
                    <div className="w-full h-full bg-[#070c1e] rounded-[14px] flex items-center justify-center text-[#00f0ff]">
                      <Code2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#00f0ff] tracking-wider uppercase">Вход для соискателей</span>
                    <h3 className="text-xl lg:text-2xl font-black text-white">Для кандидатов и разработчиков</h3>
                  </div>
                </div>
              </div>

              {/* Description from ТЗ */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Конвертируй свой рейтинг ELO, победы в ФСП и код с GitHub в лучшие карьерные предложения.
              </p>

              {/* Feature bullets */}
              <div className="space-y-2 mb-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  <span>Верифицированный профиль спортсмена ФСП РФ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  <span>Никаких отказов: компании пишут первыми с готовым оффером</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  <span>Защита контактов по 152-ФЗ до принятия условий</span>
                </div>
              </div>
            </div>

            {/* Quick OAuth Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  onOpenOAuth('github');
                  onSelectRole('candidate');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1e293b] hover:bg-[#283548] border border-slate-700 hover:border-slate-500 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md group/btn"
              >
                <Github className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                <span>Войти через GitHub</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md ml-auto hidden sm:inline">
                  + импорт репо
                </span>
              </button>

              <button
                onClick={() => {
                  onOpenOAuth('hh');
                  onSelectRole('candidate');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#2b35ff] to-[#1e28c4] hover:from-[#3b47ff] hover:to-[#2b35ff] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-[#2b35ff]/30 hover:shadow-[#2b35ff]/50 group/btn"
              >
                <div className="w-5 h-5 rounded-full bg-[#ff2b42] flex items-center justify-center text-[10px] font-black">
                  hh
                </div>
                <span>Войти через Яндекс ID / hh.ru</span>
                <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <button
                  onClick={() => onSelectRole('candidate')}
                  className="text-xs text-slate-400 hover:text-[#00f0ff] transition-colors underline decoration-dashed"
                >
                  Открыть демо-кабинет кандидата (Александр Белов, ELO 2740) →
                </button>
              </div>
            </div>

          </div>

          {/* КАРТОЧКА Б: Для работодателей и HR */}
          <div className="group relative rounded-3xl p-7 lg:p-8 bg-[#0a1128]/90 border-2 border-[#ff2b42]/40 hover:border-[#ff2b42] transition-all duration-300 shadow-[0_0_35px_rgba(255,43,66,0.15)] hover:shadow-[0_0_50px_rgba(255,43,66,0.25)] backdrop-blur-xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Corner Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#ff2b42]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff2b42] to-[#2b35ff] p-0.5 shadow-lg shadow-[#ff2b42]/30">
                    <div className="w-full h-full bg-[#070c1e] rounded-[14px] flex items-center justify-center text-[#ff2b42]">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#ff2b42] tracking-wider uppercase">Вход для бизнеса</span>
                    <h3 className="text-xl lg:text-2xl font-black text-white">Для работодателей и HR</h3>
                  </div>
                </div>
              </div>

              {/* Description from ТЗ */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Никаких слепых откликов. Выбирай проверенных разработчиков с подтвержденными навыками и честными зарплатными вилками.
              </p>

              {/* Feature bullets */}
              <div className="space-y-2 mb-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff2b42] shrink-0" />
                  <span>Прямой поиск по рейтингу ELO и разрядам ФСП РФ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff2b42] shrink-0" />
                  <span>Гарантированный ответ: 87% кандидатов принимают оффер</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff2b42] shrink-0" />
                  <span>Синхронизация вакансий с hh.ru API и вашей ATS</span>
                </div>
              </div>
            </div>

            {/* Quick Employer Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onSelectRole('employer')}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ff2b42] to-[#b31427] hover:from-[#ff4155] hover:to-[#ff2b42] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-[#ff2b42]/25 hover:shadow-[#ff2b42]/40 group/btn"
              >
                <Building2 className="w-5 h-5 text-white" />
                <span>Войти как компания</span>
                <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onOpenOAuth('hh');
                  onSelectRole('employer');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#141d36] hover:bg-[#1a2648] border border-[#2b35ff]/40 text-blue-200 font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer group/btn"
              >
                <div className="w-5 h-5 rounded-full bg-[#ff2b42] flex items-center justify-center text-[10px] font-black text-white">
                  hh
                </div>
                <span>Авторизоваться через hh.ru для бизнеса</span>
                <span className="text-[10px] text-blue-300 bg-[#2b35ff]/30 px-2 py-0.5 rounded-md ml-auto hidden sm:inline">
                  + импорт вакансий
                </span>
              </button>

              <div className="text-center">
                <button
                  onClick={() => onSelectRole('employer')}
                  className="text-xs text-slate-400 hover:text-[#ff2b42] transition-colors underline decoration-dashed"
                >
                  Войти в демо-кабинет работодателя (СберТех / VK / Positive Tech) →
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Visual Sport-Tech Showcase Box */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1633] to-[#080d21] border border-[#2b35ff]/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(43,53,255,0.15)] relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#2b35ff]/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Live Esports Match Card */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#ff2b42]/20 border border-[#ff2b42]/40 text-[#ff2b42] text-[11px] font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  LIVE СОРЕВНОВАНИЯ ФСП РФ
                </span>
                <span className="text-xs text-slate-400">Кубок России 2026</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                Каждый коммит и выигранный раунд повышает твою стоимость на рынке
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Автоматическая связка рейтинга Codeforces / LeetCode / Чемпионатов ФСП с профилями ведущих ИТ-работодателей страны.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#060a17] border border-[#1b2648]">
                  <div className="text-xl sm:text-2xl font-black text-[#00f0ff]">2740</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold">TOP ELO РЕЙТИНГ</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#060a17] border border-[#1b2648]">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold">ЧЕСТНЫЕ ВИЛКИ</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#060a17] border border-[#1b2648]">
                  <div className="text-xl sm:text-2xl font-black text-[#ff2b42]">450+</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold">ИТ-КОМПАНИЙ</div>
                </div>
              </div>
            </div>

            {/* Right Column: Mini Interactive Arena Preview */}
            <div className="lg:col-span-5 rounded-2xl bg-[#060914] border border-[#2b35ff]/40 p-4 font-mono text-xs shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff2b42]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[10px] text-slate-400">Judge0 Sandbox • Java 21</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ACCEPTED (0.04s)</span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="text-slate-500">// FSP Algo Verification Engine</div>
                <div><span className="text-[#00f0ff]">public class</span> <span className="text-yellow-300">Solution</span> {'{'}</div>
                <div className="pl-3 text-slate-400">
                  <span className="text-[#2b35ff] font-bold">@FspVerified</span>(rank = <span className="text-emerald-400">"MS"</span>)
                </div>
                <div className="pl-3">
                  <span className="text-[#00f0ff]">public int</span> <span className="text-blue-300">maxFlowDinic</span>(...) {'{'}
                </div>
                <div className="pl-6 text-slate-400">// O(V^2 * E) Optimal Flow</div>
                <div className="pl-6 text-emerald-400 font-bold">return eloPointsEarned + 120;</div>
                <div className="pl-3">{'}'}</div>
                <div>{'}'}</div>
              </div>

              <button
                onClick={() => onSelectRole('arena')}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-[#2b35ff]/20 hover:bg-[#2b35ff]/40 border border-[#2b35ff]/50 text-[#00f0ff] font-bold text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Открыть LeetCode & ФСП Арену →</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. ИНФОРМАЦИОННЫЕ БЛОКИ НИЖЕ ГЛАВНОГО ЭКРАНА (ПРЕЗЕНТАЦИЯ ДЛЯ ЖЮРИ) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 lg:py-24 bg-[#050711] border-t border-[#141d38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase bg-[#2b35ff]/15 px-3 py-1 rounded-full border border-[#2b35ff]/30">
              ПРЕЗЕНТАЦИЯ ДЛЯ ЖЮРИ И ПАРТНЕРОВ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Три столпа платформы «FSP Career Arena»
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Революция в ИТ-рекрутменте: заменяем субъективные резюме объективными спортивными достижениями.
            </p>
          </div>

          {/* 3 Key Advantages from ТЗ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Преимущество 1: Обратная механика найма */}
            <div className="rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#2b35ff] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(43,53,255,0.2)] flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#2b35ff]/20 border border-[#2b35ff]/40 flex items-center justify-center text-[#00f0ff] mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>

                <div className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider mb-2">Механика №1</div>
                <h3 className="text-lg lg:text-xl font-black text-white mb-3">
                  Обратная механика найма
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Работодатель сам просматривает категоризированную базу и направляет приглашение конкретному специалисту, избавляя обе стороны от рутины.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>0% спама и бесконечных отказов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Готовый оффер сразу при первом контакте</span>
                </div>
              </div>
            </div>

            {/* Преимущество 2: Киберспортивный рейтинг (ELO) и ФСП */}
            <div className="rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#00f0ff] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                </div>

                <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Механика №2</div>
                <h3 className="text-lg lg:text-xl font-black text-white mb-3">
                  Киберспортивный рейтинг (ELO) и ФСП
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Объективное и проверяемое подтверждение практических навыков через олимпиады, хакатоны и алгоритмическое тестирование (интеграция с задачами LeetCode).
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Единый реестр спортсменов ФСП РФ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Разряды: МС, КМС, I/II спортивные разряды</span>
                </div>
              </div>
            </div>

            {/* Преимущество 3: Честные условия */}
            <div className="rounded-3xl p-7 bg-[#090f24] border border-[#1a284e] hover:border-[#ff2b42] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,43,66,0.2)] flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#ff2b42]/20 border border-[#ff2b42]/40 flex items-center justify-center text-[#ff2b42] mb-6 group-hover:scale-110 transition-transform">
                  <Scale className="w-7 h-7" />
                </div>

                <div className="text-xs font-bold text-[#ff2b42] uppercase tracking-wider mb-2">Механика №3</div>
                <h3 className="text-lg lg:text-xl font-black text-white mb-3">
                  Честные условия
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Обязательное указание вилки заработной платы («от-до» в рублях) в каждом приглашении и вакансии до начала общения.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Запрет публикации вакансий без вилки в рублях</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-400" />
                  <span>Бэкенд-валидация salaryFrom & salaryTo</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Calculator: ELO to Salary Estimation */}
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#0b122c] via-[#091024] to-[#0b122c] border border-[#2b35ff]/40 p-6 sm:p-10 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-6">
              
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

          {/* Comparison Table: Classic vs FSP Career Arena */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-[#080e22] border border-[#192548] p-6 sm:p-8">
            <h3 className="text-xl font-black text-white text-center mb-6">
              Сравнение: Классический найм vs «FSP Career Arena»
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">Критерий</th>
                    <th className="pb-3 font-bold text-red-400">Обычные сайты вакансий</th>
                    <th className="pb-3 font-bold text-[#00f0ff]">FSP Career Arena (Sport-Tech)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 font-bold text-white">Кто делает первый шаг</td>
                    <td className="py-3 text-red-300">Соискатель шлет сотни резюме впустую</td>
                    <td className="py-3 text-emerald-400 font-bold">Работодатель сразу шлет оффер с вилкой</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Подтверждение навыков</td>
                    <td className="py-3 text-red-300">Субъективные слова в резюме</td>
                    <td className="py-3 text-emerald-400 font-bold">Верифицированный ELO рейтинг ФСП РФ</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Зарплатная прозрачность</td>
                    <td className="py-3 text-red-300">«По результатам собеседования»</td>
                    <td className="py-3 text-emerald-400 font-bold">Обязательная вилка «от-до» в рублях</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Защита персональных данных</td>
                    <td className="py-3 text-red-300">Спам звонками и утечки номеров</td>
                    <td className="py-3 text-emerald-400 font-bold">152-ФЗ маскирование до согласия</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ФУТЕР И ЮРИДИЧЕСКИЕ ТРЕБОВАНИЯ (152-ФЗ) */}
      {/* ========================================================================= */}
      <footer className="relative z-10 bg-[#04060d] border-t border-[#131b33] pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Ministry affiliations */}
            <div className="md:col-span-2 space-y-4">
              <FspLogo size="lg" variant="tricolor" showText={true} />
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Официальная экосистема Общероссийской общественной организации «Федерация спортивного программирования» (ФСП РФ).
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#ff2b42]" />
                  При поддержке Минспорта РФ
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#2b35ff]" />
                  Минцифры России
                </span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Модули платформы</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onSelectRole('candidate')} className="hover:text-[#00f0ff] transition-colors">
                    Кабинет соискателя
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectRole('employer')} className="hover:text-[#00f0ff] transition-colors">
                    Кабинет работодателя
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectRole('arena')} className="hover:text-[#00f0ff] transition-colors">
                    LeetCode & ФСП Арена
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectRole('swagger')} className="hover:text-[#00f0ff] transition-colors">
                    REST API & Swagger
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: 152-ФЗ Legal Compliance Box */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#080d1e] border border-[#1e2a4a]">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Lock className="w-4 h-4" />
                <span>Защита данных (152-ФЗ)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Обработка персональных данных соискателей и представителей работодателей ведется в строгом соответствии с Федеральным законом № 152-ФЗ.
              </p>
              
              {/* Direct PDF Link from ТЗ */}
              <a
                href="https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] hover:underline font-bold pt-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Положение об обработке ПДн (.pdf)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Федерация спортивного программирования РФ. Все права защищены.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <a 
                href="https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                Политика конфиденциальности 152-ФЗ
              </a>
              <span>•</span>
              <span className="text-slate-400">Spring Boot 3 / Java 21 Backend</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
