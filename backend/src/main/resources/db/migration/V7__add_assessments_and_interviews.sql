-- V7: Code Assessments, Submissions, Reviews and Yandex Telemost Live Interviews
CREATE TABLE IF NOT EXISTS assessment_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    task_title VARCHAR(255) NOT NULL,
    task_difficulty VARCHAR(32) NOT NULL DEFAULT 'Medium',
    task_description TEXT NOT NULL,
    starter_code TEXT,
    time_limit_minutes INT NOT NULL DEFAULT 45,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    is_live_interview BOOLEAN NOT NULL DEFAULT FALSE,
    telemost_room_url VARCHAR(512),
    scheduled_interview_at TIMESTAMP WITH TIME ZONE,
    submission_code TEXT,
    submission_language VARCHAR(32),
    tests_passed INT DEFAULT 0,
    total_tests INT DEFAULT 0,
    execution_time_ms INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE,
    review_verdict VARCHAR(32),
    internal_note TEXT,
    candidate_feedback_message TEXT,
    reviewer_name VARCHAR(128),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_employer ON assessment_assignments(employer_id);
CREATE INDEX IF NOT EXISTS idx_assessment_candidate ON assessment_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_status ON assessment_assignments(status);

CREATE TABLE IF NOT EXISTS scheduled_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    telemost_room_url VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interviews_employer ON scheduled_interviews(employer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON scheduled_interviews(candidate_id);

-- Seed an assessment assignment with submitted code (waiting for code review)
INSERT INTO assessment_assignments (
    id, employer_id, candidate_id, task_title, task_difficulty, task_description,
    starter_code, time_limit_minutes, status, is_live_interview, telemost_room_url,
    submission_code, submission_language, tests_passed, total_tests, execution_time_ms,
    submitted_at, created_at
)
SELECT 
    'ac000000-0000-0000-0000-000000000001'::uuid,
    ep.id,
    cp.id,
    'LRU Cache с поддержкой Time-To-Live (TTL)',
    'Medium',
    'Спроектируйте и реализуйте структуру данных LRU Cache (Least Recently Used) со сложностью операций O(1) и автоматической очисткой устаревших ключей по TTL.',
    'class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n    }\n}',
    45,
    'SUBMITTED',
    true,
    'https://telemost.yandex.ru/j/8421049281',
    'class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.map = new Map();\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key, val) {\n        if (this.map.has(key)) this.map.delete(key);\n        else if (this.map.size >= this.capacity) {\n            const oldest = this.map.keys().next().value;\n            this.map.delete(oldest);\n        }\n        this.map.set(key, val);\n    }\n}',
    'javascript',
    8,
    8,
    42,
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
FROM employer_profiles ep, candidate_profiles cp
WHERE ep.company_name LIKE '%Сбербанк%' AND cp.user_id = (SELECT id FROM users WHERE email = 'candidate@fsp.ru')
LIMIT 1
ON CONFLICT DO NOTHING;
