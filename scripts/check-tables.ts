import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tkqvozgorpapofejphyn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3MzY5MywiZXhwIjoyMDcxNjQ5NjkzfQ.KjF1-VQ38J8mlVjwOxW8_zGXoHhGCWu8wLNhx08-EXw";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Checking available tables...\n');
  
  // Try different table names
  const tableNames = [
    'user_profiles',
    'user_profile',
    'profiles',
    'users',
    'user_profiles_backup'
  ];
  
  for (const tableName of tableNames) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ ${tableName} - EXISTS`);
        
        if (data && data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}\n`);
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }
}

checkTables();
