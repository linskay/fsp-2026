import React, { useState } from 'react';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Lock, 
  MessageSquare, 
  Clock, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  UserCheck 
} from 'lucide-react';
import { AssessmentAssignment, EmployerAssessmentReview } from '../../types';

interface TestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentAssignment;
  onSaveReview: (assessmentId: string, review: EmployerAssessmentReview) => void;
}

export const TestReviewModal: React.FC<TestReviewModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onSaveReview
}) => {
  const [verdict, setVerdict] = useState<'like' | 'dislike'>(assessment.review?.verdict || 'like');
  const [internalNote, setInternalNote] = useState(
    assessment.review?.internalNote || 
    'Кандидат показал отличное владение многопоточностью, чистый стиль кода и понимание CAS-операций. Рекомендуем выставлять оффер.'
  );
  const [candidateFeedbackMessage, setCandidateFeedbackMessage] = useState(
    assessment.review?.candidateFeedbackMessage || 
    'Спасибо за отличное выполнение технического задания! Ваше решение полностью соответствует стандартам Highload-разработки нашей команды.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const review: EmployerAssessmentReview = {
      verdict,
      internalNote: internalNote.trim(),
      candidateFeedbackMessage: candidateFeedbackMessage.trim(),
      reviewedAt: new Date().toISOString(),
      reviewerName: 'Технический лидер команды'
    };

    onSaveReview(assessment.id, review);
    onClose();
  };

  const submission = assessment.submission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-[#070b19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Хедер */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#0d1430] to-[#070b19] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Ревью и оценка технического решения
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Соискатель: <span className="text-white font-semibold">{assessment.candidateName}</span> • Задача: <span className="text-cyan-300 font-medium">{assessment.task.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Тело модалки */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Сводка по сдаче теста */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0b1026] border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Время решения
              </span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{submission?.spentTimeMinutes || 28} мин / {assessment.timeLimitMinutes} мин</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b1026] border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Тест-кейсы
              </span>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submission?.passedCount ?? 4} из {submission?.totalCount ?? 4} пройдены (100%)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b1026] border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Язык реализации
              </span>
              <div className="text-base font-bold text-amber-400 uppercase font-mono">
                {submission?.language || 'JAVA'}
              </div>
            </div>
          </div>

          {/* Код кандидата */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Код решения соискателя
              </label>
              {assessment.telemostRoomUrl && (
                <a
                  href={assessment.telemostRoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-medium hover:underline"
                >
                  <Video className="w-3.5 h-3.5" />
                  Открыть запись / комнату Телемоста
                </a>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-[#04060d] p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-60 leading-relaxed">
              <pre>{submission?.code || '// Код еще не отправлен'}</pre>
            </div>

            {submission?.executionLogs && (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                {submission.executionLogs}
              </div>
            )}
          </div>

          {/* Форма оценки и фидбека */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-2 border-t border-white/10">
            {/* Вердикт: Лайк / Дизлайк */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Вердикт работодателя (Оценка решения)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVerdict('like')}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-sm transition-all ${
                    verdict === 'like'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                      : 'border-white/10 bg-[#0b1026] text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${verdict === 'like' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>Рекомендовать к найму (Лайк 👍)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerdict('dislike')}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-sm transition-all ${
                    verdict === 'dislike'
                      ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20 ring-1 ring-rose-400'
                      : 'border-white/10 bg-[#0b1026] text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <ThumbsDown className={`w-5 h-5 ${verdict === 'dislike' ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>Не соответствует требованиям (Дизлайк 👎)</span>
                </button>
              </div>
            </div>

            {/* Внутренняя приватная заметка (152-ФЗ) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Внутренний комментарий для компании (Приватно, скрыт от соискателя)
              </label>
              <textarea
                rows={3}
                required
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Заметка для тимлида и HR: сильные стороны, недочеты в архитектуре, окладные ожидания..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1026] border border-amber-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                🔒 Защищено политикой платформы: этот текст видит только внутренняя HR/Tech команда вашей компании.
              </p>
            </div>

            {/* Сообщение для кандидата */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Сообщение для соискателя (Будет отправлено в личный кабинет)
              </label>
              <textarea
                rows={3}
                required
                value={candidateFeedbackMessage}
                onChange={(e) => setCandidateFeedbackMessage(e.target.value)}
                placeholder="Напишите обратную связь кандидату: что понравилось, следующие шаги или рекомендации..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1026] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Кнопки */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Закрыть
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Сохранить оценку и отправить фидбек</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
