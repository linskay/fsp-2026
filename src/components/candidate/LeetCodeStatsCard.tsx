import React, { useState } from 'react';
import { 
  Code2, 
  ExternalLink, 
  GitBranch, 
  CheckCircle2, 
  Trophy, 
  Zap, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp,
  FolderGit2
} from 'lucide-react';
import { LeetCodeProfileStats } from '../../types';

interface LeetCodeStatsCardProps {
  stats?: LeetCodeProfileStats;
  githubUsername?: string;
  candidateName: string;
  onRefresh?: () => void;
  compact?: boolean;
}

export const DEFAULT_LEETCODE_STATS: LeetCodeProfileStats = {
  username: 'alex_belov_fsp',
  ranking: 14200,
  totalSolved: 742,
  totalQuestions: 3180,
  easySolved: 215,
  totalEasy: 830,
  mediumSolved: 385,
  totalMedium: 1710,
  hardSolved: 142,
  totalHard: 640,
  acceptanceRate: 76.4,
  contestRating: 2480,
  contestGlobalRanking: 340,
  contestTopPercentage: 0.8,
  badge: 'Guardian',
  syncedWithGithub: true,
  syncedGithubRepo: 'alex-belov-fsp/leetcode-fsp-solutions',
  lastSyncedAt: 'Сегодня, 14:20',
  recentSubmissions: [
    {
      id: 'sub-lc-1',
      title: 'Maximum Flow using Dinic Algorithm',
      titleSlug: 'dinic-max-flow',
      difficulty: 'Hard',
      language: 'C++',
      runtimeBeatsPercent: 99.2,
      memoryBeatsPercent: 94.6,
      status: 'Accepted',
      timestamp: '2 часа назад'
    },
    {
      id: 'sub-lc-2',
      title: 'LRU Cache Design & Concurrent Access',
      titleSlug: 'lru-cache',
      difficulty: 'Medium',
      language: 'Java 21',
      runtimeBeatsPercent: 98.1,
      memoryBeatsPercent: 96.0,
      status: 'Accepted',
      timestamp: 'Вчера'
    },
    {
      id: 'sub-lc-3',
      title: 'Trapping Rain Water II (3D Priority Queue)',
      titleSlug: 'trapping-rain-water-ii',
      difficulty: 'Hard',
      language: 'Go',
      runtimeBeatsPercent: 97.4,
      memoryBeatsPercent: 91.8,
      status: 'Accepted',
      timestamp: '3 дня назад'
    },
    {
      id: 'sub-lc-4',
      title: 'Sliding Window Maximum (Monotonic Queue)',
      titleSlug: 'sliding-window-maximum',
      difficulty: 'Hard',
      language: 'C++',
      runtimeBeatsPercent: 99.5,
      memoryBeatsPercent: 97.1,
      status: 'Accepted',
      timestamp: '4 дня назад'
    }
  ]
};

export const LeetCodeStatsCard: React.FC<LeetCodeStatsCardProps> = ({
  stats = DEFAULT_LEETCODE_STATS,
  githubUsername,
  candidateName,
  onRefresh,
  compact = false
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('LeetCode профиль и GitHub репозиторий успешно синхронизированы!');
      setTimeout(() => setSyncNotice(null), 4000);
      if (onRefresh) onRefresh();
    }, 1200);
  };

  const easyPercent = Math.round((stats.easySolved / stats.totalEasy) * 100);
  const medPercent = Math.round((stats.mediumSolved / stats.totalMedium) * 100);
  const hardPercent = Math.round((stats.hardSolved / stats.totalHard) * 100);

  if (compact) {
    return (
      <div className="bg-[#0b1022] border border-amber-500/30 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              LC
            </div>
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                LeetCode: <strong className="text-amber-400 font-mono">{stats.totalSolved}</strong> решено
                {stats.badge && (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                    {stats.badge}
                  </span>
                )}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Рейтинг: #{stats.ranking.toLocaleString('ru-RU')}
          </span>
        </div>

        {/* Mini progress bars */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div className="bg-[#121933] p-1.5 rounded-lg border border-emerald-500/20">
            <span className="text-emerald-400 font-bold">Easy: {stats.easySolved}</span>
          </div>
          <div className="bg-[#121933] p-1.5 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 font-bold">Med: {stats.mediumSolved}</span>
          </div>
          <div className="bg-[#121933] p-1.5 rounded-lg border border-rose-500/20">
            <span className="text-rose-400 font-bold">Hard: {stats.hardSolved}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#090d1a] border border-[#1d2745] hover:border-amber-500/40 rounded-3xl p-6 space-y-6 shadow-2xl transition-all font-['JetBrains_Mono'] relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141d36] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#080c18] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              LC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">
                LeetCode Профиль & GitHub Синхронизация
              </h3>
              {stats.badge && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {stats.badge} (Топ 0.8%)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Пользователь: <span className="text-[#00f0ff] font-bold">@{stats.username}</span> • Мировой рейтинг: <strong className="text-white">#{stats.ranking.toLocaleString('ru-RU')}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141c36] hover:bg-[#1a2548] border border-[#2b35ff]/30 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00f0ff] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Синхронизация...' : 'Синхронизировать'}</span>
          </button>

          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#141c36] hover:bg-[#1a2548] text-slate-400 hover:text-white border border-[#2b35ff]/20 transition-colors"
            title="Открыть на leetcode.com"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Total Solved Box */}
        <div className="bg-[#0d1326] border border-[#1c2647] rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Всего решено</span>
          <div>
            <div className="text-3xl font-black text-white font-mono">{stats.totalSolved}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">из {stats.totalQuestions} задач ({stats.acceptanceRate}% acc.)</div>
          </div>
          <div className="w-full bg-[#182344] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, Math.round((stats.totalSolved / stats.totalQuestions) * 100))}%` }} 
            />
          </div>
        </div>

        {/* Easy Box */}
        <div className="bg-[#0d1326] border border-[#1c2647] rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Easy</span>
            <span className="text-[10px] text-slate-400">{easyPercent}%</span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats.easySolved}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">из {stats.totalEasy} задач</div>
          </div>
          <div className="w-full bg-[#182344] h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${easyPercent}%` }} />
          </div>
        </div>

        {/* Medium Box */}
        <div className="bg-[#0d1326] border border-[#1c2647] rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Medium</span>
            <span className="text-[10px] text-slate-400">{medPercent}%</span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono">{stats.mediumSolved}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">из {stats.totalMedium} задач</div>
          </div>
          <div className="w-full bg-[#182344] h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${medPercent}%` }} />
          </div>
        </div>

        {/* Hard Box */}
        <div className="bg-[#0d1326] border border-[#1c2647] rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Hard (ФСП)</span>
            <span className="text-[10px] text-slate-400">{hardPercent}%</span>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400 font-mono">{stats.hardSolved}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">из {stats.totalHard} задач</div>
          </div>
          <div className="w-full bg-[#182344] h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${hardPercent}%` }} />
          </div>
        </div>

      </div>

      {/* GitHub Sync Status Bar (LeetHub style) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d152e] via-[#0e1938] to-[#0d152e] border border-[#2b35ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2b35ff]/20 text-[#00f0ff] border border-[#2b35ff]/40 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Автосинхронизация с GitHub (LeetHub Plugin)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Активна
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Репозиторий: <code className="text-[#00f0ff]">{stats.syncedGithubRepo || `${githubUsername || 'alex-belov'}/leetcode-solutions`}</code> • Последний пуш: {stats.lastSyncedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Синхронизировано: <strong className="text-white">{stats.totalSolved} коммитов</strong></span>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Недавно решенные задачи (Live Feed):
            </span>
            <span className="text-slate-500 text-[11px]">
              Синхронизировано через LeetCode GraphQL API
            </span>
          </div>

          <div className="space-y-2">
            {stats.recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#0c1224] hover:bg-[#101830] border border-[#16203a] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    sub.difficulty === 'Hard'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : sub.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {sub.difficulty}
                  </span>
                  <span className="text-xs font-bold text-white hover:text-[#00f0ff] transition-colors">
                    {sub.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400 text-[11px] bg-[#141e3c] px-2 py-0.5 rounded-lg border border-slate-700/50">
                    {sub.language}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    ⚡ Beats {sub.runtimeBeatsPercent}%
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {sub.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
