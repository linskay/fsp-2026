import React from 'react';
import { 
  Award, ShieldCheck, Building2, Code2, BookOpen, Presentation, 
  UserCheck, Lock, Github, Sparkles, LogIn, LogOut, KeyRound 
} from 'lucide-react';
import { CandidateProfile, UserRole } from '../types';
import { FspLogo } from './brand/FspLogo';
import { UserAvatar } from './brand/UserAvatar';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  invitationsCount: number;
  acceptedOffersCount: number;
  onOpenOAuthModal?: () => void;
  onOpenLoginModal?: () => void;
  isOAuthConnected?: boolean;
  candidate?: CandidateProfile;
  currentUser?: {
    email: string;
    fullName: string;
    role: 'CANDIDATE' | 'EMPLOYER';
    avatarUrl?: string;
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  invitationsCount,
  acceptedOffersCount,
  onOpenOAuthModal,
  onOpenLoginModal,
  isOAuthConnected = true,
  candidate,
  currentUser,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#04060d]/80 backdrop-blur-2xl border-b border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Official FSP Brand Logo */}
          <div 
            onClick={() => onRoleChange('landing')} 
            className="cursor-pointer group select-none shrink-0 transition-transform hover:scale-[1.02]"
            title="Перейти на Главный экран"
          >
            <FspLogo size="sm" variant="tricolor" showText={true} />
          </div>

          {/* Right: Navigation Tabs for Main User Experience */}
          <div className="flex items-center gap-2 sm:gap-3 py-1">
            <nav className="flex items-center gap-1 bg-white/[0.03] p-1 sm:p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-md shadow-inner">
              <button
                onClick={() => onRoleChange('landing')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap cursor-pointer ${
                  currentRole === 'landing'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Главная</span>
              </button>

              <button
                onClick={() => onRoleChange('candidate')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap cursor-pointer ${
                  currentRole === 'candidate'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Кандидат</span>
                {invitationsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                    {invitationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onRoleChange('employer')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap cursor-pointer ${
                  currentRole === 'employer'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Работодатель</span>
                {acceptedOffersCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                    +{acceptedOffersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onRoleChange('arena')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap cursor-pointer ${
                  currentRole === 'arena'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40 border border-blue-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Арена</span>
              </button>
            </nav>

            {/* User State & Login/Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onRoleChange(currentUser.role === 'EMPLOYER' ? 'employer' : 'candidate')}
                  className="flex items-center gap-2 pl-2 py-1 pr-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors"
                  title={`Вы вошли как ${currentUser.fullName} (${currentUser.email})`}
                >
                  <UserAvatar
                    name={currentUser.fullName}
                    src={currentUser.avatarUrl || candidate?.avatarUrl}
                    size="sm"
                    rank={candidate?.fspRank}
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[120px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 leading-tight">
                      {currentUser.role === 'EMPLOYER' ? 'Работодатель' : `${candidate?.fspRating || 1200} ELO`}
                    </span>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Выйти из аккаунта"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs text-white font-semibold transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:scale-[1.02]"
                  title="Войти в личный кабинет"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Войти</span>
                </button>
              )
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
