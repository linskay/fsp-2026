import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Sparkles, 
  Video, 
  Clock, 
  FileCode, 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  CandidateProfile, 
  Vacancy, 
  AlgorithmTask, 
  EmployerAssessmentTask, 
  AssessmentAssignment 
} from '../../types';

interface AssignTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  vacancies: Vacancy[];
  availableTasks: AlgorithmTask[];
  onAssign: (newAssessment: AssessmentAssignment) => void;
}

export const AssignTestModal: React.FC<AssignTestModalProps> = ({
  isOpen,
  onClose,
  candidate,
  vacancies,
  availableTasks,
  onAssign
}) => {
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');
  const [sourceType, setSourceType] = useState<'leetcode_preset' | 'custom_created'>('leetcode_preset');
  
  // LeetCode preset выбор
  const [selectedTaskId, setSelectedTaskId] = useState<string>(availableTasks[0]?.id || '');

  // Конструктор собственной задачи
  const [customTitle, setCustomTitle] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [customDescription, setCustomDescription] = useState('');
  const [customConstraints, setCustomConstraints] = useState('Время выполнения: O(N)\nПамять: O(1)\nПотокобезопасность');
  const [customStarterJava, setCustomStarterJava] = useState('public class Solution {\n    public int solve(int[] input) {\n        // Напишите ваше решение здесь\n        return 0;\n    }\n}');
  const [customStarterPython, setCustomStarterPython] = useState('def solve(input_data):\n    # Напишите ваше решение здесь\n    pass');
  const [testCaseInput, setTestCaseInput] = useState('[1, 2, 3, 4]');
  const [testCaseOutput, setTestCaseOutput] = useState('10');

  // Параметры проведения
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(45);
  const [isLiveInterview, setIsLiveInterview] = useState<boolean>(true);
  const [telemostUrl, setTelemostUrl] = useState<string>(() => {
    const randomRoomId = Math.floor(10000000000000 + Math.random() * 90000000000000);
    return `https://telemost.yandex.ru/j/${randomRoomId}`;
  });

  if (!isOpen) return null;

  const handleGenerateNewTelemost = () => {
    const randomRoomId = Math.floor(10000000000000 + Math.random() * 90000000000000);
    const newUrl = `https://telemost.yandex.ru/j/${randomRoomId}`;
    setTelemostUrl(newUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let taskData: EmployerAssessmentTask;

    if (sourceType === 'leetcode_preset') {
      const selectedAlgo = availableTasks.find(t => t.id === selectedTaskId) || availableTasks[0];
      taskData = {
        id: `task-${Date.now()}`,
        sourceType: 'leetcode_preset',
        title: selectedAlgo.title,
        difficulty: selectedAlgo.difficulty,
        description: selectedAlgo.description,
        constraints: selectedAlgo.constraints,
        starterCode: {
          javascript: selectedAlgo.starterCode.javascript,
          python: selectedAlgo.starterCode.python,
          java: selectedAlgo.starterCode.java,
          cpp: selectedAlgo.starterCode.cpp,
          go: selectedAlgo.starterCode.go
        },
        sampleTestCases: selectedAlgo.openTestCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
      };
    } else {
      taskData = {
        id: `custom-task-${Date.now()}`,
        sourceType: 'custom_created',
        title: customTitle.trim() || 'Индивидуальная инженерная задача компании',
        difficulty: customDifficulty,
        description: customDescription.trim() || 'Реализуйте эффективный алгоритм согласно требованиям ТЗ.',
        constraints: customConstraints.split('\n').filter(Boolean),
        starterCode: {
          java: customStarterJava,
          python: customStarterPython
        },
        sampleTestCases: [
          {
            input: testCaseInput,
            expectedOutput: testCaseOutput
          }
        ]
      };
    }

    const selectedVac = vacancies.find(v => v.id === selectedVacancyId);

    const newAssessment: AssessmentAssignment = {
      id: `asmt-${Date.now()}`,
      employerId: selectedVac?.employerId || 'emp-1',
      companyName: selectedVac?.companyName || 'Компания-работодатель',
      companyLogo: selectedVac?.companyLogo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
      vacancyId: selectedVac?.id,
      vacancyTitle: selectedVac?.title || 'Инженерная позиция',
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      task: taskData,
      status: 'pending',
      timeLimitMinutes,
      createdAt: new Date().toISOString(),
      isLiveInterview,
      telemostRoomUrl: isLiveInterview ? telemostUrl : undefined,
      scheduledInterviewAt: isLiveInterview ? new Date(Date.now() + 86400000).toISOString() : undefined
    };

    onAssign(newAssessment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#0d121f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh] modal-animate">
        {/* Хедер модалки */}
        <div className="p-6 border-b border-white/10 bg-[#0d121f] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Назначить техническое тестирование
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Кандидат: <span className="text-white font-medium">{candidate.fullName}</span> ({candidate.fspRank})
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

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Привязка к вакансии */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Вакансия компании
            </label>
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b1026] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none"
            >
              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.salaryMin.toLocaleString('ru-RU')} – {v.salaryMax.toLocaleString('ru-RU')} ₽)
                </option>
              ))}
            </select>
          </div>

          {/* Переключатель источника задачи */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Тип задачи
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSourceType('leetcode_preset')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  sourceType === 'leetcode_preset'
                    ? 'border-[#2b35ff] bg-[#2b35ff]/10 text-white shadow-lg shadow-[#2b35ff]/20'
                    : 'border-white/10 bg-[#0b1026] text-slate-400 hover:bg-white/5'
                }`}
              >
                <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 ${sourceType === 'leetcode_preset' ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-sm">LeetCode / Арена ФСП</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Готовые алгоритмические задачи с проверенными тест-кейсами
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('custom_created')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  sourceType === 'custom_created'
                    ? 'border-[#2b35ff] bg-[#2b35ff]/10 text-white shadow-lg shadow-[#2b35ff]/20'
                    : 'border-white/10 bg-[#0b1026] text-slate-400 hover:bg-white/5'
                }`}
              >
                <FileCode className={`w-5 h-5 shrink-0 mt-0.5 ${sourceType === 'custom_created' ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-sm">Собственная задача компании</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Конструктор: ваше ТЗ, стартовый код и тестовые данные
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Вариант 1: Выбор задачи LeetCode */}
          {sourceType === 'leetcode_preset' && (
            <div className="p-4 rounded-xl bg-[#0b1026] border border-white/10 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Выберите алгоритмическую задачу:
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a19] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none"
              >
                {availableTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.difficulty}] {t.title} (+{t.fspRatingWeight} ELO)
                  </option>
                ))}
              </select>

              {/* Превью выбранной задачи */}
              {(() => {
                const currentTask = availableTasks.find(t => t.id === selectedTaskId) || availableTasks[0];
                return (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentTask.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                        currentTask.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {currentTask.difficulty}
                      </span>
                      <span className="text-slate-400">Лимит: {currentTask.timeLimitMs} мс</span>
                    </div>
                    <p className="line-clamp-2 text-slate-400 mt-1">{currentTask.description}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Вариант 2: Конструктор собственной задачи */}
          {sourceType === 'custom_created' && (
            <div className="p-4 rounded-xl bg-[#0b1026] border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Название задачи
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Разработка высоконагруженного Rate Limiter"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Сложность
                  </label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none"
                  >
                    <option value="Easy">Easy (Джуниор)</option>
                    <option value="Medium">Medium (Мидл)</option>
                    <option value="Hard">Hard (Сеньор / Highload)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Условие задачи и бизнес-требования (Текстовый редактор)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Опишите входные данные, ожидаемый результат и граничные случаи..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ограничения и требования по сложности (по строкам)
                </label>
                <textarea
                  rows={2}
                  value={customConstraints}
                  onChange={(e) => setCustomConstraints(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-slate-300 text-xs focus:border-[#2b35ff] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Стартовый шаблон (Java)
                  </label>
                  <textarea
                    rows={4}
                    value={customStarterJava}
                    onChange={(e) => setCustomStarterJava(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-slate-300 text-xs focus:border-[#2b35ff] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Стартовый шаблон (Python)
                  </label>
                  <textarea
                    rows={4}
                    value={customStarterPython}
                    onChange={(e) => setCustomStarterPython(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060a19] border border-white/10 text-slate-300 text-xs focus:border-[#2b35ff] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Пример ввода (Input)</label>
                  <input
                    type="text"
                    value={testCaseInput}
                    onChange={(e) => setTestCaseInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#060a19] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ожидаемый вывод (Expected)</label>
                  <input
                    type="text"
                    value={testCaseOutput}
                    onChange={(e) => setTestCaseOutput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#060a19] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Параметры проведения тестирования */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Лимит времени на решение
              </label>
              <select
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1026] border border-white/10 text-white text-sm focus:border-[#2b35ff] focus:outline-none"
              >
                <option value={30}>30 минут (Экспресс-скрининг)</option>
                <option value={45}>45 минут (Стандарт)</option>
                <option value={60}>60 минут (Углубленный лайв-кодинг)</option>
                <option value={120}>2 часа (Архитектурное ТЗ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-red-400" />
                Формат проведения
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLiveInterview(true)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    isLiveInterview
                      ? 'border-red-500/50 bg-red-500/15 text-red-200'
                      : 'border-white/10 bg-[#0b1026] text-slate-400'
                  }`}
                >
                  Лайв в Телемосте
                </button>
                <button
                  type="button"
                  onClick={() => setIsLiveInterview(false)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    !isLiveInterview
                      ? 'border-blue-500/50 bg-blue-500/15 text-blue-200'
                      : 'border-white/10 bg-[#0b1026] text-slate-400'
                  }`}
                >
                  Асинхронно
                </button>
              </div>
            </div>
          </div>

          {/* Блок Яндекс Телемоста */}
          {isLiveInterview && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Video className="w-4 h-4" />
                  Ссылка на видеокомнату Яндекс Телемост
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNewTelemost}
                  className="text-[11px] text-red-300 hover:text-white underline"
                >
                  Сгенерировать новую комнату
                </button>
              </div>
              <input
                type="url"
                value={telemostUrl}
                onChange={(e) => setTelemostUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-red-500/30 text-red-200 text-xs font-mono focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Кандидат получит приглашение с этой ссылкой и сможет подключиться прямо перед стартом кодинга.
              </p>
            </div>
          )}

          {/* Футер модалки */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2b35ff] to-[#00f0ff] hover:opacity-90 text-white text-sm font-semibold shadow-lg shadow-[#2b35ff]/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Отправить тестирование</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
