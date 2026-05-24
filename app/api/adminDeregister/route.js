import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Member id is required." }, { status: 400 });
    const ref = getDb().collection("members").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Member not found." }, { status: 404 });
    await ref.update({
      status: "deregistered",
      deregisteredAt: FieldValue.serverTimestamp(),
      deregisteredBy: auth.user.email,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("adminDeregister failed", err);
    return NextResponse.json({ error: "Could not deregister member." }, { status: 500 });
  }
}
