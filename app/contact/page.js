import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Contact Us — The Human Side" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        We read everything and reply to most messages within the week. For membership, donations, partnerships,
        or any question about The Human Side, reach us here.
      </p>

      <div className="legal-contact">
        <span className="k">Operated by</span>
        Edenwoods Eduhub Foundation — The Human Side<br /><br />
        <span className="k">Email</span>
        <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a><br /><br />
        <span className="k">Phone</span>
        [Phone number]<br /><br />
        <span className="k">Registered address</span>
        [Registered office address, City, State, PIN — India]
      </div>

      <h2>In partnership with</h2>
      <p>The Elden Heights School — the partner school and host community of the initiative.</p>

      <h2>Office hours</h2>
      <p>[e.g. Monday–Saturday, 10:00–17:00 IST]. Saturday volunteer meetings are held on the school campus.</p>
    </LegalPage>
  );
}
