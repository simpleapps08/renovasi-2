/**
 * Session Cleanup Utility
 * Handles comprehensive cleanup of Supabase session data from localStorage
 * to prevent stale session issues and infinite loading loops
 */

export const sessionCleanupKeys = [
  'supabase.auth.token',
  'supabase.session',
  'sb-tkqvozgorpapofejphyn-auth-token',
  'sb-tkqvozgorpapofejphyn-auth-session',
  'sb-auth-token',
  'sb-session',
  'sb-pkce-code-verifier',
];

/**
 * Clear all Supabase-related session keys from localStorage
 * Called on logout to prevent stale session data from causing login issues
 */
export const clearSupabaseSession = () => {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      // Clear Supabase-related keys
      if (/supabase|sb-|sb:|session|token/i.test(key)) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to remove localStorage key: ${key}`, e);
        }
      }
    }
    console.log('✅ Supabase session cleared from localStorage');
  } catch (e) {
    console.warn('⚠️ Could not clear localStorage (may be unavailable)', e);
  }
};

/**
 * Clear all sessionStorage as well (some auth libraries use this)
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    console.log('✅ Session storage cleared');
  } catch (e) {
    console.warn('⚠️ Could not clear sessionStorage', e);
  }
};

/**
 * Complete cleanup of all auth-related storage
 */
export const clearAllAuthStorage = () => {
  clearSupabaseSession();
  clearSessionStorage();
  
  // Clear IndexedDB if needed (some Supabase auth uses this)
  if (window.indexedDB) {
    try {
      indexedDB.deleteDatabase('supabase');
      console.log('✅ IndexedDB cleared');
    } catch (e) {
      console.warn('⚠️ Could not clear IndexedDB', e);
    }
  }
};

/**
 * Reset auth state in memory (React state should also be cleared)
 * This complements localStorage cleanup
 */
export const resetAuthState = () => {
  // Clear cached user data from any custom storage
  try {
    const authData = {
      user: null,
      session: null,
      profile: null,
    };
    // You can store this in context or custom state if needed
    return authData;
  } catch (e) {
    console.warn('⚠️ Could not reset auth state', e);
  }
};

