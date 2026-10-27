"use client";

import { useRef } from "react";
import Link from "next/link";
import Photo from "@/components/Photo";
import Magnetic from "@/components/Magnetic";
import SplitChars from "./SplitChars";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const META = [
  ["(TH/S)", "A social initiative"],
  ["Est.", "2026"],
  ["Held by", "Edenwoods × Elden Heights"],
  ["We meet", "Saturdays, on campus"],
];

export default function Hero() {
  const ref = useRef(null);

  useGSAP(
    (_, contextSafe) => {
      const root = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Entrance. The page is held in its start state by CSS until this
        // runs, so the class flips and the tweens set in the same frame.
        const enter = contextSafe(() => {
          root.classList.add("hero-ready");
          gsap
            .timeline({ defaults: { ease: "expo.out", duration: 1.5 } })
            .from(".hm-hero__title .ch > span", { yPercent: 115, stagger: 0.035 })
            .from(".hm-hero__window", { clipPath: "inset(0 100% 0 0)", duration: 1.7, ease: "expo.inOut" }, 0.15)
            .from(".hm-hero__window img", { scale: 1.6, duration: 2.2 }, 0.15)
            .from(".hm-hero__meta > div", { yPercent: 100, opacity: 0, stagger: 0.07, duration: 1.1 }, 0.45)
            .from(".hm-hero__foot > *", { y: 40, opacity: 0, stagger: 0.09, duration: 1.3 }, 0.6)
            .from(".hm-hero__rule", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.3);
        });

        if (root.classList.contains("has-intro")) {
          window.addEventListener("ths:intro-done", enter, { once: true });
        } else {
          enter();
        }

        // Scroll: the two lines drift apart, the window opens up.
        const scrub = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hm-hero__title .l1", { xPercent: -7, ease: "none", scrollTrigger: scrub });
        gsap.to(".hm-hero__title .l2", { xPercent: 5, ease: "none", scrollTrigger: scrub });
        gsap.to(".hm-hero__window img", { yPercent: 12, ease: "none", scrollTrigger: scrub });

        return () => window.removeEventListener("ths:intro-done", enter);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.classList.add("hero-ready");
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-hero" ref={ref}>
      <div className="wrap">
        <div className="hm-hero__meta">
          {META.map(([k, v]) => (
            <div key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>
        <span className="hm-hero__rule" aria-hidden="true" />

        <h1 className="hm-hero__title" aria-label="The Human Side">
          <span className="line l1">
            <SplitChars text="The Human" />
          </span>
          <span className="line l2">
            <SplitChars text="Side" />
            <span className="hm-hero__window" aria-hidden="true">
              <Photo src="/assets/images/field-1.jpg" alt="" loading="eager" />
              <span className="hm-hero__window-tag">Clean-up drive / 2026</span>
            </span>
          </span>
        </h1>

        <div className="hm-hero__foot">
          <p className="hm-hero__tagline">
            The side that <span className="mark-line">still cares.</span>
          </p>
          <p className="hm-hero__lede">
            A student-led initiative for empathy, dignity, and small acts that add up. Drives,
            conversations, and quiet work for women’s safety, the environment, and the people in
            our city who are too often overlooked.
          </p>
          <div className="hm-hero__cta">
            <Magnetic>
              <Link className="btn btn--red" href="/get-involved">
                Join the next drive<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link className="btn btn--ghost" href="/about">
                What we stand for<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
