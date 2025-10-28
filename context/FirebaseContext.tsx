// FirebaseContext.tsx

import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, getFirestore } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native'; // <-- Add View and Text here
import LoadingScreen from '../loading';

type FirebaseAppType = ReturnType<typeof getApp>;
type Firestore = FirebaseFirestoreTypes.Module;
type Auth = FirebaseAuthTypes.Module;

interface FirebaseContextProps {
  app: FirebaseAppType | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [app, setApp] = useState<FirebaseAppType | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const firebaseConfig = {
          apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
          databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
        };

        if (
          !firebaseConfig.apiKey ||
          !firebaseConfig.authDomain ||
          !firebaseConfig.projectId ||
          !firebaseConfig.appId
        ) {
          throw new Error('Firebase environment variables are missing or incomplete.');
        }

        const defaultAppExists = getApps().some(app => app.name === '[DEFAULT]');
        let initializedApp: FirebaseAppType;

        if (defaultAppExists) {
            initializedApp = getApp();
        } else {
            initializedApp = await initializeApp(firebaseConfig as any);
        }

        const initializedAuth = getAuth(initializedApp);
        const initializedFirestore = getFirestore(initializedApp);

        setApp(initializedApp);
        setAuth(initializedAuth);
        setFirestore(initializedFirestore);
        setIsReady(true);
      } catch (e: any) {
        console.error('Firebase initialization error:', e);
        setError(e.message);
      }
    }
    initialize();
  }, []);

  if (error) {
    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: 'red' }}>Configuration Error</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Please check your Firebase configuration and environment variables.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};
