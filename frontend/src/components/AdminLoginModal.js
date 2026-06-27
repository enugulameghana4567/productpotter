import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #dbeafe', borderRadius: 10,
  fontSize: 14, fontFamily: "'Lato',sans-serif", outline: 'none', color: '#1f2937',
  background: '#f8faff', marginTop: 6, boxSizing: 'border-box'
};

export default function AdminLoginModal({ onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login/admin', { email, password });
      login(data.token, data.user);
      toast.success('Welcome back, Admin! ✦');
      onClose();
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(14,58,140,0.55)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div
        style={{ background: '#fff', borderRadius: 20, padding: 36, maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}>
        <img src="/logo.jpeg" alt="logo" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', margin: '0 0 4px 0' }}>Admin Login</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Sign in to manage Potters Productions</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14, textAlign: 'left' }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Admin Email</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@email.com" />
          </div>
          <div style={{ marginBottom: 20, textAlign: 'left' }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", marginBottom: 10 }}>
            {loading ? 'Signing in...' : 'Login →'}
          </button>
          <button type="button" onClick={onClose}
            style={{ width: '100%', background: 'none', color: '#6b7280', border: 'none', padding: '6px', fontSize: 13, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
