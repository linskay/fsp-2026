/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_EMPLOYERS, 
  INITIAL_INVITATIONS, 
  INITIAL_TASKS,
  INITIAL_VACANCIES,
  INITIAL_ASSESSMENTS
} from './data/mockData';
import { 
  AlgorithmTask, 
  CandidateProfile, 
  EmployerProfile, 
  Invitation, 
  SubmissionResult, 
  UserRole, 
  Vacancy,
  GitHubProfileData,
  HhResumeData,
  FspRank,
  AssessmentAssignment,
  EmployerAssessmentReview,
  CandidateAssessmentSubmission
} from './types';
import { 
  MOCK_GITHUB_PROFILE, 
  PESTEREV_GITHUB_PROFILE, 
  ALINA_GITHUB_PROFILE,
  MOCK_HH_RESUME, 
  PESTEREV_HH_RESUME, 
  ALINA_HH_RESUME,
  DARIA_HH_RESUME, 
  SOKOLOV_HH_RESUME 
} from './data/mockOAuthData';
import { Navbar } from './components/Navbar';
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { CodeArenaIDE } from './components/arena/CodeArenaIDE';
import { LandingPage } from './components/landing/LandingPage';
import { NotFoundPage } from './components/common/NotFoundPage';
import { OAuthModal } from './components/auth/OAuthModal';
import { LoginModal } from './components/auth/LoginModal';
import { AuthLoginResponse } from './services/api';
import { FspFooterPartners } from './components/brand/FspLogo';
import { calculateDynamicStats } from './utils/ratingEngine';
import { Sparkles, Trophy, Bell, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('landing');
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [employers, setEmployers] = useState<EmployerProfile[]>(INITIAL_EMPLOYERS);
  const [vacancies, setVacancies] = useState<Vacancy[]>(INITIAL_VACANCIES);
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);
  const [tasks, setTasks] = useState<AlgorithmTask[]>(INITIAL_TASKS);
  const [assessments, setAssessments] = useState<AssessmentAssignment[]>(INITIAL_ASSESSMENTS);

  // Authentication & Test Users State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    fullName: string;
    role: 'CANDIDATE' | 'EMPLOYER';
    avatarUrl?: string;
  } | null>({
    email: 'candidate@fsp.ru',
    fullName: 'Иван Пестерев',
    role: 'CANDIDATE',
    avatarUrl: '/avatars/user_pesterev.png'
  });

  // OAuth Integrations State
  const [githubData, setGithubData] = useState<GitHubProfileData | null>(PESTEREV_GITHUB_PROFILE);
  const [hhData, setHhData] = useState<HhResumeData | null>(PESTEREV_HH_RESUME);
  const [yandexConnected, setYandexConnected] = useState<boolean>(true);
  const [yandexEmail, setYandexEmail] = useState<string | null>('ivan.pesterev@yandex.ru');
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState<boolean>(false);

  // Active current user contexts
  const [activeCandidateId, setActiveCandidateId] = useState<string>('cand-pesterev');
  const currentCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];
  const currentEmployer = employers[0];

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'fsp' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'fsp' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 5000);
  };

  // Sync with Spring Boot 3 Backend on initialization
  useEffect(() => {
    async function loadBackendData() {
      try {
        const isHealthy = await api.checkHealth();
        if (isHealthy) {
          const [backendCandidates, backendVacancies] = await Promise.all([
            api.getCandidates(),
            api.getVacancies()
          ]);
          if (backendCandidates && backendCandidates.length > 0) {
            setCandidates(backendCandidates);
            setActiveCandidateId(backendCandidates[0].id);
          }
          if (backendVacancies && backendVacancies.length > 0) {
            setVacancies(backendVacancies);
          }
          showToast('Подключение к Spring Boot 3 Backend API успешно установлено! Данные синхронизированы с PostgreSQL.', 'success');
        }
      } catch {
        // Fallback to local state if backend is offline
      }
    }
    loadBackendData();

    // Process GitHub OAuth callback if redirected with code
    const urlParams = new URLSearchParams(window.location.search);
    const oauthCode = urlParams.get('code');
    if (oauthCode) {
      api.handleGithubOAuthCallback(oauthCode).then(res => {
        handleLoginSuccess(res);
        showToast('Успешная авторизация через GitHub OAuth! Профиль и ELO верифицированы.', 'fsp');
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }).catch(err => {
        console.warn('OAuth callback error:', err);
      });
    }

    // Restore authenticated session from localStorage
    try {
      const savedUser = localStorage.getItem('fsp_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as AuthLoginResponse;
        if (parsed && parsed.email) {
          handleLoginSuccess(parsed);
        }
      }
    } catch {}
  }, []);


  // Handle URL hash routing (e.g. #404, #candidate, #employer, #arena, #roadmap)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;
      if (['landing', 'candidate', 'employer', 'arena'].includes(hash)) {
        setCurrentRole(hash as UserRole);
      } else if (hash === '404' || hash === 'not_found') {
        setCurrentRole('not_found');
      } else {
        setCurrentRole('not_found');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    if (role === 'landing') {
      window.location.hash = '';
    } else {
      window.location.hash = role;
    }
    setCurrentRole(role);
  };

  const handleConnectGitHub = (data: GitHubProfileData) => {
    setGithubData(data);
    const isIvan = data.username.toLowerCase().includes('pesterev');
    const targetCandidateId = isIvan ? 'cand-pesterev' : activeCandidateId;

    setCandidates(prev => {
      return prev.map(c => {
        if (c.id === targetCandidateId || (isIvan && c.id === 'cand-pesterev') || (!isIvan && c.id === activeCandidateId)) {
          const repoLangs = data.topRepos.map(r => r.language).filter(Boolean);
          const newSkills = isIvan
            ? ['TypeScript', 'React 19', 'Python 3.12', 'FastAPI', 'Java 21', 'Spring Boot 3', 'Docker', 'PostgreSQL', 'TailwindCSS', 'Highload']
            : Array.from(new Set([...c.skills, ...repoLangs, 'CI/CD']));

          return {
            ...c,
            fullName: isIvan ? 'Иван Пестерев' : (data.username === 'alex-belov-fsp' ? c.fullName : `@${data.username}`),
            avatarUrl: data.avatarUrl || c.avatarUrl,
            title: isIvan ? (c.title || 'Java-разработчик') : c.title,
            about: isIvan
              ? 'Java-разработчик с опытом коммерческой разработки 5 лет 1 месяц. Синхронизировано 842 публичных коммита на GitHub (@ipesterev). Резюме верифицировано через hh.ru, приватные репозитории защищены политикой 152-ФЗ.'
              : `${c.about} • Подтверждено ${data.commitsCountYear} публичных коммитов в открытых репозиториях GitHub (@${data.username}). Приватные репозитории защищены регламентом 152-ФЗ.`,
            githubUrl: `https://github.com/${data.username}`,
            skills: newSkills,
            fspBadges: Array.from(new Set([...c.fspBadges, `GitHub Verified: @${data.username}`, 'Public Repos Sync'])),
            aiSummary: {
              summaryText: isIvan
                ? 'Java-разработчик (@ipesterev) с 5 годами опыта и спортивным рейтингом 2540 ELO. Стек: Java, Spring Boot, PostgreSQL, Docker, REST API. Профиль верифицирован через hh.ru (120 000 ₽ на руки, удаленно, постоянная занятость).'
                : `Сильный инженер (@${data.username}). Подтвержденный стек: ${newSkills.slice(0, 5).join(', ')}. Активность на GitHub: ${data.commitsCountYear} публичных коммитов в открытых репозиториях (приватные скрыты регламентом 152-ФЗ).`,
              keyStrengths: [
                `Высокая подтвержденная активность (${data.commitsCountYear} публичных коммитов)`,
                `Кросс-функциональный стек: ${data.mainLanguage}`,
                'Чистая модульная архитектура и покрытие тестами',
                'Строгое соблюдение стандартов информационной безопасности (152-ФЗ: без доступа к private repo)'
              ],
              recommendedProjects: [
                'Высоконагруженные платформы обратного найма',
                'Корпоративные FinTech и GovTech экосистемы',
                'Микросервисные асинхронные ядра'
              ],
              codeCleanlinessScore: 98,
              averageSolveTimeMinutes: 11,
              modelUsed: 'YandexGPT Pro' as const,
              generatedAt: new Date().toISOString()
            }
          };
        }
        return c;
      });
    });

    if (isIvan) {
      setActiveCandidateId('cand-pesterev');
    }

    showToast(`Данные соискателя (@${data.username}) синхронизированы в профиль: имя, аватар, стек и ИИ-портрет обновлены! Закрытые репозитории защищены (public_repo).`, 'success');
  };

  const handleConnectHh = (data: HhResumeData) => {
    setHhData(data);
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          const updatedSkills = Array.from(new Set([...c.skills, ...data.skills]));
          const updatedConfirmedSkills = data.confirmedSkills && data.confirmedSkills.length > 0 ? data.confirmedSkills : c.hhConfirmedSkills;
          
          const dynamic = calculateDynamicStats({
            solvedArenaTasksCount: c.solvedTasksCount,
            leetcodeStats: c.leetcodeStats,
            experienceYears: data.experienceYears,
            title: data.title,
            desiredSalary: data.desiredSalary,
            skills: updatedSkills
          });

          return {
            ...c,
            title: data.title,
            experienceYears: data.experienceYears,
            salaryExpectationMin: dynamic.salaryMin,
            salaryExpectationMax: dynamic.salaryMax,
            skills: updatedSkills,
            hhConfirmedSkills: updatedConfirmedSkills,
            about: data.about || c.about,
            fspRating: dynamic.elo,
            fspRank: dynamic.rank,
            currentGradeAssigned: dynamic.grade,
            aiSummary: dynamic.aiSummary
          };
        }
        return c;
      })
    );
    showToast(`✅ Резюме с hh.ru (${data.title}, #${data.resumeId.slice(0, 14)}...) синхронизировано в профиль: ${data.experienceYears} лет, ${data.desiredSalary.toLocaleString('ru-RU')} ₽!`, 'success');
  };

  const handleConnectYandex = (email: string) => {
    setYandexConnected(true);
    setYandexEmail(email);
    showToast(`Яндекс ID (${email}) успешно подтвержден через Passport OAuth2!`, 'success');
  };

  const handleDisconnectProvider = (provider: 'github' | 'hh' | 'yandex') => {
    if (provider === 'github') setGithubData(null);
    if (provider === 'hh') setHhData(null);
    if (provider === 'yandex') {
      setYandexConnected(false);
      setYandexEmail(null);
    }
    showToast(`Интеграция с ${provider.toUpperCase()} отключена.`, 'info');
  };

  // Handlers
  const handleAcceptInvitation = (invitationId: string) => {
    // Sync with Spring Boot REST API
    api.acceptOffer(invitationId).catch(() => {});

    setInvitations(prev =>
      prev.map(inv => {
        if (inv.id === invitationId) {
          const updatedChat = [
            ...inv.chatMessages,
            {
              id: 'msg-' + Date.now(),
              sender: 'candidate' as const,
              text: 'Согласен на условия оффера. Контакты переданы в ATS компании.',
              timestamp: new Date().toISOString()
            }
          ];
          return {
            ...inv,
            status: 'accepted',
            contactsRevealed: true,
            respondedAt: new Date().toISOString(),
            chatMessages: updatedChat
          };
        }
        return inv;
      })
    );

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    showToast('Приглашение принято! Ваши контакты безопасно открыты работодателю по 152-ФЗ.', 'success');
  };

  const handleDeclineInvitation = (invitationId: string, reason: string) => {
    // Sync with Spring Boot REST API
    api.declineOffer(invitationId).catch(() => {});

    setInvitations(prev =>
      prev.map(inv => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            status: 'declined',
            declineReason: reason,
            respondedAt: new Date().toISOString()
          };
        }
        return inv;
      })
    );

    showToast('Приглашение отклонено. Работодатель получил статус без раскрытия ваших данных.', 'info');
  };

  const handleSendMessage = (invitationId: string, text: string) => {
    const sender = currentRole === 'candidate' ? 'candidate' : 'employer';

    // Asynchronously synchronize with Spring Boot Real-time Chat REST API
    api.sendChatMessage({
      offerId: invitationId,
      senderRole: sender === 'candidate' ? 'CANDIDATE' : 'EMPLOYER',
      senderName: sender === 'candidate' ? (currentUser?.fullName || 'Иван Пестерев') : 'Елена Романова (СберТех HR)',
      text
    }).catch(err => {
      console.warn('Real-time chat API warning:', err);
    });

    setInvitations(prev =>
      prev.map(inv => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            chatMessages: [
              ...inv.chatMessages,
              {
                id: 'msg-' + Date.now(),
                sender: sender as 'candidate' | 'employer',
                text,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return inv;
      })
    );
  };

  const handleSendOffer = async (offerData: {
    candidateId: string;
    candidateName: string;
    vacancyId: string;
    vacancyTitle: string;
    proposedSalary: number;
    message: string;
    projectDetails: string;
    perksOffered: string[];
    idempotencyKey?: string;
  }) => {
    let savedBackendOffer = null;
    let isReplay = false;

    try {
      savedBackendOffer = await api.createOffer({
        candidateId: offerData.candidateId,
        employerId: currentEmployer.id,
        vacancyId: offerData.vacancyId,
        positionTitle: offerData.vacancyTitle,
        salaryFrom: Math.floor(offerData.proposedSalary * 0.9),
        salaryTo: Math.ceil(offerData.proposedSalary * 1.2),
        salaryOffered: offerData.proposedSalary,
        description: offerData.projectDetails,
        message: offerData.message,
        idempotencyKey: offerData.idempotencyKey
      });

      if (savedBackendOffer?.idempotentReplayed) {
        isReplay = true;
      }
    } catch (err: any) {
      console.warn('Backend offer create fallback to local state:', err.message);
    }

    const offerId = savedBackendOffer?.id || ('inv-' + Date.now());

    // Prevent duplicate invitations in local state via idempotency key
    setInvitations(prev => {
      const alreadyExists = prev.some(inv =>
        inv.id === offerId || (offerData.idempotencyKey && inv.idempotencyKey === offerData.idempotencyKey)
      );
      if (alreadyExists) {
        return prev;
      }

      const newInv: Invitation = {
        id: offerId,
        vacancyId: offerData.vacancyId,
        vacancyTitle: offerData.vacancyTitle,
        employerId: currentEmployer.id,
        companyName: currentEmployer.companyName,
        companyLogo: currentEmployer.logo,
        candidateId: offerData.candidateId,
        candidateName: offerData.candidateName,
        proposedSalary: offerData.proposedSalary,
        salaryMin: Math.floor(offerData.proposedSalary * 0.9),
        salaryMax: Math.ceil(offerData.proposedSalary * 1.2),
        message: offerData.message,
        projectDetails: offerData.projectDetails,
        perksOffered: offerData.perksOffered,
        status: 'sent',
        sentAt: savedBackendOffer?.createdAt || new Date().toISOString(),
        contactsRevealed: false,
        idempotencyKey: offerData.idempotencyKey,
        idempotentReplayed: isReplay,
        chatMessages: [
          {
            id: 'msg-' + Date.now(),
            sender: 'employer',
            text: offerData.message,
            timestamp: new Date().toISOString()
          }
        ]
      };

      return [newInv, ...prev];
    });

    if (!isReplay) {
      // Update vacancy count
      setVacancies(prev =>
        prev.map(v => v.id === offerData.vacancyId ? { ...v, invitationsCount: (v.invitationsCount || 0) + 1 } : v)
      );
      showToast(`Оффер с окладом ${offerData.proposedSalary.toLocaleString('ru-RU')} ₽ успешно отправлен соискателю ${offerData.candidateName}! (Защищен Idempotency-Key)`, 'success');
    } else {
      showToast(`Оффер уже был отправлен ранее соискателю ${offerData.candidateName} (восстановлен существующий оффер благодаря идемпотентности API)`, 'info');
    }
  };

  const handleAddVacancy = async (newVacData: Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>) => {
    const newVac = await api.createVacancy(newVacData);
    setVacancies(prev => [newVac, ...prev]);
    showToast(`Вакансия «${newVac.title}» с вилкой ${newVac.salaryMin.toLocaleString('ru-RU')} – ${newVac.salaryMax.toLocaleString('ru-RU')} ₽ успешно опубликована в системе!`, 'success');
  };

  const handleTaskSolved = (submission: SubmissionResult) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          const newSolvedCount = Math.min(c.solvedTasksCount + 1, tasks.length);
          const newElo = c.fspRating + submission.fspRatingEarned;

          const dynamic = calculateDynamicStats({
            solvedArenaTasksCount: newSolvedCount,
            arenaEloEarned: (newElo - (c.leetcodeStats ? (c.leetcodeStats.totalSolved >= 400 ? 2040 : 1200) : 1200)),
            leetcodeStats: c.leetcodeStats,
            experienceYears: c.experienceYears,
            title: c.title,
            skills: c.skills
          });

          const isRankUp = dynamic.rank !== c.fspRank;
          if (isRankUp) {
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
            showToast(`🏆 Поздравляем! Вам присвоен ${dynamic.rank} (${dynamic.elo} ELO)!`, 'fsp');
          } else {
            showToast(`Тест принят! Получено +${submission.fspRatingEarned} ELO очков (${dynamic.elo} ELO).`, 'fsp');
          }

          const newAchievements = [...c.achievements];
          if (c.solvedTasksCount === 0) {
            newAchievements.unshift({
              id: 'ach-arena-' + Date.now(),
              title: `Первая победа в Арене ФСП (${submission.taskTitle})`,
              year: 2026,
              badge: 'Дебют в Арене ФСП',
              description: `Успешное прохождение тестового набора за ${submission.executionTimeMs} мс.`,
              event: 'Алгоритмическая Арена ФСП'
            });
          }

          return {
            ...c,
            fspRating: dynamic.elo,
            fspRank: dynamic.rank,
            solvedTasksCount: newSolvedCount,
            totalTasksAttempted: Math.max(c.totalTasksAttempted, tasks.length),
            currentGradeAssigned: dynamic.grade,
            aiSummary: dynamic.aiSummary,
            achievements: newAchievements,
            lastTestingDate: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const handleAssignTest = (newAssessment: AssessmentAssignment) => {
    setAssessments(prev => [newAssessment, ...prev]);
    showToast(`Тестирование «${newAssessment.task.title}» успешно назначено соискателю ${newAssessment.candidateName}!${newAssessment.isLiveInterview ? ' Ссылка на Яндекс Телемост прикреплена.' : ''}`, 'success');
  };

  const handleSubmitAssessment = (assessmentId: string, submission: CandidateAssessmentSubmission) => {
    setAssessments(prev =>
      prev.map(a => {
        if (a.id === assessmentId) {
          return {
            ...a,
            status: 'submitted',
            submission
          };
        }
        return a;
      })
    );
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    showToast('Решение задачи успешно отправлено на код-ревью работодателю!', 'fsp');
  };

  const handleReviewAssessment = (assessmentId: string, review: EmployerAssessmentReview) => {
    setAssessments(prev =>
      prev.map(a => {
        if (a.id === assessmentId) {
          return {
            ...a,
            status: 'reviewed',
            review
          };
        }
        return a;
      })
    );
    showToast(`Оценка решения (${review.verdict === 'like' ? '👍 Лайк' : '👎 Дизлайк'}) сохранена, а фидбек отправлен соискателю!`, 'success');
  };

  const handleUpdateCandidate = (updated: Partial<CandidateProfile>) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          const merged = { ...c, ...updated };
          const dynamic = calculateDynamicStats({
            solvedArenaTasksCount: merged.solvedTasksCount,
            leetcodeStats: merged.leetcodeStats,
            experienceYears: merged.experienceYears,
            title: merged.title,
            desiredSalary: merged.salaryExpectationMin ? Math.round(merged.salaryExpectationMin / 0.9) : undefined,
            skills: merged.skills
          });

          return {
            ...merged,
            fspRating: dynamic.elo,
            fspRank: dynamic.rank,
            currentGradeAssigned: dynamic.grade,
            aiSummary: dynamic.aiSummary,
            salaryExpectationMin: dynamic.salaryMin,
            salaryExpectationMax: dynamic.salaryMax
          };
        }
        return c;
      })
    );
    showToast('Профиль соискателя обновлен: рейтинг, разряд, грейд и ИИ-портрет пересчитаны!', 'success');
  };


  const candidateInvitationsCount = invitations.filter(i => i.candidateId === activeCandidateId && i.status === 'sent').length;
  const acceptedOffersCount = invitations.filter(i => i.status === 'accepted').length;

  // Handle Login from Modal
  const handleLoginSuccess = (authResp: AuthLoginResponse) => {
    try {
      localStorage.setItem('fsp_auth_user', JSON.stringify(authResp));
    } catch {}

    setCurrentUser({
      email: authResp.email,
      fullName: authResp.fullName,
      role: authResp.role,
      avatarUrl: authResp.avatarUrl
    });

    if (authResp.role === 'CANDIDATE') {
      const targetId = authResp.candidateId || ('cand-' + Date.now());
      
      setCandidates(prev => {
        const existingIdx = prev.findIndex(c => c.id === targetId || c.email.toLowerCase() === authResp.email.toLowerCase());
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            fullName: authResp.fullName,
            email: authResp.email,
            avatarUrl: authResp.avatarUrl || updated[existingIdx].avatarUrl
          };
          return updated;
        }

        const newCandidate: CandidateProfile = {
          id: targetId,
          email: authResp.email,
          fullName: authResp.fullName,
          city: 'Москва / Удаленно',
          avatarUrl: authResp.avatarUrl || '/avatars/user_pesterev.png',
          title: 'Middle Java / Backend Developer',
          specialization: 'backend',
          targetGrade: 'Middle',
          currentGradeAssigned: 'Middle',
          fspId: 'FSP-' + Math.floor(100000 + Math.random() * 900000),
          fspRank: (authResp.fspRank as FspRank) || '1-й спортивный разряд',
          fspRating: authResp.fspElo || 1200,
          fspBadges: ['Участник ФСП 2026', 'Верифицирован'],
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          keycloakSub: authResp.userId,
          achievements: [],
          skills: ['Java', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST API'],
          experienceYears: 3,
          about: 'Зарегистрированный разработчик на платформе FSP Career Arena.',
          solvedTasksCount: 0,
          totalTasksAttempted: 0,
          testScorePercent: 0,
          avgExecutionTimeMs: 0,
          memoryEfficiencyScore: 100,
          lastTestingDate: new Date().toISOString(),
          canRetakeAfterDate: new Date(Date.now() + 90 * 86400000).toISOString(),
          phoneMasked: '+7 (9**) ***-**-**',
          phoneReal: '+7 (999) 000-00-00',
          telegramMasked: '@****_dev',
          telegramReal: '@' + authResp.email.split('@')[0],
          salaryExpectationMin: 150000,
          salaryExpectationMax: 230000
        };
        return [newCandidate, ...prev];
      });

      setActiveCandidateId(targetId);
      setCurrentRole('candidate');

      // Auto-populate GitHub integration if registered with GitHub
      if (authResp.email.endsWith('@github.com')) {
        const ghUser = authResp.email.split('@')[0];
        api.fetchGithubLiveProfile(ghUser).then(profile => {
          if (profile) {
            setGithubData(profile);
            setCandidates(prev => prev.map(c => c.id === targetId ? {
              ...c,
              fullName: profile.username && profile.username.toLowerCase().includes('pesterev') ? 'Иван Пестерев' : (profile.username ? `@${profile.username}` : c.fullName),
              avatarUrl: profile.avatarUrl || c.avatarUrl,
              githubUrl: `https://github.com/${profile.username}`,
              skills: Array.from(new Set([...c.skills, ...(profile.mainLanguage ? [profile.mainLanguage] : [])])),
              about: `${c.about} • Подтверждено ${profile.commitsCountYear} коммитов в GitHub (@${profile.username}).`
            } : c));
          }
        }).catch(() => {});
      }

      showToast(`Успешная регистрация и вход! Добро пожаловать, ${authResp.fullName}`, 'fsp');
    } else if (authResp.role === 'EMPLOYER') {
      const empId = authResp.employerId || ('emp-' + Date.now());
      setEmployers(prev => {
        const existing = prev.find(e => e.id === empId || e.email?.toLowerCase() === authResp.email.toLowerCase());
        if (existing) {
          return prev.map(e => e.id === existing.id ? {
            ...e,
            name: authResp.companyName || e.name,
            contactPerson: authResp.fullName,
            email: authResp.email
          } : e);
        }
        return [{
          id: empId,
          name: authResp.companyName || authResp.fullName,
          logo: authResp.avatarUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
          industry: 'IT & Финтех',
          about: 'Ведущая аккредитованная технологическая компания РФ.',
          contactPerson: authResp.fullName,
          email: authResp.email,
          telegram: '@' + authResp.email.split('@')[0],
          isVerifiedPartner: true,
          vacanciesCount: 3,
          offersSentCount: 1,
          interviewsCount: 1
        }, ...prev];
      });
      setCurrentRole('employer');
      showToast(`Успешная авторизация! Добро пожаловать, ${authResp.fullName} (${authResp.companyName || 'Работодатель'})`, 'fsp');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('fsp_auth_user');
    } catch {}
    setCurrentUser(null);
    setCurrentRole('landing');
    showToast('Вы вышли из учетной записи', 'info');
  };


  if (currentRole === 'not_found') {
    return (
      <div className="min-h-screen bg-[#04060d]">
        <NotFoundPage
          onNavigate={handleRoleChange}
          onOpenOAuth={() => setIsOAuthModalOpen(true)}
        />
        <OAuthModal
          isOpen={isOAuthModalOpen}
          onClose={() => setIsOAuthModalOpen(false)}
          candidate={currentCandidate}
          githubData={githubData}
          hhData={hhData}
          yandexConnected={yandexConnected}
          yandexEmail={yandexEmail}
          onConnectGitHub={handleConnectGitHub}
          onConnectHh={handleConnectHh}
          onConnectYandex={handleConnectYandex}
          onDisconnectProvider={handleDisconnectProvider}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 flex flex-col selection:bg-[#2b35ff] selection:text-white font-sans antialiased">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        invitationsCount={candidateInvitationsCount}
        acceptedOffersCount={acceptedOffersCount}
        onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isOAuthConnected={!!(githubData || hhData || yandexConnected)}
        candidate={currentCandidate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Toast Notification Bar */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-short">
          <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl ${
            toast.type === 'fsp'
              ? 'bg-[#090e24]/95 border-[#2b35ff]/50 text-blue-100 shadow-[0_10px_35px_rgba(43,53,255,0.25)]'
              : toast.type === 'success'
              ? 'bg-[#061814]/95 border-emerald-500/50 text-emerald-100 shadow-[0_10px_35px_rgba(16,185,129,0.2)]'
              : 'bg-[#090d1e]/95 border-white/10 text-slate-200'
          }`}>
            <div className="p-1.5 rounded-xl bg-white/5 shrink-0 mt-0.5 border border-white/10">
              {toast.type === 'fsp' ? <Trophy className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-xs leading-relaxed flex-1 font-medium text-slate-200">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container by Active Role */}
      <main className="flex-1 pb-12">
        {currentRole === 'landing' && (
          <div className="animate-tab-content">
            <LandingPage
              onSelectRole={handleRoleChange}
              onOpenOAuth={(provider) => {
                setIsOAuthModalOpen(true);
              }}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              candidate={currentCandidate}
              hhData={hhData}
              githubData={githubData}
            />
          </div>
        )}

        {currentRole === 'candidate' && (
          <div className="animate-tab-content">
            <CandidateDashboard
              candidate={currentCandidate}
              allCandidates={candidates}
              onSelectCandidate={(id) => {
                setActiveCandidateId(id);
                if (id === 'cand-pesterev') {
                  setGithubData(PESTEREV_GITHUB_PROFILE);
                  setHhData(PESTEREV_HH_RESUME);
                  setYandexEmail('ivan.pesterev@yandex.ru');
                } else if (id === 'cand-alina') {
                  setGithubData(ALINA_GITHUB_PROFILE);
                  setHhData(ALINA_HH_RESUME);
                  setYandexEmail('alina.dev@yandex.ru');
                } else if (id === 'cand-1') {
                  setGithubData(MOCK_GITHUB_PROFILE);
                  setHhData(MOCK_HH_RESUME);
                  setYandexEmail('alexander.belov@yandex.ru');
                } else if (id === 'cand-2') {
                  setHhData(DARIA_HH_RESUME);
                  setYandexEmail('daria.morozova@yandex.ru');
                } else if (id === 'cand-3') {
                  setHhData(SOKOLOV_HH_RESUME);
                  setYandexEmail('mikhail.sokolov@yandex.ru');
                } else {
                  const found = candidates.find(c => c.id === id);
                  if (found) {
                    setYandexEmail(`${found.email.split('@')[0]}@yandex.ru`);
                  }
                }
              }}
              invitations={invitations}
              tasks={tasks}
              assessments={assessments}
              onSubmitAssessment={handleSubmitAssessment}
              githubData={githubData}
              hhData={hhData}
              yandexConnected={yandexConnected}
              yandexEmail={yandexEmail}
              onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
              onAcceptInvitation={handleAcceptInvitation}
              onDeclineInvitation={handleDeclineInvitation}
              onSendMessage={handleSendMessage}
              onTaskSolved={handleTaskSolved}
              onUpdateCandidate={handleUpdateCandidate}
            />
          </div>
        )}

        {currentRole === 'employer' && (
          <div className="animate-tab-content">
            <EmployerDashboard
              currentEmployer={currentEmployer}
              candidates={candidates}
              vacancies={vacancies}
              invitations={invitations}
              assessments={assessments}
              tasks={tasks}
              onSendOffer={handleSendOffer}
              onAddVacancy={handleAddVacancy}
              onSendMessage={handleSendMessage}
              onAssignTest={handleAssignTest}
              onReviewTest={handleReviewAssessment}
              onUpdateCandidate={(id, updated) => {
                setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
                showToast('ИИ-портрет кандидата успешно обновлен!', 'success');
              }}
            />
          </div>
        )}

        {currentRole === 'arena' && (
          <div className="animate-tab-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  LeetCode & ФСП Интерактивная Арена
                </h2>
                <p className="text-xs text-slate-400">
                  Решение классических задач спортивного программирования с автоматической проверкой тестов
                </p>
              </div>
            </div>
            <CodeArenaIDE
              tasks={tasks}
              onTaskSolved={handleTaskSolved}
              onImportCustomTask={(newTask) => {
                setTasks(prev => [newTask, ...prev]);
                showToast(`Задача «${newTask.title}» успешно импортирована через GraphQL API LeetCode!`, 'success');
              }}
            />
          </div>
        )}
      </main>

      {/* Spring Security OAuth2 Integrations Modal */}
      <OAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        candidate={currentCandidate}
        githubData={githubData}
        hhData={hhData}
        yandexConnected={yandexConnected}
        yandexEmail={yandexEmail}
        onConnectGitHub={handleConnectGitHub}
        onConnectHh={handleConnectHh}
        onConnectYandex={handleConnectYandex}
        onDisconnectProvider={handleDisconnectProvider}
      />

      {/* Test Users & Credentials Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer with clean ministry & partner attribution */}
      <FspFooterPartners onNavigate={handleRoleChange} />
    </div>
  );
}
