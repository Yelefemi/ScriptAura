# ScriptAura contact mailer (local)

This repository contains a small Express-based mailer to accept contact form submissions from the static site and forward them to an email address using SMTP (Nodemailer).

Steps to run locally
1. Install Node.js (v14+ recommended).
2. From the project root run:

   npm install

3. Copy `.env.example` to `.env` and fill in SMTP values (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS). Set `TO_EMAIL` to the destination mailbox.

4. Start the server:

   npm start

5. Open the site (the static site) in your browser and submit the contact form. The frontend posts to `http://localhost:3000/send`.

Notes & security
- Do NOT commit your real `.env` file. Use a safe secrets store in production.
- For Gmail, create an app password if using 2FA, or configure appropriate SMTP settings.
- In production, host the mailer on a secure server (HTTPS) and add rate-limiting / spam protection.

Serverless / SendGrid deployment
 - I added an example serverless handler at `api/send.js` which uses SendGrid. When you deploy this repository to Vercel (or another host that exposes `/api/*`), the contact form will POST to `/api/send` and SendGrid will deliver the email.
 - To use SendGrid set the following environment variables in the deployment settings: `SENDGRID_API_KEY`, `TO_EMAIL`, and `FROM_EMAIL` (FROM_EMAIL should be a verified sender in your SendGrid account).
 - If you prefer to keep the Express + Nodemailer approach, keep `server.js` and run it locally or deploy it to a traditional host; the frontend will still work if you change the endpoint.

Which to pick?
- Local/dev testing: run the Express server (`npm start`) and use SMTP creds in `.env`.
- Production / easiest ops & best deliverability: deploy to Vercel and set SendGrid environment variables (recommended).

Quick deploy guide — Vercel (recommended)

1. Create a Git repository (if you don't have one) and push this project to GitHub/GitLab.
2. Sign in to Vercel and import the repository.
3. During import, add the following Environment Variables in the Vercel project settings:
   - SENDGRID_API_KEY = your SendGrid API key
   - TO_EMAIL = the mailbox to receive messages (optional; defaults to `yelefemi111@gmail.com`)
   - FROM_EMAIL = a verified sender in SendGrid (recommended)
4. Deploy. The `api/send.js` file will be exposed at `https://<your-site>/api/send` and the contact form will post there.

Quick deploy guide — Netlify (alternative)

1. Push the repo to GitHub/GitLab.
2. Create a Netlify site from the repo.
3. In Netlify UI, add environment variables: `SENDGRID_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`.
4. Netlify will build and deploy; the Netlify Function `/.netlify/functions/send` will receive POSTs. To route your form to Netlify functions you can deploy the static site and ensure the frontend posts to `/api/send` (Netlify will proxy `/api/*` to functions) or change the endpoint to `/.netlify/functions/send`.

Production checklist (deliverability)
- Verify `FROM_EMAIL` in your SendGrid account (SendGrid requires verification for many accounts).
- Add SPF and DKIM records for the sending domain to improve deliverability (SendGrid provides instructions for the domain you use).
- Test by sending a few messages and checking spam folders; set up a real domain and proper DNS records if you see spam classification.

If you'd like, I can prepare a short `deploy-to-vercel.md` with screenshots of adding env vars in Vercel and the exact verification steps for SendGrid.

