import { Redirect, Slot, SplashScreen } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useContext, useEffect, useState } from 'react'; // Import useState
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
import LoadingScreen from '../loading';

// Prevent the native splash screen from auto-hiding immediately.
SplashScreen.preventAutoHideAsync();

// Silence unnecessary logs in development
if (__DEV__) {
  LogBox.ignoreAllLogs();
}

// Component that checks authentication and redirects
function AppAuthRedirect() {
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);

  const isLoading = authLoading || !firebaseIsReady;

  useEffect(() => {
    // Hide the splash screen only when all loading is truly complete
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // While loading, show the custom loading screen
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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Use expo-system-ui to ensure a consistent background color immediately
        await SystemUI.setBackgroundColorAsync("#ffffff"); // Match your native splash background
        // You would load any custom fonts or other assets here
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    // Return null while assets are loading, keeping the native splash screen visible
    return null;
  }

  return (
    <FirebaseProvider>
      <AuthProvider>
        <AppAuthRedirect />
      </AuthProvider>
    </FirebaseProvider>
  );
}
