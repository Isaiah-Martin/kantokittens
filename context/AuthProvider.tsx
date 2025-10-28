// context/AuthProvider.tsx
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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
    if (!firebaseIsReady || !auth) {
      // Firebase is not ready, or auth service is unavailable.
      // Continue loading and do not proceed with auth checks.
      return;
    }

    // Subscribe to auth state changes only after Firebase is ready
    const subscriber = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Unsubscribe from listener when the component unmounts
    return subscriber;
  }, [auth, firebaseIsReady]); // Re-run the effect if auth or firebaseIsReady changes

  const isLoggedIn = !!user;

  const value = {
    isLoggedIn,
    loading,
    user,
    // Add other auth functions to the value object
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
