import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, initializeAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Real Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxBBullJD-NaqUICxltkzH-CvMPbp4Z3o",
  authDomain: "zen-the-meditation-game.firebaseapp.com",
  projectId: "zen-the-meditation-game",
  storageBucket: "zen-the-meditation-game.appspot.com",
  messagingSenderId: "76071343497",
  appId: "1:76071343497:web:d4e838b86eedb78af77d58",
  measurementId: "G-7VKJDV25BE"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let auth;
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  // Native (Expo/React Native)
  const { getReactNativePersistence } = require('firebase/auth');
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  // Web
  auth = getAuth(app);
}
export { auth };

export async function syncUserDoc(uid, state) {
  if (!uid) throw new Error('No UID provided');
  try {
    await setDoc(doc(db, 'users', uid), state, { merge: true });
    console.log('[Firestore] User doc created for', uid);
  } catch (e) {
    console.error('[Firestore] Failed to create user doc', e);
  }
}

export async function getUserDoc(uid) {
  if (!uid) throw new Error('No UID provided');
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('[Firestore] Failed to fetch user doc', e);
    return null;
  }
}

// Ensure user is always signed in (anonymously if needed)
export async function ensureSignedIn() {
  return new Promise((resolve, reject) => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsub();
        resolve(user);
      } else {
        try {
          const anon = await signInAnonymously(auth);
          unsub();
          resolve(anon.user);
        } catch (err) {
          unsub();
          reject(err);
        }
      }
    });
  });
}