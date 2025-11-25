// context/AuthContext.tsx (Revised for Realtime Database)

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
// CHANGE 1: Import from the new RTDB file
import { getUser } from '../lib/rtdb';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

// Use a generic 'any' type bridge to prevent TypeScript errors across platforms
// We expect a Database instance from the FirebaseContext now
type DatabaseService = any;


const fetchUserWithRetry = async (
  // CHANGE 2: Accept a Database instance
  database: DatabaseService, 
  uid: string
): Promise<User | null> => {
  let userData: User | null = null;
  let retries = 5;
  while (retries > 0) {
    try {
      // CHANGE 3: Pass the database instance to getUser
      userData = await getUser(database, uid); 
      return userData;
    } catch (error: any) {
      // CHANGE 4: Realtime DB errors don't use the 'firestore/unavailable' code
      // We check for general 'unavailable' or similar network issues
      if (error.message.includes('unavailable') && retries > 1) {
        console.warn(`Database unavailable, retrying... (${retries - 1} left)`);
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // CHANGE 5: Expect 'database' from FirebaseContext instead of 'firestore'
  const { auth, database, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    // CHANGE 6: Check for 'database' instead of 'firestore'
    if (!auth || !database) {
      throw new Error('Firebase services not available during login.');
    }
    setLoading(true); 
    try {
      // Auth logic remains the same (Firebase Auth is separate from DB)
      if (typeof (auth as any).signInWithEmailAndPassword === 'function') {
        await (auth as any).signInWithEmailAndPassword(email, password);
      } else {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false); 
      throw error; 
    }
  }, [auth, database]); // CHANGE 7: Update dependency array

  const logout = useCallback(async () => {
    if (!auth) {
        throw new Error('Auth service not available during logout.');
    }
    setLoading(true); 
    try {
      await auth.signOut(); 
      await AsyncStorage.removeItem('user');
      setLoading(false); 
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!firebaseIsReady) {
      return;
    }

    // CHANGE 8: Check for 'database' instance
    if (!auth || !database) {
      setLoading(false);
      console.error('Firebase services not available after being marked ready.');
      return;
    }

    let isMounted = true;
    let subscriber: () => void;

    const handleAuthStateChange = async (firebaseUser: any | null) => {
      try {
        if (!isMounted) return;
        if (firebaseUser) {
          // CHANGE 9: Pass the database instance to fetchUserWithRetry
          const userData = await fetchUserWithRetry(database, firebaseUser.uid); 
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
    };

    // ... (Platform-specific listener setup remains the same, it uses 'auth' only)
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
  }, [auth, firebaseIsReady, database]); // CHANGE 10: Update dependency array

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
