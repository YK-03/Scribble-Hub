import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration, using Vite's environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// A simple check to make sure you've set up your .env file correctly
if (!firebaseConfig.apiKey) {
  throw new Error("Firebase config is not available. Make sure you have set up your .env file with VITE_ prefixed variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for use in other parts of your app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;