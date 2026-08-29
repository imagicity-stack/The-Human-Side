"use client";

import { useEffect } from "react";

/* Fades sections in as they enter the viewport. The class that hides them is
   added here, so with JS off — or before hydration — everything stays visible. */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return undefined;

    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    const seen = new WeakSet();
    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Anything already on screen at load reveals immediately.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          el.classList.add("is-in");
        } else {
          io.observe(el);
        }
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
