// lib/rtdb.ts (New file for Realtime Database functions)

// Import the correct modular functions
import { child, Database, get, ref } from 'firebase/database';

// Assume 'User' type is defined elsewhere in your navigation/types.ts
import { User } from '../navigation/types';

// The helper function needs to accept a Realtime Database instance
export const getUser = async (databaseInstance: Database, uid: string): Promise<User | null> => {
  try {
    // Construct the reference to the specific user's node: /users/{uid}
    const dbRef = ref(databaseInstance);
    const userRef = child(dbRef, `users/${uid}`);
    
    // Get the data once
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // Return the data retrieved from the database node
      return snapshot.val() as User;
    } else {
      console.log("No user data available in Realtime DB for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error getting user data from Realtime DB:", error);
    throw error;
  }
};
