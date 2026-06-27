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
        /* Custom Font imports placeholder - ensure these are available in your index.html/App.css */
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        /* Clean Animations & Elements styling */
        .pp-products-container {
          font-family: 'Lato', sans-serif;
          background-color: #f8fafc;
          padding-bottom: 80px;
        }

        /* Hero Header Section */
        .pp-hero-section {
          background: linear-gradient(135deg, #eef4ff, #dbeafe);
          padding: 70px 20px;
          text-align: center;
        }
        .pp-hero-label {
          color: #1a56db;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 700;
          margin: 0;
        }
        .pp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 48px);
          color: #0e3a8c;
          margin-top: 12px;
          margin-bottom: 0;
        }
        .pp-hero-subtitle {
          color: #4b5563;
          font-size: 16px;
          margin-top: 16px;
          margin-bottom: 0;
        }
        .pp-hero-divider {
          width: 60px;
          height: 3px;
          background: #1a56db;
          margin: 20px auto 0;
        }

        /* Revenue / Giving Back Banner */
        .pp-revenue-container {
          max-width: 1100px;
          margin: 50px auto 0;
          padding: 0 20px;
          box-sizing: border-box;
        }
        .pp-revenue-banner {
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(135deg, #0e3a8c, #1a56db);
          box-shadow: 0 12px 40px rgba(14, 58, 140, 0.25);
          min-height: 320px;
        }
        .pp-revenue-img {
          flex: 0 0 36%;
          position: relative;
          z-index: 1;
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
          padding: 45px 50px 45px 120px;
          color: #fff;
        }
        .pp-revenue-label {
          font-size: 12px;
          letter-spacing: 3px;
          color: #b3d1ff;
          font-weight: 700;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .pp-revenue-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          margin: 0 0 16px;
        }
        .pp-revenue-text p {
          font-size: 16px;
          line-height: 1.8;
          color: #dbeafe;
          max-width: 520px;
          margin: 0;
        }
        .pp-revenue-circle {
          position: absolute;
          left: 36%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #fff;
          color: #0e3a8c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 5px solid #eef4ff;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
          z-index: 20;
        }
        .pp-revenue-circle span {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          line-height: 1;
        }
        .pp-revenue-circle small {
          font-size: 12px;
          color: #1a56db;
          font-weight: 700;
          margin-top: 6px;
        }

        /* Products Grid UI elements */
        .pp-grid-section {
          max-width: 1100px;
          margin: 60px auto 0;
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
          transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow .25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pp-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(26, 86, 219, 0.14);
        }
        .pp-card-img-wrap {
          height: 260px;
          overflow: hidden;
          background: #eef4ff;
          position: relative;
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
          padding: 22px 24px 28px;
        }
        .pp-card-tag {
          font-size: 11px;
          color: #1a56db;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          margin-bottom: 8px;
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
          line-height: 1.7;
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

        /* Mobile Breakpoints responsive adaptations */
        @media(max-width: 768px) {
          .pp-revenue-banner {
            flex-direction: column;
            min-height: auto;
          }
          .pp-revenue-img {
            flex: none;
            height: 260px;
          }
          .pp-revenue-text {
            padding: 80px 24px 35px;
            text-align: center;
            align-items: center;
          }
          .pp-revenue-text p {
            max-width: 100%;
          }
          .pp-revenue-circle {
            left: 50%;
            top: 260px;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
          }
          .pp-revenue-circle span {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="pp-products-container">
        {/* Header Title Hero Display Section */}
        <section className="pp-hero-section">
          <p className="pp-hero-label">Our Collection</p>
          <h1 className="pp-hero-title">Products</h1>
          <p className="pp-hero-subtitle">
            Each product handcrafted with love, prayer, and purpose.
          </p>
          <div className="pp-hero-divider" />
        </section>

        {/* Dynamic Support/Giving Back Banner Showcase Section */}
        <section className="pp-revenue-container">
          <div className="pp-revenue-banner">
            <div className="pp-revenue-img">
              <img src="/images/product5.png" alt="Mission support product" />
            </div>
            <div className="pp-revenue-text">
              <p className="pp-revenue-label">✦ Giving Back</p>
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
        </section>

        {/* Dynamic Products Grid Section */}
        <section className="pp-grid-section">
          <div className="pp-products-grid">
            {allProducts.map(p => (
              <div 
                key={p._id}
                className="pp-product-card"
                onClick={() => navigate(`/products/${p._id}`)}
              >
                <div className="pp-card-img-wrap">
                  <img
                    src={getImgSrc(p)}
                    alt={p.name}
                    onError={e => { e.target.style.visibility = 'hidden'; }}
                  />
                </div>
                <div className="pp-card-body">
                  <div className="pp-card-tag">Christian Product</div>
                  <h3 className="pp-card-title">{p.name}</h3>
                  {p.bibleVerse && <p className="pp-card-verse">— {p.bibleVerse}</p>}
                  <p className="pp-card-desc">
                    {p.description && p.description.length > 80 
                      ? `${p.description.slice(0, 80)}...` 
                      : p.description}
                  </p>
                  <button className="pp-card-btn">
                    View Product →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
