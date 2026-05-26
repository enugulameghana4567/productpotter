import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const hero = {
  background: 'linear-gradient(135deg,#eef4ff 0%,#dbeafe 60%,#bfdbfe 100%)',
  padding: '90px 20px 70px',
  textAlign: 'center'
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/feedback').then(r => setFeedback(r.data.slice(0, 3))).catch(() => {});
    API.get('/products').then(r => setProducts(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const verses = [
    { text: 'With God all things are possible.', ref: 'Matthew 19:26' },
    { text: 'I can do all things through Christ who strengtheneth me.', ref: 'Philippians 4:13' },
    { text: 'The fear of the LORD is the beginning of knowledge.', ref: 'Proverbs 1:7' }
  ];

  const IMG_BASE = process.env.REACT_APP_API_URL || '';

  return (
    <div>
      {/* Hero */}
      <section style={hero}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16, fontWeight: 700 }}>
            ✦ Faith · Creativity · Purpose
          </p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,6vw,64px)', color: '#0e3a8c', lineHeight: 1.2, marginBottom: 20 }}>
            Handcrafted Christian<br />
            <span style={{ color: '#1a56db' }}>Products with Heart</span>
          </h1>
          <p style={{ color: '#4b5563', fontSize: 18, lineHeight: 1.8, marginBottom: 36 }}>
            Every product carefully made with love, prayer, and purpose — to inspire and encourage you every day.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => user ? navigate('/products') : navigate('/register')}
              style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,86,219,0.3)', fontFamily: "'Lato',sans-serif" }}>
              Shop Now →
            </button>
            <button onClick={() => navigate('/about')}
              style={{ background: 'transparent', color: '#1a56db', border: '2px solid #1a56db', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Bible Verse Marquee */}
      <div style={{ background: '#1a56db', padding: '18px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 80, animation: 'scrollx 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...verses, ...verses].map((v, i) => (
            <span key={i} style={{ color: '#fff', fontSize: 14, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>
              "{v.text}" — <strong>{v.ref}</strong> &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
        <style>{`@keyframes scrollx { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
      </div>

      {/* Featured Products */}
      <section style={{ padding: '70px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Our Collection</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#0e3a8c', marginTop: 8 }}>Featured Products</h2>
        </div>
        {products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 28 }}>
            {products.map(p => (
              <div key={p._id} onClick={() => user ? navigate(`/products/${p._id}`) : navigate('/register')}
                style={{ border: '1.5px solid #dbeafe', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s,box-shadow .2s', background: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(26,86,219,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ height: 200, overflow: 'hidden', background: '#eef4ff' }}>
                  <img src={p.image?.startsWith('http') ? p.image : `${IMG_BASE}/uploads/${p.image}`}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.style.display='none'} />
                </div>
                <div style={{ padding: '16px 18px 20px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#0e3a8c', marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{p.description?.slice(0, 80)}...</p>
                  <span style={{ background: '#eef4ff', color: '#1a56db', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>View Product →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 28 }}>
            {[
              { img: '/images/product4.jpeg', name: 'Faith Clipboard — Matthew 19:26', desc: 'A beautifully crafted clipboard with floral design and inspiring Bible verse.' },
              { img: '/images/product3.jpeg', name: 'Rejoice Clipboard — Philippians 4:4', desc: 'Elegant dark green clipboard with silver lettering and botanical art.' },
              { img: '/images/product2.jpeg', name: 'Strength Clipboard — Philippians 4:13', desc: 'Light blue clipboard adorned with a delicate wildflower wreath.' },
              { img: '/images/product1.jpeg', name: 'Wisdom Clipboard — Proverbs 1:7', desc: 'Warm beige clipboard with golden botanical accents and scripture.' }
            ].map((p, i) => (
              <div key={i} onClick={() => user ? navigate('/products') : navigate('/register')}
                style={{ border: '1.5px solid #dbeafe', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s,box-shadow .2s', background: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(26,86,219,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px 18px 20px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: '#0e3a8c', marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>
                  <span style={{ background: '#eef4ff', color: '#1a56db', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>View Product →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats / Mission */}
      <section style={{ background: 'linear-gradient(135deg,#0e3a8c,#1a56db)', padding: '60px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40, textAlign: 'center' }}>
          {[['✦', '20%', 'Goes to Christian Missions'], ['🙏', 'Handmade', 'Every product crafted by hand'], ['💙', 'Faith-First', 'Ministry through creativity'], ['📦', 'Affordable', 'Meaningful & budget-friendly']].map(([icon, title, sub]) => (
            <div key={title}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: '#fff', fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{title}</div>
              <div style={{ color: '#b3d1ff', fontSize: 13 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {feedback.length > 0 && (
        <section style={{ padding: '70px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Testimonials</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#0e3a8c', marginTop: 8 }}>What Our Customers Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {feedback.map(f => (
              <div key={f._id} style={{ background: '#eef4ff', borderRadius: 16, padding: 28, border: '1.5px solid #dbeafe' }}>
                <div style={{ color: '#f59e0b', fontSize: 18, marginBottom: 12 }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 16 }}>"{f.message}"</p>
                <p style={{ color: '#1a56db', fontWeight: 700, fontSize: 14 }}>— {f.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: '#eef4ff', padding: '70px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#0e3a8c', marginBottom: 16 }}>
          Ready to Find Your Perfect Christian Gift?
        </h2>
        <p style={{ color: '#4b5563', fontSize: 16, marginBottom: 36 }}>
          Join our faith-filled community and discover products that speak to your heart.
        </p>
        <button onClick={() => user ? navigate('/products') : navigate('/register')}
          style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", boxShadow: '0 4px 20px rgba(26,86,219,0.3)' }}>
          {user ? 'Browse Products →' : 'Register & Shop →'}
        </button>
      </section>
    </div>
  );
}
