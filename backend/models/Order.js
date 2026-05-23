const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String
  },
  product: {
    id: { type: String }, // String type to avoid BSONError with "default1"
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);