require('dotenv').config();

console.log('=== EMAIL CONFIG CHECK ===');
console.log('BREVO_USER:', process.env.BREVO_USER);
console.log('BREVO_PASS:', process.env.BREVO_PASS ? '✅ EXISTS (length: ' + process.env.BREVO_PASS.length + ')' : '❌ MISSING');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('=========================');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  },
  tls: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection OK');

    console.log('Sending test email...');
    const result = await transporter.sendMail({
      from: `"Potters Productions" <${process.env.BREVO_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Potters Productions',
      html: '<h2>This is a test email. If you see this, emails are working! 🎉</h2>'
    });
    console.log('✅ Test email sent! Message ID:', result.messageId);
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    console.error('Full error:', err);
  }
}

test();