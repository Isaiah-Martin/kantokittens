import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes, onAuthStateChanged } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { getUser, secureLogin } from '../lib/firestore';
import { AuthContextType, User } from '../navigation/types'; // Import from centralized types file

// Create the context with a default value that matches the type
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await secureLogin(email, password);
      if (userData && userData.uid) {
        // Update Firestore document with new login time
        const userDocRef = firestore().collection('users').doc(userData.uid);
        await userDocRef.update({ logintime: Date.now() });

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
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
    // Subscriber to handle authentication state changes
    const subscriber = onAuthStateChanged(auth(), async (firebaseUser: FirebaseAuthTypes.User | null) => {
      if (firebaseUser) {
        const userData = await getUser(firestore(), firebaseUser.uid);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return subscriber;
  }, []); // auth and firestore are not needed in dependencies as they are imported directly

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
