// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FirebaseProvider } from './context/FirebaseContext';

// Keep the splash screen visible while loading authentication state
// This must be called at the root of the app
SplashScreen.preventAutoHideAsync();

// The component that handles authentication state and renders the app
function AuthContentHandler() {
  // Now useContext is called within a component that is a child of AuthProvider
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Hide the splash screen once authentication state is loaded
  useEffect(() => {
    if (loading === false) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // Return null or a simple view while loading to prevent blank screen flashes
    return null; 
  }

  // Use <Slot /> to render the rest of the app's routes
  return <Slot />;
}

// The root component that sets up all the context providers
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider>
      <AuthProvider>
        {/* AuthContentHandler is now a child of AuthProvider and can access its context */}
        <AuthContentHandler />
      </AuthProvider>
    </FirebaseProvider>
  );
}
