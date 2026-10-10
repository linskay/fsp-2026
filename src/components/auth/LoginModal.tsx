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

  const POLICY_URL = "https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83%20%D0%BF%D0%B4%D0%BD%20(1).pdf";

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
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
      const response = await api.login(email, password);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      onLoginSuccess(response);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка аутентификации. Проверьте логин и пароль.');
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
      // Simulate quick registration and log in as the chosen role
      const mockUser: AuthLoginResponse = {
        token: 'jwt-registered-' + Date.now(),
        email: regEmail,
        fullName: regName,
        role: regRole,
        candidateId: regRole === 'CANDIDATE' ? 'cand-pesterev' : undefined,
        employerId: regRole === 'EMPLOYER' ? 'emp-sbertech' : undefined,
        fspVerified: true
      };

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      onLoginSuccess(mockUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'github' | 'yandex' | 'hh') => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      let mockUser: AuthLoginResponse;
      if (provider === 'github') {
        mockUser = {
          token: 'jwt-oauth-github-' + Date.now(),
          email: 'github.user@fsp.ru',
          fullName: 'GitHub Разработчик',
          role: 'CANDIDATE',
          candidateId: 'cand-pesterev',
          fspVerified: true
        };
      } else if (provider === 'yandex') {
        mockUser = {
          token: 'jwt-oauth-yandex-' + Date.now(),
          email: 'yandex.user@yandex.ru',
          fullName: 'Яндекс ID Пользователь',
          role: regRole || 'CANDIDATE',
          candidateId: 'cand-pesterev',
          fspVerified: true
        };
      } else {
        mockUser = {
          token: 'jwt-oauth-hh-' + Date.now(),
          email: 'hh.candidate@hh.ru',
          fullName: 'HeadHunter Соискатель',
          role: 'CANDIDATE',
          candidateId: 'cand-pesterev',
          fspVerified: true
        };
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      onLoginSuccess(mockUser);
      onClose();
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative px-6 pt-5 pb-4 border-b border-white/[0.08] bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
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
                    onClick={() => handleQuickFill('candidate@fsp.ru', 'candidate2026')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      email === 'candidate@fsp.ru'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Кандидат</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                        1200 ELO
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">Иван Пестерев</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">candidate@fsp.ru</div>
                    <div className="text-[10px] text-slate-500 font-mono">Пароль: candidate2026</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('employer@fsp.ru', 'employer2026')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      email === 'employer@fsp.ru'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Работодатель</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        HR
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">Елена Романова (СберТех)</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">employer@fsp.ru</div>
                    <div className="text-[10px] text-slate-500 font-mono">Пароль: employer2026</div>
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
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <span className="text-[11px] font-medium text-slate-400 block text-center">
                  Быстрая регистрация через сервис:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    className="py-2 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('yandex')}
                    className="py-2 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center">Я</span>
                    <span>Яндекс</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('hh')}
                    className="py-2 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff2b42] text-white font-black text-[8px] flex items-center justify-center">hh</span>
                    <span>hh.ru</span>
                  </button>
                </div>
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
