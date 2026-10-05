import React, { useState } from 'react';
import { 
  Presentation, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Play, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  Code2, 
  Lock, 
  Layers
} from 'lucide-react';
import { UserRole } from '../../types';

interface RoadmapPresentationProps {
  onNavigateToRole: (role: UserRole) => void;
  onRunDemoScenario: () => void;
}

export const RoadmapPresentation: React.FC<RoadmapPresentationProps> = ({
  onNavigateToRole,
  onRunDemoScenario
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const roadmapDays = [
    {
      day: 'День 1-2: MVP & Инфраструктура',
      status: 'Завершено (100%)',
      points: [
        'Настройка Docker Compose (Postgres 16, Redis, Keycloak 24, Judge0 Sandbox)',
        'Базовая архитектура Spring Boot 3 + Spring Data JPA + Flyway',
        'Сущности кандидатов, компаний и вакансий',
        'Интеграция Keycloak SSO для ФСП ID и 152-ФЗ согласий'
      ]
    },
    {
      day: 'День 3: Core-фичи & Judge0 Sandbox',
      status: 'Завершено (100%)',
      points: [
        'Банк алгоритмических задач разной сложности (LeetCode style)',
        'Интерактивная браузерная IDE с замером времени (ms) и памяти (MB)',
        'Открытые и скрытые тест-кейсы в изолированном контейнере',
        'Автоматический расчет ELO рейтинга и присвоение грейда (Junior/Middle/Senior)',
        'Ограничение пересдачи не чаще 1 раза в 3 месяца'
      ]
    },
    {
      day: 'День 4: Обратный найм & Матчинг',
      status: 'Завершено (100%)',
      points: [
        'Обратная механика найма (Reverse Hiring): работодатель делает первый шаг',
        'Обязательное указание вилки заработной платы «от-до» в рублях',
        'Интеллектуальное ранжирование с объяснимостью (Explainable AI / Scoring)',
        '152-ФЗ маскирование контактов до явного согласия кандидата на оффер',
        'Встроенный защищенный мессенджер для коммуникации'
      ]
    },
    {
      day: 'День 5: Финализация & Документация',
      status: 'Завершено (100%)',
      points: [
        'Springdoc OpenAPI (Swagger UI 3.0) спецификация всех REST эндпоинтов',
        'AI-парсер PDF-резюме и генератор стандартизированного паспорта ФСП',
        'Сквозной интерактивный сценарий демонстрации для жюри хакатона',
        'Финальный аудит безопасности и чистый UI в фирменном стиле ФСП РФ'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/50 via-[#12192e] to-blue-950/50 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Presentation className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Хакатон Презентация & План реализации (Roadmap)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  MVP Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Цифровая платформа-агрегатор ИТ-вакансий с обратной механикой найма и верифицированным профилем ФСП
              </p>
            </div>
          </div>

          <button
            onClick={onRunDemoScenario}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Запустить сквозной демо-сценарий</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars of FSP Career Arena */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 w-fit">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Верификация ФСП</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Подтвержденные спортивные разряды (Мастер спорта РФ, КМС), ELO рейтинг и результаты соревнований ФСП.
          </p>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-emerald-600/20 text-emerald-400 w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">2. Обратный найм</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Никаких слепых откликов. Работодатели сами находят кандидата и предлагают конкретные условия.
          </p>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 w-fit">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">3. Обязательная вилка ₽</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Запрет публикаций без диапазона «от-до» в рублях. Полная прозрачность оклада до начала общения.
          </p>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-rose-600/20 text-rose-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">4. 152-ФЗ Защита данных</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Телефон и Telegram кандидата замаскированы и раскрываются работодателю только после согласия соискателя.
          </p>
        </div>

      </div>

      {/* 5-Day Roadmap Timeline */}
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            План разработки хакатона (5 Days Roadmap)
          </h2>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Все этапы реализованы в полном объеме
          </span>
        </div>

        <div className="space-y-4">
          {roadmapDays.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">
                    {idx + 1}
                  </span>
                  {step.day}
                </h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {step.status}
                </span>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {step.points.map((pt, pidx) => (
                  <li key={pidx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
