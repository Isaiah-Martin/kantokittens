import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
// Import ReactNode here
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native'; // Import UI components
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

// Correct the type definition for the props here
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the login function
  const login = useMemo(() => async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!auth || !firestore) {
        throw new Error('Firebase services not available during login.');
      }
      const authResult = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = authResult.user;
      if (firebaseUser) {
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
    }
  }, [auth, firestore]);

  // Memoize the logout function
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
    // `onAuthStateChanged` returns an unsubscribe function.
    const subscriber = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthTypes.User | null) => {
      console.log('onAuthStateChanged triggered. User:', firebaseUser ? 'exists' : 'null');
      if (firebaseUser) {
        const userData = await getUser(firestore, firebaseUser.uid);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // `useEffect` cleanup function. This will be called on component unmount
    return () => {
      subscriber();
    };
  }, [auth, firebaseIsReady, firestore]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
