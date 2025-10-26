import React from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext'; // Import your AuthProvider
import { AppNavigator } from './(tabs)/Navigation'; // Assuming this is your root navigator

import { useColorScheme } from '@/hooks/use-color-scheme';
import FirebaseInitializer from '../components/FirebaseInitializer';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseInitializer>
      <AuthProvider>
          <AppNavigator />
      </AuthProvider>
    </FirebaseInitializer>
  );
}

