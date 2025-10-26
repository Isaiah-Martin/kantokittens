import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import 'react-native-gesture-handler';
import { useAuth } from '../../context/AuthContext'; // Use the custom hook
import { AppStackParamList, RootStackParamList } from '../../navigation/RootStackParamList';
import BookingScreen from '../../screens/booking';
import AddBooking from '../../screens/bookingadd';
import ForgotPassword from '../../screens/forgotpassword';
import LoadingScreen from '../../screens/loading';
import LoginScreen from '../../screens/login';
import LogoutScreen from '../../screens/logout';
import UserJoinScreen from '../../screens/useradd';
import UserInfoScreen from '../../screens/userinfo';

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const AppTabs = createBottomTabNavigator<AppStackParamList>();

// Screens for unauthenticated users
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Group>
      <AuthStack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login and Book Session' }}
          />
      <AuthStack.Screen 
          name="UserJoinScreen" 
          component={UserJoinScreen} 
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

// Screens for authenticated users
const AppTabsScreen = () => (
  <AppTabs.Navigator>
    <AppTabs.Screen
      name="BookingScreen"
      component={BookingScreen}
      options={{ headerTitle: 'Appointment Scheduler',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'calendar' : 'calendar-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    }} />
    <AppTabs.Screen
      name="ActivityDetail"
      component={AddBooking}
      options={{ headerTitle: 'Add Activity',
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
        return <Ionicons text={iconName} size={size} color={color} />;
      },
    }} />
    <AppTabs.Screen
      name="UserInfoScreen"
      component={UserInfoScreen}
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
    return <LoadingScreen />;
  }

  return isLoggedIn ? <AppTabsScreen /> : <AuthStackScreen />;
};