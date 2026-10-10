-- 12. Candidate Job Applications (Дополнительный сценарий прямого отклика)
CREATE TABLE IF NOT EXISTS candidate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_applications_vacancy ON candidate_applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_candidate ON candidate_applications(candidate_id);

-- 13. Grade Assessment Test Attempts with 3-Month Cooldown
CREATE TABLE IF NOT EXISTS grade_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    specialization VARCHAR(32) NOT NULL,
    target_grade VARCHAR(32) NOT NULL,
    score_percent INT DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    assigned_grade VARCHAR(32),
    new_elo INT,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grade_tests_candidate ON grade_test_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_grade_tests_completed_at ON grade_test_attempts(completed_at);
