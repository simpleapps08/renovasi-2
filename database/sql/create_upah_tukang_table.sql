-- Create upah_tukang table for worker wages management
CREATE TABLE IF NOT EXISTS upah_tukang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_pekerjaan VARCHAR(255) NOT NULL,
    upah_per_hari DECIMAL(12,2),
    upah_per_jam DECIMAL(12,2),
    satuan VARCHAR(50) NOT NULL DEFAULT 'hari',
    kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_upah_tukang_kategori ON upah_tukang(kategori);
CREATE INDEX IF NOT EXISTS idx_upah_tukang_is_active ON upah_tukang(is_active);
CREATE INDEX IF NOT EXISTS idx_upah_tukang_nama_pekerjaan ON upah_tukang(nama_pekerjaan);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_upah_tukang_updated_at 
    BEFORE UPDATE ON upah_tukang 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO upah_tukang (nama_pekerjaan, upah_per_hari, upah_per_jam, satuan, kategori, deskripsi) VALUES
('Tukang Batu', 150000, 20000, 'hari', 'Struktur', 'Tukang ahli untuk pekerjaan batu dan semen'),
('Tukang Kayu', 180000, 25000, 'hari', 'Struktur', 'Tukang ahli untuk pekerjaan kayu dan furniture'),
('Tukang Cat', 120000, 15000, 'hari', 'Finishing', 'Tukang ahli untuk pekerjaan pengecatan'),
('Tukang Listrik', 200000, 30000, 'hari', 'MEP', 'Tukang ahli untuk instalasi listrik'),
('Tukang Pipa', 180000, 25000, 'hari', 'MEP', 'Tukang ahli untuk instalasi pipa dan plumbing'),
('Tukang Keramik', 160000, 22000, 'hari', 'Finishing', 'Tukang ahli untuk pemasangan keramik dan tile'),
('Tukang Las', 220000, 35000, 'hari', 'Struktur', 'Tukang ahli untuk pekerjaan pengelasan'),
('Tukang Gypsum', 140000, 18000, 'hari', 'Finishing', 'Tukang ahli untuk pemasangan gypsum dan plafon'),
('Mandor', 250000, 35000, 'hari', 'Manajemen', 'Pengawas dan koordinator pekerjaan'),
('Helper/Kuli', 100000, 12000, 'hari', 'Umum', 'Pekerja pembantu untuk berbagai pekerjaan');

-- Enable RLS (Row Level Security)
ALTER TABLE upah_tukang ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated users to view upah_tukang" ON upah_tukang
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert upah_tukang" ON upah_tukang
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update upah_tukang" ON upah_tukang
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete upah_tukang" ON upah_tukang
    FOR DELETE USING (auth.role() = 'authenticated');