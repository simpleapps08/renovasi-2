import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface Profile {
  id: string
  full_name: string
  role_id: string
  created_at?: string
  updated_at?: string
  user_roles?: {
    name: string
    level: number
  }
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select(`
                *,
                user_roles!inner(name, level)
              `)
              .eq('id', session.user.id)
              .single()
            
            setProfile(profileData)
          }, 0)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        supabase
          .from('user_profiles')
          .select(`
            *,
            user_roles!inner(name, level)
          `)
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setProfile(profileData)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      // Clear local storage first as a precaution
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
      
      // Attempt Supabase logout with local scope to avoid network issues
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      })
      
      if (error) {
        console.warn('Supabase logout error:', error)
        // Continue with local cleanup even if remote logout fails
      }
      
      // Always clear local state regardless of remote logout result
      setUser(null)
      setSession(null)
      setProfile(null)
      
    } catch (error) {
      console.error('Logout error:', error)
      // Force local cleanup on any error
      localStorage.clear()
      sessionStorage.clear()
      setUser(null)
      setSession(null)
      setProfile(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}