import Link from "next/link";

export default function SiteHeader({ active }) {
  const cls = (key) => (active === key ? "is-active" : undefined);
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__mark" href="/">
          <span className="mark__dot" aria-hidden="true"></span>
          <span className="mark__words">
            <span className="a">The Human Side</span>
            <span className="b">An Edenwoods × Elden Heights Initiative</span>
          </span>
        </Link>
        <nav className="site-nav">
          <Link className={cls("home")} href="/">Home</Link>
          <Link className={cls("about")} href="/about">About</Link>
          <Link className={cls("get-involved")} href="/get-involved">Get Involved</Link>
          <Link className={cls("partners")} href="/partners">Partners</Link>
          <Link className="site-nav__cta" href="/get-involved">
            Join us<span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
