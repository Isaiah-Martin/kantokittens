// app/_layout.tsx
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

  // Wait for both Firebase and Auth providers to be ready
  useEffect(() => {
    if (firebaseIsReady && !loading) {
      setIsAppReady(true);
    }
  }, [firebaseIsReady, loading]);

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  // Redirect if not authenticated
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
