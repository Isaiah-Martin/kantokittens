// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FirebaseProvider } from './context/FirebaseContext';
import LoadingScreen from './loading';

// The main layout wrapper for providers
function LayoutWithProviders() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Keep the splash screen visible while loading authentication state
  useEffect(() => {
    if (loading === false) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <Slot />;
}

// The root component that sets up all the context providers
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider>
      <AuthProvider>
        <LayoutWithProviders />
      </AuthProvider>
    </FirebaseProvider>
  );
}
