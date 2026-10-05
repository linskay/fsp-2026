import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  X, 
  Check, 
  Lock, 
  CheckCircle2, 
  Download, 
  AlertCircle 
} from 'lucide-react';

export const FSP_PRIVACY_PDF_URL = 'https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf';

interface FspPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentGiven?: () => void;
}

export const FspPrivacyModal: React.FC<FspPrivacyModalProps> = ({
  isOpen,
  onClose,
  onConsentGiven
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto font-['JetBrains_Mono']">
      <div className="relative w-full max-w-2xl bg-[#090d1a] border border-[#1e294b] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#141b2e] bg-[#0c1224] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                152-ФЗ: Обработка персональных данных
              </h3>
              <p className="text-xs text-slate-400">
                Официальный регламент Федерации спортивного программирования России
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300 leading-relaxed max-h-[420px] overflow-y-auto">
          
          <div className="p-4 rounded-2xl bg-[#0c1224] border border-[#162038] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00f0ff]" />
                Официальный юридический документ ФСП РФ
              </div>
              <p className="text-[11px] text-slate-400">
                «Положение об обработке и защите персональных данных в Федерации спортивного программирования»
              </p>
            </div>

            <a
              href={FSP_PRIVACY_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#2b35ff] hover:bg-[#3d49ff] text-white text-xs font-bold transition-all shadow-md shadow-[#2b35ff]/30 flex items-center gap-2 shrink-0"
            >
              <span>Открыть PDF ФСП</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Ключевые положения 152-ФЗ на платформе FSP Career Arena:</h4>
            
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-[#080c18] border border-[#141b2e] space-y-1">
                <strong className="text-[#00f0ff] block">1. Маскирование контактных данных (Reverse Privacy)</strong>
                <p className="text-[11px] text-slate-400">
                  Номер телефона, реальный Telegram и email соискателя скрыты от всех работодателей. Контакты раскрываются только в том случае, если кандидат лично нажимает кнопку «Принять оффер» с конкретной зарплатной вилкой.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c18] border border-[#141b2e] space-y-1">
                <strong className="text-[#00f0ff] block">2. Цели сбора данных</strong>
                <p className="text-[11px] text-slate-400">
                  Верификация спортивного звания и рейтинга ELO по реестру ФСП РФ, автоматическое сопоставление стека технологий с открытыми вакансиями и предоставление доступа к песочнице тестирования Judge0.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c18] border border-[#141b2e] space-y-1">
                <strong className="text-[#00f0ff] block">3. Запрет передачи третьим лицам</strong>
                <p className="text-[11px] text-slate-400">
                  Платформа не осуществляет передачу персональных данных сторонним рекламным или спам-системам. Передача осуществляется только целевому HR-департаменту при взаимном согласии сторон.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c18] border border-[#141b2e] space-y-1">
                <strong className="text-[#00f0ff] block">4. Право на отзыв согласия</strong>
                <p className="text-[11px] text-slate-400">
                  Пользователь вправе в любой момент отозвать согласие или скрыть свой профиль из поисковой выдачи работодателей в настройках личного кабинета.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#060811] border-t border-[#141b2e] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141b2e] hover:bg-[#1c2848] text-slate-300 font-bold text-xs transition-colors"
          >
            Закрыть
          </button>

          {onConsentGiven && (
            <button
              onClick={() => {
                onConsentGiven();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Принять условия 152-ФЗ</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export const FspConsentCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  onOpenPrivacyModal: () => void;
  className?: string;
}> = ({ checked, onChange, onOpenPrivacyModal, className = '' }) => {
  return (
    <div className={`flex items-start gap-2.5 ${className} font-['JetBrains_Mono']`}>
      <input
        type="checkbox"
        id="fsp-152fz-consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-[#070b16] text-[#2b35ff] focus:ring-[#2b35ff] cursor-pointer"
      />
      <label htmlFor="fsp-152fz-consent" className="text-[11px] text-slate-400 leading-snug cursor-pointer select-none">
        Я согласен на обработку персональных данных в соответствии с{' '}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onOpenPrivacyModal();
          }}
          className="text-[#00f0ff] hover:underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
        >
          <span>Положением ФСП (152-ФЗ)</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </label>
    </div>
  );
};
