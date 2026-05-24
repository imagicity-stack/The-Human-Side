import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — The Human Side" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="legal-note">
        This policy explains what we collect and why. Items in [square brackets] should be
        completed with your organisation&apos;s details before going live, and the document
        should be reviewed by a legal professional.
      </p>

      <p>
        The Human Side (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a social initiative of
        <strong> Edenwoods Eduhub Foundation</strong>, in partnership with The Elden Heights School.
        We respect your privacy and are committed to protecting the personal information you share with us.
        This policy describes how we collect, use, store, and safeguard your data.
      </p>

      <h2>1. Information we collect</h2>
      <p>When you register as a volunteer member or contact us, we may collect:</p>
      <ul>
        <li>Identity &amp; contact details — name, email address, phone number, date of birth, gender.</li>
        <li>Address details — postal address, city, state, PIN code.</li>
        <li>Affiliation — your role (student, parent, faculty, etc.), school/organisation, class or designation.</li>
        <li>Membership details — T-shirt size, areas of interest, emergency contact, and how you heard about us.</li>
        <li>Payment metadata — Razorpay payment and order identifiers. <strong>We never see or store your full card, UPI, or bank credentials</strong> — those are handled entirely by Razorpay.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To process your membership and issue your unique member ID.</li>
        <li>To dispatch your volunteer kit and contact you about drives, events, and the annual impact report.</li>
        <li>To respond to your messages and maintain our member records.</li>
        <li>To meet legal, accounting, and receipting requirements.</li>
      </ul>

      <h2>3. Payment processing</h2>
      <p>
        Payments are processed by <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway.
        Your sensitive payment information is collected and processed directly by Razorpay under their
        own privacy policy. We only receive confirmation of a successful payment and its reference IDs.
      </p>

      <h2>4. Data storage &amp; security</h2>
      <p>
        Your information is stored securely in Google Cloud Firestore. Access is restricted to
        authorised administrators of Edenwoods Eduhub Foundation. We take reasonable technical and
        organisational measures to protect your data against unauthorised access, alteration, or disclosure.
      </p>

      <h2>5. Sharing your information</h2>
      <p>
        We do <strong>not</strong> sell or rent your personal data. We may share it only with: our payment
        processor (Razorpay), our email service provider, and where required by law or to protect our
        rights and safety.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain member information for as long as your membership is active and as required for legal and
        accounting purposes. You may request deletion of your data at any time (subject to records we must
        keep by law) by writing to us.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by emailing
        {" "}<a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a>. We will respond within a
        reasonable period.
      </p>

      <h2>8. Cookies</h2>
      <p>
        This website uses only the minimal cookies/storage necessary for core functionality (such as the
        admin login session). We do not use third-party advertising trackers.
      </p>

      <h2>9. Children&apos;s data</h2>
      <p>
        As a school-linked initiative, some members may be minors. Where a member is under 18, a parent or
        guardian should provide consent and may act on the member&apos;s behalf for any data request.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>We may update this policy from time to time. The &quot;last updated&quot; date above reflects the latest revision.</p>

      <h2>11. Contact</h2>
      <p>
        Edenwoods Eduhub Foundation — The Human Side<br />
        Email: <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a><br />
        Address: [Registered office address]<br />
        Phone: [Phone number]
      </p>
    </LegalPage>
  );
}
