import React from 'react';
import { Award, ShieldCheck, Building2, Code2, BookOpen, Presentation, UserCheck, Lock, Github, Sparkles } from 'lucide-react';
import { CandidateProfile, UserRole } from '../types';
import { FspLogo } from './brand/FspLogo';
import { UserAvatar } from './brand/UserAvatar';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  invitationsCount: number;
  acceptedOffersCount: number;
  onOpenOAuthModal?: () => void;
  isOAuthConnected?: boolean;
  candidate?: CandidateProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  invitationsCount,
  acceptedOffersCount,
  onOpenOAuthModal,
  isOAuthConnected = true,
  candidate
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#060811]/95 backdrop-blur-md border-b border-[#141b2e]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Official FSP Brand Logo */}
          <div 
            onClick={() => onRoleChange('landing')} 
            className="cursor-pointer group select-none shrink-0"
            title="Перейти на Главный экран"
          >
            <FspLogo size="sm" variant="tricolor" showText={true} />
          </div>

          {/* Right: Navigation Tabs for Main User Experience */}
          <div className="flex items-center gap-2 sm:gap-3 py-1">
            <nav className="flex items-center gap-1 bg-[#0b0f1d] p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-[#162038]">
              <button
                onClick={() => onRoleChange('landing')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'landing'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Главная</span>
              </button>

              <button
                onClick={() => onRoleChange('candidate')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'candidate'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Кандидат</span>
                {invitationsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#ff2b42] text-white text-[10px] font-bold rounded-full">
                    {invitationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onRoleChange('employer')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'employer'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
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
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'arena'
                    ? 'bg-[#2b35ff] text-[#00f0ff] shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Арена</span>
              </button>
            </nav>

            {/* OAuth Login / Connect Button */}
            {onOpenOAuthModal && (
              <button
                onClick={onOpenOAuthModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0f1d] hover:bg-[#12182c] border border-[#2b35ff]/30 text-xs text-slate-300 font-bold transition-all cursor-pointer"
                title="Spring Security OAuth2 Авторизация"
              >
                <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>OAuth</span>
                {isOAuthConnected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            )}

            {/* Keycloak Verified Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b0f1d] border border-[#162038]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] text-slate-300 font-bold">Keycloak SSO</span>
            </div>

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
