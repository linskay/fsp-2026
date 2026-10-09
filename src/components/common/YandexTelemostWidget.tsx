import React, { useState } from 'react';
import { Video, Copy, ExternalLink, Check, Calendar, ShieldCheck, Users } from 'lucide-react';

interface YandexTelemostWidgetProps {
  telemostUrl?: string;
  isLive?: boolean;
  scheduledTime?: string;
  roomName?: string;
  onGenerateUrl?: () => string;
}

export const YandexTelemostWidget: React.FC<YandexTelemostWidgetProps> = ({
  telemostUrl,
  isLive = true,
  scheduledTime,
  roomName = 'ФСП Live-Кодинг & Собеседование',
  onGenerateUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(telemostUrl || '');

  const handleCreateRoom = () => {
    if (onGenerateUrl) {
      const newUrl = onGenerateUrl();
      setCurrentUrl(newUrl);
    } else {
      // Генерация детерминированной случайной комнаты Яндекс Телемоста
      const randomRoomId = Math.floor(10000000000000 + Math.random() * 90000000000000);
      const generated = `https://telemost.yandex.ru/j/${randomRoomId}`;
      setCurrentUrl(generated);
    }
  };

  const copyToClipboard = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/30 via-[#0b1026] to-[#0b1026] p-4 text-slate-200 shadow-lg relative overflow-hidden backdrop-blur-md">
      {/* Яндекс Телемост бренд-акцент */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Яндекс Телемост
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 font-mono">
                152-ФЗ РФ
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">{roomName}</h4>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
              <span>HD видеосвязь без ограничений по времени</span>
              {scheduledTime && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3 h-3 text-red-400" />
                  {new Date(scheduledTime).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUrl ? (
            <>
              <button
                type="button"
                onClick={copyToClipboard}
                title="Скопировать ссылку на встречу"
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Войти в Телемост</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCreateRoom}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 font-medium text-xs flex items-center gap-2 transition-all"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>Создать комнату Телемоста</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
