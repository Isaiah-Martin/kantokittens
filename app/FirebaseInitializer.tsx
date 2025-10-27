// app/FirebaseInitializer.tsx

import {
  getApp,
  getApps,
  initializeApp,
} from '@react-native-firebase/app';
import React, { ReactNode, useEffect, useState } from 'react';
import { firebaseConfig } from '../lib/firebaseConfig';
import LoadingScreen from '../screens/loading';

// Use ReturnType to get the correct FirebaseApp type from the getApp function
type FirebaseAppType = ReturnType<typeof getApp>;

// Global variable to hold the Firebase app instance
let firebaseApp: FirebaseAppType;

const FirebaseInitializer = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function initialize() {
      if (!getApps().length) {
        // Cast to 'unknown' first to safely bridge the conflicting types
        firebaseApp = initializeApp(firebaseConfig) as unknown as FirebaseAppType;
      } else {
        firebaseApp = getApp();
      }
      setIsReady(true);
    }
    initialize();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export { firebaseApp };
export default FirebaseInitializer;
