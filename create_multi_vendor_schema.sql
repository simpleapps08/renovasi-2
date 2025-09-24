-- Multi-Vendor Toko System Database Schema
-- This script creates tables for multi-vendor store management

-- 1. Stores table - untuk menyimpan informasi toko/supplier
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Store categories - kategori toko
CREATE TABLE IF NOT EXISTS store_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products table - untuk menyimpan produk dari berbagai toko
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    discount_price DECIMAL(15,2),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    sku VARCHAR(100),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    weight DECIMAL(10,3),
    dimensions JSONB, -- {length, width, height}
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_sold INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product variants table (untuk variasi produk seperti warna, ukuran)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Warna", "Ukuran"
    value VARCHAR(100) NOT NULL, -- e.g., "Merah", "L"
    price_adjustment DECIMAL(15,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Store reviews table
CREATE TABLE IF NOT EXISTS store_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[], -- array of image URLs
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Store followers table
CREATE TABLE IF NOT EXISTS store_followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, user_id)
);

-- 9. Store analytics table
CREATE TABLE IF NOT EXISTS store_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, date)
);

-- 10. Product analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    add_to_cart INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON stores(is_active);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_store_reviews_store_id ON store_reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_store_followers_store_id ON store_followers(store_id);
CREATE INDEX IF NOT EXISTS idx_store_followers_user_id ON store_followers(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_reviews_updated_at BEFORE UPDATE ON store_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default store categories
INSERT INTO store_categories (name, description, icon) VALUES
('Bahan Bangunan', 'Toko yang menjual bahan bangunan seperti semen, batu bata, dll', 'building'),
('Alat Konstruksi', 'Toko yang menyewakan atau menjual alat konstruksi', 'tools'),
('Cat & Finishing', 'Toko khusus cat dan bahan finishing', 'palette'),
('Kayu & Furniture', 'Toko kayu dan furniture untuk konstruksi', 'tree'),
('Listrik & Plumbing', 'Toko peralatan listrik dan plumbing', 'zap'),
('Keramik & Lantai', 'Toko khusus keramik dan material lantai', 'square')
ON CONFLICT (name) DO NOTHING;

-- Add RLS (Row Level Security) policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
CREATE POLICY "Users can view active stores" ON stores
    FOR SELECT USING (is_active = true);

CREATE POLICY "Store owners can manage their stores" ON stores
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all stores" ON stores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- RLS Policies for products
CREATE POLICY "Users can view active products from active stores" ON products
    FOR SELECT USING (
        is_active = true AND 
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.is_active = true
        )
    );

CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Similar policies for other tables...
-- (Additional policies can be added as needed)

COMMIT;