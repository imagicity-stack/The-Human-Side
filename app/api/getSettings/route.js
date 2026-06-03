import { NextResponse } from "next/server";
import { getCurrentFee, CURRENCY } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const program = url.searchParams.get("program") === "voices-unheard" ? "voices-unheard" : "membership";
  const amount = await getCurrentFee(program);
  return NextResponse.json({ amount, currency: CURRENCY, program });
}
