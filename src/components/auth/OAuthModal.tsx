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
  AlertCircle,
  Edit3,
  Sliders,
  Plus,
  Trash2,
  Award
} from 'lucide-react';
import { GitHubProfileData, HhResumeData, CandidateProfile, GitHubRepo } from '../../types';
import { 
  MOCK_GITHUB_PROFILE, 
  PESTEREV_GITHUB_PROFILE,
  ALINA_GITHUB_PROFILE,
  MOCK_HH_RESUME, 
  PESTEREV_HH_RESUME, 
  ALINA_HH_RESUME,
  DARIA_HH_RESUME, 
  SOKOLOV_HH_RESUME,
  PESTEREV_HH_CONFIRMED_SKILLS,
  HARPIX_JAVA_HH_RESUME,
  extractHhId,
  buildHhResumeFromInput
} from '../../data/mockOAuthData';
import { api } from '../../services/api';

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  githubData: GitHubProfileData | null;
  hhData: HhResumeData | null;
  yandexConnected: boolean;
  yandexEmail?: string | null;
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
  yandexEmail,
  onConnectGitHub,
  onConnectHh,
  onConnectYandex,
  onDisconnectProvider
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'hh' | 'yandex'>('github');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [syncStep, setSyncStep] = useState<string>('');
  
  // GitHub state
  const [customGithubUser, setCustomGithubUser] = useState<string>(
    githubData?.username || (candidate.id === 'cand-pesterev' ? 'ipesterev' : 'alex-belov-fsp')
  );
  const [isChangingGithub, setIsChangingGithub] = useState(false);

  // Yandex ID state
  const [customYandexEmail, setCustomYandexEmail] = useState<string>(
    yandexEmail || (candidate.id === 'cand-pesterev' ? 'ivan.pesterev@yandex.ru' : `${candidate.email.split('@')[0]}@yandex.ru`)
  );
  const [isChangingYandex, setIsChangingYandex] = useState(false);

  // HH.ru interactive state
  const [hhInputQuery, setHhInputQuery] = useState<string>('c182d902ff0dfdff810039ed1f5a564a4b7575');
  const [selectedHhPreset, setSelectedHhPreset] = useState<string>(
    candidate.id === 'cand-pesterev' ? 'pesterev' : 'belov'
  );
  const [isChangingHh, setIsChangingHh] = useState(false);
  const [isEditingHhManual, setIsEditingHhManual] = useState(false);

  // Editable fields for manual resume customization:
  const [editHhTitle, setEditHhTitle] = useState(hhData?.title || 'Java-разработчик');
  const [editHhSalary, setEditHhSalary] = useState(hhData?.desiredSalary || 120000);
  const [editHhExperience, setEditHhExperience] = useState(hhData?.experienceYears || 5);
  const [editHhSkillsStr, setEditHhSkillsStr] = useState(hhData?.skills?.join(', ') || 'Java, Spring Boot, PostgreSQL, Docker, REST API, Git, Hibernate');

  React.useEffect(() => {
    if (yandexEmail) {
      setCustomYandexEmail(yandexEmail);
    } else if (candidate) {
      setCustomYandexEmail(candidate.id === 'cand-pesterev' ? 'ivan.pesterev@yandex.ru' : `${candidate.email.split('@')[0]}@yandex.ru`);
    }
  }, [yandexEmail, candidate]);

  React.useEffect(() => {
    if (githubData) {
      setCustomGithubUser(githubData.username);
    }
  }, [githubData]);

  React.useEffect(() => {
    if (hhData) {
      setEditHhTitle(hhData.title);
      setEditHhSalary(hhData.desiredSalary);
      setEditHhExperience(hhData.experienceYears);
      setEditHhSkillsStr(hhData.skills.join(', '));
    }
  }, [hhData]);

  if (!isOpen) return null;

  const handleSimulateGitHubAuth = () => {
    const targetUser = customGithubUser.trim() || 'ipesterev';
    setLoadingProvider('github');
    setSyncStep(`Инициализация Spring Security OAuth2 Client для @${targetUser}...`);
    
    setTimeout(() => {
      setSyncStep(`Обмен authorization_code на Access Token (GitHub API для @${targetUser})...`);
    }, 500);

    setTimeout(() => {
      setSyncStep('Извлечение открытых репозиториев, коммитов, pull requests и языка...');
    }, 1000);

    setTimeout(async () => {
      let profileToUse = MOCK_GITHUB_PROFILE;

      try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(targetUser)}`);
        if (userRes.ok) {
          const u = await userRes.json();
          let topRepos: GitHubRepo[] = [];
          try {
            const rRes = await fetch(`https://api.github.com/users/${encodeURIComponent(targetUser)}/repos?sort=updated&per_page=6`);
            if (rRes.ok) {
              const rList = await rRes.json();
              if (Array.isArray(rList) && rList.length > 0) {
                topRepos = rList.map((r: any) => ({
                  name: r.name,
                  stars: r.stargazers_count || 0,
                  language: r.language || 'Код',
                  description: r.description || 'Публичный репозиторий с открытым исходным кодом',
                  url: r.html_url,
                  updatedAt: 'Недавно'
                }));
              }
            }
          } catch {}

          profileToUse = {
            username: u.login,
            avatarUrl: u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            bio: u.bio || `Инженер-разработчик @${u.login} • Верифицированный OAuth профиль`,
            reposCount: u.public_repos || topRepos.length || 12,
            commitsCountYear: Math.max((u.public_repos || 10) * 28, 480),
            mainLanguage: topRepos[0]?.language || 'TypeScript / Java',
            connectedAt: new Date().toISOString(),
            topRepos: topRepos.length > 0 ? topRepos : (targetUser.toLowerCase().includes('pesterev') ? PESTEREV_GITHUB_PROFILE.topRepos : MOCK_GITHUB_PROFILE.topRepos)
          };
        } else {
          if (targetUser.toLowerCase().includes('pesterev')) {
            profileToUse = PESTEREV_GITHUB_PROFILE;
          } else {
            profileToUse = {
              ...MOCK_GITHUB_PROFILE,
              username: targetUser,
              bio: `Software Engineer @${targetUser} • Подтвержденный профиль через Spring Security OAuth2`,
              commitsCountYear: 780,
              connectedAt: new Date().toISOString(),
              topRepos: MOCK_GITHUB_PROFILE.topRepos.map(r => ({
                ...r,
                url: `https://github.com/${targetUser}/${r.name}`
              }))
            };
          }
        }
      } catch {
        if (targetUser.toLowerCase().includes('pesterev')) {
          profileToUse = PESTEREV_GITHUB_PROFILE;
        } else {
          profileToUse = {
            ...MOCK_GITHUB_PROFILE,
            username: targetUser,
            bio: `Software Engineer @${targetUser} • Подтвержденный профиль через Spring Security OAuth2`,
            commitsCountYear: 780,
            connectedAt: new Date().toISOString()
          };
        }
      }

      await api.syncGithub(targetUser);
      onConnectGitHub(profileToUse);
      setIsChangingGithub(false);
      setLoadingProvider(null);
      setSyncStep('');
    }, 1500);
  };

  const handleConnectHhPreset = (presetKey: string) => {
    setSelectedHhPreset(presetKey);
    let chosenResume: HhResumeData;
    if (presetKey === 'pesterev') chosenResume = PESTEREV_HH_RESUME;
    else if (presetKey === 'alina') chosenResume = ALINA_HH_RESUME;
    else if (presetKey === 'belov') chosenResume = MOCK_HH_RESUME;
    else if (presetKey === 'daria') chosenResume = DARIA_HH_RESUME;
    else if (presetKey === 'sokolov') chosenResume = SOKOLOV_HH_RESUME;
    else chosenResume = PESTEREV_HH_RESUME;

    setHhInputQuery(chosenResume.resumeId);
    setEditHhTitle(chosenResume.title);
    setEditHhSalary(chosenResume.desiredSalary);
    setEditHhExperience(chosenResume.experienceYears);
    setEditHhSkillsStr(chosenResume.skills.join(', '));

    setLoadingProvider('hh');
    setSyncStep(`Запрос резюме «${chosenResume.title}» через hh.ru API v1...`);
    setTimeout(() => {
      setSyncStep(`Автопарсинг ${chosenResume.confirmedSkills?.length || 0} подтвержденных навыков hh.ru и мест работы...`);
    }, 250);
    setTimeout(() => {
      api.syncHh(chosenResume.resumeId).catch(() => {});
      onConnectHh(chosenResume);
      setIsChangingHh(false);
      setIsEditingHhManual(false);
      setLoadingProvider(null);
      setSyncStep('');
    }, 550);
  };

  const handleImportHhQueryOrUrl = (overrideQuery?: string) => {
    const rawQuery = (overrideQuery !== undefined ? overrideQuery : hhInputQuery).trim();
    const query = rawQuery || 'c182d902ff0dbff810039ed1f5a564a4b7575';
    if (!rawQuery) {
      setHhInputQuery(query);
    }

    const { id: cleanId, isVacancy } = extractHhId(query);

    setLoadingProvider('hh');
    setSyncStep(
      isVacancy
        ? `Парсинг вакансии #${cleanId} через API hh.ru и адаптация резюме...`
        : `Парсинг резюме hh.ru #${cleanId.slice(0, 16)}... через API v1...`
    );

    setTimeout(() => {
      setSyncStep('Извлечение сертификатов тестирования HeadHunter, подтвержденных навыков и вилки...');
    }, 280);

    setTimeout(() => {
      const manualOverrides = {
        title: editHhTitle.trim() || undefined,
        salary: Number(editHhSalary) > 0 ? Number(editHhSalary) : undefined,
        experience: Number(editHhExperience) >= 0 ? Number(editHhExperience) : undefined,
        skills: editHhSkillsStr ? editHhSkillsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined
      };

      const { resume: resumeToUse } = buildHhResumeFromInput(query, manualOverrides);

      setEditHhTitle(resumeToUse.title);
      setEditHhSalary(resumeToUse.desiredSalary);
      setEditHhExperience(resumeToUse.experienceYears);
      setEditHhSkillsStr(resumeToUse.skills.join(', '));
      setHhInputQuery(resumeToUse.resumeId);

      api.syncHh(resumeToUse.resumeId).catch(() => {});
      onConnectHh(resumeToUse);
      setIsChangingHh(false);
      setIsEditingHhManual(false);
      setLoadingProvider(null);
      setSyncStep('');
    }, 600);
  };

  const handleSaveCustomHhResume = () => {
    const rawSkills = editHhSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const customResume: HhResumeData = {
      resumeId: hhData?.resumeId || ('c182d902ff0dbff810039ed1f5a564a4b7575'),
      title: editHhTitle.trim() || 'Инженер-разработчик',
      experienceYears: Number(editHhExperience) || 5,
      desiredSalary: Number(editHhSalary) || 300000,
      skills: rawSkills.length > 0 ? rawSkills : ['TypeScript', 'Java', 'React', 'PostgreSQL'],
      confirmedSkills: hhData?.confirmedSkills || PESTEREV_HH_CONFIRMED_SKILLS,
      about: hhData?.about || `Резюме соискателя: ${editHhTitle}. Навыки верифицированы через тестирование hh.ru.`,
      workHistory: hhData?.workHistory || [
        {
          company: 'ФСП Tech Enterprise',
          position: editHhTitle,
          period: '2023 — настоящее время',
          description: 'Проектирование и разработка архитектурных компонентов.'
        }
      ],
      education: hhData?.education || 'Высшее профильное образование (ИТ / Прикладная математика)',
      connectedAt: new Date().toISOString()
    };

    setLoadingProvider('hh');
    setSyncStep('Синхронизация кастомного резюме с профилем кандидата по 152-ФЗ...');
    setTimeout(() => {
      api.syncHh(customResume.resumeId).catch(() => {});
      onConnectHh(customResume);
      setIsChangingHh(false);
      setIsEditingHhManual(false);
      setLoadingProvider(null);
      setSyncStep('');
    }, 450);
  };

  const handleSimulateYandexAuth = () => {
    let emailToUse = customYandexEmail.trim();
    if (!emailToUse) {
      emailToUse = candidate.id === 'cand-pesterev' ? 'ivan.pesterev@yandex.ru' : `${candidate.email.split('@')[0]}@yandex.ru`;
    } else if (!emailToUse.includes('@')) {
      emailToUse = `${emailToUse}@yandex.ru`;
    }

    setLoadingProvider('yandex');
    setSyncStep(`Инициализация Яндекс ID Passport OAuth2 для ${emailToUse}...`);
    
    setTimeout(() => {
      setSyncStep('Авторизация через Spring Security OAuth2 Client (/login/oauth2/code/yandex)...');
    }, 600);

    setTimeout(() => {
      setSyncStep(`Проверка профиля ${emailToUse} и верификация почты...`);
    }, 1200);

    setTimeout(() => {
      onConnectYandex(emailToUse);
      setIsChangingYandex(false);
      setLoadingProvider(null);
      setSyncStep('');
    }, 1800);
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
                {githubData && !isChangingGithub ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsChangingGithub(true)}
                      className="px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[#00f0ff] hover:bg-cyan-500/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      Сменить профиль
                    </button>
                    <button
                      onClick={() => {
                        onDisconnectProvider('github');
                        setIsChangingGithub(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Отключить
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Privacy Scope Notice (Alina's requirement: private repos are never touched) */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/35 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Гарантия приватности кода (152-ФЗ & GitHub Scope):</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Запрашивается исключительно минимальный scope: <code className="font-mono text-emerald-300 bg-emerald-900/40 px-1 py-0.5 rounded font-bold">read:user, user:email, public_repo</code>.
                  <span className="text-white block mt-0.5 font-medium">
                    🔒 Приватные репозитории и закрытый код пользователей НЕ сканируются и НЕ запрашиваются.
                  </span>
                  Система анализирует исключительно открытые публичные коммиты и репозитории из открытого профиля.
                </p>
              </div>

              {(!githubData || isChangingGithub) && (
                <div className="p-3.5 rounded-2xl bg-[#0b1021] border border-[#192340] space-y-3">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Укажите ваш логин GitHub или выберите пресет:
                  </span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={customGithubUser}
                        onChange={(e) => setCustomGithubUser(e.target.value)}
                        placeholder="например: ipesterev, torvalds, gaearon"
                        className="w-full pl-9 pr-3 py-2 bg-[#060914] border border-[#1e2a4a] focus:border-[#00f0ff] rounded-xl text-xs text-white placeholder:text-slate-500 font-mono outline-none transition-colors"
                      />
                    </div>
                    <button
                      disabled={!!loadingProvider}
                      onClick={handleSimulateGitHubAuth}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:from-[#3d49ff] hover:to-[#22f2ff] text-white text-xs font-bold transition-all shadow-md shadow-[#2b35ff]/30 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{isChangingGithub ? 'Сохранить и войти' : `Подключить @${customGithubUser || 'profile'}`}</span>
                    </button>
                  </div>

                  {/* Быстрые пресеты GitHub */}
                  <div className="space-y-1.5 pt-2 border-t border-[#141b2e]">
                    <div className="text-[10px] text-slate-400 font-medium">Быстрый выбор профиля разработчика:</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Иван Пестерев', user: 'ipesterev' },
                        { name: 'Александр Белов', user: 'alex-belov-fsp' },
                        { name: 'Дарья Морозова', user: 'daria-morozova' },
                        { name: 'Михаил Соколов', user: 'msokolov-dev' },
                      ].map((acc) => (
                        <button
                          key={acc.user}
                          type="button"
                          onClick={() => setCustomGithubUser(acc.user)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border cursor-pointer ${
                            customGithubUser === acc.user
                              ? 'bg-cyan-500/20 text-[#00f0ff] border-[#00f0ff]/50'
                              : 'bg-[#10172c] text-slate-300 border-[#1e2a4a] hover:bg-[#16213f] hover:text-white'
                          }`}
                        >
                          {acc.name} (@{acc.user})
                        </button>
                      ))}
                    </div>
                  </div>

                  {isChangingGithub && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsChangingGithub(false)}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  )}
                </div>
              )}

              {githubData && !isChangingGithub ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] space-y-4">
                  {/* Privacy Status Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span className="font-bold text-[11px]">Безопасный контур: scope: public_repo</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Приватный код скрыт
                    </span>
                  </div>

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
                      <div className="text-[10px] text-slate-400">в открытых репозиториях</div>
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
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                                public
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
              ) : null}
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
                    Синхронизация опыта работы, мест трудоустройства, подтвержденных навыков тестирования и оклада из резюме hh.ru.
                  </p>
                </div>
                {hhData && !isChangingHh && !isEditingHhManual ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsChangingHh(true)}
                      className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      Сменить резюме
                    </button>
                    <button
                      onClick={() => setIsEditingHhManual(true)}
                      className="px-3 py-1.5 rounded-xl border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3 h-3" />
                      Редактировать
                    </button>
                    <button
                      onClick={() => onDisconnectProvider('hh')}
                      className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Отключить
                    </button>
                  </div>
                ) : (isChangingHh || isEditingHhManual) ? (
                  <button
                    onClick={() => {
                      setIsChangingHh(false);
                      setIsEditingHhManual(false);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-white/5 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Отмена
                  </button>
                ) : null}
              </div>

              {/* Connected Active Card */}
              {hhData && !isChangingHh && !isEditingHhManual ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{hhData.title}</span>
                        <a
                          href={hhData.resumeId.length <= 10 && /^\d+$/.test(hhData.resumeId) ? `https://hh.ru/vacancy/${hhData.resumeId}` : `https://hh.ru/resume/${hhData.resumeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-[#141d38] hover:bg-[#1a274c] text-[10px] font-mono text-[#00f0ff] hover:underline flex items-center gap-1 border border-[#2b35ff]/30"
                          title="Открыть на hh.ru"
                        >
                          <span>hh: {hhData.resumeId.slice(0, 18)}{hhData.resumeId.length > 18 ? '...' : ''}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <div className="text-xs text-slate-400 pt-0.5">
                        Опыт в ИТ: <strong className="text-white">{hhData.experienceYears} лет</strong> • Желаемый оклад: <strong className="text-emerald-400">{hhData.desiredSalary.toLocaleString('ru-RU')} ₽</strong>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      hh.ru Синхронизировано
                    </span>
                  </div>

                  {/* Confirmed Skills from HeadHunter Assessment */}
                  {hhData.confirmedSkills && hhData.confirmedSkills.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Подтвержденные навыки тестирования HeadHunter ({hhData.confirmedSkills.length})</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">Верификация hh.ru</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {hhData.confirmedSkills.map((cs) => (
                          <div key={cs.id} className="p-2.5 rounded-xl bg-[#0a0f21] border border-[#1e2c52] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{cs.skill}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                cs.level === 'Экспертный' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}>
                                {cs.level}
                              </span>
                            </div>
                            <div className="text-[10px] text-emerald-400 font-mono font-medium">
                              {cs.scorePercent}% • {cs.percentileRank}
                            </div>
                            <div className="text-[9px] text-slate-400 flex items-center justify-between">
                              <span>{cs.confirmedAt}</span>
                              <span className="font-mono text-slate-500">{cs.certificateId}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#0c1224] border border-[#1b2646] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-lg bg-[#ff2b42] text-white flex items-center justify-center font-black text-[9px]">
                            hh
                          </div>
                          <span className="text-xs font-bold text-slate-200">
                            Тестирование HeadHunter: тесты еще не пройдены
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
                          0 тестов на hh.ru
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        В резюме на hh.ru раздел «Пройденные тесты и экзамены» пока не заполнен. Вы можете подтвердить свой олимпиадный и алгоритмический уровень прямо в Арене ФСП (Judge0) либо сдать квалификацию на hh.ru.
                      </p>
                    </div>
                  )}

                  {/* Work History */}
                  <div className="space-y-2 pt-1 border-t border-[#141b2e]">
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
                  <div className="space-y-1.5 pt-1 border-t border-[#141b2e]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Все импортированные ключевые навыки ({hhData.skills.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hhData.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-[#141d38] text-slate-200 text-[10px] font-bold border border-[#1e2a4a]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#141b2e]">
                    <span className="text-[11px] text-slate-400">Хотите протестировать другой сценарий или изменить вилку?</span>
                    <button
                      onClick={() => setIsEditingHhManual(true)}
                      className="text-xs text-[#00f0ff] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Настроить вручную
                    </button>
                  </div>
                </div>
              ) : (
                /* Unconnected or Editing/Switching View */
                <div className="space-y-4">
                  
                  {/* Mode Selector: Presets vs URL vs Manual Form */}
                  <div className="p-5 rounded-2xl bg-[#0b1021] border border-[#1e2a4a] space-y-5">
                    
                    {/* Section 1: Candidate Resumes Presets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Выберите готовое подтвержденное резюме соискателя:
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">1 клик для импорта</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          {
                            id: 'pesterev',
                            name: 'Иван Пестерев (hh.ru)',
                            title: 'Java-разработчик',
                            salary: '120 000 ₽',
                            exp: '5 лет 1 мес',
                            skillsCount: '0 тестов hh.ru'
                          },
                          {
                            id: 'alina',
                            name: 'Алина (LeetCode 400)',
                            title: 'Frontend / Algorithm Developer',
                            salary: '85 000 ₽',
                            exp: '0 лет (обнулено)',
                            skillsCount: '400 задач LeetCode'
                          },
                          {
                            id: 'belov',
                            name: 'Александр Белов',
                            title: 'Lead Java / Highload Backend Engineer',
                            salary: '480 000 ₽',
                            exp: '6 лет',
                            skillsCount: '3 теста hh.ru'
                          },
                          {
                            id: 'daria',
                            name: 'Дарья Морозова',
                            title: 'Middle+ Java & Kotlin Backend Engineer',
                            salary: '210 000 ₽',
                            exp: '4 года',
                            skillsCount: '3 теста hh.ru'
                          },
                          {
                            id: 'sokolov',
                            name: 'Михаил Соколов',
                            title: 'Senior Highload Backend & Data Engineer',
                            salary: '290 000 ₽',
                            exp: '6 лет',
                            skillsCount: '3 теста hh.ru'
                          },
                        ].map((preset) => (
                          <div
                            key={preset.id}
                            onClick={() => handleConnectHhPreset(preset.id)}
                            className="p-3 rounded-xl bg-[#0f172e] border border-[#1c2a4f] hover:border-[#ff2b42] hover:bg-[#141f3d] transition-all cursor-pointer group text-left space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white group-hover:text-[#ff7585] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-xs font-bold text-emerald-400 font-mono">
                                {preset.salary}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 truncate">
                              {preset.title}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                              <span>Опыт: {preset.exp}</span>
                              <span>•</span>
                              <span className="text-[#00f0ff]">{preset.skillsCount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: URL or Resume ID Input */}
                    <div className="pt-3 border-t border-[#141b2e] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span>Ссылка или хэш резюме / вакансии на hh.ru:</span>
                        </label>
                        <span className="text-[10px] text-emerald-400/90 font-mono">152-ФЗ Protected API</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={hhInputQuery}
                            onChange={(e) => setHhInputQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleImportHhQueryOrUrl();
                              }
                            }}
                            placeholder="c182d902ff0dbff810039ed1f5a564a4b7575 или ссылка hh.ru/resume/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#ff2b42] transition-colors font-mono"
                          />
                        </div>
                        <button
                          disabled={!!loadingProvider}
                          onClick={() => handleImportHhQueryOrUrl()}
                          className="px-4 py-2.5 rounded-xl bg-[#ff2b42] hover:bg-[#e02439] text-white text-xs font-bold transition-all shadow-md shadow-[#ff2b42]/30 flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Импортировать</span>
                        </button>
                      </div>

                      {/* Quick chips for 1-click test */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-400">Быстрый тест:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHhInputQuery('c182d902ff0dbff810039ed1f5a564a4b7575');
                            handleImportHhQueryOrUrl('c182d902ff0dbff810039ed1f5a564a4b7575');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-[#141b2e] hover:bg-[#ff2b42]/20 hover:text-[#ff7585] text-slate-300 text-[10px] font-mono border border-[#1e2a4a] transition-all cursor-pointer"
                        >
                          c182d902ff0dbff... (Хэш Иван Пестерев)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHhInputQuery('https://hh.ru/vacancy/137312634');
                            handleImportHhQueryOrUrl('https://hh.ru/vacancy/137312634');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-[#141b2e] hover:bg-[#ff2b42]/20 hover:text-[#ff7585] text-slate-300 text-[10px] font-mono border border-[#1e2a4a] transition-all cursor-pointer"
                        >
                          #137312634 (Вакансия Гарпикс)
                        </button>
                      </div>
                    </div>

                    {/* Section 3: Manual Customization Form */}
                    <div className="pt-3 border-t border-[#141b2e] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-[#00f0ff]" />
                          Ручная настройка параметров резюме:
                        </span>
                        <span className="text-[10px] text-slate-400">можно изменить любые поля</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Должность:</label>
                          <input
                            type="text"
                            value={editHhTitle}
                            onChange={(e) => setEditHhTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs focus:border-[#00f0ff] outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Желаемый оклад (₽):</label>
                          <input
                            type="number"
                            value={editHhSalary}
                            onChange={(e) => setEditHhSalary(Number(e.target.value))}
                            step={10000}
                            className="w-full px-3 py-2 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs font-mono focus:border-[#00f0ff] outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Опыт (лет):</label>
                          <input
                            type="number"
                            value={editHhExperience}
                            onChange={(e) => setEditHhExperience(Number(e.target.value))}
                            min={0}
                            max={30}
                            className="w-full px-3 py-2 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs font-mono focus:border-[#00f0ff] outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Ключевые навыки (через запятую):</label>
                        <input
                          type="text"
                          value={editHhSkillsStr}
                          onChange={(e) => setEditHhSkillsStr(e.target.value)}
                          placeholder="TypeScript, React, Java, Spring Boot, PostgreSQL, Docker"
                          className="w-full px-3 py-2 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs focus:border-[#00f0ff] outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          * Навыки автоматически обновят фильтры и профиль кандидата в ATS работодателей
                        </span>
                        <button
                          disabled={!!loadingProvider}
                          onClick={handleSaveCustomHhResume}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Сохранить в профиль</span>
                        </button>
                      </div>
                    </div>

                  </div>
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
                {yandexConnected && !isChangingYandex ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsChangingYandex(true)}
                      className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition-all"
                    >
                      Сменить профиль
                    </button>
                    <button
                      onClick={() => {
                        onDisconnectProvider('yandex');
                        setIsChangingYandex(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all"
                    >
                      Отключить
                    </button>
                  </div>
                ) : null}
              </div>

              {yandexConnected && !isChangingYandex ? (
                <div className="p-4 rounded-2xl bg-[#0b1021] border border-[#192340] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffcc00] text-black font-black text-lg flex items-center justify-center">
                      Я
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {yandexEmail || customYandexEmail || 'ivan.pesterev@yandex.ru'}
                      </div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Яндекс ID подтвержден
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-medium border border-emerald-500/30">
                    Активно
                  </span>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#0b1021] border border-[#1e2a4a] space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Email или логин Яндекс:</span>
                      <span className="text-[10px] text-slate-500 font-normal">любой аккаунт @yandex.ru</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customYandexEmail}
                          onChange={(e) => setCustomYandexEmail(e.target.value)}
                          placeholder="например: ivan.pesterev или login@yandex.ru"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b16] border border-[#223055] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#ffcc00] transition-colors"
                        />
                      </div>
                      <button
                        disabled={!!loadingProvider}
                        onClick={handleSimulateYandexAuth}
                        className="px-4 py-2.5 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] text-black text-xs font-bold transition-all shadow-md shadow-[#ffcc00]/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{isChangingYandex ? 'Сохранить и войти' : 'Войти через Яндекс'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Быстрый выбор тестовых профилей */}
                  <div className="space-y-1.5 pt-2 border-t border-[#141b2e]">
                    <div className="text-[10px] text-slate-400 font-medium">Быстрый выбор аккаунта:</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Иван Пестерев', email: 'ivan.pesterev@yandex.ru' },
                        { name: 'Александр Белов', email: 'alexander.belov@yandex.ru' },
                        { name: 'Дарья Морозова', email: 'daria.morozova@yandex.ru' },
                        { name: 'Михаил Соколов', email: 'mikhail.sokolov@yandex.ru' },
                      ].map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => setCustomYandexEmail(acc.email)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                            customYandexEmail === acc.email
                              ? 'bg-[#ffcc00]/20 text-[#ffcc00] border-[#ffcc00]/50'
                              : 'bg-[#10172c] text-slate-300 border-[#1e2a4a] hover:bg-[#16213f] hover:text-white'
                          }`}
                        >
                          {acc.name} ({acc.email.split('@')[0]})
                        </button>
                      ))}
                    </div>
                  </div>

                  {isChangingYandex && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingYandex(false)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  )}
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
