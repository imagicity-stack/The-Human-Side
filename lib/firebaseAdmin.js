import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialise the Admin SDK once, using a service account from env vars
// (set in Vercel). Works anywhere — no Google runtime required.
function getApp() {
  if (admin.apps.length) return admin.apps[0];
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function getDb() {
  return getFirestore(getApp(), process.env.FIRESTORE_DATABASE_ID || "the-human-side");
}

export function getAuthAdmin() {
  return admin.auth(getApp());
}
