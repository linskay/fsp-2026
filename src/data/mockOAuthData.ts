import { GitHubProfileData, HhResumeData, HhEmployerVacancy } from '../types';

export const PESTEREV_GITHUB_PROFILE: GitHubProfileData = {
  username: 'ipesterev',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Fullstack Engineer & Software Architect • React, TypeScript, Java, Python • ФСП Атлет',
  reposCount: 34,
  commitsCountYear: 842,
  mainLanguage: 'TypeScript / Java / Python',
  connectedAt: new Date().toISOString(),
  topRepos: [
    {
      name: 'fsp-2026-career-arena',
      stars: 48,
      language: 'TypeScript',
      description: 'Платформа обратного найма и соревновательного программирования ФСП РФ.',
      url: 'https://github.com/ipesterev/fsp-2026-career-arena',
      updatedAt: 'Сегодня'
    },
    {
      name: 'enterprise-microservices-core',
      stars: 62,
      language: 'Java',
      description: 'Высоконагруженное ядро микросервисов с интеграцией Spring Security, Kafka и PostgreSQL.',
      url: 'https://github.com/ipesterev/enterprise-microservices-core',
      updatedAt: 'Вчера'
    },
    {
      name: 'async-pipeline-optimizer',
      stars: 29,
      language: 'Python',
      description: 'Асинхронный пайплайн обработки потоковых данных с контролем памяти и задержек.',
      url: 'https://github.com/ipesterev/async-pipeline-optimizer',
      updatedAt: '3 дня назад'
    }
  ]
};

export const MOCK_GITHUB_PROFILE: GitHubProfileData = {
  username: 'alex-belov-fsp',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Competitive Programmer | Master of Sports RF | Highload & Distributed Systems Architect',
  reposCount: 48,
  commitsCountYear: 1842,
  mainLanguage: 'C++ / Java 21',
  connectedAt: new Date().toISOString(),
  topRepos: [
    {
      name: 'fsp-dinic-maxflow-engine',
      stars: 94,
      language: 'C++',
      description: 'Сверхбыстрая реализация алгоритма Диница с эвристиками масштабирования и SIMD оптимизацией для олимпиадных соревнований ФСП.',
      url: 'https://github.com/alex-belov-fsp/fsp-dinic-maxflow-engine',
      updatedAt: '2 дня назад'
    },
    {
      name: 'spring-reactive-eventstore',
      stars: 128,
      language: 'Java',
      description: 'Event-Sourcing и CQRS движок на Spring Boot 3.3, Project Reactor и PostgreSQL для финансового трейдинга.',
      url: 'https://github.com/alex-belov-fsp/spring-reactive-eventstore',
      updatedAt: 'Вчера'
    },
    {
      name: 'distributed-raft-consensus',
      stars: 67,
      language: 'Go',
      description: 'Распределенный протокол консенсуса Raft с поддержкой dynamic membership change и snapshot compaction.',
      url: 'https://github.com/alex-belov-fsp/distributed-raft-consensus',
      updatedAt: 'Неделю назад'
    }
  ]
};

export const PESTEREV_HH_CONFIRMED_SKILLS: import('../types').HhConfirmedSkill[] = [];

export const PESTEREV_HH_RESUME: HhResumeData = {
  resumeId: 'c182d902ff0dfdff810039ed1f5a564a4b7575',
  title: 'Java-разработчик',
  experienceYears: 5,
  desiredSalary: 120000,
  skills: [
    'Java',
    'Spring Boot',
    'PostgreSQL',
    'Docker',
    'REST API',
    'Git',
    'Maven',
    'Hibernate',
    'JUnit'
  ],
  confirmedSkills: [],
  about: 'Java-разработчик с опытом работы 5 лет 1 месяц. Тип занятости: Постоянная работа, формат: Удалённо, командировки: Могу. Резюме верифицировано через hh.ru.',
  education: 'Высшее профильное образование (Информационные технологии)',
  connectedAt: new Date().toISOString(),
  workHistory: [
    {
      company: 'ИТ Проекты & Разработка',
      position: 'Java-разработчик',
      period: '2021 — настоящее время (3 года)',
      description: 'Разработка серверной части приложений на Java и Spring Boot, интеграция с базами данных PostgreSQL, проектирование REST API сервисов.'
    },
    {
      company: 'Технологические решения',
      position: 'Junior / Middle Java Developer',
      period: '2019 — 2021 (2 года 1 месяц)',
      description: 'Поддержка микросервисов, исправление багов, написание юнит-тестов (JUnit, Mockito), оптимизация запросов SQL.'
    }
  ]
};

export const MOCK_HH_RESUME: HhResumeData = {
  resumeId: 'hh-res-9842104',
  title: 'Lead Java / Highload Backend Engineer',
  experienceYears: 6,
  desiredSalary: 480000,
  skills: [
    'Java 21',
    'Spring Boot 3',
    'Spring Data JPA',
    'PostgreSQL',
    'Kafka',
    'Redis',
    'Docker',
    'Kubernetes',
    'Алгоритмы и структуры данных',
    'CI/CD'
  ],
  confirmedSkills: [
    {
      id: 'hh-cs-b1',
      skill: 'Алгоритмы и структуры данных',
      level: 'Экспертный',
      scorePercent: 100,
      percentileRank: 'Топ-0.5% среди соискателей hh.ru',
      confirmedAt: '12 февраля 2026 г.',
      testTitle: 'Тестирование HeadHunter: Алгоритмические задачи и оптимизация сложности',
      certificateId: 'HH-CERT-2026-ALGO-0042'
    },
    {
      id: 'hh-cs-b2',
      skill: 'Java 21 & Spring Boot 3',
      level: 'Экспертный',
      scorePercent: 99,
      percentileRank: 'Топ-0.8% среди соискателей hh.ru',
      confirmedAt: '20 января 2026 г.',
      testTitle: 'Тестирование HeadHunter: Высоконагруженные сервисы на Java',
      certificateId: 'HH-CERT-2026-JV-8812'
    },
    {
      id: 'hh-cs-b3',
      skill: 'PostgreSQL & Distributed DBs',
      level: 'Экспертный',
      scorePercent: 97,
      percentileRank: 'Топ-1.2% среди соискателей hh.ru',
      confirmedAt: '15 декабря 2025 г.',
      testTitle: 'Тестирование HeadHunter: Оптимизация планов запросов и шардирование',
      certificateId: 'HH-CERT-2025-DB-4410'
    }
  ],
  about: 'Мастер спорта РФ по спортивному программированию. Специализируюсь на проектировании отказоустойчивых распределенных бэкенд-систем с миллионным RPS. Опыт руководства командой 8 инженеров, оптимизация latency сервисов до p99 < 8ms.',
  education: 'МФТИ, Факультет инноваций и высоких технологий (Прикладная математика и информатика, Магистратура)',
  connectedAt: new Date().toISOString(),
  workHistory: [
    {
      company: 'FinTech Ecosystem Core',
      position: 'Lead Backend Engineer & Архитектор',
      period: '2023 — настоящее время (2 года)',
      description: 'Разработка ядра процессинга быстрых платежей. Спроектировал событийную шину на Apache Kafka с пропускной способностью 45 000 RPS. Внедрил строгую проверку контрактов OpenAPI.'
    },
    {
      company: 'СберТехнологии (SberTech)',
      position: 'Senior Java Developer',
      period: '2020 — 2023 (3 года)',
      description: 'Разработка микросервисов кредитного конвейера на Spring Boot, миграция монолита на распределенную микросервисную архитектуру, ускорение работы SQL-запросов в PostgreSQL.'
    },
    {
      company: 'Яндекс.Маркет',
      position: 'Junior / Middle Backend Developer',
      period: '2018 — 2020 (2 года)',
      description: 'Разработка сервиса динамического ценообразования. Реализация алгоритмов оптимизации товарных матриц.'
    }
  ]
};

export const DARIA_HH_RESUME: HhResumeData = {
  resumeId: 'hh-res-morozova-2026',
  title: 'Middle+ Java & Kotlin Backend Engineer',
  experienceYears: 4,
  desiredSalary: 210000,
  skills: [
    'Java 17/21',
    'Kotlin',
    'Spring Boot 3',
    'PostgreSQL',
    'Docker',
    'REST API',
    'Kafka Basics',
    'JUnit 5 / Mockito',
    'Git'
  ],
  confirmedSkills: [
    {
      id: 'hh-cs-dm-1',
      skill: 'Java Core & Collections',
      level: 'Экспертный',
      scorePercent: 96,
      percentileRank: 'Топ-2% среди соискателей hh.ru',
      confirmedAt: '18 января 2026 г.',
      testTitle: 'Тестирование HeadHunter: Java Core и многопоточность',
      certificateId: 'HH-CERT-2026-DM-1102'
    },
    {
      id: 'hh-cs-dm-2',
      skill: 'Spring Framework & Spring Boot',
      level: 'Продвинутый',
      scorePercent: 92,
      percentileRank: 'Топ-5% среди соискателей hh.ru',
      confirmedAt: '25 декабря 2025 г.',
      testTitle: 'Тестирование HeadHunter: Архитектура Spring Boot приложений',
      certificateId: 'HH-CERT-2025-DM-4912'
    },
    {
      id: 'hh-cs-dm-3',
      skill: 'SQL & Реляционные базы данных',
      level: 'Продвинутый',
      scorePercent: 90,
      percentileRank: 'Топ-7% среди соискателей hh.ru',
      confirmedAt: '12 ноября 2025 г.',
      testTitle: 'Тестирование HeadHunter: PostgreSQL и проектирование БД',
      certificateId: 'HH-CERT-2025-DM-3801'
    }
  ],
  about: 'Middle+ бэкенд разработчик на Java и Kotlin. Опыт создания отказоустойчивых REST сервисов и микросервисов, покрытие тестами более 85%. Активный участник региональных олимпиад ФСП.',
  education: 'НИУ ВШЭ, Факультет компьютерных наук (Бакалавриат, 2022)',
  connectedAt: new Date().toISOString(),
  workHistory: [
    {
      company: 'Digital Retail Hub',
      position: 'Middle Java Developer',
      period: '2022 — настоящее время (2 года)',
      description: 'Разработка микросервисов лояльности и скидок на Spring Boot 3 и PostgreSQL. Оптимизация времени ответа сервисов.'
    },
    {
      company: 'FinTech Startup',
      position: 'Junior Java Developer',
      period: '2020 — 2022 (2 года)',
      description: 'Поддержка платежного шлюза, написание интеграционных тестов, интеграция с внешними банковскими API.'
    }
  ]
};

export const SOKOLOV_HH_RESUME: HhResumeData = {
  resumeId: 'hh-res-sokolov-2026',
  title: 'Senior Highload Backend & Data Engineer (Python / Go)',
  experienceYears: 6,
  desiredSalary: 290000,
  skills: [
    'Python 3.12',
    'Go (Golang)',
    'FastAPI',
    'PostgreSQL',
    'ClickHouse',
    'Apache Kafka',
    'Redis',
    'Docker',
    'Kubernetes',
    'Алгоритмы и структуры данных'
  ],
  confirmedSkills: [
    {
      id: 'hh-cs-ms-1',
      skill: 'Python Backend & Asyncio',
      level: 'Экспертный',
      scorePercent: 98,
      percentileRank: 'Топ-0.9% среди соискателей hh.ru',
      confirmedAt: '5 февраля 2026 г.',
      testTitle: 'Тестирование HeadHunter: Асинхронное программирование Python',
      certificateId: 'HH-CERT-2026-MS-9201'
    },
    {
      id: 'hh-cs-ms-2',
      skill: 'Go Concurrency & Microservices',
      level: 'Экспертный',
      scorePercent: 96,
      percentileRank: 'Топ-1.5% среди соискателей hh.ru',
      confirmedAt: '12 января 2026 г.',
      testTitle: 'Тестирование HeadHunter: Go горутины, каналы и микросервисы',
      certificateId: 'HH-CERT-2026-MS-7712'
    },
    {
      id: 'hh-cs-ms-3',
      skill: 'ClickHouse & Аналитические СУБД',
      level: 'Экспертный',
      scorePercent: 95,
      percentileRank: 'Топ-2% среди соискателей hh.ru',
      confirmedAt: '28 декабря 2025 г.',
      testTitle: 'Тестирование HeadHunter: Большие данные и аналитический SQL',
      certificateId: 'HH-CERT-2025-MS-5531'
    }
  ],
  about: 'Senior разработчик высоконагруженных распределенных сервисов и витрин данных. Стек: Go, Python, ClickHouse, Kafka. Кандидат в мастера спорта (КМС) по спортивному программированию.',
  education: 'МГТУ им. Баумана, ИУ7 «Программное обеспечение ЭВМ и информационные технологии» (Магистратура, 2020)',
  connectedAt: new Date().toISOString(),
  workHistory: [
    {
      company: 'AdTech Platform Core',
      position: 'Senior Data & Go Engineer',
      period: '2023 — настоящее время (2 года)',
      description: 'Построение пайплайнов обработки кликов и показов в реальном времени на Kafka и ClickHouse (80 000 событий/сек).'
    },
    {
      company: 'Logistics Tech Solutions',
      position: 'Middle / Senior Python Developer',
      period: '2020 — 2023 (3 года)',
      description: 'Разработка ядра маршрутизации курьеров с решением задачи коммивояжера (TSP) и графовыми эвристиками.'
    }
  ]
};

export const MOCK_HH_EMPLOYER_VACANCIES: HhEmployerVacancy[] = [
  {
    id: 'hh-vac-1',
    title: 'Senior Java Backend Engineer (Core Banking & Highload)',
    salaryMin: 420000,
    salaryMax: 550000,
    city: 'Москва / Удаленно',
    specialization: 'backend',
    grade: 'senior',
    skills: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Ищем Senior инженера в команду высоконагруженного ядра транзакций. Опыт работы с микросервисами и реляционными СУБД под высокими нагрузками. Плюсом будут победы и разряды в спортивном программировании ФСП.',
    imported: false
  },
  {
    id: 'hh-vac-2',
    title: 'Lead C++ / Highload Архитектор (Matching Engine)',
    salaryMin: 520000,
    salaryMax: 700000,
    city: 'Москва',
    specialization: 'highload',
    grade: 'lead',
    skills: ['C++20', 'Low Latency', 'SIMD', 'Lock-free', 'Linux Kernel', 'PostgreSQL'],
    description: 'Разработка биржевого движка сопоставления заявок (Matching Engine) с задержкой исполнения sub-microsecond. Идеально для чемпионов и призеров соревнований ФСП РФ.',
    imported: false
  },
  {
    id: 'hh-vac-3',
    title: 'Fullstack Engineer (React + Spring Boot 3)',
    salaryMin: 350000,
    salaryMax: 460000,
    city: 'Санкт-Петербург / Удаленно',
    specialization: 'fullstack',
    grade: 'senior',
    skills: ['TypeScript', 'React', 'Tailwind CSS', 'Java 21', 'Spring Boot 3', 'PostgreSQL'],
    description: 'Создание передовых внутренних аналитических панелей и сервисов автоматизации клиентских операций для B2B клиентов.',
    imported: false
  },
  {
    id: 'hh-vac-4',
    title: 'DevOps / Platform Engineer (Kubernetes & Bare Metal)',
    salaryMin: 380000,
    salaryMax: 500000,
    city: 'Удаленно',
    specialization: 'devops',
    grade: 'senior',
    skills: ['Kubernetes', 'Helm', 'Terraform', 'Kafka', 'Prometheus', 'Grafana', 'CI/CD'],
    description: 'Развитие отказоустойчивой инфраструктуры в приватном облаке, оркестрация распределенных баз данных PostgreSQL и брокеров Kafka.',
    imported: false
  }
];

export const HARPIX_JAVA_HH_RESUME: HhResumeData = {
  resumeId: '137312634',
  title: 'Java-разработчик (ООО «Гарпикс»)',
  experienceYears: 4,
  desiredSalary: 260000,
  skills: [
    'Java 17/21',
    'Spring Boot 3',
    'PostgreSQL',
    'Docker',
    'REST API',
    'Hibernate',
    'Redis',
    'Git',
    'Kafka'
  ],
  confirmedSkills: [
    {
      id: 'hh-cs-h1',
      skill: 'Java 21 & Spring Boot 3',
      level: 'Экспертный',
      scorePercent: 98,
      percentileRank: 'Топ-1% среди соискателей hh.ru',
      confirmedAt: '25 февраля 2026 г.',
      testTitle: 'Тестирование HeadHunter: Java Backend и Spring Boot микросервисы',
      certificateId: 'HH-CERT-2026-JV-13731'
    },
    {
      id: 'hh-cs-h2',
      skill: 'PostgreSQL & СУБД',
      level: 'Продвинутый',
      scorePercent: 94,
      percentileRank: 'Топ-3% среди соискателей hh.ru',
      confirmedAt: '12 января 2026 г.',
      testTitle: 'Тестирование HeadHunter: Реляционные базы данных и SQL',
      certificateId: 'HH-CERT-2026-PG-13732'
    },
    {
      id: 'hh-cs-h3',
      skill: 'Алгоритмы и структуры данных',
      level: 'Продвинутый',
      scorePercent: 92,
      percentileRank: 'Топ-5% среди соискателей hh.ru',
      confirmedAt: '10 декабря 2025 г.',
      testTitle: 'Тестирование HeadHunter: Базовые алгоритмы и структуры данных',
      certificateId: 'HH-CERT-2025-AL-13733'
    }
  ],
  about: 'Java-разработчик с опытом построения масштабируемых бэкендов на Spring Boot и PostgreSQL. Профиль сопоставлен с вакансией #137312634 (Гарпикс) с подтвержденными навыками hh.ru.',
  education: 'ИГЭУ им. В.И. Ленина, Информатика и вычислительная техника (2022)',
  connectedAt: new Date().toISOString(),
  workHistory: [
    {
      company: 'ООО «Гарпикс»',
      position: 'Java-разработчик',
      period: '2023 — настоящее время (2 года)',
      description: 'Разработка корпоративных сервисов и микросервисов на Spring Boot, оптимизация запросов к PostgreSQL, интеграция брокеров сообщений.'
    },
    {
      company: 'Digital Solutions',
      position: 'Junior Java Developer',
      period: '2021 — 2023 (2 года)',
      description: 'Разработка REST API, покрытие unit-тестами (JUnit, Mockito), работа с реляционными базами данных.'
    }
  ]
};

export function extractHhId(input: string): { id: string; isVacancy: boolean } {
  let raw = input.trim();
  if (!raw) return { id: 'hh-res-' + Date.now().toString().slice(-6), isVacancy: false };

  // Strip queries, hashes, and protocol
  const withoutQuery = raw.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const isVacancy = withoutQuery.includes('/vacancy/') || /^\d{6,12}$/.test(withoutQuery);

  let id = withoutQuery;
  if (id.includes('/')) {
    const parts = id.split('/');
    id = parts[parts.length - 1];
  }
  id = id.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!id) id = 'c182d902ff0dbff810039ed1f5a564a4b7575';

  return { id, isVacancy };
}

export function buildHhResumeFromInput(
  queryOrUrl: string,
  manualOverrides?: {
    title?: string;
    salary?: number;
    experience?: number;
    skills?: string[];
  }
): { resume: HhResumeData; detectedType: 'resume' | 'vacancy' | 'hash' | 'role' } {
  const { id: cleanId, isVacancy } = extractHhId(queryOrUrl);
  const qLower = queryOrUrl.toLowerCase();

  let baseResume: HhResumeData;
  let detectedType: 'resume' | 'vacancy' | 'hash' | 'role' = 'resume';

  if (isVacancy || cleanId === '137312634' || qLower.includes('гарпикс') || qLower.includes('harpix')) {
    baseResume = HARPIX_JAVA_HH_RESUME;
    detectedType = 'vacancy';
  } else if (cleanId.startsWith('c182d9') || qLower.includes('pesterev') || qLower.includes('пестерев')) {
    baseResume = {
      ...PESTEREV_HH_RESUME,
      resumeId: cleanId.startsWith('c182d9') ? cleanId : 'c182d902ff0dbff810039ed1f5a564a4b7575'
    };
    detectedType = 'hash';
  } else if (qLower.includes('front') || qLower.includes('react') || qLower.includes('belov') || qLower.includes('белов')) {
    baseResume = MOCK_HH_RESUME;
    detectedType = 'role';
  } else if (qLower.includes('daria') || qLower.includes('morozova') || qLower.includes('kotlin') || qLower.includes('морозова')) {
    baseResume = DARIA_HH_RESUME;
    detectedType = 'role';
  } else if (qLower.includes('data') || qLower.includes('python') || qLower.includes('sokolov') || qLower.includes('соколов') || qLower.includes('go')) {
    baseResume = SOKOLOV_HH_RESUME;
    detectedType = 'role';
  } else {
    // Default fallback to Pesterev's verified resume with the user's specific cleanId
    baseResume = {
      ...PESTEREV_HH_RESUME,
      resumeId: cleanId
    };
  }

  // Merge manual overrides if user typed into custom form fields
  const finalTitle = manualOverrides?.title?.trim() || baseResume.title;
  const finalSalary = manualOverrides?.salary && manualOverrides.salary > 0 ? manualOverrides.salary : baseResume.desiredSalary;
  const finalExp = manualOverrides?.experience !== undefined && manualOverrides.experience >= 0 ? manualOverrides.experience : baseResume.experienceYears;
  const finalSkills = manualOverrides?.skills && manualOverrides.skills.length > 0 ? manualOverrides.skills : baseResume.skills;

  const result: HhResumeData = {
    ...baseResume,
    resumeId: cleanId,
    title: finalTitle,
    desiredSalary: finalSalary,
    experienceYears: finalExp,
    skills: finalSkills,
    connectedAt: new Date().toISOString()
  };

  return { resume: result, detectedType };
}
