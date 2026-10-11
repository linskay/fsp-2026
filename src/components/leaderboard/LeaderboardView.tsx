import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Code2,
  Sparkles,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Send,
  Eye,
  FileText,
  UserCheck,
  Zap,
  Flame,
  LayoutGrid,
  Table as TableIcon,
  X,
  Copy,
  Check,
  Globe,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { CandidateProfile, UserRole } from '../../types';
import { FspLogo } from '../brand/FspLogo';
import { UserAvatar } from '../brand/UserAvatar';

interface LeaderboardViewProps {
  candidates?: CandidateProfile[];
  onSelectCandidate?: (candidateId: string) => void;
  onNavigateToCandidate?: (candidateId: string) => void;
  onSendOfferToCandidate?: (candidateId: string) => void;
  onOpenPrivacyModal?: () => void;
}

export interface RegistryAthlete {
  rankPosition: number;
  id: string;
  fullName: string;
  nickname: string;
  fspId: string;
  fspRank: string;
  fspRating: number;
  ratingChange: number;
  region: string;
  city: string;
  specialization: 'backend' | 'frontend' | 'fullstack' | 'highload' | 'ai_ml' | 'systems';
  grade: 'Junior' | 'Middle' | 'Senior' | 'Lead' | 'Principal';
  skills: string[];
  solvedTasksCount: number;
  leetcodeHardSolved: number;
  testScorePercent: number;
  avgExecutionTimeMs: number;
  codeCleanlinessScore: number;
  githubUsername?: string;
  isFspVerified: boolean;
  avatarUrl?: string;
  universityOrOrg?: string;
  summaryText?: string;
}

// Pre-curated official regions of the Russian Federation
const REGIONS = [
  'Все регионы',
  'Москва',
  'Санкт-Петербург',
  'Республика Татарстан',
  'Новосибирская область',
  'Свердловская область',
  'Томская область',
  'Нижегородская область',
  'Приморский край',
  'Самарская область',
  'Ростовская область'
];

const SPORT_RANKS = [
  'Все разряды',
  'ЗМС / МСМК',
  'Мастер спорта РФ (МС)',
  'КМС (Кандидат в мастера)',
  '1-й спортивный разряд',
  '2-й спортивный разряд'
];

const TECH_STACKS = [
  'Все стеки',
  'Java / Spring',
  'C++ / HighLoad',
  'Go / Microservices',
  'Python / AI & Algo',
  'Rust / Systems',
  'TypeScript / Frontend'
];

// Generator of top 100 athletes ensuring rich, authentic data
function generateTop100Athletes(initialCandidates: CandidateProfile[] = []): RegistryAthlete[] {
  const seedAthletes: Partial<RegistryAthlete>[] = [
    {
      fullName: 'Геннадий Короткевич',
      nickname: 'tourist',
      fspId: 'FSP-RUS-2024-0001',
      fspRank: 'Заслуженный мастер спорта РФ',
      fspRating: 2940,
      ratingChange: 15,
      region: 'Санкт-Петербург',
      city: 'Санкт-Петербург',
      specialization: 'highload',
      grade: 'Principal',
      skills: ['C++', 'Algorithms', 'HighLoad', 'Dynamic Programming', 'Graph Theory'],
      solvedTasksCount: 1420,
      leetcodeHardSolved: 480,
      testScorePercent: 99.8,
      avgExecutionTimeMs: 4,
      codeCleanlinessScore: 99,
      githubUsername: 'tourist-fsp',
      universityOrOrg: 'ИТМО / Чемпион мира ICPC',
      summaryText: 'Легенда спортивного программирования. 7-кратный победитель Google Code Jam, многократный чемпион мира ICPC. Абсолютный рекордсмен ELO в дисциплине алгоритмического программирования.'
    },
    {
      fullName: 'Александр Белов',
      nickname: 'abelov_algo',
      fspId: 'FSP-RUS-2024-8841',
      fspRank: 'Мастер спорта РФ (МС)',
      fspRating: 2880,
      ratingChange: 28,
      region: 'Москва',
      city: 'Москва',
      specialization: 'backend',
      grade: 'Lead',
      skills: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Distributed Systems'],
      solvedTasksCount: 890,
      leetcodeHardSolved: 260,
      testScorePercent: 99.2,
      avgExecutionTimeMs: 11,
      codeCleanlinessScore: 98,
      githubUsername: 'alex-belov-fsp',
      universityOrOrg: 'МФТИ (Физтех) / Победитель Кубка ФСП',
      summaryText: 'Победитель Кубка России ФСП 2024. Архитектор распределенных систем с экстремальной пропускной способностью (250k+ RPS). Мастер спорта по спортивному программированию.'
    },
    {
      fullName: 'Даниил Орешников',
      nickname: 'daniil_core',
      fspId: 'FSP-RUS-2024-0104',
      fspRank: 'Мастер спорта международного класса (МСМК)',
      fspRating: 2845,
      ratingChange: 42,
      region: 'Республика Татарстан',
      city: 'Иннополис / Казань',
      specialization: 'highload',
      grade: 'Senior',
      skills: ['C++', 'Rust', 'Linux Kernel', 'eBPF', 'High-Frequency Systems'],
      solvedTasksCount: 780,
      leetcodeHardSolved: 245,
      testScorePercent: 98.9,
      avgExecutionTimeMs: 6,
      codeCleanlinessScore: 97,
      githubUsername: 'oreshnikov-dev',
      universityOrOrg: 'Университет Иннополис',
      summaryText: 'Призер международных соревнований по системному программированию. Специализация на низкоуровневой оптимизации, no-GC архитектурах и ядре Linux.'
    },
    {
      fullName: 'Иван Пестерев',
      nickname: 'ipesterev',
      fspId: 'FSP-RUS-2024-7712',
      fspRank: 'КМС (Кандидат в мастера)',
      fspRating: 2790,
      ratingChange: 35,
      region: 'Москва',
      city: 'Москва',
      specialization: 'backend',
      grade: 'Senior',
      skills: ['Java 21', 'Spring Cloud', 'PostgreSQL', 'Docker', 'Kubernetes', 'Dinic Algo'],
      solvedTasksCount: 650,
      leetcodeHardSolved: 195,
      testScorePercent: 98.4,
      avgExecutionTimeMs: 14,
      codeCleanlinessScore: 96,
      githubUsername: 'ipesterev',
      universityOrOrg: 'СберТех / Бауманка (МГТУ)',
      summaryText: 'Ведущий Java-разработчик. Высокая алгоритмическая дисциплина, ELO 2790, подтвержденный разряд КМС, 1200+ коммитов в production-репозиториях за год.'
    },
    {
      fullName: 'Алина Мусина',
      nickname: 'alina_neuro',
      fspId: 'FSP-RUS-2024-1188',
      fspRank: 'Мастер спорта РФ (МС)',
      fspRating: 2750,
      ratingChange: 18,
      region: 'Новосибирская область',
      city: 'Новосибирск',
      specialization: 'ai_ml',
      grade: 'Senior',
      skills: ['Python', 'PyTorch', 'CUDA', 'Transformer Architecture', 'C++', 'Data Structures'],
      solvedTasksCount: 610,
      leetcodeHardSolved: 180,
      testScorePercent: 98.1,
      avgExecutionTimeMs: 18,
      codeCleanlinessScore: 97,
      githubUsername: 'alina-musina-ai',
      universityOrOrg: 'НГУ (Академгородок) / Лаборатория ИИ',
      summaryText: 'Чемпионка Сибирского федерального округа по олимпиадному программированию. Экспертиза в распределенном обучении LLM и параллельных вычислениях на GPU.'
    },
    {
      fullName: 'Максим Соколов',
      nickname: 'max_go_infra',
      fspId: 'FSP-RUS-2024-3490',
      fspRank: 'КМС (Кандидат в мастера)',
      fspRating: 2710,
      ratingChange: -6,
      region: 'Свердловская область',
      city: 'Екатеринбург',
      specialization: 'backend',
      grade: 'Senior',
      skills: ['Go', 'gRPC', 'Kafka', 'ClickHouse', 'PostgreSQL', 'Raft Consensus'],
      solvedTasksCount: 540,
      leetcodeHardSolved: 155,
      testScorePercent: 97.5,
      avgExecutionTimeMs: 15,
      codeCleanlinessScore: 95,
      githubUsername: 'max-sokolov',
      universityOrOrg: 'УрФУ (Уральский Федеральный)',
      summaryText: 'Разработчик распределенных хранилищ данных и консенсус-протоколов (Raft, Paxos). Победитель отборочного тура ФСП УрФО.'
    },
    {
      fullName: 'Екатерина Романова',
      nickname: 'kate_front',
      fspId: 'FSP-RUS-2024-9041',
      fspRank: '1-й спортивный разряд',
      fspRating: 2680,
      ratingChange: 24,
      region: 'Нижегородская область',
      city: 'Нижний Новгород',
      specialization: 'frontend',
      grade: 'Lead',
      skills: ['TypeScript', 'React 19', 'Next.js', 'WebAssembly', 'WebGL', 'Performance Tuning'],
      solvedTasksCount: 490,
      leetcodeHardSolved: 130,
      testScorePercent: 97.2,
      avgExecutionTimeMs: 20,
      codeCleanlinessScore: 96,
      githubUsername: 'kate-romanova',
      universityOrOrg: 'ННГУ им. Лобачевского',
      summaryText: 'Эксперт по производительности веб-приложений и WebAssembly. Победительница соревнований ФСП в дисциплине веб-алгоритмики.'
    },
    {
      fullName: 'Артем Васильев',
      nickname: 'artem_rustacean',
      fspId: 'FSP-RUS-2024-4211',
      fspRank: 'Мастер спорта РФ (МС)',
      fspRating: 2640,
      ratingChange: 52,
      region: 'Томская область',
      city: 'Томск',
      specialization: 'systems',
      grade: 'Senior',
      skills: ['Rust', 'C++', 'Async Tokio', 'Zero-Copy Networking', 'Distributed Tracing'],
      solvedTasksCount: 460,
      leetcodeHardSolved: 140,
      testScorePercent: 97.0,
      avgExecutionTimeMs: 8,
      codeCleanlinessScore: 96,
      githubUsername: 'artem-vasiliev',
      universityOrOrg: 'ТГУ / ТПУ',
      summaryText: 'Системный инженер высокой надежности. Разработчик сетевых движков на Rust. 1-е место на открытом кубке Томской области по спортивному программированию.'
    },
    {
      fullName: 'Михаил Семенов',
      nickname: 'misha_highload',
      fspId: 'FSP-RUS-2024-6512',
      fspRank: 'КМС (Кандидат в мастера)',
      fspRating: 2615,
      ratingChange: 19,
      region: 'Приморский край',
      city: 'Владивосток',
      specialization: 'highload',
      grade: 'Senior',
      skills: ['Go', 'C++', 'Redis Enterprise', 'PostgreSQL', 'High-Throughput Queues'],
      solvedTasksCount: 430,
      leetcodeHardSolved: 120,
      testScorePercent: 96.8,
      avgExecutionTimeMs: 16,
      codeCleanlinessScore: 94,
      githubUsername: 'semenov-vl',
      universityOrOrg: 'ДВФУ (Дальневосточный)',
      summaryText: 'Лидер дальневосточного дивизиона ФСП. Опыт проектирования асинхронных процессинговых очередей с нулевыми потерями сообщений.'
    },
    {
      fullName: 'София Кузнецова',
      nickname: 'sofia_fullstack',
      fspId: 'FSP-RUS-2024-8192',
      fspRank: '1-й спортивный разряд',
      fspRating: 2590,
      ratingChange: 12,
      region: 'Самарская область',
      city: 'Самара',
      specialization: 'fullstack',
      grade: 'Middle',
      skills: ['Java', 'TypeScript', 'Spring Boot', 'React', 'Docker', 'Graph Algorithms'],
      solvedTasksCount: 395,
      leetcodeHardSolved: 105,
      testScorePercent: 96.4,
      avgExecutionTimeMs: 22,
      codeCleanlinessScore: 95,
      githubUsername: 'sofia-kuznetsova',
      universityOrOrg: 'Самарский Университет (СГАУ)',
      summaryText: 'Универсальный разработчик с быстрой адаптацией. 1-й взрослый разряд, активный контрибьютор открытых спортивно-алгоритмических репозиториев.'
    }
  ];

  // Combine seeds and generate remaining up to 100
  const result: RegistryAthlete[] = [];

  // Add initial seeds
  seedAthletes.forEach((seed, idx) => {
    result.push({
      rankPosition: idx + 1,
      id: `ath-${idx + 1}`,
      fullName: seed.fullName!,
      nickname: seed.nickname!,
      fspId: seed.fspId!,
      fspRank: seed.fspRank!,
      fspRating: seed.fspRating!,
      ratingChange: seed.ratingChange!,
      region: seed.region!,
      city: seed.city!,
      specialization: seed.specialization!,
      grade: seed.grade!,
      skills: seed.skills!,
      solvedTasksCount: seed.solvedTasksCount!,
      leetcodeHardSolved: seed.leetcodeHardSolved!,
      testScorePercent: seed.testScorePercent!,
      avgExecutionTimeMs: seed.avgExecutionTimeMs!,
      codeCleanlinessScore: seed.codeCleanlinessScore!,
      githubUsername: seed.githubUsername,
      isFspVerified: true,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + idx * 1000}?w=150`,
      universityOrOrg: seed.universityOrOrg,
      summaryText: seed.summaryText
    });
  });

  // Generative pool for remaining ranks 11..100
  const firstNames = ['Сергей', 'Дмитрий', 'Андрей', 'Алексей', 'Никита', 'Владислав', 'Кирилл', 'Павел', 'Илья', 'Роман', 'Виктор', 'Денис', 'Глеб', 'Ярослав', 'Матвей', 'Тимофей', 'Константин', 'Егор', 'Макар', 'Арсений'];
  const lastNames = ['Смирнов', 'Иванов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев'];
  const cities = [
    { city: 'Москва', region: 'Москва' },
    { city: 'Санкт-Петербург', region: 'Санкт-Петербург' },
    { city: 'Казань', region: 'Республика Татарстан' },
    { city: 'Новосибирск', region: 'Новосибирская область' },
    { city: 'Екатеринбург', region: 'Свердловская область' },
    { city: 'Томск', region: 'Томская область' },
    { city: 'Нижний Новгород', region: 'Нижегородская область' },
    { city: 'Владивосток', region: 'Приморский край' },
    { city: 'Самара', region: 'Самарская область' },
    { city: 'Ростов-на-Дону', region: 'Ростовская область' }
  ];
  const skillSets = [
    ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Kafka', 'Redis'],
    ['C++', 'STL', 'HighLoad', 'Algorithms', 'Memory Optimization'],
    ['Go', 'gRPC', 'Docker', 'Kubernetes', 'Microservices'],
    ['Python', 'PyTorch', 'Data Structures', 'FastAPI', 'NumPy'],
    ['Rust', 'Tokio', 'Concurrency', 'Low-Latency', 'Systems'],
    ['TypeScript', 'React 19', 'Next.js', 'Tailwind', 'State Management']
  ];
  const specs: RegistryAthlete['specialization'][] = ['backend', 'highload', 'ai_ml', 'fullstack', 'systems', 'frontend'];
  const ranks = ['Мастер спорта РФ (МС)', 'КМС (Кандидат в мастера)', '1-й спортивный разряд', '2-й спортивный разряд'];

  let currentElo = 2570;
  for (let i = 11; i <= 100; i++) {
    const fn = firstNames[(i * 3) % firstNames.length];
    const ln = lastNames[(i * 7) % lastNames.length];
    const loc = cities[i % cities.length];
    const skills = skillSets[i % skillSets.length];
    const spec = specs[i % specs.length];
    const rank = i <= 25 ? 'Мастер спорта РФ (МС)' : (i <= 55 ? 'КМС (Кандидат в мастера)' : (i <= 85 ? '1-й спортивный разряд' : '2-й спортивный разряд'));
    const grade: RegistryAthlete['grade'] = i <= 20 ? 'Senior' : (i <= 65 ? 'Middle' : 'Junior');
    currentElo -= Math.floor(Math.random() * 8) + 4;

    result.push({
      rankPosition: i,
      id: `ath-${i}`,
      fullName: `${fn} ${ln}`,
      nickname: `${fn.toLowerCase()}_${ln.toLowerCase().slice(0, 4)}`,
      fspId: `FSP-RUS-2024-${String(1000 + i * 17).padStart(4, '0')}`,
      fspRank: rank,
      fspRating: Math.max(1850, currentElo),
      ratingChange: (i % 5 === 0 ? -1 : 1) * ((i * 11) % 45 + 5),
      region: loc.region,
      city: loc.city,
      specialization: spec,
      grade,
      skills,
      solvedTasksCount: Math.round(currentElo * 0.16) + (i % 20),
      leetcodeHardSolved: Math.round(currentElo * 0.045) + (i % 15),
      testScorePercent: Math.min(99.4, 94.0 + (currentElo - 1800) / 250),
      avgExecutionTimeMs: Math.max(5, Math.round(35 - (currentElo - 1800) / 50)),
      codeCleanlinessScore: Math.min(99, Math.max(82, 85 + (currentElo > 2300 ? 10 : 5))),
      githubUsername: `${fn.toLowerCase()}-${ln.toLowerCase()}`,
      isFspVerified: true,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345678) % 100000000}?w=150`,
      universityOrOrg: `${loc.city} Государственный Университет`,
      summaryText: `Атлет ФСП ${fn} ${ln} специализации ${spec}. Аккредитован Федерацией спортивного программирования РФ. Стабильные результаты в отборочных турах и Code Arena.`
    });
  }

  return result;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  candidates = [],
  onSelectCandidate,
  onNavigateToCandidate,
  onSendOfferToCandidate,
  onOpenPrivacyModal
}) => {
  // Full top-100 dataset
  const allAthletes = useMemo(() => generateTop100Athletes(candidates), [candidates]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Все регионы');
  const [selectedRank, setSelectedRank] = useState('Все разряды');
  const [selectedStack, setSelectedStack] = useState('Все стеки');
  const [minEloFilter, setMinEloFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'elo' | 'tasks' | 'cleanliness' | 'accuracy'>('elo');

  // Selected athlete for modal preview
  const [selectedAthlete, setSelectedAthlete] = useState<RegistryAthlete | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered & sorted list
  const filteredAthletes = useMemo(() => {
    return allAthletes
      .filter(a => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            a.fullName.toLowerCase().includes(q) ||
            a.nickname.toLowerCase().includes(q) ||
            a.fspId.toLowerCase().includes(q) ||
            a.skills.some(s => s.toLowerCase().includes(q)) ||
            a.city.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Region
        if (selectedRegion !== 'Все регионы') {
          if (a.region !== selectedRegion) return false;
        }

        // Rank
        if (selectedRank !== 'Все разряды') {
          if (selectedRank === 'ЗМС / МСМК') {
            if (!a.fspRank.includes('ЗМС') && !a.fspRank.includes('МСМК') && !a.fspRank.includes('Заслуженный') && !a.fspRank.includes('международного')) return false;
          } else if (selectedRank === 'Мастер спорта РФ (МС)') {
            if (!a.fspRank.includes('Мастер спорта РФ')) return false;
          } else if (selectedRank === 'КМС (Кандидат в мастера)') {
            if (!a.fspRank.includes('КМС')) return false;
          } else if (selectedRank === '1-й спортивный разряд') {
            if (!a.fspRank.includes('1-й')) return false;
          } else if (selectedRank === '2-й спортивный разряд') {
            if (!a.fspRank.includes('2-й')) return false;
          }
        }

        // Tech Stack
        if (selectedStack !== 'Все стеки') {
          const stackKey = selectedStack.split(' ')[0].toLowerCase();
          const hasSkill = a.skills.some(s => s.toLowerCase().includes(stackKey));
          if (!hasSkill) return false;
        }

        // Min ELO
        if (minEloFilter > 0 && a.fspRating < minEloFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'elo') return b.fspRating - a.fspRating;
        if (sortBy === 'tasks') return b.solvedTasksCount - a.solvedTasksCount;
        if (sortBy === 'cleanliness') return b.codeCleanlinessScore - a.codeCleanlinessScore;
        if (sortBy === 'accuracy') return b.testScorePercent - a.testScorePercent;
        return 0;
      });
  }, [allAthletes, searchQuery, selectedRegion, selectedRank, selectedStack, minEloFilter, sortBy]);

  // Podium (Top 3) from original list
  const top1 = allAthletes[0];
  const top2 = allAthletes[1];
  const top3 = allAthletes[2];

  // Copy athlete registry link
  const handleCopyAthleteLink = (athlete: RegistryAthlete) => {
    const url = `${window.location.origin}${window.location.pathname}#leaderboard?athlete=${athlete.fspId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Rank badge styling helper
  const getRankBadge = (rank: string) => {
    if (rank.includes('Заслуженный') || rank.includes('ЗМС')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
    }
    if (rank.includes('международного') || rank.includes('МСМК')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
    }
    if (rank.includes('Мастер спорта')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
    }
    if (rank.includes('КМС')) {
      return 'bg-blue-500/20 text-cyan-300 border-cyan-500/40 font-bold';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 font-['JetBrains_Mono'] relative overflow-hidden pb-24">
      {/* Background Sport-Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c132c_1px,transparent_1px),linear-gradient(to_bottom,#0c132c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">

        {/* 1. Header Banner: Public Registry & National Status */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0b1229] via-[#070b1a] to-[#040712] border border-blue-500/20 shadow-2xl overflow-hidden">
          {/* Neon Glow accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                  <FspLogo size="sm" showText={false} />
                  <span>Единый Реестр ФСП РФ</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Сезон 2026</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  Аккредитовано Минспорта РФ
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 shrink-0" />
                <span>Национальный рейтинг атлетов ФСП</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Официальная публичная витрина лучших спортивных программистов России (ТОП-100).
                Верифицированные ELO-рейтинги, спортивные разряды (КМС, МС, МСМК), результаты олимпиадного программирования
                и прямая связь с аккредитованными работодателями без посредников.
              </p>
            </div>

            {/* Quick Summary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#060a17]/90 p-4 rounded-2xl border border-white/10 shrink-0 backdrop-blur-md">
              <div className="text-center p-2">
                <div className="text-xl sm:text-2xl font-black text-[#00f0ff]">1,420+</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">В реестре</div>
              </div>
              <div className="text-center p-2">
                <div className="text-xl sm:text-2xl font-black text-yellow-400">2,540</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Средний ТОП ELO</div>
              </div>
              <div className="text-center p-2">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Верификация</div>
              </div>
              <div className="text-center p-2">
                <div className="text-xl sm:text-2xl font-black text-purple-400">78</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Регионов РФ</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top-3 Podium (Пьедестал Почета) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-400" />
              <span>Лидеры национального зачета (Пьедестал почета)</span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Высшая Лига спортивного программирования
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* 2nd Place: Silver */}
            <div 
              onClick={() => setSelectedAthlete(top2)}
              className="order-2 md:order-1 p-5 rounded-2xl bg-gradient-to-b from-[#111933] to-[#070b18] border border-slate-400/40 hover:border-slate-300 transition-all cursor-pointer group shadow-xl relative transform md:translate-y-2 hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-300/20 text-slate-200 text-xs font-black border border-slate-300/40 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-300" />
                <span>#2 Серебро</span>
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative">
                  <img
                    src={top2.avatarUrl}
                    alt={top2.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-slate-200 rounded-full text-black font-black text-[10px]">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    {top2.fullName}
                  </h3>
                  <span className="text-xs text-slate-400">@{top2.nickname}</span>
                  <div className="text-[10px] text-cyan-400 font-mono">{top2.fspId}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Рейтинг ФСП ELO:</span>
                  <span className="text-lg font-black text-slate-200 font-mono">{top2.fspRating} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Разряд:</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] ${getRankBadge(top2.fspRank)}`}>
                    {top2.fspRank}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Регион:</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {top2.city}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {top2.skills.slice(0, 2).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-300 text-[10px] border border-blue-500/20">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                  Подробнее <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* 1st Place: Gold Champion */}
            <div 
              onClick={() => setSelectedAthlete(top1)}
              className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-[#1c1c38] via-[#0f142b] to-[#080d1e] border-2 border-yellow-400/60 hover:border-yellow-400 transition-all cursor-pointer group shadow-2xl relative shadow-yellow-500/10 hover:-translate-y-2"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-black shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>#1 Чемпион России</span>
              </div>

              <div className="flex items-center gap-4 mb-4 mt-2">
                <div className="relative">
                  <img
                    src={top1.avatarUrl}
                    alt={top1.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-yellow-400 text-black rounded-full font-black text-xs">
                    👑
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                    {top1.fullName}
                  </h3>
                  <span className="text-xs text-yellow-300/80 font-bold">@{top1.nickname}</span>
                  <div className="text-[10px] text-cyan-400 font-mono">{top1.fspId}</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs bg-[#040714]/60 p-3.5 rounded-2xl border border-yellow-400/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Рейтинг ФСП ELO:</span>
                  <span className="text-2xl font-black text-yellow-400 font-mono tracking-tight">{top1.fspRating} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Звание / Разряд:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold">
                    {top1.fspRank}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Локация / ВУЗ:</span>
                  <span className="text-slate-200 font-bold flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-yellow-400 shrink-0" />
                    {top1.city} ({top1.universityOrOrg?.split('/')[0]})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Олимпиадных задач:</span>
                  <span className="text-emerald-400 font-mono font-bold">{top1.solvedTasksCount} (LeetCode Hard: {top1.leetcodeHardSolved})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {top1.skills.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-300 text-[10px] border border-yellow-400/20">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-yellow-400 font-black group-hover:underline flex items-center gap-1">
                  Профиль атлета <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* 3rd Place: Bronze */}
            <div 
              onClick={() => setSelectedAthlete(top3)}
              className="order-3 p-5 rounded-2xl bg-gradient-to-b from-[#171321] to-[#070b18] border border-amber-700/40 hover:border-amber-500 transition-all cursor-pointer group shadow-xl relative transform md:translate-y-4 hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-700/20 text-amber-300 text-xs font-black border border-amber-700/40 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-500" />
                <span>#3 Бронза</span>
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative">
                  <img
                    src={top3.avatarUrl}
                    alt={top3.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-600 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-amber-600 rounded-full text-black font-black text-[10px]">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                    {top3.fullName}
                  </h3>
                  <span className="text-xs text-slate-400">@{top3.nickname}</span>
                  <div className="text-[10px] text-cyan-400 font-mono">{top3.fspId}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Рейтинг ФСП ELO:</span>
                  <span className="text-lg font-black text-amber-300 font-mono">{top3.fspRating} pts</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Разряд:</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] ${getRankBadge(top3.fspRank)}`}>
                    {top3.fspRank}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Регион:</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {top3.city}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {top3.skills.slice(0, 2).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-300 text-[10px] border border-blue-500/20">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                  Подробнее <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Comprehensive Filter & Search Toolbar */}
        <div className="p-5 rounded-2xl bg-[#090e21] border border-[#162140] space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по ФИО, никнейму, FSP ID (напр. FSP-RUS-2024-8841), стеку или городу..."
                className="w-full pl-10 pr-4 py-2 bg-[#040714] border border-[#1d2a4d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions & View Switcher */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              {/* Table / Cards toggle */}
              <div className="flex items-center bg-[#050817] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Табличный вид"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Вид карточек"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Sort By Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#050817] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                <option value="elo">Сортировка: Рейтинг ELO (max)</option>
                <option value="tasks">Сортировка: Решенные задачи</option>
                <option value="cleanliness">Сортировка: Чистота кода</option>
                <option value="accuracy">Сортировка: Точность тестов</option>
              </select>
            </div>
          </div>

          {/* Filters Row: Region, Rank, Tech Stack, Min ELO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* 1. Region */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Регион РФ:
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#050817] border border-[#1b2749] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 2. Sport Rank */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-yellow-400" />
                Спортивный разряд:
              </label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#050817] border border-[#1b2749] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                {SPORT_RANKS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 3. Tech Stack */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Code2 className="w-3 h-3 text-purple-400" />
                Стек технологий:
              </label>
              <select
                value={selectedStack}
                onChange={(e) => setSelectedStack(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#050817] border border-[#1b2749] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                {TECH_STACKS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 4. Min ELO tier */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                Порог ELO:
              </label>
              <select
                value={minEloFilter}
                onChange={(e) => setMinEloFilter(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[#050817] border border-[#1b2749] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                <option value={0}>Любой рейтинг ELO</option>
                <option value={2600}>Высшая лига (2600+ ELO)</option>
                <option value={2300}>Мастера (2300+ ELO)</option>
                <option value={2000}>Кандидаты (2000+ ELO)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Count */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400">
            <div>
              Найдено спортсменов: <strong className="text-white font-mono">{filteredAthletes.length}</strong> из 100
            </div>
            {(selectedRegion !== 'Все регионы' || selectedRank !== 'Все разряды' || selectedStack !== 'Все стеки' || minEloFilter > 0 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedRegion('Все регионы');
                  setSelectedRank('Все разряды');
                  setSelectedStack('Все стеки');
                  setMinEloFilter(0);
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer text-[11px]"
              >
                Сбросить все фильтры
              </button>
            )}
          </div>
        </div>

        {/* 4. Leaderboard View: Table or Cards */}
        {viewMode === 'table' ? (
          <div className="rounded-2xl bg-[#070b1a] border border-[#162140] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#040714] border-b border-[#162140] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 w-16">Ранг</th>
                    <th className="py-3.5 px-4">Спортсмен / FSP ID</th>
                    <th className="py-3.5 px-4">Спортивный разряд</th>
                    <th className="py-3.5 px-4">Регион</th>
                    <th className="py-3.5 px-4">Стек навыков</th>
                    <th className="py-3.5 px-4 text-center">Задач (Hard)</th>
                    <th className="py-3.5 px-4 text-center">Чистота кода</th>
                    <th className="py-3.5 px-4 text-right">Рейтинг ELO</th>
                    <th className="py-3.5 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAthletes.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAthlete(a)}
                      className="hover:bg-blue-600/10 transition-colors cursor-pointer group"
                    >
                      {/* Rank Position & Trend */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <div className="flex items-center gap-1.5">
                          {a.rankPosition === 1 ? (
                            <span className="w-6 h-6 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 flex items-center justify-center text-xs">
                              🥇
                            </span>
                          ) : a.rankPosition === 2 ? (
                            <span className="w-6 h-6 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center text-xs">
                              🥈
                            </span>
                          ) : a.rankPosition === 3 ? (
                            <span className="w-6 h-6 rounded-lg bg-amber-700/20 text-amber-300 border border-amber-700/40 flex items-center justify-center text-xs">
                              🥉
                            </span>
                          ) : (
                            <span className="text-slate-400 w-6 text-center">
                              #{a.rankPosition}
                            </span>
                          )}

                          {a.ratingChange > 0 ? (
                            <span className="text-[10px] text-emerald-400 flex items-center" title="Рост рейтинга">
                              <TrendingUp className="w-3 h-3" />
                            </span>
                          ) : a.ratingChange < 0 ? (
                            <span className="text-[10px] text-rose-400 flex items-center" title="Коррекция">
                              <TrendingDown className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              <Minus className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Athlete info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.avatarUrl}
                            alt={a.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                              <span>{a.fullName}</span>
                              {a.isFspVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" title="Верифицирован ФСП РФ" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span>@{a.nickname}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-[10px] text-cyan-400 font-mono">{a.fspId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rank */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] border whitespace-nowrap ${getRankBadge(a.fspRank)}`}>
                          {a.fspRank}
                        </span>
                      </td>

                      {/* Region */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{a.city}</span>
                        </div>
                      </td>

                      {/* Tech Stack */}
                      <td className="py-3.5 px-4">
                        <div className="flex gap-1 flex-wrap max-w-xs">
                          {a.skills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-300 text-[10px] border border-white/10 whitespace-nowrap">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Solved Tasks */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="text-white font-bold">{a.solvedTasksCount}</span>
                        <span className="text-slate-500 text-[10px] ml-1">({a.leetcodeHardSolved} hard)</span>
                      </td>

                      {/* Code Cleanliness */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                          {a.codeCleanlinessScore}/100
                        </span>
                      </td>

                      {/* ELO Rating */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors">
                          {a.fspRating}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {a.fspRating >= 2600 ? 'Высшая Лига' : a.fspRating >= 2300 ? 'Премьер' : '1-я Лига'}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAthlete(a)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                            title="Открыть профиль спортсмена"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {onSendOfferToCandidate && (
                            <button
                              onClick={() => onSendOfferToCandidate(a.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                              title="Пригласить / Предложить оффер"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAthlete(a)}
                className="p-5 rounded-2xl bg-[#070b1a] border border-[#162140] hover:border-cyan-400/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={a.avatarUrl}
                          alt={a.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-black/80 text-white font-mono text-[9px] font-bold border border-white/20">
                          #{a.rankPosition}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                          {a.fullName}
                          {a.isFspVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </h4>
                        <span className="text-[11px] text-slate-400">@{a.nickname}</span>
                        <div className="text-[10px] text-cyan-400 font-mono">{a.fspId}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-yellow-400 font-mono">{a.fspRating} pts</div>
                      <span className="text-[9px] text-emerald-400 font-mono">+{a.ratingChange} ELO</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Спортивный разряд:</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] border ${getRankBadge(a.fspRank)}`}>
                        {a.fspRank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Регион:</span>
                      <span className="text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {a.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Чистота кода:</span>
                      <span className="text-emerald-400 font-mono font-bold">{a.codeCleanlinessScore}/100</span>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap pt-3">
                    {a.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[10px] border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Задач: <strong className="text-white">{a.solvedTasksCount}</strong>
                  </span>
                  <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                    Подробнее <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 5. Athlete Profile Modal Preview */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0a0f24] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-6 animate-fadeIn font-['JetBrains_Mono']">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-[#070b1a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30 text-cyan-300">
                  <FspLogo size="sm" showText={false} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Верифицированная карточка атлета ФСП
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Реестр РФ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Официальный идентификатор: <strong className="text-cyan-400 font-mono">{selectedAthlete.fspId}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAthlete(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Athlete Banner */}
              <div className="p-4 rounded-2xl bg-[#050817] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <img
                  src={selectedAthlete.avatarUrl}
                  alt={selectedAthlete.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
                      {selectedAthlete.fullName}
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-mono font-bold self-center sm:self-auto">
                      Позиция #{selectedAthlete.rankPosition}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <span>@{selectedAthlete.nickname}</span>
                    <span>•</span>
                    <span className="text-slate-300">{selectedAthlete.grade} {selectedAthlete.specialization.toUpperCase()}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] border font-bold ${getRankBadge(selectedAthlete.fspRank)}`}>
                      {selectedAthlete.fspRank}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {selectedAthlete.city} ({selectedAthlete.region})
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#060a1a] border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Рейтинг ELO</div>
                  <div className="text-xl font-black text-yellow-400 font-mono mt-0.5">{selectedAthlete.fspRating}</div>
                  <div className="text-[9px] text-emerald-400 font-mono">+{selectedAthlete.ratingChange} за тур</div>
                </div>

                <div className="p-3 rounded-xl bg-[#060a1a] border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Чистота кода</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{selectedAthlete.codeCleanlinessScore}/100</div>
                  <div className="text-[9px] text-slate-400 font-mono">No Code Smells</div>
                </div>

                <div className="p-3 rounded-xl bg-[#060a1a] border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Олимпиадных задач</div>
                  <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">{selectedAthlete.solvedTasksCount}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Hard: {selectedAthlete.leetcodeHardSolved}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#060a1a] border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Точность тестов</div>
                  <div className="text-xl font-black text-purple-400 font-mono mt-0.5">{selectedAthlete.testScorePercent}%</div>
                  <div className="text-[9px] text-slate-400 font-mono">{selectedAthlete.avgExecutionTimeMs} ms avg</div>
                </div>
              </div>

              {/* AI-Summary Portrait */}
              {selectedAthlete.summaryText && (
                <div className="p-4 rounded-2xl bg-[#060a1c] border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-purple-400" />
                      Технический портрет ИИ-аналитика ФСП (AI-Summary)
                    </span>
                    <span className="text-[10px] text-slate-400">YandexGPT Pro Live</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    "{selectedAthlete.summaryText}"
                  </p>
                </div>
              )}

              {/* Skills Stack */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Подтвержденный технологический стек:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedAthlete.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-cyan-300 text-xs border border-blue-500/30 font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Organization or University */}
              {selectedAthlete.universityOrOrg && (
                <div className="p-3 rounded-xl bg-[#040714] border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Базовый ВУЗ / Компания:
                  </span>
                  <span className="text-white font-bold">{selectedAthlete.universityOrOrg}</span>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#050817] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleCopyAthleteLink(selectedAthlete)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Ссылка скопирована' : 'Поделиться профилем'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const downloadUrl = `/api/v1/candidates/${selectedAthlete.id}/export-pdf`;
                    window.open(downloadUrl, '_blank');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF-выписка</span>
                </button>

                {onSendOfferToCandidate && (
                  <button
                    onClick={() => {
                      onSendOfferToCandidate(selectedAthlete.id);
                      setSelectedAthlete(null);
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Предложить оффер</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
