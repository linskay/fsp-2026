import React, { useState } from 'react';
import { 
  Home, 
  Code2, 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Cpu, 
  RefreshCcw,
  Trophy,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types';
import { FspLogo } from '../brand/FspLogo';

interface NotFoundPageProps {
  onNavigate: (role: UserRole) => void;
  onOpenOAuth?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigate,
  onOpenOAuth
}) => {
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  const runDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResult('Пинг серверов: 14ms | PostgreSQL: OK | Redis Cache: HIT | Маршрут: UNRESOLVED (404)');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 flex flex-col justify-between selection:bg-[#00f0ff]/30 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Ambient Cyber Lighting / Mesh Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#2b35ff]/25 via-[#00f0ff]/15 to-[#7c3aed]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 bg-[#2b35ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Top Header Navigation (DigitXall / Sferum Capsule Style) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer group flex items-center gap-2 select-none"
            title="На главную"
          >
            <FspLogo size="sm" variant="tricolor" showText={true} />
          </div>

          {/* Center Nav Capsules (like reference) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-xl shadow-lg">
            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              О платформе
            </button>
            <button
              onClick={() => onNavigate('candidate')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Спортсменам
            </button>
            <button
              onClick={() => onNavigate('employer')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Работодателям
            </button>
            <button
              onClick={() => onNavigate('arena')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#00f0ff] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Арена</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            {onOpenOAuth && (
              <button
                onClick={onOpenOAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 border border-white/[0.1] transition-all cursor-pointer backdrop-blur-md"
              >
                <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Войти через SSO</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:from-[#3a45ff] hover:to-[#22f2ff] text-white text-xs font-bold transition-all shadow-lg shadow-[#2b35ff]/30 cursor-pointer"
            >
              Главный экран
            </button>
          </div>

        </div>
      </header>

      {/* Main 404 Centerpiece */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 text-center max-w-4xl mx-auto w-full">
        
        {/* Error Code + Curly Bracket Expression (matches digitXall design: 404 { page not found }) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6">
          <h1 className="text-7xl sm:text-9xl md:text-[10rem] font-black tracking-tighter text-white font-mono leading-none drop-shadow-[0_10px_35px_rgba(43,53,255,0.4)]">
            404
          </h1>
          <div className="text-left font-mono sm:border-l sm:border-white/20 sm:pl-6 space-y-1">
            <span className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-200 block">
              &#123; <span className="text-[#00f0ff]">страница не найдена</span> &#125;
            </span>
            <span className="text-xs sm:text-sm text-slate-400 block tracking-wide">
              ERR_CODE: SEGMENT_ROUTE_NOT_RESOLVED
            </span>
          </div>
        </div>

        {/* Informative Subtext in Russian */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
          Запрашиваемый URL-маршрут отсутствует в едином реестре платформы ФСП. Возможно, страница была перемещена, удалена или задача ещё ожидает компиляции.
        </p>

        {/* Primary Call to Action Pill Button (matches the screenshot's rounded-full pill) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={() => onNavigate('landing')}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#04060d] hover:bg-slate-100 font-bold text-sm transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer"
          >
            <span>На главную страницу</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onNavigate('arena')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0a1126] hover:bg-[#121c3d] text-[#00f0ff] hover:text-white font-semibold text-sm border border-[#2b35ff]/50 transition-all shadow-md shadow-[#2b35ff]/20 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-[#00f0ff]" />
            <span>В Арену задач</span>
          </button>
        </div>

        {/* Quick Route Cards (Sferum / Cyber style) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mb-8">
          
          <div 
            onClick={() => onNavigate('candidate')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#00f0ff]/40 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2 text-[#00f0ff] mb-1.5">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Спортсменам</span>
            </div>
            <p className="text-xs text-slate-300">
              Личный кабинет, ELO-рейтинг и приглашения от компаний
            </p>
          </div>

          <div 
            onClick={() => onNavigate('employer')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#2b35ff]/60 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Работодателям</span>
            </div>
            <p className="text-xs text-slate-300">
              Каталог верифицированных кандидатов и публикация вакансий
            </p>
          </div>

          <div 
            onClick={() => onNavigate('arena')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-400/40 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2 text-amber-400 mb-1.5">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">ФСП Турниры</span>
            </div>
            <p className="text-xs text-slate-300">
              Решение задач LeetCode Hard и повышение спортивного разряда
            </p>
          </div>

        </div>

        {/* Live System Diagnostics Tool */}
        <div className="w-full max-w-lg">
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#070b18] rounded-xl border border-white/[0.08] text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
            <span>FSP_KERNEL: 2026.4-LTS</span>
            <span className="text-slate-600">•</span>
            <button
              onClick={runDiagnostic}
              disabled={isDiagnosticRunning}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCcw className={`w-3 h-3 ${isDiagnosticRunning ? 'animate-spin text-[#00f0ff]' : ''}`} />
              <span>{isDiagnosticRunning ? 'Тестирование...' : 'Пинг системы'}</span>
            </button>
          </div>

          {diagnosticResult && (
            <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-fade-in">
              {diagnosticResult}
            </div>
          )}
        </div>

      </main>

      {/* Footer (matches digitXall footer copyright) */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span>© 2026 Федерация спортивного программирования России (ФСП РФ)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Минспорт РФ</span>
            <span>•</span>
            <span>Минцифры РФ</span>
            <span>•</span>
            <span>Защита персональных данных</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
