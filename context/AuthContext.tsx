// context/AuthContext.tsx (Strict Platform Isolation & TypeScript Fix)

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { getUser } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

// Use a generic 'any' type bridge to prevent TypeScript errors across platforms
type FirebaseService = any;


// Update fetchUserWithRetry to accept the generic type
const fetchUserWithRetry = async (
  firestore: FirebaseService, 
  uid: string
): Promise<User | null> => {
  let userData: User | null = null;
  let retries = 5;
  while (retries > 0) {
    try {
      // getUser should handle whatever object type it receives
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
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
});

// FIX APPLIED HERE: Corrected props type definition
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // auth and firestore are now fully generic types from FirebaseContext
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    if (!auth || !firestore) {
      throw new Error('Firebase services not available during login.');
    }
    try {
      // Compatibility logic relies on dynamic imports and typeof checks
      if (typeof (auth as any).signInWithEmailAndPassword === 'function') {
        await (auth as any).signInWithEmailAndPassword(email, password);
      } else {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
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
      // signOut is compatible across web and native modular APIs
      await auth.signOut(); 
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
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

    // --- PLATFORM-SPECIFIC AUTH STATE LISTENER USING DYNAMIC IMPORTS ---

    if (Platform.OS === 'web') {
      // Use the web modular onAuthStateChanged function
      const { onAuthStateChanged: onAuthStateChangedWeb } = require('firebase/auth');
      
      subscriber = onAuthStateChangedWeb(auth, async (firebaseUser: any) => {
        if (!isMounted) return;
        if (firebaseUser) {
          const userData = await fetchUserWithRetry(firestore, firebaseUser.uid); 
          if (isMounted) setUser(userData || null);
        } else {
          await AsyncStorage.removeItem('user');
          if (isMounted) setUser(null);
        }
        if (isMounted) setLoading(false);
      });
    } else {
      // Use dynamic import for the NATIVE @react-native-firebase/auth function
      const { onAuthStateChanged: onAuthStateChangedNative } = require('@react-native-firebase/auth');

      subscriber = onAuthStateChangedNative(
        auth, 
        async (firebaseUser: any | null) => { 
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
          if (isMounted) setLoading(false); 
        }
      });
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
