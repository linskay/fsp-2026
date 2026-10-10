-- ====================================================================
-- Миграция V9: Идемпотентность API для отправки офферов (Offer Idempotency)
-- Защита от дублирования офферов при сетевых сбоях, ретраях и double-click
-- Стандарт RFC 7231 / IETF Idempotency-Key
-- ====================================================================

-- 1. Добавление колонки idempotency_key в таблицу invitations
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(128);

-- 2. Уникальный индекс на ключ идемпотентности
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_idempotency_key 
ON invitations (idempotency_key) 
WHERE idempotency_key IS NOT NULL;

-- 3. Защита на уровне бизнес-логики: один активный PENDING оффер от компании кандидату на позицию
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_unique_active_offer
ON invitations (employer_id, candidate_id, vacancy_id)
WHERE status = 'PENDING';

-- 4. Универсальная таблица журнала идемпотентности API (API Idempotency Store)
CREATE TABLE IF NOT EXISTS api_idempotency_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    request_path VARCHAR(256) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    actor_user_id UUID,
    response_status INT NOT NULL,
    response_body TEXT NOT NULL,
    resource_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_idempotency_lookup 
ON api_idempotency_records (idempotency_key, request_path);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires 
ON api_idempotency_records (expires_at);
