/*
  Serverless handler example (Node) for SendGrid
  - Deploy this file to a platform that exposes a serverless function at `/api/send` (Vercel, Netlify with adapters, etc.)
  - Ensure SENDGRID_API_KEY and TO_EMAIL (and optionally FROM_EMAIL) are set in environment variables.
*/
const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  // Destination and from email. Defaults to yelefemi111@gmail.com when TO_EMAIL not set.
  const TO_EMAIL = process.env.TO_EMAIL || 'yelefemi111@gmail.com';
  const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    console.error('SendGrid key or TO_EMAIL not configured');
    return res.status(500).json({ success: false, error: 'Server not configured.' });
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    await sgMail.send(msg);
    return res.json({ success: true });
  } catch (err) {
    console.error('SendGrid error', err && err.toString ? err.toString() : err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
};
