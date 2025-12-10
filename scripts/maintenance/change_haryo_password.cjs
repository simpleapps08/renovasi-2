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

async function changeHaryoPassword() {
    console.log('🔐 MENGUBAH PASSWORD HARYO ABRIANTO');
    console.log('==================================');
    console.log(`📊 Project: ${supabaseUrl.split('//')[1].split('.')[0]}`);
    console.log('');

    const targetUserId = 'b14f6550-ccb6-4c31-afb0-b5eac039d0c2';
    const targetEmail = 'haryoabrianto220393@gmail.com';
    const newPassword = '12345678';

    try {
        console.log('1️⃣ Verifikasi user yang akan diubah passwordnya...');
        console.log(`   User ID: ${targetUserId}`);
        console.log(`   Email: ${targetEmail}`);
        console.log(`   New Password: ${newPassword}`);
        console.log('');

        // Coba update password menggunakan auth.admin.updateUserById
        console.log('2️⃣ Mencoba mengubah password...');
        console.log('⚠️  Note: Menggunakan anon key, mungkin tidak memiliki permission untuk admin functions');
        
        // Karena kita tidak punya service role key, kita akan mencoba beberapa pendekatan
        
        // Pendekatan 1: Coba dengan auth.admin (kemungkinan gagal)
        try {
            const { data, error } = await supabase.auth.admin.updateUserById(
                targetUserId,
                { password: newPassword }
            );

            if (error) {
                console.log('❌ Admin update failed:', error.message);
                console.log('   Reason: Likely insufficient permissions (need service role key)');
            } else {
                console.log('✅ Password berhasil diubah menggunakan admin function!');
                console.log('   User:', data.user?.email);
                return;
            }
        } catch (adminError) {
            console.log('❌ Admin function error:', adminError.message);
        }

        console.log('');
        console.log('3️⃣ Alternatif: Manual SQL update...');
        console.log('⚠️  Untuk mengubah password di auth.users, diperlukan:');
        console.log('   1. Service Role Key (bukan anon key)');
        console.log('   2. Atau akses langsung ke database Supabase');
        console.log('');
        console.log('📋 INSTRUKSI MANUAL:');
        console.log('1. Buka Supabase Dashboard');
        console.log('2. Pergi ke Authentication > Users');
        console.log(`3. Cari user dengan email: ${targetEmail}`);
        console.log('4. Klik "..." > "Reset Password"');
        console.log(`5. Set password baru: ${newPassword}`);
        console.log('');
        console.log('ATAU gunakan SQL Editor dengan query:');
        console.log(`UPDATE auth.users SET encrypted_password = crypt('${newPassword}', gen_salt('bf')) WHERE id = '${targetUserId}';`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

changeHaryoPassword();