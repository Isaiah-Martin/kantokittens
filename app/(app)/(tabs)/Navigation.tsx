import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingScreen from '../../../loading';


export const AppNavigator = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isLoggedIn) {
    // Use '/' to represent the root of your app
    return <Redirect href="/" />;
  } else {
    // The path to the login screen
    return <Redirect href="/(auth)/login" />;
  }
};
