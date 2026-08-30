import Link from "next/link";

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.6v4.8L14.8 12z" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M7.4 10.4v6.2M7.4 7.6v.1M11.4 16.6v-6.2M11.4 13c0-1.5.9-2.4 2.2-2.4s2.1.9 2.1 2.5v3.5" />
      </>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
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
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
              <li><Link href="/get-involved#donate">Donate</Link></li>
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
          <span>Made with care, by hand</span>
        </div>
      </div>
    </footer>
  );
}
