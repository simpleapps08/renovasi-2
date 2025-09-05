-- Create chat_logs table for N8N Chat Workflow
-- This table stores all chat interactions between users and the bot

CREATE TABLE IF NOT EXISTS chat_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp ON chat_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at);

-- Create RLS (Row Level Security) policies if using Supabase
-- Enable RLS
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to do everything (for N8N)
CREATE POLICY "Allow service role full access" ON chat_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Policy to allow authenticated users to view their own chat logs
CREATE POLICY "Users can view own chat logs" ON chat_logs
    FOR SELECT USING (session_id LIKE 'chat-session-%');

-- Optional: Policy for admin users to view all chat logs
-- CREATE POLICY "Admin can view all chat logs" ON chat_logs
--     FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_chat_logs_updated_at
    BEFORE UPDATE ON chat_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO chat_logs (session_id, user_message, bot_response, timestamp, processed_at)
-- VALUES 
--     ('test-session-1', 'Halo', 'Halo! Selamat datang di SERVISOO. Bagaimana saya bisa membantu Anda hari ini?', NOW(), NOW()),
--     ('test-session-1', 'Berapa harga renovasi rumah?', 'Untuk informasi harga, silakan gunakan fitur Simulasi RAB di website kami atau hubungi tim kami untuk konsultasi gratis.', NOW(), NOW());

-- Create a view for chat analytics (optional)
CREATE OR REPLACE VIEW chat_analytics AS
SELECT 
    DATE(created_at) as chat_date,
    COUNT(*) as total_messages,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(LENGTH(user_message)) as avg_message_length,
    COUNT(CASE WHEN user_message ILIKE '%harga%' OR user_message ILIKE '%biaya%' THEN 1 END) as pricing_inquiries,
    COUNT(CASE WHEN user_message ILIKE '%layanan%' OR user_message ILIKE '%service%' THEN 1 END) as service_inquiries,
    COUNT(CASE WHEN user_message ILIKE '%kontak%' OR user_message ILIKE '%hubungi%' THEN 1 END) as contact_inquiries
FROM chat_logs
GROUP BY DATE(created_at)
ORDER BY chat_date DESC;

-- Grant permissions for the view
GRANT SELECT ON chat_analytics TO authenticated;
GRANT SELECT ON chat_analytics TO service_role;

COMMIT;