// hooks/use-auth-redirect.ts (Revised with Debugging Logs and Error Handling)

import { useRouter, useSegments } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuthRedirect() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    try {
      console.log('useAuthRedirect: Effect running, loading:', loading, 'isLoggedIn:', isLoggedIn, 'segments:', segments);

      if (!loading) {
        const inAuthGroup = segments[0] === '(auth)';
        console.log('useAuthRedirect: Loading complete. In auth group:', inAuthGroup);

        if (isLoggedIn && inAuthGroup) {
          console.log('useAuthRedirect: Logged in, redirecting to app index "/"');
          // User is logged in and trying to access auth pages, redirect to main app index
          router.replace('/'); 
        } else if (!isLoggedIn && !inAuthGroup) {
          console.log('useAuthRedirect: Not logged in, redirecting to login "/(auth)/login"');
          // User is not logged in and trying to access protected pages, redirect to login
          router.replace('/(auth)/login');
        } else {
          console.log('useAuthRedirect: No redirect needed, staying on current route.');
        }
      }
    } catch (error) {
      console.error('useAuthRedirect: An error occurred during redirection logic:', error);
      // You can add additional logic here if needed, e.g., navigate to an error screen
    }
  }, [isLoggedIn, loading, segments, router]);
}
