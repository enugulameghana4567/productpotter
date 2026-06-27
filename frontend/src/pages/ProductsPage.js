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
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        /* Main Fixed Area Definition */
        .pp-fixed-showcase-box {
          width: 100%;
          height: 30vh; /* Locked to exactly 30% viewport height */
          overflow: hidden;
          position: relative;
          background: #f8fafc;
          box-sizing: border-box;
        }

        /* Fast 12-Second Infinite Multi-Stage Slider Track */
        .pp-sliding-track {
          display: flex;
          width: 200%;
          height: 100%;
          animation: pp-infinite-loop-slide 12s cubic-bezier(0.85, 0, 0.15, 1) infinite;
        }

        /* Fast Timed Keyframes: ~5s reading pause per slide, 1s quick transition transition */
        @keyframes pp-infinite-loop-slide {
          0%, 42% { transform: translateX(0%); }      /* Holds Slide 1 still for ~5 seconds */
          50%, 92% { transform: translateX(-50%); }  /* Slides over and holds Slide 2 still for ~5 seconds */
          100% { transform: translateX(0%); }        /* Slides seamlessly back to the beginning */
        }

        /* Slide Items Generic Styles */
        .pp-slide-pane {
          width: 50%;
          height: 100%;
          flex: 0 0 50%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        /* Slide One: The Hero Text Panel */
        .pp-pane-hero {
          background: linear-gradient(135deg, #eef4ff, #dbeafe);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          text-align: center;
        }
        .pp-hero-label {
          color: #1a56db;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 700;
          margin: 0;
        }
        .pp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 4vw, 38px);
          color: #0e3a8c;
          margin: 6px 0;
        }
        .pp-hero-subtitle {
          color: #4b5563;
          font-size: 14px;
          margin: 0;
        }
        .pp-hero-divider {
          width: 50px;
          height: 3px;
          background: #1a56db;
          margin-top: 12px;
        }

        /* Slide Two: The Revenue Display Panel */
        .pp-pane-revenue {
          display: flex;
          align-items: stretch;
          background: linear-gradient(135deg, #0e3a8c, #1a56db);
          color: #fff;
        }
        .pp-revenue-img {
          flex: 0 0 35%;
          height: 100%;
          position: relative;
        }
        .pp-revenue-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pp-revenue-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 40px 0 80px;
        }
        .pp-revenue-lbl {
          font-size: 11px;
          letter-spacing: 2px;
          color: #b3d1ff;
          font-weight: 700;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .pp-revenue-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 3vw, 28px);
          margin: 0 0 8px 0;
        }
        .pp-revenue-text p {
          font-size: 14px;
          line-height: 1.6;
          color: #dbeafe;
          margin: 0;
          max-width: 480px;
        }
        .pp-revenue-circle {
          position: absolute;
          left: 35%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #fff;
          color: #0e3a8c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #eef4ff;
          box-shadow: 0 8px 25px rgba(0,0,0,.15);
          z-index: 10;
        }
        .pp-revenue-circle span {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }
        .pp-revenue-circle small {
          font-size: 10px;
          color: #1a56db;
          font-weight: 700;
          margin-top: 2px;
        }

        /* Clean Products Grid Styling */
        .pp-grid-section {
          max-width: 1100px;
          margin: 50px auto 80px;
          padding: 0 20px;
        }
        .pp-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 32px;
        }
        .pp-product-card {
          border: 1.5px solid #dbeafe;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          background: #fff;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .pp-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(26,86,219,0.14);
        }
        .pp-card-img-wrap {
          height: 240px;
          overflow: hidden;
          background: #eef4ff;
        }
        .pp-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .3s ease;
        }
        .pp-product-card:hover .pp-card-img-wrap img {
          transform: scale(1.05);
        }
        .pp-card-body {
          padding: 20px;
        }
        .pp-card-tag {
          font-size: 11px;
          color: #1a56db;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .pp-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #0e3a8c;
          margin: 0 0 6px 0;
        }
        .pp-card-verse {
          color: #1a56db;
          font-size: 12px;
          font-style: italic;
          margin: 0 0 10px 0;
        }
        .pp-card-desc {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }
        .pp-card-btn {
          background: #1a56db;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 11px 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          width: 100%;
          transition: background-color 0.2s ease;
        }
        .pp-card-btn:hover {
          background: #0e3a8c;
        }

        /* Mobile Breakpoints */
        @media(max-width: 768px) {
          .pp-fixed-showcase-box { height: 35vh; } /* Extra container breathing room for layout scaling */
          .pp-revenue-img { flex: 0 0 40%; }
          .pp-revenue-text { padding: 0 20px 0 50px; }
          .pp-revenue-circle { width: 70px; height: 70px; left: 40%; }
          .pp-revenue-circle span { font-size: 18px; }
          .pp-revenue-circle small { font-size: 8px; }
        }
      `}</style>

      {/* 100% Width & 30% Height Fixed Structural Container */}
      <div className="pp-fixed-showcase-box">
        <div className="pp-sliding-track">
          
          {/* Slide 1: Collections Text View */}
          <div className="pp-slide-pane pp-pane-hero">
            <p className="pp-hero-label">Our Collection</p>
            <h1 className="pp-hero-title">Products</h1>
            <p className="pp-hero-subtitle">
              Each product handcrafted with love, prayer, and purpose.
            </p>
            <div className="pp-hero-divider" />
          </div>

          {/* Slide 2: Mission Banner (Product 5 with 20% Graphic Badge) */}
          <div className="pp-slide-pane pp-pane-revenue">
            <div className="pp-revenue-img">
              <img src="/images/product5.png" alt="Mission support product" />
            </div>
            <div className="pp-revenue-text">
              <p className="pp-revenue-lbl">✦ Giving Back</p>
              <h3>Creating with Purpose</h3>
              <p>
                20% of our revenue is dedicated to supporting Christian missions —
                helping spread the Gospel and serve communities in need.
              </p>
            </div>
            <div className="pp-revenue-circle">
              <span>20%</span>
              <small>To Missions</small>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Shelf Section */}
      <section className="pp-grid-section">
        <div className="pp-products-grid">
          {allProducts.map(p => (
            <div 
              key={p._id}
              className="pp-product-card"
              onClick={() => navigate(`/products/${p._id}`)}
            >
              <div className="pp-card-img-wrap">
                <img src={getImgSrc(p)} alt={p.name} onError={e => { e.target.style.visibility = 'hidden'; }} />
              </div>
              <div className="pp-card-body">
                <div className="pp-card-tag">Christian Product</div>
                <h3 className="pp-card-title">{p.name}</h3>
                {p.bibleVerse && <p className="pp-card-verse">— {p.bibleVerse}</p>}
                <p className="pp-card-desc">
                  {p.description && p.description.length > 80 ? `${p.description.slice(0, 80)}...` : p.description}
                </p>
                <button className="pp-card-btn">View Product →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
