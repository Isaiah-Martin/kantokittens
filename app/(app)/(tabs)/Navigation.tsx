import { useContext } from 'react'; // Add useContext import from React
import { AuthContext } from '../../../context/AuthContext';
import LoadingScreen from '../../../loading';
import AppTabsScreen from './AppTabs'; // Assuming AppTabsScreen is in the same directory
import AuthStackScreen from './AuthStack'; // Assuming AuthStackScreen is in the same directory


export const AppNavigator = () => {
  // Destructure isLoggedIn and loading directly from the AuthContext
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return isLoggedIn ? <AppTabsScreen /> : <AuthStackScreen />;
};
