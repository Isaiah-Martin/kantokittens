import { Asset } from 'expo-asset';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

// Component to handle authentication checks and final redirects
function AppAuthRedirect() {
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);

  const isLoading = authLoading || !firebaseIsReady;

  useEffect(() => {
    // This effect runs only after the AuthProvider and FirebaseProvider are mounted and their states are updated
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

// The root component that sets up all the context providers and asset loading
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
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseProvider>
        <AuthProvider>
          {/* AppAuthRedirect can now safely consume context data */}
          <AppAuthRedirect />
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
