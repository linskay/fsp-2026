/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_EMPLOYERS, 
  INITIAL_INVITATIONS, 
  INITIAL_TASKS,
  INITIAL_VACANCIES
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
  HhResumeData
} from './types';
import { MOCK_GITHUB_PROFILE, MOCK_HH_RESUME } from './data/mockOAuthData';
import { Navbar } from './components/Navbar';
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { CodeArenaIDE } from './components/arena/CodeArenaIDE';
import { SwaggerApiView } from './components/swagger/SwaggerApiView';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { RoadmapPresentation } from './components/roadmap/RoadmapPresentation';
import { OAuthModal } from './components/auth/OAuthModal';
import { FspFooterPartners } from './components/brand/FspLogo';
import { Sparkles, Trophy, Bell, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('candidate');
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [employers, setEmployers] = useState<EmployerProfile[]>(INITIAL_EMPLOYERS);
  const [vacancies, setVacancies] = useState<Vacancy[]>(INITIAL_VACANCIES);
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);
  const [tasks, setTasks] = useState<AlgorithmTask[]>(INITIAL_TASKS);

  // OAuth Integrations State
  const [githubData, setGithubData] = useState<GitHubProfileData | null>(MOCK_GITHUB_PROFILE);
  const [hhData, setHhData] = useState<HhResumeData | null>(MOCK_HH_RESUME);
  const [yandexConnected, setYandexConnected] = useState<boolean>(true);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState<boolean>(false);

  // Active current user contexts
  const [activeCandidateId, setActiveCandidateId] = useState<string>('cand-1');
  const currentCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];
  const currentEmployer = employers[0];

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'fsp' } | null>({
    message: 'Добро пожаловать в FSP Career Arena! Вы вошли как Александр Белов (Мастер спорта РФ по СП, ELO 2740). GitHub и hh.ru синхронизированы.',
    type: 'fsp'
  });

  const showToast = (message: string, type: 'success' | 'info' | 'fsp' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 5000);
  };

  const handleConnectGitHub = (data: GitHubProfileData) => {
    setGithubData(data);
    // Enrich candidate skills
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          const combinedSkills = Array.from(new Set([...c.skills, 'C++', 'Java 21', 'Spring Boot 3', 'Highload']));
          return {
            ...c,
            skills: combinedSkills
          };
        }
        return c;
      })
    );
    showToast(`GitHub аккаунт @${data.username} успешно подключен через Spring Security OAuth2! Подтянуто ${data.topRepos.length} репозитория и ${data.commitsCountYear} коммитов.`, 'success');
  };

  const handleConnectHh = (data: HhResumeData) => {
    setHhData(data);
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          return {
            ...c,
            title: data.title,
            experienceYears: data.experienceYears,
            salaryExpectationMin: data.desiredSalary * 0.9,
            salaryExpectationMax: data.desiredSalary * 1.2,
            skills: Array.from(new Set([...c.skills, ...data.skills]))
          };
        }
        return c;
      })
    );
    showToast(`Резюме с hh.ru (${data.title}) успешно распарсено: опыт ${data.experienceYears} лет, оклад ${data.desiredSalary.toLocaleString('ru-RU')} ₽!`, 'success');
  };

  const handleConnectYandex = (email: string) => {
    setYandexConnected(true);
    showToast(`Яндекс ID (${email}) успешно подтвержден через Passport OAuth2!`, 'success');
  };

  const handleDisconnectProvider = (provider: 'github' | 'hh' | 'yandex') => {
    if (provider === 'github') setGithubData(null);
    if (provider === 'hh') setHhData(null);
    if (provider === 'yandex') setYandexConnected(false);
    showToast(`Интеграция с ${provider.toUpperCase()} отключена.`, 'info');
  };

  // Handlers
  const handleAcceptInvitation = (invitationId: string) => {
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

  const handleSendOffer = (offerData: {
    candidateId: string;
    candidateName: string;
    vacancyId: string;
    vacancyTitle: string;
    proposedSalary: number;
    message: string;
    projectDetails: string;
    perksOffered: string[];
  }) => {
    const newInv: Invitation = {
      id: 'inv-' + Date.now(),
      vacancyId: offerData.vacancyId,
      vacancyTitle: offerData.vacancyTitle,
      employerId: currentEmployer.id,
      companyName: currentEmployer.companyName,
      companyLogo: currentEmployer.logo,
      candidateId: offerData.candidateId,
      candidateName: offerData.candidateName,
      proposedSalary: offerData.proposedSalary,
      salaryMin: offerData.proposedSalary * 0.9,
      salaryMax: offerData.proposedSalary * 1.2,
      message: offerData.message,
      projectDetails: offerData.projectDetails,
      perksOffered: offerData.perksOffered,
      status: 'sent',
      sentAt: new Date().toISOString(),
      contactsRevealed: false,
      chatMessages: [
        {
          id: 'msg-' + Date.now(),
          sender: 'employer',
          text: offerData.message,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setInvitations(prev => [newInv, ...prev]);

    // Update vacancy count
    setVacancies(prev =>
      prev.map(v => v.id === offerData.vacancyId ? { ...v, invitationsCount: (v.invitationsCount || 0) + 1 } : v)
    );

    showToast(`Оффер с окладом ${offerData.proposedSalary.toLocaleString('ru-RU')} ₽ успешно отправлен соискателю ${offerData.candidateName}!`, 'success');
  };

  const handleAddVacancy = (newVacData: Omit<Vacancy, 'id' | 'createdAt' | 'invitationsCount'>) => {
    const newVac: Vacancy = {
      ...newVacData,
      id: 'vac-' + Date.now(),
      createdAt: new Date().toISOString(),
      invitationsCount: 0
    };

    setVacancies(prev => [newVac, ...prev]);
    showToast(`Вакансия «${newVac.title}» с вилкой ${newVac.salaryMin.toLocaleString('ru-RU')} – ${newVac.salaryMax.toLocaleString('ru-RU')} ₽ успешно опубликована!`, 'success');
  };

  const handleTaskSolved = (submission: SubmissionResult) => {
    // Update candidate ELO and solved count
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === activeCandidateId) {
          return {
            ...c,
            fspRating: c.fspRating + submission.fspRatingEarned,
            solvedTasksCount: c.solvedTasksCount + 1,
            currentGradeAssigned: submission.gradeCalculated,
            lastTestingDate: new Date().toISOString()
          };
        }
        return c;
      })
    );

    showToast(`Тест принят! Получено +${submission.fspRatingEarned} ELO очков. Присвоен верифицированный грейд ${submission.gradeCalculated.toUpperCase()}.`, 'fsp');
  };

  const handleUpdateCandidate = (updated: Partial<CandidateProfile>) => {
    setCandidates(prev =>
      prev.map(c => c.id === activeCandidateId ? { ...c, ...updated } : c)
    );
    showToast('Профиль соискателя обновлен и синхронизирован с реестром ФСП.', 'success');
  };

  // Demo Walkthrough helper
  const runDemoScenario = () => {
    setCurrentRole('candidate');
    showToast('▶ Шаг 1: Кандидат изучает офферы от работодателей с обязательной вилкой зарплаты в рублях...', 'fsp');
    
    setTimeout(() => {
      showToast('▶ Шаг 2: Кандидат принимает оффер от СберТех на 520 000 ₽ и подтверждает 152-ФЗ согласие.', 'success');
    }, 4000);

    setTimeout(() => {
      setCurrentRole('employer');
      showToast('▶ Шаг 3: Переключаемся в ЛК Работодателя. В ATS контакты кандидата демаскированы и доступен прямой чат!', 'fsp');
    }, 8000);
  };

  const candidateInvitationsCount = invitations.filter(i => i.candidateId === activeCandidateId && i.status === 'sent').length;
  const acceptedOffersCount = invitations.filter(i => i.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col selection:bg-[#2b35ff] selection:text-white font-['JetBrains_Mono']">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        invitationsCount={candidateInvitationsCount}
        acceptedOffersCount={acceptedOffersCount}
        onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
        isOAuthConnected={!!(githubData || hhData || yandexConnected)}
      />

      {/* Toast Notification Bar */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
          <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
            toast.type === 'fsp'
              ? 'bg-[#0a1226]/95 border-[#2b35ff]/60 text-blue-100 shadow-[0_0_25px_rgba(43,53,255,0.25)]'
              : toast.type === 'success'
              ? 'bg-[#091f1a]/95 border-emerald-500/60 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
              : 'bg-[#0d1326]/95 border-[#1e294b] text-slate-200'
          }`}>
            <div className="p-1.5 rounded-xl bg-[#2b35ff]/20 text-[#00f0ff] shrink-0 mt-0.5 border border-[#2b35ff]/30">
              {toast.type === 'fsp' ? <Trophy className="w-4 h-4 text-yellow-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-xs leading-relaxed flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container by Active Role */}
      <main className="flex-1 pb-12">
        {currentRole === 'candidate' && (
          <CandidateDashboard
            candidate={currentCandidate}
            invitations={invitations}
            tasks={tasks}
            githubData={githubData}
            hhData={hhData}
            yandexConnected={yandexConnected}
            onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
            onAcceptInvitation={handleAcceptInvitation}
            onDeclineInvitation={handleDeclineInvitation}
            onSendMessage={handleSendMessage}
            onTaskSolved={handleTaskSolved}
            onUpdateCandidate={handleUpdateCandidate}
          />
        )}

        {currentRole === 'employer' && (
          <EmployerDashboard
            currentEmployer={currentEmployer}
            candidates={candidates}
            vacancies={vacancies}
            invitations={invitations}
            onSendOffer={handleSendOffer}
            onAddVacancy={handleAddVacancy}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentRole === 'arena' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  LeetCode & ФСП Интерактивная Арена
                </h2>
                <p className="text-xs text-slate-400">
                  Решение классических задач спортивного программирования с изолированной проверкой в Judge0 Sandbox
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

        {currentRole === 'swagger' && (
          <SwaggerApiView />
        )}

        {currentRole === 'architecture' && (
          <ArchitectureView />
        )}

        {currentRole === 'roadmap' && (
          <RoadmapPresentation
            onNavigateToRole={(r) => setCurrentRole(r)}
            onRunDemoScenario={runDemoScenario}
          />
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
        onConnectGitHub={handleConnectGitHub}
        onConnectHh={handleConnectHh}
        onConnectYandex={handleConnectYandex}
        onDisconnectProvider={handleDisconnectProvider}
      />

      {/* Footer with clean ministry & partner attribution */}
      <FspFooterPartners />
    </div>
  );
}
