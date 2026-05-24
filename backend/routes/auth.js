const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../config/email');

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, location, country, gender, password } = req.body;

    if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'This email cannot be registered.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const user = new User({
      fullName, email: email.toLowerCase(),
      phone, location, country, gender,
      password: password || 'customer_no_pass'
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response IMMEDIATELY - don't wait for email
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        country: user.country,
        gender: user.gender,
        isAdmin: false
      }
    });

    // Send welcome email in background AFTER response
    sendWelcomeEmail(email, fullName).catch(err =>
      console.error('Welcome email error:', err.message)
    );

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ message: 'Not an admin account.' });
    }
    if (password !== process.env.ADMIN_PASS) {
      return res.status(401).json({ message: 'Invalid admin password.' });
    }
    const token = jwt.sign(
      { id: 'admin', email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { fullName: 'Admin', email, isAdmin: true } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login/customer', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Please use admin login.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found. Please register first.' });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        country: user.country,
        gender: user.gender,
        isAdmin: false
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;