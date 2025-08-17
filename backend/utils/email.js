import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (summary, recipients, attachmentPath) => {
  const toField = Array.isArray(recipients) ? recipients.join(", ") : recipients;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toField,
    subject: `Meeting Summary - ${new Date().toLocaleDateString()}`,
    html: `<h2>Meeting Summary</h2><div>${summary.replace(/\n/g, "<br>")}</div>`,
    text: summary,
    attachments: attachmentPath ? [{ path: attachmentPath }] : [],
  };

  await transporter.sendMail(mailOptions);
};
