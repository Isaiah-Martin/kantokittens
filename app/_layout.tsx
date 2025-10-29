import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
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
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);

  // A single variable to track if all necessary data is loaded
  const isLoading = authLoading || !firebaseIsReady;

  useEffect(() => {
    // Hide the splash screen only when loading is complete
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // While loading, show the loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Once loading is complete, handle authentication and redirect
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // If logged in, show the main app content
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
