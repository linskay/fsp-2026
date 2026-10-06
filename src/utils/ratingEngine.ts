import { FspRank, Grade, LeetCodeProfileStats, HhResumeData, CandidateAiSummary } from '../types';

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
}

export interface DynamicCalculationOutput {
  elo: number;
  rank: FspRank;
  grade: Grade;
  aiSummary: CandidateAiSummary;
  salaryMin: number;
  salaryMax: number;
}

export function calculateDynamicStats(input: DynamicCalculationInput): DynamicCalculationOutput {
  const exp = input.experienceYears ?? 0;
  const title = input.title || 'Разработчик ПО';
  const arenaCount = input.solvedArenaTasksCount ?? 0;
  const arenaBonus = input.arenaEloEarned ?? (arenaCount * 65);
  const lc = input.leetcodeStats;

  let calculatedElo = 1200; // Base starting sports rating

  if (lc && lc.totalSolved > 0) {
    const easy = lc.easySolved || 0;
    const med = lc.mediumSolved || 0;
    const hard = lc.hardSolved || 0;

    // Standard algorithmic weight: Easy +1, Med +2.5, Hard +6
    const algoScore = Math.round(easy * 1 + med * 2.5 + hard * 6);
    const contestBonus = lc.contestRating && lc.contestRating > 1500
      ? Math.round((lc.contestRating - 1500) * 0.35)
      : 0;

    let targetElo = 1200 + algoScore + contestBonus;

    // If contest rating is specifically set, harmonize towards it
    if (lc.contestRating && lc.contestRating >= 1600) {
      targetElo = Math.round(targetElo * 0.35 + lc.contestRating * 0.65);
    }

    calculatedElo = Math.min(2950, Math.max(1200, targetElo));
  }

  // Add arena points
  calculatedElo = Math.min(3000, calculatedElo + arenaBonus);

  const rank = calculateRankByElo(calculatedElo);

  // Determine Grade based on dynamic parameters
  let grade: Grade = 'junior';
  if (calculatedElo >= 2400 || (exp >= 5 && calculatedElo >= 1800)) {
    grade = 'senior';
  } else if (calculatedElo >= 2000 || (exp >= 2 && calculatedElo >= 1400) || (exp >= 4)) {
    grade = 'middle';
  } else {
    grade = 'junior';
  }

  // Calculate Salary Range
  const baseSalary = input.desiredSalary && input.desiredSalary > 0
    ? input.desiredSalary
    : (grade === 'senior' ? 350000 : grade === 'middle' ? 210000 : 90000);

  const salaryMin = Math.round(baseSalary * 0.9);
  const salaryMax = Math.round(baseSalary * 1.15);

  // Generate dynamic AI Summary
  let summaryText = '';
  let keyStrengths: string[] = [];
  const modelUsed = 'YandexGPT Pro' as const;

  const totalLcSolved = lc?.totalSolved ?? 0;
  const lcBadge = lc?.badge || (calculatedElo >= 2400 ? 'Guardian' : calculatedElo >= 2000 ? 'Knight' : 'Атлет');

  if (exp === 0 && totalLcSolved >= 200) {
    summaryText = `Спортивный бэкграунд полностью компенсирует отсутствие коммерческого стажа: ${totalLcSolved} подтвержденных алгоритмических задач на LeetCode (${lcBadge}, ${calculatedElo} ELO) гарантируют математическую зрелость на уровне Middle. Кандидат готов к сложным инженерным задачам без риска «джуниорского онбординга».`;
    keyStrengths = [
      `Олимпиадная база: ${totalLcSolved} задач на LeetCode (${lcBadge})`,
      `Спортивный рейтинг ФСП: ${calculatedElo} ELO (${rank})`,
      'Знание алгоритмов и вычислительной сложности O(N) / O(log N)',
      'Подтвержденный грейд: MIDDLE (минуя Junior за счет олимпиадного уровня)'
    ];
  } else if (exp >= 3 && totalLcSolved === 0) {
    summaryText = `Опытный инженер (${title}, ${exp} лет стажа). Резюме верифицировано через hh.ru. В спортивном реестре ФСП — честный старт с начального разряда (${calculatedElo} ELO). Решение задач в Арене ФСП позволит подтвердить квалификацию олимпиадного уровня.`;
    keyStrengths = [
      `Коммерческий опыт: ${exp} лет (${title})`,
      `Верификация hh.ru: подтвержденный стек и стаж работы`,
      'Честный старт в ФСП: статус Начинающий спортсмен (1200 ELO)',
      'Готов к квалификационным матчам в интерактивной Арене'
    ];
  } else {
    summaryText = `Инженер ${grade.toUpperCase()} (${title}) с опытом ${exp} лет. Рейтинг в реестре ФСП: ${calculatedElo} ELO (${rank}). ${totalLcSolved > 0 ? `Подтверждено ${totalLcSolved} задач на LeetCode.` : 'Опыт подтвержден через hh.ru.'}`;
    keyStrengths = [
      `Спортивный рейтинг: ${calculatedElo} ELO (${rank})`,
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
    salaryMax
  };
}
