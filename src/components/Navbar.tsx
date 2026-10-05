import React from 'react';
import { Award, ShieldCheck, Building2, Code2, BookOpen, Presentation, UserCheck, Lock, Github } from 'lucide-react';
import { UserRole } from '../types';
import { FspLogo } from './brand/FspLogo';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  invitationsCount: number;
  acceptedOffersCount: number;
  onOpenOAuthModal?: () => void;
  isOAuthConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  invitationsCount,
  acceptedOffersCount,
  onOpenOAuthModal,
  isOAuthConnected = true
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#060811]/95 backdrop-blur-md border-b border-[#141b2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Official FSP Brand Logo */}
          <div 
            onClick={() => onRoleChange('candidate')} 
            className="cursor-pointer group select-none shrink-0"
          >
            <FspLogo size="md" variant="tricolor" showText={true} />
          </div>

          {/* Right: Navigation Tabs & Verified Badge */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <nav className="flex items-center gap-1 bg-[#0b0f1d] p-1.5 rounded-2xl border border-[#162038]">
              <button
                onClick={() => onRoleChange('candidate')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentRole === 'arena'
                    ? 'bg-[#2b35ff] text-[#00f0ff] shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>LeetCode Арена</span>
              </button>

              <button
                onClick={() => onRoleChange('swagger')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentRole === 'swagger'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Swagger API</span>
              </button>

              <button
                onClick={() => onRoleChange('architecture')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentRole === 'architecture'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Архитектура</span>
              </button>

              <button
                onClick={() => onRoleChange('roadmap')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentRole === 'roadmap'
                    ? 'bg-[#2b35ff] text-white shadow-md shadow-[#2b35ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121930]'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Roadmap</span>
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
          </div>

        </div>
      </div>
    </header>
  );
};
