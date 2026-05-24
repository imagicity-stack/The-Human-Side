import { getAuthAdmin } from "./firebaseAdmin";

// Verify the Firebase ID token from the Authorization header and confirm
// it belongs to ADMIN_EMAIL. Returns { ok, user } or { ok:false,... }.
export async function verifyAdmin(req) {
  const header = req.headers.get("authorization") || "";
  const m = header.match(/^Bearer (.+)$/);
  if (!m) return { ok: false, status: 401, error: "Missing auth token." };
  try {
    const decoded = await getAuthAdmin().verifyIdToken(m[1]);
    const wanted = (process.env.ADMIN_EMAIL || "admin@thehumanside.org").toLowerCase();
    if ((decoded.email || "").toLowerCase() !== wanted) {
      return { ok: false, status: 403, error: "Not authorised." };
    }
    return { ok: true, user: decoded };
  } catch (e) {
    return { ok: false, status: 401, error: "Invalid or expired token." };
  }
}
