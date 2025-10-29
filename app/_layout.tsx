// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import { useContext, useEffect, useState } from 'react'; // Import useState
import { LogBox } from 'react-native'; // Import LogBox for debugging
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
import LoadingScreen from '../loading';

// Prevent the splash screen from auto-hiding
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
    console.log('AppAuthRedirect useEffect triggered.');
    if (firebaseIsReady && !loading && !isAppReady) {
      console.log('Firebase and Auth ready. Hiding splash screen...');
      // Use a timeout to ensure the UI is ready before hiding the splash screen
      setTimeout(() => {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [firebaseIsReady, loading, isAppReady]);

  console.log(`AppAuthRedirect state - firebaseIsReady: ${firebaseIsReady}, loading: ${loading}, isAppReady: ${isAppReady}`);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    console.log('Not logged in. Redirecting to login page.');
    return <Redirect href="/(auth)/login" />;
  }
  
  console.log('Logged in. Continuing to main app content.');
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
