import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Native SDK handles initialization and persistence.
const firebaseConfig = {
  apiKey: "",
  authDomain: "kantokittensapp.firebaseapp.com",
  projectId: "kantokittensapp",
  storageBucket: "kantokittensapp.appspot.com",
  messagingSenderId: "",
  appId: "",
  databaseURL: '',
};
export { auth, firebaseConfig, firestore };

