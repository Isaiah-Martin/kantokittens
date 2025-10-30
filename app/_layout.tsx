import { Asset } from 'expo-asset';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useContext, useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
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
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

// The root component that sets up all the context providers
export default function RootLayout() {
  const [initialAssetsLoaded, setInitialAssetsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadResourcesAndDataAsync() {
      try {
        await SystemUI.setBackgroundColorAsync("#ffffff");
        const imageAsset = Asset.fromModule(require('../assets/images/KantoKittensCover.png'));
        await imageAsset.downloadAsync();
      } catch (e) {
        console.warn('Failed to load assets:', e);
      } finally {
        if (isMounted) {
          setInitialAssetsLoaded(true);
        }
      }
    }

    loadResourcesAndDataAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!initialAssetsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  return (
    <FirebaseProvider>
      <AuthProvider>
        <AppAuthRedirect />
      </AuthProvider>
    </FirebaseProvider>
  );
}
