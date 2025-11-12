require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health
app.get('/', (req, res) => res.send({ status: 'ok' }));

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }
  // If no SMTP configuration and no SendGrid configured, return an informative error rather than
  // attempting to send and potentially hanging.
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const hasSendGrid = process.env.SENDGRID_API_KEY;
  if (!hasSmtp && !hasSendGrid) {
    console.error('No mail provider configured (SMTP or SENDGRID_API_KEY missing)');
    return res.status(500).json({ success: false, error: 'Mail not configured. Set SMTP or SENDGRID_API_KEY in environment.' });
  }

  try {
    // If SendGrid is available, prefer it. Otherwise use SMTP via Nodemailer.
    if (hasSendGrid) {
      // dynamic import to avoid adding an unconditional dependency on @sendgrid/mail for Express flow
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const toEmail = process.env.TO_EMAIL || 'yelefemi111@gmail.com';
      const fromEmail = process.env.FROM_EMAIL || toEmail;
      const msg = {
        to: toEmail,
        from: fromEmail,
        subject: `New contact form message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      };
      await sgMail.send(msg);
      return res.json({ success: true });
    }

    // Create transporter from env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Destination email: prefer TO_EMAIL, then SMTP_USER, otherwise fall back to the requested default
    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER || 'yelefemi111@gmail.com';

    const mailOptions = {
      from: `${name} <${email}>`,
      to: toEmail,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (err) {
    console.error('Error sending email', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Contact mailer listening on http://localhost:${PORT}`);
});
