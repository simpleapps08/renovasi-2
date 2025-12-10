import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Define the Profile interface based on your database schema
interface Profile {
  id: string;
  nama?: string;
  role?: string;
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
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (mounted) {
          setProfile(profileData as Profile | null);
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

            // Fetch profile for initial session
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (mounted) {
              setProfile(profileData as Profile | null);
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
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
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