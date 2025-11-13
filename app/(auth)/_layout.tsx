// app/(auth)/_layout.tsx (FIXED)

import { Stack } from 'expo-router';

export default function AuthLayout() {
  // CRITICAL: Remove all useContext, isLoggedIn, loading, and Redirect calls here.
  // The root layout already handles these checks.
  
  return (
    <Stack>
      {/* Define screen options for children screens within the (auth) group */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgotpassword" options={{ title: 'Forgot Password' }} />
    </Stack>
  );
}
