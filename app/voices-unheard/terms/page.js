import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Voices Unheard 2026 — Terms & Code of Conduct" };

export default function VoicesUnheardTermsPage() {
  return (
    <LegalPage title="Voices Unheard 2026 — Terms & Code of Conduct">
      <p className="legal-note">
        Please read this page carefully before registering. By ticking the consent boxes in
        the registration form, the parent/guardian and the student confirm they have read,
        understood, and agreed to everything below.
      </p>

      <h2>1. About the camp</h2>
      <p>
        <strong>Voices Unheard 2026</strong> is a 4-day Social Awareness Summer Camp organised
        by <strong>The Human Side</strong>, an initiative of the Edenwoods Eduhub Foundation
        in partnership with The Elden Heights School. The camp is designed for students of
        Classes 8 – 10 and runs from <strong>15<sup>th</sup> to 18<sup>th</sup> June 2026</strong> on the
        school campus.
      </p>
      <p>
        The camp engages students with awareness around safety, dignity, respect, and the
        social issues that shape their community, through guided field visits, street theatre,
        expert-led workshops, and group discussions.
      </p>

      <h2>2. Eligibility &amp; registration</h2>
      <ul>
        <li>The camp is open to students currently enrolled in Class 8, 9, or 10.</li>
        <li>Every registration must be approved and submitted by a parent or legal guardian.</li>
        <li>Seats are limited and allotted on a first-come, first-served basis.</li>
        <li>The last date to register is <strong>5<sup>th</sup> June 2026</strong>, subject to seat availability.</li>
        <li>A registration is considered confirmed only after the fee is received and the unique camp ID is issued.</li>
      </ul>

      <h2>3. Fees, payments &amp; refunds</h2>
      <ul>
        <li>The registration fee, as displayed at checkout, is paid one-time per student and includes the printed field handbook, camp T-shirt, materials, and the participation certificate.</li>
        <li>All payments are processed securely via Razorpay in Indian Rupees (INR).</li>
        <li>Cancellations requested in writing on or before <strong>5<sup>th</sup> June 2026</strong> are eligible for a full refund minus payment gateway charges.</li>
        <li>No refund will be issued for cancellations after <strong>5<sup>th</sup> June 2026</strong> or for no-shows once the camp has begun.</li>
        <li>If the organisers cancel or postpone the camp for reasons beyond their control, fees will be refunded in full or carried forward, as elected by the parent.</li>
      </ul>

      <h2>4. Supervision &amp; safety</h2>
      <ul>
        <li>Students are supervised by trained adult staff at all times during camp hours.</li>
        <li>A qualified counsellor is present on site throughout the four days.</li>
        <li>All field activities take place in pre-vetted, public, supervised spaces. Students are never sent out alone.</li>
        <li>Students will not be asked to discuss personal trauma. The camp focuses on community awareness, handled safely and respectfully.</li>
        <li>Parents/guardians remain responsible for transporting the student to and from the camp venue each day, unless a school-arranged option is communicated separately.</li>
      </ul>

      <h2>5. Code of conduct (for students)</h2>
      <p>By participating, the student agrees to:</p>
      <ul>
        <li>Treat every participant, facilitator, staff member, and member of the public with respect, dignity, and patience.</li>
        <li>Stay with the assigned group and chaperone at all times — never leaving the venue or activity area without permission.</li>
        <li>Follow all safety instructions, schedules, and dress-code requirements communicated by the organisers.</li>
        <li>Refrain from using language or behaviour that is discriminatory, threatening, sexual, or otherwise harmful.</li>
        <li>Avoid bringing weapons, intoxicants, illegal substances, or valuables to camp.</li>
        <li>Use mobile phones only as permitted by the organisers during camp hours.</li>
        <li>Respect the privacy of participants — no photography, recording, or sharing of others without explicit consent.</li>
      </ul>
      <p>
        The organisers reserve the right to remove any student whose conduct compromises the
        safety, wellbeing, or dignity of others, without refund of the registration fee.
      </p>

      <h2>6. Health, medical information &amp; emergencies</h2>
      <ul>
        <li>The parent/guardian must disclose any allergies, medical conditions, or medication relevant to the student&apos;s participation at the time of registration.</li>
        <li>In the event of injury, illness, or a medical emergency, the organisers will administer reasonable first aid and seek immediate medical attention. Costs of external medical treatment are borne by the parent/guardian.</li>
        <li>The parent/guardian authorises the organisers to make emergency medical decisions on the student&apos;s behalf if the parent/guardian cannot be reached promptly.</li>
      </ul>

      <h2>7. Media &amp; communication</h2>
      <ul>
        <li>Photos and videos may be taken during camp activities for documentation and limited promotional use by The Human Side and Edenwoods Eduhub Foundation.</li>
        <li>If the parent/guardian does not consent to the student appearing in such media, they must inform the organisers in writing on or before Day 1 of the camp.</li>
        <li>The organisers may contact the parent/guardian by phone, email, or WhatsApp regarding camp logistics and updates.</li>
      </ul>

      <h2>8. Liability</h2>
      <p>
        The organisers will exercise reasonable care in conducting the camp, but participation
        is at the student&apos;s and parent&apos;s own risk. To the extent permitted by law, the
        organisers, the Edenwoods Eduhub Foundation, and The Elden Heights School will not be
        liable for indirect, incidental, or consequential losses, or for loss of personal
        property brought to the camp.
      </p>

      <h2>9. Changes to the programme</h2>
      <p>
        The organisers may reasonably adjust the schedule, activities, or location of specific
        sessions to ensure safety or quality. Material changes will be communicated to
        parents/guardians in advance wherever possible.
      </p>

      <h2>10. Data &amp; privacy</h2>
      <p>
        Information collected at registration is used only to operate the camp, issue the camp
        ID, communicate with the parent/guardian, and prepare the participation certificate.
        It is handled in line with the site&apos;s <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes arising out of or in
        connection with the camp are subject to the exclusive jurisdiction of the competent
        courts at the location of the school campus.
      </p>

      <h2>12. Contact</h2>
      <div className="legal-contact">
        <span className="k">For questions about the camp</span>
        Call / WhatsApp: <a href="tel:+919431904333">+91 94319 04333</a><br />
        Email: <a href="mailto:contact@eldenheights.org">contact@eldenheights.org</a><br />
        Organiser: The Human Side — Edenwoods Eduhub Foundation &amp; The Elden Heights School.
      </div>
    </LegalPage>
  );
}
