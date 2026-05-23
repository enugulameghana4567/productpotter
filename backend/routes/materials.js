const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { adminAuth } = require('../middleware/auth');

// Seed default materials if they don't exist
const seedDefaults = async () => {
  const count = await Material.countDocuments({ isDefault: true });
  if (count === 0) {
    await Material.insertMany([
      { name: 'Cardboard', description: 'Sturdy cardboard finish, lightweight and elegant. Eco-friendly and great for everyday use.', price: 300, color: '#8B5E3C', isActive: true, isDefault: true },
      { name: 'Thin Plastic', description: 'Smooth silver-toned plastic, durable and sleek. Water-resistant surface with a clean finish.', price: 400, color: '#C0C0C0', isActive: true, isDefault: true },
      { name: 'Acrylic Plastic', description: 'Premium white acrylic, crystal-clear and premium quality. Long-lasting shine with a luxury feel.', price: 500, color: '#F0F0F0', isActive: true, isDefault: true }
    ]);
    console.log('✅ Default materials seeded');
  }
};
seedDefaults();

// GET /api/materials - public
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find({ isActive: true }).sort({ price: 1 });
    res.json(materials);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/materials/all - admin
router.get('/all', adminAuth, async (req, res) => {
  try {
    const materials = await Material.find().sort({ price: 1 });
    res.json(materials);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/materials - admin (adds new, never touches defaults)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, color, isActive } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }
    const material = new Material({
      name,
      description: description || '',
      price: Number(price),
      color: color || '#8B5E3C',
      isActive: isActive !== false,
      isDefault: false
    });
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    console.error('Material save error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/materials/:id - admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    delete updates.isDefault; // never allow changing isDefault
    const material = await Material.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json(material);
  } catch (err) {
    console.error('Material update error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/materials/:id - admin (cannot delete defaults)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    if (material.isDefault) {
      return res.status(403).json({ message: 'Cannot delete default materials (Cardboard, Thin Plastic, Acrylic Plastic).' });
    }
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;