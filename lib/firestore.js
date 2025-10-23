
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const addUser = async (user) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), user);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
