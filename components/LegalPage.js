import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "@/app/legal.css";

export default function LegalPage({ title, updated = "24 May 2026", children }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pg-legal">
        <section className="legal-hero">
          <div className="wrap">
            <div className="legal-crumbs">
              <Link href="/">Home</Link> <span>/</span> <span>{title}</span>
            </div>
            <h1>{title}</h1>
            <p className="legal-meta">Last updated · {updated}</p>
          </div>
        </section>
        <section className="legal-body">
          <div className="wrap">
            <div className="legal-prose">{children}</div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
