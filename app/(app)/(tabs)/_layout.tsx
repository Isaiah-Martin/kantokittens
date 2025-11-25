// app/(app)/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

// Define the brand colors
const primaryColor = '#52392F'; // Updated background color
const inactiveBg = '#FCFBF6';
const activeTint = '#FCFBF6'; // Black text/icon for contrast

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint, // Icons/text when active (Black for contrast)
        tabBarInactiveTintColor: '#52392F', // Icons/text when inactive
        headerShown: false, // Hides headers globally for the tab navigator
      }}>
      
      {/* 
        Maps to the directory: app/(app)/(tabs)/hometab/
        This entire directory acts as one stack within the tabs UI.
      */}
      <Tabs.Screen
        name="hometab" 
        options={{
          title: 'Home',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>, 
        }}
      />

      {/* 
        Maps to the file or directory: app/(app)/(tabs)/explore(.tsx)/
      */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveBackgroundColor: primaryColor,
          tabBarInactiveBackgroundColor: inactiveBg,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🗺️</Text>,
        }}
      />
      
      {/* 
        REMOVED: The route 'hometab/booking' is nested within the 'hometab' stack, 
        it is not a top-level tab.

        REMOVED: The route 'settings' is defined in app/settings.tsx, which is outside 
        this (app)/(tabs) group. It cannot be part of this Tab Navigator.
        It should be accessed via a modal or a separate navigation flow outside of this tab bar structure.
      */}
    </Tabs>
  );
}
