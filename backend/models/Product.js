const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  bibleVerse: { type: String, default: '' },
  inspirationalSentence: { type: String, default: '' },
  colorDescription: { type: String, default: '' },
  designDescription: { type: String, default: '' },
  themeDescription: { type: String, default: '' },
  image: { type: String, required: true }, // filename or base64
  imageData: { type: String, default: '' }, // base64 data URL - permanent storage
  images: [{ type: String }], // extra images filenames
  imagesData: [{ type: String }], // extra images as base64 - permanent
  video: { type: String, default: '' },
  videoData: { type: String, default: '' }, // base64 video - permanent
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);