import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";
import { getCurrentFee, CURRENCY, getProgram } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const cfg = getProgram("voices-unheard");
    const snap = await getDb().collection(cfg.collection).get();
    const now = new Date();
    const thisKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const stats = {
      total: 0, active: 0, pending: 0, deregistered: 0,
      revenue: 0, thisMonth: 0, thisMonthRevenue: 0, currency: CURRENCY,
      byMonth: {}, revenueByMonth: {},
      byClass: {}, byGender: {}, byCity: {}, byTshirt: {},
      byGuardianRelation: {}, byHearAbout: {},
    };
    snap.forEach((d) => {
      const m = d.data();
      stats.total += 1;
      const status = m.status || "pending_payment";
      if (status === "active") {
        stats.active += 1;
        const fee = Number(m.membershipFee) || 0;
        stats.revenue += fee;
        if (m.classGrade) stats.byClass[m.classGrade] = (stats.byClass[m.classGrade] || 0) + 1;
        if (m.gender) stats.byGender[m.gender] = (stats.byGender[m.gender] || 0) + 1;
        if (m.city) stats.byCity[m.city] = (stats.byCity[m.city] || 0) + 1;
        if (m.tshirtSize) stats.byTshirt[m.tshirtSize] = (stats.byTshirt[m.tshirtSize] || 0) + 1;
        if (m.guardianRelation) stats.byGuardianRelation[m.guardianRelation] = (stats.byGuardianRelation[m.guardianRelation] || 0) + 1;
        if (m.hearAbout) stats.byHearAbout[m.hearAbout] = (stats.byHearAbout[m.hearAbout] || 0) + 1;
        const ts = m.paidAt || m.createdAt;
        if (ts && ts.toDate) {
          const d2 = ts.toDate();
          const key = d2.getFullYear() + "-" + String(d2.getMonth() + 1).padStart(2, "0");
          stats.byMonth[key] = (stats.byMonth[key] || 0) + 1;
          stats.revenueByMonth[key] = (stats.revenueByMonth[key] || 0) + fee;
          if (key === thisKey) { stats.thisMonth += 1; stats.thisMonthRevenue += fee; }
        }
      } else if (status === "deregistered") {
        stats.deregistered += 1;
      } else {
        stats.pending += 1;
      }
    });
    const currentFee = await getCurrentFee("voices-unheard");
    return NextResponse.json({ stats, currentFee });
  } catch (err) {
    console.error("adminVoicesUnheardStats failed", err);
    return NextResponse.json({ error: "Could not load Voices Unheard stats." }, { status: 500 });
  }
}
