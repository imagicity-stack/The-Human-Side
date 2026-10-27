"use client";

import { useRef } from "react";
import Photo from "@/components/Photo";
import { gsap, useGSAP } from "@/lib/gsap";

/* A small photo between two giant words. Scrolling pins the frame and opens
   the photo to full bleed while the words are pushed off either side. */
export default function Spotlight() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 761px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "+=160%",
              scrub: 0.6,
              pin: ".hm-spot__pin",
              anticipatePin: 1,
            },
          })
          .fromTo(
            ".hm-spot__media",
            { clipPath: "inset(31% 38% 31% 38%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }
          )
          .fromTo(".hm-spot__media img", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
          .to(".hm-spot__word--l", { xPercent: -120, duration: 0.8 }, 0)
          .to(".hm-spot__word--r", { xPercent: 120, duration: 0.8 }, 0)
          .to(".hm-spot__cap", { opacity: 0, duration: 0.2 }, 0)
          .from(".hm-spot__over .ln > span", { yPercent: 110, stagger: 0.06, duration: 0.3 }, 0.7)
          .from(".hm-spot__over-meta", { opacity: 0, duration: 0.2 }, 0.85);
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 760px)", () => {
        gsap.fromTo(
          ".hm-spot__media",
          { clipPath: "inset(12% 12% 12% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: ".hm-spot__media", start: "top bottom", end: "center center", scrub: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-spot" ref={ref} aria-label="The side that still cares">
      <div className="hm-spot__pin">
        <div className="hm-spot__media">
          <Photo src="/assets/images/hero.jpg" alt="Volunteers in The Human Side t-shirts cheering together after a drive" />
          <div className="hm-spot__over">
            <p className="hm-spot__over-line">
              <span className="ln"><span>Small acts</span></span>
              <span className="ln"><span>that add up.</span></span>
            </p>
            <p className="hm-spot__over-meta">Fig. 00 / The team, after a drive</p>
          </div>
        </div>
        <p className="hm-spot__word hm-spot__word--l" aria-hidden="true">Still</p>
        <p className="hm-spot__word hm-spot__word--r" aria-hidden="true">Cares</p>
        <p className="hm-spot__cap" aria-hidden="true">Scroll to open ↓</p>
      </div>
    </section>
  );
}
