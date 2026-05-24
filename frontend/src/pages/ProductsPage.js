import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const IMG_BASE = process.env.REACT_APP_API_URL || '';

const FIXED_PRODUCTS = [
  {
    _id: 'default1',
    name: 'Faith Clipboard',
    bibleVerse: 'Matthew 19:26',
    description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — With God all things are possible.',
    image: '/images/product4.jpeg'
  },
  {
    _id: 'default2',
    name: 'Rejoice Clipboard',
    bibleVerse: 'Philippians 4:4',
    description: 'Elegant dark green clipboard with silver lettering and botanical art.',
    image: '/images/product3.jpeg'
  },
  {
    _id: 'default3',
    name: 'Strength Clipboard',
    bibleVerse: 'Philippians 4:13',
    description: 'Light blue clipboard adorned with a delicate wildflower wreath.',
    image: '/images/product2.jpeg'
  },
  {
    _id: 'default4',
    name: 'Wisdom Clipboard',
    bibleVerse: 'Proverbs 1:7',
    description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture.',
    image: '/images/product1.jpeg'
  }
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(r => {
        const fixedNames = FIXED_PRODUCTS.map(p => p.name.toLowerCase());
        const extras = r.data.filter(p => !fixedNames.includes(p.name.toLowerCase()));
        setDbProducts(extras);
      })
      .catch(() => setDbProducts([]));
  }, []);

  const allProducts = [...FIXED_PRODUCTS, ...dbProducts];

  const getImg = p => {
    if (!p?.image) return '';
    if (p.image.startsWith('/images/')) return p.image;
    if (p.image.startsWith('http')) return p.image;
    return `${IMG_BASE}/uploads/${p.image}`;
  };

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Our Collection</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', color: '#0e3a8c', marginTop: 12 }}>Products</h1>
        <p style={{ color: '#4b5563', fontSize: 16, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
          Each product handcrafted with love, prayer, and purpose.
        </p>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      <section style={{ maxWidth: 1100, margin: '60px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 32 }}>
          {allProducts.map(p => (
            <div key={p._id}
              style={{ border: '1.5px solid #dbeafe', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform .25s,box-shadow .25s', background: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,86,219,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 260, overflow: 'hidden', background: '#eef4ff' }}>
                <img src={getImg(p)} alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div style={{ padding: '22px 24px 28px' }}>
                <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>Christian Product</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#0e3a8c', margin: '0 0 6px 0' }}>{p.name}</h3>
                {p.bibleVerse && <p style={{ color: '#1a56db', fontSize: 12, fontStyle: 'italic', margin: '0 0 10px 0' }}>— {p.bibleVerse}</p>}
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7, margin: '0 0 20px 0' }}>{p.description?.slice(0, 80)}...</p>
                <button onClick={() => navigate(`/products/${p._id}`)}
                  style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", width: '100%' }}>
                  View Product →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}