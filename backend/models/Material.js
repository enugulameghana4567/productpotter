const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  color: { type: String, default: '#8B5E3C' },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false } // protects the 3 default materials
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);