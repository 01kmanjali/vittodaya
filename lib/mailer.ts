import { Resend } from "resend";

// Lazy init — avoids build-time throw when env var is not set
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "missing");
  return _resend;
}
const FROM = process.env.RESEND_FROM ?? "Vittodaya <noreply@vittodaya.com>";

const PURPOSE_LABELS: Record<string, string> = {
  email_verify: "Email Verification",
  phone:     "Mobile Number Verification",
  aadhaar:   "Aadhaar Verification",
  pan:       "PAN Card Verification",
  "2fa_setup": "Two-Factor Authentication Setup",
};

export async function sendOTPEmail(
  to: string,
  name: string,
  otp: string,
  type: string
) {
  const label = PURPOSE_LABELS[type] ?? "Verification";
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Your OTP for ${label} – Vittodaya`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1e40af;margin:0 0 8px">Vittodaya Financial</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your one-time password for <strong>${label}</strong> is:</p>
        <div style="background:#eff6ff;border:2px solid #1e40af;border-radius:12px;padding:24px;text-align:center;margin:20px 0">
          <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#1e40af">${otp}</span>
        </div>
        <p>This OTP is valid for <strong>10 minutes</strong>. Never share it with anyone.</p>
        <p style="color:#6b7280;font-size:12px;margin-top:24px">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function send2FASetupEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Two-Factor Authentication Enabled – Vittodaya",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1e40af;margin:0 0 8px">Vittodaya Financial</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Two-factor authentication has been <strong>enabled</strong> on your account.</p>
        <p>You will now be asked for a code from your authenticator app each time you sign in.</p>
        <p style="color:#dc2626;font-weight:500">If you did not enable this, contact support immediately.</p>
      </div>
    `,
  });
}
