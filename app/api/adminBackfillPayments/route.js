import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-time (re-runnable) backfill: create payment-ledger records for any
// active member whose transaction isn't already in the payments collection.
export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const db = getDb();
    const [membersSnap, paymentsSnap] = await Promise.all([
      db.collection("members").where("status", "==", "active").get(),
      db.collection("payments").get(),
    ]);
    const existing = new Set(paymentsSnap.docs.map((d) => d.id));

    const missing = [];
    membersSnap.forEach((doc) => {
      const m = doc.data();
      if (m.paymentId && !existing.has(m.paymentId)) missing.push({ id: doc.id, m });
    });

    let created = 0;
    for (let i = 0; i < missing.length; i += 450) {
      const batch = db.batch();
      for (const { id, m } of missing.slice(i, i + 450)) {
        batch.set(db.collection("payments").doc(m.paymentId), {
          paymentId: m.paymentId,
          orderId: m.orderId || null,
          registrationId: id,
          memberId: m.memberId || null,
          memberNumber: m.memberNumber || null,
          name: [m.firstName, m.lastName].filter(Boolean).join(" ").trim(),
          email: m.email || "",
          amount: m.membershipFee || null,
          currency: m.currency || "INR",
          type: "membership",
          status: "captured",
          createdAt: m.paidAt || m.createdAt || FieldValue.serverTimestamp(),
          backfilled: true,
        });
        created += 1;
      }
      await batch.commit();
    }

    return NextResponse.json({
      ok: true,
      created,
      skipped: membersSnap.size - created,
      activeMembers: membersSnap.size,
    });
  } catch (err) {
    console.error("adminBackfillPayments failed", err);
    return NextResponse.json({ error: "Backfill failed: " + (err.message || String(err)) }, { status: 500 });
  }
}
