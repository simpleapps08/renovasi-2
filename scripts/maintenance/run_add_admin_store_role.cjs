const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

async function addAdminStoreRole() {
  try {
    console.log('🔄 Menambahkan role admin_store ke database...')
    
    // Update satu user menjadi admin_store untuk testing
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

addAdminStoreRole()