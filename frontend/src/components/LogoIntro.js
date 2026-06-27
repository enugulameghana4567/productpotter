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

    // Wait before starting animation
    const t1 = setTimeout(() => setShrink(true), 1800);

    // Hide after animation completes
    const t2 = setTimeout(() => {
      setHidden(true);
      sessionStorage.setItem('pp_intro_shown', '1');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (skip || hidden) return null;

  return (
    <>
      <style>{`
        .pp-intro-overlay{
          position:fixed;
          inset:0;
          z-index:9999;
          background:#ffffff;
          display:flex;
          justify-content:center;
          align-items:center;
          overflow:hidden;
          opacity:1;
          transition:opacity .8s ease;
        }

        .pp-intro-overlay.pp-shrink{
          opacity:0;
          pointer-events:none;
        }

        .pp-intro-logo-wrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          transform:scale(1);
          transition:transform 2.2s cubic-bezier(.23,1,.32,1);
        }

        .pp-intro-logo-wrap.pp-shrink{
          transform:scale(.28)
          translate(calc(-50vw + 90px),calc(-50vh + 42px));
        }

        .pp-intro-logo-img{
          width:min(65vw,420px);
          height:min(65vw,420px);
          border-radius:50%;
          object-fit:cover;
          border:6px solid #dbeafe;
          box-shadow:0 18px 60px rgba(26,86,219,.25);
          animation:logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat{
          0%{transform:translateY(0px);}
          50%{transform:translateY(-10px);}
          100%{transform:translateY(0px);}
        }

        .pp-intro-text{
          margin-top:24px;
          font-family:'Playfair Display',serif;
          font-size:clamp(28px,4vw,46px);
          color:#1a56db;
          font-weight:700;
          letter-spacing:1px;
          transition:opacity .5s ease;
        }

        .pp-intro-logo-wrap.pp-shrink .pp-intro-text{
          opacity:0;
        }

        @media(max-width:768px){

          .pp-intro-logo-img{
            width:72vw;
            height:72vw;
          }

          .pp-intro-logo-wrap.pp-shrink{
            transform:scale(.22)
            translate(calc(-50vw + 55px),calc(-50vh + 34px));
          }

          .pp-intro-text{
            font-size:30px;
          }

        }
      `}</style>

      <div className={`pp-intro-overlay ${shrink ? 'pp-shrink' : ''}`}>
        <div className={`pp-intro-logo-wrap ${shrink ? 'pp-shrink' : ''}`}>
          <img
            src="/logo.jpeg"
            alt="Potters Productions"
            className="pp-intro-logo-img"
          />
          <div className="pp-intro-text">
            Potters Productions
          </div>
        </div>
      </div>
    </>
  );
}
