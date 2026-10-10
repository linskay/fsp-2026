export type UserRole = 'landing' | 'candidate' | 'employer' | 'arena' | 'not_found';

export type FspRank =
  | 'Мастер спорта РФ'
  | 'Кандидат в мастера спорта (КМС)'
  | '1-й спортивный разряд'
  | '2-й спортивный разряд'
  | '3-й спортивный разряд'
  | 'Начинающий спортсмен (Junior)'
  | 'Победитель Чемпионата РФ'
  | 'Призер Кубка ФСП'
  | 'Участник Высшей Лиги ФСП'
  | 'Кандидат в Сборную ФСП';

export type Specialization =
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'devops'
  | 'mobile'
  | 'ai_ml'
  | 'highload';

export type Grade = 'junior' | 'middle' | 'senior' | 'lead';

export interface FspAchievement {
  id: string;
  title: string;
  year: number;
  badge: string;
  description: string;
  event: string;
}

export interface EloHistoryPoint {
  date: string;
  elo: number;
  event: string;
  change: number;
}

export interface CandidateAiSummary {
  summaryText: string;
  keyStrengths: string[];
  recommendedProjects: string[];
  recommendedRoles?: string[];
  recommendationLevel?: string;
  codeCleanlinessScore: number;
  averageSolveTimeMinutes: number;
  modelUsed: string;
  generatedAt: string;
}

export interface LeetCodeSubmissionItem {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp: string;
  language: string;
  runtimeBeatsPercent: number;
  memoryBeatsPercent: number;
  status: 'Accepted' | 'Time Limit Exceeded' | 'Wrong Answer';
}

export interface LeetCodeProfileStats {
  username: string;
  ranking: number;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  contestRating?: number;
  contestGlobalRanking?: number;
  contestTopPercentage?: number;
  badge?: string;
  syncedWithGithub: boolean;
  syncedGithubRepo?: string;
  recentSubmissions: LeetCodeSubmissionItem[];
  lastSyncedAt: string;
}

export interface CandidateProfile {
  id: string;
  email: string;
  fullName: string;
  city: string;
  avatarUrl?: string;
  title: string;
  specialization: Specialization;
  targetGrade: Grade;
  currentGradeAssigned: Grade;
  
  // ФСП Верификация
  fspId: string;
  fspRank: FspRank;
  fspRating: number; // ELO rating (e.g. 2740)
  fspBadges: string[];
  isVerified: boolean;
  verifiedAt: string;
  keycloakSub: string;
  achievements: FspAchievement[];
  eloHistory?: EloHistoryPoint[];

  // Навыки и опыт
  skills: string[];
  experienceYears: number;
  about: string;
  githubUrl?: string;
  fspProfileUrl?: string;
  aiSummary?: CandidateAiSummary;
  leetcodeStats?: LeetCodeProfileStats;

  // Алгоритмическое тестирование
  solvedTasksCount: number;
  totalTasksAttempted: number;
  testScorePercent: number;
  avgExecutionTimeMs: number;
  memoryEfficiencyScore: number;
  lastTestingDate: string;
  canRetakeAfterDate: string; // 3 months cooldown rule

  // 152-ФЗ: Маскированные контакты
  phoneMasked: string;
  phoneReal: string;
  telegramMasked: string;
  telegramReal: string;

  // HeadHunter & GitHub расширенные интеграции
  hhConfirmedSkills?: HhConfirmedSkill[];
  githubSync?: GitHubSyncSettings;

  // Зарплатные ожидания
  salaryExpectationMin: number;
  salaryExpectationMax: number;
  isLookingForJob: boolean;
  preferredFormat: 'remote' | 'hybrid' | 'office' | 'any';
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  logo: string;
  verifiedCompany: boolean;
  industry: string;
  city: string;
  description: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
  website: string;
  fspPartnerLevel: 'Стратегический партнер' | 'Генеральный партнер' | 'Партнер хакатона';
}

export interface Vacancy {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  specialization: Specialization;
  gradeRequired: Grade;
  
  // Обязательная вилка в рублях "от-до"
  salaryMin: number;
  salaryMax: number;
  
  location: string;
  workFormat: 'удаленно' | 'гибрид' | 'офис';
  techStack: string[];
  description: string;
  perks: string[];
  fspBonusPreference: string;
  minFspRatingRequired?: number;
  createdAt: string;
  active: boolean;
  invitationsCount?: number;
}

export type InvitationStatus = 'sent' | 'viewed' | 'accepted' | 'declined';

export interface ChatMessage {
  id: string;
  sender: 'employer' | 'candidate';
  text: string;
  timestamp: string;
}

export interface Invitation {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  employerId: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  candidateName: string;
  
  // Оффер условия
  proposedSalary: number; // in RUB
  salaryMin: number;
  salaryMax: number;
  message: string;
  projectDetails: string;
  perksOffered: string[];
  
  status: InvitationStatus;
  sentAt: string;
  respondedAt?: string;
  declineReason?: string;
  
  // 152-ФЗ статус раскрытия контактов
  contactsRevealed: boolean;
  
  chatMessages: ChatMessage[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isHidden?: boolean;
}

export interface AlgorithmTask {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  specialization: Specialization;
  targetGrade: Grade;
  fspRatingWeight: number; // e.g. +80 ELO
  acceptanceRate?: string;
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    go: string;
  };
  openTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  timeLimitMs: number;
  memoryLimitMb: number;
  tags: string[];
  hints?: string[];
  solutionExplanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface SubmissionResult {
  id: string;
  taskId: string;
  taskTitle: string;
  language: string;
  code: string;
  passed: boolean;
  openTestsPassed: number;
  openTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  executionTimeMs: number;
  memoryMb: number;
  gradeCalculated: Grade;
  fspRatingEarned: number;
  logOutput: string;
  submittedAt: string;
}

export interface CandidateMatchScore {
  candidateId: string;
  overallScore: number; // 0-100
  fspRankScore: number;
  algoTestScore: number;
  stackMatchScore: number;
  experienceScore: number;
  matchedTech: string[];
  missingTech: string[];
  explainReason: string;
  highlights: string[];
}

export type OAuthProvider = 'github' | 'yandex' | 'hh';

export interface GitHubRepo {
  name: string;
  stars: number;
  language: string;
  description: string;
  url: string;
  updatedAt: string;
}

export interface GitHubProfileData {
  username: string;
  avatarUrl: string;
  bio: string;
  reposCount: number;
  commitsCountYear: number;
  mainLanguage: string;
  topRepos: GitHubRepo[];
  connectedAt: string;
}

export interface HhWorkHistoryItem {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface HhConfirmedSkill {
  id: string;
  skill: string;
  level: 'Базовый' | 'Продвинутый' | 'Экспертный' | 'Expert' | 'Advanced' | 'Intermediate';
  scorePercent: number; // 0-100%
  percentileRank: string; // e.g. "Топ-1% среди 48 000 соискателей"
  confirmedAt: string; // e.g. "14 января 2026 г."
  testTitle: string; // e.g. "Тестирование HeadHunter: Алгоритмы и структуры данных"
  certificateId: string; // e.g. "HH-CERT-2026-88421"
}

export interface HhResumeData {
  resumeId: string;
  title: string;
  experienceYears: number;
  desiredSalary: number;
  skills: string[];
  confirmedSkills?: HhConfirmedSkill[];
  workHistory: HhWorkHistoryItem[];
  about: string;
  education: string;
  connectedAt: string;
}

export interface GitHubSyncCommit {
  id: string;
  taskTitle: string;
  taskSlug?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  runtimeMs: number;
  runtimeBeatsPercent: number;
  memoryMb: number;
  memoryBeatsPercent: number;
  commitHash: string;
  commitMessage: string;
  repoFullName: string;
  timestamp: string;
  githubUrl: string;
}

export interface GitHubSyncSettings {
  autoPushEnabled: boolean;
  repoName: string;
  repoFullName: string;
  defaultBranch: string;
  isPublicOnly: boolean; // строго 152-ФЗ
  lastSyncedAt?: string;
  recentCommits: GitHubSyncCommit[];
}

export interface HhEmployerVacancy {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  city: string;
  specialization: Specialization;
  grade: Grade;
  skills: string[];
  description: string;
  imported: boolean;
}

export type AssessmentTaskSource = 'leetcode_preset' | 'custom_created';

export interface EmployerAssessmentTask {
  id: string;
  sourceType: AssessmentTaskSource;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints?: string[];
  starterCode?: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
    go?: string;
  };
  sampleTestCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export type AssessmentStatus = 'pending' | 'in_progress' | 'submitted' | 'reviewed';

export interface CandidateAssessmentSubmission {
  code: string;
  language: string;
  executionLogs?: string;
  passedCount?: number;
  totalCount?: number;
  spentTimeMinutes?: number;
  submittedAt: string;
}

export interface EmployerAssessmentReview {
  verdict: 'like' | 'dislike';
  internalNote: string; // Внутренний комментарий для компании (скрыт от соискателя по 152-ФЗ)
  candidateFeedbackMessage: string; // Сообщение соискателю
  reviewedAt: string;
  reviewerName: string;
}

export interface AssessmentAssignment {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo: string;
  vacancyId?: string;
  vacancyTitle?: string;
  candidateId: string;
  candidateName: string;
  
  task: EmployerAssessmentTask;
  status: AssessmentStatus;
  
  timeLimitMinutes: number;
  createdAt: string;
  deadlineAt?: string;
  
  // Яндекс Телемост интеграция
  isLiveInterview: boolean;
  telemostRoomUrl?: string;
  scheduledInterviewAt?: string;

  // Решение кандидата
  submission?: CandidateAssessmentSubmission;

  // Оценка и комментарии работодателя
  review?: EmployerAssessmentReview;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'INTERVIEW_SCHEDULED';

export interface ReverseRecruitingOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  vacancyId?: string;
  positionTitle: string;
  salaryFrom: number;
  salaryTo: number;
  salaryOffered: number;
  description: string;
  status: OfferStatus;
  contactsUnmasked: boolean;
  candidateContacts?: {
    email?: string;
    phone?: string;
    telegram?: string;
    github?: string;
    consentStatus?: string;
    notice?: string;
  };
  createdAt: string;
  updatedAt?: string;
}


