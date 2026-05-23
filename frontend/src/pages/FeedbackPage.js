import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '13px 16px', border: '1.5px solid #dbeafe', borderRadius: 10,
  fontSize: 15, fontFamily: "'Lato',sans-serif", outline: 'none', color: '#1f2937',
  background: '#f8faff', marginTop: 6, boxSizing: 'border-box'
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/feedback').then(r => setFeedbacks(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/feedback', form);
      toast.success('Thank you for your feedback! It will appear after admin approval. 🙏');
      setForm({ name: '', email: '', message: '', rating: 5 });
    } catch { toast.error('Failed to submit feedback.'); }
    setLoading(false);
  };

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', padding: '70px 20px', textAlign: 'center' }}>
        <p style={{ color: '#1a56db', fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700 }}>Community</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: '#0e3a8c', marginTop: 12 }}>Feedback</h1>
        <div style={{ width: 60, height: 3, background: '#1a56db', margin: '20px auto 0' }} />
      </section>

      <section style={{ maxWidth: 1000, margin: '60px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48 }}>
        {/* Submit feedback */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 24px rgba(26,86,219,0.08)', alignSelf: 'start' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', marginBottom: 8 }}>Share Your Experience</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Your feedback helps us serve you better and glorify God in all we do.</p>
          <form onSubmit={handleSubmit}>
            {[{ label: 'Name', field: 'name', type: 'text', ph: 'Your name' }, { label: 'Email', field: 'email', type: 'email', ph: 'your@email.com' }].map(({ label, field, type, ph }) => (
              <div key={field} style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label} *</label>
                <input style={inp} type={type} placeholder={ph} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} required />
              </div>
            ))}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Rating *</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => setForm({...form, rating: s})}
                    style={{ fontSize: 28, cursor: 'pointer', color: s <= form.rating ? '#f59e0b' : '#dbeafe', transition: 'color .2s' }}>★</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Message *</label>
              <textarea style={{...inp, height: 120, resize: 'vertical'}} placeholder="Share your experience..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting...' : 'Submit Feedback →'}
            </button>
          </form>
        </div>

        {/* Approved feedbacks */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', marginBottom: 24 }}>Community Reviews</h2>
          {feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#eef4ff', borderRadius: 16, color: '#6b7280' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {feedbacks.map(f => (
                <div key={f._id} style={{ background: '#eef4ff', borderRadius: 16, padding: '24px', border: '1.5px solid #dbeafe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 15 }}>{f.name}</div>
                      <div style={{ color: '#f59e0b', fontSize: 16, marginTop: 4 }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(f.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.8, fontStyle: 'italic' }}>"{f.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
