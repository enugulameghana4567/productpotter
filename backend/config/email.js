const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Error:', error.message);
  } else {
    console.log('✅ SMTP connected and ready');
  }
});

const sender = `"Potters Productions" <${process.env.BREVO_USER}>`;

const sendWelcomeEmail = async (toEmail, name) => {
  console.log('📧 Sending welcome email to:', toEmail);
  const result = await transporter.sendMail({
    from: sender,
    to: toEmail,
    subject: 'Welcome to Potters Productions',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a56db,#0e3a8c);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;">Potters Productions</h1>
          <p style="color:#b3d1ff;margin:8px 0 0;">Creating with Purpose, Serving with Faith</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#1a56db;">Dear ${name},</h2>
          <p style="color:#333;line-height:1.8;font-size:16px;">
            Thank you for registering with Potters Productions.
            We are excited to have you as part of our faith-filled creative family.
            May God bless you abundantly.
          </p>
          <blockquote style="border-left:4px solid #1a56db;padding:12px 20px;color:#555;font-style:italic;background:#eef4ff;border-radius:4px;">
            "I can do all things through Christ who strengtheneth me." — Philippians 4:13
          </blockquote>
        </div>
        <div style="background:#1a56db;padding:20px;text-align:center;">
          <p style="color:#b3d1ff;margin:0;font-size:13px;">© 2025 Potters Productions | productpotter@gmail.com</p>
        </div>
      </div>
    `
  });
  console.log('✅ Welcome email sent:', result.messageId);
};

const sendOrderConfirmation = async (toEmail, name, productName, material, price) => {
  console.log('📧 Sending order confirmation to:', toEmail);
  const result = await transporter.sendMail({
    from: sender,
    to: toEmail,
    subject: 'Your order is successfully booked',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a56db,#0e3a8c);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;">Order Confirmed! 🎉</h1>
          <p style="color:#b3d1ff;margin:8px 0 0;">Potters Productions</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#1a56db;">Dear ${name},</h2>
          <p style="color:#333;line-height:1.8;font-size:16px;">
            Your order has been successfully booked with <strong>Potters Productions</strong>.
          </p>
          <div style="background:#eef4ff;border-radius:8px;padding:20px;margin:20px 0;">
            <h3 style="color:#1a56db;margin-top:0;">Order Details</h3>
            <p style="margin:8px 0;"><strong>Product:</strong> ${productName}</p>
            <p style="margin:8px 0;"><strong>Material:</strong> ${material}</p>
            <p style="margin:8px 0;"><strong>Price:</strong> ₹${price}</p>
          </div>
          <p style="color:#333;line-height:1.8;">
            We will contact you soon regarding delivery. Each product is handcrafted with love and prayer. 🙏
          </p>
        </div>
        <div style="background:#1a56db;padding:20px;text-align:center;">
          <p style="color:#b3d1ff;margin:0;font-size:13px;">© 2025 Potters Productions | productpotter@gmail.com</p>
        </div>
      </div>
    `
  });
  console.log('✅ Order confirmation sent:', result.messageId);
};

const sendContactNotification = async (name, email, message) => {
  console.log('📧 Sending contact notification to admin from:', email);
  const result = await transporter.sendMail({
    from: sender,
    replyTo: email,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Inquiry from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;">
        <h2 style="color:#1a56db;">New Contact Inquiry</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f0f4ff;padding:16px;border-radius:8px;border-left:4px solid #1a56db;">
          ${message}
        </div>
        <p style="color:#999;font-size:12px;margin-top:20px;">Reply to this email to respond directly to ${name} at ${email}</p>
      </div>
    `
  });
  console.log('✅ Contact notification sent:', result.messageId);
};

const sendAdminMessage = async (toEmail, customerName, productName, message) => {
  console.log('📧 Sending admin message to customer:', toEmail);
  const result = await transporter.sendMail({
    from: sender,
    to: toEmail,
    subject: `Message from Potters Productions regarding your order`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a56db,#0e3a8c);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;">Potters Productions</h1>
          <p style="color:#b3d1ff;margin:8px 0 0;">Message from our team</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#1a56db;">Dear ${customerName},</h2>
          <p style="color:#333;font-size:14px;margin-bottom:8px;">Regarding your order: <strong>${productName}</strong></p>
          <div style="background:#eef4ff;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #1a56db;">
            <p style="color:#333;line-height:1.8;margin:0;">${message}</p>
          </div>
          <p style="color:#333;line-height:1.8;">Thank you for choosing Potters Productions. 🙏</p>
        </div>
        <div style="background:#1a56db;padding:20px;text-align:center;">
          <p style="color:#b3d1ff;margin:0;font-size:13px;">© 2025 Potters Productions | productpotter@gmail.com</p>
        </div>
      </div>
    `
  });
  console.log('✅ Admin message sent to customer:', result.messageId);
};

module.exports = { sendWelcomeEmail, sendOrderConfirmation, sendContactNotification, sendAdminMessage };