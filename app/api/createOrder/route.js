import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { cleanRegistration, getCurrentFee, getProgram, CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const raw = await req.json();
    const program = raw && raw.program === "voices-unheard" ? "voices-unheard" : "membership";
    const cfg = getProgram(program);

    const reg = cleanRegistration(raw, program);
    if (!reg.firstName || !reg.email || !reg.phone) {
      return NextResponse.json({ error: "First name, email and phone are required." }, { status: 400 });
    }

    const fee = await getCurrentFee(program);
    const db = getDb();
    const docRef = await db.collection(cfg.collection).add({
      ...reg,
      program,
      membershipFee: fee,
      currency: CURRENCY,
      status: "pending_payment",
      memberId: null,
      memberNumber: null,
      paymentId: null,
      orderId: null,
      createdAt: FieldValue.serverTimestamp(),
      source: program === "voices-unheard" ? "voices-unheard" : "get-involved",
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
      notes: { type: program, registrationId: docRef.id },
    });

    await docRef.update({ orderId: order.id });

    return NextResponse.json({
      registrationId: docRef.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      fee,
      program,
    });
  } catch (err) {
    console.error("createOrder failed", err);
    return NextResponse.json(
      { error: "Could not create the order. Please try again.", detail: String((err && err.message) || err) },
      { status: 500 }
    );
  }
}
