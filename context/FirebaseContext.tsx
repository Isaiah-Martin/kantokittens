// context/FirebaseContext.tsx (Strictly Type-Safe Revision for Cross-Platform Compatibility)

import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import LoadingScreen from '~/loading';
// Import the updated type interface which now includes 'database'
import { FirebaseContextProps } from '../navigation/types';

// Use a generic type as a universal bridge
type FirebaseService = any; 

// Update the default context value to include 'database: null'
export const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
  database: null, 
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
    database: FirebaseService | null; 
    error: string | null;
  }>({
    app: null,
    auth: null,
    firestore: null,
    database: null, 
    error: null,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      console.log("Initialization started in FirebaseContext.");
      try {
        let appInstance: FirebaseService;
        let authInstance: FirebaseService;
        let firestoreInstance: FirebaseService;
        let databaseInstance: FirebaseService; 

        if (Platform.OS === 'web') {
          // *** WEB PLATFORM: Dynamic imports guarantee web libraries are used ***
          console.log("Initializing for web platform.");
          const { initializeApp, getApps, getApp } = await import('firebase/app');
          const { getAuth } = await import('firebase/auth');
          const { initializeFirestore } = await import('firebase/firestore');
          // Import Realtime Database module for web
          const { getDatabase } = await import('firebase/database'); 
          
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
          
          // Check if databaseURL is present
          if (!firebaseConfig.databaseURL) {
              throw new Error("EXPO_PUBLIC_FIREBASE_DATABASE_URL is missing in app.json 'extra' field.");
          }

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
          
          databaseInstance = getDatabase(appInstance); // <-- INITIALIZE RTDB FOR WEB
          
        } else {
          // *** NATIVE (iOS/Android) PLATFORM ***
          console.log("Initializing for native platform (iOS/Android).");
          // The native libraries rely on native configuration files (google-services.json/Info.plist)
          const appModule = await import('@react-native-firebase/app');
          appInstance = appModule.getApp(); 
          console.log(`Native App Instance Name: ${appInstance.options.appId}`);

          const authModule = await import('@react-native-firebase/auth');
          authInstance = authModule.default(); 
          
          const firestoreModule = await import('@react-native-firebase/firestore');
          firestoreInstance = firestoreModule.default(); 
          
          const databaseModule = await import('@react-native-firebase/database');
          databaseInstance = databaseModule.default(); 

          console.log("Native services instances retrieved.");
        }

        // Validate that essential services are present before setting ready state
        if (!authInstance || !databaseInstance) {
            throw new Error(`Initialization failed: Missing Auth or Database instance for ${Platform.OS}.`);
        }

        setFirebaseServices({ 
            app: appInstance, 
            auth: authInstance, 
            firestore: firestoreInstance, 
            database: databaseInstance, 
            error: null 
        });
        console.log("Firebase services initialized successfully.");

      } catch (e: any) {
        console.error('Failed to initialize Firebase services:', e);
        // CRITICAL: Set the error state so the error screen is shown
        setFirebaseServices(s => ({ ...s, error: e.message }));
      } finally {
        setIsReady(true);
        console.log("setIsReady set to true.");
      }
    };

    initialize();
  }, []);

  // ... (rest of the component remains the same)

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (firebaseServices.error) {
    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: 'red' }}>Configuration Error</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{firebaseServices.error}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Please ensure your native configuration files are correct (e.g., GoogleService-Info.plist/google-services.json) and that your `app.json` has the correct `EXPO_PUBLIC_FIREBASE_DATABASE_URL` in the `extra` field.
        </Text>
      </View>
    );
  }

  return (
    <FirebaseContext.Provider value={{
      app: firebaseServices.app,
      auth: firebaseServices.auth,
      firestore: firebaseServices.firestore,
      database: firebaseServices.database, 
      isReady,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
