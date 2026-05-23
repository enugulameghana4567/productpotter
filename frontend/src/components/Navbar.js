import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/products', label: 'Products' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/contact', label: 'Contact Us' }
  ];

  const linkStyle = {
    fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700,
    color: '#1f2937', textTransform: 'uppercase', letterSpacing: 1,
    transition: 'color .2s', textDecoration: 'none'
  };

  const btnStyle = {
    background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8,
    padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Lato',sans-serif"
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '2px solid #dbeafe', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 16px rgba(26,86,219,0.08)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1a56db', letterSpacing: 1 }}>
            ✦ Potters Productions
            <span style={{ fontSize: 10, color: '#6b7280', display: 'block', fontWeight: 400, letterSpacing: 2, fontFamily: "'Lato',sans-serif" }}>Crafted with Faith</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}
          className="navbar-links">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={linkStyle}
                onMouseEnter={e => e.target.style.color = '#1a56db'}
                onMouseLeave={e => e.target.style.color = '#1f2937'}
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {!user ? (
            <>
              <li><Link to="/register" style={linkStyle} onMouseEnter={e => e.target.style.color = '#1a56db'} onMouseLeave={e => e.target.style.color = '#1f2937'}>Register</Link></li>
              <li><button style={btnStyle} onClick={() => navigate('/login')}>Login</button></li>
            </>
          ) : user.isAdmin ? (
            <>
              <li><Link to="/admin" style={{ ...linkStyle, color: '#1a56db' }}>Dashboard</Link></li>
              <li><button style={{ ...btnStyle, background: '#e53e3e' }} onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li style={{ fontSize: 13, color: '#1a56db', fontWeight: 700 }}>Hi, {user.fullName?.split(' ')[0]}</li>
              <li><button style={{ ...btnStyle, background: '#e53e3e' }} onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}
          className="navbar-mobile-menu">
          <div style={{ width: 24, height: 2, background: menuOpen ? '#1a56db' : '#1f2937', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: '#1f2937', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity .2s' }} />
          <div style={{ width: 24, height: 2, background: menuOpen ? '#1a56db' : '#1f2937', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1.5px solid #dbeafe', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              style={{ padding: '12px 16px', color: '#1f2937', fontFamily: "'Lato',sans-serif", fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: 'none', display: 'block' }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => e.currentTarget.style.background = '#eef4ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: '1.5px solid #dbeafe', marginTop: 8, paddingTop: 12 }}>
            {!user ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1.5px solid #1a56db', borderRadius: 8, color: '#1a56db', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Register</Link>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#1a56db', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Login</Link>
              </div>
            ) : user.isAdmin ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#1a56db', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={handleLogout} style={{ flex: 1, padding: '10px', background: '#e53e3e', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, border: 'none' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#1a56db', fontWeight: 700, fontSize: 14 }}>Hi, {user.fullName?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#e53e3e', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, border: 'none' }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}