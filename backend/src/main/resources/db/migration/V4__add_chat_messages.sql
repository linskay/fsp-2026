-- 11. Chat Messages for Real-time Messaging & Dialogs
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    sender_id UUID,
    sender_role VARCHAR(32) NOT NULL, -- 'CANDIDATE', 'EMPLOYER', 'SYSTEM'
    sender_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_offer ON chat_messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
