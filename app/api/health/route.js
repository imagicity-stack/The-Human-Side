import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Visit /api/health in a browser to check the backend without dev tools.
// Reports which env vars are present (true/false, never the values) and
// whether the server can actually reach the named Firestore database.
export async function GET() {
  const env = {
    RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || null,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY_present: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_looks_valid:
      !!process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY"),
    FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID || "the-human-side",
  };

  let firestore = "unknown";
  let firestoreError = null;
  try {
    await Promise.race([
      getDb().collection("settings").doc("registration").get(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore timed out — the database is unreachable. Usually the credentials are wrong or the database id does not exist.")),
          8000
        )
      ),
    ]);
    firestore = "ok";
  } catch (e) {
    firestore = "error";
    firestoreError = e.message;
  }

  return NextResponse.json({ ok: firestore === "ok", firestore, firestoreError, env });
}
