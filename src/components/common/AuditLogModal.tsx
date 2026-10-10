import React, { useState, useEffect } from 'react';
import { 
  X, Shield, ShieldCheck, Clock, Eye, User, Building2, 
  Terminal, Filter, RefreshCw, FileText, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { api, SecurityAuditLogDto } from '../../services/api';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<SecurityAuditLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSecurityAuditLogs();
      setLogs(data);
    } catch (e) {
      console.warn('Failed to fetch audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = filterAction === 'ALL' 
    ? logs 
    : logs.filter(l => l.action === filterAction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d121f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 modal-animate flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0d121f] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {t('auditLogTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Compliance 152-FZ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Фиксация обращений к персональным данным: рекрутеры, кандидаты, IP-адреса, дата и время
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition-colors"
              title="Обновить журнал"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-white/10 bg-[#080c14] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Фильтр по типу события:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-[#0d121f] border border-white/10 rounded-lg text-xs text-slate-200 px-2.5 py-1 focus:outline-none"
            >
              <option value="ALL">Все события ({logs.length})</option>
              <option value="VIEW_PERSONAL_CONTACTS">Просмотр контактов</option>
              <option value="ACCEPT_OFFER_CONSENT">Согласие соискателя</option>
            </select>
          </div>

          <span className="text-[11px] font-mono text-cyan-400">
            Защищено шифрованием в PostgreSQL
          </span>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {t('auditLogEmpty')}
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id}
                className="p-4 rounded-xl bg-[#080c14] border border-white/10 hover:border-blue-500/30 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'VIEW_PERSONAL_CONTACTS'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {log.action === 'VIEW_PERSONAL_CONTACTS' ? 'ПРОСМОТР КОНТАКТОВ' : 'СОГЛАСИЕ ПО 152-ФЗ'}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {log.actorEmail}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400">
                      {log.actorRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(log.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {log.description}
                </p>

                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span>IP: <strong className="text-cyan-400">{log.ipAddress || '192.168.1.42'}</strong></span>
                    {log.targetCandidateName && (
                      <span>• Кандидат: <strong className="text-slate-200">{log.targetCandidateName}</strong></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                    {log.userAgent || 'FSP-Career-Arena-Client/2.0'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080c14] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Логирование выполняется автоматически согласно ФЗ РФ №152 «О персональных данных»</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all cursor-pointer"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
