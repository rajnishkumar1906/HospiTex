import transporter from '../config/nodemailer.js';
import { 
  welcomeEmailTemplate, 
  loginEmailTemplate, 
  otpEmailTemplate,
  verificationStatusTemplate,
  appointmentConfirmationTemplate
} from '../utils/emailTemplates.js';

// Use env for flexibility
const SENDER = `"HospiTex" <${process.env.EMAIL_USER || 'no-reply@hospitex.com'}>`;

// Generic sender function (DRY)
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: SENDER,
    to,
    subject,
    html
  });
};

export const sendWelcomeEmail = async (email, name, role) => {
  const html = welcomeEmailTemplate(name, role);
  await sendEmail(email, "Welcome to HospiTex!", html);
};

export const sendLoginNotification = async (email, name) => {
  const html = loginEmailTemplate(name);
  await sendEmail(email, "New Login to Your HospiTex Account", html);
};

export const sendOtpEmail = async (email, otp, purpose = "verification") => {
  const html = otpEmailTemplate(otp, purpose);
  await sendEmail(email, `Your OTP for ${purpose}`, html);
};

export const sendVerificationStatusEmail = async (email, name, status, role) => {
  const html = verificationStatusTemplate(name, status, role);
  await sendEmail(email, `Account ${status} - HospiTex`, html);
};

export const sendAppointmentConfirmation = async (
  email,
  patientName,
  doctorName,
  date,
  time
) => {
  const html = appointmentConfirmationTemplate(
    patientName,
    doctorName,
    date,
    time
  );
  await sendEmail(email, "Appointment Confirmed - HospiTex", html);
};