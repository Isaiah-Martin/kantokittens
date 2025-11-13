// app/_layout.tsx

import { Asset } from 'expo-asset';
import { Redirect, Slot, SplashScreen } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { FirebaseContext, FirebaseProvider } from '../context/FirebaseContext';
// Removed explicit import of LoadingScreen as we use null during loading
// import LoadingScreen from '../loading'; 

// Prevent the splash screen from hiding automatically at app start
SplashScreen.preventAutoHideAsync();

// Suppress all logs during development if preferred
if (__DEV__) {
  LogBox.ignoreAllLogs();
}

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
        // Use an actual color value or variable if available
        await SystemUI.setBackgroundColorAsync("#ffffff"); 
        // Pre-download your cover image asset
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
      // Hide the native splash screen only once everything is ready
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    // Return null to keep the native splash screen visible while loading
    return null; 
    // If you prefer your custom JS LoadingScreen immediately visible instead:
    // return <LoadingScreen />; 
  }

  // Use Redirect to navigate based on auth status
  if (!isLoggedIn) {
    // Redirects to the login route within the (auth) group
    return <Redirect href="/(auth)/login" />;
  }

  // The user is logged in. Use Slot to render the rest of the app's (app) routes.
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
