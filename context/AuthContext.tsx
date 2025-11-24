// context/AuthContext.tsx (Minor Adjustments)

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { getUser } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

// Use a generic 'any' type bridge to prevent TypeScript errors across platforms
type FirebaseService = any;


const fetchUserWithRetry = async (
  firestore: FirebaseService, 
  uid: string
): Promise<User | null> => {
  let userData: User | null = null;
  let retries = 5;
  while (retries > 0) {
    try {
      userData = await getUser(firestore, uid); 
      return userData;
    } catch (error: any) {
      if (error.code === 'firestore/unavailable' && retries > 1) {
        console.warn(`Firestore unavailable, retrying... (${retries - 1} left)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (6 - retries)));
        retries--;
      } else {
        throw error;
      }
    }
  }
  return null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  // login is async void as it handles navigation internally via the listener
  login: async () => {}, 
  logout: async () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    if (!auth || !firestore) {
      throw new Error('Firebase services not available during login.');
    }
    // Set loading state here manually for immediate feedback in login.tsx
    // The useEffect listener will handle turning loading OFF later
    setLoading(true); 
    try {
      if (typeof (auth as any).signInWithEmailAndPassword === 'function') {
        await (auth as any).signInWithEmailAndPassword(email, password);
      } else {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
      }
      // If sign in is successful, the onAuthStateChanged listener handles the rest
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false); // Make sure loading is turned off on failure
      throw error; // Re-throw the error so login.tsx can catch and display it
    }
  }, [auth, firestore]);

  const logout = useCallback(async () => {
    if (!auth) {
        throw new Error('Auth service not available during logout.');
    }
    setLoading(true); // Indicate loading while signing out
    try {
      await auth.signOut(); 
      await AsyncStorage.removeItem('user');
      setLoading(false); // Loading is done
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  }, [auth]);

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
    let subscriber: () => void;

    // --- The rest of the useEffect logic remains unchanged as it's solid ---

    // Use a unified function reference since the implementation is identical
    const handleAuthStateChange = async (firebaseUser: any | null) => {
      try {
        if (!isMounted) return;
        if (firebaseUser) {
          const userData = await fetchUserWithRetry(firestore, firebaseUser.uid); 
          if (isMounted) setUser(userData || null);
        } else {
          await AsyncStorage.removeItem('user');
          if (isMounted) setUser(null);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        if (isMounted) setUser(null);
      } finally {
        // Ensure loading is set to false after the initial check/user fetch
        if (isMounted) setLoading(false); 
      }
    };


    if (Platform.OS === 'web') {
      const { onAuthStateChanged: onAuthStateChangedWeb } = require('firebase/auth');
      subscriber = onAuthStateChangedWeb(auth, handleAuthStateChange);
    } else {
      const { onAuthStateChanged: onAuthStateChangedNative } = require('@react-native-firebase/auth');
      subscriber = onAuthStateChangedNative(auth, handleAuthStateChange);
    }

    return () => {
      isMounted = false;
      if (subscriber) {
        subscriber();
      }
    };
  }, [auth, firebaseIsReady, firestore]);

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
