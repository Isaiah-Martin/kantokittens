// app/_layout.tsx

// --- REMOVED USER-AGENT WORKAROUND ---

import { Slot, SplashScreen } from 'expo-router';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';
import { FirebaseProvider } from '../context/FirebaseContext';
// Import the new navigation hook
import { useAuthRedirect } from '../hooks/use-auth-redirect';

// Prevent the native splash screen from disappearing automatically
SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Optional: Ignore all development warnings in dev environments only
  LogBox.ignoreAllLogs();
}

// Wrapper component to manage top-level navigation logic using the hook
function AppNavigationWrapper() {
    // This hook contains all the redirect logic
    useAuthRedirect(); 

    // The Slot renders the current page based on the router state
    // The hook ensures the router state is correct before anything renders
    return <Slot />;
}

// The default export wraps the logic in providers
export default function RootLayoutWrapper() {
  return (
    // GestureHandlerRootView is necessary for many React Native libraries
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Providers must wrap the component that consumes them */}
      <FirebaseProvider>
        {/* AuthProvider must wrap AppNavigationWrapper as the hook uses AuthContext */}
        <AuthProvider>
          {/* AppNavigationWrapper manages the routing logic using the hook */}
          <AppNavigationWrapper /> 
        </AuthProvider>
      </FirebaseProvider>
    </GestureHandlerRootView>
  );
}
