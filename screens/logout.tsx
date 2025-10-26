import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // Use the custom hook
import { auth } from '../lib/firebase';
import { AuthStackParamList } from '../navigation/RootStackParamList'; // Assuming this file exists and is correctly defined

type LogoutScreenProps = BottomTabScreenProps<AuthStackParamList, 'Logout'>;

export default function LogoutScreen({ navigation, route }: LogoutScreenProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Use the native SDK's method to sign out
      await auth().signOut();

      // The logout function in your context should handle state changes and storage
      logout();

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button onPress={handleLogout}>
      Logout
    </Button>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});