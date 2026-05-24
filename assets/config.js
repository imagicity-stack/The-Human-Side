/* ============================================================
   Runtime config — env variables for The Human Side
   ============================================================

   This file is the single place where deployment-specific values
   live. In production, replace these placeholders at build/deploy
   time (CI pipeline, server-rendered template, or env-injection
   script) rather than committing real secrets.

   For Razorpay, only the PUBLIC KEY ID is exposed to the browser.
   The SECRET KEY must never be placed here — it lives only on
   the server that creates orders / verifies signatures.
============================================================ */

window.__ENV__ = {
  /* Razorpay public Key ID — looks like "rzp_test_XXXXXXXXXXXX"
     or "rzp_live_XXXXXXXXXXXX". Replace with your real key. */
  RAZORPAY_KEY_ID: "rzp_test_REPLACE_WITH_YOUR_KEY_ID",

  /* Currency — Razorpay supports INR for India. */
  CURRENCY: "INR",

  /* Org details shown on the Razorpay checkout sheet. */
  ORG_NAME:    "The Human Side",
  ORG_TAGLINE: "An Edenwoods × Elden Heights Initiative",
  ORG_LOGO:    "assets/logo-icon.png",

  /* Where to POST the verified payment to your backend.
     Leave empty to skip server verification (DEV ONLY). */
  PAYMENT_WEBHOOK_URL: "",

  /* Theme color used in the Razorpay checkout sheet. */
  THEME_COLOR: "#7C3F98",

  /* ----------------------------------------------------------
     Firebase (Cloud Firestore) — stores volunteer registrations
     and the issued membership IDs (THS001, THS002 …).

     These values are NOT secrets — the Firebase web config is
     meant to be embedded in the client. Real protection comes
     from Firestore Security Rules, which you configure in the
     Firebase console. Replace every REPLACE_… below with values
     from: Firebase console → Project settings → Your apps →
     SDK setup and configuration → Config.
  ---------------------------------------------------------- */
  FIREBASE_CONFIG: {
    apiKey:            "REPLACE_WITH_FIREBASE_API_KEY",
    authDomain:        "REPLACE_PROJECT.firebaseapp.com",
    projectId:         "REPLACE_PROJECT_ID",
    storageBucket:     "REPLACE_PROJECT.appspot.com",
    messagingSenderId: "REPLACE_SENDER_ID",
    appId:             "REPLACE_APP_ID"
  }
};
