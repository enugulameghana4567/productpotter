import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { login } = useAuth();
  const [loginType, setLoginType] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
    if (loginType === 'admin' && !password) return toast.error('Please enter admin password.');
    setLoading(true);
    try {
      let data;
      if (loginType === 'admin') {
        const res = await API.post('/auth/login/admin', { email, password });
        data = res.data;
      } else {
        const res = await API.post('/auth/login/customer', { email });
        data = res.data;
      }
      login(data.token, data.user);
      toast.success(`Welcome${data.user.isAdmin ? ', Admin' : ', ' + data.user.fullName?.split(' ')[0]}! 🙏`);
      navigate(data.user.isAdmin ? '/admin' : '/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '50px 48px', maxWidth: 440, width: '100%', border: '1.5px solid #dbeafe', boxShadow: '0 8px 48px rgba(26,86,219,0.10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✦</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: '#0e3a8c' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#eef4ff', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {['customer', 'admin'].map(type => (
            <button key={type} onClick={() => { setLoginType(type); setEmail(''); setPassword(''); }}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontWeight: 700, fontSize: 14, transition: 'all .2s', background: loginType === type ? '#1a56db' : 'transparent', color: loginType === type ? '#fff' : '#6b7280' }}>
              {type === 'customer' ? '👤 Customer' : '🔐 Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: loginType === 'admin' ? 20 : 28 }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Email Address *
            </label>
            <input style={inp} type="email"
              placeholder={loginType === 'admin' ? 'productpotter@gmail.com' : 'Enter your registered email'}
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {loginType === 'admin' && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Password *
              </label>
              <input style={inp} type="password" placeholder="Enter admin password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : loginType === 'admin' ? 'Admin Login →' : 'Login →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#1a56db', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}