import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";
import { sendWelcomeEmail } from "./mailer";

export const DEFAULT_FEE = 999;
export const CURRENCY = "INR";

export async function getCurrentFee() {
  try {
    const snap = await getDb().collection("settings").doc("registration").get();
    const amt = snap.exists ? Number(snap.data().amount) : NaN;
    if (Number.isFinite(amt) && amt > 0) return Math.floor(amt);
  } catch (e) {
    console.error("fee read failed", e);
  }
  return DEFAULT_FEE;
}

// Whitelist + length-cap incoming registration fields.
export function cleanRegistration(body = {}) {
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const arr = (v) =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 20).map((x) => x.slice(0, 100)) : [];
  return {
    firstName: str(body.firstName, 100),
    lastName: str(body.lastName, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 30),
    dob: str(body.dob, 20),
    gender: str(body.gender, 30),
    bloodGroup: str(body.bloodGroup, 5),
    address: str(body.address, 300),
    city: str(body.city, 100),
    state: str(body.state, 100),
    pincode: str(body.pincode, 10),
    role: str(body.role, 100),
    organisation: str(body.organisation, 200),
    classOrDesignation: str(body.classOrDesignation, 100),
    interests: arr(body.interests),
    tshirtSize: str(body.tshirtSize, 10),
    emergencyName: str(body.emergencyName, 100),
    emergencyPhone: str(body.emergencyPhone, 30),
    hearAbout: str(body.hearAbout, 100),
    motivation: str(body.motivation, 2000),
  };
}

// Atomically issue the member ID + email; idempotent. registrationId = doc id.
export async function finalizeMembership(registrationId, paymentId, orderId) {
  const db = getDb();
  const docRef = db.collection("members").doc(registrationId);
  const counterRef = db.collection("counters").doc("members");

  const out = await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) throw new Error("registration-not-found");
    const m = snap.data();
    if (m.orderId && orderId && m.orderId !== orderId) throw new Error("order-mismatch");
    if (m.status === "active" && m.memberId) return { memberId: m.memberId, already: true, member: m };

    const cSnap = await tx.get(counterRef);
    const last = cSnap.exists ? cSnap.data().lastNumber || 0 : 0;
    const next = last + 1;
    const memberId = "THS" + String(next).padStart(3, "0");

    tx.set(counterRef, { lastNumber: next, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    tx.update(docRef, {
      status: "active",
      memberId,
      memberNumber: next,
      paymentId,
      orderId: orderId || m.orderId,
      paidAt: FieldValue.serverTimestamp(),
    });

    // Record the transaction in a separate payments ledger (idempotent by paymentId).
    const paymentRef = db.collection("payments").doc(paymentId);
    tx.set(
      paymentRef,
      {
        paymentId,
        orderId: orderId || m.orderId || null,
        registrationId,
        memberId,
        memberNumber: next,
        name: [m.firstName, m.lastName].filter(Boolean).join(" ").trim(),
        email: m.email || "",
        amount: m.membershipFee || null,
        currency: m.currency || "INR",
        type: "membership",
        status: "captured",
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { memberId, already: false, member: { ...m, memberId } };
  });

  if (!out.already) {
    try { await sendWelcomeEmail(out.member); }
    catch (e) { console.error("welcome email failed", e); }
  }
  return out;
}
