import { User } from '../navigation/RootStackParamList';
import { auth } from './firebase';

// lib/firestore.ts or wherever you define this function

import { firestore } from './firebase'; // Adjust path as necessary

export const addUser = async (user: User) => {
  try {
    // Get the Firestore instance and reference the 'users' collection
    const usersCollectionRef = firestore().collection('users');
    
    // Reference the specific document using the user's UID
    const userDocRef = usersCollectionRef.doc(user.uid);
    
    // Set the user data for that document
    await userDocRef.set(user);
    
    console.log(`User ${user.uid} added to Firestore.`);
  } catch (error) {
    console.error(`Error adding user ${user.uid} to Firestore:`, error);
  }
};


// Function to retrieve a user from the 'users' collection
export const getUser = async (uid: string) => {
  try {
    // Reference the specific document using the user's UID
    const userDocRef = firestore().collection('users').doc(uid);
    
    // Get the document snapshot
    const docSnapshot = await userDocRef.get();

    // Check if the document exists and return the data as a User type
    if (docSnapshot) {
      return docSnapshot.data() as User;
    }
    
    return null;

  } catch (error) {
    console.error(`Error getting user ${uid} from Firestore:`, error);
    return null;
  }
};

export const secureLogin = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const userUid = userCredential.user.uid;

        // userUid validation
        if (!userUid) {
            console.error("Firebase Auth failed to provide a UID.");
            return null;
        }

        // Fetch additional user data from Firestore
        const docSnap = await firestore().collection('users').doc(userUid).get();

        if (docSnap) {
            return {
                uid: docSnap.id,
                ...docSnap.data() as Omit<User, 'uid'>
            };
        } else {
            console.warn("No such user document in Firestore! User needs to register.");
            return null;
        }
    } catch (error: any) { // Use `any` for better error type handling
        console.error('Firebase Auth login failed:', error);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('Invalid username or password.');
        } else if (error.code === 'auth/user-not-found') {
            throw new Error('Sorry, we can\'t find this account.');
        } else {
            // The native SDK handles offline persistence, so the 'unavailable'
            // error is less common but can be handled for robustness.
            if (error.code === 'unavailable') {
                 throw new Error('Network error. Please check your internet connection.');
            }
            throw new Error('API call failed: ' + error.message);
        }
    }
};