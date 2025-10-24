import { secureLogin } from '@/lib/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../lib/firebase';
import { User, UserContextType } from '../lib/types'; // Adjust path if needed

// Define the AuthContext
export const AuthContext = createContext<UserContextType | null>(null);

// Custom hook for easier access and null-checking
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await secureLogin(email, password); // Call the secure login logic
      if (userData && userData.uid) {
        // Update Firestore document with new login time
        const userDocRef = doc(db, 'users', userData.uid);
        await updateDoc(userDocRef, { logintime: Date.now() });

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Rethrow the error for component to handle
    } finally {
      setLoading(false);
    }
  };

  // Define the logout function
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value to prevent re-renders
  const value = useMemo(() => ({
    isLoggedIn: !!user,
    user,
    login,
    logout,
    loading,
  }), [user, loading]);

  // Handle initial user loading
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setLoading(false);
         }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};