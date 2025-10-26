// src/navigation/AppNavigator.tsx

import { Ionicons } from '@expo/vector-icons'; // Assuming you use Expo or have installed @expo/vector-icons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import the correct param lists from your centralized types file
import {
  AppTabsParamList,
  AuthStackParamList,
  HomeStackParamList
} from '../../navigation/HomeStackParamList';

import { useAuth } from '../../context/AuthContext';
import ActivityDetail from '../../screens/activitydetail';
import Bookings from '../../screens/booking';
import AddBooking from '../../screens/bookingadd';
import ForgotPassword from '../../screens/forgotpassword';
import LoadingScreen from '../../screens/loading';
import Login from '../../screens/login';
import LogoutScreen from '../../screens/logout';
import Settings from '../../screens/settings';
import SignUp from '../../screens/signup';
import Home from './index';

// Create navigators with their specific param lists
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// Define the nested Home Stack inside a tab
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={Home}
      options={{ headerTitle: 'Home' }}
    />
    <HomeStack.Screen
      name="Settings"
      component={Settings}
      options={{ headerTitle: 'My Personal Data' }}
    />
    <HomeStack.Screen
      name="Booking"
      component={Bookings}
      options={{ headerTitle: 'My Bookings' }}
    />
    <HomeStack.Screen
      name="ActivityDetail"
      component={ActivityDetail}
      options={{ headerTitle: 'Activity Details' }}
    />
    <HomeStack.Screen
      name="AddBooking"
      component={AddBooking}
      options={{ headerTitle: 'Place a Booking' }}
    />
  </HomeStack.Navigator>
);

// Screens for unauthenticated users
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Group>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login and Book Session' }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: 'Join and Book Session' }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ title: 'Send Reset Password Email' }}
      />
    </AuthStack.Group>
  </AuthStack.Navigator>
);

// Screens for authenticated users (the tab bar)
const AppTabsScreen = () => (
  <AppTabs.Navigator>
    <AppTabs.Screen
      name="Home"
      component={Home} // Note: This uses the HomeStackScreen component
      options={{
        headerShown: false, // Hide the header for the nested stack
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? 'home' : 'home-outline';
          return <Ionicons name={iconName} size={size} color={'black'} />;
        },
      }}
    />
    <AppTabs.Screen
      name="Logout"
      component={LogoutScreen}
      options={{
        headerTitle: 'Logout',
        tabBarLabel: 'Logout',
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? 'log-out' : 'log-out-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      }}
    />
  </AppTabs.Navigator>
);

export const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isLoggedIn ? <AppTabsScreen /> : <AuthStackScreen />;
};
