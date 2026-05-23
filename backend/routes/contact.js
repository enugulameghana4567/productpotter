const express = require('express');
const router = express.Router();
const { sendContactNotification } = require('../config/email');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    await sendContactNotification(name, email, message);
    res.json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ message: 'Failed to send message: ' + err.message });
  }
});

module.exports = router;