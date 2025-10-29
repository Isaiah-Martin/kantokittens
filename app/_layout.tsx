// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
import LoadingScreen from '../loading';

SplashScreen.preventAutoHideAsync();

function AppAuthRedirect() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);

  useEffect(() => {
    // Only hide the splash screen and allow rendering once both contexts are finished loading
    if (firebaseIsReady && !loading) {
      SplashScreen.hideAsync();
    }
  }, [firebaseIsReady, loading]);

  if (!firebaseIsReady || loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

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
