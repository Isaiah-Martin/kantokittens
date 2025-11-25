// app/(tabs)/hometab/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, // Hides the header for the specific 'index' screen
        }} 
      />
      {/* 
        The "booking" screen should still have a header so the user can navigate back. 
        Expo Router automatically provides a "back" button if you leave this default.
      */}
      <Stack.Screen 
        name="booking" 
        options={{ 
          title: 'Booking Details', // Optional: customize the title for the booking page
        }} 
      />
    </Stack>
  );
}
