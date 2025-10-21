import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../app/(tabs)/index';
import LoginScreen from '../screens/login';
import UserJoin from '../screens/useradd';
import ForgotPasswd from '../screens/forgotpasswd';
import BookingScreen from '../screens/booking';
import AddBooking from '../screens/bookingadd';
import UserInfo from '../screens/userinfo';
import LogoutScreen from '../screens/logout';
import ActivityDetail from '../screens/activitydetail';
import {RootStackParamList} from './RootStackParamList';
import { UserContext } from '../components/Context';
import {UserContextType} from '../lib/types';
import LoginedStack from '../app/(tabs)/Navigation'

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => {
  const userContext: UserContextType = useContext(UserContext);
  return (userContext &&
        <Stack.Navigator>
        {!userContext.isLoggedIn &&
          <Stack.Group>
            <Stack.Screen 
               name="Login" 
               component={LoginScreen} 
               options={{ title: 'Appointment Scheduler' }}
               />
            <Stack.Screen 
               name="UserJoin" 
               component={UserJoin} 
               options={{ title: 'Appointment Scheduler' }}
               />
            <Stack.Screen 
               name="ForgotPasswd" 
               component={ForgotPasswd} 
               options={{ title: 'Appointment Scheduler' }}
               />
          </Stack.Group> 
        }
        {userContext.isLoggedIn &&
          <>
          <Stack.Group>
            <Stack.Screen
              name="LoginedStack"
              component={LoginedStack}
              options={{ headerShown: false, title: 'Scheduler' }}
            />
          </Stack.Group> 
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="ActivityDetail" component={ActivityDetail} />
          </Stack.Group>
          </> 
        }
        </Stack.Navigator>
    );
};

export default AppStack;