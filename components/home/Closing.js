"use client";

import { useRef } from "react";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const LINES = [
  ["Care is a", false],
  ["practice,", true],
  ["not a feeling.", false],
];

const STEPS = [
  {
    n: "01",
    title: "Come to a Saturday meeting",
    body: "On the school campus. Nothing to prepare, nothing to sign the first time.",
  },
  {
    n: "02",
    title: "Pick a drive",
    body: "Whatever is next: a clean-up, a book drive, a workshop. You choose your share.",
  },
  {
    n: "03",
    title: "Bring a friend",
    body: "The work gets easier with two, and it lasts longer when someone else is in it too.",
  },
];

export default function Closing() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".hm-close__head", start: "top 80%" } })
          .from(".hm-close__head .ln > span", { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.1 })
          .from(".hm-close__lede, .hm-close__row", { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.5);

        gsap.fromTo(
          ".hm-close__line",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".hm-close__steps", start: "top 85%", end: "bottom 60%", scrub: true },
          }
        );
        gsap.from(".hm-step", {
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: ".hm-close__steps", start: "top 85%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-close" ref={ref}>
      <div className="wrap">
        <p className="kicker"><b>(05)</b> Now what</p>

        <h2 className="hm-close__head">
          {LINES.map(([t, accent]) => (
            <span className="ln" key={t}>
              <span className={accent ? "accent" : undefined}>{t}</span>
            </span>
          ))}
        </h2>

        <div className="hm-close__split">
          <p className="hm-close__lede">
            You don’t need to be experienced, or eloquent, or sure of yourself. You only need to
            show up. We’ll figure out the rest together.
          </p>
          <div className="hm-close__row">
            <Magnetic>
              <Link className="btn btn--light" href="/get-involved">
                Volunteer with us<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link className="btn btn--ghost" href="/donate">
                Donate instead<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hm-close__steps">
          <span className="hm-close__line" aria-hidden="true" />
          <ol>
            {STEPS.map((s) => (
              <li className="hm-step" key={s.n}>
                <span className="hm-step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
