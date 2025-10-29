// context/AuthProvider.tsx
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useFirebase } from './FirebaseContext';

// Define the shape of our authentication context
interface AuthContextProps {
  isLoggedIn: boolean;
  loading: boolean;
  user: FirebaseAuthTypes.User | null;
  // Add other auth functions here, like login, logout
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  loading: true,
  user: null,
});

// Create a hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// The provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, isReady: firebaseIsReady } = useFirebase();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only proceed once Firebase is ready and the auth service is available.
    if (!firebaseIsReady || !auth) {
      return;
    }

    // Subscribe to auth state changes.
    const subscriber = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Unsubscribe from listener when the component unmounts.
    return subscriber;
  }, [auth, firebaseIsReady]);

  const isLoggedIn = !!user;

  // Memoize the value object to prevent unnecessary re-renders of consumers.
  const value = useMemo(() => ({
    isLoggedIn,
    loading,
    user,
    // Add other auth functions here
  }), [isLoggedIn, loading, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
