// Netlify Function to send email via SendGrid
// Place this file under `netlify/functions/send.js` and deploy to Netlify.
const sgMail = require('@sendgrid/mail');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const { name, email, message } = body;
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing required fields.' }) };
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL || 'yelefemi111@gmail.com';
  const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

  if (!SENDGRID_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SendGrid not configured.' }) };
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g,'<br>')}</p>`,
    };
    await sgMail.send(msg);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Netlify SendGrid error', err && err.toString ? err.toString() : err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Failed to send email.' }) };
  }
};
