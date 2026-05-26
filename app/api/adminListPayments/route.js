import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const snap = await getDb().collection("payments").orderBy("createdAt", "desc").limit(1000).get();
    const iso = (t) => (t && t.toDate ? t.toDate().toISOString() : null);
    const payments = snap.docs.map((d) => {
      const p = d.data();
      return {
        id: d.id,
        paymentId: p.paymentId || d.id,
        orderId: p.orderId || "",
        memberId: p.memberId || "",
        name: p.name || "",
        email: p.email || "",
        amount: p.amount || null,
        currency: p.currency || "INR",
        type: p.type || "membership",
        status: p.status || "captured",
        createdAt: iso(p.createdAt),
      };
    });
    const totalCollected = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return NextResponse.json({ payments, totalCollected });
  } catch (err) {
    console.error("adminListPayments failed", err);
    return NextResponse.json({ error: "Could not load payments." }, { status: 500 });
  }
}
