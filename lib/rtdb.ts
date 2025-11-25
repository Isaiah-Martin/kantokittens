// lib/rtdb.ts

import { Platform } from 'react-native';
import { User } from '../navigation/types';

// Define a type for the RTDB service instance for better type safety
// This covers both Web (Database from 'firebase/database') and Native (Database from '@react-native-firebase/database')
type DatabaseService = any; 

/**
 * Retrieves a user's data from the Realtime Database.
 * @param databaseInstance The initialized RTDB instance (web or native).
 * @param uid The user's UID.
 * @returns A promise that resolves to the user data or null.
 */
export const getUser = async (databaseInstance: DatabaseService, uid: string): Promise<User | null> => {
  try {
    let userData: User | null = null;

    if (Platform.OS === 'web') {
      // *** WEB PLATFORM LOGIC (Modular SDK) ***
      // We use dynamic import here so these imports don't run on native
      const { ref, child, get } = await import('firebase/database');

      // Construct the reference to the specific user's node: /users/{uid}
      const dbRef = ref(databaseInstance);
      const userRef = child(dbRef, `users/${uid}`);

      // Get the data once
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        userData = snapshot.val() as User;
      } else {
        console.log("No data available for user (web)");
      }

    } else {
      // *** NATIVE PLATFORM LOGIC (@react-native-firebase) ***
      // The native library uses a different API style and expects a native instance
      const userRef = databaseInstance.ref(`users/${uid}`);
      
      // Use .once() for a single read in the native SDK
      const snapshot = await userRef.once('value');

      if (snapshot.exists()) {
        userData = snapshot.val() as User;
      } else {
        console.log("No data available for user (native)");
      }
    }

    return userData;

  } catch (error) {
    console.error("Error getting user data from Realtime DB:", error);
    // Rethrow the error so AuthContext can handle retries/state updates
    throw error; 
  }
};
