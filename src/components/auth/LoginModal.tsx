import React, { useState } from 'react';
import { 
  X, Lock, Mail, Key, UserCheck, Building2, CheckCircle2, 
  AlertCircle, Sparkles, Shield, ArrowRight, UserPlus, LogIn,
  Github, Check
} from 'lucide-react';
import { api, AuthLoginResponse } from '../../services/api';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthLoginResponse) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration form state
  const [regRole, setRegRole] = useState<'CANDIDATE' | 'EMPLOYER'>('CANDIDATE');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConsent, setRegConsent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const POLICY_URL = "https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf";

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  const handleQuickLogin = async (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.login(testEmail, testPass);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      onLoginSuccess(response);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка аутентификации. Проверьте логин и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Пожалуйста, введите email и пароль');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.login(email.trim(), password);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      onLoginSuccess(response);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка аутентификации. Проверьте логин и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Укажите ваше имя или название компании');
      return;
    }
    if (!regEmail.trim() || !regPassword) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (!regConsent) {
      setError('Необходимо подтвердить согласие с Политикой конфиденциальности');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const registeredUser = await api.register({
        email: regEmail.trim(),
        password: regPassword,
        fullName: regName.trim(),
        role: regRole
      });

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onLoginSuccess(registeredUser);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const [socialProvider, setSocialProvider] = useState<'github' | 'yandex' | 'hh' | null>(null);
  const [socialUsername, setSocialUsername] = useState('ipesterev');

  const handleSocialAuth = async (provider: 'github' | 'yandex' | 'hh') => {
    setIsLoading(true);
    setError(null);

    try {
      if (provider === 'github') {
        const username = socialUsername.trim() || 'ipesterev';

        // 1. Проверяем OAuth redirect URL от бэкенда
        const authUrl = await api.getGithubOAuthUrl(window.location.origin + window.location.pathname);
        if (authUrl && !authUrl.includes('mock-github-client-id')) {
          window.location.href = authUrl;
          return;
        }

        // 2. Бэкенд OAuth-пайплайн: запрос GitHub API, парсинг стека, расчет ELO, сохранение в PostgreSQL и генерация AI-саммари
        const resp = await api.handleGithubOAuthCallback(undefined, username);

        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}

        onLoginSuccess(resp);
        onClose();
      } else if (provider === 'yandex') {
        const username = socialUsername.trim() || 'developer';
        const user: AuthLoginResponse = {
          token: 'jwt-oauth-yandex-' + Date.now(),
          email: `${username.toLowerCase()}@yandex.ru`,
          fullName: `Яндекс Пользователь (@${username})`,
          avatarUrl: '/avatars/user_alina.png',
          role: regRole,
          candidateId: 'cand-ya-' + username.toLowerCase(),
          fspRank: 'Кандидат в мастера спорта',
          fspElo: 1850
        };

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}

        onLoginSuccess(user);
        onClose();
      } else {
        const username = socialUsername.trim() || 'candidate';
        const user: AuthLoginResponse = {
          token: 'jwt-oauth-hh-' + Date.now(),
          email: `${username.toLowerCase()}@hh.ru`,
          fullName: 'HeadHunter Соискатель',
          avatarUrl: '/avatars/user_pesterev.png',
          role: 'CANDIDATE',
          candidateId: 'cand-hh-' + username.toLowerCase(),
          fspRank: '1-й спортивный разряд',
          fspElo: 1600
        };

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}

        onLoginSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Ошибка аутентификации через внешний сервис');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300">
      <div 
        className="modal-animate relative w-full max-w-lg bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative px-6 pt-5 pb-4 border-b border-white/[0.08] bg-[#0e1424]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-400/20 flex items-center justify-center shadow-md shadow-blue-900/30">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  FSP Career Arena 2026
                </h3>
                <p className="text-xs text-slate-400">
                  {activeTab === 'login' ? 'Вход для соискателей и работодателей' : 'Создание нового аккаунта'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Вход</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Регистрация</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Quick 1-Click Fill Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Демо-аккаунты для быстрого входа (1 клик):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('candidate@fsp.ru', 'candidate2026')}
                    disabled={isLoading}
                    className="group p-3 rounded-xl border text-left transition-all cursor-pointer bg-white/[0.03] border-white/10 text-slate-300 hover:bg-blue-600/15 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Кандидат</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                        1200 ELO
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-200 font-medium">Иван Пестерев</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">candidate@fsp.ru</div>
                    <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-cyan-400 font-bold group-hover:text-cyan-300">
                      <span>Войти в 1 клик</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('employer@fsp.ru', 'employer2026')}
                    disabled={isLoading}
                    className="group p-3 rounded-xl border text-left transition-all cursor-pointer bg-white/[0.03] border-white/10 text-slate-300 hover:bg-indigo-600/15 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Работодатель</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        HR
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-200 font-medium">Елена Романова (СберТех)</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">employer@fsp.ru</div>
                    <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-indigo-400 font-bold group-hover:text-indigo-300">
                      <span>Войти в 1 клик</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmitLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email / Логин
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@fsp.ru или employer@fsp.ru"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Пароль
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Вход в систему...</span>
                    </>
                  ) : (
                    <>
                      <span>Войти в аккаунт</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Options */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-slate-400 text-center font-medium">
                  или войти через сервис:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('yandex')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center">Я</span>
                    <span>Яндекс</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('hh')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white font-black text-[8px] flex items-center justify-center">hh</span>
                    <span>hh.ru</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Ваша роль на платформе:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('CANDIDATE')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'CANDIDATE'
                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Соискатель</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Разработчик, участие в турнирах</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('EMPLOYER')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'EMPLOYER'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Работодатель</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">HR, поиск ИТ-талантов</p>
                  </button>
                </div>
              </div>

              {/* Quick Social Registration */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <span className="text-[11px] font-medium text-slate-400 block text-center">
                  Быстрая регистрация через внешний профиль:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSocialProvider(socialProvider === 'github' ? null : 'github');
                      setSocialUsername('ipesterev');
                    }}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      socialProvider === 'github'
                        ? 'bg-blue-600/30 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-slate-200'
                    }`}
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSocialProvider(socialProvider === 'yandex' ? null : 'yandex');
                      setSocialUsername('alina.dev');
                    }}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      socialProvider === 'yandex'
                        ? 'bg-red-600/30 border-red-500 text-white ring-1 ring-red-500'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-slate-200'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center">Я</span>
                    <span>Яндекс</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSocialProvider(socialProvider === 'hh' ? null : 'hh');
                      setSocialUsername('pesterev-resume');
                    }}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      socialProvider === 'hh'
                        ? 'bg-rose-600/30 border-rose-500 text-white ring-1 ring-rose-500'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-slate-200'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white font-black text-[8px] flex items-center justify-center">hh</span>
                    <span>hh.ru</span>
                  </button>
                </div>

                {socialProvider && (
                  <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {socialProvider === 'github' && <Github className="w-3.5 h-3.5 text-cyan-400" />}
                        {socialProvider === 'yandex' && <span className="w-3 h-3 rounded-full bg-red-500 text-white text-[8px] inline-flex items-center justify-center">Я</span>}
                        {socialProvider === 'hh' && <span className="w-3 h-3 rounded-full bg-rose-500 text-white text-[7px] inline-flex items-center justify-center">hh</span>}
                        {socialProvider === 'github' ? 'Регистрация через GitHub' : socialProvider === 'yandex' ? 'Регистрация через Яндекс ID' : 'Регистрация через HeadHunter'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSocialProvider(null)}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={socialUsername}
                        onChange={(e) => setSocialUsername(e.target.value)}
                        placeholder={socialProvider === 'github' ? 'GitHub username (напр. ipesterev или свой)' : socialProvider === 'yandex' ? 'Логин Яндекс' : 'ID резюме или имя'}
                        className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleSocialAuth(socialProvider)}
                        disabled={isLoading || !socialUsername.trim()}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isLoading ? 'Загрузка...' : 'Подтвердить'}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {socialProvider === 'github' 
                        ? 'Система автоматически синхронизирует публичные репозитории, стек технологий и аватарку профиля.'
                        : 'Профиль будет верифицирован и готов к участию в Арене и получению офферов.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmitRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Имя и фамилия
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={regRole === 'CANDIDATE' ? 'Иван Пестерев' : 'Елена Романова'}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Электронная почта
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.ru"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Надежный пароль"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                {/* Privacy Policy Mandatory Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={regConsent}
                      onChange={(e) => setRegConsent(e.target.checked)}
                      className="mt-0.5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="leading-relaxed text-[11px] text-slate-400">
                      Я подтверждаю, что ознакомлен(-а) и принимаю{' '}
                      <a
                        href={POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00f0ff] hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        Политику конфиденциальности
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Создание профиля...</span>
                    </>
                  ) : (
                    <>
                      <span>Зарегистрироваться</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Register Options */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-slate-400 text-center font-medium">
                  или зарегистрироваться через сервис:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('yandex')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center">Я</span>
                    <span>Яндекс</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('hh')}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white font-black text-[8px] flex items-center justify-center">hh</span>
                    <span>hh.ru</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Compliance & Info footer */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Безопасная авторизация</span>
            </div>
            <a 
              href={POLICY_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#00f0ff] underline decoration-slate-600 underline-offset-2 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Политика конфиденциальности</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
