"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { key: "home", href: "/", label: "Home" },
  { key: "about", href: "/about", label: "About" },
  { key: "voices-unheard", href: "/voices-unheard", label: "Voices Unheard" },
  { key: "get-involved", href: "/get-involved", label: "Get Involved" },
  { key: "partners", href: "/partners", label: "Partners" },
];

export default function SiteHeader({ active }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Active link: derived from the URL, with the page's own hint as a fallback.
  const isActive = useCallback(
    (link) => {
      if (pathname) {
        return link.href === "/"
          ? pathname === "/"
          : pathname === link.href || pathname.startsWith(link.href + "/");
      }
      return active === link.key;
    },
    [pathname, active]
  );

  // Condense the bar and draw the reading-progress hairline.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY || 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 12);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close the drawer on navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock the page behind the drawer, and let Escape out of it.
  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => () => document.body.classList.remove("nav-locked"), []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="site-header__inner">
          <Link className="site-header__mark" href="/" aria-label="The Human Side — home">
            <span className="mark__dot" aria-hidden="true"></span>
            <span className="mark__words">
              <span className="a">The Human <em>Side</em></span>
              <span className="b">Edenwoods × Elden Heights</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`site-nav__link${isActive(link) ? " is-active" : ""}`}
                aria-current={isActive(link) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link className="site-nav__cta" href="/get-involved">
              Join us<span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className="site-header__burger"
              aria-expanded={open}
              aria-controls="site-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <i aria-hidden="true"></i>
              <i aria-hidden="true"></i>
              <i aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <span
          className="site-header__progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <div
        id="site-mobile-nav"
        className={`mobile-nav${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="mobile-nav__links" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <Link
              key={link.key}
              href={link.href}
              className={`mobile-nav__link${isActive(link) ? " is-active" : ""}`}
              style={{ transitionDelay: `${80 + i * 55}ms` }}
              aria-current={isActive(link) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-nav__foot">
          <Link className="site-nav__cta" href="/get-involved" onClick={() => setOpen(false)}>
            Join the next drive<span aria-hidden="true">→</span>
          </Link>
          <div className="mobile-nav__meta">
            <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a>
            <span>The side that still cares</span>
          </div>
        </div>
      </div>
    </>
  );
}
