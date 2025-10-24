import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAyCiXKPmqnTckLMXZzjAHMfztaUokhdP4",
  authDomain: "kantokittensapp.firebaseapp.com",
  projectId: "kantokittensapp",
  storageBucket: "kantokittensapp.appspot.com",
  messagingSenderId: "1056869055055",
  appId: "1:1056869055055:ios:1a113930cccc98858a483az"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
