// src/context/FirebaseContext.tsx
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, getFirestore } from '@react-native-firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { firebaseConfig } from '../lib/firebaseConfig';
import LoadingScreen from '../loading';

type FirebaseAppType = ReturnType<typeof getApp>;
type Firestore = FirebaseFirestoreTypes.Module;
type Auth = FirebaseAuthTypes.Module; // Use FirebaseAuthTypes.Module instead of Auth

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

  useEffect(() => {
    async function initialize() {
      try {
        if (
          !firebaseConfig.apiKey ||
          !firebaseConfig.authDomain ||
          !firebaseConfig.projectId ||
          !firebaseConfig.appId
        ) {
          throw new Error('Firebase environment variables are missing or incomplete.');
        }
        let initializedApp: FirebaseAppType;
        if (!getApps().length) {
          initializedApp = await initializeApp(firebaseConfig as any);
        } else {
          initializedApp = getApp();
        }

        const initializedAuth = getAuth(initializedApp);
        const initializedFirestore = getFirestore(initializedApp);

        setApp(initializedApp);
        setAuth(initializedAuth);
        setFirestore(initializedFirestore);
        setIsReady(true);
      } catch (e) {
        console.error('Firebase initialization error:', e);
      }
    }
    initialize();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};
