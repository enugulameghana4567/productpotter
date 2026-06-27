import React, { useEffect, useState } from 'react';

export default function LogoIntro() {
  const [shrink, setShrink] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pp_intro_shown')) {
      setSkip(true);
      return;
    }
    const t1 = setTimeout(() => setShrink(true), 550);
    const t2 = setTimeout(() => {
      setHidden(true);
      sessionStorage.setItem('pp_intro_shown', '1');
    }, 1450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (skip || hidden) return null;

  return (
    <>
      <style>{`
        .pp-intro-overlay {
          position: fixed; inset: 0; z-index: 9999; background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          opacity: 1; transition: opacity .5s ease .35s;
        }
        .pp-intro-overlay.pp-shrink { opacity: 0; pointer-events: none; }
        .pp-intro-logo-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          transform: scale(1) translate(0,0);
          transition: transform .85s cubic-bezier(.65,.05,.2,1);
        }
        .pp-intro-logo-wrap.pp-shrink {
          transform: scale(0.4) translate(calc(-50vw + 90px), calc(-50vh + 36px));
        }
        .pp-intro-logo-img {
          width: 108px; height: 108px; border-radius: 50%; object-fit: cover;
          border: 3px solid #dbeafe; box-shadow: 0 12px 44px rgba(26,86,219,0.18);
          display: block;
        }
        .pp-intro-text {
          font-family: 'Playfair Display',serif; font-size: 22px; color: #1a56db; font-weight: 700;
          opacity: 1; transition: opacity .35s ease;
        }
        .pp-intro-logo-wrap.pp-shrink .pp-intro-text { opacity: 0; }
      `}</style>
      <div className={`pp-intro-overlay ${shrink ? 'pp-shrink' : ''}`}>
        <div className={`pp-intro-logo-wrap ${shrink ? 'pp-shrink' : ''}`}>
          <img src="/logo.jpeg" alt="Potters Productions" className="pp-intro-logo-img" />
          <div className="pp-intro-text">Potters Productions</div>
        </div>
      </div>
    </>
  );
}
