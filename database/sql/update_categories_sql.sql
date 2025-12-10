-- Update product categories from 'material' to 'material-bangunan-dasar'
-- Run this in Supabase Dashboard > SQL Editor

-- First, check current products with 'material' category
SELECT 
    id, 
    name, 
    category, 
    store_id,
    created_at
FROM products 
WHERE category = 'material'
ORDER BY created_at DESC;

-- Update all products with 'material' category to 'material-bangunan-dasar'
UPDATE products 
SET 
    category = 'material-bangunan-dasar',
    updated_at = NOW()
WHERE category = 'material';

-- Verify the update
SELECT 
    id, 
    name, 
    category, 
    updated_at
FROM products 
WHERE category = 'material-bangunan-dasar'
ORDER BY updated_at DESC;

-- Check all unique categories after update
SELECT DISTINCT category 
FROM products 
ORDER BY category;