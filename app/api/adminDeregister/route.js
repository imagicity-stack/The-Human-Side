import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProgram } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = await req.json();
    const { id } = body;
    const program = body && body.program === "voices-unheard" ? "voices-unheard" : "membership";
    if (!id) return NextResponse.json({ error: "Registration id is required." }, { status: 400 });
    const cfg = getProgram(program);
    const ref = getDb().collection(cfg.collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    await ref.update({
      status: "deregistered",
      deregisteredAt: FieldValue.serverTimestamp(),
      deregisteredBy: auth.user.email,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("adminDeregister failed", err);
    return NextResponse.json({ error: "Could not deregister." }, { status: 500 });
  }
}
