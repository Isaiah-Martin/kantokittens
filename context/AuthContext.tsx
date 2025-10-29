// context/AuthProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { getUser } from '../lib/firestore'; // Assuming secureLogin is passed correctly
import { AuthContextType, User } from '../navigation/types';
import { useFirebase } from './FirebaseContext';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isReady: firebaseIsReady } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!auth || !firestore) {
        throw new Error("Firebase services not available during login.");
      }
      // Assuming secureLogin is a function that performs the login and returns the user
      // secureLogin was removed from your imports, so you must pass it to AuthProvider if it's used elsewhere
      // This example uses the modular auth service directly
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
  };

  const logout = async () => {
    try {
      if (!auth) {
        throw new Error("Auth service not available during logout.");
      }
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isLoggedIn: !!user,
  }), [user, loading, login, logout]);

  useEffect(() => {
    if (!firebaseIsReady || !auth || !firestore) {
      return;
    }

    const subscriber = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthTypes.User | null) => {
      if (firebaseUser) {
        // Fetch user data from Firestore for logged-in user
        const userData = await getUser(firestore, firebaseUser.uid);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // SET LOADING FALSE *AFTER* THE ASYNC CHECK IS COMPLETE
    });

    return () => subscriber(); // Return the unsubscriber function
  }, [auth, firebaseIsReady, firestore]);

  // Handle the initial loading state correctly
  if (loading) {
    return null; // Return null to prevent rendering until auth state is confirmed
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
