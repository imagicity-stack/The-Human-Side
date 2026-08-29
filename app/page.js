import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Photo from "@/components/Photo";
import "./home.css";

const CAUSES = [
  {
    n: "01",
    title: "Women’s Empowerment",
    body: "Workshops, scholarships, and partnerships that put resources and choice in women’s hands — starting close to home.",
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
    body: "Honest, age-appropriate conversations on consent, harassment, and reporting — for students, by students, with help from professionals.",
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
    body: "Book drives, meal kits, and visits — to shelters, old-age homes, and neighbourhoods that don’t make the news.",
    icon: <path d="M14 24s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12z" />,
  },
];

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
    src: "/assets/images/field-3.jpg",
    alt: "Volunteers filling bags with collected litter",
    cap: "Together",
    sub: "Every hand counts",
  },
  {
    src: "/assets/images/field-4.jpg",
    alt: "Students sweeping and bagging waste at a neighbourhood clean-up",
    cap: "The long sweep",
    sub: "Until it's done",
  },
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
    body: "Whatever is next — a clean-up, a book drive, a workshop. You choose your share.",
  },
  {
    n: "03",
    title: "Bring a friend",
    body: "The work gets easier with two, and it lasts longer when someone else is in it too.",
  },
];

const TICKER = [
  "The side that still cares",
  "Empathy",
  "Dignity",
  "Small acts that add up",
  "Women’s empowerment",
  "Safe spaces",
  "Environment",
  "Community",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />

      <main id="main" className="pg-home">
        {/* ---------------------------------------------------- HERO */}
        <section className="hero">
          <div className="hero__aura" aria-hidden="true" />
          <div className="wrap">
            <div className="hero__grid">
              <div className="hero__copy">
                <span className="tag">
                  <span className="dot dot--live" aria-hidden="true" />
                  A social initiative · Est. 2026
                </span>

                <h1 className="hero__title">
                  The <em>Human</em>
                  <br />
                  Side.
                </h1>

                <p className="hero__tagline">
                  <span className="dash" aria-hidden="true">—</span>
                  the side that <span className="mark-line">still cares</span>.
                </p>

                <p className="hero__lede">
                  A student-led initiative for empathy, dignity, and small acts that add up.
                  We organise drives, conversations, and quiet work for women’s safety, the
                  environment, and the people in our city who are too often overlooked.
                </p>

                <div className="hero__cta">
                  <Link className="btn btn--red" href="/get-involved">
                    Join the next drive<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link className="btn btn--ghost" href="/about">
                    Read what we stand for<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className="hero__visual">
                <div className="hero__frame">
                  <Photo
                    src="/assets/images/hero.jpg"
                    alt="The Human Side — volunteers at a drive"
                    loading="eager"
                  />
                </div>
                <div className="hero__badge">
                  <span className="k">Next up</span>
                  <span className="v">Saturday, on campus</span>
                </div>
              </div>
            </div>

            <dl className="hero__facts">
              <div>
                <dt>Founded</dt>
                <dd>2026</dd>
              </div>
              <div>
                <dt>Focus areas</dt>
                <dd>Four</dd>
              </div>
              <div>
                <dt>We meet</dt>
                <dd>Saturdays</dd>
              </div>
              <div>
                <dt>Led by</dt>
                <dd>Students</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------- TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {[0, 1].map((pass) => (
              <div className="ticker__set" key={pass}>
                {TICKER.map((word) => (
                  <span className="ticker__item" key={`${pass}-${word}`}>
                    {word}
                    <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------- MANIFESTO */}
        <section className="manifesto">
          <div className="wrap">
            <div className="manifesto__inner" data-reveal>
              <div className="manifesto__label">
                <span className="num">01</span>
                <span>Our quiet promise</span>
              </div>
              <p className="manifesto__copy">
                We don’t promise to fix the world.{" "}
                <span className="pale">We promise to keep looking at it honestly</span> — and to
                show up, again and again, for the people and places that need someone to{" "}
                <em>still care</em>.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- CAUSES */}
        <section className="causes">
          <div className="wrap">
            <div className="causes__head" data-reveal>
              <div>
                <p className="eyebrow">— What we work on</p>
                <h2 className="h-title">
                  Four threads,
                  <br />
                  <em>one cloth.</em>
                </h2>
              </div>
              <p className="causes__intro">
                Our focus areas grew out of conversations inside the school — the things our
                students actually wanted to do something about. The list isn’t fixed; it grows
                with the people who join us.
              </p>
            </div>

            <div className="causes__grid">
              {CAUSES.map((c, i) => (
                <article className="cause" key={c.n} data-reveal style={{ "--reveal-delay": `${i * 70}ms` }}>
                  <span className="cause__num">{c.n}</span>
                  <span className="cause__chip" aria-hidden="true">
                    <svg
                      viewBox="0 0 28 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- GALLERY */}
        <section className="gallery">
          <div className="wrap">
            <div className="gallery__head" data-reveal>
              <p className="eyebrow">— Field notes</p>
              <h2 className="h-title">
                The work, <em>in pictures.</em>
              </h2>
            </div>
            <div className="gallery__grid">
              {FIELD.map((f, i) => (
                <figure className="tile" key={f.src} data-reveal style={{ "--reveal-delay": `${i * 90}ms` }}>
                  <Photo src={f.src} alt={f.alt} />
                  <figcaption>
                    <span className="c">{f.cap}</span>
                    <span className="s">{f.sub}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ PARTNERS */}
        <section className="partners">
          <div className="wrap">
            <div className="partners__inner">
              <div className="partners__copy" data-reveal>
                <p className="eyebrow">— In partnership</p>
                <h2 className="h-section">
                  Two institutions,
                  <br />
                  <em>one initiative.</em>
                </h2>
                <p>
                  The Human Side is an Edenwoods Eduhub Foundation programme, run in partnership
                  with The Elden Heights School. Together we hold the space, fund the work, and
                  put students in the lead.
                </p>
                <Link className="btn btn--ghost" href="/partners">
                  Meet the partners<span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="partners__logos" data-reveal>
                <div className="partners__logo">
                  <img src="/assets/edenwoods-logo.png" alt="Edenwoods Eduhub Foundation" loading="lazy" />
                  <span className="k">Founding body</span>
                </div>
                <div className="partners__logo">
                  <img src="/assets/elden-heights-logo.png" alt="The Elden Heights School" loading="lazy" />
                  <span className="k">Partner school</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- CLOSING */}
        <section className="closing">
          <div className="closing__aura" aria-hidden="true" />
          <div className="wrap">
            <div className="closing__grid">
              <div className="closing__copy">
                <p className="eyebrow closing__eyebrow">— Now what</p>
                <h2 className="closing__head">
                  Care is a <em>practice,</em>
                  <br />
                  not a feeling.
                </h2>
                <p className="lede closing__lede">
                  You don’t need to be experienced, or eloquent, or sure of yourself. You only
                  need to show up. We’ll figure out the rest together.
                </p>
                <div className="closing__row">
                  <Link className="btn btn--light" href="/get-involved">
                    Volunteer with us<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link className="btn btn--ghost" href="/about">
                    Read our story<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <ol className="closing__steps">
                {STEPS.map((s) => (
                  <li key={s.n}>
                    <span className="n">{s.n}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
