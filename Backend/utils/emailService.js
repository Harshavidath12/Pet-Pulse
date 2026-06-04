const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email reply from admin to a user
 * @param {string} toEmail - recipient email
 * @param {string} toName  - recipient name
 * @param {string} originalMessage - the original inquiry message
 * @param {string} replyMessage - the admin's reply
 */
const sendReplyEmail = async (toEmail, toName, originalMessage, replyMessage) => {
  const mailOptions = {
    from: `"PetPulse Clinic" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Re: Your inquiry to PetPulse`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #1e5631; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🐾 PetPulse</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">We've replied to your inquiry</p>
        </div>

        <div style="background: #f9fafb; padding: 28px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hi <strong>${toName}</strong>,</p>
          <p style="color: #6b7280;">Thank you for reaching out to us. Here is our response to your inquiry:</p>

          <div style="background: white; border-left: 4px solid #1e5631; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #374151; line-height: 1.6;">${replyMessage}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

          <p style="font-size: 13px; color: #9ca3af; margin-bottom: 4px;"><strong>Your original message:</strong></p>
          <p style="font-size: 13px; color: #9ca3af; font-style: italic;">"${originalMessage}"</p>
        </div>

        <div style="background: #1e5631; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">
            146/6, Medhanadha Mawatha, Pahala Bomiriya, Kaduwela<br/>
            📞 0726009790 &nbsp;|&nbsp; ✉️ harshithavidath@gmail.com
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendReplyEmail };
