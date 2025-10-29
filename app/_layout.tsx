// app/_layout.tsx

// Add this line at the very top of the file
(globalThis as any).RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

// The rest of your imports and code follow
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
import LoadingScreen from '../loading';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Component that checks authentication and redirects
function AppAuthRedirect() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // This effect runs when its dependencies change.
    // We only set the app as ready when both Firebase and Auth are ready.
    if (firebaseIsReady && !loading) {
      setIsAppReady(true);
    }
  }, [firebaseIsReady, loading]);

  useEffect(() => {
    // Hide the splash screen only after the app is confirmed ready.
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

// The root component that sets up all the context providers
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider>
      <AuthProvider>
        <AppAuthRedirect />
      </AuthProvider>
    </FirebaseProvider>
  );
}
