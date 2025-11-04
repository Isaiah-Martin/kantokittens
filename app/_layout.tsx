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

SplashScreen.preventAutoHideAsync();
if (__DEV__) {
  LogBox.ignoreAllLogs();
}

export default function RootLayout() {
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const { isReady: firebaseIsReady } = useContext(FirebaseContext);

  const isLoading = authLoading || !firebaseIsReady || !initialLoadingComplete;

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
          setInitialLoadingComplete(true);
        }
      }
    }
    loadResourcesAndDataAsync();
    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
