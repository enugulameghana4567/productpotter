const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { adminAuth } = require('../middleware/auth');

// GET /api/feedback — public (approved only)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/feedback/all — admin
router.get('/all', adminAuth, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/feedback — public
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully! It will appear after admin approval.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/feedback/:id/approve — admin
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true });
    res.json(feedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/feedback/:id — admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
