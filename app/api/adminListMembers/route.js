import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const snap = await getDb().collection("members").orderBy("createdAt", "desc").limit(1000).get();
    const iso = (t) => (t && t.toDate ? t.toDate().toISOString() : null);
    const members = snap.docs.map((d) => {
      const m = d.data();
      return {
        id: d.id,
        memberId: m.memberId || null,
        firstName: m.firstName || "",
        lastName: m.lastName || "",
        email: m.email || "",
        phone: m.phone || "",
        city: m.city || "",
        role: m.role || "",
        status: m.status || "pending_payment",
        membershipFee: m.membershipFee || null,
        paymentId: m.paymentId || null,
        createdAt: iso(m.createdAt),
        paidAt: iso(m.paidAt),
      };
    });
    return NextResponse.json({ members });
  } catch (err) {
    console.error("adminListMembers failed", err);
    return NextResponse.json({ error: "Could not load members." }, { status: 500 });
  }
}
