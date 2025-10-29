import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getUser } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Added log to track the Provider's lifecycle and current loading state
  console.log('AuthProvider rendered. Loading:', loading);
  
  const login = useMemo(() => async (email: string, password: string) => {
    setLoading(true);
    console.log('Attempting login...');
    try {
      if (!auth || !firestore) {
        throw new Error('Firebase services not available during login.');
      }
      const authResult = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = authResult.user;
      if (firebaseUser) {
        console.log('Login successful. Fetching user data...');
        const userDocRef = firestore.collection('users').doc(firebaseUser.uid);
        await userDocRef.update({ logintime: Date.now() });
        const userData = await getUser(firestore, firebaseUser.uid);
        if (userData) {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
      console.log('Login attempt finished. Loading set to false.');
    }
  }, [auth, firestore]);

  const logout = useMemo(() => async () => {
    try {
      if (!auth) {
        throw new Error('Auth service not available during logout.');
      }
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('Logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [auth]);

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

  useEffect(() => {
    console.log('useEffect triggered. Checking firebase readiness...');
    if (!firebaseIsReady) {
      console.log('Firebase not ready yet. Exiting useEffect.');
      return;
    }

    if (!auth || !firestore) {
      setLoading(false);
      console.error('Firebase services not available after being marked ready.');
      return;
    }

    const subscriber = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthTypes.User | null) => {
      console.log('onAuthStateChanged triggered. User:', firebaseUser ? 'exists' : 'null');
      if (firebaseUser) {
        console.log('User found:', firebaseUser.uid);
        const userData = await getUser(firestore, firebaseUser.uid);
        if (userData) {
          setUser(userData);
          console.log('User data loaded:', userData);
        } else {
          console.log('No user data found in Firestore.');
        }
      } else {
        setUser(null);
        console.log('No user logged in.');
      }
      setLoading(false);
      console.log('onAuthStateChanged listener finished. Loading set to false.');
    });

    return () => {
      console.log('Cleaning up auth state listener.');
      subscriber();
    };
  }, [auth, firebaseIsReady, firestore]);

  console.log('Rendering AuthProvider. Current loading state:', loading);
  if (loading) {
    console.log('Rendering loading screen with simple View.');
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }
  
  console.log('Authentication check complete. Rendering children.');
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const useAuth = () => useContext(AuthContext);
