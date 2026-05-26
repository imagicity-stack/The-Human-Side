import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAdmin } from "@/lib/adminAuth";
import { getCurrentFee, CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const snap = await getDb().collection("members").get();
    const now = new Date();
    const thisKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const stats = {
      total: 0, active: 0, pending: 0, deregistered: 0,
      revenue: 0, thisMonth: 0, thisMonthRevenue: 0, currency: CURRENCY,
      byMonth: {}, revenueByMonth: {}, byRole: {}, byCity: {}, byInterest: {}, byTshirt: {},
    };
    snap.forEach((d) => {
      const m = d.data();
      stats.total += 1;
      const status = m.status || "pending_payment";
      if (status === "active") {
        stats.active += 1;
        const fee = Number(m.membershipFee) || 0;
        stats.revenue += fee;
        if (m.role) stats.byRole[m.role] = (stats.byRole[m.role] || 0) + 1;
        if (m.city) stats.byCity[m.city] = (stats.byCity[m.city] || 0) + 1;
        if (m.tshirtSize) stats.byTshirt[m.tshirtSize] = (stats.byTshirt[m.tshirtSize] || 0) + 1;
        (m.interests || []).forEach((i) => { stats.byInterest[i] = (stats.byInterest[i] || 0) + 1; });
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
    const currentFee = await getCurrentFee();
    return NextResponse.json({ stats, currentFee });
  } catch (err) {
    console.error("adminStats failed", err);
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
