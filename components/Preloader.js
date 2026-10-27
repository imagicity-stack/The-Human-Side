"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["The", "Human", "Side"];

/* First visit of the session only. The inline script in layout.js decides
   (html.has-intro); this just plays the curtain and hands over to the page. */
export default function Preloader() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = document.documentElement;
      if (!root.classList.contains("has-intro")) return;

      const num = ref.current.querySelector(".preloader__num");
      const count = { v: 0 };
      const finish = () => {
        try { sessionStorage.setItem("ths-intro", "1"); } catch (e) { /* private mode */ }
        root.classList.remove("has-intro");
      };

      gsap
        .timeline({ onComplete: finish })
        .from(".preloader__word .w > span", {
          yPercent: 110,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
        })
        .to(
          count,
          {
            v: 100,
            duration: 1.5,
            ease: "power3.inOut",
            onUpdate: () => {
              num.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0
        )
        .to(".preloader__bar", { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, 0)
        .to(".preloader__word .w > span", { yPercent: -110, duration: 0.7, stagger: 0.05, ease: "expo.in" }, 1.45)
        .call(() => window.dispatchEvent(new Event("ths:intro-done")), null, 1.95)
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, 1.85);
    },
    { scope: ref }
  );

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="preloader__top">
        <span>Edenwoods × Elden Heights</span>
        <span>Est. 2026</span>
      </div>
      <p className="preloader__word">
        {WORDS.map((w, i) => (
          <span key={w} className={`w${i === 2 ? " w--accent" : ""}`}>
            <span>{w}</span>
          </span>
        ))}
      </p>
      <div className="preloader__bottom">
        <span>The side that still cares</span>
        <span className="preloader__num">000</span>
      </div>
      <span className="preloader__bar" />
    </div>
  );
}
