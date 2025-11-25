// context/FirebaseContext.tsx (Strictly Type-Safe Revision for Cross-Platform Compatibility)

import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import LoadingScreen from '~/loading';

// --- Type Definitions (Use generic 'FirebaseService' type as a universal bridge) ---
// We cannot use the explicit types from the specific libraries here, 
// as importing one library's types can cause resolution issues on the wrong platform.
type FirebaseService = any; 

interface FirebaseContextProps {
  app: FirebaseService | null;
  auth: FirebaseService | null;
  firestore: FirebaseService | null;
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
    app: FirebaseService | null;
    auth: FirebaseService | null;
    firestore: FirebaseService | null;
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
        // Use the generic type for local variables
        let appInstance: FirebaseService;
        let authInstance: FirebaseService;
        let firestoreInstance: FirebaseService;

        if (Platform.OS === 'web') {
          // *** WEB PLATFORM: Dynamic imports guarantee web libraries are used ***
          console.log("Initializing for web platform.");
          const { initializeApp, getApps, getApp } = await import('firebase/app');
          const { getAuth } = await import('firebase/auth');
          const { initializeFirestore } = await import('firebase/firestore');
          
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

          if (!getApps().length) {
            appInstance = initializeApp(firebaseConfig);
          } else {
            appInstance = getApp();
          }

          authInstance = getAuth(appInstance);
          firestoreInstance = initializeFirestore(appInstance, {
            experimentalForceLongPolling: true, 
            synchronizeTabs: true, 
          } as any); 
          
        } else {
          // *** NATIVE (iOS/Android) PLATFORM: Dynamic imports guarantee native libraries are used ***
          console.log("Initializing for native platform (iOS/Android).");
          const authModule = await import('@react-native-firebase/auth');
          const firestoreModule = await import('@react-native-firebase/firestore');
          const appModule = await import('@react-native-firebase/app');
          console.log("Native modules imported.");

          appInstance = appModule.getApp(); 
          authInstance = authModule.default(); 
          firestoreInstance = firestoreModule.default(); 
          console.log("Native services instances retrieved.");
        }

        setFirebaseServices({ app: appInstance, auth: authInstance, firestore: firestoreInstance, error: null });
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
