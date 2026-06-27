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

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', location: '',
    country: 'India', gender: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [hasTriedAutoDetect, setHasTriedAutoDetect] = useState(false);

  const redirectTo = location.state?.from || '/products';

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const detectLocation = () => {
    if (hasTriedAutoDetect) return;
    if (form.location.trim()) return;
    if (!navigator.geolocation) return;

    setHasTriedAutoDetect(true);
    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          const road = addr.road || addr.pedestrian || addr.neighbourhood || '';
          const suburb = addr.suburb || addr.locality || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || '';
          const district = addr.state_district || addr.county || '';
          const state = addr.state || '';
          const pincode = addr.postcode || '';

          const parts = [road, suburb, city, district, state, pincode].filter(Boolean);
          const detected = parts.join(', ');

          if (detected) {
            set('location', detected);
            toast.success('Location detected! Edit if needed.');
          }
        } catch (err) {}
        setDetectingLocation(false);
      },
      () => { setDetectingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match!');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.token, data.user);
      toast.success('Welcome to Potters Productions! 🙏');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg,#eef4ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 40px', maxWidth: 520, width: '100%', border: '1.5px solid #dbeafe', boxShadow: '0 8px 48px rgba(26,86,219,0.10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.jpeg" alt="logo" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0e3a8c', margin: 0 }}>Create Account</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Join our faith-filled community</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'Your full name' },
            { label: 'Email Address', field: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' }
          ].map(({ label, field, type, placeholder }) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label} *</label>
              <input style={inp} type={type} placeholder={placeholder} value={form[field]} onChange={e => set(field, e.target.value)} required />
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Location / City *</label>
            </div>
            <input style={inp} type="text" placeholder={detectingLocation ? 'Detecting your location...' : 'City, State'} value={form.location} onFocus={detectLocation} onChange={e => set('location', e.target.value)} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Country *</label>
            <select style={inp} value={form.country} onChange={e => set('country', e.target.value)} required>
              <option>India</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option><option>Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Gender *</label>
            <select style={inp} value={form.gender} onChange={e => set('gender', e.target.value)} required>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Password *</label>
            <input style={inp} type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Confirm Password *</label>
            <input style={inp} type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif" }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" state={{ from: redirectTo }} style={{ color: '#1a56db', fontWeight: 700 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
