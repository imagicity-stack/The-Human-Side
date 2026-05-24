import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/firebaseAdmin";
import { finalizeMembership } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const raw = await req.text(); // raw body required for signature
    const signature = req.headers.get("x-razorpay-signature");
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(raw)
      .digest("hex");
    if (!signature || signature !== expected) {
      return new NextResponse("invalid signature", { status: 400 });
    }

    const event = JSON.parse(raw);
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload && event.payload.payment && event.payload.payment.entity;
      if (payment && payment.order_id) {
        const q = await getDb().collection("members").where("orderId", "==", payment.order_id).limit(1).get();
        if (!q.empty) {
          await finalizeMembership(q.docs[0].id, payment.id, payment.order_id);
        }
      }
    }
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("razorpayWebhook failed", err);
    return new NextResponse("error", { status: 500 });
  }
}
