/* ============================================================
   Vercel Serverless Function — serves PUBLIC runtime config
   ------------------------------------------------------------
   Reads environment variables set in the Vercel dashboard and
   returns them to the browser as `window.__ENV__`. The pages load
   this with <script src="/api/config"></script> instead of a
   committed config file, so you manage all public values in
   Vercel → Settings → Environment Variables (no code edits).

   IMPORTANT: every value here is PUBLIC (it ships to the browser):
   the Razorpay *key id* and the Firebase *web* config are meant to
   be public. SECRETS (Razorpay secret, SMTP password, webhook
   secret) are NOT here — they live only in Firebase Functions.
   ============================================================ */
module.exports = (req, res) => {
  const env = process.env;
  const cfg = {
    RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID || "",
    CURRENCY: env.CURRENCY || "INR",
    ORG_NAME: env.ORG_NAME || "The Human Side",
    ORG_TAGLINE: env.ORG_TAGLINE || "An Edenwoods × Elden Heights Initiative",
    ORG_LOGO: "assets/logo-icon.png",
    THEME_COLOR: env.THEME_COLOR || "#7C3F98",
    API_BASE_URL: env.API_BASE_URL || "",
    FIREBASE_CONFIG: {
      apiKey: env.FIREBASE_API_KEY || "",
      authDomain: env.FIREBASE_AUTH_DOMAIN || "",
      projectId: env.FIREBASE_PROJECT_ID || "",
      storageBucket: env.FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: env.FIREBASE_APP_ID || "",
    },
  };
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send("window.__ENV__ = " + JSON.stringify(cfg) + ";");
};
