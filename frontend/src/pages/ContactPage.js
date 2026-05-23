import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '14px 16px', border: '1.5px solid #dbeafe', borderRadius: 10,
  fontSize: 15, fontFamily: "'Lato',sans-serif", outline: 'none', color: '#1f2937',
  background: '#f8faff', marginTop: 6, boxSizing: 'border-box'
};

export default function ContactPage() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/settings/contact').then(r => setInfo(r.data?.value)).catch(() => {});
  }, []);

  // Auto-fill name and email when user is logged in
  useEffect(() => {
    if (user && !user.isAdmin) {
      setForm(f => ({
        ...f,
        name: f.name || user.fullName || '',
        email: f.email || user.email || ''
      }));
    }
  }, [user]);

  const defaultInfo = {
    phone: '',
    email: 'productpotter@gmail.com',
    whatsapp: '',
    instagram: '',
    address: ''
  };
  const ci = info || defaultInfo;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent successfully! We will get back to you soon. 🙏');
      setForm(f => ({ ...f, message: '' }));
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  const contactItems = [
    { icon: '📧', label: 'EMAIL', value: ci.email },
    { icon: '📱', label: 'PHONE', value: ci.phone },
    { icon: '💬', label: 'WHATSAPP', value: ci.whatsapp },
    { icon: '📸', label: 'INSTAGRAM', value: ci.instagram },
    { icon: '📍', label: 'ADDRESS', value: ci.address }
  ].filter(item => item.value);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Get In Touch</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', color: '#0e3a8c', marginTop: 12 }}>Contact Us</h1>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      <section style={{ maxWidth: 1000, margin: '60px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40 }}>
        {/* Contact Info */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', marginBottom: 28, marginTop: 0 }}>Reach Us</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {contactItems.map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: '#eef4ff', borderRadius: 12, border: '1.5px solid #dbeafe', alignItems: 'center' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ color: '#1f2937', fontSize: 15 }}>{value}</div>
                </div>
              </div>
            ))}
            {contactItems.length === 0 && (
              <div style={{ padding: '20px', background: '#eef4ff', borderRadius: 12, color: '#6b7280', fontSize: 14 }}>
                Contact details will appear here once added by admin.
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 24px rgba(26,86,219,0.08)' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', marginBottom: 6, marginTop: 0 }}>Send a Message</h2>
          {user && !user.isAdmin && (
            <p style={{ fontSize: 13, color: '#10b981', marginBottom: 20, fontWeight: 700 }}>
              ✅ Your details are auto-filled
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Your Name *</label>
              <input style={inp} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required placeholder="Your full name" />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address *</label>
              <input style={{
                ...inp,
                background: user && !user.isAdmin ? '#f0f4ff' : '#f8faff',
                color: user && !user.isAdmin ? '#1a56db' : '#1f2937'
              }}
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="your@email.com"
                readOnly={!!(user && !user.isAdmin)}
              />
              {user && !user.isAdmin && (
                <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>Sending from: {form.email} → productpotter@gmail.com</p>
              )}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Message *</label>
              <textarea style={{ ...inp, height: 130, resize: 'vertical' }}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required placeholder="Write your message here..." />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif" }}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}