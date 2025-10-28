// app/(app)/FirebaseInitializer.tsx

import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import React, { ReactNode, useEffect, useState } from 'react';
import { firebaseConfig } from '../../lib/firebaseConfig'; // Get the config
import LoadingScreen from '../../loading'; // Adjust path as needed

// Global variable approach is flawed. Let's provide the app via Context.
// Use FirebaseAppType from getApp's return type for better type safety
type FirebaseAppType = ReturnType<typeof getApp>;

const FirebaseInitializer = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Define an async function inside useEffect
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
          // Await is now safe to use here
          initializedApp = await initializeApp(firebaseConfig as any);
        } else {
          initializedApp = getApp();
        }
        
        // This is where you would update your FirebaseContext, not a global variable.
        // For now, we'll just set isReady.
        setIsReady(true);
      } catch (e) {
        console.error('Firebase initialization error:', e);
        // Handle error, e.g., set an error state
      }
    }
    initialize(); // Call the async function
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default FirebaseInitializer;
