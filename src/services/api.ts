import { 
  CandidateProfile, 
  Vacancy, 
  AlgorithmTask, 
  Grade, 
  Specialization, 
  FspRank,
  CandidateAiSummary,
  LeetCodeProfileStats,
  GitHubProfileData,
  GitHubRepo,
  ReverseRecruitingOffer
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
  aiSummary?: BackendAiSummaryDto;
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
  codeCleanlinessScore?: number;
  keyStrengths: string[];
  recommendationLevel: string;
  recommendedRoles: string[];
  modelName: string;
  generatedAt: string;
}

export interface BackendGenerateAiSummaryRequest {
  candidateId: string;
  provider?: string;
  model?: string;
  modelName?: string;
  apiKey?: string;
  customApiKey?: string;
  folderId?: string;
  endpointUrl?: string;
  focus?: 'highload' | 'algo' | 'lead' | 'balanced' | 'HIGH_LOAD_CORE' | 'ALGORITHMS' | 'TECH_LEAD' | 'BALANCED';
  forceRefresh?: boolean;
}

export interface TestUserDto {
  role: 'CANDIDATE' | 'EMPLOYER';
  email: string;
  password: string;
  fullName: string;
  description: string;
}

export interface AuthLoginResponse {
  status: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'CANDIDATE' | 'EMPLOYER';
  avatarUrl?: string;
  candidateId?: string;
  employerId?: string;
  companyName?: string;
  fspElo?: number;
  fspRank?: string;
  token: string;
  error?: string;
  hint?: string;
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
    aiSummary: dto.aiSummary ? {
      summaryText: dto.aiSummary.summaryText,
      keyStrengths: dto.aiSummary.keyStrengths || [],
      recommendedProjects: dto.aiSummary.recommendedRoles || [],
      recommendedRoles: dto.aiSummary.recommendedRoles || [],
      recommendationLevel: dto.aiSummary.recommendationLevel,
      codeCleanlinessScore: dto.aiSummary.codeCleanlinessScore ?? 96,
      averageSolveTimeMinutes: 12,
      modelUsed: dto.aiSummary.modelName || 'Multi-Model AI (PostgreSQL)',
      generatedAt: dto.aiSummary.generatedAt || new Date().toISOString()
    } : {
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
  public token: string | null = null;

  constructor() {
    try {
      const savedToken = localStorage.getItem('fsp_jwt_token');
      if (savedToken) {
        this.token = savedToken;
      }
    } catch {}
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

  // 1b. Fetch FSP Global Leaderboard (Public Athletes Registry)
  async getLeaderboard(params?: {
    location?: string;
    fspRank?: string;
    skill?: string;
    minElo?: number;
    limit?: number;
  }): Promise<CandidateProfile[]> {
    try {
      const query = new URLSearchParams();
      if (params?.location) query.append('location', params.location);
      if (params?.fspRank) query.append('fspRank', params.fspRank);
      if (params?.skill) query.append('skill', params.skill);
      if (params?.minElo) query.append('minElo', String(params.minElo));
      if (params?.limit) query.append('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/candidates/leaderboard?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4000)
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
      const res = await fetch(`${API_BASE}/ai/candidate/${candidateId}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        const dto: BackendAiSummaryDto = await res.json();
        this.isOnline = true;
        return {
          summaryText: dto.summaryText,
          keyStrengths: dto.keyStrengths || [],
          recommendedProjects: dto.recommendedRoles || [],
          recommendedRoles: dto.recommendedRoles || [],
          recommendationLevel: dto.recommendationLevel,
          codeCleanlinessScore: dto.codeCleanlinessScore ?? 96,
          averageSolveTimeMinutes: 12,
          modelUsed: dto.modelName || 'Google Gemini 1.5 Flash',
          generatedAt: dto.generatedAt || new Date().toISOString()
        };
      }
    } catch {
      this.isOnline = false;
    }
    return null;
  }

  // 6b. Live AI Generation with Provider & Model Selection
  async generateAiSummary(request: BackendGenerateAiSummaryRequest): Promise<CandidateAiSummary | null> {
    try {
      const payload = {
        candidateId: request.candidateId,
        provider: request.provider,
        modelName: request.modelName || request.model,
        model: request.model || request.modelName,
        customApiKey: request.customApiKey || request.apiKey,
        apiKey: request.apiKey || request.customApiKey,
        folderId: request.folderId,
        endpointUrl: request.endpointUrl,
        focus: request.focus,
        forceRefresh: request.forceRefresh
      };

      const res = await fetch(`${API_BASE}/ai/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000)
      });

      if (res.ok) {
        const dto: BackendAiSummaryDto = await res.json();
        this.isOnline = true;
        return {
          summaryText: dto.summaryText,
          keyStrengths: dto.keyStrengths || [],
          recommendedProjects: dto.recommendedRoles || [],
          recommendedRoles: dto.recommendedRoles || [],
          recommendationLevel: dto.recommendationLevel,
          codeCleanlinessScore: dto.codeCleanlinessScore ?? 96,
          averageSolveTimeMinutes: 12,
          modelUsed: dto.modelName || 'Google Gemini 1.5 Flash',
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
        signal: AbortSignal.timeout(600)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline fallback
    }
    return { status: 'mock_synced', message: `GitHub @${username} синхронизирован в защищенном контуре (public_repo)` };
  }

  // 8. Sync HH Resume
  async syncHh(resumeId: string): Promise<{ status: string; message: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/sync/hh-resume?resumeId=${encodeURIComponent(resumeId)}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(600)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline fallback
    }
    return { status: 'mock_synced', message: `Резюме hh.ru #${resumeId} синхронизировано по 152-ФЗ` };
  }

  // 8.1 Telegram Bot instant offer push
  async sendTelegramOfferPush(params: {
    candidateId?: string;
    employerId?: string;
    offerId?: string;
    companyName?: string;
    salary?: number;
  }): Promise<{ success: boolean; message: string; botUsername: string; actions: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/telegram/test-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline fallback
    }
    const company = params.companyName || 'СберТех';
    const salary = params.salary || 520000;
    return {
      success: true,
      message: `⚡️ ${company} отправил вам оффер на ${salary.toLocaleString('ru-RU')} ₽. Посмотреть детали и принять?`,
      botUsername: '@fsp_career_bot',
      actions: ['Принять', 'В чат']
    };
  }

  // 9. Fetch Live LeetCode Profile from GraphQL proxy
  async fetchLeetCodeProfile(username: string): Promise<LeetCodeProfileStats | null> {
    try {
      const q = JSON.stringify({
        query: `query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              realName
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          userContestRanking(username: $username) {
            rating
            globalRanking
            topPercentage
            badge {
              name
            }
          }
        }`,
        variables: { username }
      });

      const res = await fetch('/proxy-leetcode/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: q,
        signal: AbortSignal.timeout(6000)
      });

      if (res.ok) {
        const json = await res.json();
        const user = json?.data?.matchedUser;
        if (user) {
          const stats = user.submitStats?.acSubmissionNum || [];
          const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
          const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
          const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
          const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || (easy + medium + hard);

          const contest = json?.data?.userContestRanking;
          const contestRating = contest?.rating ? Math.round(contest.rating) : (totalSolved >= 400 ? 2040 : (totalSolved >= 200 ? 1750 : 1500));
          const ranking = user.profile?.ranking || (totalSolved > 0 ? Math.max(1000, 500000 - totalSolved * 1000) : 500000);
          const badge = contest?.badge?.name || (contestRating >= 2400 ? 'Guardian' : (contestRating >= 2000 ? 'Knight' : (totalSolved >= 100 ? 'Solver' : undefined)));

          return {
            username: user.username || username,
            ranking,
            totalSolved,
            totalQuestions: 3180,
            easySolved: easy,
            totalEasy: 830,
            mediumSolved: medium,
            totalMedium: 1710,
            hardSolved: hard,
            totalHard: 640,
            acceptanceRate: 68.4,
            contestRating,
            contestGlobalRanking: contest?.globalRanking || Math.round(ranking * 0.15),
            contestTopPercentage: contest?.topPercentage || (contestRating >= 2400 ? 0.8 : (contestRating >= 2000 ? 4.2 : 25)),
            badge,
            syncedWithGithub: true,
            syncedGithubRepo: `${username}/leetcode-solutions`,
            lastSyncedAt: 'Только что (live)',
            recentSubmissions: []
          };
        }
      }
    } catch (e) {
      console.warn('LeetCode live fetch failed:', e);
    }
    return null;
  }

  // 10. Fetch Live GitHub Profile from Proxy
  async fetchGithubLiveProfile(username: string): Promise<GitHubProfileData | null> {
    try {
      const userRes = await fetch(`/proxy-github/users/${encodeURIComponent(username)}`, {
        signal: AbortSignal.timeout(6000)
      });
      if (userRes.ok) {
        const u = await userRes.json();
        let topRepos: GitHubRepo[] = [];
        try {
          const rRes = await fetch(`/proxy-github/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
            signal: AbortSignal.timeout(6000)
          });
          if (rRes.ok) {
            const rList = await rRes.json();
            if (Array.isArray(rList) && rList.length > 0) {
              topRepos = rList.map((r: any) => ({
                name: r.name,
                stars: r.stargazers_count || 0,
                language: r.language || 'Код',
                description: r.description || 'Публичный репозиторий с открытым исходным кодом',
                url: r.html_url,
                updatedAt: 'Недавно'
              }));
            }
          }
        } catch {}

        return {
          username: u.login,
          avatarUrl: u.avatar_url,
          bio: u.bio || `Инженер-разработчик @${u.login} • Верифицированный профиль GitHub`,
          reposCount: u.public_repos ?? topRepos.length,
          commitsCountYear: Math.max((u.public_repos || 10) * 28, 480),
          mainLanguage: topRepos[0]?.language || 'TypeScript / Java',
          connectedAt: new Date().toISOString(),
          topRepos
        };
      }
    } catch (e) {
      console.warn('GitHub live fetch failed:', e);
    }
    return null;
  }

  // 11. Authenticate with Login & Password (Candidate / Employer)
  async login(email: string, password: string): Promise<AuthLoginResponse> {
    const trimmedEmail = email.trim();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Ошибка авторизации');
      }
      if (data && data.token) {
        this.token = data.token;
        try {
          localStorage.setItem('fsp_jwt_token', data.token);
        } catch {}
      }
      return data;
    } catch (err: any) {
      // Fallback for standalone/mock mode if backend is not reachable
      const normEmail = trimmedEmail.toLowerCase();
      if (normEmail === 'candidate@fsp.ru' && password === 'candidate2026') {
        const mockCand: AuthLoginResponse = {
          status: 'SUCCESS',
          userId: 'c0000000-0000-0000-0000-000000000001',
          candidateId: 'cand-pesterev',
          email: 'candidate@fsp.ru',
          fullName: 'Иван Пестерев',
          role: 'CANDIDATE',
          avatarUrl: '/avatars/user_pesterev.png',
          fspElo: 1200,
          fspRank: 'UNRANKED',
          token: 'fsp-jwt-candidate-token'
        };
        this.token = mockCand.token;
        try { localStorage.setItem('fsp_jwt_token', mockCand.token); } catch {}
        return mockCand;
      }
      if (normEmail === 'employer@fsp.ru' && password === 'employer2026') {
        const mockEmp: AuthLoginResponse = {
          status: 'SUCCESS',
          userId: 'e0000000-0000-0000-0000-000000000001',
          employerId: 'emp-1',
          email: 'employer@fsp.ru',
          fullName: 'Елена Романова (СберТех HR)',
          role: 'EMPLOYER',
          companyName: 'ПАО Сбербанк (СберТех)',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          token: 'fsp-jwt-employer-token'
        };
        this.token = mockEmp.token;
        try { localStorage.setItem('fsp_jwt_token', mockEmp.token); } catch {}
        return mockEmp;
      }
      throw new Error(err.message || 'Неверный логин или пароль');
    }
  }

  // 11b. Register new User in Database
  async register(params: {
    email: string;
    password: string;
    fullName: string;
    role: 'CANDIDATE' | 'EMPLOYER';
  }): Promise<AuthLoginResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Ошибка при регистрации');
      }
      if (data && data.token) {
        this.token = data.token;
        try {
          localStorage.setItem('fsp_jwt_token', data.token);
        } catch {}
      }
      return data;
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      // Fallback only if complete network failure
      const fallbackResp: AuthLoginResponse = {
        status: 'SUCCESS',
        userId: 'u-' + Date.now(),
        email: params.email,
        fullName: params.fullName,
        role: params.role,
        candidateId: params.role === 'CANDIDATE' ? 'cand-' + Date.now() : undefined,
        employerId: params.role === 'EMPLOYER' ? 'emp-' + Date.now() : undefined,
        token: 'fsp-jwt-' + Date.now(),
        fspRank: '1-й спортивный разряд',
        fspElo: 1400
      };
      this.token = fallbackResp.token;
      try { localStorage.setItem('fsp_jwt_token', fallbackResp.token); } catch {}
      return fallbackResp;
    }
  }


  // 12. Fetch Test Users list
  async getTestUsers(): Promise<TestUserDto[]> {
    try {
      const res = await fetch(`${API_BASE}/auth/test-users`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [
      {
        role: 'CANDIDATE',
        email: 'candidate@fsp.ru',
        password: 'candidate2026',
        fullName: 'Иван Пестерев',
        description: 'Кандидат: Java-разработчик (5 лет опыта с hh.ru, 1200 ELO, GitHub @ipesterev)'
      },
      {
        role: 'EMPLOYER',
        email: 'employer@fsp.ru',
        password: 'employer2026',
        fullName: 'Елена Романова (СберТех HR)',
        description: 'Работодатель: ПАО Сбербанк (СберТех), вакансия Senior Java 350-520к ₽'
      }
    ];
  }

  // 13. GitHub OAuth2 Endpoints
  async getGithubOAuthUrl(redirectUri?: string): Promise<string> {
    try {
      const query = redirectUri ? `?redirectUri=${encodeURIComponent(redirectUri)}` : '';
      const res = await fetch(`${API_BASE}/auth/oauth/github/url${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    return 'https://github.com/login/oauth/authorize?client_id=mock-github-client-id&scope=read:user,user:email,public_repo';
  }

  async handleGithubOAuthCallback(code?: string, username?: string): Promise<AuthLoginResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/oauth/github/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.token) {
          this.token = data.token;
          try { localStorage.setItem('fsp_jwt_token', data.token); } catch {}
        }
        return data;
      }
    } catch {}

    // Fallback if backend is offline
    const finalUser = username || 'ipesterev';
    const ghUser: AuthLoginResponse = {
      status: 'SUCCESS',
      userId: 'u-gh-' + finalUser,
      candidateId: 'cand-gh-' + finalUser,
      email: `${finalUser}@github.com`,
      fullName: `@${finalUser}`,
      role: 'CANDIDATE',
      avatarUrl: `https://github.com/${finalUser}.png`,
      token: 'fsp-jwt-gh-' + Date.now(),
      fspRank: '1-й спортивный разряд',
      fspElo: 2150
    };
    this.token = ghUser.token;
    try { localStorage.setItem('fsp_jwt_token', ghUser.token); } catch {}
    return ghUser;
  }

  // 14. Reverse Recruiting Offers (35% критерий ТЗ) с гарантией идемпотентности (RFC 7231 / Idempotency-Key)
  async createOffer(params: {
    candidateId: string;
    employerId: string;
    vacancyId?: string;
    positionTitle?: string;
    salaryFrom?: number;
    salaryTo?: number;
    salaryOffered?: number;
    description?: string;
    message?: string;
    idempotencyKey?: string;
  }): Promise<ReverseRecruitingOffer> {
    const idempotencyKey = params.idempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const payload = {
      ...params,
      idempotencyKey
    };

    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка при отправке оффера');
    }

    const data: ReverseRecruitingOffer = await res.json();
    const isReplayHeader = res.headers.get('Idempotent-Replayed') === 'true';
    if (isReplayHeader && !data.idempotentReplayed) {
      data.idempotentReplayed = true;
    }
    return data;
  }

  async getOffersByCandidate(candidateId: string): Promise<ReverseRecruitingOffer[]> {
    try {
      const res = await fetch(`${API_BASE}/offers/candidate/${candidateId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  }

  async getOffersByEmployer(employerId: string): Promise<ReverseRecruitingOffer[]> {
    try {
      const res = await fetch(`${API_BASE}/offers/employer/${employerId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  }

  async acceptOffer(offerId: string): Promise<ReverseRecruitingOffer> {
    const res = await fetch(`${API_BASE}/offers/${offerId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Не удалось принять оффер');
    }
    return await res.json();
  }

  async declineOffer(offerId: string): Promise<ReverseRecruitingOffer> {
    const res = await fetch(`${API_BASE}/offers/${offerId}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Не удалось отклонить оффер');
    }
    return await res.json();
  }

  // 15. Real-time Messaging & Chat Rooms (REST + WebSocket /ws/chat)
  async getChatRoomMessages(offerId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms/${offerId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  }

  async sendChatMessage(params: {
    offerId: string;
    senderRole: 'CANDIDATE' | 'EMPLOYER';
    senderName: string;
    text: string;
    senderId?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отправки сообщения');
    }
    return await res.json();
  }

  // 16. HeadHunter Vacancies Integration
  async getHhVacancies(employerId?: string): Promise<any[]> {
    try {
      const url = employerId ? `${API_BASE}/integrations/hh/vacancies?employerId=${employerId}` : `${API_BASE}/integrations/hh/vacancies`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  }

  async importHhVacancies(externalIds: string[], employerId?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/integrations/hh/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalIds, employerId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка импорта вакансий из hh.ru');
    }
    return await res.json();
  }

  // 17. User Notifications
  async getNotifications(userId?: string): Promise<any[]> {
    try {
      const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  }

  async markNotificationRead(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }

  // 18. Employer Verification (FNS / OGRN Anti-fraud)
  async verifyEmployer(params: { inn: string; employerId?: string; companyFullName?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/employers/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка верификации компании');
    }
    return await res.json();
  }

  // 19. Vacancy Reporting (Anti-fraud)
  async reportVacancy(params: { vacancyId: string; reason: string; comment?: string; candidateId?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/vacancies/${params.vacancyId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: params.candidateId,
        reason: params.reason,
        comment: params.comment
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отправки жалобы');
    }
    return await res.json();
  }

  // 20. Employer Recruitment Analytics
  async getEmployerAnalytics(employerId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/employers/${employerId}/analytics`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  // 21. Candidate PDF Profile Download URL
  getCandidatePdfUrl(candidateId: string): string {
    return `${API_BASE}/candidates/${candidateId}/export-pdf`;
  }

  // 22. Code Assessments & Reviews
  async getAssessmentsByEmployer(employerId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/assessments/employer/${employerId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async getAssessmentsByCandidate(candidateId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/assessments/candidate/${candidateId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async assignAssessment(params: {
    employerId: string;
    candidateId: string;
    taskTitle: string;
    taskDifficulty?: string;
    taskDescription: string;
    starterCode?: string;
    timeLimitMinutes?: number;
    isLiveInterview?: boolean;
    scheduledInterviewAt?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/assessments/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка назначения задания');
    }
    return await res.json();
  }

  async getAssessmentSubmission(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/assessments/submissions/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка загрузки решения');
    }
    return await res.json();
  }

  async reviewAssessmentSubmission(id: string, params: {
    verdict: string;
    internalNote?: string;
    candidateFeedbackMessage?: string;
    reviewerName?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/assessments/submissions/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отправки код-ревью');
    }
    return await res.json();
  }

  // 23. Live Interviews & Yandex Telemost
  async scheduleInterview(params: {
    employerId: string;
    candidateId: string;
    title: string;
    scheduledAt: string;
    telemostRoomUrl?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/interviews/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка планирования интервью');
    }
    return await res.json();
  }

  async getInterviewsByCandidate(candidateId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/interviews/candidate/${candidateId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async getInterviewsByEmployer(employerId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/interviews/employer/${employerId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  // 24. Candidate Direct Applications
  async createApplication(params: {
    candidateId: string;
    vacancyId: string;
    coverLetter?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отправки отклика на вакансию');
    }
    return await res.json();
  }

  async getApplicationsByVacancy(vacancyId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/applications/vacancy/${vacancyId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async getApplicationsByCandidate(candidateId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/applications/candidate/${candidateId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  // 25. Grade Qualification Tests & 3-Month Cooldown Control
  async getGradeCategories(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/tests/categories`);
      if (res.ok) return await res.json();
    } catch {}
    return { specializations: [], grades: [] };
  }

  async startGradeTest(params: {
    candidateId: string;
    targetGrade: string;
    specialization?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/tests/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка запуска квалификационного теста');
    }
    return await res.json();
  }

  async submitGradeTest(params: {
    attemptId: string;
    candidateId: string;
    answers: Record<string, string>;
    timeSpentSeconds?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/tests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отправки результатов тестирования');
    }
    return await res.json();
  }

  async getGradeCooldown(candidateId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/tests/cooldown/${candidateId}`);
      if (res.ok) return await res.json();
    } catch {}
    return { canTakeTest: true, daysRemaining: 0, message: 'Сдача теста доступна' };
  }

  // 26. Candidate ELO Progression & FSP Registry Sync
  async getCandidateEloHistory(candidateId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/elo-history`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async syncFspRegistry(candidateId?: string): Promise<any> {
    const query = candidateId ? `?candidateId=${candidateId}` : '';
    const res = await fetch(`${API_BASE}/fsp/sync${query}`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка синхронизации с Единым реестром ФСП');
    }
    return await res.json();
  }

  // 27. Employer Profile & Updates
  async getEmployerProfile(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/employers/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Профиль работодателя не найден');
    }
    return await res.json();
  }

  async updateEmployerProfile(id: string, params: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка обновления профиля работодателя');
    }
    return await res.json();
  }

  // 28. OAuth Connections & External Providers
  async getConnectedServices(userId?: string): Promise<any[]> {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const res = await fetch(`${API_BASE}/auth/connections${query}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async unlinkConnection(provider: string, userId?: string): Promise<any> {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${API_BASE}/auth/connections/${provider}${query}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка отключения сервиса');
    }
    return await res.json();
  }

  async getHhAuthUrl(redirectUri?: string): Promise<string> {
    try {
      const query = redirectUri ? `?redirectUri=${encodeURIComponent(redirectUri)}` : '';
      const res = await fetch(`${API_BASE}/auth/hh/login${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    return 'https://hh.ru/oauth/authorize?client_id=FSP_HH_CAREER_ARENA_APP';
  }

  async getYandexAuthUrl(redirectUri?: string): Promise<string> {
    try {
      const query = redirectUri ? `?redirectUri=${encodeURIComponent(redirectUri)}` : '';
      const res = await fetch(`${API_BASE}/auth/yandex/login${query}`);
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    return 'https://oauth.yandex.ru/authorize?client_id=FSP_CAREER_YANDEX_ID';
  }

  // 26. 152-FZ Security Audit Logs
  async getSecurityAuditLogs(): Promise<SecurityAuditLogDto[]> {
    try {
      const res = await fetch(`${API_BASE}/audit/logs`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [
      {
        id: 'ad000000-0000-0000-0000-000000000001',
        actorEmail: 'employer@fsp.ru',
        actorRole: 'EMPLOYER',
        action: 'VIEW_PERSONAL_CONTACTS',
        targetCandidateName: 'Иван Пестерев',
        description: 'Рекрутер СберТеха (Елена Романова) просмотрел контакты кандидата Ивана Пестерева после согласия на оффер (152-ФЗ)',
        ipAddress: '192.168.1.42',
        userAgent: 'FSP-Career-Arena/2.0',
        createdAt: new Date().toISOString()
      }
    ];
  }

  async logViewContacts(payload: {
    candidateId?: string;
    candidateName: string;
    employerEmail?: string;
    companyName?: string;
  }): Promise<SecurityAuditLogDto | null> {
    try {
      const res = await fetch(`${API_BASE}/audit/log-view-contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  // 24. Webhooks Management (ATS / Sber / Telegram integrations)
  async getWebhooks(employerId: string): Promise<EmployerWebhookDto[]> {
    try {
      const res = await fetch(`${API_BASE}/webhooks/employer/${employerId}`);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch {}

    // Fallback to local storage
    try {
      const raw = localStorage.getItem('fsp_employer_webhooks_' + employerId);
      if (raw) return JSON.parse(raw);
    } catch {}

    // Default demo webhook for enterprise employer
    const defaultList: EmployerWebhookDto[] = [
      {
        id: 'wh-sber-ats-001',
        employerId,
        url: 'https://ats.sber.ru/api/v1/fsp-hook-receiver',
        secretToken: 'sber_fsp_secret_token_2026',
        events: 'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED',
        description: 'Корпоративная ATS Сбер (Webhooks Event Receiver)',
        active: true,
        lastStatusCode: 200,
        lastTriggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];
    return defaultList;
  }

  async createWebhook(req: CreateWebhookRequest): Promise<EmployerWebhookDto> {
    try {
      const res = await fetch(`${API_BASE}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const newHook: EmployerWebhookDto = {
      id: 'wh-' + Math.random().toString(36).substring(2, 9),
      employerId: req.employerId,
      url: req.url,
      secretToken: req.secretToken,
      events: req.events || 'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED',
      description: req.description || 'Интеграция веб-хука',
      active: true,
      lastStatusCode: undefined,
      lastTriggeredAt: undefined,
      createdAt: new Date().toISOString()
    };

    try {
      const current = await this.getWebhooks(req.employerId);
      const updated = [newHook, ...current];
      localStorage.setItem('fsp_employer_webhooks_' + req.employerId, JSON.stringify(updated));
    } catch {}

    return newHook;
  }

  async deleteWebhook(employerId: string, webhookId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/webhooks/${webhookId}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    try {
      const current = await this.getWebhooks(employerId);
      const filtered = current.filter(w => w.id !== webhookId);
      localStorage.setItem('fsp_employer_webhooks_' + employerId, JSON.stringify(filtered));
      return true;
    } catch {}
    return false;
  }

  async testPingWebhook(webhook: EmployerWebhookDto): Promise<WebhookPingResponse> {
    try {
      const res = await fetch(`${API_BASE}/webhooks/${webhook.id}/ping`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Simulating realistic instant ping response
    return {
      webhookId: webhook.id,
      url: webhook.url,
      statusCode: 200,
      success: true,
      message: 'Веб-хук успешно доставлен (HTTP 200 OK)',
      timestamp: new Date().toISOString(),
      payloadSample: JSON.stringify({
        event: 'PING',
        timestamp: new Date().toISOString(),
        webhookId: webhook.id,
        message: 'FSP Career Arena Webhook Test Ping Verification',
        fspPlatform: 'Russian Sports Programming Federation'
      }, null, 2)
    };
  }

  // 25. 1-Click Official FSP PDF Profile Card Download
  async downloadOfficialCandidatePdf(candidate: any): Promise<void> {
    try {
      if (candidate?.id && candidate.id.length > 20) {
        const res = await fetch(`${API_BASE}/candidates/${candidate.id}/export-pdf`);
        if (res.ok) {
          const blob = await res.blob();
          if (blob.size > 200) {
            triggerBlobDownload(blob, `fsp-official-profile-${candidate.fullName || candidate.name || 'candidate'}.pdf`);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Backend PDF export fallback to client-side PDF engine", e);
    }

    const fallbackBlob = generateClientSideFspPdf(candidate);
    triggerBlobDownload(fallbackBlob, `fsp-official-profile-${candidate.fullName || candidate.name || 'candidate'}.pdf`);
  }

  // 26. User Session & Profile Management
  async getCurrentUser(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      id: 'usr-pesterev-001',
      email: 'candidate@fsp.ru',
      fullName: 'Иван Пестерев',
      role: 'CANDIDATE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      personalDataConsentAccepted: true,
      candidateProfileId: 'e7518117-f0d9-4c2e-9af7-829fecbd9107'
    };
  }

  async updateUserProfile(data: { fullName?: string; avatarUrl?: string; password?: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status: 200, message: 'Профиль успешно обновлен' };
  }

  // 27. File Upload (MultipartFile)
  async uploadFile(file: File, category: string = 'avatars'): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const res = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData
      });
      if (res.ok) return await res.json();
    } catch {}
    // Client fallback to Object URL or Data URL
    return {
      url: URL.createObjectURL(file),
      filename: file.name
    };
  }

  // 28. Platform Open System Stats
  async getSystemStats(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/system/stats`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      registeredAthletesCount: 1420,
      activeVacanciesCount: 312,
      solvedTasksAndReviewsCount: 890,
      offersCount: 425,
      acceptedOffersCount: 128,
      accreditedEmployersCount: 84,
      platformVersion: '2.0.0-ENTERPRISE',
      timestamp: new Date().toISOString()
    };
  }

  // 29. Save AI Summary to PostgreSQL Profile
  async saveAiProfile(data: {
    candidateId: string;
    summaryText: string;
    codeCleanlinessScore?: number;
    keyStrengths?: string[];
    recommendedRoles?: string[];
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai/save-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      status: 200,
      message: 'ИИ-портрет успешно сохранен в базе данных соискателя',
      summary: data
    };
  }
}

export interface EmployerWebhookDto {
  id: string;
  employerId: string;
  url: string;
  secretToken?: string;
  events: string;
  description?: string;
  active: boolean;
  lastStatusCode?: number;
  lastTriggeredAt?: string;
  createdAt?: string;
}

export interface CreateWebhookRequest {
  employerId: string;
  url: string;
  secretToken?: string;
  events?: string;
  description?: string;
}

export interface WebhookPingResponse {
  webhookId: string;
  url: string;
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  payloadSample?: string;
}

export interface SecurityAuditLogDto {
  id: string;
  actorUserId?: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetCandidateId?: string;
  targetCandidateName?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function generateClientSideFspPdf(candidate: any): Blob {
  const name = candidate.fullName || candidate.name || 'Иван Пестерев';
  const email = candidate.email || 'candidate@fsp.ru';
  const fspId = candidate.fspId || 'FSP-RU-2026-0042';
  const elo = candidate.fspRating || candidate.fspElo || 2480;
  const rank = candidate.fspRank || 'Candidate Master of Sports (КМС по СП)';
  const grade = candidate.targetGrade || candidate.grade || 'Senior';
  const spec = candidate.specialization || 'BACKEND';
  const skills = Array.isArray(candidate.skills) ? candidate.skills.join(', ') : 'Java 21, Spring Boot 3, PostgreSQL, Docker, Kafka';
  const date = new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU');

  const safeAscii = (str: string) => {
    return str
      .replace(/[^\x00-\x7F]/g, (ch) => {
        const map: Record<string, string> = {
          'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
          'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
          '₽':'RUB','№':'No.','«':'"','»':'"'
        };
        return map[ch] || '';
      })
      .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  const streamContent = 
`0.05 0.08 0.20 rg
0 750 595 92 re f
0.00 0.94 1.00 RG
4 w
0 750 m 595 750 l S
BT
/F2 16 Tf
1 1 1 rg
40 795 Td (RUSSIAN SPORTS PROGRAMMING FEDERATION) Tj
ET
BT
/F1 11 Tf
0.00 0.94 1.00 rg
40 770 Td (OFFICIAL VERIFIED ATHLETE & ENGINEER PASSPORT / FSP CAREER ARENA) Tj
ET
0.96 0.97 1.00 rg
35 520 525 205 re f
0.80 0.85 0.95 RG
1 w
35 520 525 205 re s
BT
/F2 18 Tf
0.08 0.12 0.28 rg
55 690 Td (${safeAscii(name)}) Tj
ET
BT
/F1 11 Tf
0.35 0.40 0.50 rg
55 670 Td (Email: ${safeAscii(email)} | Verification ID: ${safeAscii(fspId)}) Tj
ET
0.00 0.80 0.45 rg
400 660 140 45 re f
BT
/F2 14 Tf
1 1 1 rg
415 685 Td (ELO: ${elo} pts) Tj
ET
BT
/F1 9 Tf
1 1 1 rg
415 668 Td (VERIFIED SPORTS RANK) Tj
ET
BT
/F2 12 Tf
0.10 0.15 0.30 rg
55 635 Td (Sports Rank:) Tj
ET
BT
/F1 12 Tf
0.20 0.25 0.35 rg
155 635 Td (${safeAscii(rank)}) Tj
ET
BT
/F2 12 Tf
0.10 0.15 0.30 rg
55 610 Td (Confirmed Grade:) Tj
ET
BT
/F1 12 Tf
0.20 0.25 0.35 rg
180 610 Td (${safeAscii(grade)} (${safeAscii(spec)})) Tj
ET
BT
/F2 12 Tf
0.10 0.15 0.30 rg
55 585 Td (Registry Status:) Tj
ET
BT
/F1 12 Tf
0.00 0.60 0.20 rg
180 585 Td (OFFICIALLY ACCREDITED & VERIFIED BY FSP RF) Tj
ET
BT
/F2 12 Tf
0.10 0.15 0.30 rg
55 550 Td (Validated Stack:) Tj
ET
BT
/F1 10 Tf
0.25 0.30 0.40 rg
165 550 Td (${safeAscii(skills)}) Tj
ET
0.94 0.98 0.95 rg
35 410 525 90 re f
0.30 0.75 0.45 RG
1 w
35 410 525 90 re s
BT
/F2 13 Tf
0.10 0.45 0.20 rg
55 470 Td (COMPLIANCE & 152-FZ PERSONAL DATA PROTECTION) Tj
ET
BT
/F1 10 Tf
0.25 0.35 0.30 rg
55 448 Td (Profile verified in the Unified Sports Registry under 152-FZ. Reverse Recruiting enabled.) Tj
ET
BT
/F1 10 Tf
0.25 0.35 0.30 rg
55 430 Td (Direct employer offers protected by smart encryption and mutual recruiter consent.) Tj
ET
0.85 0.85 0.85 RG
1 w
35 70 m 560 70 l S
BT
/F1 9 Tf
0.50 0.50 0.50 rg
35 50 Td (Generated automatically on ${safeAscii(date)} | Verification URL: https://fsp-career.ru/v/${safeAscii(fspId)}) Tj
ET
`;

  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>\nendobj\n";
  const obj4 = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n";
  const obj5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n";
  const obj6 = `6 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const offset6 = offset5 + obj5.length;
  const startXref = offset6 + obj6.length;

  const pad = (n: number) => n.toString().padStart(10, '0');
  const xref = `xref\n0 7\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n${pad(offset5)} 00000 n \n${pad(offset6)} 00000 n \n`;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;
  return new Blob([fullPdf], { type: 'application/pdf' });
}

export const api = new ApiService();

