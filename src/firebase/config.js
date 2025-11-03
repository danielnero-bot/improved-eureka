import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Helper to clear persisted auth data if it becomes corrupted
const clearPersistedAuth = () => {
  const keys = Object.keys(localStorage).filter((k) =>
    k.includes("firebase:authUser")
  );
  keys.forEach((k) => {
    console.warn("Clearing potentially corrupted auth data:", k);
    localStorage.removeItem(k);
  });
};

// Diagnostic logging for auth state changes
const setupAuthLogging = (auth) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.debug("Auth state changed - signed in user:", {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      });
      // Proactively refresh the token to catch any issues early
      user.getIdToken(true).catch((err) => {
        console.error("Failed to refresh token:", err);
        // If we can't get a token, the auth state might be corrupted
        if (err?.code === "auth/invalid-user-token") {
          console.warn("Invalid user token, clearing auth state...");
          clearPersistedAuth();
          signOut(auth); // Force a clean signOut
        }
      });
    } else {
      console.debug("Auth state changed - signed out");
    }
  });
};

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

// Set up diagnostic logging
setupAuthLogging(auth);


// Ensure a consistent persistence model and surface errors during setup.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  // Non-fatal: log and continue. This helps when browser storage is restricted.
  // If this fails repeatedly, the SDK may attempt to refresh the current user
  // and could surface errors like identitytoolkit accounts:lookup 400.
  console.warn("Firebase auth setPersistence failed:", err);
  // If persistence fails, check if we have corrupted auth data
  if (err?.code === "auth/invalid-persistence-type") {
    clearPersistedAuth();
  }
});

export default app;
