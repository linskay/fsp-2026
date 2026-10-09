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
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'landing'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Главная</span>
              </button>

              <button
                onClick={() => onRoleChange('candidate')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'candidate'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
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
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'employer'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
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
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'arena'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-cyan-300 shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Арена</span>
              </button>
            </nav>

            {/* Login Button */}
            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs text-white font-semibold transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:scale-[1.02]"
                title="Войти в личный кабинет"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Войти</span>
              </button>
            )}

            {/* Logged In Candidate Avatar */}
            {candidate && (
              <div
                onClick={() => onRoleChange('candidate')}
                className="flex items-center gap-2.5 pl-1 sm:pl-2 py-1 pr-2 rounded-2xl hover:bg-[#0b0f1d] cursor-pointer transition-colors border border-transparent hover:border-[#162038]"
                title={`Профиль: ${candidate.fullName} (${candidate.fspRank})`}
              >
                <UserAvatar
                  name={candidate.fullName}
                  src={candidate.avatarUrl}
                  size="sm"
                  rank={candidate.fspRank}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[120px]">
                    {candidate.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 leading-tight">
                    {candidate.fspRating} ELO
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
