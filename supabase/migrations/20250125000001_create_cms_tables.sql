-- Create social_media_links table
CREATE TABLE IF NOT EXISTS public.social_media_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- instagram, facebook, tiktok, youtube
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- email, phone, whatsapp, address
    label VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    formatted_value TEXT, -- for formatted phone numbers
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create footer_content table for general footer content
CREATE TABLE IF NOT EXISTS public.footer_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section VARCHAR(50) NOT NULL, -- description, services
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- Create policies for social_media_links
CREATE POLICY "Allow public read access to social_media_links" ON public.social_media_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to social_media_links" ON public.social_media_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policies for contact_info
CREATE POLICY "Allow public read access to contact_info" ON public.contact_info
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to contact_info" ON public.contact_info
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policies for footer_content
CREATE POLICY "Allow public read access to footer_content" ON public.footer_content
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to footer_content" ON public.footer_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default social media links
INSERT INTO public.social_media_links (platform, name, url, icon, display_order) VALUES
('instagram', 'Instagram', '#', 'instagram', 1),
('facebook', 'Facebook', '#', 'facebook', 2),
('tiktok', 'TikTok', '#', 'tiktok', 3),
('youtube', 'YouTube', '#', 'youtube', 4);

-- Insert default contact info
INSERT INTO public.contact_info (type, label, value, formatted_value) VALUES
('email', 'Email', 'servisoo.dev@gmail.com', 'servisoo.dev@gmail.com'),
('phone', 'Phone', '+6282336548080', '+62 823-3654-8080'),
('whatsapp', 'WhatsApp', '+6285808675233', '+62 858-0867-5233'),
('address', 'Alamat', 'Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318', 'Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318');

-- Insert default footer content
INSERT INTO public.footer_content (section, content) VALUES
('description', 'Platform digital terdepan untuk renovasi rumah dan gedung. Dapatkan estimasi biaya yang akurat dan transparan untuk proyek impian Anda.'),
('services', '["Renovasi Rumah", "Pembangunan Gedung", "Desain & Perencanaan", "Konsultasi RAB"]');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_social_media_links
    BEFORE UPDATE ON public.social_media_links
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_contact_info
    BEFORE UPDATE ON public.contact_info
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_footer_content
    BEFORE UPDATE ON public.footer_content
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();