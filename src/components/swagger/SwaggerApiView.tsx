import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Play, CheckCircle2, Copy, Check, ChevronDown, ChevronRight, Lock, Key, Server, Database, Code2 } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  tags: string[];
  description: string;
  security: string;
  requestBody?: object;
  responseBody: object;
}

export const SwaggerApiView: React.FC = () => {
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/oauth2/authorization/{provider}',
      summary: 'Spring Security OAuth2 Client: Инициализация авторизации (github, yandex, hh)',
      tags: ['Spring Security OAuth2'],
      description: 'Перенаправляет пользователя на страницу входа провайдера (GitHub, Яндекс ID или hh.ru OAuth2) с формированием state и PKCE-челленджа.',
      security: 'Public OAuth2 Redirection',
      responseBody: {
        status: 302,
        redirectUri: 'https://github.com/login/oauth/authorize?client_id=...&scope=read:user,repo&state=sec-state-984'
      }
    },
    {
      method: 'GET',
      path: '/login/oauth2/code/github',
      summary: 'GitHub OAuth Callback & Автонаполнение портфолио',
      tags: ['Spring Security OAuth2'],
      description: 'Spring Security перехватывает код авторизации, запрашивает GitHub API v3, извлекает коммиты, звезды, репозитории и наполняет профиль соискателя.',
      security: 'OAuth2 Authorization Code Grant',
      responseBody: {
        status: 200,
        provider: 'GITHUB',
        username: 'alex-belov-fsp',
        commitsCountYear: 1842,
        reposImported: 3,
        mainLanguage: 'C++ / Java 21',
        portfolioSynchronized: true
      }
    },
    {
      method: 'POST',
      path: '/api/v1/candidate/sync/hh-resume',
      summary: 'Импорт и автопарсинг резюме из hh.ru API v1 (/resumes/mine)',
      tags: ['HeadHunter (hh.ru) API'],
      description: 'Извлекает опыт работы, трудовой стаж, навыки и желаемый оклад соискателя из HeadHunter через OAuth2 токен без ручного ввода.',
      security: 'JWT (Bearer Token) + HH.ru OAuth',
      requestBody: {
        autoFillProfile: true,
        updateSkills: true,
        setDesiredSalary: true
      },
      responseBody: {
        status: 200,
        parsedTitle: 'Lead Java / Highload Backend Engineer',
        experienceYears: 6,
        desiredSalaryRub: 480000,
        skillsExtracted: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Docker'],
        workHistoryEntries: 3
      }
    },
    {
      method: 'POST',
      path: '/api/v1/employer/sync/hh-vacancies',
      summary: 'hh.ru for Employers: Импорт активных вакансий компании в 1 клик',
      tags: ['HeadHunter (hh.ru) API'],
      description: 'Авторизует рекрутера и импортирует существующие вакансии компании из hh.ru API с валидацией рублевой вилки оклада.',
      security: 'JWT (Role: ROLE_EMPLOYER) + HH Recruiter Scope',
      requestBody: {
        vacancyIds: ['hh-vac-1', 'hh-vac-2'],
        fspRatingPreferenceRequired: true
      },
      responseBody: {
        status: 200,
        importedCount: 2,
        vacanciesCreated: [
          {
            id: 'vac-109',
            title: 'Senior Java Backend Engineer (Core Banking)',
            salaryFork: '420 000 – 550 000 ₽',
            fspWeightedMatchingActive: true
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/auth/keycloak-fsp-token',
      summary: 'Аутентификация через Keycloak SSO ФСП РФ',
      tags: ['Authentication & SSO'],
      description: 'Верифицирует OpenID Connect токен спортсмена, синхронизирует профиль с базой данных ФСП РФ и выпускает JWT токен платформы.',
      security: 'OAuth2 / Bearer Token',
      requestBody: {
        keycloakAccessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmc3Atc3NvLTIwMjYifQ...',
        fspId: 'FSP-RU-2024-0042',
        clientScope: 'fsp_athlete_profile 152fz_consent'
      },
      responseBody: {
        status: 200,
        jwt: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmZXN0LWF0aGxldGUtMDA0MiIsImZzcFJhbmsiOiJNYXN0ZXJPZlNwb3J0cyJ9...',
        expiresIn: 86400,
        athlete: {
          fspId: 'FSP-RU-2024-0042',
          fspRank: 'Мастер спорта РФ',
          fspRating: 2740,
          verified: true
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/candidates/ranked',
      summary: 'Умное ранжирование кандидатов для работодателей',
      tags: ['Candidates & Matching'],
      description: 'Возвращает ранжированный список соискателей с весами ФСП (35% спортивный титул + 30% скорость Judge0 + 25% стек технологий + 10% стаж).',
      security: 'JWT (Role: ROLE_EMPLOYER)',
      responseBody: {
        totalFound: 42,
        page: 0,
        size: 20,
        rankingAlgorithm: 'FSP-Weighted-Match-v2',
        candidates: [
          {
            id: 'cand-1',
            fullName: 'Александр Белов',
            fspRank: 'Мастер спорта РФ',
            fspRating: 2740,
            assignedGrade: 'SENIOR',
            phoneMasked: '+7 (916) •••-••-42',
            matchScore: 99.4,
            explainReason: '1 место Чемпионат РФ + 6.8мс время решения + Java 21 / Spring Boot 3 100%'
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/judge0/submit-task',
      summary: 'Отправка алгоритмического решения в Judge0 Sandbox',
      tags: ['Judge0 Code Sandbox'],
      description: 'Компилирует и запускает код в защищенном Docker-контейнере с открытыми и скрытыми тест-кейсами. Автоматически присваивает грейд.',
      security: 'JWT (Role: ROLE_CANDIDATE)',
      requestBody: {
        taskId: 'fsp-task-1',
        languageId: 63, // JavaScript / Java / C++
        sourceCode: 'class LRUCache { ... }',
        timeLimitMs: 150,
        memoryLimitMb: 64
      },
      responseBody: {
        status: 'ACCEPTED',
        allTestsPassed: true,
        openTestsPassed: 2,
        hiddenTestsPassed: 2,
        executionTimeMs: 6.8,
        memoryMb: 18.2,
        fspEloEarned: 120,
        gradeCalculated: 'SENIOR',
        cooldownExpiryDate: '2026-06-12T14:30:00Z'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/vacancies',
      summary: 'Создание вакансии с обязательной валидацией вилки зарплаты в ₽',
      tags: ['Vacancies'],
      description: 'Публикует потребность компании. Сервер отклоняет вакансии без вилки зарплаты «от-до» или с salaryMax < salaryMin.',
      security: 'JWT (Role: ROLE_EMPLOYER)',
      requestBody: {
        title: 'Lead Java Architect (HighLoad)',
        specialization: 'backend',
        gradeRequired: 'senior',
        salaryMin: 450000,
        salaryMax: 600000,
        currency: 'RUB',
        techStack: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL'],
        fspBonusPreference: 'Разряд КМС / МС'
      },
      responseBody: {
        id: 'vac-1',
        createdAt: '2026-03-12T10:00:00Z',
        active: true,
        validationStatus: 'PASSED_MANDATORY_SALARY_FORK'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/invitations/send-offer',
      summary: 'Отправка персонального предложения кандидату (Reverse Hiring)',
      tags: ['Reverse Hiring & Offers'],
      description: 'Работодатель отправляет оффер с конкретным окладом в рамках вилки. Контакты кандидата остаются замаскированными до его согласия.',
      security: 'JWT (Role: ROLE_EMPLOYER)',
      requestBody: {
        candidateId: 'cand-1',
        vacancyId: 'vac-1',
        proposedSalaryRub: 520000,
        personalMessage: 'Приглашаем на позицию Lead Java Architect с окладом 520 000 ₽ на руки.'
      },
      responseBody: {
        invitationId: 'inv-101',
        status: 'SENT',
        contactsRevealed: false,
        complianceNotice: '152-FZ contact masking active until candidate consents'
      }
    },
    {
      method: 'PUT',
      path: '/api/v1/invitations/{id}/accept-consent-152fz',
      summary: 'Принятие оффера соискателем и демаскирование контактов по 152-ФЗ',
      tags: ['Privacy & 152-FZ'],
      description: 'Кандидат соглашается на оффер. Система записывает согласие в журнал 152-ФЗ и безопасно открывает телефон и Telegram работодателю.',
      security: 'JWT (Role: ROLE_CANDIDATE)',
      responseBody: {
        invitationId: 'inv-1',
        status: 'ACCEPTED',
        contactsRevealed: true,
        candidateContacts: {
          phone: '+7 (916) 459-33-42',
          telegram: '@alex_belov_dev'
        },
        audit152fzLogId: 'audit-log-2026-99128'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/errors/sample-validation-failure',
      summary: 'GlobalExceptionHandler: Единый формат ошибок и DTO валидации',
      tags: ['Global Exception Handler (400 / 404 / 502)'],
      description: 'Демонстрация унифицированного ответа об ошибке при нарушении ограничений Jakarta Validation (@NotNull, @Min, @Max, @Size) через @RestControllerAdvice.',
      security: 'Public / All Endpoints',
      requestBody: {
        employerId: null,
        title: '',
        salaryFrom: 500000,
        salaryTo: 300000
      },
      responseBody: {
        status: 400,
        error: 'Bad Request',
        message: 'Ошибка валидации входных данных запроса',
        path: '/api/v1/vacancies',
        timestamp: '2026-10-05T08:32:00Z',
        validationErrors: {
          employerId: 'ID работодателя обязателен',
          title: 'Название вакансии не может быть пустым',
          salaryFrom: 'Минимальная зарплата (от) не может превышать максимальную (до)'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/users/me',
      summary: 'Данные текущего авторизованного пользователя (RBAC & Session)',
      tags: ['User Profile & RBAC'],
      description: 'Возвращает профиль текущей сессии (соискатель/работодатель), статус согласия 152-ФЗ и связанные ID профилей для переключения интерфейса.',
      security: 'JWT Bearer Token / Keycloak SSO',
      responseBody: {
        id: 'u-12345-6789-abcd',
        email: 'candidate@fsp.ru',
        fullName: 'Иван Пестерев',
        role: 'CANDIDATE',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        personalDataConsentAccepted: true,
        candidateProfileId: 'e7518117-f0d9-4c2e-9af7-829fecbd9107'
      }
    },
    {
      method: 'PUT',
      path: '/api/v1/users/profile',
      summary: 'Обновление данных профиля пользователя (ФИО, аватар, пароль)',
      tags: ['User Profile & RBAC'],
      description: 'Позволяет соискателю или рекрутеру обновить личные данные, контактный аватар и пароль.',
      security: 'JWT Bearer Token',
      requestBody: {
        fullName: 'Иван Пестерев',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        password: 'newSecurePassword2026'
      },
      responseBody: {
        status: 200,
        message: 'Профиль успешно обновлен',
        updatedAt: '2026-10-10T18:45:00Z'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/files/upload',
      summary: 'Загрузка медиа-файлов (MultipartFile) в хранилище (аватары, логотипы, резюме)',
      tags: ['File Upload (S3/Media Storage)'],
      description: 'Загружает файл (аватар профиля, корпоративный логотип или PDF-резюме) с валидацией размера и генерацией публичной ссылки.',
      security: 'JWT Bearer Token / Role Authenticated',
      requestBody: {
        file: '(binary MultipartFile)',
        category: 'avatars'
      },
      responseBody: {
        url: 'https://fsp-career.ru/media/avatars/e7518117_avatar.png',
        filename: 'avatar.png',
        sizeBytes: 204850,
        contentType: 'image/png'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/system/stats',
      summary: 'Публичная открытая статистика платформы для лендинга',
      tags: ['System & Monitoring'],
      description: 'Возвращает верифицированные метрики платформы (зарегистрированные спортсмены, вакансии, проведенные ревью, отправленные офферы).',
      security: 'Public Endpoint',
      responseBody: {
        registeredAthletesCount: 1420,
        activeVacanciesCount: 312,
        solvedTasksAndReviewsCount: 890,
        offersCount: 425,
        acceptedOffersCount: 128,
        accreditedEmployersCount: 84,
        platformVersion: '2.0.0-ENTERPRISE'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/ai/generate-summary',
      summary: 'Мультимодельная генерация AI-портрета соискателя (Gemini, YandexGPT, OpenRouter, Ollama)',
      tags: ['AI Summary & Multi-Model Analysis'],
      description: 'Использует паттерн Strategy для выбора нейросетевого провайдера, формирует системный промт под фокус (Highload, Алгоритмы, Тимлид) и анализирует профиль.',
      security: 'JWT Bearer Token',
      requestBody: {
        candidateId: 'e7518117-f0d9-4c2e-9af7-829fecbd9107',
        provider: 'GEMINI',
        modelName: 'gemini-1.5-flash',
        focus: 'HIGH_LOAD_CORE',
        customApiKey: 'AIzaSy...'
      },
      responseBody: {
        summaryText: 'Выдающийся Senior Java-инженер с подтвержденным разрядом КМС по спортивному программированию...',
        codeCleanlinessScore: 98,
        keyStrengths: ['HighLoad архитектура', 'Чистота алгоритмического кода', '0 утечек памяти в песочнице'],
        recommendedRoles: ['Senior Java Engineer', 'Core Backend Lead']
      }
    },
    {
      method: 'POST',
      path: '/api/v1/ai/save-profile',
      summary: 'Сохранение сгенерированного ИИ-портрета в профиль соискателя (PostgreSQL)',
      tags: ['AI Summary & Multi-Model Analysis'],
      description: 'Фиксирует результат работы нейросети в базе данных соискателя при клике на кнопку «Сохранить в профиле соискателя».',
      security: 'JWT Bearer Token (ROLE_CANDIDATE / ROLE_ADMIN)',
      requestBody: {
        candidateId: 'e7518117-f0d9-4c2e-9af7-829fecbd9107',
        summaryText: 'Сгенерированное техническое резюме...',
        codeCleanlinessScore: 98,
        keyStrengths: ['HighLoad архитектура', 'Алгоритмы'],
        recommendedRoles: ['Senior Backend Engineer']
      },
      responseBody: {
        status: 200,
        message: 'ИИ-портрет успешно сохранен в базе данных соискателя',
        savedAt: '2026-10-10T19:20:00Z'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/webhooks',
      summary: 'Регистрация внешнего веб-хука для ATS работодателя (Сбер, Яндекс, Telegram)',
      tags: ['Employer Webhooks & Integrations'],
      description: 'Регистрирует URL для отправки асинхронных уведомлений при событиях найма (OFFER_ACCEPTED, OFFER_DECLINED, OFFER_SENT, TEST_PASSED) с подписью HMAC-SHA256.',
      security: 'JWT Bearer Token (ROLE_EMPLOYER)',
      requestBody: {
        employerId: 'b2c3d4e5-f6a7-48b9-bc01-def234567890',
        url: 'https://ats.sber.ru/api/v1/fsp-hook-receiver',
        secretToken: 'sber_fsp_secret_webhook_token_2026',
        events: 'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED',
        description: 'Корпоративная ATS Сбера (Webhooks)'
      },
      responseBody: {
        id: 'wh-7f9a8b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
        status: 'ACTIVE',
        active: true,
        signatureHeader: 'X-FSP-Signature (HMAC-SHA256)'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/webhooks/{id}/ping',
      summary: 'Отправка тестового пинга на веб-хук с проверкой доставки',
      tags: ['Employer Webhooks & Integrations'],
      description: 'Отправляет тестовый PING-запрос на зарегистрированный адрес внешнего веб-хука с фиксацией HTTP-кода ответа.',
      security: 'JWT Bearer Token (ROLE_EMPLOYER)',
      responseBody: {
        webhookId: 'wh-7f9a8b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
        statusCode: 200,
        success: true,
        message: 'Веб-хук успешно доставлен (HTTP 200 OK)',
        timestamp: '2026-10-10T19:30:00Z'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/candidates/{id}/export-pdf',
      summary: 'Автогенерация официального PDF-паспорта соискателя (ФСП Profile Card)',
      tags: ['Candidates'],
      description: 'Генерирует стандартизированный PDF-документ с символикой Федерации спортивного программирования, ELO-рейтингом, спортивным разрядом ЕВСК и проверенным стеком.',
      security: 'Public Read / Candidate / Employer',
      responseBody: {
        contentType: 'application/pdf',
        contentDisposition: 'attachment; filename="fsp-candidate-passport.pdf"',
        pdfBytes: '[Binary PDF 1.4 stream ~ 9.5 KB]'
      }
    }
  ];

  const currentEndpoint = endpoints[selectedEndpointIndex];

  const handleTestApi = () => {
    setIsLoading(true);
    setTestResult(null);

    setTimeout(() => {
      setTestResult(JSON.stringify(currentEndpoint.responseBody, null, 2));
      setIsLoading(false);
    }, 450);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Swagger Header Banner */}
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl shrink-0">
            <Server className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Springdoc OpenAPI 3.0 / Swagger UI
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                v2.0.0-ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Спецификация REST API бэкенда на <strong>Java 21 + Spring Boot 3 + Spring Security + Keycloak</strong>
            </p>
            
            {/* Servers Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Серверы:</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                https://api.fsp-arena.ru (Production Gateway)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-mono text-[11px]">
                http://localhost:8080 (Local Dev)
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <a
                href="https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Соответствие 152-ФЗ: маскирование персональных данных и аудит доступа</span>
              </a>
              <span>•</span>
              <span>OpenAPI Spec: <code className="text-blue-400 font-mono">/v3/api-docs</code></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            JWT Bearer & Keycloak SSO
          </span>
        </div>
      </div>

      {/* Main Swagger Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 bg-[#0f172a] rounded-3xl border border-slate-800 p-4 space-y-2 max-h-[620px] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Эндпоинты платформы ({endpoints.length}):
          </h3>

          {endpoints.map((ep, idx) => {
            const isSelected = selectedEndpointIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedEndpointIndex(idx);
                  setTestResult(null);
                }}
                className={`p-3 rounded-2xl cursor-pointer border transition-all text-xs space-y-1 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                    ep.method === 'GET' ? 'bg-blue-600 text-white' :
                    ep.method === 'POST' ? 'bg-emerald-600 text-white' :
                    ep.method === 'PUT' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-slate-300 font-medium truncate">
                    {ep.path}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate pl-1">
                  {ep.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Endpoint Inspector & Interactive Tester */}
        <div className="lg:col-span-8 bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl">
          
          {/* Top Method & Path */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-xl font-mono font-black text-xs ${
                currentEndpoint.method === 'GET' ? 'bg-blue-600 text-white' :
                currentEndpoint.method === 'POST' ? 'bg-emerald-600 text-white' :
                currentEndpoint.method === 'PUT' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {currentEndpoint.method}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-white">
                {currentEndpoint.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                {currentEndpoint.security}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Назначение метода:
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentEndpoint.description}
            </p>
          </div>

          {/* Request Body if applicable */}
          {currentEndpoint.requestBody && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Request Body (application/json):
                </h4>
                <button
                  onClick={() => handleCopy(JSON.stringify(currentEndpoint.requestBody, null, 2))}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
                {JSON.stringify(currentEndpoint.requestBody, null, 2)}
              </pre>
            </div>
          )}

          {/* Try It Out Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleTestApi}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isLoading ? 'Выполнение запроса...' : 'Выполнить (Try It Out)'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Симуляция живого Spring Boot 3 контроллера
            </span>
          </div>

          {/* Response Box */}
          {testResult && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Response HTTP 200 OK (application/json)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Time: 18ms • Spring Security Filter: Validated
                </span>
              </div>
              <pre className="bg-black/80 p-4 rounded-2xl border border-emerald-500/40 font-mono text-xs text-emerald-300 overflow-x-auto">
                {testResult}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
