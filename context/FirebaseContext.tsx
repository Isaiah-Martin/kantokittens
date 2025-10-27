// src/context/FirebaseContext.tsx

import {
  getApp,
  getApps,
  initializeApp,
} from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, getFirestore } from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseConfig } from '../lib/firebaseConfig'; // Your firebase config

// Use ReturnType to get the correct FirebaseApp type from the getApp function
type FirebaseAppType = ReturnType<typeof getApp>;

// Define the type for the context's value
interface FirebaseContextProps {
  app: FirebaseAppType | null;
  auth: FirebaseAuthTypes.Module | null;
  firestore: FirebaseFirestoreTypes.Module | null;
}

// Create the context with a default (null) value
const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  auth: null,
  firestore: null,
});

// Create a hook to consume the context
export const useFirebase = () => useContext(FirebaseContext);

// Create the provider component
export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [app, setApp] = useState<FirebaseAppType | null>(null);
  const [auth, setAuth] = useState<FirebaseAuthTypes.Module | null>(null);
  const [firestore, setFirestore] = useState<FirebaseFirestoreTypes.Module | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function initialize() {
      try {
        let initializedApp: FirebaseAppType;
        if (!getApps().length) {
          // Explicitly cast to `unknown` first to safely handle the type mismatch
          initializedApp = initializeApp(firebaseConfig) as unknown as FirebaseAppType;
        } else {
          initializedApp = getApp();
        }

        const initializedAuth = getAuth(initializedApp);
        const initializedFirestore = getFirestore(initializedApp);

        setApp(initializedApp);
        setAuth(initializedAuth);
        setFirestore(initializedFirestore);
        console.log('Firebase initialized in context.');
      } catch (e) {
        console.error('Firebase initialization error in context:', e);
      } finally {
        setIsReady(true);
      }
    }
    initialize();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};
