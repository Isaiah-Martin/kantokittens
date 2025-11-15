import { Slot, SplashScreen, useRouter } from 'expo-router'; // Import useRouter
import { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';

// Prevent the native splash screen from disappearing automatically
SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Optional: Ignore all development warnings in dev environments only
  LogBox.ignoreAllLogs();
}

function AuthContentHandler() {
  const router = useRouter(); // Initialize the router
  // Safely consume context within the wrapper
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  // Consume FirebaseContext
  const { isReady: firebaseIsReady } = useContext(FirebaseContext); 

  // In a real app, you might use an 'asset loader' hook here
  const [assetsLoaded, setAssetsLoaded] = useState(true); 

  // Combine all loading states
  const isLoading = authLoading || !assetsLoaded || !firebaseIsReady;

  useEffect(() => {
    // Only proceed once everything is finished loading
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (!isLoggedIn) {
        // Use router.replace to navigate imperatively without causing flicker/throttling
        // This stops the navigation loop caused by repeated <Redirect> renders
        router.replace('/(auth)/login'); 
      } else {
        // Optional: if logged in, ensure user is redirected to the main app index/home
        // router.replace('/(app)/index');
      }
    }
  }, [isLoading, isLoggedIn, router]); // Dependency array ensures this runs when status changes

  if (isLoading) {
    // Keep the native splash screen visible (by returning null) while loading data/assets
    return null;
  }

  // Use Slot when the user is logged in and ready to see the app content
  if (isLoggedIn) {
      return <Slot />;
  }
  
  // Return null temporarily while useEffect handles the navigation replacement for non-logged-in users
  return null;
}

// The default export wraps the logic in providers
export default function RootLayoutWrapper() {
  return (
    // GestureHandlerRootView is necessary for many React Native libraries
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Providers must wrap the component that consumes them */}
      <FirebaseProvider>
        <AuthProvider>
          {/* AuthContentHandler manages the routing logic once contexts are available */}
          <AuthContentHandler /> 
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
