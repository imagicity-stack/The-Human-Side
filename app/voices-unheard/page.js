"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./voices-unheard.css";

const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const PROGRAM = "voices-unheard";
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
      throw new Error("The server didn't respond. Please try again in a moment.");
    }
    throw new Error("Network error — could not reach the server.");
  }
  clearTimeout(timer);
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data || {};
}

export default function VoicesUnheardPage() {
  const [fee, setFee] = useState(799);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetch("/api/getSettings?program=voices-unheard")
      .then((r) => r.json())
      .then((s) => { if (s && s.amount) setFee(s.amount); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.classList.toggle("reg-locked", open);
    return () => document.body.classList.remove("reg-locked");
  }, [open]);

  function openModal() { setError(""); setSuccess(null); setOpen(true); }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const formEl = e.currentTarget;
    if (!formEl.reportValidity()) return;
    const fd = new FormData(formEl);
    if (fd.getAll("consents").length < 2) {
      setError("Please tick both the parent consent and the code-of-conduct boxes.");
      return;
    }
    const data = {
      program: PROGRAM,
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      dob: fd.get("dob"),
      gender: fd.get("gender"),
      bloodGroup: fd.get("bloodGroup"),
      address: fd.get("address"),
      city: fd.get("city"),
      state: fd.get("state"),
      pincode: fd.get("pincode"),
      school: fd.get("school"),
      classGrade: fd.get("classGrade"),
      section: fd.get("section"),
      tshirtSize: fd.get("tshirtSize"),
      guardianName: fd.get("guardianName"),
      guardianRelation: fd.get("guardianRelation"),
      guardianPhone: fd.get("guardianPhone"),
      guardianEmail: fd.get("guardianEmail"),
      emergencyName: fd.get("emergencyName"),
      emergencyPhone: fd.get("emergencyPhone"),
      medicalNotes: fd.get("medicalNotes"),
      hearAbout: fd.get("hearAbout"),
      motivation: fd.get("motivation"),
      consents: fd.getAll("consents"),
    };
    const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Camper";

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
      setError("Razorpay key is missing. Please contact support.");
      return;
    }
    try {
      const rzp = new window.Razorpay({
        key,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Voices Unheard 2026",
        description: "Voices Unheard · Camp Registration · " + fmt(fee),
        image: "/assets/logo-icon.png",
        theme: { color: "#7C3F98" },
        prefill: { name, email: data.email, contact: data.phone },
        notes: { type: "voices-unheard", registrationId: order.registrationId, initiative: "The Human Side" },
        handler: async (resp) => {
          setBusy("Verifying payment…");
          try {
            const { memberId } = await postJSON("/api/verifyPayment", {
              program: PROGRAM,
              registrationId: order.registrationId,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            });
            setBusy(null);
            setSuccess({ memberId, name, classGrade: data.classGrade, school: data.school });
          } catch (err) {
            setBusy(null);
            setError(`Your payment went through (ID ${resp.razorpay_payment_id}) but verification did not complete: ${err.message} Please email contact@eldenheights.org with this payment ID.`);
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

  const cardId = success ? success.memberId : "VU-2026-001";
  const cardName = success ? success.name : "Your name here";
  const cardClass = success ? success.classGrade : "Class · School";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <SiteHeader active="voices-unheard" />

      <main className="pg-vu">
        {/* HERO */}
        <section className="vu-hero">
          <div className="wrap">
            <div className="vu-hero__crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>Voices Unheard</span>
            </div>
            <div className="vu-hero__inner">
              <div className="vu-hero__copy">
                <span className="eyebrow vu-hero__eyebrow">— A 4-Day Social Awareness Summer Camp · The Human Side</span>
                <h1>
                  Voices<br /><em>Unheard</em><br />2026.
                </h1>
                <p className="vu-hero__tag">Speak Up. Step Out. Make a Difference.</p>
                <p className="vu-hero__lede">
                  A 4-day summer camp by <strong>The Human Side</strong>, an initiative of
                  Edenwoods Eduhub Foundation &amp; The Elden Heights School.
                </p>

                <ul className="vu-hero__meta">
                  <li><span className="k">Begins</span><span className="v">15<sup>th</sup> June 2026</span></li>
                  <li><span className="k">Venue</span><span className="v">School Campus</span></li>
                  <li><span className="k">For</span><span className="v">Classes IX – XII</span></li>
                  <li><span className="k">Seats</span><span className="v">Limited</span></li>
                </ul>

                <div className="vu-hero__cta-row">
                  <button type="button" className="btn-vu btn-vu--primary" onClick={openModal}>
                    Register now
                    <span className="pill">{fmt(fee)}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </button>
                  <a className="btn-vu btn-vu--ghost" href="#journey">See the 4-day journey<span className="arrow" aria-hidden="true">→</span></a>
                </div>
              </div>

              <div className="vu-hero__card-wrap">
                <div className="vu-card" aria-label="Camp ID preview">
                  <span className="vu-card__stripe" aria-hidden="true"></span>
                  <div className="vu-card__top">
                    <div className="vu-card__brand">
                      <span className="dot" aria-hidden="true"></span>
                      <div>
                        <div className="name">The Human Side</div>
                        <div className="sub">Voices Unheard · 2026</div>
                      </div>
                    </div>
                    <div className="vu-card__id">
                      Camp ID<strong>{cardId}</strong>
                    </div>
                  </div>
                  <div className="vu-card__center">
                    <div className="kicker">— Speak Up. Step Out.</div>
                    <h3>Make a<br /><em>difference.</em></h3>
                  </div>
                  <div className="vu-card__bottom">
                    <div className="meta">
                      <span className="k">Camper</span><span className="v">{cardName}</span>
                      <span className="k">Grade</span><span className="v">{cardClass}</span>
                      <span className="k">Dates</span><span className="v">15 – 18 June 2026</span>
                    </div>
                    <div className="stamp">— signed,<br />The Human Side</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="vu-why">
          <div className="wrap">
            <div className="vu-why__grid">
              <div className="vu-why__lead">
                <span className="eyebrow">— What if</span>
                <h2>What if your child spent this summer learning something <em>school can&apos;t teach?</em></h2>
              </div>
              <div className="vu-why__body">
                <p className="lede">
                  Most summer camps teach a skill. <strong>This one builds a human being.</strong>
                </p>
                <p>
                  For four days, your child steps out of the classroom and into the real world —
                  learning to listen, to speak with courage, and to understand the issues that
                  quietly shape every community: safety, dignity, respect, and awareness.
                  They won&apos;t just study these ideas. They&apos;ll live them, lead them,
                  and bring back a confidence that lasts long after the camp ends.
                </p>
                <p className="vu-why__line"><em>This isn&apos;t about making your child uncomfortable. It&apos;s about making them capable.</em></p>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="vu-skills">
          <div className="wrap">
            <div className="vu-skills__head">
              <div>
                <span className="eyebrow">— Why Voices Unheard</span>
                <h2>The lessons that <em>aren&apos;t</em> on the syllabus.</h2>
              </div>
              <p>
                Empathy, courage, communication, the ability to look a stranger in the eye and
                start a real conversation — these are the skills that build leaders.
                And they start here. Your child will leave knowing how to:
              </p>
            </div>
            <div className="vu-skills__grid">
              <article className="vu-skill">
                <div className="vu-skill__num">01</div>
                <h3>Speak with confidence</h3>
                <p>In front of strangers, crowds, and peers — without losing themselves.</p>
              </article>
              <article className="vu-skill">
                <div className="vu-skill__num">02</div>
                <h3>Listen without judging</h3>
                <p>The rarest and most powerful skill there is. We teach it like a discipline.</p>
              </article>
              <article className="vu-skill">
                <div className="vu-skill__num">03</div>
                <h3>Understand real issues</h3>
                <p>With maturity, not fear — facts first, opinions next, judgement never.</p>
              </article>
              <article className="vu-skill">
                <div className="vu-skill__num">04</div>
                <h3>Work in a real team</h3>
                <p>Towards something bigger than themselves, with people they didn&apos;t pick.</p>
              </article>
              <article className="vu-skill">
                <div className="vu-skill__num">05</div>
                <h3>Carry themselves well</h3>
                <p>With dignity, empathy, and purpose — in the room and outside it.</p>
              </article>
              <article className="vu-skill">
                <div className="vu-skill__num">06</div>
                <h3>Tell a true story</h3>
                <p>About what they saw, what they learned, and what they&apos;re going to do next.</p>
              </article>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section className="vu-journey" id="journey">
          <div className="wrap">
            <div className="vu-journey__head">
              <span className="eyebrow" style={{ color: "var(--yellow)" }}>— The 4-day journey</span>
              <h2>Four days. <em>One</em> shift in how they see the world.</h2>
            </div>
            <div className="vu-journey__list">
              <article className="vu-day">
                <div className="vu-day__num">Day 01</div>
                <div className="vu-day__body">
                  <h3>Breaking the Silence</h3>
                  <p>Students step into the community to listen and learn what people really know about important social issues. Guided, supervised, and safe.</p>
                </div>
              </article>
              <article className="vu-day">
                <div className="vu-day__num">Day 02</div>
                <div className="vu-day__body">
                  <h3>Speak Through Action</h3>
                  <p>Through street theatre <em>(nukkad natak)</em> and creative expression, students turn what they learned into messages that move people.</p>
                </div>
              </article>
              <article className="vu-day">
                <div className="vu-day__num">Day 03</div>
                <div className="vu-day__body">
                  <h3>Learn. Discuss. Understand.</h3>
                  <p>Expert-led workshops and open, judgement-free discussions help students understand these topics with clarity, facts, and respect.</p>
                </div>
              </article>
              <article className="vu-day">
                <div className="vu-day__num">Day 04</div>
                <div className="vu-day__body">
                  <h3>Impact &amp; Commitment</h3>
                  <p>Students present their findings, make their pledges, and walk away with a certificate — and a changed perspective.</p>
                </div>
              </article>
            </div>
            <p className="vu-journey__foot">
              Every activity is fully supervised by trained staff and a qualified counsellor.
              Student safety and emotional wellbeing come first, always.
            </p>
          </div>
        </section>

        {/* TAKE HOME */}
        <section className="vu-take">
          <div className="wrap">
            <div className="vu-take__grid">
              <div className="vu-take__copy">
                <span className="eyebrow">— What your child takes home</span>
                <h2>Things to <em>keep.</em> Lessons to <em>live.</em></h2>
                <p>
                  No certificate alone makes a difference. But pair it with confidence,
                  conviction, and a circle of friends who care — and you&apos;ve got the
                  start of something a child carries for life.
                </p>
              </div>
              <ul className="vu-take__list">
                <li><span className="k">i.</span><div><h4>Certificate of Participation</h4><p>From The Human Side — printed, signed, and yours.</p></div></li>
                <li><span className="k">ii.</span><div><h4>Printed Field Handbook</h4><p>Pages to read, pages to scribble in. To keep.</p></div></li>
                <li><span className="k">iii.</span><div><h4>Real-world skills</h4><p>Confidence and communication you can&apos;t fake.</p></div></li>
                <li><span className="k">iv.</span><div><h4>Memories &amp; friendships</h4><p>A sense of purpose, and people to share it with.</p></div></li>
                <li><span className="k">v.</span><div><h4>A story to tell</h4><p>One they&apos;ll actually be proud to tell.</p></div></li>
              </ul>
            </div>
          </div>
        </section>

        {/* FOR STUDENTS */}
        <section className="vu-students">
          <div className="wrap">
            <div className="vu-students__inner">
              <span className="eyebrow" style={{ color: "var(--yellow)" }}>— For students · this one&apos;s for you</span>
              <h2>Bored of the same old summer?<br /><em>Same screen, same room, same routine?</em></h2>
              <p>
                This is your chance to do something that actually matters.
                Meet new people. Get on a stage. Speak up about things that count.
                Earn a certificate that says you did something real.
                And honestly? Have a lot more fun than another month of scrolling.
              </p>
              <p className="vu-students__line">
                Four days. One experience you&apos;ll <em>actually</em> remember.
              </p>
              <button type="button" className="btn-vu btn-vu--yellow" onClick={openModal}>
                Count me in
                <span className="pill">{fmt(fee)}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* PARENTS NOTE */}
        <section className="vu-parents">
          <div className="wrap">
            <div className="vu-parents__grid">
              <div className="vu-parents__label">
                <span className="eyebrow">— A note for parents</span>
                <h2>We&apos;ve thought about this <em>carefully.</em></h2>
              </div>
              <div className="vu-parents__body">
                <p>
                  We know handing your child these topics sounds big. So let us be clear about
                  how we protect them — at every step.
                </p>
                <ul className="vu-parents__list">
                  <li><strong>Trained adult supervision</strong> — every team has a chaperone, at all times.</li>
                  <li><strong>Qualified counsellor on site</strong> — present throughout the four days.</li>
                  <li><strong>Community awareness, not personal trauma</strong> — students study these topics safely and respectfully.</li>
                  <li><strong>Public, supervised spaces only</strong> — never alone, never unaccompanied.</li>
                  <li><strong>A complete safety protocol &amp; code of conduct</strong> — followed without exception.</li>
                </ul>
                <p className="vu-parents__foot">
                  This is structured, safe, and designed by educators who care about your
                  child <em>as a whole person</em> — not just a report card.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS */}
        <section className="vu-details" id="details">
          <div className="wrap">
            <div className="vu-details__head">
              <span className="eyebrow">— Camp details</span>
              <h2>The <em>practical</em> bits.</h2>
            </div>
            <div className="vu-details__grid">
              <div className="vu-detail"><div className="k">Dates</div><div className="v">15<sup>th</sup> – 18<sup>th</sup> June 2026</div></div>
              <div className="vu-detail"><div className="k">Timings</div><div className="v">Reporting time shared closer to date</div></div>
              <div className="vu-detail"><div className="k">Eligibility</div><div className="v">Students of Classes 8<sup>th</sup> – 10<sup>th</sup></div></div>
              <div className="vu-detail"><div className="k">Venue</div><div className="v">School Campus</div></div>
              <div className="vu-detail"><div className="k">Fee</div><div className="v">{fmt(fee)} per student<br /><span className="vu-detail__sub">Includes handbook, T-shirt, materials &amp; certificate</span></div></div>
              <div className="vu-detail"><div className="k">Seats</div><div className="v">Limited — first come, first served</div></div>
              <div className="vu-detail vu-detail--wide"><div className="k">Last date to register</div><div className="v">5<sup>th</sup> June 2026</div></div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="vu-final">
          <div className="wrap">
            <span className="eyebrow" style={{ color: "var(--yellow)" }}>— Don&apos;t let your child miss this</span>
            <h2>Every great change begins with a single voice <em>ready to be heard.</em></h2>
            <p>This June, let it be your child&apos;s.</p>
            <div className="vu-final__row">
              <button type="button" className="btn-vu btn-vu--primary" onClick={openModal}>
                Register now
                <span className="pill">{fmt(fee)}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </button>
              <a className="btn-vu btn-vu--ghost-light" href="#details">See the details<span className="arrow" aria-hidden="true">→</span></a>
            </div>

            <div className="vu-final__contact">
              <span>Questions? Call or WhatsApp <a href="tel:+919431904333">+91 94319 04333</a></span>
              <span>·</span>
              <span>Write to <a href="mailto:contact@eldenheights.org">contact@eldenheights.org</a></span>
            </div>
            <p className="vu-final__credit">
              A Human Side Initiative · Edenwoods Eduhub Foundation &amp; The Elden Heights School.
            </p>
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
                  <span className="eyebrow">— Voices Unheard 2026 · Registration · {fmt(fee)}</span>
                  <h2>Reserve a seat at <em>Voices Unheard.</em></h2>
                  <p>
                    Fill in the details below. We&apos;ll save the registration, take the
                    {" "}{fmt(fee)} fee securely via Razorpay, and email a unique camp ID card
                    (e.g. <strong>VU-2026-001</strong>) the moment the payment confirms.
                  </p>
                </div>

                {error && <div className="reg-error is-show" role="alert">{error}</div>}

                <form className="reg-form" ref={formRef} onSubmit={handleRegister} noValidate>
                  <fieldset className="reg-fieldset">
                    <legend>About the student</legend>
                    <div className="form__row">
                      <div className="field"><label>First name <span className="req">*</span></label><input name="firstName" type="text" placeholder="Aanya" required /></div>
                      <div className="field"><label>Last name <span className="req">*</span></label><input name="lastName" type="text" placeholder="Krishnan" required /></div>
                    </div>
                    <div className="form__row">
                      <div className="field"><label>Email (ID card sent here) <span className="req">*</span></label><input name="email" type="email" placeholder="you@example.com" required /></div>
                      <div className="field"><label>Student phone <span className="req">*</span></label><input name="phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" pattern="[0-9+\-\s]{7,15}" required /></div>
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
                    <legend>School &amp; class</legend>
                    <div className="form__row">
                      <div className="field"><label>School <span className="req">*</span></label><input name="school" type="text" placeholder="The Elden Heights School" required /></div>
                      <div className="field">
                        <label>Class / grade <span className="req">*</span></label>
                        <select name="classGrade" required defaultValue="">
                          <option value="">Select</option>
                          <option>Class 8</option>
                          <option>Class 9</option>
                          <option>Class 10</option>
                          <option>Class 11</option>
                          <option>Class 12</option>
                        </select>
                      </div>
                    </div>
                    <div className="form__row">
                      <div className="field"><label>Section (optional)</label><input name="section" type="text" placeholder="A / B / C…" /></div>
                      <div className="field">
                        <label>T-shirt size <span className="req">*</span></label>
                        <select name="tshirtSize" required defaultValue="">
                          <option value="">Select</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>Address</legend>
                    <div className="field"><label>Address <span className="req">*</span></label><input name="address" type="text" placeholder="House / street / area" required /></div>
                    <div className="reg-row-3">
                      <div className="field"><label>City <span className="req">*</span></label><input name="city" type="text" placeholder="Bengaluru" required /></div>
                      <div className="field"><label>State <span className="req">*</span></label><input name="state" type="text" placeholder="Karnataka" required /></div>
                      <div className="field"><label>PIN code <span className="req">*</span></label><input name="pincode" type="text" inputMode="numeric" pattern="[0-9]{6}" placeholder="560001" required /></div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>Parent / Guardian</legend>
                    <div className="form__row">
                      <div className="field"><label>Guardian name <span className="req">*</span></label><input name="guardianName" type="text" placeholder="Parent / guardian" required /></div>
                      <div className="field">
                        <label>Relation <span className="req">*</span></label>
                        <select name="guardianRelation" required defaultValue="">
                          <option value="">Select</option><option>Mother</option><option>Father</option><option>Guardian</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form__row">
                      <div className="field"><label>Guardian phone <span className="req">*</span></label><input name="guardianPhone" type="tel" inputMode="tel" placeholder="+91 …" pattern="[0-9+\-\s]{7,15}" required /></div>
                      <div className="field"><label>Guardian email <span className="req">*</span></label><input name="guardianEmail" type="email" placeholder="parent@example.com" required /></div>
                    </div>
                    <div className="form__row">
                      <div className="field"><label>Emergency contact name <span className="req">*</span></label><input name="emergencyName" type="text" placeholder="Different from guardian, if possible" required /></div>
                      <div className="field"><label>Emergency contact phone <span className="req">*</span></label><input name="emergencyPhone" type="tel" inputMode="tel" placeholder="+91 …" pattern="[0-9+\-\s]{7,15}" required /></div>
                    </div>
                  </fieldset>

                  <fieldset className="reg-fieldset">
                    <legend>A few more things</legend>
                    <div className="field"><label>Medical notes / allergies (optional)</label><textarea name="medicalNotes" placeholder="Anything we should know — allergies, medication, conditions"></textarea></div>
                    <div className="field">
                      <label>How did you hear about us? <span className="req">*</span></label>
                      <select name="hearAbout" required defaultValue="">
                        <option value="">Select</option><option>School announcement</option><option>A friend or family</option><option>Social media</option><option>Edenwoods Foundation</option><option>Other</option>
                      </select>
                    </div>
                    <div className="field"><label>Why does the student want to join? <span className="req">*</span></label><textarea name="motivation" placeholder="A few honest lines — what moves them about this camp" required></textarea></div>
                  </fieldset>

                  <label className="reg-consent">
                    <input type="checkbox" name="consents" value="parent-consent" required />
                    <span>As the parent/guardian, I consent to my child attending Voices Unheard 2026 under the supervision of The Human Side staff, and I agree to be contacted about the camp. <span className="req">*</span></span>
                  </label>
                  <label className="reg-consent">
                    <input type="checkbox" name="consents" value="code-of-conduct" required />
                    <span>I have read and agree to the camp&apos;s code of conduct and safety protocol. I confirm the details above are correct. <span className="req">*</span></span>
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
                <h2>You&apos;re <em>in.</em> See you in June.</h2>
                <p>Your {fmt(fee)} registration is confirmed and a unique ID card has been emailed to you. Bring it on Day 1 — it&apos;s your check-in.</p>
                <div className="reg-id-card">
                  <div className="k">Camp ID</div>
                  <div className="id">{success.memberId}</div>
                  <div className="who">{success.name}</div>
                </div>
                <p style={{ fontSize: 13 }}>
                  A confirmation email with the ID card is on its way. Questions? <a href="mailto:contact@eldenheights.org" style={{ color: "var(--red)" }}>contact@eldenheights.org</a>
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
