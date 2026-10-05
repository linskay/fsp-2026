import React, { useState } from 'react';
import { Trophy, Award, Shield, User, Building2, Code2 } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  rank?: string;
  role?: 'candidate' | 'employer';
  className?: string;
}

const GRADIENTS = [
  'from-[#2b35ff] via-[#4338ca] to-[#00f0ff]',
  'from-[#059669] via-[#0d9488] to-[#10b981]',
  'from-[#7c3aed] via-[#6d28d9] to-[#c084fc]',
  'from-[#d97706] via-[#b45309] to-[#f59e0b]',
  'from-[#e11d48] via-[#be123c] to-[#fb7185]',
  'from-[#0284c7] via-[#0369a1] to-[#38bdf8]',
];

function getGradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

function getInitials(name: string): string {
  if (!name) return 'ФСП';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6 text-[10px]', icon: 'w-3 h-3', badge: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5', rounded: 'rounded-lg' },
  sm: { box: 'w-8 h-8 text-xs', icon: 'w-4 h-4', badge: 'w-3 h-3 -bottom-0.5 -right-0.5', rounded: 'rounded-xl' },
  md: { box: 'w-11 h-11 text-sm font-bold', icon: 'w-5 h-5', badge: 'w-4 h-4 -bottom-1 -right-1', rounded: 'rounded-xl' },
  lg: { box: 'w-14 h-14 text-base font-black', icon: 'w-6 h-6', badge: 'w-5 h-5 -bottom-1 -right-1', rounded: 'rounded-2xl' },
  xl: { box: 'w-20 h-20 text-xl font-black', icon: 'w-8 h-8', badge: 'w-6 h-6 -bottom-1 -right-1', rounded: 'rounded-3xl' },
  '2xl': { box: 'w-28 h-28 text-3xl font-black', icon: 'w-10 h-10', badge: 'w-7 h-7 -bottom-1.5 -right-1.5', rounded: 'rounded-3xl' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  src,
  size = 'md',
  rank,
  role = 'candidate',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeConfig = SIZE_MAP[size];
  const gradient = getGradientForName(name);
  const initials = getInitials(name);

  // Sport Rank Badge Icon
  let badgeIcon = null;
  if (rank) {
    if (rank.includes('Мастер') || rank === 'MS') {
      badgeIcon = (
        <div className={`absolute ${sizeConfig.badge} rounded-full bg-amber-500 border-2 border-[#090d1a] flex items-center justify-center text-amber-950 shadow-md`} title="Мастер спорта РФ">
          <Trophy className="w-2.5 h-2.5 text-white" />
        </div>
      );
    } else if (rank.includes('КМС') || rank === 'KMS') {
      badgeIcon = (
        <div className={`absolute ${sizeConfig.badge} rounded-full bg-slate-300 border-2 border-[#090d1a] flex items-center justify-center text-slate-900 shadow-md`} title="КМС">
          <Award className="w-2.5 h-2.5 text-slate-900" />
        </div>
      );
    } else {
      badgeIcon = (
        <div className={`absolute ${sizeConfig.badge} rounded-full bg-blue-500 border-2 border-[#090d1a] flex items-center justify-center text-white shadow-md`} title={rank}>
          <Shield className="w-2.5 h-2.5 text-white" />
        </div>
      );
    }
  }

  const showImage = src && !imgError;

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`${sizeConfig.box} ${sizeConfig.rounded} overflow-hidden border border-[#2b35ff]/30 shadow-lg flex items-center justify-center transition-transform hover:scale-105`}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center text-white relative`}>
            {/* Cyber Grid SVG overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pat-${initials}`} width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pat-${initials})`} />
            </svg>
            <span className="relative z-10 font-mono tracking-tighter drop-shadow-md">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Rank or role badge */}
      {badgeIcon}
    </div>
  );
};
