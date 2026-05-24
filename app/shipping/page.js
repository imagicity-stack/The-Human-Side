import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Shipping & Delivery Policy — The Human Side" };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy">
      <p className="legal-note">
        Adjust delivery timelines and coverage to match your operations, complete the [bracketed] details, and
        review before going live. Razorpay requires a shipping/delivery policy for memberships that include physical items.
      </p>

      <p>
        This policy covers delivery of the volunteer membership kit and digital items for The Human Side
        (operated by <strong>Edenwoods Eduhub Foundation</strong>).
      </p>

      <h2>1. Digital items</h2>
      <p>
        Your <strong>digital membership ID</strong> is issued instantly on successful payment and is shown on
        screen and emailed to your registered email address, typically within a few minutes.
      </p>

      <h2>2. Physical kit</h2>
      <ul>
        <li>The membership kit (official T-shirt, pin badge, and any included materials) is dispatched to the postal address you provide during registration.</li>
        <li>Kits are usually dispatched within <strong>[2–4] weeks</strong> of successful payment, in batches.</li>
        <li>Delivery is currently available <strong>within India</strong> only.</li>
        <li>You will be notified by email when your kit is dispatched.</li>
      </ul>

      <h2>3. Delivery charges</h2>
      <p>Standard delivery within India is included in the membership fee. [Update if any additional charges apply.]</p>

      <h2>4. Incorrect address or non-delivery</h2>
      <p>
        Please ensure your address is accurate at registration. If a kit is returned undelivered due to an
        incorrect address, we will contact you to arrange re-dispatch; additional postage may apply. If your kit
        does not arrive within a reasonable time, email us and we will track or re-send it.
      </p>

      <h2>5. Contact</h2>
      <p>
        Email: <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a> · Address: [Registered office address] · Phone: [Phone number]
      </p>
    </LegalPage>
  );
}
