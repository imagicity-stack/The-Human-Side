"use client";

import { useRef } from "react";
import Photo from "@/components/Photo";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const FIELD = [
  {
    src: "/assets/images/field-1.jpg",
    alt: "Volunteers in The Human Side t-shirts sweeping a lane on a clean-up drive",
    cap: "Clean-up",
    sub: "The first hour",
  },
  {
    src: "/assets/images/field-2.jpg",
    alt: "Students clearing litter from a roadside during a clean-up drive",
    cap: "Street by street",
    sub: "One lane at a time",
  },
  {
    src: "/assets/images/field-4.jpg",
    alt: "Students sweeping and bagging waste at a neighbourhood clean-up",
    cap: "The long sweep",
    sub: "Until it's done",
  },
  {
    src: "/assets/images/field-3.jpg",
    alt: "Volunteers filling bags with collected litter",
    cap: "Together",
    sub: "Every hand counts",
  },
];

export default function Gallery() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(".hm-field__title .ln > span", {
          yPercent: 110,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".hm-field__title", start: "top 85%" },
        });

        gsap.utils.toArray(".hm-fig", ref.current).forEach((fig) => {
          const media = fig.querySelector(".hm-fig__media");
          const img = fig.querySelector("img");
          gsap.fromTo(
            media,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "expo.inOut",
              scrollTrigger: { trigger: fig, start: "top 85%" },
            }
          );
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
          gsap.from(fig.querySelector("figcaption"), {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.5,
            scrollTrigger: { trigger: fig, start: "top 85%" },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="hm-field" ref={ref}>
      <div className="wrap">
        <div className="hm-field__head">
          <p className="kicker"><b>(03)</b> Field notes</p>
          <h2 className="hm-field__title">
            <span className="ln"><span>The work,</span></span>
            <span className="ln"><span><em>in pictures.</em></span></span>
          </h2>
          <p className="hm-field__note">
            No stock photos. These are our volunteers, on our streets, doing the unglamorous part.
          </p>
        </div>

        <div className="hm-field__grid">
          {FIELD.map((f, i) => (
            <figure className={`hm-fig hm-fig--${i + 1}`} key={f.src}>
              <div className="hm-fig__media">
                <Photo src={f.src} alt={f.alt} />
              </div>
              <figcaption>
                <span className="n">Fig. {String(i + 1).padStart(2, "0")}</span>
                <span className="c">{f.cap}</span>
                <span className="s">{f.sub}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
