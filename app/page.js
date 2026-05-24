import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./home.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />

      <main className="pg-home">
        {/* HERO */}
        <section className="hero-v1">
          <div className="wrap">
            <div className="hero-v1__inner">
              <div className="hero-v1__mark">
                <img src="/assets/images/hero.jpg" alt="The Human Side — volunteers at a drive" loading="lazy" />
              </div>

              <div className="hero-v1__eyebrow">
                <span className="line"></span>
                <span className="eyebrow">A social initiative · Est. 2026</span>
              </div>

              <h1 className="hero-v1__title">
                The <em>Human</em><br />
                Side.
              </h1>
              <p className="hero-v1__tagline">
                <span className="dash">—</span>the side that <em>still</em> cares.
              </p>

              <div className="hero-v1__meta">
                <p className="hero-v1__lede">
                  A student-led initiative for empathy, dignity, and small acts that add up.
                  We organise drives, conversations, and quiet work for women&apos;s safety,
                  the environment, and the people in our city who are too often overlooked.
                </p>
                <div className="hero-v1__cta-col">
                  <p>— Begin here</p>
                  <Link className="btn btn--primary" href="/about">
                    Read what we stand for<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link className="btn btn--ghost" href="/get-involved">
                    Join the next drive<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="manifesto">
          <div className="wrap">
            <div className="manifesto__inner">
              <div className="manifesto__label">
                <span className="num">01</span>
                <span>Our quiet promise</span>
              </div>
              <p className="manifesto__copy">
                We don&apos;t promise to fix the world. <span className="pale">We promise to keep looking at it honestly</span> —
                and to show up, again and again, for the people and places that need someone to <em>still care</em>.
              </p>
            </div>
          </div>
        </section>

        {/* GALLERY BAND */}
        <section className="gallery-band">
          <div className="wrap">
            <div className="gallery-band__head">
              <span className="eyebrow">— Field notes</span>
              <h2>The work, <em>in pictures.</em></h2>
            </div>
            <div className="gallery-band__grid">
              <div className="gallery-band__tile is-tinted">
                <img src="/assets/images/field-1.jpg" alt="Drive day — sorting books" loading="lazy" />
                <span className="gallery-band__caption">Drive — Saturday morning</span>
              </div>
              <div className="gallery-band__tile is-tinted">
                <img src="/assets/images/field-2.jpg" alt="Tree planting" loading="lazy" />
                <span className="gallery-band__caption">Plant — campus south</span>
              </div>
              <div className="gallery-band__tile is-tinted">
                <img src="/assets/images/field-3.jpg" alt="Workshop circle — conversation" loading="lazy" />
                <span className="gallery-band__caption">Listen — workshop No. 04</span>
              </div>
              <div className="gallery-band__tile is-tinted">
                <img src="/assets/images/field-4.jpg" alt="Old age home visit" loading="lazy" />
                <span className="gallery-band__caption">Visit — Tuesdays</span>
              </div>
            </div>
          </div>
        </section>

        {/* CAUSES */}
        <section className="causes">
          <div className="wrap">
            <div className="causes__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: 16 }}>— What we work on</p>
                <h2 className="h-title">Four threads,<br /><em style={{ fontStyle: "italic", color: "var(--red)" }}>one cloth.</em></h2>
              </div>
              <p>
                Our focus areas grew out of conversations inside the school — the things our students
                actually wanted to do something about. The list isn&apos;t fixed; it grows with the people who join us.
              </p>
            </div>

            <div className="causes__grid">
              <article className="cause">
                <div className="cause__num">01</div>
                <div className="cause__body">
                  <svg className="cause__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 24c1-5 5-7 9-7s8 2 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <h3>Women&apos;s Empowerment</h3>
                  <p>Workshops, scholarships, and partnerships that put resources and choice in women&apos;s hands — starting close to home.</p>
                </div>
              </article>

              <article className="cause">
                <div className="cause__num">02</div>
                <div className="cause__body">
                  <svg className="cause__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 4v20M4 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <h3>Safe Spaces &amp; Awareness</h3>
                  <p>Honest, age-appropriate conversations on consent, harassment, and reporting — for students, by students, with help from professionals.</p>
                </div>
              </article>

              <article className="cause">
                <div className="cause__num">03</div>
                <div className="cause__body">
                  <svg className="cause__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 24c0-6 4-10 10-10-2 6-5 10-10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M14 24c0-6-4-10-10-10 2 6 5 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M14 24V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <h3>Environment</h3>
                  <p>Tree-planting weekends, plastic audits, and the slow, unglamorous work of changing how a campus consumes.</p>
                </div>
              </article>

              <article className="cause">
                <div className="cause__num">04</div>
                <div className="cause__body">
                  <svg className="cause__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 24s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <h3>Charity &amp; Community</h3>
                  <p>Book drives, meal kits, and visits — to shelters, old-age homes, and neighbourhoods that don&apos;t make the news.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* PARTNERS STRIP */}
        <section className="partners-strip">
          <div className="wrap">
            <div className="partners-strip__inner">
              <div className="partners-strip__copy">
                <p className="eyebrow" style={{ marginBottom: 16 }}>— In partnership</p>
                <h3>Two institutions,<br />one initiative.</h3>
                <p>
                  The Human Side is an Edenwoods Eduhub Foundation programme, run in
                  partnership with The Elden Heights School. Together we hold the space,
                  fund the work, and put students in the lead.
                </p>
                <Link className="btn btn--ghost" href="/partners">
                  Meet the partners<span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="partners-strip__logos">
                <div className="partners-strip__logo">
                  <img src="/assets/edenwoods-logo.png" alt="Edenwoods Eduhub Foundation" />
                </div>
                <div className="partners-strip__logo">
                  <img src="/assets/elden-heights-logo.png" alt="The Elden Heights School" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing">
          <div className="wrap">
            <h2 className="closing__head">
              Care is a <em>practice,</em><br />
              not a feeling.
            </h2>
            <p className="lede" style={{ maxWidth: "50ch" }}>
              You don&apos;t need to be experienced, or eloquent, or sure of yourself.
              You only need to show up. We&apos;ll figure out the rest together.
            </p>
            <div className="closing__row">
              <Link className="btn btn--red" href="/get-involved">
                Volunteer with us<span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn--ghost" href="/about">
                Read our story<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
