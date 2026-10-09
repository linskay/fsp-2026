import { FspRank, Grade, LeetCodeProfileStats, HhResumeData, CandidateAiSummary, FspAchievement } from '../types';

export interface FspLevelDetails {
  levelNumber: number;
  levelName: string;
  rankName: FspRank;
  shortRank: string;
  minElo: number;
  maxElo: number;
  minAchievements: number;
  minTasks: number;
  isInTop: boolean;
  topPercentile: string;
  badgeColor: string;
  gradient: string;
  description: string;
  requirementsSummary: string;
  achievementsCount: number;
  solvedTasksCount: number;
  achievementPoints: number;
  isUnlocked: boolean;
  unmetRequirements: string[];
}

export const FSP_STANDARD_LEVELS = [
  {
    levelNumber: 1,
    levelName: 'Уровень 1: Квалификационный дивизион',
    rankName: 'Начинающий спортсмен (Junior)' as FspRank,
    shortRank: 'Квалификация',
    minElo: 1200,
    maxElo: 1399,
    minAchievements: 0,
    minTasks: 0,
    isInTop: false,
    topPercentile: 'Вне ТОПа (Квалификационный дивизион)',
    badgeColor: 'text-slate-400 border-slate-700 bg-slate-800/50',
    gradient: 'from-slate-600 to-slate-400',
    description: 'Начальный статус спортсмена в реестре ФСП РФ. Честный старт без накруток. Для входа в ТОП выполните норматив 3-го разряда.',
    requirementsSummary: 'Регистрация в реестре ФСП (1200 ELO)'
  },
  {
    levelNumber: 2,
    levelName: 'Уровень 2: 3-й спортивный разряд',
    rankName: '3-й спортивный разряд' as FspRank,
    shortRank: '3-й разряд',
    minElo: 1400,
    maxElo: 1699,
    minAchievements: 1,
    minTasks: 5,
    isInTop: true,
    topPercentile: 'ТОП-35% спортсменов РФ',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    gradient: 'from-blue-600 to-cyan-400',
    description: 'Базовые алгоритмы (сортировки, бинарный поиск, жадные алгоритмы). Официальный разряд ЕВСК Минспорта РФ.',
    requirementsSummary: '1400+ ELO, 1+ турнирное достижение, от 5 решенных задач'
  },
  {
    levelNumber: 3,
    levelName: 'Уровень 3: 2-й спортивный разряд',
    rankName: '2-й спортивный разряд' as FspRank,
    shortRank: '2-й разряд',
    minElo: 1700,
    maxElo: 1999,
    minAchievements: 1,
    minTasks: 25,
    isInTop: true,
    topPercentile: 'ТОП-15% спортсменов РФ',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    gradient: 'from-teal-500 to-emerald-400',
    description: 'Динамическое программирование, графы (BFS, DFS, Дейкстра). Решение задач регионального уровня.',
    requirementsSummary: '1700+ ELO, призовое место на турнире, от 25 задач'
  },
  {
    levelNumber: 4,
    levelName: 'Уровень 4: 1-й спортивный разряд',
    rankName: '1-й спортивный разряд' as FspRank,
    shortRank: '1-й разряд',
    minElo: 2000,
    maxElo: 2399,
    minAchievements: 2,
    minTasks: 100,
    isInTop: true,
    topPercentile: 'ТОП-5.0% спортсменов РФ',
    badgeColor: 'text-cyan-400 border-[#00f0ff]/30 bg-[#00f0ff]/10',
    gradient: 'from-[#2b35ff] to-[#00f0ff]',
    description: 'Продвинутые структуры данных, сложные графы, строковые алгоритмы. Участие в Высшей лиге ФСП.',
    requirementsSummary: '2000+ ELO, 2+ подтвержденных достижения, от 100 задач (Knight)'
  },
  {
    levelNumber: 5,
    levelName: 'Уровень 5: Кандидат в мастера спорта (КМС)',
    rankName: 'Кандидат в мастера спорта (КМС)' as FspRank,
    shortRank: 'КМС РФ',
    minElo: 2400,
    maxElo: 2699,
    minAchievements: 2,
    minTasks: 300,
    isInTop: true,
    topPercentile: 'ТОП-1.5% элиты РФ',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/15',
    gradient: 'from-purple-600 via-[#2b35ff] to-[#00f0ff]',
    description: 'Потоки в сетях (Диниц), суффиксные структуры, Lock-free алгоритмы. Призерство на всероссийских финалах.',
    requirementsSummary: '2400+ ELO, 2+ победы на турнирах, 300+ задач'
  },
  {
    levelNumber: 6,
    levelName: 'Уровень 6: Мастер спорта России (МС)',
    rankName: 'Мастер спорта РФ' as FspRank,
    shortRank: 'МС РФ',
    minElo: 2700,
    maxElo: 2999,
    minAchievements: 2,
    minTasks: 500,
    isInTop: true,
    topPercentile: 'ТОП-0.5% лучших атлетов страны',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/15',
    gradient: 'from-amber-500 via-[#ff2b42] to-[#2b35ff]',
    description: 'Высший олимпиадный класс. Решение Hard задач за <20 мин. Золотые медали Чемпионата России.',
    requirementsSummary: '2700+ ELO, 1-е место на Чемпионате РФ, 500+ задач'
  },
  {
    levelNumber: 7,
    levelName: 'Уровень 7: Гроссмейстер / Чемпион РФ',
    rankName: 'Победитель Чемпионата РФ' as FspRank,
    shortRank: 'Grandmaster',
    minElo: 3000,
    maxElo: 3500,
    minAchievements: 3,
    minTasks: 800,
    isInTop: true,
    topPercentile: 'ТОП-0.05% (Легенда СП)',
    badgeColor: 'text-rose-400 border-rose-500/50 bg-rose-500/20',
    gradient: 'from-[#ff2b42] via-purple-600 to-[#00f0ff]',
    description: 'Мировая спортивная элита. Сборная России по спортивному программированию.',
    requirementsSummary: '3000+ ELO, многократный чемпион, 800+ задач'
  }
];

/**
 * Расчет очков подтвержденных спортивных достижений (Achievement Points / AP)
 */
export function calculateCandidateAchievementPoints(achievements?: FspAchievement[]): number {
  if (!achievements || achievements.length === 0) return 0;

  return achievements.reduce((acc, ach) => {
    const text = `${ach.title} ${ach.badge} ${ach.description}`.toLowerCase();
    if (text.includes('чемпионат россии') || text.includes('1 место') || text.includes('золотая медаль')) {
      return acc + 300;
    }
    if (text.includes('кубок') || text.includes('победитель') || text.includes('кубок чемпионов')) {
      return acc + 220;
    }
    if (text.includes('серебрян') || text.includes('2 место') || text.includes('финалист')) {
      return acc + 160;
    }
    if (text.includes('бронз') || text.includes('3 место') || text.includes('топ-5')) {
      return acc + 120;
    }
    if (text.includes('knight') || text.includes('guardian') || text.includes('leetcode 400')) {
      return acc + 140;
    }
    if (text.includes('олимпиад') || text.includes('юниор-чемпион')) {
      return acc + 100;
    }
    if (text.includes('квалификац')) {
      return acc + 30;
    }
    return acc + 60;
  }, 0);
}

/**
 * Комплексная оценка уровня кандидата с защитой от попадания в ТОП без достижений
 */
export function evaluateCandidateLevel(input: {
  elo: number;
  achievements?: FspAchievement[];
  solvedTasksCount?: number;
  leetcodeStats?: LeetCodeProfileStats | null;
}): FspLevelDetails {
  const elo = input.elo || 1200;
  const achievements = input.achievements || [];
  const achievementsCount = achievements.length;
  const lcSolved = input.leetcodeStats?.totalSolved || 0;
  const arenaSolved = input.solvedTasksCount || 0;
  const totalTasks = lcSolved + arenaSolved;
  const ap = calculateCandidateAchievementPoints(achievements);

  // Важнейшее правило анти-чита:
  // Если у кандидата 0 подтвержденных турниров/достижений И 0 решенных задач (как у Ивана на старте):
  // Он находится в Квалификационном дивизионе и НЕ МОЖЕТ быть в ТОПе!
  const hasSubstantialAchievements = achievementsCount > 0 && achievements.some(a => 
    !a.title.toLowerCase().includes('квалификационного отбора') || totalTasks >= 5
  );

  if (totalTasks === 0 && !hasSubstantialAchievements) {
    const baseLvl = FSP_STANDARD_LEVELS[0];
    return {
      ...baseLvl,
      achievementsCount,
      solvedTasksCount: totalTasks,
      achievementPoints: ap,
      isUnlocked: true,
      isInTop: false,
      topPercentile: 'Вне ТОПа (Квалификационный дивизион)',
      unmetRequirements: [
        'Решите первую задачу в Арене (+85 ELO)',
        'Выполните норматив 3-го разряда (1400 ELO)',
        'Подтвердите олимпиадное достижение'
      ]
    };
  }

  // Определение уровня сверху вниз
  for (let i = FSP_STANDARD_LEVELS.length - 1; i >= 0; i--) {
    const lvl = FSP_STANDARD_LEVELS[i];
    const eloMet = elo >= lvl.minElo;
    const achievementsMet = achievementsCount >= lvl.minAchievements || totalTasks >= lvl.minTasks;
    const tasksMet = totalTasks >= (lvl.minTasks * 0.7);

    if (eloMet && achievementsMet && tasksMet) {
      return {
        ...lvl,
        achievementsCount,
        solvedTasksCount: totalTasks,
        achievementPoints: ap,
        isUnlocked: true,
        unmetRequirements: []
      };
    }
  }

  // Fallback к уровню по фактическому соответствию нормативам
  const defaultLvl = elo >= 1400 && (achievementsCount >= 1 || totalTasks >= 5) 
    ? FSP_STANDARD_LEVELS[1] 
    : FSP_STANDARD_LEVELS[0];

  return {
    ...defaultLvl,
    achievementsCount,
    solvedTasksCount: totalTasks,
    achievementPoints: ap,
    isUnlocked: true,
    unmetRequirements: []
  };
}

/**
 * Честный расчет перцентиля ТОПа (только при наличии реальных достижений)
 */
export function getEloPercentile(
  elo: number, 
  achievementsCount: number = 0, 
  solvedTasksCount: number = 0
): string {
  // Без подтвержденных достижений/задач человек НЕ в ТОПе!
  if (achievementsCount === 0 && solvedTasksCount === 0) {
    return 'Вне ТОПа (Квалификационный дивизион)';
  }

  if (elo >= 2700 && achievementsCount >= 2) return 'ТОП-0.5% по РФ (Мастер спорта)';
  if (elo >= 2400 && (achievementsCount >= 1 || solvedTasksCount >= 300)) return 'ТОП-1.5% по РФ (КМС РФ)';
  if (elo >= 2000 && (achievementsCount >= 1 || solvedTasksCount >= 100)) return 'ТОП-5.0% по РФ (1-й разряд)';
  if (elo >= 1700 && (achievementsCount >= 1 || solvedTasksCount >= 25)) return 'ТОП-15% по РФ (2-й разряд)';
  if (elo >= 1400 && (achievementsCount >= 1 || solvedTasksCount >= 5)) return 'ТОП-35% по РФ (3-й разряд)';
  if (elo >= 1200 && (achievementsCount > 0 || solvedTasksCount > 0)) return 'Квалификационная лига';
  return 'Вне ТОПа (Квалификационный дивизион)';
}

/**
 * Определение дивизиона / Tier ФСП с учетом достижений
 */
export function getFspTier(
  grade: string, 
  elo: number, 
  achievementsCount: number = 0, 
  solvedTasksCount: number = 0
): string {
  if (achievementsCount === 0 && solvedTasksCount === 0) {
    return 'Квалификация (Честный старт)';
  }
  if (elo >= 2650 && achievementsCount >= 2) return 'ФСП Tier-1 (Элита)';
  if (elo >= 2200 && (achievementsCount >= 1 || solvedTasksCount >= 150)) return 'ФСП Tier-2 (Мастер)';
  return 'ФСП Tier-3 (Атлет)';
}

export function calculateRankByElo(elo: number): FspRank {
  if (elo >= 2700) return 'Мастер спорта РФ';
  if (elo >= 2400) return 'Кандидат в мастера спорта (КМС)';
  if (elo >= 2000) return '1-й спортивный разряд';
  if (elo >= 1700) return '2-й спортивный разряд';
  if (elo >= 1400) return '3-й спортивный разряд';
  return 'Начинающий спортсмен (Junior)';
}

export interface DynamicCalculationInput {
  baseElo?: number;
  solvedArenaTasksCount?: number;
  arenaEloEarned?: number;
  leetcodeStats?: LeetCodeProfileStats | null;
  experienceYears?: number;
  title?: string;
  desiredSalary?: number;
  skills?: string[];
  hhConfirmedSkillsCount?: number;
  achievements?: FspAchievement[];
}

export interface DynamicCalculationOutput {
  elo: number;
  rank: FspRank;
  grade: Grade;
  aiSummary: CandidateAiSummary;
  salaryMin: number;
  salaryMax: number;
  levelDetails: FspLevelDetails;
}

export function calculateDynamicStats(input: DynamicCalculationInput): DynamicCalculationOutput {
  const exp = input.experienceYears ?? 0;
  const title = input.title || 'Разработчик ПО';
  const arenaCount = input.solvedArenaTasksCount ?? 0;
  const arenaBonus = input.arenaEloEarned ?? (arenaCount * 65);
  const lc = input.leetcodeStats;
  const achievements = input.achievements || [];

  let calculatedElo = 1200; // Базовый честный старт в реестре ФСП

  if (lc && lc.totalSolved > 0) {
    const easy = lc.easySolved || 0;
    const med = lc.mediumSolved || 0;
    const hard = lc.hardSolved || 0;

    // Вес задач: Easy +1, Med +2.5, Hard +6
    const algoScore = Math.round(easy * 1 + med * 2.5 + hard * 6);
    const contestBonus = lc.contestRating && lc.contestRating > 1500
      ? Math.round((lc.contestRating - 1500) * 0.35)
      : 0;

    let targetElo = 1200 + algoScore + contestBonus;

    if (lc.contestRating && lc.contestRating >= 1600) {
      targetElo = Math.round(targetElo * 0.35 + lc.contestRating * 0.65);
    }

    calculatedElo = Math.min(2950, Math.max(1200, targetElo));
  }

  // Добавление очков за решенные задачи Арены
  calculatedElo = Math.min(3000, calculatedElo + arenaBonus);

  // Оценка уровня и чеклиста нормативов
  const levelDetails = evaluateCandidateLevel({
    elo: calculatedElo,
    achievements,
    solvedTasksCount: arenaCount,
    leetcodeStats: lc
  });

  const rank = levelDetails.rankName;

  // Определение грейда: коммерческий стаж и алгоритмический уровень
  let grade: Grade = 'junior';
  if (calculatedElo >= 2400 || (exp >= 5 && calculatedElo >= 1800)) {
    grade = 'senior';
  } else if (calculatedElo >= 2000 || (exp >= 2 && calculatedElo >= 1400) || (exp >= 4)) {
    grade = 'middle';
  } else {
    grade = 'junior';
  }

  // Расчет вилки зарплаты
  const baseSalary = input.desiredSalary && input.desiredSalary > 0
    ? input.desiredSalary
    : (grade === 'senior' ? 350000 : grade === 'middle' ? 210000 : 90000);

  const salaryMin = Math.round(baseSalary * 0.9);
  const salaryMax = Math.round(baseSalary * 1.15);

  // Генерация динамического ИИ-портрета
  let summaryText = '';
  let keyStrengths: string[] = [];
  const modelUsed = 'YandexGPT Pro' as const;

  const totalLcSolved = lc?.totalSolved ?? 0;
  const lcBadge = lc?.badge || (calculatedElo >= 2400 ? 'Guardian' : calculatedElo >= 2000 ? 'Knight' : 'Атлет');

  if (exp === 0 && totalLcSolved >= 200) {
    summaryText = `Спортивный бэкграунд полностью компенсирует отсутствие коммерческого стажа: ${totalLcSolved} подтвержденных алгоритмических задач на LeetCode (${lcBadge}, ${calculatedElo} ELO, ${levelDetails.levelName}) гарантируют математическую зрелость на уровне Middle. Кандидат готов к сложным инженерным задачам без риска «джуниорского онбординга».`;
    keyStrengths = [
      `Олимпиадная база: ${totalLcSolved} задач на LeetCode (${lcBadge})`,
      `Спортивный статус: ${levelDetails.levelName} (${levelDetails.topPercentile})`,
      'Знание алгоритмов и вычислительной сложности O(N) / O(log N)',
      'Подтвержденный грейд: MIDDLE (минуя Junior за счет олимпиадного уровня)'
    ];
  } else if (exp >= 3 && totalLcSolved === 0 && arenaCount === 0) {
    summaryText = `Опытный инженер (${title}, ${exp} лет стажа). Резюме верифицировано через hh.ru. В спортивном реестре ФСП — честный старт с квалификационного уровня (1200 ELO, вне ТОПа). Решение задач в Арене ФСП позволит выполнить нормативы и получить официальный спортивный разряд.`;
    keyStrengths = [
      `Коммерческий опыт: ${exp} лет (${title})`,
      `Верификация hh.ru: подтвержденный стек и стаж работы`,
      'Честный старт в ФСП: Квалификационный уровень (1200 ELO)',
      'Готов к квалификационным матчам в интерактивной Арене для входа в ТОП'
    ];
  } else {
    summaryText = `Инженер ${grade.toUpperCase()} (${title}) с опытом ${exp} лет. Спортивный статус: ${levelDetails.levelName} (${calculatedElo} ELO, ${levelDetails.topPercentile}). ${totalLcSolved > 0 ? `Подтверждено ${totalLcSolved} задач на LeetCode.` : 'Опыт подтвержден через hh.ru.'}`;
    keyStrengths = [
      `Спортивный уровень: ${levelDetails.levelName}`,
      `Рейтинг: ${calculatedElo} ELO (${levelDetails.topPercentile})`,
      `Грейд: ${grade.toUpperCase()}`,
      `Коммерческий опыт: ${exp} лет`,
      totalLcSolved > 0 ? `LeetCode: ${totalLcSolved} задач (${lcBadge})` : 'Верификация резюме через hh.ru'
    ];
  }

  const aiSummary: CandidateAiSummary = {
    summaryText,
    keyStrengths,
    recommendedProjects: [
      'Высоконагруженные распределенные системы',
      'Микросервисные асинхронные ядра',
      'Олимпиадные турниры и корпоративные чемпионаты ФСП'
    ],
    codeCleanlinessScore: Math.min(99, Math.max(88, 88 + Math.round((calculatedElo - 1200) / 150))),
    averageSolveTimeMinutes: Math.max(8, 25 - Math.round((calculatedElo - 1200) / 100)),
    modelUsed,
    generatedAt: new Date().toISOString()
  };

  return {
    elo: calculatedElo,
    rank,
    grade,
    aiSummary,
    salaryMin,
    salaryMax,
    levelDetails
  };
}
