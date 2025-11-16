// hooks/use-auth-redirect.ts
import { useRouter, useSegments } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuthRedirect() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (isLoggedIn && inAuthGroup) {
        // User is logged in and trying to access auth pages, redirect to main app index
        router.replace('/'); 
      } else if (!isLoggedIn && !inAuthGroup) {
        // User is not logged in and trying to access protected pages, redirect to login
        router.replace('/(auth)/login');
      }
    }
  }, [isLoggedIn, loading, segments, router]);
}
