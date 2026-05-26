import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const timeout = (ms, msg) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

export async function GET() {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const npKeyId = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();

  const env = {
    RAZORPAY_KEY_ID_value: keyId,
    RAZORPAY_KEY_ID_length: keyId.length,
    NEXT_PUBLIC_RAZORPAY_KEY_ID_value: npKeyId,
    keys_match: keyId === npKeyId,
    RAZORPAY_mode: keyId.startsWith("rzp_live") ? "live" : keyId.startsWith("rzp_test") ? "test" : "unknown",
    RAZORPAY_KEY_SECRET_present: !!process.env.RAZORPAY_KEY_SECRET,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || null,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY_looks_valid:
      !!process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY"),
    FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID || "the-human-side",
  };

  // Firestore reachability
  let firestore = "unknown", firestoreError = null;
  try {
    await Promise.race([
      getDb().collection("settings").doc("registration").get(),
      timeout(8000, "Firestore timed out — database unreachable."),
    ]);
    firestore = "ok";
  } catch (e) { firestore = "error"; firestoreError = e.message; }

  // Razorpay order creation (this is exactly what /api/createOrder does)
  let razorpay = "unknown", razorpayError = null, testOrderId = null;
  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: (process.env.RAZORPAY_KEY_SECRET || "").trim() });
    const order = await Promise.race([
      rzp.orders.create({ amount: 100, currency: "INR", receipt: "healthcheck" }),
      timeout(8000, "Razorpay timed out."),
    ]);
    testOrderId = order.id;
    razorpay = "ok";
  } catch (e) {
    razorpay = "error";
    razorpayError = (e && e.error && e.error.description) || (e && e.message) || String(e);
  }

  return NextResponse.json({
    ok: firestore === "ok" && razorpay === "ok",
    firestore, firestoreError,
    razorpay, razorpayError, testOrderId,
    env,
  });
}
