import { IconSymbol } from '@/components/ui/icon-symbol';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import 'react-native-gesture-handler';
import { UserContext } from '../../components/Context';
import { UserContextType } from '../../lib/types';
import ActivityDetail from '../../screens/activitydetail';
import BookingScreen from '../../screens/booking';
import AddBooking from '../../screens/bookingadd';
import ForgotPasswd from '../../screens/forgotpasswd';
import LoginScreen from '../../screens/login';
import LogoutScreen from '../../screens/logout';
import UserJoin from '../../screens/useradd';
import UserInfo from '../../screens/userinfo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LoginedStack() {
  return (
    <Tab.Navigator  
      initialRouteName="Scheduler"
      screenOptions={{
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Scheduler"
        component={BookingScreen}
        options={{ headerTitle: 'Appointment Scheduler',
        tabBarIcon: ({color, size }) => <IconSymbol size={size} name="calendar" color={color} />,
      }} />
      <Tab.Screen
        name="Add"
        component={AddBooking}
        options={{ headerTitle: 'Add Activity',
        tabBarIcon: ({color, size }) => <IconSymbol size={size} name="iphone.circle" color={color} />,
      }} />
      <Tab.Screen
        name="Personal"
        component={UserInfo}
        options={{ headerTitle: 'Update My Personal Data',
        tabBarIcon: ({color, size }) => <IconSymbol size={size} name="info" color={color} />,
      }} />
      <Tab.Screen 
        name="Logout" 
        component={LogoutScreen} 
        options={{ headerTitle: 'Logout', tabBarLabel: 'Logout',
        tabBarIcon: ({color, size }) => <IconSymbol size={size} name="lock.rectangle" color={color} />,
      }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const userContext: UserContextType = useContext(UserContext);
  
  return (userContext &&
      <Stack.Navigator>
      {!userContext.isLoggedIn &&
        <Stack.Group>
          <Stack.Screen 
             name="Login" 
             component={LoginScreen} 
             options={{ title: 'Book a Session With Us' }}
             />
          <Stack.Screen 
             name="UserJoin" 
             component={UserJoin} 
             options={{ title: 'Book a Session With Us' }}
             />
          <Stack.Screen 
             name="ForgotPasswd" 
             component={ForgotPasswd} 
             options={{ title: 'Forgot Password' }}
             />
        </Stack.Group> 
      }
      {userContext.isLoggedIn &&
        <>
        <Stack.Group>
          <Stack.Screen
            name="LoginedStack"
            component={LoginedStack}
            options={{ headerShown: false, title: 'Activity Dashboard' }}
          />
        </Stack.Group> 
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="ActivityDetail" component={ActivityDetail} />
        </Stack.Group>
        </> 
      }
      </Stack.Navigator>
  );
}