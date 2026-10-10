-- V6: User Notifications and Vacancy Anti-Fraud Moderation
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON user_notifications(is_read);

CREATE TABLE IF NOT EXISTS vacancy_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    candidate_id UUID,
    reason VARCHAR(64) NOT NULL,
    comment TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vacancy_reports_vacancy ON vacancy_reports(vacancy_id);

-- Seed initial notifications for default users
INSERT INTO user_notifications (id, user_id, title, message, type, entity_id, is_read, created_at)
SELECT 
    'ab000000-0000-0000-0000-000000000001'::uuid,
    u.id,
    'Новый оффер от ПАО Сбербанк (СберТех)',
    'Вам поступило приглашение на позицию Senior Java Core Engineer с окладом 450 000 – 550 000 ₽.',
    'OFFER',
    'da000000-0000-0000-0000-000000000001',
    false,
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
FROM users u WHERE u.email = 'candidate@fsp.ru'
ON CONFLICT DO NOTHING;

INSERT INTO user_notifications (id, user_id, title, message, type, entity_id, is_read, created_at)
SELECT 
    'ab000000-0000-0000-0000-000000000002'::uuid,
    u.id,
    'Квалификационный норматив ФСП подтвержден',
    'Ваш грейд Senior и спортивный рейтинг 1310 ELO успешно верифицированы.',
    'GRADE_TEST',
    NULL,
    false,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users u WHERE u.email = 'candidate@fsp.ru'
ON CONFLICT DO NOTHING;

INSERT INTO user_notifications (id, user_id, title, message, type, entity_id, is_read, created_at)
SELECT 
    'ab000000-0000-0000-0000-000000000003'::uuid,
    u.id,
    'Кандидат принял оффер',
    'Иван Пестерев принял оффер по вакансии Senior Java Core Engineer. Контактные данные открыты в чате.',
    'OFFER_ACCEPTED',
    'da000000-0000-0000-0000-000000000001',
    false,
    CURRENT_TIMESTAMP - INTERVAL '30 minutes'
FROM users u WHERE u.email = 'employer@fsp.ru'
ON CONFLICT DO NOTHING;
