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
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Do NOT set loading to true here, as it causes the entire app/router to unmount/remount
      // which triggers a reload loop. Only updating state is sufficient.

      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Fetch the user's profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        }
        setProfile(profileData as Profile | null);
      } else {
        setProfile(null);
      }

      // Ensure loading is false after any auth change completes (useful if it was the first load)
      setLoading(false);
    });

    // Initial check (Separate from listener to ensure immediate checking)
    // Note: onAuthStateChange usually fires INITIAL_SESSION automatically upon subscription
    // but explicit check is safer for hydration.
    /* 
       However, calling getSession() concurrently with the listener might cause race conditions
       if not handled carefully. But usually, we just want to ensure 'loading' turns off eventually.
    */

    // We can rely on onAuthStateChange for the logic, but we need to ensure local storage read finishes.
    // The previous implementation had a race where both might run. 
    // Let's simplify: set timeout fallback or just trust the listener, but explicit getSession is standard.
    // We will keep explicit getSession but purely to turn off loading if listener doesn't fire immediately.

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session, listener might fire SIGNED_OUT or nothing. 
        // We must ensure loading stops if there's no user.
        setLoading(false);
      }
      // If there is a session, the onAuthStateChange will handle the data fetching and setting loading=false.
    });

    return () => {
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