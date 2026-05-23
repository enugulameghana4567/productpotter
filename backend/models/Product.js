const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  bibleVerse: { type: String, default: '' },
  inspirationalSentence: { type: String, default: '' },
  colorDescription: { type: String, default: '' },
  designDescription: { type: String, default: '' },
  themeDescription: { type: String, default: '' },
  image: { type: String, required: true },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);