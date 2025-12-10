const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function updateRoleConstraint() {
  try {
    console.log('🔄 Memperbarui constraint role di tabel profiles...')
    
    // Hapus constraint lama
    console.log('1. Menghapus constraint lama...')
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;'
    })
    
    if (dropError) {
      console.log('⚠️  Warning dropping constraint:', dropError.message)
    } else {
      console.log('✅ Constraint lama berhasil dihapus')
    }
    
    // Tambahkan constraint baru
    console.log('2. Menambahkan constraint baru...')
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
            CHECK (role IN ('user', 'admin', 'super_admin', 'admin_store'));`
    })
    
    if (addError) {
      console.error('❌ Error adding constraint:', addError)
      return
    }
    
    console.log('✅ Constraint baru berhasil ditambahkan')
    
    // Test dengan menambahkan role admin_store
    console.log('3. Testing dengan menambahkan role admin_store...')
    
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, nama, email')
      .eq('role', 'user')
      .limit(1)
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError)
      return
    }
    
    if (users && users.length > 0) {
      const userToUpdate = users[0]
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin_store',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userToUpdate.user_id)
      
      if (updateError) {
        console.error('❌ Error updating user role:', updateError)
        return
      }
      
      console.log(`✅ User ${userToUpdate.nama || userToUpdate.email || userToUpdate.user_id} berhasil diubah menjadi admin_store`)
    }
    
    // Verifikasi semua role yang ada
    const { data: roleStats, error: statsError } = await supabase
      .from('profiles')
      .select('role')
    
    if (statsError) {
      console.error('❌ Error fetching role stats:', statsError)
      return
    }
    
    const roleCounts = {}
    roleStats.forEach(profile => {
      roleCounts[profile.role] = (roleCounts[profile.role] || 0) + 1
    })
    
    console.log('\n📊 Role Statistics:')
    console.log('====================')
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`${role}: ${count} user(s)`)
    })
    
    console.log('\n✅ Proses selesai!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Alternatif jika RPC tidak tersedia, gunakan direct SQL execution
async function updateRoleConstraintDirect() {
  try {
    console.log('🔄 Mencoba metode alternatif...')
    
    // Langsung test update user ke admin_store
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, nama, email, role')
      .eq('role', 'user')
      .limit(1)
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError)
      return
    }
    
    if (users && users.length > 0) {
      console.log('⚠️  Constraint masih ada. Perlu diupdate melalui Supabase Dashboard.')
      console.log('Silakan buka Supabase Dashboard > SQL Editor dan jalankan:')
      console.log('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;')
      console.log("ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin', 'admin_store'));")
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Jalankan fungsi utama, jika gagal coba alternatif
updateRoleConstraint().catch(() => {
  console.log('\n🔄 Mencoba metode alternatif...')
  updateRoleConstraintDirect()
})