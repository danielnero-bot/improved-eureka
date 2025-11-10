import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

/* ----------------------------
   🔹 Firebase Configuration
----------------------------- */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ----------------------------
   🔹 Initialize Firebase
----------------------------- */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ----------------------------
   🧩 Helper — Clear corrupted auth
----------------------------- */
const clearCorruptedAuth = () => {
  const keys = Object.keys(localStorage).filter((k) =>
    k.includes("firebase:authUser")
  );
  if (keys.length) {
    console.warn("🧹 Clearing possibly corrupted Firebase auth data:", keys);
    keys.forEach((k) => localStorage.removeItem(k));
  }
};

/* ----------------------------
   🧭 Setup Auth Monitoring
----------------------------- */
const monitorAuthState = (authInstance) => {
  onAuthStateChanged(authInstance, async (user) => {
    if (user) {
      console.debug("✅ Signed in:", {
        uid: user.uid,
        email: user.email,
        verified: user.emailVerified,
      });

      // Refresh token proactively to avoid stale tokens
      try {
        await user.getIdToken(true);
      } catch (err) {
        console.error("🚨 Token refresh failed:", err);

        if (err?.code === "auth/invalid-user-token") {
          console.warn("Invalid user token — resetting auth state...");
          clearCorruptedAuth();
          signOut(authInstance);
        }
      }
    } else {
      console.debug("🚪 Signed out");
    }
  });
};

/* ----------------------------
   ⚙️ Set Persistence
----------------------------- */
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("⚠️ Failed to set auth persistence:", err);

  // If persistence type is invalid, clear stored data
  if (err?.code === "auth/invalid-persistence-type") {
    clearCorruptedAuth();
  }
});

/* ----------------------------
   🔹 Initialize Auth Logging
----------------------------- */
monitorAuthState(auth);

export default app;
