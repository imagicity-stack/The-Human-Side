import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions — The Human Side" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p className="legal-note">
        Complete the [bracketed] details and have this reviewed by a legal professional before going live.
      </p>

      <p>
        These Terms &amp; Conditions govern your use of The Human Side website and your registration as a
        volunteer member. The Human Side is operated by <strong>Edenwoods Eduhub Foundation</strong> in
        partnership with The Elden Heights School. By using this site or registering, you agree to these terms.
      </p>

      <h2>1. The initiative</h2>
      <p>
        The Human Side is a not-for-profit social initiative. Funds received support its drives, workshops,
        materials, and operations, as accounted for by Edenwoods Eduhub Foundation.
      </p>

      <h2>2. Volunteer membership</h2>
      <ul>
        <li>Membership is offered for a <strong>one-time joining fee</strong> (currently displayed at checkout) and is valid for the member&apos;s lifetime unless revoked.</li>
        <li>Membership includes an official T-shirt, pin badge, digital membership ID, and access to official drives, subject to availability.</li>
        <li>On successful payment, a unique member ID (e.g. THS001) is issued and emailed to you.</li>
        <li>Membership is personal and non-transferable.</li>
      </ul>

      <h2>3. Eligibility</h2>
      <p>
        Membership is open to students, parents, faculty, alumni, and friends of the school, and to members of
        the public. Members under 18 should register with the consent of a parent or guardian.
      </p>

      <h2>4. Code of conduct</h2>
      <p>
        Members agree to act respectfully and lawfully at all events and drives. We reserve the right to
        deregister any member whose conduct is harmful, unlawful, or contrary to the values of the initiative,
        without refund.
      </p>

      <h2>5. Payments</h2>
      <p>
        All payments are processed securely via Razorpay in Indian Rupees (INR). By paying, you confirm that
        the payment details you use are lawfully yours.
      </p>

      <h2>6. Refunds &amp; cancellations</h2>
      <p>
        Refunds and cancellations are governed by our <a href="/refund-policy">Refund &amp; Cancellation Policy</a>.
      </p>

      <h2>7. Donations</h2>
      <p>
        Donations are voluntary and are received by Edenwoods Eduhub Foundation. Tax-receipts are provided where
        applicable. Donations are generally non-refundable except in the case of a proven erroneous transaction.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        All content, logos, and materials on this site belong to Edenwoods Eduhub Foundation / The Elden Heights
        School and may not be reproduced without permission.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        The website and services are provided &quot;as is&quot;. To the extent permitted by law, we are not liable
        for any indirect or consequential loss arising from use of the site or participation in activities.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of
        the courts of [City, State], India.
      </p>

      <h2>11. Contact</h2>
      <p>
        Email: <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a> · Address: [Registered office address] · Phone: [Phone number]
      </p>
    </LegalPage>
  );
}
