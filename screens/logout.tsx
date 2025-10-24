import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { signOut } from 'firebase/auth';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // Use the custom hook
import { auth } from '../lib/firebase';


export default function LogoutScreen({ navigation }: { navigation: any}) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase Authentication
      await signOut(auth);

      // Clear the user in your context
      logout(); // The logout function in your context should set the user to undefined

      // Clear stored data (optional, but good practice)
      await AsyncStorage.removeItem('user');
      await SecureStore.deleteItemAsync('token');

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