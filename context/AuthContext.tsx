// context/AuthContext.tsx 

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
// REMOVED: import { getUser } from '../lib/rtdb'; 
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

// REMOVED: type DatabaseService = any;
// REMOVED: fetchUserWithRetry function

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {}, 
  logout: async () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // We no longer require 'database' in the dependency list for core auth flow
  const { auth, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    // Only check for the auth service now
    if (!auth) {
      throw new Error('Firebase Auth service not available during login.');
    }
    setLoading(true); 
    try {
      if (typeof (auth as any).signInWithEmailAndPassword === 'function') {
        await (auth as any).signInWithEmailAndPassword(email, password);
      } else {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Ensure loading stops if login fails
      setLoading(false); 
      throw error; 
    }
  }, [auth]); // Dependency array updated

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

    // Only check for the auth instance now
    if (!auth) {
      setLoading(false);
      console.error('Firebase Auth service not available after being marked ready.');
      return;
    }

    let isMounted = true;
    let subscriber: () => void;

    const handleAuthStateChange = async (firebaseUser: any | null) => {
      try {
        if (!isMounted) return;
        
        if (firebaseUser) {
          // User is authenticated. We can create a basic User object 
          // without trying to fetch data from the non-existent RTDB.
          const basicUser: User = { 
              uid: firebaseUser.uid, 
              email: firebaseUser.email,
              // Add other necessary properties from firebaseUser object here
           };
          if (isMounted) setUser(basicUser);

        } else {
          // User is logged out
          await AsyncStorage.removeItem('user');
          if (isMounted) setUser(null);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
            setLoading(false); 
            console.log("handleAuthStateChange FINISHED. Loading set to false."); 
        }
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
  }, [auth, firebaseIsReady]); // Dependency array updated

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
