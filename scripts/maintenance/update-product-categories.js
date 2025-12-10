import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductCategories() {
  try {
    console.log('🔄 Updating product categories...');
    
    // First, check current products with 'material' category
    const { data: currentProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, category')
      .eq('category', 'material');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`\n📊 Found ${currentProducts?.length || 0} products with 'material' category`);
    
    if (currentProducts && currentProducts.length > 0) {
      console.log('\n🔄 Updating categories from "material" to "material-bangunan-dasar"...');
      
      // Update all products with 'material' category to 'material-bangunan-dasar'
      const { data: updatedProducts, error: updateError } = await supabase
        .from('products')
        .update({ 
          category: 'material-bangunan-dasar',
          updated_at: new Date().toISOString()
        })
        .eq('category', 'material')
        .select('id, name, category');
      
      if (updateError) {
        console.error('❌ Error updating products:', updateError);
        return;
      }
      
      console.log('✅ Successfully updated products:');
      updatedProducts?.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id}) → ${product.category}`);
      });
      
      console.log(`\n🎉 Total updated: ${updatedProducts?.length || 0} products`);
    } else {
      console.log('ℹ️ No products found with "material" category to update');
    }
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, category')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('❌ Error verifying:', verifyError);
      return;
    }
    
    const categories = [...new Set(verifyData?.map(p => p.category) || [])];
    console.log('\n📋 Current categories after update:');
    categories.forEach(cat => console.log('- ' + cat));
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

updateProductCategories();