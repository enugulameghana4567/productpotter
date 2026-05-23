const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/all - admin
router.get('/all', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products - admin
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const {
      name, description, bibleVerse, inspirationalSentence,
      colorDescription, designDescription, themeDescription, isVisible
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required.' });
    }

    const product = new Product({
      name,
      description,
      bibleVerse: bibleVerse || '',
      inspirationalSentence: inspirationalSentence || '',
      colorDescription: colorDescription || '',
      designDescription: designDescription || '',
      themeDescription: themeDescription || '',
      image: req.file.filename,
      isVisible: isVisible === 'false' ? false : true
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Product save error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id - admin
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.filename;
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

// DELETE /api/products/:id - admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;