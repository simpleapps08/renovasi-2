-- Create social_media_links table
CREATE TABLE IF NOT EXISTS public.social_media_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) for social_media_links
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;

-- Policy for public read access for social_media_links
DROP POLICY IF EXISTS "Public social_media_links are viewable by everyone." ON public.social_media_links;
CREATE POLICY "Public social_media_links are viewable by everyone." ON public.social_media_links
  FOR SELECT USING (TRUE);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    formatted_value TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) for contact_info
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Policy for public read access for contact_info
DROP POLICY IF EXISTS "Public contact_info are viewable by everyone." ON public.contact_info;
CREATE POLICY "Public contact_info are viewable by everyone." ON public.contact_info
  FOR SELECT USING (TRUE);

-- Create footer_content table
CREATE TABLE IF NOT EXISTS public.footer_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) for footer_content
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- Policy for public read access for footer_content
DROP POLICY IF EXISTS "Public footer_content are viewable by everyone." ON public.footer_content;
CREATE POLICY "Public footer_content are viewable by everyone." ON public.footer_content
  FOR SELECT USING (TRUE);

-- Optional: Add initial data to tables if they are empty (for testing/development)

-- Social Media Links
INSERT INTO public.social_media_links (platform, name, url, icon, display_order, is_active)
VALUES 
    ('instagram', 'Instagram', 'https://www.instagram.com/servisoo.official/', 'instagram', 1, TRUE),
    ('facebook', 'Facebook', 'https://www.facebook.com/servisoo.official', 'facebook', 2, TRUE),
    ('tiktok', 'TikTok', 'https://www.tiktok.com/@servisoo.official', 'tiktok', 3, TRUE),
    ('x', 'Twitter/X', 'https://x.com/servisoo', 'x', 4, TRUE),
    ('youtube', 'YouTube', '#', 'youtube', 5, TRUE)
ON CONFLICT (platform) DO NOTHING;

-- Contact Info
INSERT INTO public.contact_info (type, label, value, formatted_value, is_active)
VALUES
    ('email', 'Email', 'servisoo.dev@gmail.com', NULL, TRUE),
    ('phone', 'Phone', '+6282336548080', '+62 823-3654-8080', TRUE),
    ('whatsapp', 'WhatsApp', '+6285808675233', '+62 858-0867-5233', TRUE),
    ('address', 'Alamat', 'Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318', NULL, TRUE)
ON CONFLICT (type) DO NOTHING;

-- Footer Content
INSERT INTO public.footer_content (section, content, is_active)
VALUES
    ('description', 'Servisoo adalah platform terpercaya untuk layanan renovasi dan pembangunan. Kami menghubungkan Anda dengan kontraktor profesional untuk mewujudkan rumah impian Anda.', TRUE),
    ('services', '["Renovasi Gedung Sekolah dan Kantor", "Renovasi Rumah", "Pembuatan Taman (Landscape)", "Toko Bangunan", "Desain & Perencanaan", "Konsultasi RAB"]', TRUE)
ON CONFLICT (section) DO NOTHING;
