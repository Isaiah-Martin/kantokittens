// context/FirebaseContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import LoadingScreen from '~/loading'; // Adjust path if needed

// --- Type Definitions (Simplified for cross-platform compatibility) ---
type FirebaseApp = any; // Use 'any' to handle type differences between web and native SDKs
type Firestore = any;
type Auth = any;

interface FirebaseContextProps {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  isReady: boolean;
}

export const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
  isReady: false,
});

export const useFirebase = () => useContext(FirebaseContext);

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
    const initialize = async () => {
      try {
        let app: FirebaseApp;
        let auth: Auth;
        let firestore: Firestore;

        if (Platform.OS === 'web') {
          // *** FIX FOR WEB PLATFORM IMPORTS ***

          // Import the core app functions
          const { initializeApp, getApps, getApp } = await import('firebase/app');
          // Import the specific service functions
          const { getAuth } = await import('firebase/auth');
          const { getFirestore } = await import('firebase/firestore');
          
          const Constants = await import('expo-constants');
          
          const firebaseConfig = {
            apiKey: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY,
            authDomain: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID,
            databaseURL: Constants.default.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
          };

          let appInstance;
          if (!getApps().length) {
            appInstance = initializeApp(firebaseConfig);
          } else {
            appInstance = getApp();
          }

          // Assign the specific services from their proper function calls
          app = appInstance;
          auth = getAuth(appInstance);
          firestore = getFirestore(appInstance);
          
        } else {
          // *** NATIVE (iOS/Android) PLATFORM ***
          // Use @react-native-firebase packages (which read native config files)
          const nativeFirebase = await import('@react-native-firebase/app');
          const nativeAuth = await import('@react-native-firebase/auth');
          const nativeFirestore = await import('@react-native-firebase/firestore');

          app = nativeFirebase.getApp();
          auth = nativeAuth.getAuth(app);
          firestore = nativeFirestore.getFirestore(app);
        }

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

  return (
    <FirebaseContext.Provider value={{
      app: firebaseServices.app,
      auth: firebaseServices.auth,
      firestore: firebaseServices.firestore,
      isReady,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
