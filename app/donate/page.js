"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./donate.css";

const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const SLABS = [
  [250, "A meal kit"],
  [500, "A drive day"],
  [1000, "A sapling cohort"],
  [2500, "A workshop"],
  [5000, "A field visit"],
  [10000, "A term of work"],
];

const GOES = [
  ["Drives", "Books, meal kits, supplies for monthly field visits"],
  ["Workshops", "Professional facilitators for safety & awareness sessions"],
  ["Materials", "Saplings, reusable kits, printed resources"],
  ["Overhead", "Capped at 10% — Edenwoods absorbs the rest"],
];

export default function DonatePage() {
  const [donateAmt, setDonateAmt] = useState(2500);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const effectiveDonate = custom ? Math.max(0, Math.floor(Number(custom) || 0)) : donateAmt;

  function handleDonate() {
    setError("");
    setDone(null);
    if (effectiveDonate < 1) {
      setError("Please choose or enter a donation amount.");
      return;
    }
    if (!RZP_KEY || RZP_KEY.includes("REPLACE")) {
      setError("Razorpay is not configured yet. Set NEXT_PUBLIC_RAZORPAY_KEY_ID to enable donations.");
      return;
    }
    if (typeof window.Razorpay === "undefined") {
      setError("Razorpay checkout failed to load. Check your connection and try again.");
      return;
    }
    const rzp = new window.Razorpay({
      key: RZP_KEY,
      amount: effectiveDonate * 100,
      currency: "INR",
      name: "The Human Side",
      description: "Donation — " + fmt(effectiveDonate),
      image: "/assets/logo-icon.png",
      theme: { color: "#7B3FA0" },
      notes: { initiative: "The Human Side", partner: "Edenwoods Eduhub Foundation" },
      handler: (resp) => setDone({ amount: effectiveDonate, id: resp.razorpay_payment_id }),
    });
    rzp.on("payment.failed", (r) =>
      setError("Payment could not be completed. " + ((r.error && r.error.description) || ""))
    );
    rzp.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <SiteHeader active="donate" />

      <main id="main" className="pg-donate">
        {/* ---------------------------------------------------- HERO */}
        <section className="page-hero">
          <div className="wrap">
            <div className="page-hero__crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>Donate</span>
            </div>
            <div className="page-hero__inner">
              <h1>
                Money <em>moves</em> small, careful work.
              </h1>
              <p className="page-hero__lede">
                Donations are received by the Edenwoods Eduhub Foundation and ring-fenced for
                The Human Side. Every quarter we publish what came in and what it paid for —
                receipts included.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- DONATE */}
        <section className="donate" id="donate">
          <div className="wrap">
            <div className="donate__inner">
              <div className="donate__form">
                <p className="eyebrow">— Choose an amount · INR</p>

                <div className="amounts" role="radiogroup" aria-label="Donation amount">
                  {SLABS.map(([val, cap]) => (
                    <label key={val} className="amount">
                      <input
                        type="radio"
                        name="donation-amount"
                        value={val}
                        checked={!custom && donateAmt === val}
                        onChange={() => { setDonateAmt(val); setCustom(""); }}
                      />
                      <span className="amount__value">{fmt(val)}</span>
                      <span className="amount__caption">{cap}</span>
                    </label>
                  ))}
                </div>

                <div className="donate__custom">
                  <label className="donate__custom-label" htmlFor="custom-amount">
                    — Or enter your own amount
                  </label>
                  <div className="donate__custom-input">
                    <span className="currency" aria-hidden="true">₹</span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="10"
                      step="1"
                      inputMode="numeric"
                      placeholder="Custom amount"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                    />
                    <span className="freq">INR · one-time</span>
                  </div>
                </div>

                <button type="button" className="btn donate__cta" onClick={handleDonate}>
                  Donate{" "}
                  <span className="amount-label">
                    {effectiveDonate > 0 ? fmt(effectiveDonate) : "—"}
                  </span>{" "}
                  securely
                  <span className="arrow" aria-hidden="true">→</span>
                </button>

                {error ? (
                  <p className="donate__error" role="alert">{error}</p>
                ) : null}

                {done ? (
                  <p className="donate__done" role="status">
                    Thank you for your donation of <strong>{fmt(done.amount)}</strong>. Payment ID{" "}
                    <code>{done.id}</code>. A receipt will be emailed by Edenwoods Foundation.
                  </p>
                ) : null}

                <p className="donate__note">— Powered by Razorpay · 100% to The Human Side fund</p>

                <div className="donate__trust">
                  <span>PCI-DSS Secure</span>
                  <span>80G receipt on request</span>
                  <span>Cards · UPI · Netbanking</span>
                </div>
              </div>

              <aside className="donate__panel">
                <p className="eyebrow">— Where it goes</p>
                <h2>
                  Plain numbers,
                  <br />
                  <em>posted</em> publicly.
                </h2>
                {GOES.map(([k, v]) => (
                  <div className="row" key={k}>
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </div>
                ))}
                <p className="donate__panel-foot">
                  Quarterly reports posted by Edenwoods Foundation
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- OTHER WAYS */}
        <section className="donate-more">
          <div className="wrap">
            <div className="donate-more__inner">
              <div>
                <p className="eyebrow">— Other ways to help</p>
                <h2 className="h-section">
                  Money is one way in.
                  <br />
                  <em>It isn’t the only one.</em>
                </h2>
              </div>
              <div className="donate-more__row">
                <Link className="btn btn--primary" href="/get-involved">
                  Volunteer with us<span className="arrow" aria-hidden="true">→</span>
                </Link>
                <Link className="btn btn--ghost" href="/partners">
                  Partner with us<span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
