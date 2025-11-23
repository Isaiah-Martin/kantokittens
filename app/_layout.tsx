// app/_layout.tsx

import { Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react'; // Import useContext and useEffect
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseProvider } from '../context/FirebaseContext';
import { useAuthRedirect } from '../hooks/use-auth-redirect';

// Prevent the native splash screen from disappearing automatically
SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Optional: Ignore all development warnings in dev environments only
  LogBox.ignoreAllLogs();
}

// Wrapper component to manage top-level navigation logic using the hook
function AppNavigationWrapper() {
    // This hook contains all the redirect logic
    useAuthRedirect(); 
    
    // Get the loading state from AuthContext
    const { loading } = useContext(AuthContext);

    // Add useEffect to hide the splash screen once loading is complete
    useEffect(() => {
        if (!loading) {
            SplashScreen.hideAsync();
        }
    }, [loading]); // Run this effect when the loading state changes

    // The Slot renders the current page based on the router state
    return <Slot />;
}

// The default export wraps the logic in providers
export default function RootLayoutWrapper() {
  return (
    // GestureHandlerRootView is necessary for many React Native libraries
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
