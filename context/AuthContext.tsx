import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUser } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

// Function to safely fetch user data with retry logic
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
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize login and logout with useCallback for stable function identities
  const login = useCallback(async (email: string, password: string) => {
    // setLoading(true); // Handled by the useEffect hook that observes auth state
    try {
      if (!auth || !firestore) {
        throw new Error('Firebase services not available during login.');
      }
      const authResult = await auth.signInWithEmailAndPassword(email, password);
      // The onAuthStateChanged listener in useEffect will pick up the user change
      // and handle fetching userData and setting global state.
    } catch (error) {
      console.error('Login failed:', error);
      // setLoading(false); // Handled by the useEffect hook that observes auth state
      throw error; // Re-throw so the Login screen can display specific errors
    }
  }, [auth, firestore]);

  const logout = useCallback(async () => {
    try {
      if (!auth) {
        throw new Error('Auth service not available during logout.');
      }
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      // The onAuthStateChanged listener in useEffect will pick up the user change (null)
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
    const subscriber = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthTypes.User | null) => {
      try {
        if (!isMounted) return;

        if (firebaseUser) {
          // Pass firestore explicitly to the external function
          const userData = await fetchUserWithRetry(firestore, firebaseUser.uid); 
          if (isMounted) {
            setUser(userData || null);
          }
        } else {
          // User is signed out
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
          setLoading(false); // Authentication state has been determined (logged in or out)
        }
      }
    });

    return () => {
      isMounted = false;
      subscriber();
    };
  }, [auth, firebaseIsReady, firestore]); // Depend on services and ready state

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);