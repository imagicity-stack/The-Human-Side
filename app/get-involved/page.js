"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./get-involved.css";

const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

async function postJSON(url, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === "AbortError") {
      throw new Error(
        "The server didn't respond. Check that the Razorpay + Firebase env vars are set in Vercel and that the 'the-human-side' Firestore database exists, then redeploy."
      );
    }
    throw new Error("Network error — could not reach the server.");
  }
  clearTimeout(timer);
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data || {};
}

const SLABS = [
  [250, "A meal kit"], [500, "A drive day"], [1000, "A sapling cohort"],
  [2500, "A workshop"], [5000, "A field visit"], [10000, "A term of work"],
];

export default function GetInvolvedPage() {
  const [fee, setFee] = useState(999);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [donateAmt, setDonateAmt] = useState(2500);
  const [custom, setCustom] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    fetch("/api/getSettings")
      .then((r) => r.json())
      .then((s) => { if (s && s.amount) setFee(s.amount); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.classList.toggle("reg-locked", open);
    return () => document.body.classList.remove("reg-locked");
  }, [open]);

  function openModal() { setError(""); setSuccess(null); setOpen(true); }

  const effectiveDonate = custom ? Math.max(0, Math.floor(Number(custom) || 0)) : donateAmt;

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const formEl = e.currentTarget;
    if (!formEl.reportValidity()) return;
    const fd = new FormData(formEl);
    if (fd.getAll("interests").length === 0) {
      setError("Please select at least one cause you care about.");
      return;
    }
    const data = {
      firstName: fd.get("firstName"), lastName: fd.get("lastName"),
      email: fd.get("email"), phone: fd.get("phone"), dob: fd.get("dob"),
      gender: fd.get("gender"), bloodGroup: fd.get("bloodGroup"),
      address: fd.get("address"), city: fd.get("city"), state: fd.get("state"),
      pincode: fd.get("pincode"), role: fd.get("role"),
      organisation: fd.get("organisation"), classOrDesignation: fd.get("classOrDesignation"),
      interests: fd.getAll("interests"), tshirtSize: fd.get("tshirtSize"),
      emergencyName: fd.get("emergencyName"), emergencyPhone: fd.get("emergencyPhone"),
      hearAbout: fd.get("hearAbout"), motivation: fd.get("motivation"),
    };
    const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Volunteer";

    setBusy("Saving…");
    let order;
    try { order = await postJSON("/api/createOrder", data); }
    catch (err) { setBusy(null); setError("Could not start your registration: " + err.message); return; }

    if (typeof window.Razorpay === "undefined") {
      setBusy(null); setError("Razorpay checkout failed to load. Check your connection and try again."); return;
    }

    setBusy("Opening payment…");
    const key = order.keyId || RZP_KEY;
    if (!key) {
      setBusy(null);
      setError("Razorpay key is missing. Set RAZORPAY_KEY_ID and NEXT_PUBLIC_RAZORPAY_KEY_ID in Vercel, then redeploy.");
      return;
    }
    try {
      const rzp = new window.Razorpay({
        key,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "The Human Side",
        description: "Volunteer Membership · One-time · " + fmt(fee),
        image: "/assets/logo-icon.png",
        theme: { color: "#7C3F98" },
        prefill: { name, email: data.email, contact: data.phone },
        notes: { type: "volunteer-membership", registrationId: order.registrationId, initiative: "The Human Side" },
        handler: async (resp) => {
          setBusy("Verifying payment…");
          try {
            const { memberId } = await postJSON("/api/verifyPayment", {
              registrationId: order.registrationId,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            });
            setBusy(null);
            setSuccess({ memberId, name });
          } catch (err) {
            setBusy(null);
            setError(`Your payment went through (ID ${resp.razorpay_payment_id}) but verification did not complete: ${err.message} Please email contact@edenwoods.org with this payment ID.`);
          }
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.on("payment.failed", (r) => {
        setBusy(null);
        setError("Payment could not be completed. " + ((r.error && r.error.description) || ""));
      });
      rzp.open();
    } catch (err) {
      setBusy(null);
      setError("Could not open the payment window: " + (err.message || err));
    }
  }

  function handleDonate() {
    if (effectiveDonate < 1) { alert("Please enter a donation amount."); return; }
    if (!RZP_KEY || RZP_KEY.includes("REPLACE")) {
      alert("Razorpay is not configured yet. Set NEXT_PUBLIC_RAZORPAY_KEY_ID to enable donations.");
      return;
    }
    if (typeof window.Razorpay === "undefined") { alert("Razorpay checkout failed to load."); return; }
    const rzp = new window.Razorpay({
      key: RZP_KEY,
      amount: effectiveDonate * 100,
      currency: "INR",
      name: "The Human Side",
      description: "Donation — " + fmt(effectiveDonate),
      image: "/assets/logo-icon.png",
      theme: { color: "#7C3F98" },
      notes: { initiative: "The Human Side", partner: "Edenwoods Eduhub Foundation" },
      handler: (resp) =>
        alert(`Thank you for your donation of ${fmt(effectiveDonate)}.\nPayment ID: ${resp.razorpay_payment_id}\n\nA receipt will be emailed by Edenwoods Foundation.`),
    });
    rzp.on("payment.failed", (r) => alert("Payment could not be completed.\n" + ((r.error && r.error.description) || "")));
    rzp.open();
  }

  const cardId = success ? success.memberId : "THS-2026-0001";
  const cardName = success ? success.name : "Your name here";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <SiteHeader active="get-involved" />

      <main className="pg-gi">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="wrap">
            <div className="page-hero__crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>Get Involved</span>
            </div>
            <div className="page-hero__inner">
              <h1>The doors are<br /><em>open.</em> Walk in.</h1>
              <p className="page-hero__lede">
                Become a registered volunteer for a one-time {fmt(fee)} — kit, badge,
                and an ID that says you&apos;re in. Or volunteer your time, donate,
                or just say hello. Every door leads to the same room.
              </p>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section className="membership" id="membership">
          <div className="wrap">
            <div className="membership__inner">
              <div className="membership__copy">
                <span className="eyebrow">— Membership · One-time · {fmt(fee)}</span>
                <h2>Become a <em>registered<br />volunteer</em> of<br />The Human Side.</h2>
                <p className="membership__lede">
                  Stand with us — officially. A one-time joining fee of <strong>{fmt(fee)}</strong>
                  {" "}gets you the kit, the badge, and the ID. The kind of belonging
                  you can show, not just tell.
                </p>

                <div className="membership__price">
                  <span className="currency">₹</span>
                  <span className="value">{Number(fee).toLocaleString("en-IN")}</span>
                  <div className="meta">
                    <span className="k">One-time</span>
                    <span className="v">Lifetime member</span>
                  </div>
                </div>

                <ul className="membership__benefits">
                  <li>Official T-shirt</li>
                  <li>Pin badge</li>
                  <li>Digital membership ID</li>
                  <li>Access to all official drives</li>
                  <li>Participation certificates</li>
                  <li>Recognition opportunities</li>
                  <li>Volunteer leadership roles</li>
                  <li>Annual impact report</li>
                </ul>

                <button type="button" className="membership__cta" onClick={openModal}>
                  Become a member
                  <span className="price-pill">{fmt(fee)}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </button>
              </div>

              <div>
                <div className="membership__card-wrap">
                  <div className="membership__card" aria-label="Membership card preview">
                    <span className="membership__card-stripe" aria-hidden="true"></span>
                    <div className="membership__card-top">
                      <div className="membership__card-brand">
                        <span className="icon" aria-hidden="true"></span>
                        <div>
                          <div className="name">The Human Side</div>
                          <div className="sub">Registered Volunteer</div>
                        </div>
                      </div>
                      <div className="membership__card-id">
                        Member No.<strong>{cardId}</strong>
                      </div>
                    </div>
                    <div className="membership__card-center">
                      <div className="kicker">— Official Member Card</div>
                      <h3>The side that<br /><em>still</em> cares.</h3>
                    </div>
                    <div className="membership__card-bottom">
                      <div className="meta">
                        <span className="k">Member</span><span className="v">{cardName}</span>
                        <span className="k">Issued</span><span className="v">2026 · One-time</span>
                        <span className="k">Valid</span><span className="v">Lifetime</span>
                      </div>
                      <div className="stamp">— signed,<br />The Founding Circle</div>
                    </div>
                  </div>
                </div>

                <div className="membership__kit">
                  <div className="membership__kit-item">
                    <svg className="icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <path d="M7 8l-3 2 2 4 3-1v10h10V13l3 1 2-4-3-2-3-4h-2a3 3 0 0 1-6 0H9l-2 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span className="label">Official<br />T-Shirt</span>
                  </div>
                  <div className="membership__kit-item">
                    <svg className="icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <circle cx="14" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 17l-2 7 6-3 6 3-2-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span className="label">Pin<br />Badge</span>
                  </div>
                  <div className="membership__kit-item">
                    <svg className="icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <rect x="4" y="7" width="20" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 12h5M16 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="label">Digital<br />Member ID</span>
                  </div>
                  <div className="membership__kit-item">
                    <svg className="icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <path d="M14 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span className="label">All Official<br />Drives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE WAYS */}
        <section className="ways">
          <div className="wrap">
            <div className="ways__head">
              <div>
                <span className="eyebrow">— Three ways in</span>
                <h2>Choose <em>one,</em><br />or all three.</h2>
              </div>
              <p>
                We try to make it easy to start and easy to stay. None of these asks for
                more than you have to give — and any of them is a real beginning.
              </p>
            </div>

            <div className="ways__grid">
              <article className="way">
                <div className="way__icon">
                  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5 24c1-5 5-7 9-7s8 2 9 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="way__num">i.</div>
                <div>
                  <h3>Volunteer your<br /><em style={{ color: "var(--red)", fontStyle: "italic" }}>time.</em></h3>
                  <p>Come to a Saturday meeting, help run a drive, mentor a younger student — whatever fits the week you&apos;ve got.</p>
                  <ul className="way__list">
                    <li>1 Saturday a month</li>
                    <li>Drives &amp; field visits</li>
                    <li>Mentorship circles</li>
                    <li>Open to students &amp; parents</li>
                  </ul>
                </div>
                <a className="btn btn--primary way__cta" href="#volunteer">Sign me up<span className="arrow" aria-hidden="true">→</span></a>
              </article>

              <article className="way">
                <div className="way__icon">
                  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 24s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="way__num">ii.</div>
                <div>
                  <h3>Donate through<br /><em style={{ color: "var(--red)", fontStyle: "italic" }}>Edenwoods.</em></h3>
                  <p>Donations are received and accounted for by the Edenwoods Eduhub Foundation — fully receipted, with quarterly transparency notes.</p>
                  <ul className="way__list">
                    <li>One-time or monthly</li>
                    <li>Tax-receipted</li>
                    <li>Quarterly reports</li>
                    <li>Ask anything; we&apos;ll answer</li>
                  </ul>
                </div>
                <a className="btn btn--primary way__cta" href="#donate">Donate<span className="arrow" aria-hidden="true">→</span></a>
              </article>

              <article className="way">
                <div className="way__icon">
                  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="4" y="6" width="20" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 8l10 8 10-8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="way__num">iii.</div>
                <div>
                  <h3>Send a note,<br />start a <em style={{ color: "var(--red)", fontStyle: "italic" }}>conversation.</em></h3>
                  <p>Got an idea, a connection, a cause we should know about? Write to us. We read everything; we reply to most things within the week.</p>
                  <ul className="way__list">
                    <li>Ideas welcome</li>
                    <li>Partnership inquiries</li>
                    <li>Press &amp; coverage</li>
                    <li>Or just say hi</li>
                  </ul>
                </div>
                <a className="btn btn--primary way__cta" href="mailto:contact@edenwoods.org">Write us<span className="arrow" aria-hidden="true">→</span></a>
              </article>
            </div>
          </div>
        </section>

        {/* VOLUNTEER FORM */}
        <section className="form-section" id="volunteer">
          <div className="wrap">
            <div className="form-grid">
              <div className="form-side">
                <span className="eyebrow">— Volunteer with us</span>
                <h2>Tell us who you are.<br />We&apos;ll do the <em>rest.</em></h2>
                <p>
                  A short form, an honest answer. Someone from the founding circle will
                  write back within a few days — usually with the date of the next meeting,
                  and a few things you could try on your first one.
                </p>
                <ul>
                  <li>No commitment to begin with</li>
                  <li>You can step in and out as life allows</li>
                  <li>Open to students, parents, faculty &amp; alumni</li>
                  <li>We answer every single message</li>
                </ul>
                <div className="form-side__image">
                  <img src="/assets/images/volunteer.jpg" alt="Volunteers at work" loading="lazy" />
                </div>
              </div>

              <form
                className="form"
                onSubmit={(e) => { e.preventDefault(); alert("Thank you — we'll write to you within the week."); }}
              >
                <div className="form__row">
                  <div className="field"><label htmlFor="first">First name</label><input id="first" type="text" placeholder="Aanya" /></div>
                  <div className="field"><label htmlFor="last">Last name</label><input id="last" type="text" placeholder="Krishnan" /></div>
                </div>
                <div className="form__row">
                  <div className="field"><label htmlFor="vemail">Email</label><input id="vemail" type="email" placeholder="you@example.com" /></div>
                  <div className="field">
                    <label htmlFor="vrole">I am a</label>
                    <select id="vrole">
                      <option>Student at Elden Heights</option>
                      <option>Parent</option>
                      <option>Faculty / staff</option>
                      <option>Alumnus / alumna</option>
                      <option>Friend of the school</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="note">A short note (optional)</label>
                  <textarea id="note" placeholder="Anything you'd like us to know — skills, time, ideas, questions"></textarea>
                </div>
                <button type="submit" className="btn btn--red form__submit">Send it in<span className="arrow" aria-hidden="true">→</span></button>
              </form>
            </div>
          </div>
        </section>

        {/* DONATE */}
        <section className="donate" id="donate">
          <div className="wrap">
            <div className="donate__inner">
              <div>
                <span className="eyebrow">— Donate · INR</span>
                <h2>Money <em>moves</em> small, careful work.</h2>
                <p>
                  Donations are received by the Edenwoods Eduhub Foundation and ring-fenced
                  for The Human Side. Every quarter we publish what came in and what it
                  paid for — receipts included.
                </p>

                <div className="amounts">
                  {SLABS.map(([val, cap]) => (
                    <label
                      key={val}
                      className={"amount" + (!custom && donateAmt === val ? " is-active" : "")}
                      onClick={() => { setDonateAmt(val); setCustom(""); }}
                    >
                      <span className="amount__value">{fmt(val)}</span>
                      <span className="amount__caption">{cap}</span>
                    </label>
                  ))}
                </div>

                <div className="donate__custom">
                  <label className="donate__custom-label" htmlFor="custom-amount">— Or enter your own amount</label>
                  <div className="donate__custom-input">
                    <span className="currency">₹</span>
                    <input
                      id="custom-amount" type="number" min="10" step="1" inputMode="numeric"
                      placeholder="Custom amount" value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                    />
                    <span className="freq">INR · one-time</span>
                  </div>
                </div>

                <button type="button" className="btn donate__cta" onClick={handleDonate}>
                  Donate <span className="amount-label">{effectiveDonate > 0 ? fmt(effectiveDonate) : "—"}</span> securely
                  <span className="arrow" aria-hidden="true">→</span>
                </button>

                <p className="donate__note">— Powered by Razorpay · 100% to The Human Side fund</p>

                <div className="donate__trust">
                  <span>PCI-DSS Secure</span>
                  <span>80G receipt on request</span>
                  <span>Cards · UPI · Netbanking</span>
                </div>
              </div>

              <aside className="donate__panel">
                <span className="eyebrow">— Where it goes</span>
                <h3>Plain numbers,<br /><em>posted</em> publicly.</h3>
                <div className="row"><span className="k">Drives</span><span className="v">Books, meal kits, supplies for monthly field visits</span></div>
                <div className="row"><span className="k">Workshops</span><span className="v">Professional facilitators for safety &amp; awareness sessions</span></div>
                <div className="row"><span className="k">Materials</span><span className="v">Saplings, reusable kits, printed resources</span></div>
                <div className="row"><span className="k">Overhead</span><span className="v">Capped at 10% — Edenwoods absorbs the rest</span></div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#9B95B0", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 28 }}>
                  Quarterly reports posted by Edenwoods Foundation
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="contact-strip">
          <div className="wrap">
            <span className="eyebrow" style={{ color: "var(--yellow)" }}>— Final note</span>
            <h2>Still not sure?<br /><em>Come anyway.</em></h2>
            <p>
              You can come to a single Saturday meeting and decide if it&apos;s for you.
              No commitment, no awkwardness. We&apos;ll have tea.
            </p>
            <div className="row">
              <a className="btn btn--red" href="mailto:contact@edenwoods.org">Write us a hello<span className="arrow" aria-hidden="true">→</span></a>
              <Link className="btn btn--ghost" href="/about">About the initiative<span className="arrow" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        {/* REGISTRATION MODAL */}
        {open && (
        <div className="reg-overlay is-open" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="reg-dialog">
            <button type="button" className="reg-dialog__close" aria-label="Close registration" onClick={() => setOpen(false)}>×</button>

            {!success ? (
              <div>
                <div className="reg-head">
                  <span className="eyebrow">— Membership registration · One-time · {fmt(fee)}</span>
                  <h2>Register as a <em>volunteer.</em></h2>
                  <p>
                    Fill in your details below. We&apos;ll save your registration, take your
                    one-time {fmt(fee)} fee securely via Razorpay, and issue you a unique
                    membership ID (e.g. <strong>THS001</strong>) on success.
                  </p>
                </div>

                {error && <div className="reg-error is-show" role="alert">{error}</div>}

                <form className="reg-form" ref={formRef} onSubmit={handleRegister} noValidate>
                  <fieldset className="reg-fieldset">
                    <legend>About you</legend>
                    <div className="form__row">
                      <div className="field"><label>First name <span className="req">*</span></label><input name="firstName" type="text" placeholder="Aanya" required /></div>
                      <div className="field"><label>Last name <span className="req">*</span></label><input name="lastName" type="text" placeholder="Krishnan" required /></div>
                    </div>
                    <div className="form__row">
                      <div className="field"><label>Email <span className="req">*</span></label><input name="email" type="email" placeholder="you@example.com" required /></div>
                      <div className="field"><label>Phone <span className="req">*</span></label><input name="phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" pattern="[0-9+\-\s]{7,15}" required /></div>
                    </div>
                    <div className="reg-row-3">
                      <div className="field"><label>Date of birth <span className="req">*</span></label><input name="dob" type="date" required /></div>
                      <div className="field">
                        <label>Gender <span className="req">*</span></label>
                        <select name="gender" required defaultValue="">
                          <option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option><option>Other</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Blood group <span className="req">*</span></label>
                        <select name="bloodGroup" required defaultValue="">
                          <option value="">Select</option><option>A+</option><option>A−</option><option>B+</option><option>B−</option><option>AB+</option><option>AB−</option><option>O+</option><option>O−</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>Where you are</legend>
                    <div className="field"><label>Address <span className="req">*</span></label><input name="address" type="text" placeholder="House / street / area" required /></div>
                    <div className="reg-row-3">
                      <div className="field"><label>City <span className="req">*</span></label><input name="city" type="text" placeholder="Bengaluru" required /></div>
                      <div className="field"><label>State <span className="req">*</span></label><input name="state" type="text" placeholder="Karnataka" required /></div>
                      <div className="field"><label>PIN code <span className="req">*</span></label><input name="pincode" type="text" inputMode="numeric" pattern="[0-9]{6}" placeholder="560001" required /></div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>Your connection</legend>
                    <div className="form__row">
                      <div className="field">
                        <label>I am a <span className="req">*</span></label>
                        <select name="role" required defaultValue="">
                          <option value="">Select one</option><option>Student at Elden Heights</option><option>Parent</option><option>Faculty / staff</option><option>Alumnus / alumna</option><option>Friend of the school</option><option>Member of the public</option>
                        </select>
                      </div>
                      <div className="field"><label>School / organisation <span className="req">*</span></label><input name="organisation" type="text" placeholder="The Elden Heights School" required /></div>
                    </div>
                    <div className="field"><label>Class / grade or designation <span className="req">*</span></label><input name="classOrDesignation" type="text" placeholder="Grade 11 · or your role" required /></div>
                    <div className="field field--checks">
                      <label>Causes you care about <span className="req">*</span></label>
                      <div className="check-grid">
                        <label className="check"><input type="checkbox" name="interests" value="Women empowerment" /> Women empowerment</label>
                        <label className="check"><input type="checkbox" name="interests" value="Anti-harassment awareness" /> Anti-harassment awareness</label>
                        <label className="check"><input type="checkbox" name="interests" value="Charity drives" /> Charity drives</label>
                        <label className="check"><input type="checkbox" name="interests" value="Environment" /> Environment</label>
                        <label className="check"><input type="checkbox" name="interests" value="Education & mentorship" /> Education &amp; mentorship</label>
                        <label className="check"><input type="checkbox" name="interests" value="Wherever needed" /> Wherever needed</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>Kit &amp; emergency</legend>
                    <div className="reg-row-3">
                      <div className="field">
                        <label>T-shirt size <span className="req">*</span></label>
                        <select name="tshirtSize" required defaultValue="">
                          <option value="">Select</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                        </select>
                      </div>
                      <div className="field"><label>Emergency contact name <span className="req">*</span></label><input name="emergencyName" type="text" placeholder="Parent / guardian" required /></div>
                      <div className="field"><label>Emergency contact phone <span className="req">*</span></label><input name="emergencyPhone" type="tel" inputMode="tel" placeholder="+91 …" pattern="[0-9+\-\s]{7,15}" required /></div>
                    </div>
                    <div className="field">
                      <label>How did you hear about us? <span className="req">*</span></label>
                      <select name="hearAbout" required defaultValue="">
                        <option value="">Select one</option><option>School announcement</option><option>A friend or family</option><option>Social media</option><option>Edenwoods Foundation</option><option>Other</option>
                      </select>
                    </div>
                    <div className="field"><label>Why do you want to join? <span className="req">*</span></label><textarea name="motivation" placeholder="Tell us what moves you — skills, time, ideas." required></textarea></div>
                  </fieldset>

                  <label className="reg-consent">
                    <input type="checkbox" name="consent" required />
                    <span>I confirm the details above are correct, I&apos;m joining of my own accord, and I agree to be contacted by The Human Side / Edenwoods Eduhub Foundation about drives and membership. <span className="req">*</span></span>
                  </label>

                  <div className="reg-actions">
                    <button type="submit" className={"reg-submit" + (busy ? " reg-busy" : "")}>
                      <span className="reg-submit__label">{busy || `Register & pay ${fmt(fee)}`}</span>
                      <span className="price-pill">{fmt(fee)}</span>
                      <span className="arrow" aria-hidden="true">→</span>
                    </button>
                    <span className="reg-pay-note">Secure · Razorpay · INR · One-time</span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="reg-success is-show">
                <div className="reg-success__tick" aria-hidden="true">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4 10-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2>You&apos;re <em>in.</em> Welcome.</h2>
                <p>Your {fmt(fee)} membership is confirmed and your registration is saved. Here is your official, lifetime member ID — keep it safe.</p>
                <div className="reg-id-card">
                  <div className="k">Member ID</div>
                  <div className="id">{success.memberId}</div>
                  <div className="who">{success.name}</div>
                </div>
                <p style={{ fontSize: 13 }}>
                  A confirmation will be emailed by Edenwoods Foundation with your kit dispatch details. Questions? <a href="mailto:contact@edenwoods.org" style={{ color: "var(--red)" }}>contact@edenwoods.org</a>
                </p>
                <button type="button" className="reg-success__done" onClick={() => setOpen(false)}>
                  Done<span className="arrow" aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
