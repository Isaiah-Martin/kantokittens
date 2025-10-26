import { getApp, initializeApp } from '@react-native-firebase/app';
import { ReactNode, useEffect, useState } from 'react'; // Import ReactNode
import { firebaseConfig } from '../lib/firebase';

// Define the type for the component's props
interface FirebaseInitializerProps {
  children: ReactNode;
}

// Apply the type to the component
const FirebaseInitializer = ({ children }: FirebaseInitializerProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        let app;
        try {
          // Check if a default app has already been initialized
          app = getApp();
        } catch (e) {
          // If not, initialize the app
          app = initializeApp(firebaseConfig);
        }
        setIsReady(true);
      } catch (e) {
        console.error("Firebase initialization failed", e);
      }
    }
    initialize();
  }, []);

  if (!isReady) {
    // You can replace this with a proper loading spinner or splash screen
    return null;
  }

  return children;
};

export default FirebaseInitializer;
