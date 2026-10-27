"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAUSES = [
  {
    n: "01",
    title: "Women’s Empowerment",
    body: "Workshops, scholarships, and partnerships that put resources and choice in women’s hands, starting close to home.",
    icon: (
      <>
        <circle cx="14" cy="10" r="5" />
        <path d="M5 24c1-5 5-7 9-7s8 2 9 7" />
      </>
    ),
  },
  {
    n: "02",
    title: "Safe Spaces & Awareness",
    body: "Honest, age-appropriate conversations on consent, harassment, and reporting. For students, by students, with help from professionals.",
    icon: (
      <>
        <path d="M14 4l8 3.4v6.2c0 5.2-3.3 9.4-8 10.8-4.7-1.4-8-5.6-8-10.8V7.4z" />
        <path d="M10.6 14.2l2.3 2.3 4.5-4.6" />
      </>
    ),
  },
  {
    n: "03",
    title: "Environment",
    body: "Tree-planting weekends, plastic audits, and the slow, unglamorous work of changing how a campus consumes.",
    icon: (
      <>
        <path d="M14 24c0-6 4-10 10-10-2 6-5 10-10 10z" />
        <path d="M14 24c0-6-4-10-10-10 2 6 5 10 10 10z" />
        <path d="M14 24V8" />
      </>
    ),
  },
  {
    n: "04",
    title: "Charity & Community",
    body: "Book drives, meal kits, and visits to shelters, old-age homes, and neighbourhoods that don’t make the news.",
    icon: <path d="M14 24s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12z" />,
  },
];

/* Desktop: the section pins and the four causes slide past sideways.
   Smaller screens get a plain stack. */
export default function Causes() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1001px)", () => {
        const track = ref.current.querySelector(".hm-causes__track");
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".hm-causes__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(CAUSES.length, Math.max(1, Math.ceil(self.progress * CAUSES.length + 0.001)));
              const out = ref.current.querySelector(".hm-causes__count b");
              if (out) out.textContent = String(idx).padStart(2, "0");
            },
          },
        });

        gsap.to(".hm-causes__bar span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".hm-causes__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Each card's number slides against the travel for a little depth.
        gsap.utils.toArray(".hm-cause__num", ref.current).forEach((num) => {
          gsap.fromTo(
            num,
            { xPercent: 30 },
            {
              xPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: num.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1000px)", () => {
        gsap.utils.toArray(".hm-cause", ref.current).forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-causes" ref={ref}>
      <div className="hm-causes__pin">
        <div className="hm-causes__track">
          <header className="hm-causes__intro">
            <p className="kicker"><b>(02)</b> What we work on</p>
            <h2 className="hm-causes__title">
              Four threads.
              <br />
              <em>One cloth.</em>
            </h2>
            <p className="hm-causes__lede">
              Our focus areas grew out of conversations inside the school: the things our students
              actually wanted to do something about. The list isn’t fixed. It grows with the people
              who join us.
            </p>
            <div className="hm-causes__progress" aria-hidden="true">
              <span className="hm-causes__count"><b>01</b> / 04</span>
              <span className="hm-causes__bar"><span /></span>
            </div>
          </header>

          {CAUSES.map((c) => (
            <article className="hm-cause" key={c.n}>
              <span className="hm-cause__num" aria-hidden="true">{c.n}</span>
              <div className="hm-cause__body">
                <span className="hm-cause__icon" aria-hidden="true">
                  <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                    {c.icon}
                  </svg>
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
