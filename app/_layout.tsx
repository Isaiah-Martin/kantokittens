// app/_layout.tsx

import { Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext'; // Import FirebaseContext
import { useAuthRedirect } from '../hooks/use-auth-redirect';

// Prevent the native splash screen from disappearing automatically
SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  LogBox.ignoreAllLogs();
}

// Wrapper component to manage top-level navigation logic using the hook
function AppNavigationWrapper() {
    useAuthRedirect(); 
    
    // Get the isReady state from FirebaseContext
    const { isReady: firebaseIsReady } = useContext(FirebaseContext);

    // Add useEffect to hide the splash screen once Firebase is ready
    useEffect(() => {
        // Hide the splash screen only when Firebase initialization is complete
        if (firebaseIsReady) {
            SplashScreen.hideAsync();
        }
    }, [firebaseIsReady]); // Run this effect when firebaseIsReady changes

    // The Slot renders the current page based on the router state
    return <Slot />;
}

// The default export wraps the logic in providers
export default function RootLayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Providers must wrap the component that consumes them */}
      <FirebaseProvider>
        {/* AuthProvider must wrap AppNavigationWrapper as the hook uses AuthContext */}
        <AuthProvider>
          {/* AppNavigationWrapper manages the routing logic using the hook */}
          <AppNavigationWrapper /> 
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
