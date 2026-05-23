const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const { sendOrderConfirmation, sendAdminMessage } = require('../config/email');

router.post('/', auth, async (req, res) => {
  try {
    const { customer, product, material } = req.body;
    if (!customer || !product || !material) {
      return res.status(400).json({ message: 'Missing order details.' });
    }
    if (!customer.name || !customer.email) {
      return res.status(400).json({ message: 'Customer name and email required.' });
    }

    const orderData = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || ''
      },
      product: {
        id: String(product.id),
        name: product.name,
        description: product.description || '',
        image: product.image || ''
      },
      material: {
        name: material.name,
        price: Number(material.price)
      },
      status: 'Pending'
    };

    const order = new Order(orderData);
    await order.save();

    // Send email async - don't wait for it
    sendOrderConfirmation(
      customer.email,
      customer.name,
      product.name,
      material.name,
      material.price
    ).catch(err => console.error('Order email error:', err.message));

    // Respond immediately
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order save error:', err.message);
    res.status(500).json({ message: 'Order failed: ' + err.message });
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/orders/:id/message - admin sends message to customer
router.post('/:id/message', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await sendAdminMessage(
      order.customer.email,
      order.customer.name,
      order.product.name,
      message
    );
    res.json({ message: 'Message sent to customer successfully!' });
  } catch (err) {
    console.error('Admin message error:', err.message);
    res.status(500).json({ message: 'Failed to send message: ' + err.message });
  }
});

module.exports = router;