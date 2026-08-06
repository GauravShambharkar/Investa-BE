import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} from "./env.config.js";

let app: App | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (!getApps().length) {
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    try {
      app = initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY,
        }),
      });
      db = getFirestore(app);
      auth = getAuth(app);
      console.log("🔥 Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.warn("⚠️ Failed to initialize Firebase Admin SDK:", error);
    }
  } else {
    console.log(
      "ℹ️ Firebase Admin SDK credentials not fully configured in env files.",
    );
  }
} else {
  app = getApps()[0];
  if (app) {
    db = getFirestore(app);
    auth = getAuth(app);
  }
}

export { app as firebaseAdminApp, db, auth };
