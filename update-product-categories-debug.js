import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkqvozgorpapofejphyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAndUpdateCategories() {
  try {
    console.log('🔍 Debug: Checking products and permissions...');
    
    // Check current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user?.user?.id || 'Not authenticated');
    
    // Get all products with detailed info
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`\n📊 Total products found: ${allProducts?.length || 0}`);
    
    if (allProducts && allProducts.length > 0) {
      console.log('\n📋 All products:');
      allProducts.forEach(product => {
        console.log(`- ${product.name} | Category: ${product.category} | Store ID: ${product.store_id} | Active: ${product.is_active}`);
      });
      
      // Try updating each product individually
      console.log('\n🔄 Attempting to update each product individually...');
      
      for (const product of allProducts) {
        if (product.category === 'material') {
          console.log(`\n🔄 Updating product: ${product.name} (ID: ${product.id})`);
          
          const { data: updateResult, error: updateError } = await supabase
            .from('products')
            .update({ 
              category: 'material-bangunan-dasar',
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id)
            .select();
          
          if (updateError) {
            console.error(`❌ Error updating ${product.name}:`, updateError);
          } else {
            console.log(`✅ Successfully updated ${product.name}`);
            console.log('Update result:', updateResult);
          }
        }
      }
    }
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('products')
      .select('id, name, category')
      .order('created_at', { ascending: false });
    
    if (finalError) {
      console.error('❌ Error in final check:', finalError);
      return;
    }
    
    console.log('\n📋 Final product categories:');
    finalCheck?.forEach(product => {
      console.log(`- ${product.name}: ${product.category}`);
    });
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

debugAndUpdateCategories();