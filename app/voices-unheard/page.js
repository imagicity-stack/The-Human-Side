import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./voices-unheard.css";

export const metadata = {
  title: "Voices Unheard — Listening Beyond Silence",
  description:
    "A student-led field study by The Human Side into the root causes of sexual harassment — across rural and urban communities — alongside good touch / bad touch sessions in special schools.",
};

const FACTS = [
  { k: "The question", v: "What lies at the root of sexual harassment" },
  { k: "The method", v: "A field survey, rural and urban" },
  { k: "Carried out by", v: "Students of The Elden Heights School" },
  { k: "Alongside", v: "Body-safety sessions in special schools" },
];

const FACTORS = [
  "Lack of awareness",
  "Improper understanding of consent",
  "Gender inequality",
  "Social conditioning",
  "Fear of speaking up",
  "Victim blaming",
  "Misuse of power",
  "The normalisation of inappropriate behaviour",
];

const SESSIONS = [
  "Pictures, gestures, colour and repetition — so the idea carried without depending on a long explanation.",
  "One simple rule, held to throughout: some parts of your body belong to you alone.",
  "Safe touch and unsafe touch taught as a difference a child can recognise, not a definition to memorise.",
  "Practising the three responses — say no, move away, tell a trusted adult — in whatever way each child communicates.",
  "Small groups, a slow pace, and the school’s own teachers and carers in the room throughout.",
  "Time at the end for children to ask, in their own way, whatever they wanted to ask.",
];

const STANCE = [
  "They asked uncomfortable questions.",
  "They listened without judging.",
  "They compared rural and urban perspectives.",
];

const BECAME = [
  "An exercise in listening.",
  "An exercise in understanding.",
  "An exercise in ensuring that voices which often remain unheard are finally given the space to matter.",
];

export default function VoicesUnheardPage() {
  return (
    <>
      <SiteHeader active="voices-unheard" />

      <main id="main" className="pg-vu">
        {/* ---------------------------------------------------- HERO */}
        <section className="vu-hero">
          <div className="vu-hero__aura" aria-hidden="true" />
          <div className="wrap">
            <div className="vu-hero__crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>Voices Unheard</span>
            </div>

            <div className="vu-hero__inner">
              <div className="vu-hero__copy">
                <p className="eyebrow vu-hero__eyebrow">— A student-led field study · The Human Side</p>
                <h1 className="vu-hero__title">
                  Voices
                  <br />
                  <em>Unheard.</em>
                </h1>
                <p className="vu-hero__tag">Listening beyond silence.</p>
              </div>

              <div className="vu-hero__aside">
                <p className="vu-hero__lede">
                  Voices Unheard was not just an awareness campaign. It was an attempt to
                  understand a difficult question at its roots.
                </p>
                <div className="vu-hero__cta-row">
                  <a className="btn-vu btn-vu--primary" href="#findings">
                    What they found<span className="arrow" aria-hidden="true">→</span>
                  </a>
                  <Link className="btn-vu btn-vu--ghost-light" href="/get-involved">
                    Get involved<span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <dl className="vu-hero__facts">
              {FACTS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------- THE FIELD */}
        <section className="vu-field">
          <div className="wrap">
            <div className="vu-field__grid" data-reveal>
              <div className="vu-field__label">
                <p className="eyebrow">— Out of the classroom</p>
                <h2>
                  They went and <em>asked.</em>
                </h2>
              </div>
              <div className="vu-field__body">
                <p className="lede">
                  Our students stepped outside the classroom and entered both rural and urban
                  communities to conduct a field survey on the possible root causes of sexual
                  harassment.
                </p>
                <p>
                  Instead of relying only on assumptions, they spoke to people, observed
                  differences in attitudes, recorded responses, and tried to understand how
                  society thinks about safety, respect, gender and personal boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- TWO ENVIRONMENTS */}
        <section className="vu-two" id="findings">
          <div className="wrap">
            <div className="vu-two__head" data-reveal>
              <p className="eyebrow">— Two social environments</p>
              <h2 className="h-title">
                The same question,
                <br />
                <em>two different worlds.</em>
              </h2>
              <p>The journey took them through two very different social environments.</p>
            </div>

            <div className="vu-two__grid">
              <article className="vu-place" data-reveal>
                <span className="vu-place__k">Rural</span>
                <h3>Where the subject is rarely spoken aloud.</h3>
                <p>
                  In rural areas, students encountered perspectives shaped by traditional social
                  structures, limited awareness, hesitation around discussing sensitive subjects,
                  and deeply rooted gender roles.
                </p>
              </article>

              <article className="vu-place" data-reveal style={{ "--reveal-delay": "90ms" }}>
                <span className="vu-place__k">Urban</span>
                <h3>Where awareness alone turned out not to be enough.</h3>
                <p>
                  In urban areas, awareness was comparatively higher in many cases — yet the
                  survey showed that education, exposure and modern surroundings do not
                  automatically eliminate harassment or harmful attitudes.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- FACTORS */}
        <section className="vu-factors">
          <div className="wrap">
            <div className="vu-factors__head" data-reveal>
              <p className="eyebrow">— What they explored</p>
              <h2 className="h-title">
                Eight threads they kept
                <br />
                <em>pulling on.</em>
              </h2>
            </div>
            <ol className="vu-factors__list">
              {FACTORS.map((f, i) => (
                <li key={f} data-reveal style={{ "--reveal-delay": `${i * 45}ms` }}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t">{f}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------- SPECIAL SCHOOLS */}
        <section className="vu-schools">
          <div className="vu-schools__aura" aria-hidden="true" />
          <div className="wrap">
            <div className="vu-schools__head" data-reveal>
              <p className="eyebrow">— Beyond the survey</p>
              <h2>
                The lesson that has to
                <br />
                reach <em>everyone.</em>
              </h2>
            </div>

            <div className="vu-schools__grid">
              <div className="vu-schools__copy" data-reveal>
                <p className="lede">
                  The survey kept returning to the same gap: awareness reaches some people and
                  passes others by entirely. So the students carried the work somewhere it is
                  rarely taken — into special schools, to children with disabilities and special
                  educational needs.
                </p>
                <p>
                  Personal-safety education is usually written for one kind of classroom. It
                  assumes a child who reads at a certain level, hears the whole lesson, sits
                  still for it, and can put a hand up afterwards to ask the question that
                  matters. Children who learn differently are often left out of it altogether —
                  and they are among the children for whom it matters most.
                </p>
                <p className="vu-schools__line">
                  So our students rebuilt the lesson, and taught good touch and bad touch on
                  terms every child in the room could meet.
                </p>
              </div>

              <ul className="vu-schools__list" data-reveal>
                {SESSIONS.map((s, i) => (
                  <li key={s}>
                    <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="vu-schools__foot" data-reveal>
              It asked more of them than the survey had — patience, plain language, and the
              willingness to say a thing ten times over without a flicker of impatience. It also
              answered the question the survey had raised more plainly than any figure could:
              awareness that does not reach every child is not yet awareness.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- MEANING */}
        <section className="vu-meaning">
          <div className="wrap">
            <div className="vu-meaning__inner" data-reveal>
              <p className="eyebrow">— What made it matter</p>
              <p className="vu-meaning__copy">
                What made Voices Unheard meaningful was not simply the data collected. It was the
                courage and maturity shown by our students while dealing with a subject society{" "}
                <em>often prefers not to discuss openly.</em>
              </p>
              <ul className="vu-meaning__list">
                {STANCE.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- LEARNING */}
        <section className="vu-learn">
          <div className="wrap">
            <div className="vu-learn__grid" data-reveal>
              <div className="vu-learn__label">
                <p className="eyebrow">— What they learnt</p>
                <h2>
                  No single
                  <br />
                  <em>stereotype</em> fits.
                </h2>
              </div>
              <div className="vu-learn__body">
                <p>
                  They learnt that sexual harassment cannot be understood through one stereotype,
                  one community or one social class. It is a complex social problem influenced by
                  behaviour, upbringing, awareness, power structures, and the environment in which
                  individuals grow.
                </p>
                <p>
                  For many students, this was their first experience of real field research. They
                  moved from textbooks and theoretical discussions to conversations with real
                  people and real communities.
                </p>
                <p className="vu-learn__line">
                  The experience also changed the researchers themselves. They returned with a
                  deeper understanding of empathy, responsibility, and the importance of creating
                  spaces where people can speak without fear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- CLOSING */}
        <section className="vu-close">
          <div className="vu-close__aura" aria-hidden="true" />
          <div className="wrap">
            <p className="eyebrow vu-close__eyebrow">— What it became</p>
            <h2 className="vu-close__head">
              Young people do not have to remain <em>spectators.</em>
            </h2>
            <p className="vu-close__lede">
              Through Voices Unheard, our students proved they can question social problems, study
              them, and contribute towards changing them. The survey may have started with one
              question about the roots of sexual harassment, but it became something much bigger.
            </p>

            <ul className="vu-close__list">
              {BECAME.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <p className="vu-close__motto">
              Voices Unheard: <em>Listen. Understand. Question. Act.</em>
            </p>

            <div className="vu-close__row">
              <Link className="btn-vu btn-vu--yellow" href="/get-involved">
                Work with us<span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn-vu btn-vu--ghost-light" href="/about">
                About The Human Side<span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>

            <p className="vu-close__credit">
              A Human Side initiative · Edenwoods Eduhub Foundation &amp; The Elden Heights School.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
