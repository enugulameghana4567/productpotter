import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '2px solid #dbeafe',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 16px rgba(26,86,219,0.08)'
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#1a56db',
    letterSpacing: 1
  },
  logoSub: { fontSize: 11, color: '#6b7280', display: 'block', fontWeight: 400, letterSpacing: 2 },
  links: { display: 'flex', alignItems: 'center', gap: 28, listStyle: 'none' },
  link: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: 1,
    transition: 'color .2s',
    textDecoration: 'none'
  },
  btn: {
    background: '#1a56db',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    letterSpacing: 1
  },
  hamburger: { display: 'none', flexDirection: 'column', gap: 5, cursor: 'pointer', background: 'none', border: 'none', padding: 4 },
  bar: { width: 24, height: 2, background: '#1a56db', borderRadius: 2 }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/products', label: 'Products' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/contact', label: 'Contact Us' }
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.logo}>
            ✦ Potters Productions
            <span style={styles.logoSub}>Crafted with Faith</span>
          </div>
        </Link>

        {/* Desktop */}
        <ul style={styles.links}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={styles.link} onMouseEnter={e => e.target.style.color='#1a56db'} onMouseLeave={e => e.target.style.color='#1f2937'}>
                {l.label}
              </Link>
            </li>
          ))}
          {!user ? (
            <>
              <li><Link to="/register" style={styles.link} onMouseEnter={e=>e.target.style.color='#1a56db'} onMouseLeave={e=>e.target.style.color='#1f2937'}>Register</Link></li>
              <li><button style={styles.btn} onClick={() => navigate('/login')}>Login</button></li>
            </>
          ) : user.isAdmin ? (
            <>
              <li><Link to="/admin" style={styles.link} onMouseEnter={e=>e.target.style.color='#1a56db'} onMouseLeave={e=>e.target.style.color='#1f2937'}>Dashboard</Link></li>
              <li><button style={{...styles.btn, background:'#e53e3e'}} onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li style={{fontSize:13,color:'#1a56db',fontWeight:700}}>Hi, {user.fullName?.split(' ')[0]}</li>
              <li><button style={{...styles.btn, background:'#e53e3e'}} onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
