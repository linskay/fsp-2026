-- V1__init_schema.sql: Initial Schema for FSP Career Arena

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'CANDIDATE', 'EMPLOYER', 'ADMIN'
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    personal_data_consent_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    personal_data_consent_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidate Profiles
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    fsp_id VARCHAR(64) UNIQUE,
    fsp_elo INT NOT NULL DEFAULT 1500,
    fsp_rank VARCHAR(64) NOT NULL DEFAULT 'UNRANKED', -- 'MS', 'KMS', 'FIRST_CLASS', 'SECOND_CLASS'
    specialization VARCHAR(64) NOT NULL, -- 'BACKEND', 'FRONTEND', 'FULLSTACK', 'MOBILE', 'DEVOPS', 'ML_AI'
    grade VARCHAR(32) NOT NULL, -- 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'
    salary_expectation INT NOT NULL,
    location VARCHAR(128) NOT NULL,
    bio TEXT,
    is_fsp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    github_username VARCHAR(128),
    github_repos_count INT DEFAULT 0,
    github_commits_count INT DEFAULT 0,
    yandex_id VARCHAR(128),
    hh_resume_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Candidate Skills
CREATE TABLE candidate_skills (
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(64) NOT NULL,
    PRIMARY KEY (candidate_id, skill_name)
);

-- 4. Employer Profiles
CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_logo VARCHAR(512),
    industry VARCHAR(128) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    is_fsp_partner BOOLEAN NOT NULL DEFAULT FALSE,
    hh_employer_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Vacancies (with mandatory salary range 'from' - 'to' in RUB)
CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    specialization VARCHAR(64) NOT NULL,
    grade VARCHAR(32) NOT NULL,
    salary_from INT NOT NULL,
    salary_to INT NOT NULL,
    min_fsp_elo INT DEFAULT 0,
    required_fsp_rank VARCHAR(64),
    location VARCHAR(128) NOT NULL,
    work_format VARCHAR(64) NOT NULL, -- 'REMOTE', 'OFFICE', 'HYBRID'
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    hh_vacancy_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Vacancy Required Skills
CREATE TABLE vacancy_skills (
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    skill_name VARCHAR(64) NOT NULL,
    PRIMARY KEY (vacancy_id, skill_name)
);

-- 7. Algorithmic Tasks (LeetCode & FSP tasks)
CREATE TABLE algorithm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    difficulty VARCHAR(32) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD'
    tags VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    time_limit_ms INT DEFAULT 2000,
    memory_limit_mb INT DEFAULT 256,
    initial_code_java TEXT,
    initial_code_python TEXT,
    initial_code_cpp TEXT,
    initial_code_go TEXT,
    initial_code_js TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Code Submissions
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES algorithm_tasks(id) ON DELETE CASCADE,
    language VARCHAR(32) NOT NULL,
    source_code TEXT NOT NULL,
    verdict VARCHAR(64) NOT NULL, -- 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR'
    execution_time_ms INT,
    memory_used_kb INT,
    tests_passed INT DEFAULT 0,
    total_tests INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Invitations & Offers
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
    salary_offered INT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED', 'INTERVIEW_SCHEDULED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. AI Summaries
CREATE TABLE candidate_ai_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    key_strengths TEXT[],
    recommendation_level VARCHAR(64),
    recommended_roles TEXT[],
    model_name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
