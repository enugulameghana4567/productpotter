import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const IMG_BASE = process.env.REACT_APP_API_URL || '';

const FIXED_PRODUCTS = [
  { _id: 'default1', name: 'Faith Clipboard', bibleVerse: 'Matthew 19:26', description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — With God all things are possible.', image: '/images/product4.jpeg', imageData: '' },
  { _id: 'default2', name: 'Rejoice Clipboard', bibleVerse: 'Philippians 4:4', description: 'Elegant dark green clipboard with silver lettering and botanical art.', image: '/images/product3.jpeg', imageData: '' },
  { _id: 'default3', name: 'Strength Clipboard', bibleVerse: 'Philippians 4:13', description: 'Light blue clipboard adorned with a delicate wildflower wreath.', image: '/images/product2.jpeg', imageData: '' },
  { _id: 'default4', name: 'Wisdom Clipboard', bibleVerse: 'Proverbs 1:7', description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture.', image: '/images/product1.jpeg', imageData: '' }
];

const getImgSrc = (p) => {
  if (p?.imageData && p.imageData.startsWith('data:')) return p.imageData;
  if (!p?.image) return '';
  if (p.image.startsWith('/images/') || p.image.startsWith('http')) return p.image;
  return `${IMG_BASE}/uploads/${p.image}`;
};

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

  return (
    <div>
      <style>{`
        @keyframes pp-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .pp-marquee-wrap { overflow: hidden; background: #0e3a8c; padding: 12px 0; }
        .pp-marquee-track { display: flex; width: max-content; animation: pp-marquee-scroll 22s linear infinite; }
        .pp-marquee-track span { white-space: nowrap; color: #fff; font-family: 'Lato',sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; padding-right: 40px; }

        .pp-revenue-banner {
          display: flex; align-items: stretch; border-radius: 24px; overflow: hidden;
          background: linear-gradient(135deg,#0e3a8c,#1a56db); box-shadow: 0 12px 40px rgba(14,58,140,0.25);
          position: relative; min-height: 220px;
        }
        .pp-revenue-img { flex: 0 0 38%; }
        .pp-revenue-img img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 220px; }
        .pp-revenue-text { flex: 1; padding: 36px 110px 36px 36px; display: flex; flex-direction: column; justify-content: center; color: #fff; }
        .pp-revenue-label { font-size: 12px; letter-spacing: 3px; color: #b3d1ff; font-weight: 700; margin: 0 0 10px; text-transform: uppercase; }
        .pp-revenue-text h3 { font-family: 'Playfair Display',serif; font-size: 26px; margin: 0 0 12px; }
        .pp-revenue-text p { font-size: 14px; line-height: 1.7; color: #dbeafe; margin: 0; max-width: 420px; }
        .pp-revenue-circle {
          position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
          width: 110px; height: 110px; border-radius: 50%; background: #fff; color: #0e3a8c;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          box-shadow: 0 8px 28px rgba(0,0,0,0.18); border: 4px solid #eef4ff;
        }
        .pp-revenue-circle span { font-family: 'Playfair Display',serif; font-size: 26px; font-weight: 700; line-height: 1; }
        .pp-revenue-circle small { font-size: 10px; color: #1a56db; font-weight: 700; margin-top: 2px; }
        @media (max-width: 768px) {
          .pp-revenue-banner { flex-direction: column; min-height: auto; }
          .pp-revenue-img { flex: none; height: 160px; }
          .pp-revenue-text { padding: 28px 24px 70px 24px; }
          .pp-revenue-circle { right: 24px; bottom: -10px; top: auto; transform: none; width: 90px; height: 90px; }
        }
      `}</style>

      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Our Collection</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', color: '#0e3a8c', marginTop: 12 }}>Products</h1>
        <p style={{ color: '#4b5563', fontSize: 16, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
          Each product handcrafted with love, prayer, and purpose.
        </p>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      {/* Scrolling marquee */}
      <div className="pp-marquee-wrap">
        <div className="pp-marquee-track">
          <span>✦ Handcrafted with Love &nbsp;•&nbsp; Faith-Inspired Designs &nbsp;•&nbsp; 20% of Revenue Supports Christian Missions &nbsp;•&nbsp; Made Across India &nbsp;•&nbsp;</span>
          <span>✦ Handcrafted with Love &nbsp;•&nbsp; Faith-Inspired Designs &nbsp;•&nbsp; 20% of Revenue Supports Christian Missions &nbsp;•&nbsp; Made Across India &nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* Giving Back banner */}
      <section style={{ maxWidth: 1100, margin: '50px auto', padding: '0 20px' }}>
        <div className="pp-revenue-banner">
          <div className="pp-revenue-img">
            <img src="/images/product5.png" alt="Handcrafted clipboard" />
          </div>
          <div className="pp-revenue-text">
            <p className="pp-revenue-label">✦ Giving Back</p>
            <h3>Creating with Purpose</h3>
            <p>20% of our revenue is dedicated to supporting Christian missions — helping spread the Gospel and serve communities in need.</p>
          </div>
          <div className="pp-revenue-circle">
            <span>20%</span>
            <small>To Missions</small>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '60px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 32 }}>
          {allProducts.map(p => (
            <div key={p._id}
              style={{ border: '1.5px solid #dbeafe', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform .25s,box-shadow .25s', background: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,86,219,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 260, overflow: 'hidden', background: '#eef4ff' }}>
                <img
                  src={getImgSrc(p)}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.style.display = 'none'; }}
                />
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
