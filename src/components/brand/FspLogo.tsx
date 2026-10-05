import React from 'react';

interface FspLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'tricolor' | 'white' | 'blue';
  showText?: boolean;
  className?: string;
}

export const FspStarIcon: React.FC<{ className?: string; variant?: 'tricolor' | 'white' | 'blue' }> = ({
  className = 'w-8 h-8',
  variant = 'tricolor'
}) => {
  const redColor = variant === 'white' ? '#FFFFFF' : variant === 'blue' ? '#2B35FF' : '#FF2B42';
  const blueColor = variant === 'white' ? '#FFFFFF' : variant === 'blue' ? '#2B35FF' : '#2B35FF';
  const whiteColor = variant === 'blue' ? '#2B35FF' : '#E2E8F0';

  return (
    <svg viewBox="0 0 240 230" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Red Node Branch */}
      <g>
        <path d="M120 28 L152 74" stroke={redColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M152 74 L208 84" stroke={redColor} strokeWidth="18" strokeLinecap="round" />
        <circle cx="120" cy="28" r="22" fill={redColor} />
        <circle cx="152" cy="74" r="22" fill={redColor} />
        <circle cx="208" cy="84" r="22" fill={redColor} />
      </g>

      {/* Bottom Right Blue Node Branch */}
      <g>
        <path d="M168 140 L188 194" stroke={blueColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M188 194 L138 180" stroke={blueColor} strokeWidth="18" strokeLinecap="round" />
        <circle cx="168" cy="140" r="22" fill={blueColor} />
        <circle cx="188" cy="194" r="22" fill={blueColor} />
        <circle cx="138" cy="180" r="22" fill={blueColor} />
      </g>

      {/* Left Silver/White Node Branch */}
      <g>
        <path d="M40 88 L82 104" stroke={whiteColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M82 104 L68 162" stroke={whiteColor} strokeWidth="18" strokeLinecap="round" />
        <circle cx="40" cy="88" r="22" fill={whiteColor} />
        <circle cx="82" cy="104" r="22" fill={whiteColor} />
        <circle cx="68" cy="162" r="22" fill={whiteColor} />
      </g>
    </svg>
  );
};

export const FspLogo: React.FC<FspLogoProps> = ({
  size = 'md',
  variant = 'tricolor',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <FspStarIcon className={`${currentSize.icon} drop-shadow-[0_0_12px_rgba(43,53,255,0.4)]`} variant={variant} />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-wider text-white font-['JetBrains_Mono'] ${currentSize.text} leading-tight`}>
              ФСП <span className="text-[#00f0ff]">CAREER</span> ARENA
            </span>
          </div>
          <span className={`text-slate-400 font-medium tracking-tight font-['JetBrains_Mono'] ${currentSize.sub} leading-tight mt-0.5`}>
            Федерация спортивного программирования России
          </span>
        </div>
      )}
    </div>
  );
};

export const FspFooterPartners: React.FC = () => {
  return (
    <footer className="border-t border-[#141b2e] bg-[#04060d] py-7 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400 font-['JetBrains_Mono']">
        
        {/* Left: Partner and Founder Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#ff2b42] shadow-[0_0_6px_rgba(255,43,66,0.6)]" />
            Министерство спорта РФ
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2b35ff] shadow-[0_0_6px_rgba(43,53,255,0.6)]" />
            Минцифры России
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            Корпорация Синергия
          </span>
        </div>

        {/* Center/Right: 152-FZ Legal compliance with direct link to PDF */}
        <div className="text-center text-[11px] text-slate-400 flex items-center flex-wrap justify-center gap-2">
          <span>Соблюдение 152-ФЗ РФ</span>
          <span>•</span>
          <a
            href="https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00f0ff] hover:underline font-bold transition-colors inline-flex items-center gap-1"
          >
            Положение об обработке ПДн (.pdf)
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-center md:text-right text-[11px] text-slate-400 font-mono font-bold">
          No PHP - No Problems, 2026
        </div>

      </div>
    </footer>
  );
};

export const FspCircuitBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg className={`pointer-events-none absolute inset-0 w-full h-full opacity-15 ${className}`} viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 80 H250 C320 80 380 140 380 210 V380 C380 450 440 510 510 510 H750" stroke="#2B35FF" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="50" cy="80" r="5" fill="#2B35FF" />
      <circle cx="250" cy="80" r="4" fill="#2B35FF" />
      <circle cx="750" cy="510" r="5" fill="#00F0FF" />

      <path d="M850 60 V180 C850 240 790 300 730 300 H550 C490 300 430 360 430 420 V540" stroke="#00F0FF" strokeWidth="1.5" />
      <circle cx="850" cy="60" r="4" fill="#00F0FF" />
      <circle cx="430" cy="540" r="4" fill="#2B35FF" />
    </svg>
  );
};
