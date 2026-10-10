-- Migration V10: Employer Webhooks Integration System (ATS, Telegram bots, 1C/E-Staff)
CREATE TABLE IF NOT EXISTS employer_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    secret_token VARCHAR(255),
    events VARCHAR(500) NOT NULL DEFAULT 'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED',
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_status_code INT,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employer_webhooks_employer_id ON employer_webhooks(employer_id);

-- Insert a default demo webhook for Sber employer if exists
INSERT INTO employer_webhooks (employer_id, url, secret_token, events, description, is_active, last_status_code, last_triggered_at)
SELECT 
    ep.id,
    'https://ats.sber.ru/api/v1/fsp-hook-receiver',
    'sber_fsp_secret_webhook_token_2026',
    'OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED',
    'Интеграция с корпоративной ATS Сбера (Webhooks)',
    true,
    200,
    CURRENT_TIMESTAMP
FROM employer_profiles ep
WHERE ep.company_name ILIKE '%Сбер%' OR ep.company_name ILIKE '%Sber%'
LIMIT 1
ON CONFLICT DO NOTHING;
