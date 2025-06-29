import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBne3_F37fjMGljrqGUl48YdkpYQiQuJ-U",
  authDomain: "deck-cf8a9.firebaseapp.com",
  projectId: "deck-cf8a9",
  storageBucket: "deck-cf8a9.appspot.com",
  messagingSenderId: "325918778727",
  appId: "1:325918778727:web:9c2cebb209f9612aacbbc2",
  measurementId: "G-KXLEVEYVSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export a single object containing auth and db
export { auth, db };
