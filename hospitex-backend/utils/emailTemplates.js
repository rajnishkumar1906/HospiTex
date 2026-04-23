export const welcomeEmailTemplate = (name, role) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2c7da0 0%, #1a4b60 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .button { display: inline-block; padding: 12px 30px; background: #2c7da0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    h1 { margin: 0; font-size: 28px; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Welcome to HospiTex!</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Thank you for choosing <strong>HospiTex</strong> - your trusted healthcare partner. We're excited to have you on board!</p>
      
      <h3>Account Details:</h3>
      <ul>
        <li><strong>Role:</strong> ${role}</li>
        <li><strong>Status:</strong> ${role === 'Patient' || role === 'Admin' ? '✅ Verified' : '⏳ Pending Verification'}</li>
      </ul>
      
      ${role === 'Doctor' || role === 'Diagnostic' ? `
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;">⚠️ <strong>Important:</strong> Your account requires admin verification before you can access all features. You will receive an email once verified.</p>
      </div>
      ` : ''}
      
      <p>With HospiTex, you can:</p>
      <ul>
        <li>📅 Book appointments with top doctors</li>
        <li>🧪 Schedule diagnostic tests</li>
        <li>🚑 Request emergency ambulance services</li>
        <li>💊 Access digital prescriptions</li>
        <li>📊 View your medical records online</li>
      </ul>
      
      <center>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Get Started →</a>
      </center>
      
      <p>If you have any questions, our support team is here to help 24/7.</p>
      <p>Best regards,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

export const loginEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Alert - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2c7da0 0%, #1a4b60 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .alert-box { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Login Alert</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      
      <div class="alert-box">
        <p>We noticed a new login to your HospiTex account.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Device:</strong> Web Browser</p>
      </div>
      
      <p><strong>Was this you?</strong></p>
      <p>If this was you, you can safely ignore this email.</p>
      
      <p><strong>Wasn't this you?</strong></p>
      <p>If you didn't log in, please reset your password immediately:</p>
      
      <center>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password" class="button" style="display: inline-block; padding: 12px 30px; background: #2c7da0; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </center>
      
      <p style="margin-top: 30px;">Stay safe,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const otpEmailTemplate = (otp, purpose) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2c7da0 0%, #1a4b60 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
    .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #2c7da0; padding: 20px; background: #f0f7fa; border-radius: 10px; margin: 20px 0; font-family: monospace; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { color: #856404; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>OTP Verification</h1>
    </div>
    <div class="content">
      <h2>Hello,</h2>
      <p>You requested an OTP for <strong>${purpose}</strong>.</p>
      
      <div class="otp-code">${otp}</div>
      
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      
      <div class="warning">
        ⚠️ Never share this OTP with anyone, including HospiTex support.
      </div>
      
      <p style="margin-top: 30px;">If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const verificationStatusTemplate = (name, status, role) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account ${status} - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${status === 'Verified' ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .status-box { padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; background: ${status === 'Verified' ? '#d4edda' : '#f8d7da'}; color: ${status === 'Verified' ? '#155724' : '#721c24'}; }
    .button { display: inline-block; padding: 12px 30px; background: #2c7da0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Account ${status}</h1>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      
      <div class="status-box">
        <h3 style="margin: 0;">✓ Your ${role} account has been ${status}</h3>
      </div>
      
      ${status === 'Verified' ? `
        <p>Congratulations! Your account has been verified by the district admin.</p>
        <p>You can now:</p>
        <ul>
          <li>✅ Log in to your account</li>
          <li>✅ Access all HospiTex features</li>
          <li>✅ Start serving patients (for Doctors/Diagnostics)</li>
        </ul>
        
        <center>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login Now →</a>
        </center>
      ` : `
        <p>We regret to inform you that your ${role} account verification has been ${status.toLowerCase()}.</p>
        <p>Possible reasons:</p>
        <ul>
          <li>❌ Invalid or incomplete documentation</li>
          <li>❌ Information mismatch</li>
          <li>❌ Unable to verify credentials</li>
        </ul>
        <p>Please contact your district admin for more information or to reapply.</p>
      `}
      
      <p>Best regards,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const appointmentConfirmationTemplate = (patientName, doctorName, date, time) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .appointment-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #dee2e6; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .button { display: inline-block; padding: 12px 30px; background: #2c7da0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Appointment Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Dear ${patientName},</h2>
      <p>Your appointment has been successfully confirmed. Please find the details below:</p>
      
      <div class="appointment-details">
        <div class="detail-row">
          <strong>👨‍⚕️ Doctor:</strong>
          <span>Dr. ${doctorName}</span>
        </div>
        <div class="detail-row">
          <strong>📅 Date:</strong>
          <span>${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="detail-row">
          <strong>⏰ Time:</strong>
          <span>${time}</span>
        </div>
        <div class="detail-row">
          <strong>📍 Location:</strong>
          <span>HospiTex Hospital</span>
        </div>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">⚠️ <strong>Please arrive 15 minutes before your appointment time.</strong></p>
      </div>
      
      <center>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/patient/appointments" class="button">View My Appointments</a>
      </center>
      
      <p>Need to reschedule? Please contact us at least 24 hours in advance.</p>
      <p>Best regards,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const diagnosticReportReadyTemplate = (patientName, testName, diagnosticName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnostic Report Ready - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .button { display: inline-block; padding: 12px 30px; background: #2c7da0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Your Report is Ready!</h1>
    </div>
    <div class="content">
      <h2>Dear ${patientName},</h2>
      <p>Your diagnostic report for <strong>${testName}</strong> has been uploaded by <strong>${diagnosticName}</strong>.</p>
      
      <center>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/patient/diagnostics" class="button">View Report →</a>
      </center>
      
      <p>You can now view and download your report from the patient dashboard.</p>
      <p>Best regards,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetConfirmationTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed - HospiTex</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏥 HospiTex</div>
      <h1>Password Changed</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Your HospiTex account password has been successfully changed.</p>
      
      <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; color: #155724;">
        ✅ If you made this change, you can safely ignore this email.
      </div>
      
      <p><strong>Didn't make this change?</strong> Please contact our support team immediately.</p>
      
      <p>Best regards,<br><strong>The HospiTex Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 HospiTex. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Export all templates
export default {
  welcomeEmailTemplate,
  loginEmailTemplate,
  otpEmailTemplate,
  verificationStatusTemplate,
  appointmentConfirmationTemplate,
  diagnosticReportReadyTemplate,
  passwordResetConfirmationTemplate
};