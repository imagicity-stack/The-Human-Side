/* ============================================================
   The Human Side — backend Cloud Functions (Firebase v2)
   ============================================================

   Public (called by the static site on Vercel):
     POST /createOrder    Save a pending registration + create a Razorpay
                          order (amount read live from settings/registration).
     POST /verifyPayment  Verify the Razorpay signature, issue the unique
                          member ID (THS001…), email a welcome, return id.
     GET|POST /getSettings  Return the current registration fee + currency.
     POST /razorpayWebhook  Razorpay → server. Backstop that finalises a
                          membership even if the browser closed after paying.

   Admin (require a Firebase Auth ID token for ADMIN_EMAIL):
     POST /adminStats      Aggregate analytics.
     POST /adminListMembers  Member list.
     POST /adminDeregister   Soft-deregister a member  { id }.
     POST /adminSetAmount    Change the registration fee { amount }.

   ------------------------------------------------------------
   SECRETS (firebase functions:secrets:set NAME):
     RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, SMTP_PASS
   PARAMS (functions/.env or deploy-time, see .env.example):
     ALLOWED_ORIGINS, ADMIN_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_SECURE,
     SMTP_USER, MAIL_FROM
   ============================================================ */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Firestore database id. This project uses a NAMED database ("the-human-side"),
// not the "(default)" one, so the Admin SDK is pointed at it explicitly.
const DATABASE_ID = "the-human-side";

admin.initializeApp();
const db = getFirestore(admin.app(), DATABASE_ID);
const FieldValue = admin.firestore.FieldValue;

// --- secrets ---
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = defineSecret("RAZORPAY_WEBHOOK_SECRET");
const SMTP_PASS = defineSecret("SMTP_PASS");

// --- params (non-secret) ---
const ALLOWED_ORIGINS = defineString("ALLOWED_ORIGINS", { default: "" });
const ADMIN_EMAIL = defineString("ADMIN_EMAIL", { default: "admin@thehumanside.org" });
const SMTP_HOST = defineString("SMTP_HOST", { default: "" });
const SMTP_PORT = defineString("SMTP_PORT", { default: "587" });
const SMTP_SECURE = defineString("SMTP_SECURE", { default: "false" });
const SMTP_USER = defineString("SMTP_USER", { default: "" });
const MAIL_FROM = defineString("MAIL_FROM", { default: "The Human Side <contact@edenwoods.org>" });

const DEFAULT_FEE = 999;
const CURRENCY = "INR";
const settingsRef = () => db.collection("settings").doc("registration");

// ============================================================
// CORS
// ============================================================
function applyCors(req, res) {
  const allowed = (ALLOWED_ORIGINS.value() || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (allowed.length === 0) {
    res.set("Access-Control-Allow-Origin", "*"); // open while setting up
  } else if (origin && allowed.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  } else {
    res.set("Access-Control-Allow-Origin", allowed[0]);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
}
function preflight(req, res) {
  if (req.method === "OPTIONS") { res.status(204).send(""); return true; }
  return false;
}

// ============================================================
// Helpers
// ============================================================
async function getCurrentFee() {
  try {
    const snap = await settingsRef().get();
    const amt = snap.exists ? Number(snap.data().amount) : NaN;
    if (Number.isFinite(amt) && amt > 0) return Math.floor(amt);
  } catch (e) {
    logger.warn("Could not read registration fee, using default", e);
  }
  return DEFAULT_FEE;
}

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

function makeTransport() {
  const host = SMTP_HOST.value();
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(SMTP_PORT.value() || 587),
    secure: String(SMTP_SECURE.value()) === "true",
    auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
  });
}

function welcomeEmailHtml(m) {
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Volunteer";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F4FB;font-family:Arial,Helvetica,sans-serif;color:#2A1747;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4FB;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px -25px rgba(42,23,71,.4);">
        <tr><td style="background:linear-gradient(135deg,#1F1036,#2A1747);padding:36px 36px 28px;">
          <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#B68AD0;">The Human Side</div>
          <div style="font-size:28px;font-weight:700;color:#ffffff;margin-top:8px;line-height:1.15;">Welcome — you're officially in.</div>
        </td></tr>
        <tr><td style="padding:32px 36px 8px;">
          <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Dear ${name},</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 22px;">Thank you for registering as a volunteer of <strong>The Human Side</strong>. Your one-time membership is confirmed, and here is your official member ID:</p>
          <div style="text-align:center;margin:0 0 26px;">
            <div style="display:inline-block;background:linear-gradient(140deg,#1F1036,#2A1747);border-radius:12px;padding:22px 40px;">
              <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B68AD0;">Member ID</div>
              <div style="font-size:40px;font-weight:700;color:#ffffff;letter-spacing:.04em;margin-top:6px;">${m.memberId}</div>
            </div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 10px;">Your membership includes:</p>
          <ul style="font-size:15px;line-height:1.7;margin:0 0 22px;padding-left:20px;color:#4A3168;">
            <li>Official T-shirt, pin badge &amp; digital membership ID</li>
            <li>Access to all official social-service drives</li>
            <li>Participation certificates &amp; recognition</li>
            <li>Volunteer leadership roles &amp; the annual impact report</li>
          </ul>
          <p style="font-size:15px;line-height:1.6;margin:0 0 6px;">We'll be in touch with kit dispatch details and the date of the next drive. Reply to this email any time — we read everything.</p>
        </td></tr>
        <tr><td style="padding:18px 36px 36px;border-top:1px solid #ECE5F3;">
          <p style="font-size:15px;font-style:italic;color:#7C3F98;margin:18px 0 4px;">The side that still cares.</p>
          <p style="font-size:12px;color:#8E83A4;margin:0;">An initiative of Edenwoods Eduhub Foundation, in partnership with The Elden Heights School.</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

async function sendWelcomeEmail(member) {
  const transport = makeTransport();
  if (!transport) { logger.info("SMTP not configured — skipping welcome email"); return; }
  if (!member.email) return;
  await transport.sendMail({
    from: MAIL_FROM.value(),
    to: member.email,
    subject: `Welcome to The Human Side — your member ID is ${member.memberId}`,
    html: welcomeEmailHtml(member),
  });
}

// Issue the member ID atomically + email; idempotent. Used by verify + webhook.
async function finalizeMembership(docRef, paymentId, orderId) {
  const counterRef = db.collection("counters").doc("members");
  const out = await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) throw new Error("registration-not-found");
    const m = snap.data();
    if (m.orderId && orderId && m.orderId !== orderId) throw new Error("order-mismatch");
    if (m.status === "active" && m.memberId) {
      return { memberId: m.memberId, already: true, member: m };
    }
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
    return { memberId, already: false, member: { ...m, memberId } };
  });
  if (!out.already) {
    try { await sendWelcomeEmail(out.member); }
    catch (e) { logger.error("Welcome email failed", e); }
  }
  return out;
}

async function requireAdmin(req, res) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) { res.status(401).json({ error: "Missing auth token." }); return null; }
  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    const wanted = (ADMIN_EMAIL.value() || "").toLowerCase();
    if ((decoded.email || "").toLowerCase() !== wanted) {
      res.status(403).json({ error: "Not authorised." });
      return null;
    }
    return decoded;
  } catch (e) {
    res.status(401).json({ error: "Invalid or expired token." });
    return null;
  }
}

// ============================================================
// Public endpoints
// ============================================================
exports.getSettings = onRequest(async (req, res) => {
  applyCors(req, res);
  if (preflight(req, res)) return;
  const amount = await getCurrentFee();
  res.json({ amount, currency: CURRENCY });
});

exports.createOrder = onRequest(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] },
  async (req, res) => {
    applyCors(req, res);
    if (preflight(req, res)) return;
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
    try {
      const reg = cleanRegistration(req.body || {});
      if (!reg.firstName || !reg.email || !reg.phone) {
        return res.status(400).json({ error: "First name, email and phone are required." });
      }

      const fee = await getCurrentFee();

      const docRef = await db.collection("members").add({
        ...reg,
        membershipFee: fee,
        currency: CURRENCY,
        status: "pending_payment",
        memberId: null,
        memberNumber: null,
        paymentId: null,
        orderId: null,
        createdAt: FieldValue.serverTimestamp(),
        source: "get-involved.html",
      });

      const rzp = new Razorpay({
        key_id: RAZORPAY_KEY_ID.value(),
        key_secret: RAZORPAY_KEY_SECRET.value(),
      });
      const order = await rzp.orders.create({
        amount: fee * 100,
        currency: CURRENCY,
        receipt: docRef.id,
        notes: { type: "volunteer-membership", registrationId: docRef.id },
      });

      await docRef.update({ orderId: order.id });

      res.json({
        registrationId: docRef.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID.value(),
        fee,
      });
    } catch (err) {
      logger.error("createOrder failed", err);
      res.status(500).json({ error: "Could not create the order. Please try again." });
    }
  }
);

exports.verifyPayment = onRequest(
  { secrets: [RAZORPAY_KEY_SECRET, SMTP_PASS] },
  async (req, res) => {
    applyCors(req, res);
    if (preflight(req, res)) return;
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
    try {
      const { registrationId, razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body || {};
      if (!registrationId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification fields." });
      }

      const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET.value())
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
      const a = Buffer.from(razorpay_signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        logger.warn("Invalid Razorpay signature", { registrationId });
        return res.status(400).json({ error: "Payment signature verification failed." });
      }

      const docRef = db.collection("members").doc(registrationId);
      const result = await finalizeMembership(docRef, razorpay_payment_id, razorpay_order_id);
      res.json({ memberId: result.memberId });
    } catch (err) {
      logger.error("verifyPayment failed", err);
      const message =
        err.message === "registration-not-found" ? "Registration not found."
        : err.message === "order-mismatch" ? "This payment does not match the registration."
        : "Verification failed. Please contact support.";
      res.status(500).json({ error: message });
    }
  }
);

exports.razorpayWebhook = onRequest(
  { secrets: [RAZORPAY_WEBHOOK_SECRET, SMTP_PASS] },
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const expected = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET.value())
        .update(req.rawBody)
        .digest("hex");
      if (!signature || signature !== expected) {
        logger.warn("Invalid webhook signature");
        return res.status(400).send("invalid signature");
      }

      const event = req.body || {};
      if (event.event === "payment.captured" || event.event === "order.paid") {
        const payment = event.payload && event.payload.payment && event.payload.payment.entity;
        if (payment && payment.order_id) {
          const q = await db.collection("members")
            .where("orderId", "==", payment.order_id).limit(1).get();
          if (!q.empty) {
            await finalizeMembership(q.docs[0].ref, payment.id, payment.order_id);
          } else {
            logger.warn("Webhook: no member for order", payment.order_id);
          }
        }
      }
      res.json({ status: "ok" });
    } catch (err) {
      logger.error("razorpayWebhook failed", err);
      res.status(500).send("error");
    }
  }
);

// ============================================================
// Admin endpoints (Firebase Auth gated to ADMIN_EMAIL)
// ============================================================
exports.adminStats = onRequest(async (req, res) => {
  applyCors(req, res);
  if (preflight(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  try {
    const snap = await db.collection("members").get();
    const stats = {
      total: 0, active: 0, pending: 0, deregistered: 0,
      revenue: 0, currency: CURRENCY,
      byMonth: {}, byRole: {}, byCity: {}, byInterest: {}, byTshirt: {},
    };
    snap.forEach((d) => {
      const m = d.data();
      stats.total += 1;
      const status = m.status || "pending_payment";
      if (status === "active") {
        stats.active += 1;
        stats.revenue += Number(m.membershipFee) || 0;
        if (m.role) stats.byRole[m.role] = (stats.byRole[m.role] || 0) + 1;
        if (m.city) stats.byCity[m.city] = (stats.byCity[m.city] || 0) + 1;
        if (m.tshirtSize) stats.byTshirt[m.tshirtSize] = (stats.byTshirt[m.tshirtSize] || 0) + 1;
        (m.interests || []).forEach((i) => { stats.byInterest[i] = (stats.byInterest[i] || 0) + 1; });
        const ts = m.paidAt || m.createdAt;
        if (ts && ts.toDate) {
          const d2 = ts.toDate();
          const key = d2.getFullYear() + "-" + String(d2.getMonth() + 1).padStart(2, "0");
          stats.byMonth[key] = (stats.byMonth[key] || 0) + 1;
        }
      } else if (status === "deregistered") {
        stats.deregistered += 1;
      } else {
        stats.pending += 1;
      }
    });
    const fee = await getCurrentFee();
    res.json({ stats, currentFee: fee });
  } catch (err) {
    logger.error("adminStats failed", err);
    res.status(500).json({ error: "Could not load stats." });
  }
});

exports.adminListMembers = onRequest(async (req, res) => {
  applyCors(req, res);
  if (preflight(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  try {
    const snap = await db.collection("members").orderBy("createdAt", "desc").limit(1000).get();
    const members = snap.docs.map((d) => {
      const m = d.data();
      const iso = (t) => (t && t.toDate ? t.toDate().toISOString() : null);
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
    res.json({ members });
  } catch (err) {
    logger.error("adminListMembers failed", err);
    res.status(500).json({ error: "Could not load members." });
  }
});

exports.adminDeregister = onRequest(async (req, res) => {
  applyCors(req, res);
  if (preflight(req, res)) return;
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "Member id is required." });
    const ref = db.collection("members").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "Member not found." });
    await ref.update({
      status: "deregistered",
      deregisteredAt: FieldValue.serverTimestamp(),
      deregisteredBy: adminUser.email,
    });
    res.json({ ok: true });
  } catch (err) {
    logger.error("adminDeregister failed", err);
    res.status(500).json({ error: "Could not deregister member." });
  }
});

exports.adminSetAmount = onRequest(async (req, res) => {
  applyCors(req, res);
  if (preflight(req, res)) return;
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;
  try {
    const amount = Math.floor(Number((req.body || {}).amount));
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000000) {
      return res.status(400).json({ error: "Enter a valid amount (₹1–₹1,00,00,000)." });
    }
    await settingsRef().set(
      {
        amount,
        currency: CURRENCY,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: adminUser.email,
      },
      { merge: true }
    );
    res.json({ ok: true, amount });
  } catch (err) {
    logger.error("adminSetAmount failed", err);
    res.status(500).json({ error: "Could not update amount." });
  }
});
