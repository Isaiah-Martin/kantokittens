// app/(auth)/_layout.tsx
import { Href, Redirect, Stack } from 'expo-router'; // Add Href import
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AuthLayout() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // If the user is already logged in, redirect them to the app
  if (!loading && isLoggedIn) {
    // Redirect to the (app) group, not the absolute root
    return <Redirect href={"/(app)" as Href} />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgotpassword" options={{ title: 'Forgot Password' }} />
    </Stack>
  );
}
