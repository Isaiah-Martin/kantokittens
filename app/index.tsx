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
    // FIX: Redirect to the correct public URL /hometab based on your file structure
    return <Redirect href="/hometab" />; 
  }
  
  // Assuming login screen is at app/(auth)/login.tsx (public URL /login)
  return <Redirect href="/login" />;
}
