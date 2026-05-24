# The Human Side

A Next.js (App Router) site for **The Human Side** — a student-led social
initiative by Edenwoods Eduhub Foundation, in partnership with The Elden
Heights School.

## Stack
- **Next.js 14 + React** (App Router), deployed on **Vercel**
- **API routes** (`app/api/*`) for the backend — Razorpay orders, payment
  signature verification, the welcome email, and the admin endpoints
- **Cloud Firestore** (named database `the-human-side`) via the Firebase
  Admin SDK
- **Razorpay** for the one-time ₹999 volunteer membership + donations
- **Firebase Auth** for the admin dashboard login (`/admin`)

## Pages
- `/` home · `/about` · `/partners`
- `/get-involved` — membership registration (form → Firestore → pay →
  unique member ID `THS001…` → welcome email), donations
- `/admin` — analytics, member management (deregister), and the
  registration-fee control (login restricted to `ADMIN_EMAIL`)

## Setup
1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in (or set the same vars in
   Vercel → Settings → Environment Variables). All config lives there.
3. Deploy Firestore rules to Firebase: `firebase deploy --only firestore:rules`
4. In Firebase: enable Email/Password auth and create the `ADMIN_EMAIL` user.
5. In Razorpay: add a webhook → `{site}/api/razorpayWebhook` (events
   `payment.captured`, `order.paid`) with the `RAZORPAY_WEBHOOK_SECRET`.
6. `npm run dev` locally, or push to deploy on Vercel.

Product photos go in `public/assets/images/` (see the README there for the
exact filenames the pages expect).
