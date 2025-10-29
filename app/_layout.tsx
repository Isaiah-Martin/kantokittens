import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
import LoadingScreen from '../loading';

// Prevent the splash screen from auto-hiding immediately.
// This should be called in the global scope, outside of any components.
SplashScreen.preventAutoHideAsync();

// Silence unnecessary logs in development
if (__DEV__) {
  LogBox.ignoreAllLogs();
}

// Component that checks authentication and redirects
function AppAuthRedirect() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Only proceed once both Firebase and Auth contexts are ready
    if (firebaseIsReady && !loading && !isAppReady) {
      // Set the app as ready and hide the splash screen
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [firebaseIsReady, loading, isAppReady]); // isAppReady is a crucial dependency here

  // If the app is not ready, return a loading indicator
  // This prevents rendering content prematurely, which can cause flicker.
  if (!isAppReady) {
    return <LoadingScreen />;
  }

  // Once ready, check authentication and redirect
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // If authenticated, show the main application content
  return <Slot />;
}

// The root component that sets up all the context providers
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider>
      <AuthProvider>
        {/* Render the authentication-checking component within the providers */}
        <AppAuthRedirect />
      </AuthProvider>
    </FirebaseProvider>
  );
}
