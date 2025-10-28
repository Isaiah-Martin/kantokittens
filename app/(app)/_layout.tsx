// app/(app)/_layout.tsx
import { Href, Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AppLayout() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (!loading && !isLoggedIn) {
    // Cast the string to the Href type and pass it to the href prop
    const authLoginPath = "/(auth)/login" as Href;
    return <Redirect href={authLoginPath} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="bookingadd" options={{ title: 'Add Booking' }} />
      <Stack.Screen name="activitydetail" options={{ title: 'Activity Details' }} />
    </Stack>
  );
}
