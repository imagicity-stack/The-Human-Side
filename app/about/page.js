import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./about.css";

export const metadata = { title: "About — The Human Side" };

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <main className="pg-about">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="wrap">
            <div className="page-hero__crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>About</span>
            </div>
            <div className="page-hero__inner">
              <h1>What we<br /><em>are,</em> in a few<br />honest pages.</h1>
              <p className="page-hero__lede">
                The Human Side is a student-led social initiative —
                held by Edenwoods Eduhub Foundation, run from The Elden Heights School,
                and quietly committed to <em>showing up</em> long after the headlines move on.
              </p>
            </div>
            <div className="hero-strip">
              <img src="/assets/images/about-1.jpg" alt="Wide team / drive day" loading="lazy" />
              <img src="/assets/images/about-2.jpg" alt="Portrait / candid" loading="lazy" />
              <img src="/assets/images/about-3.jpg" alt="Detail shot" loading="lazy" />
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="section">
          <div className="wrap">
            <div className="two-col">
              <div className="two-col__label">
                <span className="eyebrow">— Who we are</span>
                <h2>A small <em>circle,</em> a wide door.</h2>
              </div>
              <div className="prose">
                <p className="first">
                  The Human Side began the way most honest things do — with a handful of people in
                  a room, slightly embarrassed about how often they&apos;d said <em>&quot;someone should do something&quot;</em>
                  and never been the someone.
                </p>
                <p>
                  We&apos;re a student-run initiative inside The Elden Heights School, with the institutional
                  backing and long view of the Edenwoods Eduhub Foundation. We meet on Saturdays. We
                  plan a drive a month. We try, sometimes badly, to do work that doesn&apos;t end the moment
                  someone takes a photograph.
                </p>
                <p>
                  We are not professionals at this. We are students learning what care looks like in
                  practice — what it costs, who it actually serves, and how to keep doing it after the
                  initial excitement wears off. <strong>That last part is the whole point.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE STAND FOR */}
        <section className="section section--cream">
          <div className="wrap">
            <div className="two-col">
              <div className="two-col__label">
                <span className="eyebrow">— What we work on</span>
                <h2>Four pillars. <em>One</em> promise.</h2>
              </div>
              <div>
                <p className="prose" style={{ marginBottom: 0 }}>
                  The work moves where the conversations move. These four pillars are
                  where it lives most consistently — the threads we&apos;ll keep returning to,
                  term after term.
                </p>

                <div className="pillar-list">
                  <article className="pillar-card">
                    <div className="pillar-card__num">i.</div>
                    <div>
                      <h3>Women&apos;s Empowerment</h3>
                      <p>Workshops, mentorship circles, and partnerships with organisations already doing the work — focused on resources, agency, and listening.</p>
                    </div>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-card__num">ii.</div>
                    <div>
                      <h3>Awareness &amp; Safety</h3>
                      <p>Conversations on consent, harassment, and reporting — run with professionals, never preachy, kept honest by the students who lead them.</p>
                    </div>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-card__num">iii.</div>
                    <div>
                      <h3>Environment</h3>
                      <p>Trees in soil, plastic out of canteens, repair instead of replace. Small audits, posted publicly, every term.</p>
                    </div>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-card__num">iv.</div>
                    <div>
                      <h3>Charity &amp; Community</h3>
                      <p>Book drives, meal kits, visits to shelters and old-age homes — the unglamorous weekly work of being a neighbour.</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE STARTED */}
        <section className="section section--ink">
          <div className="wrap">
            <div className="two-col">
              <div className="two-col__label">
                <span className="eyebrow" style={{ color: "var(--yellow)" }}>— Our short history</span>
                <h2 style={{ color: "var(--bg)" }}>From a <em style={{ color: "var(--yellow)" }}>classroom,</em> outward.</h2>
              </div>
              <div className="timeline">
                <div className="timeline__row">
                  <div className="timeline__date">2025 · Late</div>
                  <div>
                    <h4>The first conversation</h4>
                    <p>A small group of students start meeting on Saturdays — at first to vent, then to plan. The phrase &quot;the side that still cares&quot; comes out of one of those meetings, half-joking.</p>
                  </div>
                  <img src="/assets/images/timeline-1.jpg" alt="First meeting" loading="lazy" />
                </div>
                <div className="timeline__row">
                  <div className="timeline__date">2026 · January</div>
                  <div>
                    <h4>Held by Edenwoods</h4>
                    <p>Edenwoods Eduhub Foundation takes the initiative under its umbrella — giving it a legal home, funding rails, and the freedom to stay student-led.</p>
                  </div>
                  <img src="/assets/images/timeline-2.jpg" alt="Foundation signing" loading="lazy" />
                </div>
                <div className="timeline__row">
                  <div className="timeline__date">2026 · February</div>
                  <div>
                    <h4>The first drives</h4>
                    <p>Two small drives, on campus and at a partner shelter. They&apos;re imperfect. They go ahead anyway. Half of being honest is being willing to start before you&apos;re ready.</p>
                  </div>
                  <img src="/assets/images/timeline-3.jpg" alt="First drive" loading="lazy" />
                </div>
                <div className="timeline__row">
                  <div className="timeline__date">Now</div>
                  <div>
                    <h4>This page</h4>
                    <p>The initiative is open — to students, parents, faculty, and friends of the school. The website is here so you can find us, and so we can keep showing our working.</p>
                  </div>
                  <img src="/assets/images/timeline-4.jpg" alt="This moment" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="eyebrow">— A few small questions</span>
              <h2 className="h-section" style={{ marginTop: 16 }}>
                Asked <em style={{ fontStyle: "italic", color: "var(--red)" }}>honestly,</em> answered the same way.
              </h2>
            </div>
            <div className="faq">
              <div className="faq__item">
                <div className="faq__num">01</div>
                <div>
                  <h3 className="faq__q">Who can join?</h3>
                  <p className="faq__a">Anyone from the school community to begin with — students, parents, faculty, alumni. As we find our feet, the door opens wider. If you&apos;re reading this and unsure, that already means yes.</p>
                </div>
              </div>
              <div className="faq__item">
                <div className="faq__num">02</div>
                <div>
                  <h3 className="faq__q">Is this a charity, an NGO, or a school club?</h3>
                  <p className="faq__a">It&apos;s a social initiative held by Edenwoods Eduhub Foundation. Practically, that means we have the legal and financial backbone of a foundation, but the rhythm and energy of a school programme.</p>
                </div>
              </div>
              <div className="faq__item">
                <div className="faq__num">03</div>
                <div>
                  <h3 className="faq__q">How do you decide what to work on?</h3>
                  <p className="faq__a">We listen. Students raise something; we ask the people who&apos;d be most affected; we look at what&apos;s already being done well; and we pick our share. The four pillars are the rough shape — but the specifics change with the work.</p>
                </div>
              </div>
              <div className="faq__item">
                <div className="faq__num">04</div>
                <div>
                  <h3 className="faq__q">Can I donate?</h3>
                  <p className="faq__a">Yes — through the Edenwoods Eduhub Foundation. The Get Involved page has the details, and we&apos;re happy to talk to anyone who wants to know how the money is used. Transparency is the deal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta">
          <div className="wrap">
            <span className="eyebrow">— Now what</span>
            <h2 style={{ marginTop: 16 }}>Read enough?<br />Come <em>do</em> something.</h2>
            <p className="lede" style={{ margin: "0 auto", maxWidth: "50ch" }}>
              The next page is the practical one — how to volunteer, how to donate,
              and the small list of things we always need help with.
            </p>
            <div className="row">
              <Link className="btn btn--red" href="/get-involved">
                Get involved<span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn--ghost" href="/partners">
                Meet the partners<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
