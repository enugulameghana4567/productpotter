const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String
  },
  product: {
    id: { type: String },
    name: String,
    description: String,
    image: String
  },
  material: {
    name: String,
    price: Number
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Delivered', 'Cancelled']
  },
  messageSent: {
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    preview: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);