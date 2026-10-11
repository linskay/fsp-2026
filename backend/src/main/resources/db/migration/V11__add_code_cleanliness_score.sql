ALTER TABLE candidate_ai_summaries
ADD COLUMN IF NOT EXISTS code_cleanliness_score INT DEFAULT 95;
