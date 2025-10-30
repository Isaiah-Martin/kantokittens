import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; // Import the FirebaseFirestoreTypes
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

  // Function to safely fetch user data with retry logic
  // Now includes a null check for firestore
  const fetchUserWithRetry = async (firestore: FirebaseFirestoreTypes.Module, uid: string) => {
    let userData = null;
    let retries = 5;
    while (retries > 0) {
      try {
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
        const userData = await fetchUserWithRetry(firestore, firebaseUser.uid); // Pass firestore explicitly
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
  }, [auth, firestore, fetchUserWithRetry]); // Add fetchUserWithRetry to dependency array

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
        if (!isMounted) return;

        if (firebaseUser) {
          const userData = await fetchUserWithRetry(firestore, firebaseUser.uid); // Pass firestore explicitly
          if (isMounted) {
            setUser(userData || null);
          }
        } else {
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
  }, [auth, firebaseIsReady, firestore, fetchUserWithRetry]); // Add fetchUserWithRetry to dependency array

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
