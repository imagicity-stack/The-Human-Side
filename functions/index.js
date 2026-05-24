/* ============================================================
   The Human Side — membership Cloud Functions (Firebase v2)
   ============================================================

   Two HTTPS endpoints back the get-involved.html registration flow:

     POST /createOrder
       Body: the volunteer registration fields.
       Saves a /members doc (status: pending_payment) via the Admin SDK
       and creates a Razorpay order. Returns { registrationId, orderId,
       amount, currency, keyId }.

     POST /verifyPayment
       Body: { registrationId, razorpay_payment_id, razorpay_order_id,
               razorpay_signature }.
       Verifies the signature with the Razorpay SECRET key, then issues a
       unique sequential member ID (THS001, THS002, …) inside a Firestore
       transaction and marks the registration active. Returns { memberId }.

   ------------------------------------------------------------
   SETUP (one time):
     1. cd functions && npm install
     2. Set the Razorpay credentials as secrets:
          firebase functions:secrets:set RAZORPAY_KEY_ID
          firebase functions:secrets:set RAZORPAY_KEY_SECRET
        (Use your rzp_test_… / rzp_live_… key id and its secret.)
     3. Deploy:
          firebase deploy --only functions,firestore:rules
        Deploy hosting too (firebase deploy) to get same-origin
        /createOrder and /verifyPayment via the rewrites in firebase.json.

   The same RAZORPAY_KEY_ID must also be set in assets/config.js so the
   browser can render the checkout sheet. The SECRET stays server-only.
   ============================================================ */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

const MEMBERSHIP_FEE = 999; // INR
const CURRENCY = "INR";

// Restrict to your real domain(s) in production, e.g.
// ["https://thehumanside.org", "https://www.thehumanside.org"].
const CORS = true;

// Whitelist + length-cap the fields we accept from the browser so a
// malicious client can't bloat documents or inject unexpected keys.
function cleanRegistration(body) {
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const arr = (v) =>
    Array.isArray(v)
      ? v.filter((x) => typeof x === "string").slice(0, 20).map((x) => x.slice(0, 100))
      : [];
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

exports.createOrder = onRequest(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET], cors: CORS },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed." });
    }
    try {
      const reg = cleanRegistration(req.body || {});
      if (!reg.firstName || !reg.email || !reg.phone) {
        return res.status(400).json({ error: "First name, email and phone are required." });
      }

      // 1) Persist the pending registration (Admin SDK — bypasses rules).
      const docRef = await db.collection("members").add({
        ...reg,
        membershipFee: MEMBERSHIP_FEE,
        currency: CURRENCY,
        status: "pending_payment",
        memberId: null,
        memberNumber: null,
        paymentId: null,
        orderId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "get-involved.html",
      });

      // 2) Create the Razorpay order tied to this registration.
      const rzp = new Razorpay({
        key_id: RAZORPAY_KEY_ID.value(),
        key_secret: RAZORPAY_KEY_SECRET.value(),
      });
      const order = await rzp.orders.create({
        amount: MEMBERSHIP_FEE * 100, // paise
        currency: CURRENCY,
        receipt: docRef.id,
        notes: { type: "volunteer-membership", registrationId: docRef.id },
      });

      await docRef.update({ orderId: order.id });

      return res.json({
        registrationId: docRef.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID.value(),
      });
    } catch (err) {
      logger.error("createOrder failed", err);
      return res.status(500).json({ error: "Could not create the order. Please try again." });
    }
  }
);

exports.verifyPayment = onRequest(
  { secrets: [RAZORPAY_KEY_SECRET], cors: CORS },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed." });
    }
    try {
      const {
        registrationId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body || {};

      if (!registrationId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification fields." });
      }

      // Verify the signature: HMAC_SHA256(order_id + "|" + payment_id, secret).
      const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET.value())
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      const sigBuf = Buffer.from(razorpay_signature);
      const expBuf = Buffer.from(expected);
      const valid =
        sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

      if (!valid) {
        logger.warn("Invalid Razorpay signature", { registrationId, razorpay_payment_id });
        return res.status(400).json({ error: "Payment signature verification failed." });
      }

      const docRef = db.collection("members").doc(registrationId);
      const counterRef = db.collection("counters").doc("members");

      // Issue the member ID atomically; idempotent if called twice.
      const result = await db.runTransaction(async (tx) => {
        const memberSnap = await tx.get(docRef);
        if (!memberSnap.exists) throw new Error("registration-not-found");
        const member = memberSnap.data();

        if (member.orderId && member.orderId !== razorpay_order_id) {
          throw new Error("order-mismatch");
        }
        if (member.status === "active" && member.memberId) {
          return { memberId: member.memberId, already: true }; // already issued
        }

        const counterSnap = await tx.get(counterRef);
        const last = counterSnap.exists ? counterSnap.data().lastNumber || 0 : 0;
        const next = last + 1;
        const memberId = "THS" + String(next).padStart(3, "0");

        tx.set(
          counterRef,
          { lastNumber: next, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );
        tx.update(docRef, {
          status: "active",
          memberId,
          memberNumber: next,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { memberId, already: false };
      });

      return res.json({ memberId: result.memberId });
    } catch (err) {
      logger.error("verifyPayment failed", err);
      const message =
        err.message === "registration-not-found"
          ? "Registration not found."
          : err.message === "order-mismatch"
          ? "This payment does not match the registration."
          : "Verification failed. Please contact support.";
      return res.status(500).json({ error: message });
    }
  }
);
