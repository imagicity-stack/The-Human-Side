"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const LINKS = [
  { key: "home", href: "/", label: "Home" },
  { key: "about", href: "/about", label: "About" },
  { key: "voices-unheard", href: "/voices-unheard", label: "Voices Unheard" },
  { key: "get-involved", href: "/get-involved", label: "Get Involved" },
  { key: "partners", href: "/partners", label: "Partners" },
];

// Kept out of the desktop link row so it can stand on its own as a button;
// it joins the list in the mobile drawer.
const DONATE = { key: "donate", href: "/donate", label: "Donate" };

const EXPO = [0.87, 0, 0.13, 1];

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M12 20s-7.5-4.3-7.5-10a4.2 4.2 0 0 1 7.5-2.6A4.2 4.2 0 0 1 19.5 10c0 5.7-7.5 10-7.5 10z" />
  </svg>
);

const Roll = ({ children }) => (
  <span className="roll">
    <span data-text={children}>{children}</span>
  </span>
);

export default function SiteHeader({ active }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 });

  // Condense on scroll, tuck away when heading down, return when heading up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    setScrolled(y > 12);
    if (y < 160) setHidden(false);
    else if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
  });

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

  // Close the drawer on navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock the page behind the drawer, and let Escape out of it.
  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth > 960) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => () => {
    document.body.classList.remove("nav-locked");
    window.__lenis?.start();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <motion.header
        className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EXPO }}
      >
        <div className="site-header__inner">
          <Link className="site-header__mark" href="/" aria-label="The Human Side — home">
            <span className="mark__dot" aria-hidden="true"></span>
            <span className="mark__words" aria-hidden="true">
              <span className="a">The</span>
              <span className="b">Human <em>Side</em></span>
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
                <Roll>{link.label}</Roll>
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link
              className={`site-nav__donate${isActive(DONATE) ? " is-active" : ""}`}
              href={DONATE.href}
              aria-current={isActive(DONATE) ? "page" : undefined}
            >
              <HeartIcon />
              <Roll>Donate</Roll>
            </Link>
            <Link className="site-nav__cta" href="/get-involved">
              <Roll>Join us</Roll>
              <span aria-hidden="true">→</span>
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
            </button>
          </div>
        </div>

        <motion.span
          className="site-header__progress"
          aria-hidden="true"
          style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-mobile-nav"
            className="mobile-nav"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.8, ease: EXPO }}
          >
            <nav className="mobile-nav__links" aria-label="Mobile">
              {[...LINKS, DONATE].map((link, i) => (
                <div className="mobile-nav__row" key={link.key}>
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: reduced ? 0 : 0.8, ease: EXPO, delay: reduced ? 0 : 0.18 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`mobile-nav__link${isActive(link) ? " is-active" : ""}`}
                      aria-current={isActive(link) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                      <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              className="mobile-nav__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.5 }}
            >
              <Link className="site-nav__cta" href="/get-involved" onClick={() => setOpen(false)}>
                Join the next drive<span aria-hidden="true">→</span>
              </Link>
              <div className="mobile-nav__meta">
                <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a>
                <span>The side that still cares</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
