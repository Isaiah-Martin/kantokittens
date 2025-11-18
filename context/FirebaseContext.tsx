// context/FirebaseContext.tsx
import Constants from 'expo-constants'; // Import Constants directly
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
          // *** WEB PLATFORM IMPORTS & CONFIGURATION ***
          const { initializeApp, getApps, getApp } = await import('firebase/app');
          const { getAuth } = await import('firebase/auth');
          const { initializeFirestore } = await import('firebase/firestore');
          
          const firebaseConfig = {
            apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY,
            authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID,
            databaseURL: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
          };

          let appInstance;
          if (!getApps().length) {
            appInstance = initializeApp(firebaseConfig);
          } else {
            appInstance = getApp();
          }

          app = appInstance;
          auth = getAuth(appInstance);
          
          // *** CRITICAL CHANGE FOR OFFLINE FIX (WEB ONLY) ***
          // Use 'as any' to bypass the TypeScript error caused by mixed native/web types
          firestore = initializeFirestore(appInstance, {
            experimentalForceLongPolling: true, 
            synchronizeTabs: true, 
          } as any); // Cast options to 'any' for the web-specific properties
          
        } else {
          // *** NATIVE (iOS/Android) PLATFORM (Fixed initialization) ***
          const authModule = await import('@react-native-firebase/auth');
          const firestoreModule = await import('@react-native-firebase/firestore');
          const appModule = await import('@react-native-firebase/app');

          app = appModule.getApp();
          auth = authModule.default(); 
          firestore = firestoreModule.default(); 
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
