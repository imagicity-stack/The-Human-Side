import { NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeMembership } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { registrationId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
    const program = body && body.program === "voices-unheard" ? "voices-unheard" : "membership";

    if (!registrationId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", (process.env.RAZORPAY_KEY_SECRET || "").trim())
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    const a = Buffer.from(razorpay_signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const result = await finalizeMembership(registrationId, razorpay_payment_id, razorpay_order_id, program);
    return NextResponse.json({ memberId: result.memberId });
  } catch (err) {
    console.error("verifyPayment failed", err);
    const message =
      err.message === "registration-not-found" ? "Registration not found."
      : err.message === "order-mismatch" ? "This payment does not match the registration."
      : "Verification failed. Please contact support.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
