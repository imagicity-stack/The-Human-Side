"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Partners() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%" } })
          .from(".hm-partners__title .ln > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.08 })
          .from(".hm-partners__logo", { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "expo.inOut", stagger: 0.12 }, 0.1)
          .from(".hm-partners__logo img", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.6)
          .from(".hm-partners__copy > p, .hm-partners__copy > .btn", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.4);
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-partners" ref={ref}>
      <div className="wrap">
        <p className="kicker"><b>(04)</b> In partnership</p>
        <div className="hm-partners__inner">
          <div className="hm-partners__copy">
            <h2 className="hm-partners__title">
              <span className="ln"><span>Two institutions.</span></span>
              <span className="ln"><span><em>One initiative.</em></span></span>
            </h2>
            <p>
              The Human Side is an Edenwoods Eduhub Foundation programme, run in partnership with
              The Elden Heights School. Together we hold the space, fund the work, and put students
              in the lead.
            </p>
            <Link className="btn btn--ghost" href="/partners">
              Meet the partners<span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="hm-partners__logos">
            <Link href="/partners" className="hm-partners__logo">
              <span className="k">A / Founding body</span>
              <img src="/assets/edenwoods-logo.png" alt="Edenwoods Eduhub Foundation" loading="lazy" />
              <span className="go" aria-hidden="true">↗</span>
            </Link>
            <Link href="/partners" className="hm-partners__logo">
              <span className="k">B / Partner school</span>
              <img src="/assets/elden-heights-logo.png" alt="The Elden Heights School" loading="lazy" />
              <span className="go" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
