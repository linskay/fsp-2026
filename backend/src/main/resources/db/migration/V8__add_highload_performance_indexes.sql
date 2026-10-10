-- V8__add_highload_performance_indexes.sql: Highload Database Indexes for PostgreSQL & 152-FZ Security Audit Log
-- Optimization for candidate search, vacancy filtering, offers, skills matching and personal data audit logging

-- 1. Candidate Profiles Highload Search & Ranking Indexes
CREATE INDEX IF NOT EXISTS idx_candidate_elo_desc ON candidate_profiles(fsp_elo DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_grade ON candidate_profiles(grade);
CREATE INDEX IF NOT EXISTS idx_candidate_specialization ON candidate_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_candidate_fsp_rank ON candidate_profiles(fsp_rank);
CREATE INDEX IF NOT EXISTS idx_candidate_is_verified ON candidate_profiles(is_fsp_verified);
CREATE INDEX IF NOT EXISTS idx_candidate_salary ON candidate_profiles(salary_expectation);
CREATE INDEX IF NOT EXISTS idx_candidate_search_composite ON candidate_profiles(specialization, grade, fsp_elo DESC);

-- 2. Candidate Skills Matching
CREATE INDEX IF NOT EXISTS idx_candidate_skills_name ON candidate_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_lookup ON candidate_skills(skill_name, candidate_id);

-- 3. Vacancy Search & Anti-Fraud Filtering
CREATE INDEX IF NOT EXISTS idx_vacancies_is_active ON vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_vacancies_employer_id ON vacancies(employer_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_filter_composite ON vacancies(specialization, grade, is_active);
CREATE INDEX IF NOT EXISTS idx_vacancies_salary_range ON vacancies(salary_from, salary_to);
CREATE INDEX IF NOT EXISTS idx_vacancies_min_elo ON vacancies(min_fsp_elo);
CREATE INDEX IF NOT EXISTS idx_vacancy_skills_name ON vacancy_skills(skill_name);

-- 4. Reverse Hiring Invitations & Offers Highload Indexing
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_candidate_status ON invitations(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_employer_status ON invitations(employer_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_created_desc ON invitations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_vacancy_id ON invitations(vacancy_id);

-- 5. Algorithmic Tasks and Code Submissions
CREATE INDEX IF NOT EXISTS idx_algorithm_tasks_diff ON algorithm_tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_submissions_cand_task ON task_submissions(candidate_id, task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_verdict ON task_submissions(verdict);
CREATE INDEX IF NOT EXISTS idx_submissions_created_desc ON task_submissions(created_at DESC);

-- 6. Applications & Notifications Highload Compound Lookups
CREATE INDEX IF NOT EXISTS idx_applications_candidate_status ON candidate_applications(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy_status ON candidate_applications(vacancy_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON user_notifications(user_id, is_read, created_at DESC);

-- 7. Audit Log (Журнал аудита безопасности по 152-ФЗ)
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL, -- 'VIEW_PERSONAL_CONTACTS', 'ACCEPT_OFFER_CONSENT', 'EXPORT_RESUME_PDF', 'OAUTH_SYNC'
    target_candidate_id UUID,
    target_candidate_name VARCHAR(255),
    description TEXT NOT NULL,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created_desc ON security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor_email ON security_audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_target_candidate ON security_audit_logs(target_candidate_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON security_audit_logs(action);

-- Seed initial audit log demo entries
INSERT INTO security_audit_logs (
    id, actor_user_id, actor_email, actor_role, action, target_candidate_id, target_candidate_name, description, ip_address, user_agent, created_at
)
VALUES
(
    'ad000000-0000-0000-0000-000000000001'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    'employer@fsp.ru',
    'EMPLOYER',
    'VIEW_PERSONAL_CONTACTS',
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'Иван Пестерев',
    'Рекрутер СберТеха (Елена Романова) просмотрел контакты кандидата Ивана Пестерева после согласия на оффер (152-ФЗ)',
    '192.168.1.42',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FSP-Career-Arena/2.0',
    CURRENT_TIMESTAMP - INTERVAL '25 minutes'
),
(
    'ad000000-0000-0000-0000-000000000002'::uuid,
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'candidate@fsp.ru',
    'CANDIDATE',
    'ACCEPT_OFFER_CONSENT',
    'c0000000-0000-0000-0000-000000000001'::uuid,
    'Иван Пестерев',
    'Кандидат подтвердил согласие на передачу контактных данных HR-отделу ПАО Сбербанк',
    '178.62.204.11',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FSP-Career-Arena/2.0',
    CURRENT_TIMESTAMP - INTERVAL '30 minutes'
)
ON CONFLICT DO NOTHING;
