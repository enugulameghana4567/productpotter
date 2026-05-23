const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { adminAuth } = require('../middleware/auth');

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    res.json(setting || { key: req.params.key, value: null });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/settings/:key — admin
router.put('/:key', adminAuth, async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
