import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Refund & Cancellation Policy — The Human Side" };

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <p className="legal-note">
        Adjust the timelines/windows below to match your actual operations, complete the [bracketed] details,
        and have this reviewed before going live. A clear refund policy is required to activate live Razorpay payments.
      </p>

      <p>
        This policy applies to the one-time volunteer membership fee and to donations made through The Human Side
        (operated by <strong>Edenwoods Eduhub Foundation</strong>).
      </p>

      <h2>1. Membership fee</h2>
      <ul>
        <li>The membership fee is a one-time payment that funds your volunteer kit and access to the initiative.</li>
        <li><strong>Before kit dispatch:</strong> you may cancel and request a full refund within <strong>[7] days</strong> of payment, provided your kit has not yet been dispatched.</li>
        <li><strong>After kit dispatch:</strong> as the kit (T-shirt, badge, etc.) is a personalised physical item, the fee becomes non-refundable once dispatched.</li>
        <li>If you never receive your kit or digital member ID due to an error on our side, you are entitled to a full refund or re-dispatch.</li>
      </ul>

      <h2>2. Donations</h2>
      <p>
        Donations are voluntary contributions and are generally <strong>non-refundable</strong>. If you made a
        donation in error or were charged incorrectly (e.g. a duplicate transaction), contact us within
        <strong> [7] days</strong> and we will refund the erroneous amount after verification.
      </p>

      <h2>3. How to request a refund</h2>
      <p>
        Email <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a> from your registered email with your
        member ID (or payment ID) and the reason for the request. We may ask for the Razorpay payment reference.
      </p>

      <h2>4. Processing time</h2>
      <p>
        Approved refunds are initiated within <strong>[5–7] business days</strong> and credited to the original
        payment method via Razorpay. The time for the amount to reflect in your account depends on your bank or
        card issuer.
      </p>

      <h2>5. Failed or pending payments</h2>
      <p>
        If money was deducted but your membership was not confirmed, do not worry — our system reconciles payments
        automatically, and unconfirmed charges are not captured or are auto-reversed by Razorpay. Contact us if an
        amount is not reversed within 7 business days.
      </p>

      <h2>6. Contact</h2>
      <p>
        Email: <a href="mailto:contact@edenwoods.org">contact@edenwoods.org</a> · Address: [Registered office address] · Phone: [Phone number]
      </p>
    </LegalPage>
  );
}
