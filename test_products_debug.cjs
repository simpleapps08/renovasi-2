const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductsDatabase() {
  console.log('🔍 Testing products database connection...');
  console.log('📍 Supabase URL:', supabaseUrl);
  
  try {
    // Test 1: Check if products table exists and get all products
    console.log('\n📊 Test 1: Getting all products from database...');
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*');
    
    if (allError) {
      console.error('❌ Error fetching all products:', allError);
    } else {
      console.log('✅ All products found:', allProducts?.length || 0);
      if (allProducts && allProducts.length > 0) {
        console.log('📦 Sample product:', JSON.stringify(allProducts[0], null, 2));
      }
    }

    // Test 2: Check active products only
    console.log('\n📊 Test 2: Getting active products only...');
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (activeError) {
      console.error('❌ Error fetching active products:', activeError);
    } else {
      console.log('✅ Active products found:', activeProducts?.length || 0);
      if (activeProducts && activeProducts.length > 0) {
        activeProducts.forEach((product, index) => {
          console.log(`📦 Product ${index + 1}:`, {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            is_active: product.is_active,
            store_id: product.store_id
          });
        });
      }
    }

    // Test 3: Check table structure
    console.log('\n📊 Test 3: Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error checking table structure:', tableError);
    } else if (tableInfo && tableInfo.length > 0) {
      console.log('✅ Table columns:', Object.keys(tableInfo[0]));
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testProductsDatabase();