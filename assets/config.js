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
     Membership backend (Firebase Cloud Functions) base URL.

     This static site is hosted on Vercel while the backend runs on
     Firebase Cloud Functions, so this is a CROSS-ORIGIN call and must
     be the absolute base URL of your deployed functions. The browser
     calls {API_BASE_URL}/createOrder and {API_BASE_URL}/verifyPayment;
     the SERVER then verifies the Razorpay signature and issues the
     unique member ID (THS001…). Firestore is written only by the
     server (Admin SDK) — never by the browser.

     After `firebase deploy --only functions`, the CLI prints each URL.
     Take the part BEFORE "/createOrder" and put it here. For gen-2
     functions the base looks like:
       https://<region>-<project-id>.cloudfunctions.net
     e.g. https://us-central1-the-human-side.cloudfunctions.net

     The Razorpay public key id above is safe in the browser. The
     Razorpay SECRET stays only in Firebase (functions:secrets:set) —
     it must never appear in this file.
  ---------------------------------------------------------- */
  API_BASE_URL: "https://REGION-PROJECT_ID.cloudfunctions.net"
};
