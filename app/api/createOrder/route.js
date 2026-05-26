import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { cleanRegistration, getCurrentFee, CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const reg = cleanRegistration(await req.json());
    if (!reg.firstName || !reg.email || !reg.phone) {
      return NextResponse.json({ error: "First name, email and phone are required." }, { status: 400 });
    }

    const fee = await getCurrentFee();
    const db = getDb();
    const docRef = await db.collection("members").add({
      ...reg,
      membershipFee: fee,
      currency: CURRENCY,
      status: "pending_payment",
      memberId: null,
      memberNumber: null,
      paymentId: null,
      orderId: null,
      createdAt: FieldValue.serverTimestamp(),
      source: "get-involved",
    });

    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: (process.env.RAZORPAY_KEY_SECRET || "").trim(),
    });
    const order = await rzp.orders.create({
      amount: fee * 100,
      currency: CURRENCY,
      receipt: docRef.id,
      notes: { type: "volunteer-membership", registrationId: docRef.id },
    });

    await docRef.update({ orderId: order.id });

    return NextResponse.json({
      registrationId: docRef.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      fee,
    });
  } catch (err) {
    console.error("createOrder failed", err);
    return NextResponse.json({ error: "Could not create the order. Please try again." }, { status: 500 });
  }
}
