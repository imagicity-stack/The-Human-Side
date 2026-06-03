import nodemailer from "nodemailer";

export function makeTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export function welcomeEmailHtml(m) {
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Volunteer";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F4FB;font-family:Arial,Helvetica,sans-serif;color:#2A1747;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4FB;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px -25px rgba(42,23,71,.4);">
        <tr><td style="background:linear-gradient(135deg,#1F1036,#2A1747);padding:36px 36px 28px;">
          <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#B68AD0;">The Human Side</div>
          <div style="font-size:28px;font-weight:700;color:#ffffff;margin-top:8px;line-height:1.15;">Welcome — you're officially in.</div>
        </td></tr>
        <tr><td style="padding:32px 36px 8px;">
          <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Dear ${name},</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 22px;">Thank you for registering as a volunteer of <strong>The Human Side</strong>. Your one-time membership is confirmed, and here is your official member ID:</p>
          <div style="text-align:center;margin:0 0 26px;">
            <div style="display:inline-block;background:linear-gradient(140deg,#1F1036,#2A1747);border-radius:12px;padding:22px 40px;">
              <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B68AD0;">Member ID</div>
              <div style="font-size:40px;font-weight:700;color:#ffffff;letter-spacing:.04em;margin-top:6px;">${m.memberId}</div>
            </div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 10px;">Your membership includes:</p>
          <ul style="font-size:15px;line-height:1.7;margin:0 0 22px;padding-left:20px;color:#4A3168;">
            <li>Official T-shirt, pin badge &amp; digital membership ID</li>
            <li>Access to all official social-service drives</li>
            <li>Participation certificates &amp; recognition</li>
            <li>Volunteer leadership roles &amp; the annual impact report</li>
          </ul>
          <p style="font-size:15px;line-height:1.6;margin:0 0 6px;">We'll be in touch with kit dispatch details and the date of the next drive. Reply to this email any time — we read everything.</p>
        </td></tr>
        <tr><td style="padding:18px 36px 36px;border-top:1px solid #ECE5F3;">
          <p style="font-size:15px;font-style:italic;color:#7C3F98;margin:18px 0 4px;">The side that still cares.</p>
          <p style="font-size:12px;color:#8E83A4;margin:0;">An initiative of Edenwoods Eduhub Foundation, in partnership with The Elden Heights School.</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

export function voicesUnheardEmailHtml(m) {
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Camper";
  const school = m.school || "—";
  const classGrade = m.classGrade || "—";
  const guardianName = m.guardianName || "—";
  const guardianPhone = m.guardianPhone || "—";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F4FB;font-family:Arial,Helvetica,sans-serif;color:#2A1747;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4FB;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px -25px rgba(42,23,71,.4);">
        <tr><td style="background:linear-gradient(135deg,#1F1036,#2A1747);padding:36px 36px 28px;">
          <div style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#B68AD0;">Voices Unheard · 2026</div>
          <div style="font-size:28px;font-weight:700;color:#ffffff;margin-top:8px;line-height:1.15;">You're in. Welcome to Voices Unheard 2026.</div>
          <div style="font-size:13px;color:#DCD2E0;margin-top:10px;line-height:1.5;">A 4-day Social Awareness Summer Camp · Speak Up. Step Out. Make a Difference.</div>
        </td></tr>
        <tr><td style="padding:32px 36px 8px;">
          <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Dear ${name},</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 22px;">Your seat at <strong>Voices Unheard 2026</strong> is confirmed. We're so glad to have you. Below is your official camp ID card — please keep it safe and bring it on Day 1.</p>

          <!-- ID CARD -->
          <div style="margin:0 0 28px;">
            <div style="background:linear-gradient(140deg,#1F1036 0%,#2A1747 60%,#5E2A78 120%);border-radius:14px;padding:26px 28px;color:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;">
                    <div style="font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#B68AD0;">The Human Side</div>
                    <div style="font-size:16px;font-weight:700;color:#ffffff;margin-top:4px;">Voices Unheard · 2026</div>
                  </td>
                  <td style="vertical-align:top;text-align:right;">
                    <div style="font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#B68AD0;">Camp ID</div>
                    <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:.04em;margin-top:4px;">${m.memberId}</div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:24px;padding-top:16px;border-top:1px dashed rgba(255,255,255,0.25);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#DCD2E0;">
                  <tr>
                    <td style="padding:4px 0;width:120px;letter-spacing:.16em;text-transform:uppercase;color:#B68AD0;">Name</td>
                    <td style="padding:4px 0;color:#ffffff;font-weight:600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;letter-spacing:.16em;text-transform:uppercase;color:#B68AD0;">Class</td>
                    <td style="padding:4px 0;color:#ffffff;">${classGrade}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;letter-spacing:.16em;text-transform:uppercase;color:#B68AD0;">School</td>
                    <td style="padding:4px 0;color:#ffffff;">${school}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;letter-spacing:.16em;text-transform:uppercase;color:#B68AD0;">Dates</td>
                    <td style="padding:4px 0;color:#ffffff;">15–18 June 2026</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;letter-spacing:.16em;text-transform:uppercase;color:#B68AD0;">Guardian</td>
                    <td style="padding:4px 0;color:#ffffff;">${guardianName} · ${guardianPhone}</td>
                  </tr>
                </table>
              </div>
              <div style="margin-top:14px;font-style:italic;font-size:13px;color:#B68AD0;">Speak Up. Step Out. Make a Difference.</div>
            </div>
          </div>

          <p style="font-size:15px;line-height:1.6;margin:0 0 10px;"><strong>What's included:</strong></p>
          <ul style="font-size:15px;line-height:1.7;margin:0 0 22px;padding-left:20px;color:#4A3168;">
            <li>4-day camp programme with workshops, street theatre &amp; field activities</li>
            <li>Printed Field Handbook to keep</li>
            <li>Camp T-shirt &amp; materials</li>
            <li>Certificate of Participation from The Human Side</li>
            <li>Full supervision &amp; on-site qualified counsellor, every day</li>
          </ul>

          <p style="font-size:15px;line-height:1.6;margin:0 0 10px;"><strong>What's next:</strong> A pre-camp briefing email will reach you closer to 15 June with the reporting time, venue address, what to wear, and what to bring. Save this ID — you'll be checked in by it on Day 1.</p>

          <p style="font-size:14px;line-height:1.6;margin:14px 0 0;">Questions? Call or WhatsApp <strong>+91 94319 04333</strong> or write to <a href="mailto:contact@eldenheights.org" style="color:#7C3F98;">contact@eldenheights.org</a>.</p>
        </td></tr>
        <tr><td style="padding:18px 36px 36px;border-top:1px solid #ECE5F3;">
          <p style="font-size:15px;font-style:italic;color:#7C3F98;margin:18px 0 4px;">A Human Side Initiative.</p>
          <p style="font-size:12px;color:#8E83A4;margin:0;">Edenwoods Eduhub Foundation &amp; The Elden Heights School.</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

export async function sendWelcomeEmail(member) {
  const transport = makeTransport();
  if (!transport || !member.email) return;
  await transport.sendMail({
    from: process.env.MAIL_FROM || "The Human Side <contact@edenwoods.org>",
    to: member.email,
    subject: `Welcome to The Human Side — your member ID is ${member.memberId}`,
    html: welcomeEmailHtml(member),
  });
}

export async function sendVoicesUnheardWelcomeEmail(member) {
  const transport = makeTransport();
  if (!transport || !member.email) return;
  await transport.sendMail({
    from: process.env.MAIL_FROM || "The Human Side <contact@edenwoods.org>",
    to: member.email,
    subject: `Voices Unheard 2026 — your camp ID is ${member.memberId}`,
    html: voicesUnheardEmailHtml(member),
  });
}
