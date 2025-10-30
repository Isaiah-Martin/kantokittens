import { Asset } from 'expo-asset';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useContext, useEffect, useState } from 'react';
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
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        await SystemUI.setBackgroundColorAsync("#ffffff");
        const imageAsset = Asset.fromModule(require('../assets/images/KantoKittensCover.png'));
        await imageAsset.downloadAsync();
      } catch (e) {
        console.warn('Failed to load assets:', e);
      } finally {
        setAssetsAreLoaded(true);
      }
    }
    loadAssets();
  }, []);

  if (!assetsAreLoaded) {
    // Keep the native splash screen visible while assets are loading
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
