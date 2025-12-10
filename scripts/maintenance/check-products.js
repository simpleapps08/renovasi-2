import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('\n📊 Current products and categories:');
    console.log('Total products:', data?.length || 0);
    
    if (data && data.length > 0) {
      const categories = [...new Set(data.map(p => p.category))];
      console.log('\n🏷️ Unique categories found:');
      categories.forEach(cat => console.log('- ' + cat));
      
      console.log('\n🧱 Products with "material" category:');
      const materialProducts = data.filter(p => p.category === 'material');
      if (materialProducts.length > 0) {
        materialProducts.forEach(p => {
          console.log('- ' + p.name + ' (ID: ' + p.id + ')');
        });
      } else {
        console.log('No products found with "material" category');
      }
    } else {
      console.log('No products found in database');
    }
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

checkProducts();