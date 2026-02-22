import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { clearAllAuthStorage } from '@/lib/sessionCleanup';

// Define the Profile interface based on your database schema
interface Profile {
  id: string;
  user_id: string;
  nama: string;
  lokasi?: string | null;
  role?: string;
  saldo_deposit?: number | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ BEST PRACTICE #1: Setup auth state listener FIRST
  // Per Supabase docs: Subscribe to state changes, quick callbacks only
  useEffect(() => {
    let mounted = true;
    console.log('🔐 Setting up auth state listener...');

    // Quick callback - NO async operations here per Supabase docs
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event, '| User:', session?.user?.email || 'none');
      
      if (!mounted) return;

      // Set state synchronously (fast)
      setSession(session);
      setUser(session?.user ?? null);

      // ✅ CRITICAL FIX: Turn off loading on EVERY auth event (including SIGNED_OUT)
      // This prevents infinite loading spinner after logout
      setLoading(false);

      // ✅ Clear profile when user signs out
      if (!session?.user) {
        setProfile(null);
      }
      // Profile will be fetched by separate effect if session exists
    });

    return () => {
      mounted = false;
      try {
        authListener?.subscription?.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing from auth listener:', e);
      }
    };
  }, []);

  // ✅ BEST PRACTICE #2: Initial session check - separate effect
  // Per Supabase docs: Check initial session from storage
  useEffect(() => {
    let mounted = true;
    console.log('🔍 Checking initial session...');

    (async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          if (initialSession) {
            console.log('✅ Initial session found:', initialSession.user.email);
            setSession(initialSession);
            setUser(initialSession.user);
            // Profile will be fetched by separate effect
          } else {
            console.log('ℹ️ No initial session found');
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          // Always turn off loading after initial check
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Exception during session check:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ BEST PRACTICE #3: Profile fetch as SEPARATE effect
  // Per Supabase docs: Async operations should be deferred outside of auth callbacks
  // Triggers when session changes
  useEffect(() => {
    let mounted = true;

    if (!session?.user) {
      // No session = no profile
      if (mounted) setProfile(null);
      return;
    }

    console.log('👤 Fetching profile for user:', session.user.id);

    (async () => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (mounted) {
          if (error) {
            // PGRST116 = "not found" (user has no profile yet)
            if (error.code === 'PGRST116') {
              console.log('ℹ️ User profile not found, creating one...');
              try {
                // Try to create profile on demand
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert([
                    { 
                      user_id: session.user.id, 
                      email: session.user.email,
                      full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.nama || session.user.email?.split('@')[0] || 'User',
                      role: 'user',
                      address: session.user.user_metadata?.address || session.user.user_metadata?.lokasi || 'Indonesia'
                    }
                  ])
                  .select()
                  .single();

                if (createError) {
                  console.error('❌ Failed to create profile on demand:', createError.message);
                  setProfile(null);
                } else {
                  console.log('✅ Profile created on demand:', newProfile.full_name);
                  setProfile({
                    id: newProfile.id,
                    user_id: newProfile.user_id,
                    nama: newProfile.full_name || newProfile.nama || '',
                    role: newProfile.role,
                    lokasi: newProfile.address || newProfile.location || '',
                    saldo_deposit: newProfile.saldo_deposit,
                    created_at: newProfile.created_at,
                    updated_at: newProfile.updated_at,
                  } as Profile);
                }
              } catch (createErr) {
                console.error('❌ Exception creating profile:', createErr);
                setProfile(null);
              }
            } else {
              console.warn('⚠️ Profile fetch error:', error.message);
              setProfile(null);
            }
          } else if (profileData) {
            console.log('✅ Profile loaded:', profileData.nama);
            setProfile({
              id: profileData.id,
              user_id: profileData.user_id,
              nama: profileData.full_name || session.user.email?.split('@')[0] || '',
              role: profileData.role,
              lokasi: profileData.address,
              saldo_deposit: profileData.saldo_deposit,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
            } as Profile);
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('❌ Exception fetching profile:', err);
        if (mounted) setProfile(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const signOut = async () => {
    console.log('🔑 Starting logout process...');
    
    // ✅ CRITICAL: Reset React state IMMEDIATELY to stop loading spinner
    // This ensures UI updates even if Supabase calls hang
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false); // ✅ This is the critical fix for infinite loading
    
    // Server-side logout (best effort - errors don't block UI update)
    try {
      console.log('📡 Calling supabase.auth.signOut()...');
      await supabase.auth.signOut();
      console.log('✅ Supabase signOut completed');
    } catch (e) {
      console.error('⚠️ Error during supabase signOut:', e);
      // Continue anyway - UI is already updated
    }

    // Client-side storage cleanup (best effort)
    try {
      console.log('🧹 Clearing auth storage...');
      clearAllAuthStorage();
      console.log('✅ Auth storage cleared');
    } catch (e) {
      console.error('⚠️ Error during storage cleanup:', e);
      // Continue anyway
    }
    
    console.log('✅ Logout complete - state reset and storage cleared');
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}