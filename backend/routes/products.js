const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, bibleVerse, inspirationalSentence, colorDescription, designDescription, themeDescription, isVisible } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }
    if (!req.files?.image) {
      return res.status(400).json({ message: 'Product image is required.' });
    }
    const product = new Product({
      name, description,
      bibleVerse: bibleVerse || '',
      inspirationalSentence: inspirationalSentence || '',
      colorDescription: colorDescription || '',
      designDescription: designDescription || '',
      themeDescription: themeDescription || '',
      image: req.files.image[0].filename,
      video: req.files?.video ? req.files.video[0].filename : '',
      isVisible: isVisible === 'false' ? false : true
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Product save error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.image) updates.image = req.files.image[0].filename;
    if (req.files?.video) updates.video = req.files.video[0].filename;
    if (updates.isVisible !== undefined) {
      updates.isVisible = updates.isVisible === 'false' ? false : true;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Product update error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;