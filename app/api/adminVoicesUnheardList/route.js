import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProgram } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const cfg = getProgram("voices-unheard");
    const snap = await getDb().collection(cfg.collection).orderBy("createdAt", "desc").limit(1000).get();
    const iso = (t) => (t && t.toDate ? t.toDate().toISOString() : null);
    const registrations = snap.docs.map((d) => {
      const m = d.data();
      return {
        id: d.id,
        memberId: m.memberId || null,
        firstName: m.firstName || "",
        lastName: m.lastName || "",
        email: m.email || "",
        phone: m.phone || "",
        classGrade: m.classGrade || "",
        section: m.section || "",
        school: m.school || "",
        city: m.city || "",
        gender: m.gender || "",
        bloodGroup: m.bloodGroup || "",
        tshirtSize: m.tshirtSize || "",
        guardianName: m.guardianName || "",
        guardianRelation: m.guardianRelation || "",
        guardianPhone: m.guardianPhone || "",
        guardianEmail: m.guardianEmail || "",
        emergencyName: m.emergencyName || "",
        emergencyPhone: m.emergencyPhone || "",
        medicalNotes: m.medicalNotes || "",
        hearAbout: m.hearAbout || "",
        status: m.status || "pending_payment",
        membershipFee: m.membershipFee || null,
        paymentId: m.paymentId || null,
        createdAt: iso(m.createdAt),
        paidAt: iso(m.paidAt),
      };
    });
    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("adminVoicesUnheardList failed", err);
    return NextResponse.json({ error: "Could not load Voices Unheard registrations." }, { status: 500 });
  }
}
