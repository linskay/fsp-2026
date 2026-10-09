-- V3__seed_test_users.sql: Test users for FSP Career Arena (Candidate and Employer)
-- Automatically seeded on application startup before launch

-- 1. Add password column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 2. Insert Candidate User & Profile (Иван Пестерев)
-- Login: candidate@fsp.ru / Password: candidate2026
INSERT INTO users (
    id, email, password, full_name, role, avatar_url, personal_data_consent_accepted, personal_data_consent_date
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'candidate@fsp.ru',
    'candidate2026',
    'Иван Пестерев',
    'CANDIDATE',
    '/avatars/user_pesterev.png',
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, full_name = EXCLUDED.full_name;

INSERT INTO candidate_profiles (
    id, user_id, fsp_id, fsp_elo, fsp_rank, specialization, grade, salary_expectation,
    location, bio, is_fsp_verified, github_username, github_repos_count, github_commits_count,
    yandex_id, hh_resume_id
) VALUES (
    'ca000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'FSP-RU-2026-0842',
    1200,
    'UNRANKED',
    'BACKEND',
    'MIDDLE',
    120000,
    'Москва',
    'Java-разработчик с опытом коммерческой разработки 5 лет 1 месяц. Резюме верифицировано через hh.ru (120 000 ₽ на руки, удаленно). Алгоритмический профиль в ФСП готов к квалификации в Арене.',
    true,
    'ipesterev',
    34,
    842,
    'ivan.pesterev@yandex.ru',
    'c182d902ff0dfdff810039ed1f5a564a4b7575'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO candidate_skills (candidate_id, skill_name) VALUES
    ('ca000000-0000-0000-0000-000000000001', 'Java'),
    ('ca000000-0000-0000-0000-000000000001', 'Spring Boot'),
    ('ca000000-0000-0000-0000-000000000001', 'PostgreSQL'),
    ('ca000000-0000-0000-0000-000000000001', 'Docker'),
    ('ca000000-0000-0000-0000-000000000001', 'REST API'),
    ('ca000000-0000-0000-0000-000000000001', 'Git'),
    ('ca000000-0000-0000-0000-000000000001', 'Hibernate')
ON CONFLICT DO NOTHING;

-- 3. Insert Employer User & Profile (СберТех HR / ПАО Сбербанк)
-- Login: employer@fsp.ru / Password: employer2026
INSERT INTO users (
    id, email, password, full_name, role, avatar_url, personal_data_consent_accepted, personal_data_consent_date
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'employer@fsp.ru',
    'employer2026',
    'Елена Романова (СберТех HR)',
    'EMPLOYER',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, full_name = EXCLUDED.full_name;

INSERT INTO employer_profiles (
    id, user_id, company_name, company_logo, industry, description, website, is_fsp_partner, hh_employer_id
) VALUES (
    'ea000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'ПАО Сбербанк (СберТех)',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    'FinTech & Highload Enterprise',
    'Технологическое подразделение Сбера. Разработка финансовой экосистемы, распределенных микросервисных платформ и платформ обратного найма со спортсменами ФСП РФ.',
    'https://sbertech.ru',
    true,
    'hh-emp-3529'
) ON CONFLICT (user_id) DO NOTHING;

-- 4. Insert Vacancy for Employer
INSERT INTO vacancies (
    id, employer_id, title, specialization, grade, salary_from, salary_to, min_fsp_elo,
    required_fsp_rank, location, work_format, description, is_active, hh_vacancy_id
) VALUES (
    'ba000000-0000-0000-0000-000000000001',
    'ea000000-0000-0000-0000-000000000001',
    'Senior Java / Highload Core Engineer',
    'BACKEND',
    'SENIOR',
    350000,
    520000,
    2000,
    'FIRST_CLASS',
    'Москва',
    'REMOTE',
    'Проектирование и разработка распределенного ядра обработки финансовых транзакций на Java 21, Spring Boot 3 и Kafka. Гарантированная белая вилка от 350 000 до 520 000 ₽ на руки.',
    true,
    '137312634'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO vacancy_skills (vacancy_id, skill_name) VALUES
    ('ba000000-0000-0000-0000-000000000001', 'Java'),
    ('ba000000-0000-0000-0000-000000000001', 'Spring Boot'),
    ('ba000000-0000-0000-0000-000000000001', 'PostgreSQL'),
    ('ba000000-0000-0000-0000-000000000001', 'Kafka'),
    ('ba000000-0000-0000-0000-000000000001', 'Docker')
ON CONFLICT DO NOTHING;
