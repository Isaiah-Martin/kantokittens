import { Tabs } from 'expo-router';
import React from 'react';
// FIX: Explicitly import Text from react-native
import { Text } from 'react-native';
// Import your specific components or constants if needed
// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';

// Define the brand color
const primaryColor = '#D98CBF';
const inactiveBg = '#f0f0f0';
const activeTint = '#ffffff'; // White text/icon for contrast

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint, // Icons/text when active
        tabBarInactiveTintColor: '#888', // Icons/text when inactive
        headerShown: false,
        // If you are having issues with HapticTab or IconSymbol imports, 
        // you might need to temporarily comment them out until paths are correct.
        // tabBarButton: HapticTab, 
      }}>
      <Tabs.Screen
        name="hometab" 
        options={{
          title: 'Home',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text>🏠</Text>, 
        }}
      />
      <Tabs.Screen
        name="hometab/booking"
        options={{
          title: 'Bookings',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarIcon: ({ color }) => <Text>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text>🗺️</Text>,
        }}
      />
      {/* If you have a settings page at app/(app)/(tabs)/settings.tsx */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarIcon: ({ color }) => <Text>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
