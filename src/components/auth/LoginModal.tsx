import React, { useState } from 'react';
import { 
  X, Lock, Mail, Key, UserCheck, Building2, CheckCircle2, 
  AlertCircle, Sparkles, Shield, ArrowRight, Database, Info
} from 'lucide-react';
import { api, AuthLoginResponse, TestUserDto } from '../../services/api';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/[0.08] bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Вход в систему FSP Career Arena
                </h3>
                <p className="text-xs text-slate-400">
                  Авторизация кандидата или работодателя (152-ФЗ РФ)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Database Seed Notice */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-200 leading-relaxed">
              <span className="font-semibold text-white">Тестовые аккаунты из базы данных:</span>
              <p className="text-blue-300/90 mt-0.5">
                Оба пользователя предзагружаются в PostgreSQL перед стартом сервиса миграцией Flyway <code className="px-1 py-0.5 bg-black/40 rounded text-cyan-300 font-mono text-[11px]">V3__seed_test_users.sql</code>.
              </p>
            </div>
          </div>

          {/* Quick 1-Click Fill Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Быстрый выбор тестового аккаунта (1 клик):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Candidate Button */}
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

              {/* Employer Button */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                  placeholder="candidate2026 или employer2026"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
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
                  <span>Проверка учетных данных...</span>
                </>
              ) : (
                <>
                  <span>Войти в аккаунт</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Compliance & Info footer */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Защита по 152-ФЗ РФ</span>
            </div>
            <a 
              href="https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-2 transition-colors"
            >
              Политика ФСП
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
