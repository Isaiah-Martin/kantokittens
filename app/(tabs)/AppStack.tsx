import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/HomeStackParamList';
import Settings from '../../screens/settings';
import { AppTabs } from './AppTabs';

const Stack = createStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppTabs" component={AppTabs} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
