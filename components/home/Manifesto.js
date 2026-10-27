"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// [text, accent?] — read in order, one sentence.
const COPY = [
  ["We don’t promise to fix the world.", false],
  ["We promise to keep looking at it honestly, and to show up, again and again, for the people and places that need someone to", false],
  ["still care.", true],
];

/* The promise fills in word by word as it scrolls through the viewport. */
export default function Manifesto() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          ".hm-mani__copy .wd",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".hm-mani__copy",
              start: "top 78%",
              end: "bottom 45%",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-mani" ref={ref}>
      <div className="wrap">
        <p className="kicker"><b>(01)</b> Our quiet promise</p>
        <p className="hm-mani__copy">
          {COPY.map(([text, accent], s) => (
            <span key={s} className={accent ? "accent" : undefined}>
              {text.split(" ").map((w, i) => (
                <span className="wd" key={i}>{w} </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
