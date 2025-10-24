import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import 'react-native-gesture-handler';
import { useAuth } from '../../context/AuthContext'; // Use the custom hook

import BookingScreen from '../../screens/booking';
import AddBooking from '../../screens/bookingadd';
import ForgotPasswd from '../../screens/forgotpasswd';
import LoginScreen from '../../screens/login';
import LogoutScreen from '../../screens/logout';
import UserJoin from '../../screens/useradd';
import UserInfo from '../../screens/userinfo';

// Define types for stack parameters if needed
type RootStackParamList = {
  Login: undefined;
  UserJoin: undefined;
  ForgotPasswd: undefined;
  App: undefined;
  AuthStack: undefined;
  AppStack: undefined;
};

// Define types for authenticated screens
type AppTabsParamList = {
    Scheduler: undefined;
    Add: undefined;
    Personal: undefined;
    Logout: undefined;
};

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabsParamList>();

// Screens for unauthenticated users
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Group>
      <AuthStack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Book a Session With Us' }}
          />
      <AuthStack.Screen 
          name="UserJoin" 
          component={UserJoin} 
          options={{ title: 'Book a Session With Us' }}
          />
      <AuthStack.Screen 
          name="ForgotPasswd" 
          component={ForgotPasswd} 
          options={{ title: 'Book a Session With Us' }}
          />
      </AuthStack.Group> 
  </AuthStack.Navigator>
);

// Screens for authenticated users
const AppTabsScreen = () => (
  <AppTabs.Navigator>
    <AppTabs.Screen
      name="Scheduler"
      component={BookingScreen}
      options={{ headerTitle: 'Appointment Scheduler',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'calendar' : 'calendar-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    }} />
    <AppTabs.Screen
      name="Add"
      component={AddBooking}
      options={{ headerTitle: 'Add Activity',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
        return <Ionicons text={iconName} size={size} color={color} />;
      },
    }} />
    <AppTabs.Screen
      name="Personal"
      component={UserInfo}
      options={{ headerTitle: 'Update My Personal Data',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'information-circle' : 'information-circle-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    }} />
    <AppTabs.Screen 
      name="Logout" 
      component={LogoutScreen} 
      options={{ headerTitle: 'Logout', tabBarLabel: 'Logout',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'log-out' : 'log-out-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
        }, // <- Add a comma after the function
    }} />
    </AppTabs.Navigator>
);

export const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // You could return a loading indicator here
    // return <LoadingScreen />;
    return null;
  }

  return isLoggedIn ? <AppTabsScreen /> : <AuthStackScreen />;
};