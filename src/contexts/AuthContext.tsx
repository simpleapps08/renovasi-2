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

  useEffect(() => {
    let mounted = true;

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth Event:", event, session?.user?.email);
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        // Always turn off loading on auth event
        setLoading(false);
      }

      if (session?.user && mounted) {
        // Try to fetch profile from user_profiles table
        try {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (mounted) {
            // Fallback to null if profile not found or error (not critical)
            if (error && error.code !== 'PGRST116') {
              console.warn('Profile fetch warning:', error.message);
            }
            setProfile(profileData ? {
              id: profileData.id,
              user_id: profileData.user_id,
              nama: profileData.full_name || session.user.email?.split('@')[0] || '',
              role: profileData.role,
              lokasi: profileData.address,
            } as Profile : null);
          }
        } catch (err) {
          console.warn('Error fetching profile:', err);
          if (mounted) setProfile(null);
        }
      } else if (mounted) {
        setProfile(null);
      }
    });

    // Initial check (Robust)
    // We check getSession to catch the case where no event fires (e.g. no change detected but initial state exists or is null)
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session) {
            setSession(session);
            setUser(session.user);

            // Try to fetch profile for initial session
            try {
              const { data: profileData, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (mounted) {
                if (error && error.code !== 'PGRST116') {
                  console.warn('Initial profile fetch warning:', error.message);
                }
                setProfile(profileData ? {
                  id: profileData.id,
                  user_id: profileData.user_id,
                  nama: profileData.full_name || session.user.email?.split('@')[0] || '',
                  role: profileData.role,
                  lokasi: profileData.address,
                } as Profile : null);
              }
            } catch (err) {
              console.warn('Error fetching initial profile:', err);
              if (mounted) setProfile(null);
            }
          }
          // Turn off loading regardless of outcome
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      // Defensive: only unsubscribe if subscription exists
      try {
        if (authListener && (authListener as any).subscription) {
          (authListener as any).subscription.unsubscribe();
        }
      } catch (e) {
        // swallow errors during cleanup
      }
    };
  }, []);

  const signOut = async () => {
    // Reset state BEFORE calling signOut to prevent race conditions
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    
    try {
      // Then call Supabase signOut
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error during supabase signOut:', e);
    }

    // Comprehensive cleanup of all persisted Supabase/session keys
    try {
      clearAllAuthStorage();
    } catch (e) {
      console.error('Error during storage cleanup:', e);
    }
    
    console.log('✅ Auth state reset: user logged out completely');
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