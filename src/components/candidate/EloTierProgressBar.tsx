import React, { useState } from 'react';
import { 
  Trophy, Award, Flame, Target, ChevronRight, ChevronDown, 
  Sparkles, Zap, Shield, ArrowUpRight, CheckCircle2, AlertTriangle, 
  Lock, Unlock, HelpCircle 
} from 'lucide-react';
import { CandidateProfile, FspAchievement } from '../../types';
import { FSP_STANDARD_LEVELS, evaluateCandidateLevel, calculateCandidateAchievementPoints } from '../../utils/ratingEngine';

interface EloTierProgressBarProps {
  currentElo: number;
  candidate?: CandidateProfile;
  achievements?: FspAchievement[];
  solvedTasksCount?: number;
  onOpenArena?: () => void;
  className?: string;
}

export const EloTierProgressBar: React.FC<EloTierProgressBarProps> = ({
  currentElo,
  candidate,
  achievements: propAchievements,
  solvedTasksCount: propTasks,
  onOpenArena,
  className = ''
}) => {
  const [isLadderExpanded, setIsLadderExpanded] = useState(false);

  // Extract achievements and tasks count
  const achievements = propAchievements || candidate?.achievements || [];
  const achievementsCount = achievements.length;
  const lcSolved = candidate?.leetcodeStats?.totalSolved || 0;
  const arenaSolved = propTasks ?? candidate?.solvedTasksCount ?? 0;
  const totalTasks = lcSolved + arenaSolved;

  // Evaluate candidate level strictly based on achievements + ELO
  const levelDetails = evaluateCandidateLevel({
    elo: currentElo,
    achievements,
    solvedTasksCount: arenaSolved,
    leetcodeStats: candidate?.leetcodeStats
  });

  const currentLevelIndex = FSP_STANDARD_LEVELS.findIndex(
    lvl => lvl.levelNumber === levelDetails.levelNumber
  );

  const safeCurrentIndex = currentLevelIndex !== -1 ? currentLevelIndex : 0;
  const currentLevel = FSP_STANDARD_LEVELS[safeCurrentIndex];
  const nextLevel = safeCurrentIndex < FSP_STANDARD_LEVELS.length - 1 ? FSP_STANDARD_LEVELS[safeCurrentIndex + 1] : null;

  // Calculate honest progress inside current level (from currentLevel.minElo to nextLevel.minElo)
  let progressPercent = 100;
  let eloToNextTier = 0;

  if (nextLevel) {
    const tierRange = nextLevel.minElo - currentLevel.minElo;
    const progressInTier = Math.max(0, currentElo - currentLevel.minElo);
    progressPercent = Math.min(100, Math.max(0, Math.round((progressInTier / tierRange) * 100)));
    eloToNextTier = Math.max(0, nextLevel.minElo - currentElo);
  }

  // Estimated tasks or arena matches needed
  const averageEloPerHardTask = 65;
  const hardTasksNeeded = nextLevel ? Math.max(1, Math.ceil(eloToNextTier / averageEloPerHardTask)) : 0;
  const achievementsNeeded = nextLevel ? Math.max(0, nextLevel.minAchievements - achievementsCount) : 0;
  const tasksNeeded = nextLevel ? Math.max(0, nextLevel.minTasks - totalTasks) : 0;

  return (
    <div className={`rounded-2xl sm:rounded-3xl bg-[#0a0f24] border border-[#1b2648] p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 ${className}`}>
      
      {/* Background neon ambient highlight */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2b35ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Level Badge, Rank & Top Percentile Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0e1635] border border-[#2b35ff]/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.15)] shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Уровень {levelDetails.levelNumber}: {levelDetails.rankName}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${currentLevel.badgeColor}`}>
                {currentLevel.shortRank}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                levelDetails.isInTop 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {levelDetails.topPercentile}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {levelDetails.levelName}
            </h3>
          </div>
        </div>

        {/* ELO & Achievement Points Counter Display */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#070b1a] border border-[#2b35ff]/40 text-right">
            <div className="text-lg sm:text-xl font-black text-[#00f0ff] font-mono leading-none">
              {currentElo} <span className="text-xs font-normal text-slate-400">ELO</span>
            </div>
            <div className="text-[10px] text-amber-400 font-bold mt-1 flex items-center justify-end gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>{levelDetails.achievementPoints} AP ({achievementsCount} дост.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Progress Bar Container */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Текущий рубеж:</span>
            <span className="text-white font-mono">{currentLevel.minElo} ELO</span>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            {nextLevel ? (
              <>
                <span className="text-slate-400">Цель:</span>
                <span className="text-amber-400 font-mono font-black">{nextLevel.minElo} ELO ({nextLevel.shortRank})</span>
              </>
            ) : (
              <span className="text-emerald-400 font-mono">Абсолютный Гроссмейстер</span>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-4 sm:h-5 bg-[#060916] rounded-full p-1 border border-slate-800/80 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${currentLevel.gradient} shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-700 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Percentage & Delta Sub-label */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Прогресс ELO в разряде: <strong className="text-white font-mono">{progressPercent}%</strong></span>
          {nextLevel && (
            <span className="text-slate-300">
              Осталось набрать: <strong className="text-[#00f0ff] font-mono font-bold">{eloToNextTier} ELO</strong>
            </span>
          )}
        </div>
      </div>

      {/* Achievement Gate Checklist Notice */}
      {nextLevel && (
        <div className="p-3.5 rounded-xl bg-[#070b1a] border border-[#162038] space-y-2.5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
              Нормативы для перехода в «{nextLevel.shortRank}»:
            </span>
            <span className="text-[10px] text-slate-400">
              Минспорт РФ & ФСП
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* 1. ELO Checklist */}
            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              currentElo >= nextLevel.minElo 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${currentElo >= nextLevel.minElo ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold text-white">Рейтинг ELO</div>
                <div className="text-[10px] font-mono">{currentElo} / {nextLevel.minElo} pts</div>
              </div>
            </div>

            {/* 2. Tournament Achievements Checklist */}
            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              achievementsCount >= nextLevel.minAchievements 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${achievementsCount >= nextLevel.minAchievements ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold text-white">Турнирные победы</div>
                <div className="text-[10px] font-mono">{achievementsCount} / {nextLevel.minAchievements} подтверждено</div>
              </div>
            </div>

            {/* 3. Solved Tasks Checklist */}
            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              totalTasks >= nextLevel.minTasks 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${totalTasks >= nextLevel.minTasks ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold text-white">Решенные задачи</div>
                <div className="text-[10px] font-mono">{totalTasks} / {nextLevel.minTasks} решено</div>
              </div>
            </div>
          </div>

          {/* Quick Action Button for Arena */}
          {(!levelDetails.isInTop || achievementsNeeded > 0 || tasksNeeded > 0) && onOpenArena && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-white/[0.05]">
              <span className="text-[11px] text-amber-300/90 leading-tight">
                {achievementsCount === 0 && totalTasks === 0 ? (
                  <>⚠️ <strong>Вне ТОПа:</strong> Для входа в ТОП-рейтинг и получения разряда требуется решить задачи в Арене.</>
                ) : (
                  <>💡 Решите еще <strong>~{hardTasksNeeded}</strong> задач в Арене ФСП для перехода на следующий уровень.</>
                )}
              </span>

              <button
                onClick={onOpenArena}
                className="py-1 px-3 rounded-lg bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>В Арену (+65 ELO)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
            <span>Официальная шкала нормативов Минспорта РФ и критерии ТОПа</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#00f0ff]">
            {isLadderExpanded ? 'Скрыть таблицу уровней' : 'Показать требования всех уровней'}
            {isLadderExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        </button>

        {isLadderExpanded && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 animate-fadeIn">
            {FSP_STANDARD_LEVELS.map((lvl) => {
              const isCurrent = lvl.levelNumber === levelDetails.levelNumber;
              const isPassed = levelDetails.levelNumber > lvl.levelNumber;

              return (
                <div
                  key={lvl.levelNumber}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isCurrent
                      ? 'bg-[#0f1738] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]'
                      : isPassed
                      ? 'bg-[#070b18] border-emerald-500/30 text-slate-400 opacity-80'
                      : 'bg-[#070b18] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">Lvl {lvl.levelNumber}</span>
                      <span className="font-black text-white text-[11px]">{lvl.shortRank}</span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">
                      {lvl.minElo}–{lvl.maxElo === 3500 ? '3000+' : lvl.maxElo} ELO
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    {lvl.description}
                  </p>

                  <div className="text-[10px] space-y-0.5 pt-1 border-t border-white/[0.04]">
                    <div className="text-slate-300">
                      Норматив: <span className="text-cyan-300 font-mono">{lvl.minAchievements} дост. / {lvl.minTasks} задач</span>
                    </div>
                    <div className="text-slate-400">
                      Статус: <span className={lvl.isInTop ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{lvl.topPercentile}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    {isCurrent ? (
                      <span className="text-[#00f0ff] font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        Ваш текущий уровень
                      </span>
                    ) : isPassed ? (
                      <span className="text-emerald-400 font-bold">✓ Выполнено</span>
                    ) : (
                      <span className="text-slate-500">Не выполнено</span>
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
