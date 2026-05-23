import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '14px 16px', border: '1.5px solid #dbeafe', borderRadius: 10,
  fontSize: 15, fontFamily: "'Lato',sans-serif", outline: 'none', color: '#1f2937',
  background: '#f8faff', marginTop: 6, boxSizing: 'border-box'
};

export default function ContactPage() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/settings/contact').then(r => setInfo(r.data?.value)).catch(() => {});
  }, []);

  const defaultInfo = {
    phone: '+91 XXXXX XXXXX',
    email: 'productpotter@gmail.com',
    whatsapp: '+91 XXXXX XXXXX',
    instagram: '@pottersproductions',
    address: 'India'
  };
  const ci = info || defaultInfo;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent! We will get back to you soon. 🙏');
      setForm({ name: '', email: '', message: '' });
    } catch { toast.error('Failed to send message. Please try again.'); }
    setLoading(false);
  };

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Get In Touch</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: '#0e3a8c', marginTop: 12 }}>Contact Us</h1>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      <section style={{ maxWidth: 1000, margin: '70px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40 }}>
        {/* Info */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', marginBottom: 30 }}>Reach Us</h2>
          {[
            ['📧', 'Email', ci.email],
            ['📱', 'Phone', ci.phone],
            ['💬', 'WhatsApp', ci.whatsapp],
            ['📸', 'Instagram', ci.instagram],
            ['📍', 'Address', ci.address]
          ].map(([icon, label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '18px 20px', background: '#eef4ff', borderRadius: 12, border: '1.5px solid #dbeafe' }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 12, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{label}</div>
                <div style={{ color: '#1f2937', fontSize: 15, marginTop: 2 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 24px rgba(26,86,219,0.08)' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', marginBottom: 28 }}>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Your Name *</label>
              <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your full name" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address *</label>
              <input style={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="your@email.com" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Message *</label>
              <textarea style={{...inp, height: 130, resize: 'vertical'}} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Write your message here..." />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
