import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./partners.css";

export const metadata = { title: "Partners — The Human Side" };

export default function PartnersPage() {
  return (
    <>
      <SiteHeader active="partners" />

      <main className="pg-partners">
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="wrap">
            <div className="page-hero__crumbs">
              <Link href="/">Home</Link> &nbsp;/&nbsp; <span>Partners</span>
            </div>
            <div className="page-hero__inner">
              <h1>Two <em>names</em><br />on the<br />masthead.</h1>
              <p className="page-hero__lede">
                The Human Side runs because two institutions decided it should — a
                <em> foundation</em> that holds it, and a <em>school</em> that lives it. Here&apos;s
                what each one brings.
              </p>
            </div>
          </div>
        </section>

        {/* PARTNER 1 — EDENWOODS */}
        <section className="partner">
          <div className="wrap">
            <div className="partner__inner">
              <div className="partner__copy">
                <div className="partner__role">
                  <span className="num">01</span>
                  <span>—</span>
                  <span>Founding Body</span>
                </div>
                <h2>Edenwoods<br />Eduhub <em>Foundation.</em></h2>
                <p className="partner__lede">
                  The institutional home of The Human Side — and the reason it can
                  plan in years, not just weeks.
                </p>
                <p>
                  Edenwoods Eduhub Foundation works at the intersection of education and
                  social good. It gives The Human Side its legal frame, its accounting,
                  its donor receipts, and — more important than all of those — its patience.
                </p>
                <p>
                  The Foundation&apos;s view is long. Drives are months in the planning;
                  programmes are designed to outlast any single batch of students.
                  That patience is what lets the initiative be honest about pace.
                </p>
                <div className="partner__meta">
                  <div className="pair"><span className="k">Role</span><span className="v">Founding &amp; holding body</span></div>
                  <div className="pair"><span className="k">Provides</span><span className="v">Funding, governance, long-view planning</span></div>
                  <div className="pair"><span className="k">Established</span><span className="v">An education-focused foundation</span></div>
                  <div className="pair"><span className="k">For donors</span><span className="v">Receipts &amp; quarterly reports</span></div>
                </div>
                <div className="partner__cta">
                  <Link className="btn btn--primary" href="/get-involved#donate">
                    Donate via Edenwoods<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="partner__visual">
                <div className="partner__visual-image">
                  <img src="/assets/images/partner-edenwoods.jpg" alt="Edenwoods Foundation" loading="lazy" />
                </div>
                <div className="partner__visual-logo" data-stamp="№ 01 · The Foundation">
                  <img src="/assets/edenwoods-logo.png" alt="Edenwoods Eduhub Foundation" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNER 2 — ELDEN HEIGHTS */}
        <section className="partner partner--cream partner--reverse">
          <div className="wrap">
            <div className="partner__inner">
              <div className="partner__visual">
                <div className="partner__visual-image">
                  <img src="/assets/images/partner-elden.jpg" alt="Elden Heights campus" loading="lazy" />
                </div>
                <div className="partner__visual-logo" data-stamp="№ 02 · The School">
                  <img src="/assets/elden-heights-logo.png" alt="The Elden Heights School" />
                </div>
              </div>
              <div className="partner__copy">
                <div className="partner__role">
                  <span className="num">02</span>
                  <span>—</span>
                  <span>Partner School</span>
                </div>
                <h2>The Elden<br />Heights <em>School.</em></h2>
                <p className="partner__lede">
                  The campus where The Human Side actually <em>happens</em> — and the
                  community it draws its hands and hearts from.
                </p>
                <p>
                  The Elden Heights School is the partner school of the initiative.
                  Its students start the projects, its faculty stewards them, and its
                  parents and alumni quietly keep them going. The motto on the crest —
                  <em> Towards Eternal Glory</em> — is treated, here, as a question
                  about how we use our time, not a slogan to chant.
                </p>
                <p>
                  Saturday meetings happen on school grounds. Drives leave from the
                  front gate. The first sponsors are families inside it. Without the
                  school, there is no initiative.
                </p>
                <div className="partner__meta">
                  <div className="pair"><span className="k">Role</span><span className="v">Partner school &amp; host community</span></div>
                  <div className="pair"><span className="k">Provides</span><span className="v">Students, faculty, parents, premises</span></div>
                  <div className="pair"><span className="k">Motto</span><span className="v"><em style={{ fontStyle: "italic", color: "var(--red)" }}>Towards Eternal Glory</em></span></div>
                  <div className="pair"><span className="k">For students</span><span className="v">Saturday meetings on campus</span></div>
                </div>
                <div className="partner__cta">
                  <Link className="btn btn--primary" href="/get-involved">
                    Join from the school<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how">
          <div className="wrap">
            <div className="how__head">
              <span className="eyebrow">— How the partnership works</span>
              <h2>One <em>foundation,</em> one school,<br />and a clear division of care.</h2>
            </div>
            <div className="how__grid">
              <div className="how__step">
                <div className="num">i.</div>
                <h3>Edenwoods holds the rails.</h3>
                <p>Legal entity, funding, accounting, governance. The boring, important spine — handled, so students don&apos;t have to.</p>
              </div>
              <div className="how__step">
                <div className="num">ii.</div>
                <h3>Elden Heights brings the people.</h3>
                <p>Students lead the projects. Faculty mentor. Parents and alumni open doors. The campus is the room the work happens in.</p>
              </div>
              <div className="how__step">
                <div className="num">iii.</div>
                <h3>The Human Side does the work.</h3>
                <p>Drives, conversations, audits, and visits. Quietly, weekly. The initiative is the thing both partners exist to enable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BECOME A PARTNER */}
        <section className="become">
          <div className="wrap">
            <div className="become__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--yellow)" }}>— Other partnerships</span>
                <h2>Want to <em>join</em> the masthead?</h2>
                <p>
                  As The Human Side grows, we&apos;ll partner with schools, NGOs, and
                  professionals already doing the work in our city. If that&apos;s you,
                  we&apos;d love to hear what you&apos;re working on.
                </p>
                <a className="btn btn--red" href="mailto:contact@edenwoods.org">
                  Write to us about partnering<span className="arrow" aria-hidden="true">→</span>
                </a>
              </div>
              <ul className="become__list">
                <li><span className="k">Schools</span><span className="v">Sister programmes, joint drives, exchange of practice</span></li>
                <li><span className="k">NGOs</span><span className="v">Field partners on <em>safety,</em> charity &amp; environment</span></li>
                <li><span className="k">Professionals</span><span className="v">Facilitators, mentors, doctors, lawyers, social workers</span></li>
                <li><span className="k">Sponsors</span><span className="v">Families &amp; companies who want to <em>quietly</em> fund a drive</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta">
          <div className="wrap">
            <span className="eyebrow">— Or, the easy thing</span>
            <h2>Just <em>show up.</em><br />The rest sorts itself out.</h2>
            <p className="lede" style={{ margin: "0 auto", maxWidth: "50ch" }}>
              You don&apos;t need to be an institution to make a difference here. Come to a
              Saturday meeting. Bring a friend. The partners can wait.
            </p>
            <div className="row">
              <Link className="btn btn--red" href="/get-involved">
                Get involved<span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn--ghost" href="/about">
                About the initiative<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
