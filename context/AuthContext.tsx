import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
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

  const login = useMemo(() => async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!auth || !firestore) {
        throw new Error('Firebase services not available during login.');
      }
      const authResult = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = authResult.user;
      if (firebaseUser) {
        await firestore.collection('users').doc(firebaseUser.uid).update({ logintime: Date.now() });
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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [auth]);

  const value = useMemo(() => ({ user, loading, login, logout, isLoggedIn: !!user }), [user, loading, login, logout]);

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
        if (!isMounted) return; // Guard against updates on an unmounted component

        if (firebaseUser) {
          const userData = await getUser(firestore, firebaseUser.uid);
          if (isMounted) {
            setUser(userData || null);
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      isMounted = false; // Set to false on unmount
      subscriber();
    };
  }, [auth, firebaseIsReady, firestore]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
