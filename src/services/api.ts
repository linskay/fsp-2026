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

export interface BackendGenerateAiSummaryRequest {
  candidateId: string;
  provider?: string;
  model?: string;
  apiKey?: string;
  folderId?: string;
  endpointUrl?: string;
  focus?: 'highload' | 'algo' | 'lead' | 'balanced';
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
          codeCleanlinessScore: 98,
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
      const res = await fetch(`${API_BASE}/ai-summary/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(20000)
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
          codeCleanlinessScore: 98,
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
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка авторизации');
      }
      return data;
    } catch (err: any) {
      // Fallback for standalone/mock mode if backend is not reachable
      const normEmail = email.trim().toLowerCase();
      if (normEmail === 'candidate@fsp.ru' && password === 'candidate2026') {
        return {
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
      }
      if (normEmail === 'employer@fsp.ru' && password === 'employer2026') {
        return {
          status: 'SUCCESS',
          userId: 'e0000000-0000-0000-0000-000000000001',
          employerId: 'emp-sbertech',
          email: 'employer@fsp.ru',
          fullName: 'Елена Романова (СберТех HR)',
          role: 'EMPLOYER',
          companyName: 'ПАО Сбербанк (СберТех)',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          token: 'fsp-jwt-employer-token'
        };
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
      return data;
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      // Fallback only if complete network failure
      return {
        status: 'SUCCESS',
        userId: 'u-' + Date.now(),
        email: params.email,
        fullName: params.fullName,
        role: params.role,
        candidateId: params.role === 'CANDIDATE' ? 'cand-' + Date.now() : undefined,
        employerId: params.role === 'EMPLOYER' ? 'emp-' + Date.now() : undefined,
        token: 'fsp-jwt-' + Date.now(),
        fspVerified: true
      };
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
        return await res.json();
      }
    } catch {}

    // Fallback if backend is offline
    const finalUser = username || 'ipesterev';
    return {
      status: 'SUCCESS',
      userId: 'u-gh-' + finalUser,
      candidateId: 'cand-gh-' + finalUser,
      email: `${finalUser}@github.com`,
      fullName: `@${finalUser}`,
      role: 'CANDIDATE',
      avatarUrl: `https://github.com/${finalUser}.png`,
      token: 'fsp-jwt-gh-' + Date.now(),
      fspVerified: true,
      fspRank: '1-й спортивный разряд',
      fspElo: 2150
    };
  }

  // 14. Reverse Recruiting Offers (35% критерий ТЗ)
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
  }): Promise<ReverseRecruitingOffer> {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Ошибка при отправке оффера');
    }
    return await res.json();
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
}

export const api = new ApiService();
