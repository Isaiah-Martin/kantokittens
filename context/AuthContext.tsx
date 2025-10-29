import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged } from '@react-native-firebase/auth'; // MODULAR import
import { getFirestore } from '@react-native-firebase/firestore'; // MODULAR import
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'; // Added useContext
import { getUser } from '../lib/firestore'; // Removed secureLogin as it will be called differently
import { AuthContextType, User } from '../navigation/types';
import { FirebaseContext } from './FirebaseContext'; // Import FirebaseContext and hook

// Define the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore, isReady: firebaseIsReady } = useContext(FirebaseContext); // USE THE CONTEXT
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Use modular API
      const authResult = await auth!.signInWithEmailAndPassword(email, password);
      const firebaseUser = authResult.user;

      if (firebaseUser) {
        const userDocRef = getFirestore(auth?.app).collection('users').doc(firebaseUser.uid);
        await userDocRef.update({ logintime: Date.now() });
        const userData = await getUser(firestore!, firebaseUser.uid);
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

  // Define the logout function
  const logout = async () => {
    try {
      await auth!.signOut();
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
  }), [user, loading, login, logout]);

  // Handle initial user loading (on app start)
  useEffect(() => {
    if (!firebaseIsReady || !auth || !firestore) {
        return;
    }
    // Subscriber to handle authentication state changes
    const subscriber = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthTypes.User | null) => {
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
    return subscriber;
  }, [auth, firebaseIsReady, firestore]);

  if (!firebaseIsReady) {
      return null; // Wait for Firebase to be ready before rendering AuthProvider's children
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
