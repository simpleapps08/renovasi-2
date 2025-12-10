-- Create products table for store management
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    store_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Store owners can manage their own products
CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (
        auth.uid() = store_id
    );

-- Public can view active products
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories (optional)
INSERT INTO products (name, description, price, category, stock, store_id, image_url) VALUES
('Contoh Produk 1', 'Deskripsi produk contoh', 100000, 'Elektronik', 10, (SELECT id FROM auth.users LIMIT 1), 'https://via.placeholder.com/300x300'),
('Contoh Produk 2', 'Deskripsi produk contoh 2', 250000, 'Fashion', 5, (SELECT id FROM auth.users LIMIT 1), 'https://via.placeholder.com/300x300')
ON CONFLICT DO NOTHING;