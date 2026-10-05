import React, { useState } from 'react';
import { 
  Github, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  GitBranch, 
  Star, 
  Building2, 
  Briefcase, 
  Lock,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import { GitHubProfileData, HhResumeData, CandidateProfile } from '../../types';
import { MOCK_GITHUB_PROFILE, MOCK_HH_RESUME } from '../../data/mockOAuthData';

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  githubData: GitHubProfileData | null;
  hhData: HhResumeData | null;
  yandexConnected: boolean;
  onConnectGitHub: (data: GitHubProfileData) => void;
  onConnectHh: (data: HhResumeData) => void;
  onConnectYandex: (email: string) => void;
  onDisconnectProvider: (provider: 'github' | 'hh' | 'yandex') => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen,
  onClose,
  candidate,
  githubData,
  hhData,
  yandexConnected,
  onConnectGitHub,
  onConnectHh,
  onConnectYandex,
  onDisconnectProvider
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'hh' | 'yandex'>('github');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [syncStep, setSyncStep] = useState<string>('');

  if (!isOpen) return null;

  const handleSimulateGitHubAuth = () => {
    setLoadingProvider('github');
    setSyncStep('Инициализация Spring Security OAuth2 Client...');
    
    setTimeout(() => {
      setSyncStep('Обмен authorization_code на Access Token (GitHub API)...');
    }, 700);

    setTimeout(() => {
      setSyncStep('Извлечение репозиториев, коммитов и активности...');
    }, 1400);

    setTimeout(() => {
      onConnectGitHub(MOCK_GITHUB_PROFILE);
      setLoadingProvider(null);
      setSyncStep('');
    }, 2000);
  };

  const handleSimulateHhAuth = () => {
    setLoadingProvider('hh');
    setSyncStep('Переход к авторизации в hh.ru OAuth2...');
    
    setTimeout(() => {
      setSyncStep('Запрос активных резюме через hh.ru API v1 (/resumes/mine)...');
    }, 800);

    setTimeout(() => {
      setSyncStep('Автопарсинг опыта работы, навыков и зарплатных ожиданий...');
    }, 1500);

    setTimeout(() => {
      onConnectHh(MOCK_HH_RESUME);
      setLoadingProvider(null);
      setSyncStep('');
    }, 2200);
  };

  const handleSimulateYandexAuth = () => {
    setLoadingProvider('yandex');
    setSyncStep('Авторизация через Яндекс ID (Passport OAuth)...');
    
    setTimeout(() => {
      setSyncStep('Синхронизация профиля и верификация почты...');
    }, 800);

    setTimeout(() => {
      onConnectYandex('alexander.belov@yandex.ru');
      setLoadingProvider(null);
      setSyncStep('');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090d1a] border border-[#1e294b] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#141b2e] bg-[#0c1224] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2b35ff]/20 rounded-2xl border border-[#2b35ff]/40 text-[#00f0ff]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Spring Security OAuth2 & Внешние интеграции
              </h3>
              <p className="text-xs text-slate-400">
                Автоматическое наполнение профиля и портфолио в один клик
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151f38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="flex border-b border-[#141b2e] bg-[#060811] px-6 pt-3 gap-2">
          
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'github'
                ? 'bg-[#090d1a] border-[#2b35ff] text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            {githubData && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('hh')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'hh'
                ? 'bg-[#090d1a] border-[#ff2b42] text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#ff2b42] text-white text-[9px] font-black flex items-center justify-center">
              hh
            </div>
            <span>hh.ru Резюме</span>
            {hhData && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('yandex')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'yandex'
                ? 'bg-[#090d1a] border-[#ffcc00] text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#ffcc00] text-black text-[10px] font-black flex items-center justify-center">
              Я
            </div>
            <span>Яндекс ID</span>
            {yandexConnected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">

          {/* Loading Animation Overlay / Progress */}
          {loadingProvider && (
            <div className="p-4 rounded-2xl bg-[#0e162e] border border-[#2b35ff]/50 space-y-3 animate-pulse">
              <div className="flex items-center gap-3 text-sm text-[#00f0ff] font-bold">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
                <span>Spring Security OAuth2 Client: Синхронизация данных</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                &gt; {syncStep}
              </p>
              <div className="w-full bg-[#141d36] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] animate-pulse w-3/4 rounded-full" />
              </div>
            </div>
          )}

          {/* GITHUB TAB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" />
                    Интеграция с GitHub OAuth2
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Подтягивает публичные репозитории, звезды, коммиты за последний год и основной стек. Работодатель видит качество кода без ручного заполнения.
                  </p>
                </div>
                {githubData ? (
                  <button
                    onClick={() => onDisconnectProvider('github')}
                    className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all shrink-0"
                  >
                    Отключить
                  </button>
                ) : (
                  <button
                    disabled={!!loadingProvider}
                    onClick={handleSimulateGitHubAuth}
                    className="px-4 py-2 rounded-xl bg-[#2b35ff] hover:bg-[#3d49ff] text-white text-xs font-bold transition-all shadow-md shadow-[#2b35ff]/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Подключить GitHub
                  </button>
                )}
              </div>

              {githubData ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#141b2e] border border-[#2b35ff]/30 overflow-hidden flex items-center justify-center">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          @{githubData.username}
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            Синхронизировано
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{githubData.bio}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#00f0ff]">{githubData.commitsCountYear} коммитов</div>
                      <div className="text-[10px] text-slate-400">за последние 12 месяцев</div>
                    </div>
                  </div>

                  {/* Top Repos */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Импортированные репозитории ({githubData.topRepos.length}):
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {githubData.topRepos.map(repo => (
                        <div key={repo.name} className="p-3 rounded-xl bg-[#0e152b] border border-[#16213d] flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white hover:text-[#00f0ff] transition-colors cursor-pointer">
                                {repo.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#2b35ff]/20 text-[#00f0ff] border border-[#2b35ff]/30">
                                {repo.language}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">{repo.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {repo.stars}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#0b1021] border border-dashed border-[#1e2a4a] text-center space-y-2">
                  <GitBranch className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">GitHub профиль еще не подключен</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Авторизуйтесь через Spring Security OAuth2 Client, чтобы репозитории и коммиты автоматически появились в анкете для HR.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* HH.RU TAB */}
          {activeTab === 'hh' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#ff2b42] text-white text-[9px] font-black flex items-center justify-center">
                      hh
                    </div>
                    Импорт резюме через hh.ru API v1
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Автоматический парсинг опыта работы, мест трудоустройства, подтвержденных навыков и желаемой зарплаты в рублях.
                  </p>
                </div>
                {hhData ? (
                  <button
                    onClick={() => onDisconnectProvider('hh')}
                    className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all shrink-0"
                  >
                    Отключить
                  </button>
                ) : (
                  <button
                    disabled={!!loadingProvider}
                    onClick={handleSimulateHhAuth}
                    className="px-4 py-2 rounded-xl bg-[#ff2b42] hover:bg-[#e02439] text-white text-xs font-bold transition-all shadow-md shadow-[#ff2b42]/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Подтянуть с hh.ru
                  </button>
                )}
              </div>

              {hhData ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                    <div>
                      <div className="text-xs font-bold text-white">{hhData.title}</div>
                      <div className="text-[11px] text-slate-400">Опыт: {hhData.experienceYears} лет • Ожидания: {hhData.desiredSalary.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      hh.ru Синхронизировано
                    </span>
                  </div>

                  {/* Work History */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Опыт работы из резюме:
                    </div>
                    <div className="space-y-2">
                      {hhData.workHistory.map((work, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#0e152b] border border-[#16213d] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-[#2b35ff]" />
                              {work.company}
                            </span>
                            <span className="text-[10px] text-slate-400">{work.period}</span>
                          </div>
                          <div className="text-[11px] text-[#00f0ff] font-bold">{work.position}</div>
                          <p className="text-[11px] text-slate-400 leading-snug">{work.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Импортированные навыки ({hhData.skills.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hhData.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-[#141d38] text-slate-200 text-[10px] font-bold border border-[#1e2a4a]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#0b1021] border border-dashed border-[#1e2a4a] text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Резюме с hh.ru еще не загружено</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Нажмите «Подтянуть с hh.ru», чтобы не заполнять профиль вручную — система распарсит все данные через официальный OAuth2.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* YANDEX ID TAB */}
          {activeTab === 'yandex' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#ffcc00] text-black text-[10px] font-black flex items-center justify-center">
                      Я
                    </div>
                    Яндекс ID (Passport OAuth2)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Быстрый вход без паролей, подтвержденный email и доверенный статус пользователя в РФ.
                  </p>
                </div>
                {yandexConnected ? (
                  <button
                    onClick={() => onDisconnectProvider('yandex')}
                    className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all shrink-0"
                  >
                    Отключить
                  </button>
                ) : (
                  <button
                    disabled={!!loadingProvider}
                    onClick={handleSimulateYandexAuth}
                    className="px-4 py-2 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] text-black text-xs font-bold transition-all shadow-md shadow-[#ffcc00]/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <span>Войти через Яндекс</span>
                  </button>
                )}
              </div>

              {yandexConnected ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffcc00] text-black font-black text-lg flex items-center justify-center">
                      Я
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">alexander.belov@yandex.ru</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Яндекс ID подтвержден
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Активно</span>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#0b1021] border border-dashed border-[#1e2a4a] text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Яндекс ID не привязан</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Привяжите Яндекс ID для мгновенной авторизации и получения уведомлений о новых офферах на почту.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Technical Note */}
        <div className="px-6 py-4 bg-[#060811] border-t border-[#141b2e] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Spring Security OAuth2 Client • Безопасное хранение JWT токенов
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#141b2e] hover:bg-[#1a243e] text-white font-bold text-xs transition-colors"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
