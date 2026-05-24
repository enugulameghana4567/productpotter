const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Helper: convert file to base64 data URL
const fileToBase64 = (filePath, mimetype) => {
  try {
    const data = fs.readFileSync(filePath);
    return `data:${mimetype};base64,${data.toString('base64')}`;
  } catch (err) {
    console.error('base64 error:', err.message);
    return '';
  }
};

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
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name, description, bibleVerse, inspirationalSentence,
      colorDescription, designDescription, themeDescription, isVisible
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }
    if (!req.files?.image) {
      return res.status(400).json({ message: 'Product image is required.' });
    }

    const mainFile = req.files.image[0];
    const imageData = fileToBase64(mainFile.path, mainFile.mimetype);

    const extraImagesData = req.files?.images
      ? req.files.images.map(f => fileToBase64(f.path, f.mimetype))
      : [];

    const videoData = req.files?.video
      ? fileToBase64(req.files.video[0].path, req.files.video[0].mimetype)
      : '';

    const product = new Product({
      name, description,
      bibleVerse: bibleVerse || '',
      inspirationalSentence: inspirationalSentence || '',
      colorDescription: colorDescription || '',
      designDescription: designDescription || '',
      themeDescription: themeDescription || '',
      image: mainFile.filename,
      imageData,
      images: req.files?.images ? req.files.images.map(f => f.filename) : [],
      imagesData: extraImagesData,
      video: req.files?.video ? req.files.video[0].filename : '',
      videoData,
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
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.isVisible !== undefined) {
      updates.isVisible = updates.isVisible === 'false' ? false : true;
    }
    if (req.files?.image) {
      const f = req.files.image[0];
      updates.image = f.filename;
      updates.imageData = fileToBase64(f.path, f.mimetype);
    }
    if (req.files?.images) {
      updates.images = req.files.images.map(f => f.filename);
      updates.imagesData = req.files.images.map(f => fileToBase64(f.path, f.mimetype));
    }
    if (req.files?.video) {
      const f = req.files.video[0];
      updates.video = f.filename;
      updates.videoData = fileToBase64(f.path, f.mimetype);
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