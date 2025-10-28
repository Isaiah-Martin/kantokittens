import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarActiveBackgroundColor: '#D98CBF',
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveBackgroundColor: '#f0f0f0',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Book',
          tabBarActiveBackgroundColor: '#D98CBF',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="document.badge.clock" color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveBackgroundColor: '#D98CBF',
          tabBarInactiveBackgroundColor: '#f0f0f0',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="figure.yoga.circle.fill" color={'black'} />,
        }}
      />
      {/* Additional tabs like `logout` can be here if desired */}
    </Tabs>
  );
}
