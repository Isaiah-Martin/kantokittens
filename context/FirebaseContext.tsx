// context/FirebaseContext.tsx
import { getApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, getFirestore } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import LoadingScreen from '~/loading'; // Adjust path if needed

// Get the FirebaseApp type by inferring it from the getApp function
type FirebaseApp = ReturnType<typeof getApp>;

type Firestore = FirebaseFirestoreTypes.Module;
type Auth = FirebaseAuthTypes.Module;

interface FirebaseContextProps {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  isReady: boolean; // Add the isReady state
}

// Add 'export' here
export const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
  isReady: false, // Default to false
});

export const useFirebase = () => useContext(FirebaseContext);

// Create a type for the props of FirebaseProvider
interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [firebaseServices, setFirebaseServices] = useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
    error: string | null;
  }>({
    app: null,
    auth: null,
    firestore: null,
    error: null,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = () => {
      try {
        const app = getApp();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        setFirebaseServices({ app, auth, firestore, error: null });
      } catch (e: any) {
        console.error('Failed to initialize Firebase services:', e);
        setFirebaseServices({ app: null, auth: null, firestore: null, error: e.message });
      } finally {
        setIsReady(true);
      }
    };

    initialize();
  }, []); // Run only once on mount

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (firebaseServices.error) {
    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: 'red' }}>Configuration Error</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{firebaseServices.error}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Please ensure your native configuration files are correct.
        </Text>
      </View>
    );
  }

  if (!firebaseServices.app) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseContext.Provider value={{
      app: firebaseServices.app,
      auth: firebaseServices.auth,
      firestore: firebaseServices.firestore,
      isReady, // Pass the isReady state
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
