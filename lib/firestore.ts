import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from './types';

export const addUser = async (user: User) => {
  const usersCollectionRef = collection(db, 'users');
  const userDocRef = doc(usersCollectionRef, user.uid);
  await setDoc(userDocRef, user);
};

// Function to retrieve a user from the 'users' collection
export const getUser = async (uid: string) => {
  const usersCollectionRef = collection(db, 'users');
  const userDocRef = doc(usersCollectionRef, uid);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    return docSnapshot.data() as User;
  }
  return null;
};

export const secureLogin = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userUid = userCredential.user.uid;

        //user Uid validation
        if (!userUid) {
            console.error("Firebase Auth failed to provide a UID.");
            return null;
        }

        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', userUid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return {
                uid: docSnap.id,
                ...docSnap.data() as Omit<User, 'uid'>
            };
        } else {
            console.warn("No such user document in Firestore! User needs to register.");
            return null;
        }
    } catch (error: any) {
        console.error('Firebase Auth login failed:', error);
        if (error.code === 'auth/wrong-password') {
            throw new Error('Password error');
        } else if (error.code === 'auth/user-not-found') {
            throw new Error('Sorry, we can\'t find this account.');
        } else if (error.code === 'auth/invalid-credential') {
            console.error('Username, Password: ', password)
            throw new Error('Invalid Auth Credential');
        } else if (error.code === 'unavailable') { // Handle offline error explicitly
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error('API call failed: ' + error.message);
        }
    }
};