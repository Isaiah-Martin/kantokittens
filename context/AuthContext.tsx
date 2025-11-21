import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
// Import the specific types needed for assertion
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUser } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';
// Import the web Auth type for context consistency
import type { Auth } from 'firebase/auth';


// Function to safely fetch user data with retry logic
// This function expects the *native* firestore module explicitly as defined in its original signature
const fetchUserWithRetry = async (firestore: FirebaseFirestoreTypes.Module, uid: string): Promise<User | null> => {
  let userData: User | null = null;
  let retries = 5;
  while (retries > 0) {
    try {
      // Ensure getUser is typed correctly to return User | null
      userData = await getUser(firestore, uid); 
      return userData; // Success, break out of loop
    } catch (error: any) {
      if (error.code === 'firestore/unavailable' && retries > 1) {
        console.warn(`Firestore unavailable, retrying... (${retries - 1} left)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (6 - retries))); // Exponential backoff
        retries--;
      } else {
        throw error; // Re-throw if it's a different error or no retries left
      }
    }
  }
  return null; // Return null if all retries fail
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {}, // Correctly typed placeholder
  logout: async () => {}, // Correctly typed placeholder
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // auth and firestore are union types (Web | Native)
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize login and logout with useCallback for stable function identities
  const login = useCallback(async (email: string, password: string) => {
    if (!auth || !firestore) {
      throw new Error('Firebase services not available during login.');
    }
    try {
      // Compatibility logic handles the type internally, so this part is fine.
      if (typeof (auth as any).signInWithEmailAndPassword === 'function') {
        await (auth as any).signInWithEmailAndPassword(email, password);
      } else {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth as Auth, email, password);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  }, [auth, firestore]);

  const logout = useCallback(async () => {
    if (!auth) {
        throw new Error('Auth service not available during logout.');
    }
    try {
      // We assume this function is compatible with both web/native for signOut
      await auth.signOut(); 
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [auth]);

  // The main effect handles all auth state changes from login, logout, and app start
  useEffect(() => {
    if (!firebaseIsReady) {
      return;
    }

    if (!auth || !firestore) {
      setLoading(false);
      console.error('Firebase services not available after being marked ready.');
      return;
    }

    let isMounted = true;

    // ERROR 1 FIX: The 'onAuthStateChanged' import from @react-native-firebase/auth 
    // expects the native module type. We use a type assertion here.
    const subscriber = onAuthStateChanged(
      auth as FirebaseAuthTypes.Module, // Assertion applied here
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
      try {
        if (!isMounted) return;

        if (firebaseUser) {
          // ERROR 2 FIX: The 'fetchUserWithRetry' function expects the native firestore module.
          const userData = await fetchUserWithRetry(
            firestore as FirebaseFirestoreTypes.Module, // Assertion applied here
            firebaseUser.uid
          ); 
          if (isMounted) {
            setUser(userData || null);
          }
        } else {
          await AsyncStorage.removeItem('user');
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false); 
        }
      }
    });

    return () => {
      isMounted = false;
      subscriber();
    };
  }, [auth, firebaseIsReady, firestore]);

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
