"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    path: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" />
        <circle cx="12" cy="12" r="4" />
        <rect x="16.4" y="6" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" />
        <path d="M10.5 9.6v4.8L14.8 12z" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    path: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" />
        <path d="M7.6 10.4v6.2M7.6 7.6v.1M11.4 16.6v-6.2M11.4 13c0-1.5.9-2.4 2.2-2.4s2.1.9 2.1 2.5v3.5" />
      </>
    ),
  },
];

const WORD = "The Human Side";

export default function SiteFooter() {
  const ref = useRef(null);

  // The wordmark rises letter by letter as the footer comes into view.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(".site-footer__word span", {
          yPercent: 100,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.035,
          scrollTrigger: { trigger: ".site-footer__word", start: "top bottom-=40" },
        });
      });
    },
    { scope: ref }
  );

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer" ref={ref}>
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div>
            <p className="site-footer__tag">
              The side that <em>still</em> cares.
            </p>
            <p className="site-footer__blurb">
              An initiative of Edenwoods Eduhub Foundation, in partnership with
              The Elden Heights School. Student-led, quietly, since 2026.
            </p>
            <div className="site-footer__socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__col">
            <h4>The Site</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/voices-unheard">Voices Unheard</Link></li>
              <li><Link href="/get-involved">Get Involved</Link></li>
              <li><Link href="/partners">Partners</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>Reach Out</h4>
            <ul>
              <li><a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a></li>
              <li><Link href="/get-involved">Volunteer with us</Link></li>
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/contact">Contact details</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>The Partners</h4>
            <ul>
              <li><Link href="/partners">Edenwoods Eduhub Foundation</Link></li>
              <li><Link href="/partners">The Elden Heights School</Link></li>
              <li><a href="mailto:contact@edenwoods.org">Partner with us</a></li>
            </ul>
          </div>
        </div>

        <nav className="site-footer__legal" aria-label="Legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/refund-policy">Refund &amp; Cancellation</Link>
          <Link href="/shipping">Shipping &amp; Delivery</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        <div className="site-footer__bottom">
          <span>© 2026 The Human Side · Edenwoods Eduhub Foundation</span>
          <button type="button" className="site-footer__top-btn" onClick={toTop}>
            Back to top ↑
          </button>
        </div>
      </div>

      <p className="site-footer__word" aria-hidden="true">
        {WORD.split("").map((c, i) => (
          <span key={i} className={i >= 10 ? "accent" : undefined}>
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
    </footer>
  );
}
