import React, { useState } from 'react';
import { 
  Github, 
  GitBranch, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  FileCode, 
  Clock, 
  Cpu, 
  FolderGit2,
  Check,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { GitHubSyncSettings, GitHubSyncCommit } from '../../types';

interface GitHubRepoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncSettings: GitHubSyncSettings;
  onUpdateSettings: (settings: GitHubSyncSettings) => void;
  candidateUsername: string;
}

export const GitHubRepoSyncModal: React.FC<GitHubRepoSyncModalProps> = ({
  isOpen,
  onClose,
  syncSettings,
  onUpdateSettings,
  candidateUsername
}) => {
  const [autoPush, setAutoPush] = useState(syncSettings.autoPushEnabled);
  const [repoName, setRepoName] = useState(syncSettings.repoName || 'fsp-leetcode-solutions');
  const [branch, setBranch] = useState(syncSettings.defaultBranch || 'main');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      ...syncSettings,
      autoPushEnabled: autoPush,
      repoName: repoName.trim() || 'fsp-leetcode-solutions',
      repoFullName: `${candidateUsername}/${repoName.trim() || 'fsp-leetcode-solutions'}`,
      defaultBranch: branch.trim() || 'main',
      isPublicOnly: true,
      lastSyncedAt: 'Только что'
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  const sampleRepoFullName = `${candidateUsername}/${repoName.trim() || 'fsp-leetcode-solutions'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0d121f] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 modal-animate">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0d121f] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  FSP-Hub: Автопуш решений в GitHub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-bold">
                  LeetHub v3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Автоматическое сохранение решений, замеров скорости и памяти в ваш публичный репозиторий
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-[#16203a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* 152-FZ Privacy Guarantee Notice */}
          <div className="p-3.5 rounded-2xl bg-[#081226] border border-[#00f0ff]/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Конфиденциальность и безопасность</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                  Безопасно
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Запись решений ведется <strong>строго в публичный репозиторий</strong> соискателя. Платформа ФСП не запрашивает доступ к вашим приватным репозиториям и коммерческому коду.
              </p>
            </div>
          </div>

          {/* Toggle AutoPush */}
          <div className="p-4 rounded-2xl bg-[#080c1a] border border-[#1b2545] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Автоматический пуш при успешной сдаче (Accepted)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Создавать коммит с кодом, замерами скорости (Runtime) и памяти (Memory) сразу после прохождения тестов
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoPush}
                onChange={(e) => setAutoPush(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2b35ff]"></div>
            </label>
          </div>

          {/* Repo Configuration */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Github className="w-4 h-4 text-white" />
              <span>Целевой публичный репозиторий</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block font-medium">
                  Название репозитория:
                </label>
                <div className="flex items-center rounded-xl bg-[#080d1e] border border-[#1d294a] px-3 py-2 text-xs font-mono text-white focus-within:border-[#00f0ff]">
                  <span className="text-slate-500 mr-1">@{candidateUsername}/</span>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="fsp-leetcode-solutions"
                    className="bg-transparent text-white outline-none w-full font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block font-medium">
                  Ветка по умолчанию:
                </label>
                <div className="flex items-center rounded-xl bg-[#080d1e] border border-[#1d294a] px-3 py-2 text-xs font-mono text-white focus-within:border-[#00f0ff]">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="bg-transparent text-white outline-none w-full font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Format Preview */}
          <div className="p-4 rounded-2xl bg-[#060914] border border-[#162038] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Структура коммита в GitHub (образец):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {sampleRepoFullName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0a0f21] border border-[#15213d] text-xs font-mono space-y-1.5">
              <div className="text-emerald-400 font-bold truncate">
                commit: feat(leetcode): solve #42 Trapping Rain Water [Hard] - 8.4ms (beats 98.4%) 14.2MB (beats 95.1%)
              </div>
              <div className="text-[11px] text-slate-400 pl-3 border-l border-slate-700 space-y-0.5">
                <div>📁 0042-trapping-rain-water/</div>
                <div className="pl-3 text-slate-300">📄 Solution.java (исходный код решения)</div>
                <div className="pl-3 text-slate-300">📄 README.md (описание задачи, перцентили LeetCode и ФСП печать)</div>
              </div>
            </div>
          </div>

          {/* Recent Commits Log */}
          {syncSettings.recentCommits && syncSettings.recentCommits.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Последние синхронизированные решения:</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {syncSettings.recentCommits.length} коммитов
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {syncSettings.recentCommits.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-[#090e1f] border border-[#182342] flex items-center justify-between text-xs font-mono">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <div className="text-white font-bold truncate flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          c.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          c.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {c.difficulty}
                        </span>
                        <span className="truncate">{c.taskTitle}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {c.language} • {c.runtimeMs}ms (beats {c.runtimeBeatsPercent}%) • {c.timestamp}
                      </div>
                    </div>

                    <a
                      href={c.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-[#141d3b] hover:bg-[#1f2d59] text-[#00f0ff] text-[10px] font-bold shrink-0 flex items-center gap-1 border border-[#2b35ff]/30"
                    >
                      <span>{c.commitHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#0e1428] border-t border-[#1b233a] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isSaved ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Настройки сохранены!
              </span>
            ) : (
              <span>Статус: {autoPush ? '🟢 Активен' : '⚪ Отключен'}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#16203a] text-xs font-bold transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:opacity-90 text-slate-950 text-xs font-black transition-all shadow-lg shadow-[#2b35ff]/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить настройки</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
