import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
