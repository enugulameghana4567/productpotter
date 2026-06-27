import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '13px 16px', border: '1.5px solid #dbeafe', borderRadius: 10,
  fontSize: 15, fontFamily: "'Lato',sans-serif", outline: 'none', color: '#1f2937',
  background: '#f8faff', marginTop: 6, boxSizing: 'border-box'
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || '/products';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login/customer', { email });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.fullName?.split(' ')[0] || 'friend'}! 🙏`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your email or register.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '44px 40px', maxWidth: 440, width: '100%', border: '1.5px solid #dbeafe', boxShadow: '0 8px 48px rgba(26,86,219,0.10)', textAlign: 'center' }}>
        <div style={{ fontSize: 26, color: '#0e3a8c', marginBottom: 10 }}>✦</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', margin: 0 }}>Welcome Back</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, marginBottom: 28 }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 22, textAlign: 'left' }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address *</label>
            <input style={inp} type="email" placeholder="Enter your registered email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif" }}>
            {loading ? 'Signing in...' : 'Login →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          New here?{' '}
          <Link to="/register" state={{ from: redirectTo }} style={{ color: '#1a56db', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
