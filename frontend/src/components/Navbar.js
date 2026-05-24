import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      <nav style={{ background: '#fff', borderBottom: '2px solid #dbeafe', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 16px rgba(26,86,219,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {!logoError ? (
              <img
                src="/logo.jpeg"
                alt="Potters Productions"
                style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #dbeafe' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display',serif" }}>P</div>
            )}
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1a56db', letterSpacing: 1, lineHeight: 1.2 }}>
                Potters Productions
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 400, letterSpacing: 2, fontFamily: "'Lato',sans-serif" }}>
                Crafted with Faith
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 20, listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} style={linkStyle}
                  onMouseEnter={e => e.target.style.color = '#1a56db'}
                  onMouseLeave={e => e.target.style.color = '#1f2937'}>
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

          {/* Hamburger */}
          <button className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <div style={{ width: 24, height: 2, background: '#1a56db', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: 24, height: 2, background: '#1a56db', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity .2s' }} />
            <div style={{ width: 24, height: 2, background: '#1a56db', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="nav-mobile-menu" style={{ background: '#fff', borderTop: '1.5px solid #dbeafe', padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{ padding: '12px 14px', color: '#1f2937', fontFamily: "'Lato',sans-serif", fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.background = '#eef4ff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {l.label}
              </Link>
            ))}
            <div style={{ borderTop: '1.5px solid #dbeafe', marginTop: 10, paddingTop: 12, display: 'flex', gap: 8 }}>
              {!user ? (
                <>
                  <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', border: '1.5px solid #1a56db', borderRadius: 8, color: '#1a56db', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Register</Link>
                  <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', background: '#1a56db', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Login</Link>
                </>
              ) : user.isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', background: '#1a56db', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, textDecoration: 'none' }}>Dashboard</Link>
                  <button onClick={handleLogout} style={{ flex: 1, padding: '11px', background: '#e53e3e', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, border: 'none', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, display: 'flex', alignItems: 'center', color: '#1a56db', fontWeight: 700, fontSize: 14, paddingLeft: 8 }}>Hi, {user.fullName?.split(' ')[0]}</span>
                  <button onClick={handleLogout} style={{ flex: 1, padding: '11px', background: '#e53e3e', borderRadius: 8, color: '#fff', fontWeight: 700, fontFamily: "'Lato',sans-serif", fontSize: 14, border: 'none', cursor: 'pointer' }}>Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}