import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div>
            <p className="site-footer__tag">
              The side that <em>still</em> cares.
            </p>
            <p style={{ color: "#9B95B0", fontSize: 13, maxWidth: "32ch", margin: 0 }}>
              An initiative of Edenwoods Eduhub Foundation, in partnership with The Elden Heights School.
            </p>
          </div>
          <div className="site-footer__col">
            <h4>The Site</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/get-involved">Get Involved</Link></li>
              <li><Link href="/partners">Partners</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Reach Out</h4>
            <ul>
              <li><a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a></li>
              <li><Link href="/get-involved">Volunteer</Link></li>
              <li><Link href="/get-involved">Donate</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Follow</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 The Human Side</span>
          <span>Made with care, by hand</span>
        </div>
      </div>
    </footer>
  );
}
