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
