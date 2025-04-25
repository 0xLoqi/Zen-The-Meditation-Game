import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Real Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxBBullJD-NaqUICxltkzH-CvMPbp4Z3o",
  authDomain: "zen-the-meditation-game.firebaseapp.com",
  projectId: "zen-the-meditation-game",
  storageBucket: "zen-the-meditation-game.firebasestorage.app",
  messagingSenderId: "76071343497",
  appId: "1:76071343497:web:d4e838b86eedb78af77d58",
  measurementId: "G-7VKJDV25BE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // getAnalytics may fail in some environments (e.g. React Native without web support)
  analytics = null;
}

export { auth, db, analytics }; 