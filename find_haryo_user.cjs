require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.log('Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findHaryoUser() {
    console.log('🔍 MENCARI USER HARYO ABRIANTO');
    console.log('================================');
    console.log(`📊 Project: ${supabaseUrl.split('//')[1].split('.')[0]}`);
    console.log('');

    try {
        // 1. Cari di tabel profiles berdasarkan nama
        console.log('1️⃣ Mencari di tabel profiles berdasarkan nama...');
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .or('nama.ilike.%haryo%,full_name.ilike.%haryo%,email.ilike.%haryo%');

        if (profilesError) {
            console.log('⚠️  Error searching profiles:', profilesError.message);
        } else {
            console.log(`✅ Found ${profilesData.length} matching profiles:`);
            profilesData.forEach((profile, index) => {
                console.log(`   ${index + 1}. ID: ${profile.id}`);
                console.log(`      User ID: ${profile.user_id}`);
                console.log(`      Nama: ${profile.nama || 'N/A'}`);
                console.log(`      Full Name: ${profile.full_name || 'N/A'}`);
                console.log(`      Email: ${profile.email || 'N/A'}`);
                console.log(`      Role: ${profile.role || 'N/A'}`);
                console.log('');
            });
        }

        // 2. Cari di auth.users berdasarkan email yang mengandung haryo
        console.log('2️⃣ Mencari di auth.users berdasarkan email...');
        console.log('⚠️  Note: Using anon key, auth.admin functions may not be available');
        
        // Skip auth.admin.listUsers() since we don't have service role key
        console.log('   Skipping auth.users search (requires service role key)');
        console.log('');

        // 3. Cari semua users untuk manual review jika tidak ditemukan
        if (!profilesData || profilesData.length === 0) {
            console.log('3️⃣ Tidak ditemukan dengan nama "haryo", menampilkan semua profiles...');
            
            const { data: allProfiles, error: allProfilesError } = await supabase
                .from('profiles')
                .select('*')
                .limit(20);

            if (!allProfilesError && allProfiles) {
                console.log('📋 Semua profiles (20 teratas):');
                allProfiles.forEach((profile, index) => {
                    console.log(`   ${index + 1}. ${profile.nama || profile.full_name || 'No Name'} (${profile.email || 'No Email'})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

findHaryoUser();