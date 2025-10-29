import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Ensure a consistent persistence model and surface errors during setup.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  // Non-fatal: log and continue. This helps when browser storage is restricted.
  // If this fails repeatedly, the SDK may attempt to refresh the current user
  // and could surface errors like identitytoolkit accounts:lookup 400.
  // Keeping a visible console warning helps debugging in the browser.
  // eslint-disable-next-line no-console
  console.warn("Firebase auth setPersistence failed:", err);
});
export default app;
