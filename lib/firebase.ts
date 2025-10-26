import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Native SDK handles initialization and persistence.
const firebaseConfig = {
  apiKey: "",
  authDomain: "kantokittensapp.firebaseapp.com",
  projectId: "kantokittensapp",
  storageBucket: "kantokittensapp.appspot.com",
  messagingSenderId: "1056869055055",
  appId: "1:1056869055055:ios:1a113930cccc98858a483az",
  databaseURL: '',
};
export { auth, firebaseConfig, firestore };

