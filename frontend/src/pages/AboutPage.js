import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AboutPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    API.get('/settings/about').then(r => setContent(r.data?.value)).catch(() => {});
  }, []);

  const defaultText = `Welcome to Potters Productions — a creative brand built with purpose, faith, and passion.

We create Christian products, customized designs, posters, calendars, study pads, and meaningful handmade creations designed to inspire and encourage people every day. Every product is carefully handcrafted with love, prayer, and attention to detail because we believe even the smallest things can carry a powerful message.

At Potters Productions, our goal is not just business — it is ministry through creativity. We want every design to remind people of hope, faith, and the love of God.

What makes us special is that we personally work on every product with our own hands, making each piece unique and close to the heart. We believe in creating products that are both meaningful and affordable.

We are also committed to giving back. 20% of our revenue is dedicated to supporting Christian missions and ministry work, helping spread the Gospel and support Kingdom-focused initiatives.

Thank you for supporting our vision and becoming part of this journey. Together, we are creating with purpose and serving with faith.`;

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Our Story</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: '#0e3a8c', marginTop: 12 }}>About Us</h1>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      <section style={{ maxWidth: 800, margin: '70px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '50px 60px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 40px rgba(26,86,219,0.06)' }}>
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 30, color: '#1a56db' }}>✦</div>
          {(content || defaultText).split('\n\n').map((para, i) => (
            <p key={i} style={{ color: '#374151', fontSize: 16, lineHeight: 1.9, marginBottom: 24, fontFamily: i === 0 ? "'Playfair Display',serif" : "'Lato',sans-serif", fontWeight: i === 0 ? 400 : 400 }}>
              {para}
            </p>
          ))}
          <blockquote style={{ borderLeft: '4px solid #1a56db', paddingLeft: 24, margin: '30px 0', color: '#1a56db', fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: 'italic' }}>
            "With God all things are possible." — Matthew 19:26
          </blockquote>
        </div>

        {/* Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginTop: 40 }}>
          {[
            { icon: '🙏', title: 'Faith-Centered', desc: 'Every design rooted in scripture and prayer' },
            { icon: '💙', title: 'Handcrafted', desc: 'Personal attention on every single product' },
            { icon: '🌱', title: 'Ministry First', desc: '20% revenue to Christian missions' },
            { icon: '💫', title: 'Affordable', desc: 'Quality products within everyone\'s reach' }
          ].map(v => (
            <div key={v.title} style={{ background: '#eef4ff', borderRadius: 16, padding: '28px 20px', textAlign: 'center', border: '1.5px solid #dbeafe' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', fontSize: 18, marginBottom: 8 }}>{v.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
