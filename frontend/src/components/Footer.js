import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg,#0e3a8c,#1a56db)', color: '#fff', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '50px 20px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 12 }}>✦ Potters Productions</h3>
          <p style={{ color: '#b3d1ff', fontSize: 14, lineHeight: 1.8 }}>
            Creating with purpose, serving with faith. Every product handcrafted with love and prayer.
          </p>
          <p style={{ color: '#b3d1ff', fontSize: 12, marginTop: 12, fontStyle: 'italic' }}>
            20% of revenue supports Christian missions.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, color: '#b3d1ff' }}>Quick Links</h4>
          {[['/', 'Home'], ['/about', 'About Us'], ['/products', 'Products'], ['/feedback', 'Feedback'], ['/contact', 'Contact']].map(([to, label]) => (
            <div key={to} style={{ marginBottom: 8 }}>
              <Link to={to} style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color='#b3d1ff'}
                onMouseLeave={e => e.target.style.color='#fff'}>
                {label}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, color: '#b3d1ff' }}>Contact</h4>
          <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>📧 productpotter@gmail.com</p>
          <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>📱 WhatsApp Available</p>
          <p style={{ color: '#fff', fontSize: 14 }}>📍 India</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, color: '#b3d1ff' }}>Verse of the Day</h4>
          <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.9, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
            "I can do all things through Christ who strengtheneth me."
          </p>
          <p style={{ color: '#b3d1ff', fontSize: 13, marginTop: 8 }}>— Philippians 4:13</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '20px', textAlign: 'center', color: '#b3d1ff', fontSize: 13 }}>
        © {new Date().getFullYear()} Potters Productions. All rights reserved. | Ministry through Creativity.
      </div>
    </footer>
  );
}
