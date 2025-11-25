//app/(app)/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
// FIX: Explicitly import Text from react-native
import { Text } from 'react-native';
// Import your specific components or constants if needed

// Define the brand colors
const primaryColor = '#EBC5F1'; // Updated background color
const inactiveBg = '#f0f0f0';
const activeTint = '#000000'; // Black text/icon for contrast

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint, // Icons/text when active (Black for contrast)
        tabBarInactiveTintColor: '#888', // Icons/text when inactive
        headerShown: false, // Hides headers globally for the tab navigator
      }}>
      <Tabs.Screen
        name="hometab" 
        options={{
          headerShown: false, // Explicitly ensure the header is hidden for the home tab stack
          title: 'Home',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>, 
        }}
      />
      <Tabs.Screen
        name="hometab/booking"
        options={{
          title: 'Bookings',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarIcon: ({ color }) => <Text style={{ color }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🗺️</Text>,
        }}
      />
      {/* If you have a settings page at app/(app)/(tabs)/settings.tsx */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
