// ═══════════════════════════════════════════════════════════════════════
// Sri Vani Vidyanikethan — Centralized Email Service
// ═══════════════════════════════════════════════════════════════════════
// This module provides:
//   1. A single `sendEmail(to, subject, html)` helper
//   2. Seven professional HTML email template builders
//   3. A shared base layout wrapper for consistent branding
// ═══════════════════════════════════════════════════════════════════════

const SCHOOL_NAME = 'Sri Vani Vidyanikethan';
const SCHOOL_TAGLINE = 'EM SCHOOL';
const SCHOOL_YEAR = '2026';
const BRAND_COLOR = '#2563eb';
const BRAND_DARK = '#1e3a8a';

// ─── Base Layout Wrapper ────────────────────────────────────────────────
// Wraps any email body content in a responsive, branded HTML shell.
function wrapInBaseLayout(bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SCHOOL_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #4f46e5 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">${SCHOOL_NAME}</h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 3px;">${SCHOOL_TAGLINE}</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 40px 20px 40px; font-size: 14px; color: #334155; line-height: 1.7;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6;">
                This is an automated message from ${SCHOOL_NAME} portal.<br/>
                Please do not reply to this email directly.
              </p>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8; text-align: center;">
                © ${SCHOOL_YEAR} ${SCHOOL_NAME}. All Rights Reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Reusable UI Components ─────────────────────────────────────────────

function infoBox(rows) {
  // rows = [{ label: 'Student ID', value: 'S1001' }, ...]
  const rowsHtml = rows.map(r => `
    <tr>
      <td style="padding: 8px 14px; font-size: 13px; color: #64748b; white-space: nowrap;">${r.label}:</td>
      <td style="padding: 8px 14px; font-size: 13px; font-weight: 700; color: #0f172a;">${r.value}</td>
    </tr>
  `).join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0;">
      ${rowsHtml}
    </table>
  `;
}

function otpBlock(otp) {
  return `
    <div style="text-align: center; margin: 28px 0;">
      <span style="
        display: inline-block;
        font-size: 34px;
        font-weight: 800;
        letter-spacing: 8px;
        color: ${BRAND_DARK};
        background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
        padding: 16px 32px;
        border-radius: 14px;
        border: 2px solid #bfdbfe;
        font-family: 'Courier New', monospace;
      ">${otp}</span>
    </div>
  `;
}

function sectionHeading(text) {
  return `<h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #0f172a;">${text}</h2>`;
}

function paragraph(text) {
  return `<p style="margin: 0 0 14px 0;">${text}</p>`;
}

function smallNote(text) {
  return `<p style="font-size: 12px; color: #94a3b8; margin: 18px 0 0 0;">${text}</p>`;
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 1: Student Enrollment Success
// ═══════════════════════════════════════════════════════════════════════
export function buildStudentEnrollmentEmail({ studentName, studentId, registerNo, className, password, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading(`Welcome to ${school}`)}
    ${paragraph(`Dear <strong>${studentName}</strong>,`)}
    ${paragraph(`Congratulations! Your enrollment at <strong>${school}</strong> has been successfully completed.`)}
    ${paragraph(`We are delighted to welcome you to our academic community. Your student account has been created and is ready to use.`)}
    ${infoBox([
      { label: 'Student ID', value: studentId || 'Assigned' },
      { label: 'Register Number', value: registerNo || 'N/A' },
      { label: 'Class', value: className || 'Assigned' },
      { label: 'Portal Password', value: password || '(Set during enrollment)' }
    ])}
    ${paragraph(`We wish you a successful and enjoyable learning journey.`)}
    ${paragraph(`Thank you for choosing <strong>${school}</strong>.`)}
    ${smallNote(`Use your Register Number and password to log into the Student Portal.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 2: Parent Enrollment Confirmation
// ═══════════════════════════════════════════════════════════════════════
export function buildParentEnrollmentEmail({ parentName, studentName, parentEmail, password, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading('Student Enrollment Confirmation')}
    ${paragraph(`Dear <strong>${parentName}</strong>,`)}
    ${paragraph(`We are pleased to inform you that your child, <strong>${studentName}</strong>, has been successfully enrolled at <strong>${school}</strong>.`)}
    ${paragraph(`Your parent portal account has been created so you can track your child's academic progress, attendance, and more.`)}
    ${infoBox([
      { label: 'Login Email', value: parentEmail || 'N/A' },
      { label: 'Password', value: password || '(Set during enrollment)' },
      { label: 'Linked Student', value: studentName }
    ])}
    ${paragraph(`We appreciate the trust you have placed in us. We are committed to providing quality education and a safe learning environment.`)}
    ${paragraph(`Thank you for being a valued member of our school community.`)}
    ${smallNote(`Use your email and password to log into the Parent Portal.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 3: Teacher Registration Success
// ═══════════════════════════════════════════════════════════════════════
export function buildTeacherRegistrationEmail({ teacherName, teacherId, department, password, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading(`Welcome to ${school} Faculty`)}
    ${paragraph(`Dear <strong>${teacherName}</strong>,`)}
    ${paragraph(`We are pleased to welcome you to the teaching faculty at <strong>${school}</strong>. Your faculty account has been successfully created.`)}
    ${paragraph(`You can now access your portal to manage classes, upload marks, track attendance, and communicate with students and parents.`)}
    ${infoBox([
      { label: 'Employee ID', value: teacherId || 'Assigned' },
      { label: 'Department', value: department || 'General' },
      { label: 'Portal Password', value: password || '(Set during registration)' }
    ])}
    ${paragraph(`We look forward to your valuable contribution to our students' academic excellence.`)}
    ${smallNote(`Use your Employee ID and password to log into the Teacher Portal.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 4: OTP Verification Code
// ═══════════════════════════════════════════════════════════════════════
export function buildOtpVerificationEmail({ name, otp, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading('Security Verification Code')}
    ${paragraph(`Hello <strong>${name}</strong>,`)}
    ${paragraph(`You requested access to your <strong>${school}</strong> portal account. Please use the following 6-digit verification code to complete your login:`)}
    ${otpBlock(otp)}
    ${paragraph(`This code is valid for <strong>3 minutes</strong>. Do not share this code with anyone.`)}
    ${smallNote(`If you did not initiate this login request, please ignore this email or contact the school administration immediately.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 5: Password Reset / Change OTP
// ═══════════════════════════════════════════════════════════════════════
export function buildPasswordResetEmail({ name, otp, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading('Password Reset Request')}
    ${paragraph(`Hello <strong>${name}</strong>,`)}
    ${paragraph(`We received a request to update the password for your <strong>${school}</strong> portal account. Please use the following 6-digit verification code to confirm this action:`)}
    ${otpBlock(otp)}
    ${paragraph(`This code is valid for <strong>3 minutes</strong>. Do not share this code with anyone.`)}
    ${smallNote(`If you did not request a password change, please contact the school administration immediately to secure your account.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 6: Fee Payment Receipt
// ═══════════════════════════════════════════════════════════════════════
export function buildFeePaymentReceiptEmail({ parentName, studentName, studentId, className, txnId, paymentDate, feeBreakdown, totalAmount, schoolName }) {
  const school = schoolName || SCHOOL_NAME;

  // feeBreakdown = [{ description: 'Tuition', amount: '25000' }, ...]
  const feeRows = (feeBreakdown || []).map(item => `
    <tr>
      <td style="padding: 10px 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9;">${item.description}</td>
      <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; border-bottom: 1px solid #f1f5f9;">₹${item.amount}</td>
    </tr>
  `).join('');

  const body = `
    ${sectionHeading('Fee Payment Receipt')}
    ${paragraph(`Dear <strong>${parentName}</strong>,`)}
    ${paragraph(`Thank you for your payment. This email confirms that your fee payment for <strong>${studentName}</strong> has been successfully processed.`)}
    ${infoBox([
      { label: 'Transaction ID', value: txnId || 'N/A' },
      { label: 'Payment Date', value: paymentDate || new Date().toLocaleString('en-IN') },
      { label: 'Student Name', value: studentName },
      { label: 'Student ID', value: studentId || 'N/A' },
      { label: 'Class', value: className || 'N/A' }
    ])}

    <h3 style="margin: 24px 0 12px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Fee Breakdown</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 16px;">
      <thead>
        <tr style="background-color: #eef2ff;">
          <th style="padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
          <th style="padding: 10px 14px; text-align: right; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${feeRows}
        <tr style="background-color: #eef2ff;">
          <td style="padding: 12px 14px; font-size: 14px; font-weight: 800; color: #0f172a;">Total Paid</td>
          <td style="padding: 12px 14px; font-size: 14px; font-weight: 800; color: #16a34a; text-align: right;">₹${totalAmount || '0'}</td>
        </tr>
      </tbody>
    </table>

    ${paragraph(`Please keep this email as your official receipt for records.`)}
    ${smallNote(`For any queries regarding fee payments, please contact the school accounts office.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 7: Admission Approval
// ═══════════════════════════════════════════════════════════════════════
export function buildAdmissionApprovalEmail({ studentName, className, schoolName }) {
  const school = schoolName || SCHOOL_NAME;
  const body = `
    ${sectionHeading('Admission Approved!')}
    ${paragraph(`Dear Parent / Guardian,`)}
    ${paragraph(`We are delighted to inform you that the admission application for <strong>${studentName}</strong> to <strong>${className}</strong> at <strong>${school}</strong> has been <strong style="color: #16a34a;">approved</strong>.`)}
    ${paragraph(`Please complete the following steps to finalize enrollment:`)}
    <ol style="margin: 16px 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 2;">
      <li>Submit all required original documents to the school office</li>
      <li>Complete the fee payment for the academic session</li>
      <li>Collect the student ID card and uniform details</li>
    </ol>
    ${paragraph(`We look forward to welcoming <strong>${studentName}</strong> to our school community.`)}
    ${smallNote(`For any queries, please visit the school administration office or call our helpline.`)}
  `;
  return wrapInBaseLayout(body);
}

// ═══════════════════════════════════════════════════════════════════════
// Email Sender Helper
// ═══════════════════════════════════════════════════════════════════════
export async function sendEmail(to, subject, html) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html })
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Email dispatch error:', err);
    return { success: false, simulated: true, error: err.message };
  }
}
