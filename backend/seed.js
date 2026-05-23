require('dotenv').config();
const mongoose = require('mongoose');
const Material = require('./models/Material');
const Product = require('./models/Product');
const Settings = require('./models/Settings');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Seed default materials (only if not already there)
  const matCount = await Material.countDocuments({ isDefault: true });
  if (matCount === 0) {
    await Material.insertMany([
      { name: 'Cardboard', description: 'Sturdy cardboard finish, lightweight and elegant. Eco-friendly and great for everyday use.', price: 300, color: '#8B5E3C', isActive: true, isDefault: true },
      { name: 'Thin Plastic', description: 'Smooth silver-toned plastic, durable and sleek. Water-resistant surface with a clean finish.', price: 400, color: '#C0C0C0', isActive: true, isDefault: true },
      { name: 'Acrylic Plastic', description: 'Premium white acrylic, crystal-clear and premium quality. Long-lasting shine with a luxury feel.', price: 500, color: '#F0F0F0', isActive: true, isDefault: true }
    ]);
    console.log('✅ Default materials seeded');
  } else {
    console.log('✅ Default materials already exist, skipping');
  }

  // Seed products only if none exist
  const prodCount = await Product.countDocuments();
  if (prodCount === 0) {
    await Product.insertMany([
      {
        name: 'Faith Clipboard',
        description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — With God all things are possible. Perfect for your desk or as a meaningful gift to someone you love.',
        bibleVerse: 'Matthew 19:26',
        inspirationalSentence: 'With God, nothing is impossible — trust the journey.',
        colorDescription: 'Warm grey background with white floral outlines and peach botanicals.',
        designDescription: 'Watercolor botanical art with delicate flowers, leaves, and gold accents.',
        themeDescription: 'Faith and hope — a reminder that God makes all things possible.',
        image: 'product1.jpeg',
        isVisible: true
      },
      {
        name: 'Rejoice Clipboard',
        description: 'Elegant dark green clipboard with silver botanical art and the joyful verse — Rejoice in the Lord always. A stunning piece for any faith-filled home or office space.',
        bibleVerse: 'Philippians 4:4',
        inspirationalSentence: "Rejoice always — God's joy is your strength every single day.",
        colorDescription: 'Deep forest green with silver-toned lettering and botanical illustrations.',
        designDescription: 'Watercolor eucalyptus and leaf clusters with golden accent details.',
        themeDescription: 'Joy in the Lord — a daily reminder to rejoice in every circumstance.',
        image: 'product2.jpeg',
        isVisible: true
      },
      {
        name: 'Strength Clipboard',
        description: 'A serene light blue clipboard adorned with a delicate wildflower wreath and the empowering verse — I can do all things through Christ who strengtheneth me. Uplifting for every day.',
        bibleVerse: 'Philippians 4:13',
        inspirationalSentence: 'You are stronger than you know — Christ is your strength.',
        colorDescription: 'Soft sky blue background with multi-colored wildflower wreath in pastels.',
        designDescription: 'Botanical wildflower wreath with daisies, lavender, and meadow flowers.',
        themeDescription: 'Strength in Christ — a reminder that you can overcome anything through faith.',
        image: 'product3.jpeg',
        isVisible: true
      },
      {
        name: 'Wisdom Clipboard',
        description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture — The fear of the LORD is the beginning of knowledge. A timeless keepsake for any believer.',
        bibleVerse: 'Proverbs 1:7',
        inspirationalSentence: 'True wisdom begins when we place God first in everything.',
        colorDescription: 'Warm beige and linen background with sage green and golden botanical accents.',
        designDescription: 'Elegant leafy botanical garlands with gold-tipped branches and earthy tones.',
        themeDescription: 'Wisdom and knowledge — a beautiful reminder to seek God above all things.',
        image: 'product4.jpeg',
        isVisible: true
      }
    ]);
    console.log('✅ Products seeded');
  } else {
    console.log('✅ Products already exist, skipping');
  }

  // Seed default settings
  const aboutExists = await Settings.findOne({ key: 'about' });
  if (!aboutExists) {
    await Settings.create({
      key: 'about',
      value: `Welcome to Potters Productions — a creative brand built with purpose, faith, and passion.\n\nWe create Christian products, customized designs, posters, calendars, study pads, and meaningful handmade creations designed to inspire and encourage people every day. Every product is carefully handcrafted with love, prayer, and attention to detail because we believe even the smallest things can carry a powerful message.\n\nAt Potters Productions, our goal is not just business — it is ministry through creativity. We want every design to remind people of hope, faith, and the love of God.\n\nWhat makes us special is that we personally work on every product with our own hands, making each piece unique and close to the heart. We believe in creating products that are both meaningful and affordable.\n\nWe are also committed to giving back. 20% of our revenue is dedicated to supporting Christian missions and ministry work, helping spread the Gospel and support Kingdom-focused initiatives.\n\nThank you for supporting our vision and becoming part of this journey. Together, we are creating with purpose and serving with faith.`
    });
    console.log('✅ About Us seeded');
  }

  const contactExists = await Settings.findOne({ key: 'contact' });
  if (!contactExists) {
    await Settings.create({
      key: 'contact',
      value: {
        phone: '+91 98765 43210',
        email: 'productpotter@gmail.com',
        whatsapp: '+91 98765 43210',
        instagram: '@pottersproductions',
        address: 'Chennai, Tamil Nadu, India'
      }
    });
    console.log('✅ Contact seeded');
  }

  mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);