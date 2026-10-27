"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// [label, value, count-up from, suffix]
const FACTS = [
  ["Founded", 2026, 2000, ""],
  ["Focus areas", 4, 0, ""],
  ["Student-led", 100, 0, "%"],
  ["We meet", "Sat", null, ""],
];

const pad = (n, v) => String(Math.round(n)).padStart(String(v).length < 2 ? 2 : String(v).length, "0");

export default function Facts() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const cells = gsap.utils.toArray(".hm-facts__cell", ref.current);
        gsap.from(".hm-facts__cell", {
          yPercent: 30,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
        gsap.from(".hm-facts__grid", {
          "--rule": 0,
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
        cells.forEach((cell) => {
          const el = cell.querySelector("[data-to]");
          if (!el) return;
          const to = Number(el.dataset.to);
          const state = { v: Number(el.dataset.from) };
          gsap.to(state, {
            v: to,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
            onUpdate: () => { el.textContent = pad(state.v, to); },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-facts" ref={ref} aria-label="At a glance">
      <div className="wrap">
        <dl className="hm-facts__grid">
          {FACTS.map(([label, value, from, suffix]) => (
            <div className="hm-facts__cell" key={label}>
              <dt>{label}</dt>
              <dd>
                {from === null ? (
                  value
                ) : (
                  <>
                    <span data-to={value} data-from={from}>{pad(value, value)}</span>
                    {suffix}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
