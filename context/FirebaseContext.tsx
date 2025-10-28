import { getApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, getFirestore } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useState } from 'react';
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
}

const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => useContext(FirebaseContext);

const initializeFirebaseServices = () => {
  try {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore, error: null };
  } catch (e: any) {
    console.error('Failed to initialize Firebase services:', e);
    return { app: null, auth: null, firestore: null, error: e.message };
  }
};

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseServices] = useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
    error: string | null;
  }>(() => initializeFirebaseServices());

  if (firebaseServices.error) {
    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: 'red' }}>Configuration Error</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{firebaseServices.error}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Please ensure you have run `npx expo prebuild` and that your native
          configuration files (`GoogleService-Info.plist`, `google-services.json`)
          are correctly set up.
        </Text>
      </View>
    );
  }

  if (!firebaseServices.app) {
    // This case should not be reached unless there's an error, but kept as a safeguard.
    return <LoadingScreen />;
  }

  return (
    <FirebaseContext.Provider value={{
      app: firebaseServices.app,
      auth: firebaseServices.auth,
      firestore: firebaseServices.firestore,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
