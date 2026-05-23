const express = require('express');
const router = express.Router();
const { sendContactNotification } = require('../config/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactNotification(name, email, message);
    res.json({ message: 'Message sent successfully!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
