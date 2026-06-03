import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Voices Unheard 2026 — Parent / Guardian Consent" };

export default function VoicesUnheardConsentPage() {
  return (
    <LegalPage title="Voices Unheard 2026 — Parent / Guardian Consent">
      <p className="legal-note">
        This page sets out the consent the parent/guardian gives when registering a student
        for the camp. Ticking the consent box in the registration form is treated as a binding
        digital signature of this consent.
      </p>

      <h2>1. Who this consent is from</h2>
      <p>
        I am the parent or legal guardian of the student named in the registration form. I
        confirm that the information I provide at registration — including the student&apos;s
        name, date of birth, class, school, contact details, my own contact details, and any
        medical notes — is true, complete, and current to the best of my knowledge.
      </p>

      <h2>2. What I am consenting to</h2>
      <p>
        I voluntarily consent to my child&apos;s participation in <strong>Voices Unheard 2026</strong>,
        a 4-day Social Awareness Summer Camp organised by The Human Side (an initiative of
        Edenwoods Eduhub Foundation in partnership with The Elden Heights School), held from
        <strong> 15<sup>th</sup> to 18<sup>th</sup> June 2026 </strong>on the school campus.
      </p>
      <p>I understand that the camp will include:</p>
      <ul>
        <li>Guided, supervised field activities in the surrounding community where students listen and learn from members of the public on social-awareness topics;</li>
        <li>Creative expression through street theatre <em>(nukkad natak)</em> and group activities;</li>
        <li>Expert-led workshops and respectful, judgement-free discussions on issues including safety, dignity, respect, and community awareness;</li>
        <li>A closing presentation, pledge-making, and the issue of a participation certificate.</li>
      </ul>

      <h2>3. Supervision &amp; safety</h2>
      <ul>
        <li>I understand that trained adult staff supervise the students at all times during camp hours.</li>
        <li>A qualified counsellor is present on site through the four days.</li>
        <li>All field activities take place in pre-vetted public spaces with chaperones, and the camp will not require students to disclose or discuss personal trauma.</li>
        <li>I understand that the student will be expected to follow the camp&apos;s code of conduct (see the <a href="/voices-unheard/terms">Terms &amp; Code of Conduct</a> page).</li>
      </ul>

      <h2>4. Medical &amp; emergency authorisation</h2>
      <ul>
        <li>I have disclosed all relevant medical conditions, allergies, and medication in the registration form, or will do so in writing before Day 1 of the camp.</li>
        <li>I authorise the organisers to administer reasonable first aid and to seek emergency medical attention for the student if required.</li>
        <li>If I cannot be reached promptly, I authorise the organisers to make necessary medical decisions in good faith and in the student&apos;s best interest. I will be responsible for the cost of any external medical treatment.</li>
      </ul>

      <h2>5. Pickup, drop-off &amp; collection</h2>
      <ul>
        <li>I will arrange for the student to arrive at and leave the camp venue at the times communicated by the organisers.</li>
        <li>If anyone other than me or the emergency contact will collect the student, I will inform the organisers in writing in advance.</li>
        <li>I will be reachable on the phone number(s) I have provided through camp hours.</li>
      </ul>

      <h2>6. Photography &amp; media</h2>
      <p>
        I understand that photos and videos may be taken at the camp for documentation and
        limited promotional use by The Human Side and Edenwoods Eduhub Foundation
        (e.g. social media, website, certificates, internal reports). If I do not want my
        child to appear in such media, I will inform the organisers in writing on or before
        Day 1 of the camp.
      </p>

      <h2>7. Code of conduct</h2>
      <p>
        I have read, and I will ensure the student has read, the camp&apos;s
        {" "}<a href="/voices-unheard/terms">Terms &amp; Code of Conduct</a>. I understand that
        the organisers may remove the student from the camp without refund if their conduct
        compromises the safety, wellbeing, or dignity of others.
      </p>

      <h2>8. Risk acknowledgement</h2>
      <p>
        I understand that, despite the organisers&apos; reasonable care, no activity is entirely
        without risk. I consent to my child&apos;s participation knowing this, and — to the
        extent permitted by law — I release The Human Side, the Edenwoods Eduhub Foundation,
        and The Elden Heights School from liability for indirect, incidental, or consequential
        loss arising from participation that was not caused by gross negligence or wilful
        misconduct of the organisers.
      </p>

      <h2>9. Data &amp; communication</h2>
      <ul>
        <li>I consent to the organisers using the information I provide solely to operate the camp, issue the camp ID card, communicate with me, and prepare the participation certificate.</li>
        <li>I consent to being contacted by phone, WhatsApp, or email regarding camp logistics, schedules, and the student&apos;s wellbeing.</li>
        <li>My information will be handled in line with the site&apos;s <a href="/privacy">Privacy Policy</a>.</li>
      </ul>

      <h2>10. Refunds</h2>
      <p>
        I understand that the refund and cancellation rules set out in the
        {" "}<a href="/voices-unheard/terms">Terms &amp; Code of Conduct</a> apply to this
        registration.
      </p>

      <h2>11. Declaration</h2>
      <p>
        By ticking the parent/guardian consent box in the registration form, I confirm that:
      </p>
      <ul>
        <li>I am the parent or legal guardian of the student named in the registration form;</li>
        <li>I have read and understood this consent and the camp&apos;s Terms &amp; Code of Conduct;</li>
        <li>I voluntarily consent to my child&apos;s participation on the terms set out here;</li>
        <li>The information I have provided at registration is true and complete.</li>
      </ul>
      <p>
        This digital tick is treated as a binding signature for the purposes of this consent.
      </p>

      <h2>12. Contact</h2>
      <div className="legal-contact">
        <span className="k">To withdraw consent, update details, or ask questions</span>
        Call / WhatsApp: <a href="tel:+919431904333">+91 94319 04333</a><br />
        Email: <a href="mailto:contact@eldenheights.org">contact@eldenheights.org</a>
      </div>
    </LegalPage>
  );
}
