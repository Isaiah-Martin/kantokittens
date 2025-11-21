// context/FirebaseContext.tsx (Revised for Modular Compatibility)

import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import LoadingScreen from '~/loading'; // Adjust path if needed

// --- Type Definitions ---
// Use specific types from the libraries for better type safety
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
// Native types
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface FirebaseContextProps {
  app: FirebaseApp | any; // 'any' used to accommodate native app type
  auth: Auth | FirebaseAuthTypes.Module | null;
  firestore: Firestore | FirebaseFirestoreTypes.Module | null;
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
    app: FirebaseApp | any;
    auth: Auth | FirebaseAuthTypes.Module | null;
    firestore: Firestore | FirebaseFirestoreTypes.Module | null;
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
      console.log("Initialization started in FirebaseContext.");
      try {
        let app: FirebaseApp | any;
        let auth: Auth | FirebaseAuthTypes.Module;
        let firestore: Firestore | FirebaseFirestoreTypes.Module;

        if (Platform.OS === 'web') {
          // *** WEB PLATFORM IMPORTS & CONFIGURATION ***
          console.log("Initializing for web platform.");
          const { initializeApp, getApps, getApp } = await import('firebase/app');
          const { getAuth } = await import('firebase/auth');
          const { initializeFirestore } = await import('firebase/firestore');
          
          // Use a helper function to safely access constants
          const getExtraConstant = (key: string) => Constants.expoConfig?.extra?.[key];
          
          const firebaseConfig = {
            apiKey: getExtraConstant('EXPO_PUBLIC_FIREBASE_API_KEY'),
            authDomain: getExtraConstant('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
            projectId: getExtraConstant('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
            storageBucket: getExtraConstant('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
            messagingSenderId: getExtraConstant('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
            appId: getExtraConstant('EXPO_PUBLIC_FIREBASE_APP_ID'),
            databaseURL: getExtraConstant('EXPO_PUBLIC_FIREBASE_DATABASE_URL'),
          };

          let appInstance;
          if (!getApps().length) {
            appInstance = initializeApp(firebaseConfig);
          } else {
            appInstance = getApp();
          }

          app = appInstance;
          auth = getAuth(appInstance);
          
          firestore = initializeFirestore(appInstance, {
            experimentalForceLongPolling: true, 
            synchronizeTabs: true, 
          } as any); 
          
        } else {
          // *** NATIVE (iOS/Android) PLATFORM (Updated to modular style) ***
          console.log("Initializing for native platform (iOS/Android).");
          // The native libraries expose their services as the default export of the package
          const authModule = await import('@react-native-firebase/auth');
          const firestoreModule = await import('@react-native-firebase/firestore');
          const appModule = await import('@react-native-firebase/app');
          console.log("Native modules imported.");

          // Use the getApp() function from the app module to avoid deprecation warnings
          app = appModule.getApp(); 
          // Access services via default exports
          auth = authModule.default(); 
          firestore = firestoreModule.default(); 
          console.log("Native services instances retrieved.");
        }

        setFirebaseServices({ app, auth, firestore, error: null });
        console.log("Firebase services initialized successfully.");

      } catch (e: any) {
        console.error('Failed to initialize Firebase services:', e);
        console.log("Initialization failed in catch block.");
        setFirebaseServices({ app: null, auth: null, firestore: null, error: e.message });
      } finally {
        setIsReady(true);
        console.log("setIsReady set to true.");
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (firebaseServices.error) {
    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: 'red' }}>Configuration Error</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{firebaseServices.error}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Please ensure your native configuration files are correct (e.g., GoogleService-Info.plist/google-services.json).
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
