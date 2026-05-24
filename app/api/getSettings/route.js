import { NextResponse } from "next/server";
import { getCurrentFee, CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const amount = await getCurrentFee();
  return NextResponse.json({ amount, currency: CURRENCY });
}
