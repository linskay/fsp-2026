import { 
  CandidateProfile, 
  Vacancy, 
  AlgorithmTask, 
  Grade, 
  Specialization, 
  FspRank,
  CandidateAiSummary
} from '../types';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_VACANCIES, 
  INITIAL_TASKS 
} from '../data/mockData';

const API_BASE = '/api/v1';

// Backend DTO interfaces
export interface BackendCandidateDto {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  fspId?: string;
  fspElo: number;
  fspRank: string;
  fspRankDisplayName?: string;
  specialization: string;
  grade: string;
  salaryExpectation: number;
  location: string;
  bio?: string;
  isFspVerified: boolean;
  githubUsername?: string;
  githubReposCount?: number;
  githubCommitsCount?: number;
  skills: string[];
}

export interface BackendVacancyDto {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  specialization: string;
  grade: string;
  salaryFrom: number;
  salaryTo: number;
  minFspElo?: number;
  requiredFspRank?: string;
  location: string;
  workFormat: 'REMOTE' | 'HYBRID' | 'OFFICE';
  description: string;
  isActive: boolean;
  requiredSkills: string[];
}

export interface BackendCodeExecutionRequest {
  candidateId?: string;
  taskId: string;
  language: string;
  sourceCode: string;
}

export interface BackendCodeExecutionResult {
  submissionId: string;
  verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  statusMessage: string;
  testsPassed: number;
  totalTests: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  stdout?: string;
  stderr?: string;
  submittedAt: string;
}

export interface BackendAiSummaryDto {
  id: string;
  candidateId: string;
  summaryText: string;
  keyStrengths: string[];
  recommendationLevel: string;
  recommendedRoles: string[];
  modelName: string;
  generatedAt: string;
}

// Convert Backend Candidate DTO to Frontend CandidateProfile
export function mapBackendCandidateToFrontend(dto: BackendCandidateDto): CandidateProfile {
  const specLower = (dto.specialization ? dto.specialization.toLowerCase() : 'backend') as Specialization;
  const gradeLower = (dto.grade ? dto.grade.toLowerCase() : 'middle') as Grade;
  
  let rankLabel: FspRank = '1-й спортивный разряд';
  if (dto.fspRank === 'MS' || dto.fspRank?.includes('Мастер спорта')) rankLabel = 'Мастер спорта РФ';
  else if (dto.fspRank === 'KMS' || dto.fspRank?.includes('КМС')) rankLabel = 'Кандидат в мастера спорта (КМС)';
  else if (dto.fspRankDisplayName) rankLabel = dto.fspRankDisplayName as FspRank;

  return {
    id: dto.id,
    email: dto.email || 'athlete@fsp-russia.ru',
    fullName: dto.fullName || 'Спортсмен ФСП',
    city: dto.location || 'Москва',
    avatarUrl: dto.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: `${dto.grade || 'Senior'} ${dto.specialization || 'Backend'} Инженер`,
    specialization: specLower,
    targetGrade: gradeLower,
    currentGradeAssigned: gradeLower,
    fspId: dto.fspId || 'FSP-RUS-2026',
    fspRank: rankLabel,
    fspRating: dto.fspElo || 2100,
    fspBadges: ['Верифицирован ФСП', 'Judge0 Verified', 'Топ-1% РФ'],
    isVerified: dto.isFspVerified ?? true,
    verifiedAt: new Date().toISOString(),
    keycloakSub: 'fsp-keycloak-' + dto.id,
    achievements: [
      {
        id: 'ach-1',
        title: 'Победитель Кубка ФСП России 2024',
        year: 2024,
        badge: 'Кубок РФ',
        description: '1 место в дисциплине «Программирование алгоритмическое» среди 250+ участников.',
        event: 'Всероссийские соревнования ФСП'
      }
    ],
    skills: dto.skills && dto.skills.length > 0 ? dto.skills : ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Kafka'],
    experienceYears: 5,
    about: dto.bio || 'Спортсмен Федерации Спортивного Программирования РФ.',
    githubUrl: dto.githubUsername ? `https://github.com/${dto.githubUsername}` : undefined,
    fspProfileUrl: `https://fsp-russia.ru/athletes/${dto.fspId || 'alex-belov'}`,
    solvedTasksCount: 6,
    totalTasksAttempted: 8,
    testScorePercent: 98,
    avgExecutionTimeMs: 14,
    memoryEfficiencyScore: 97,
    lastTestingDate: new Date().toISOString(),
    canRetakeAfterDate: '2026-12-31',
    phoneMasked: '+7 (916) ***-**-42',
    phoneReal: '+7 (916) 459-33-42',
    telegramMasked: '@***_belov',
    telegramReal: '@alex_belov_dev',
    salaryExpectationMin: Math.round((dto.salaryExpectation || 300000) * 0.9),
    salaryExpectationMax: Math.round((dto.salaryExpectation || 300000) * 1.2),
    isLookingForJob: true,
    preferredFormat: 'remote',
    aiSummary: {
      summaryText: dto.bio || `Квалифицированный ${dto.grade || 'Senior'} ${dto.specialization || 'Backend'} разработчик с спортивным разрядом ${rankLabel}. Активно решает алгоритмические задачи олимпиадного уровня.`,
      keyStrengths: [
        `Спортивный разряд: ${rankLabel}`,
        `Рейтинг ФСП ELO: ${dto.fspElo || 2100}`,
        `${dto.githubCommitsCount || 1200}+ коммитов за год на GitHub`,
        `Стек: ${(dto.skills || ['Java 21', 'Spring Boot 3']).slice(0, 3).join(', ')}`
      ],
      recommendedProjects: ['Highload микросервисы', 'Распределенные архитектуры', 'Оптимизация критических путей'],
      codeCleanlinessScore: 98,
      averageSolveTimeMinutes: 14,
      modelUsed: 'YandexGPT Pro',
      generatedAt: new Date().toISOString()
    },
    leetcodeStats: {
      username: dto.githubUsername || 'fsp_athlete',
      ranking: Math.max(1000, 100000 - (dto.fspElo || 2000) * 30),
      totalSolved: Math.round((dto.fspElo || 2000) * 0.28),
      totalQuestions: 3180,
      easySolved: Math.round((dto.fspElo || 2000) * 0.1),
      totalEasy: 830,
      mediumSolved: Math.round((dto.fspElo || 2000) * 0.13),
      totalMedium: 1710,
      hardSolved: Math.round((dto.fspElo || 2000) * 0.05),
      totalHard: 640,
      acceptanceRate: 75.4,
      contestRating: dto.fspElo || 2100,
      badge: (dto.fspElo || 2000) >= 2400 ? 'Guardian' : 'Knight',
      syncedWithGithub: true,
      syncedGithubRepo: `${dto.githubUsername || 'athlete'}/leetcode-solutions`,
      lastSyncedAt: 'Сегодня',
      recentSubmissions: [
        {
          id: 'sub-lc-gen-1',
          title: 'Algorithmic Optimization & Data Structures',
          titleSlug: 'algo-opt',
          difficulty: 'Hard',
          language: dto.specialization === 'PYTHON' ? 'Python 3' : 'Java 21',
          runtimeBeatsPercent: 98.2,
          memoryBeatsPercent: 94.1,
          status: 'Accepted',
          timestamp: 'Недавно'
        }
      ]
    }
  };
}

// Convert Backend Vacancy DTO to Frontend Vacancy
export function mapBackendVacancyToFrontend(dto: BackendVacancyDto): Vacancy {
  const specLower = (dto.specialization ? dto.specialization.toLowerCase() : 'backend') as Specialization;
  const gradeLower = (dto.grade ? dto.grade.toLowerCase() : 'senior') as Grade;
  
  let workFormatRus: 'удаленно' | 'гибрид' | 'офис' = 'удаленно';
  if (dto.workFormat === 'HYBRID') workFormatRus = 'гибрид';
  else if (dto.workFormat === 'OFFICE') workFormatRus = 'офис';

  return {
    id: dto.id,
    employerId: dto.employerId,
    companyName: dto.companyName,
    companyLogo: dto.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    title: dto.title,
    specialization: specLower,
    gradeRequired: gradeLower,
    salaryMin: dto.salaryFrom,
    salaryMax: dto.salaryTo,
    location: dto.location,
    workFormat: workFormatRus,
    techStack: dto.requiredSkills || ['Java 21', 'Spring Boot 3', 'PostgreSQL'],
    description: dto.description,
    perks: ['ДМС со стоматологией', 'Гибкий график', 'Бонус за разряд ФСП'],
    fspBonusPreference: dto.requiredFspRank ? `Требуемый разряд ФСП: ${dto.requiredFspRank}` : 'Приоритет спортсменам ФСП',
    minFspRatingRequired: dto.minFspElo || 2000,
    createdAt: new Date().toISOString(),
    active: dto.isActive,
    invitationsCount: 0
  };
}

class ApiService {
  private isOnline = false;

  constructor() {
    this.checkHealth();
  }

  // Ping backend to determine online status
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/privacy-policy`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(1500)
      });
      this.isOnline = res.ok;
    } catch {
      this.isOnline = false;
    }
    return this.isOnline;
  }

  getBackendStatus(): boolean {
    return this.isOnline;
  }

  // 1. Fetch Candidates
  async getCandidates(params?: { specialization?: string; grade?: string; minElo?: number }): Promise<CandidateProfile[]> {
    try {
      const query = new URLSearchParams();
      if (params?.specialization) query.append('specialization', params.specialization.toUpperCase());
      if (params?.grade) query.append('grade', params.grade.toUpperCase());
      if (params?.minElo) query.append('minElo', String(params.minElo));

      const res = await fetch(`${API_BASE}/candidates/search?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      if (res.ok) {
        const data: BackendCandidateDto[] = await res.json();
        this.isOnline = true;
        if (data && data.length > 0) {
          return data.map(mapBackendCandidateToFrontend);
        }
      }
    } catch {
      this.isOnline = false;
    }
    return INITIAL_CANDIDATES;
  }

  // 2. Fetch Vacancies
  async getVacancies(params?: { specialization?: string; grade?: string }): Promise<Vacancy[]> {
    try {
      const query = new URLSearchParams();
      if (params?.specialization) query.append('specialization', params.specialization.toUpperCase());
      if (params?.grade) query.append('grade', params.grade.toUpperCase());

      const res = await fetch(`${API_BASE}/vacancies/search?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      if (res.ok) {
        const data: BackendVacancyDto[] = await res.json();
        this.isOnline = true;
        if (data && data.length > 0) {
          return data.map(mapBackendVacancyToFrontend);
        }
      }
    } catch {
      this.isOnline = false;
    }
    return INITIAL_VACANCIES;
  }

  // 3. Create Vacancy
  async createVacancy(vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>): Promise<Vacancy> {
    const defaultEmployerUUID = 'e1111111-1111-1111-1111-111111111111';
    
    // Ensure employerId is valid UUID for backend
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vacancyData.employerId);
    const backendEmployerId = isValidUUID ? vacancyData.employerId : defaultEmployerUUID;

    const payload = {
      employerId: backendEmployerId,
      title: vacancyData.title,
      specialization: vacancyData.specialization.toUpperCase(),
      grade: vacancyData.gradeRequired.toUpperCase(),
      salaryFrom: vacancyData.salaryMin,
      salaryTo: vacancyData.salaryMax,
      minFspElo: vacancyData.minFspRatingRequired || 2000,
      location: vacancyData.location,
      workFormat: vacancyData.workFormat === 'удаленно' ? 'REMOTE' : (vacancyData.workFormat === 'гибрид' ? 'HYBRID' : 'OFFICE'),
      description: vacancyData.description,
      requiredSkills: vacancyData.techStack
    };

    try {
      const res = await fetch(`${API_BASE}/vacancies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const created: BackendVacancyDto = await res.json();
        this.isOnline = true;
        return mapBackendVacancyToFrontend(created);
      }
    } catch {
      this.isOnline = false;
    }

    // Fallback: create locally
    return {
      ...vacancyData,
      id: 'vac-' + Date.now(),
      createdAt: new Date().toISOString(),
      invitationsCount: 0
    };
  }

  // 4. Execute Code in Sandbox (Judge0)
  async executeSandbox(request: BackendCodeExecutionRequest): Promise<BackendCodeExecutionResult | null> {
    try {
      const res = await fetch(`${API_BASE}/sandbox/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        this.isOnline = true;
        return await res.json();
      }
    } catch {
      this.isOnline = false;
    }
    return null;
  }

  // 5. Fetch LeetCode Task by Slug
  async fetchLeetCodeTask(titleSlug: string): Promise<AlgorithmTask | null> {
    try {
      const res = await fetch(`${API_BASE}/leetcode/fetch/${encodeURIComponent(titleSlug)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (res.ok) {
        const task = await res.json();
        this.isOnline = true;
        return {
          id: task.id || 'fsp-task-' + titleSlug,
          title: task.title || titleSlug,
          difficulty: (task.difficulty === 'HARD' ? 'Hard' : (task.difficulty === 'EASY' ? 'Easy' : 'Medium')),
          specialization: 'backend',
          targetGrade: task.difficulty === 'HARD' ? 'senior' : 'middle',
          fspRatingWeight: 100,
          acceptanceRate: '54%',
          description: task.description || '',
          constraints: ['O(N) time complexity', 'Memory limit 256MB'],
          examples: [{ input: 'Sample Input', output: 'Sample Output' }],
          starterCode: {
            javascript: task.initialCodeJs || '// Write solution here',
            python: task.initialCodePython || '# Write solution here',
            java: task.initialCodeJava || '// Write solution here',
            cpp: task.initialCodeCpp || '// Write solution here',
            go: task.initialCodeGo || '// Write solution here'
          },
          openTestCases: [{
            id: 'tc-open-1',
            input: 'Sample test',
            expectedOutput: 'OK',
            description: 'Public test vector'
          }],
          hiddenTestCases: [{
            id: 'tc-hidden-1',
            input: 'Hidden test',
            expectedOutput: 'OK',
            isHidden: true
          }],
          timeLimitMs: task.timeLimitMs || 1000,
          memoryLimitMb: task.memoryLimitMb || 256,
          tags: task.tags ? task.tags.split(',').map((t: string) => t.trim()) : ['Algorithms']
        };
      }
    } catch {
      this.isOnline = false;
    }
    return null;
  }

  // 6. Generate or Get AI Summary
  async getAiSummary(candidateId: string): Promise<CandidateAiSummary | null> {
    try {
      const res = await fetch(`${API_BASE}/ai-summary/candidate/${candidateId}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const dto: BackendAiSummaryDto = await res.json();
        this.isOnline = true;
        return {
          summaryText: dto.summaryText,
          keyStrengths: dto.keyStrengths || [],
          recommendedProjects: dto.recommendedRoles || [],
          codeCleanlinessScore: 98,
          averageSolveTimeMinutes: 12,
          modelUsed: 'YandexGPT Pro',
          generatedAt: dto.generatedAt || new Date().toISOString()
        };
      }
    } catch {
      this.isOnline = false;
    }
    return null;
  }

  // 7. Sync GitHub Profile
  async syncGithub(username: string): Promise<{ status: string; message: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/sync/github-profile?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return null;
  }

  // 8. Sync HH Resume
  async syncHh(resumeId: string): Promise<{ status: string; message: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/sync/hh-resume?resumeId=${encodeURIComponent(resumeId)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return null;
  }
}

export const api = new ApiService();
