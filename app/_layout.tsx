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

// Rename the original function to something internal
function RootLayoutContent() {
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);
  
  // These contexts are now safely consumed because RootLayoutWrapper provides them
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

  // The Slot renders your app's screens using the provided contexts
  return <Slot />;
}

// Create a new default export that wraps the content in all required Providers
export default function RootLayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseProvider>
        <AuthProvider>
          {/* RootLayoutContent can now access AuthContext and FirebaseContext */}
          <RootLayoutContent /> 
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
