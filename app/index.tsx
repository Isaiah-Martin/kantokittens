// app/index.tsx
import { Redirect } from 'expo-router';
import LoadingScreen from '~/loading'; // Assuming you have this component
import { useAuth } from '../context/AuthContext';

// This file is the root landing point for Expo Router.
export default function AppRoot() {
  const { user, loading } = useAuth();

  if (loading) {
    // Return a loading indicator while AuthContext initializes
    return <LoadingScreen />;
  }

  if (user) {
    // If logged in, redirect to the main application screen group
    // You may need to change '(app)' to match your file structure, e.g., '/home'
    return <Redirect href="/home" />; 
  }
  
  // If not logged in, redirect to the login screen
  return <Redirect href="/login" />;
}
