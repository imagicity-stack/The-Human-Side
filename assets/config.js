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
     Membership backend (Cloud Functions) base URL.

     The browser calls {API_BASE_URL}/createOrder and
     {API_BASE_URL}/verifyPayment to register a volunteer, take the
     ₹999 fee, and have the SERVER verify the Razorpay signature and
     issue the unique member ID (THS001…). Firestore is written only
     by the server (Admin SDK) — never by the browser.

     • Leave EMPTY ("") if you deploy the static site AND the
       functions to the same Firebase project — firebase.json rewrites
       /createOrder and /verifyPayment to the functions on the same
       origin (no CORS needed).
     • Otherwise set the full base, e.g.
       "https://us-central1-your-project.cloudfunctions.net".

     The Razorpay SECRET KEY lives only on the server — see
     functions/index.js. It must never appear in this file.
  ---------------------------------------------------------- */
  API_BASE_URL: ""
};
