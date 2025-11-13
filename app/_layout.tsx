// app/_layout.tsx (Revised for completeness)

import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
// Import FirebaseContext to use its 'isReady' state
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
// Assuming you have the context files in these paths

// Prevent the native splash screen from disappearing automatically
SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Optional: Ignore all development warnings
  LogBox.ignoreAllLogs();
}

function AuthContentHandler() {
  // Safely consume context within the wrapper
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  // Consume FirebaseContext
  const { isReady: firebaseIsReady } = useContext(FirebaseContext); 

  // Example state for pre-loading assets, if needed (can be simplified)
  const [assetsLoaded, setAssetsLoaded] = useState(true); 

  // Combine all loading states into a single variable
  const isLoading = authLoading || !assetsLoaded || !firebaseIsReady;

  useEffect(() => {
    // Hide the native splash screen when all application logic is ready
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    // Keep the native splash screen visible while loading data/assets
    return null;
  }

  if (!isLoggedIn) {
    // User is not logged in: Redirect to the (auth) group login path
    return <Redirect href="/(auth)/login" />; 
  }

  // User is logged in: Render the rest of the application (e.g., (app) group)
  return <Slot />;
}

// The default export wraps the logic in providers
export default function RootLayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseProvider>
        <AuthProvider>
          {/* AuthContentHandler manages the routing logic */}
          <AuthContentHandler /> 
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
