import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
let app: any;
let auth: any;
let firestore: any;
let functions: any;

export const initialize = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    functions = getFunctions(app);
  }

  return { app, auth, firestore, functions };
};

export const getFirebaseAuth = () => {
  if (!auth) {
    const { auth: newAuth } = initialize();
    return newAuth;
  }
  return auth;
};

export const getFirebaseFirestore = () => {
  if (!firestore) {
    const { firestore: newFirestore } = initialize();
    return newFirestore;
  }
  return firestore;
};

export const getFirebaseFunctions = () => {
  if (!functions) {
    const { functions: newFunctions } = initialize();
    return newFunctions;
  }
  return functions;
};
