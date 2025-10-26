import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { auth, firestore } from '../lib/firebase';
import { secureLogin } from '../lib/firestore'; // Assuming secureLogin is in its own file
import { User, UserContextType } from '../navigation/RootStackParamList';

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
      const userData = await secureLogin(email, password); // Your updated secureLogin from the previous step
      if (userData && userData.uid) {
        // Update Firestore document with new login time
        const userDocRef = firestore().collection('users').doc(userData.uid);
        await userDocRef.update({ logintime: Date.now() });

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
    try {
        await auth().signOut();
        await AsyncStorage.removeItem('user');
        setUser(null);
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  // Memoize the context value
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isLoggedIn: !!user, 
  }), [user, loading]);

  // Handle initial user loading (on app start)
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

  const subscriber = auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      // Ensure email is a string, providing a fallback for the null case
      const email = firebaseUser.email ?? '';
      setUser({ ...user, uid: firebaseUser.uid, email: email });
    } else {
      setUser(null);
    }
    setLoading(false);
  });

    return subscriber; // Unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
