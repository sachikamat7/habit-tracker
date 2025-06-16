import nodemailer from "nodemailer";

// Define the email service configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error("Error with mailer configuration:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

interface SendVerificationEmailParams {
  email: string;
  token: string;
}

interface SendPasswordResetEmailParams {
  email: string;
  token: string;
}

export const sendVerificationEmail = async ({
  email,
  token,
}: SendVerificationEmailParams) => {
  // Create verification URL
  const verificationUrl = `${process.env.NEXTAUTH_URL}/signin?token=${token}&email=${encodeURIComponent(email)}`;

  // Email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div>
        <h1>Verify your email address</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>The link will expire in 1 hour.</p>
      </div>
    `,
    text: `Please verify your email by clicking this link: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: SendPasswordResetEmailParams) => {
  // Create password reset URL
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}?email=${encodeURIComponent(email)}`;

  // Email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div>
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>The link will expire in 1 hour.</p>
        <p>For security reasons, do not share this link with anyone.</p>
      </div>
    `,
    text: `To reset your password, click this link: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error; // Consider throwing the error to handle it in the calling function
  }
};