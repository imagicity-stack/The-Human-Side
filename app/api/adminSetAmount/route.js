import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";
import { CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const amount = Math.floor(Number((await req.json()).amount));
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000000) {
      return NextResponse.json({ error: "Enter a valid amount (₹1–₹1,00,00,000)." }, { status: 400 });
    }
    await getDb().collection("settings").doc("registration").set(
      { amount, currency: CURRENCY, updatedAt: FieldValue.serverTimestamp(), updatedBy: auth.user.email },
      { merge: true }
    );
    return NextResponse.json({ ok: true, amount });
  } catch (err) {
    console.error("adminSetAmount failed", err);
    return NextResponse.json({ error: "Could not update amount." }, { status: 500 });
  }
}
