import React, { useState } from 'react';
import { Trophy, Award, Flame, Target, ChevronRight, ChevronDown, Sparkles, Zap, Shield, ArrowUpRight } from 'lucide-react';

export interface EloTier {
  id: string;
  name: string;
  shortName: string;
  minElo: number;
  maxElo: number;
  badgeColor: string;
  gradient: string;
  description: string;
  perks: string[];
}

export const FSP_ELO_TIERS: EloTier[] = [
  {
    id: 'junior',
    name: 'Начинающий спортсмен (Junior)',
    shortName: 'Junior',
    minElo: 0,
    maxElo: 1399,
    badgeColor: 'text-slate-400 border-slate-700 bg-slate-800/50',
    gradient: 'from-slate-600 to-slate-400',
    description: 'Базовые алгоритмы и структуры данных (линейный поиск, простые циклы, базовые типы)',
    perks: ['Участие в открытых квалификациях', 'Рейтинг в студенческой лиге']
  },
  {
    id: 'rank3',
    name: '3-й спортивный разряд',
    shortName: '3-й разряд',
    minElo: 1400,
    maxElo: 1699,
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    gradient: 'from-blue-600 to-cyan-400',
    description: 'Бинарный поиск, сортировки, жадные алгоритмы, основы ООП и вычислительной сложности',
    perks: ['Внесение в реестр спортсменов региона', 'Приоритет на стажировках']
  },
  {
    id: 'rank2',
    name: '2-й спортивный разряд',
    shortName: '2-й разряд',
    minElo: 1700,
    maxElo: 1999,
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    gradient: 'from-teal-500 to-emerald-400',
    description: 'Деревья отрезков, динамическое программирование (1D/2D), графы (BFS, DFS, Дейкстра)',
    perks: ['Участие в полуфиналах Кубка России', 'Прямые офферы от аккредитованных ИТ-компаний']
  },
  {
    id: 'rank1',
    name: '1-й спортивный разряд',
    shortName: '1-й разряд',
    minElo: 2000,
    maxElo: 2399,
    badgeColor: 'text-cyan-400 border-[#00f0ff]/30 bg-[#00f0ff]/10',
    gradient: 'from-[#2b35ff] to-[#00f0ff]',
    description: 'Сложное ДП по профилю, алгоритмы на строках (Ахо-Корасик, Z-функция), Heavy-Light декомпозиция',
    perks: ['Гарантированная вилка от 250 000 ₽', 'Участие в Высшей лиге ФСП']
  },
  {
    id: 'candidate_master',
    name: 'Кандидат в мастера спорта (КМС)',
    shortName: 'КМС РФ',
    minElo: 2400,
    maxElo: 2699,
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/15',
    gradient: 'from-purple-600 via-[#2b35ff] to-[#00f0ff]',
    description: 'Максимальные потоки (Диниц), суффиксные автоматы, Fast Fourier Transform, Lock-free алгоритмы',
    perks: ['Официальное звание Минспорта РФ', 'Претендент на сборную региона', 'Вилка 350 000+ ₽']
  },
  {
    id: 'master',
    name: 'Мастер спорта России (МС)',
    shortName: 'МС РФ',
    minElo: 2700,
    maxElo: 2999,
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/15',
    gradient: 'from-amber-500 via-[#ff2b42] to-[#2b35ff]',
    description: 'Топовый олимпиадный и системный уровень. Решение Hard задач за <20 мин. Архитектура Highload и distributed consensus',
    perks: ['Удостоверение Мастера спорта РФ', 'Сборная России', 'Индивидуальные контракты от 500 000 ₽']
  },
  {
    id: 'grandmaster',
    name: 'Гроссмейстер / Чемпион РФ (Grandmaster)',
    shortName: 'Grandmaster',
    minElo: 3000,
    maxElo: 3500,
    badgeColor: 'text-rose-400 border-rose-500/50 bg-rose-500/20',
    gradient: 'from-[#ff2b42] via-purple-600 to-[#00f0ff]',
    description: 'Элита спортивного программирования мирового уровня (Top 0.01%). Чемпионы международных и всероссийских финалов',
    perks: ['Национальная сборная РФ', 'Грантовая поддержка Минцифры', 'Senior Principal / Lead Architect роли']
  }
];

interface EloTierProgressBarProps {
  currentElo: number;
  onOpenArena?: () => void;
  className?: string;
}

export const EloTierProgressBar: React.FC<EloTierProgressBarProps> = ({
  currentElo,
  onOpenArena,
  className = ''
}) => {
  const [isLadderExpanded, setIsLadderExpanded] = useState(false);

  // Determine current and next tier
  const currentTierIndex = FSP_ELO_TIERS.findIndex(
    tier => currentElo >= tier.minElo && currentElo <= tier.maxElo
  );

  const safeCurrentIndex = currentTierIndex !== -1 ? currentTierIndex : FSP_ELO_TIERS.length - 1;
  const currentTier = FSP_ELO_TIERS[safeCurrentIndex];
  const nextTier = safeCurrentIndex < FSP_ELO_TIERS.length - 1 ? FSP_ELO_TIERS[safeCurrentIndex + 1] : null;

  // Calculate progress inside current tier
  let progressPercent = 100;
  let eloToNextTier = 0;

  if (nextTier) {
    const tierRange = nextTier.minElo - currentTier.minElo;
    const progressInTier = Math.max(0, currentElo - currentTier.minElo);
    progressPercent = Math.min(100, Math.max(0, Math.round((progressInTier / tierRange) * 100)));
    eloToNextTier = Math.max(0, nextTier.minElo - currentElo);
  }

  // Estimated tasks or arena matches needed
  const averageEloPerHardTask = 85;
  const hardTasksNeeded = nextTier ? Math.max(1, Math.ceil(eloToNextTier / averageEloPerHardTask)) : 0;

  return (
    <div className={`rounded-2xl sm:rounded-3xl bg-[#0a0f24] border border-[#1b2648] p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      
      {/* Background neon ambient highlight */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2b35ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Current Rank Badge & Next Goal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0e1635] border border-[#2b35ff]/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.15)] shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Спортивный разряд ФСП
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${currentTier.badgeColor}`}>
                {currentTier.shortName}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {currentTier.name}
            </h3>
          </div>
        </div>

        {/* ELO Counter Display */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#070b1a] border border-[#2b35ff]/40 text-right">
            <div className="text-lg sm:text-xl font-black text-[#00f0ff] font-mono leading-none">
              {currentElo} <span className="text-xs font-normal text-slate-400">ELO</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              {nextTier ? `+${eloToNextTier} ELO до ${nextTier.shortName}` : 'Максимальный ранг'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Progress Bar Container */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Текущий рубеж:</span>
            <span className="text-white font-mono">{currentTier.minElo} ELO</span>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            {nextTier ? (
              <>
                <span className="text-slate-400">Цель:</span>
                <span className="text-amber-400 font-mono font-black">{nextTier.minElo} ELO ({nextTier.shortName})</span>
              </>
            ) : (
              <span className="text-emerald-400 font-mono">Абсолютный Гроссмейстер</span>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-4 sm:h-5 bg-[#060916] rounded-full p-1 border border-slate-800/80 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${currentTier.gradient} shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-700 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Percentage & Delta Sub-label */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Прогресс разряда: <strong className="text-white font-mono">{progressPercent}%</strong></span>
          {nextTier && (
            <span className="text-slate-300">
              Осталось набрать: <strong className="text-[#00f0ff] font-mono font-bold">{eloToNextTier} ELO</strong>
            </span>
          )}
        </div>
      </div>

      {/* Quick Action & Milestone Tip */}
      {nextTier && (
        <div className="p-3.5 rounded-xl bg-[#070b1a] border border-[#162038] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-[#2b35ff]/20 text-[#00f0ff] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400">Рекомендация: </span>
              <span>Решите еще <strong className="text-amber-300 font-mono font-bold">~{hardTasksNeeded}</strong> задач уровня Hard или выиграйте 1 матч в Арене для перехода в <strong className="text-white">{nextTier.name}</strong></span>
            </div>
          </div>

          {onOpenArena && (
            <button
              onClick={onOpenArena}
              className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:from-[#3b47ff] hover:to-[#1de9b6] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>В Арену (+85 ELO)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Expandable Tier Ladder (Весь путь спортсмена ФСП) */}
      <div className="pt-1 border-t border-slate-800/60 relative z-10">
        <button
          onClick={() => setIsLadderExpanded(!isLadderExpanded)}
          className="w-full flex items-center justify-between py-1 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Все спортивные разряды и нормативы ФСП РФ</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#00f0ff]">
            {isLadderExpanded ? 'Скрыть таблицу' : 'Показать разряды'}
            {isLadderExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        </button>

        {isLadderExpanded && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 animate-fadeIn">
            {FSP_ELO_TIERS.map((tier, idx) => {
              const isCurrent = tier.id === currentTier.id;
              const isPassed = currentElo > tier.maxElo;

              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isCurrent
                      ? 'bg-[#0f1738] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : isPassed
                      ? 'bg-[#070b18] border-emerald-500/30 text-slate-400 opacity-80'
                      : 'bg-[#070b18] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">#{idx + 1}</span>
                      <span className="font-black text-white text-[11px]">{tier.shortName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">
                      {tier.minElo}–{tier.maxElo === 3500 ? '3000+' : tier.maxElo} ELO
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    {tier.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    {isCurrent ? (
                      <span className="text-[#00f0ff] font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        Ваш текущий ранг
                      </span>
                    ) : isPassed ? (
                      <span className="text-emerald-400 font-bold">✓ Выполнено</span>
                    ) : (
                      <span className="text-slate-500">Предстоит выполнить</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
