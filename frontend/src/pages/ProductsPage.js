import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../utils/api';



const IMG_BASE = process.env.REACT_APP_API_URL || '';



const FIXED_PRODUCTS = [

  { _id: 'default1', name: 'Faith Clipboard', bibleVerse: 'Matthew 19:26', description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — With God all things are possible.', image: '/images/product4.jpeg', imageData: '' },

  { _id: 'default2', name: 'Rejoice Clipboard', bibleVerse: 'Philippians 4:4', description: 'Elegant dark green clipboard with silver lettering and botanical art.', image: '/images/product3.jpeg', imageData: '' },

  { _id: 'default3', name: 'Strength Clipboard', bibleVerse: 'Philippians 4:13', description: 'Light blue clipboard adorned with a delicate wildflower wreath.', image: '/images/product2.jpeg', imageData: '' },

  { _id: 'default4', name: 'Wisdom Clipboard', bibleVerse: 'Proverbs 1:7', description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture.', image: '/images/product1.jpeg', imageData: '' }

];



const getImgSrc = (p) => {

  if (p?.imageData && p.imageData.startsWith('data:')) return p.imageData;

  if (!p?.image) return '';

  if (p.image.startsWith('/images/') || p.image.startsWith('http')) return p.image;

  return `${IMG_BASE}/uploads/${p.image}`;

};



export default function ProductsPage() {

  const navigate = useNavigate();

  const [dbProducts, setDbProducts] = useState([]);

  const [slide, setSlide] = useState(0);



  // Refs to measure the REAL rendered height of each slide

  const heroSlideRef = useRef(null);

  const givingSlideRef = useRef(null);

  const [slideHeights, setSlideHeights] = useState([0, 0]);



  useEffect(() => {

    API.get('/products')

      .then(r => {

        const fixedNames = FIXED_PRODUCTS.map(p => p.name.toLowerCase());

        const extras = r.data.filter(p => !fixedNames.includes(p.name.toLowerCase()));

        setDbProducts(extras);

      })

      .catch(() => setDbProducts([]));

  }, []);



  // Measure actual heights so the slide container always fits the content exactly

  useLayoutEffect(() => {

    const measure = () => {

      setSlideHeights([

        heroSlideRef.current ? heroSlideRef.current.offsetHeight : 0,

        givingSlideRef.current ? givingSlideRef.current.offsetHeight : 0

      ]);

    };

    measure();

    const t = setTimeout(measure, 80); // catch any late layout shift (text wrap, font load)

    window.addEventListener('resize', measure);

    return () => {

      clearTimeout(t);

      window.removeEventListener('resize', measure);

    };

  }, []);



  useEffect(() => {

    const interval = setInterval(() => {

      setSlide((prev) => (prev === 0 ? 1 : 0));

    },  3000); // wait a full minute between slide changes



    return () => clearInterval(interval);

  }, []);



  const allProducts = [...FIXED_PRODUCTS, ...dbProducts];



  const containerHeight = slideHeights[slide] || undefined;



  return (

    <div>

      <style>{`

  @keyframes pp-marquee-scroll {

    0% { transform: translateX(0); }

    100% { transform: translateX(-50%); }

  }



  .pp-marquee-wrap{

    overflow:hidden;

    background:#0e3a8c;

    padding:12px 0;

  }



  .pp-marquee-track{

    display:flex;

    width:max-content;

    animation:pp-marquee-scroll 22s linear infinite;

  }



  .pp-marquee-track span{

    white-space:nowrap;

    color:#fff;

    font-family:'Lato',sans-serif;

    font-size:13px;

    font-weight:700;

    letter-spacing:1px;

    padding-right:40px;

  }



  /* Banner */



  .pp-revenue-banner{
    .pp-revenue-banner{
    display:flex;
    align-items:center;
    justify-content:space-between;
    position:relative;
    overflow:hidden;
    border-radius:24px;
    background:linear-gradient(135deg,#0e3a8c,#1a56db);
    box-shadow:0 12px 40px rgba(14,58,140,.25);
    width:100%;
    height:300px;
}
  /* Left image */
  .pp-revenue-img{
    flex:0 0 36%;
    position:relative;
    z-index:1;
  }
  .pp-revenue-img img{
    width:100%;
    height:300px;
    object-fit:cover;
}
 /* Right content */
  .pp-revenue-text{
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-start;
  padding:0 50px 0 170px;
  color:#fff;
  height:100%;
  box-sizing:border-box;
}
  .pp-revenue-label{
    font-size:12px;
    letter-spacing:3px;
    color:#b3d1ff;
    font-weight:700;
    margin-bottom:10px;
    text-transform:uppercase;
  }
  .pp-revenue-text h3{
  font-family:'Playfair Display',serif;
  font-size:30px;
  margin:8px 0 16px;
  line-height:1.2;
}
  .pp-revenue-text p{
  font-size:15px;
  line-height:1.7;
  color:#dbeafe;
  max-width:480px;
  margin:0;
}
  /* 20% Circle */
  .pp-revenue-circle{
    position:absolute;
    left:35%;
    top:50%;
    transform:translate(-50%,-50%);
    width:130px;
    height:130px;


    border-radius:50%;



    background:#fff;



    color:#0e3a8c;



    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;



    border:5px solid #eef4ff;



    box-shadow:0 15px 40px rgba(0,0,0,.18);



    z-index:20;

  }



  .pp-revenue-circle span{

    font-family:'Playfair Display',serif;

    font-size:34px;

    font-weight:700;

    line-height:1;

  }



  .pp-revenue-circle small{

    font-size:12px;

    color:#1a56db;

    font-weight:700;

    margin-top:6px;

  }



  /* Mobile */



  @media(max-width:768px){



    .pp-revenue-banner{

      flex-direction:column;

      min-height:auto;

    }



    .pp-revenue-img{

      flex:none;

      height:260px;

    }



    .pp-revenue-text{

      padding:80px 24px 35px;

      text-align:center;

      align-items:center;

    }



    .pp-revenue-text p{

      max-width:100%;

    }



    .pp-revenue-circle{



      left:50%;



      top:260px;



      transform:translate(-50%,-50%);



      width:100px;

      height:100px;

    }



    .pp-revenue-circle span{

      font-size:28px;

    }



  }

`}</style>



     <div
  style={{
    overflow: "hidden",
    width: "100%",
    position: "relative",
    marginTop: "-20px",
    transition: "height .8s ease",
    height: containerHeight
  }}
>

  }}

>

  <div

    style={{

      display: "flex",

      flexDirection: "row",

      width: "200%",

      transform: `translateX(-${slide * 50}%)`,

      transition: "transform 1.2s ease-in-out"

    }}

  >



    {/* Products Hero */}



    <section

      ref={heroSlideRef}

      style={{

        background: "linear-gradient(135deg,#eef4ff,#dbeafe)",

        padding: "35px 20px",

        textAlign: "center",

        width: "50%",

        flex: "0 0 50%",

        boxSizing: "border-box"

      }}

    >

      <p

        style={{

          color: "#1a56db",

          fontSize: 12,

          textTransform: "uppercase",

          letterSpacing: 4,

          fontWeight: 700

        }}

      >

        Our Collection

      </p>



      <h1

        style={{

          fontFamily: "'Playfair Display',serif",

          fontSize: "clamp(24px,3vw,36px)",

          color: "#0e3a8c",

          marginTop: 12

        }}

      >

        Products

      </h1>



      <p

        style={{

          color: "#4b5563",

          fontSize: 14,

          marginTop: 16

        }}

      >

        Each product handcrafted with love, prayer, and purpose.

      </p>



      <div

        style={{

          width: 60,

          height: 3,

          background: "#1a56db",

          margin: "20px auto"

        }}

      />

    </section>



    {/* Giving Back */}



    <section
  ref={givingSlideRef}
  style={{
    maxWidth: 1100,
    margin: "-15px auto 0",
    padding: "0 20px",
    width: "50%",
    flex: "0 0 50%",
    boxSizing: "border-box"
  }}
>

    >

      <div className="pp-revenue-banner">



        <div className="pp-revenue-img">

          <img src="/images/product5.png" alt="" />

        </div>



        <div className="pp-revenue-text">

          <p className="pp-revenue-label">

            ✦ Giving Back

          </p>



          <h3>

            Creating with Purpose

          </h3>



          <p>

            20% of our revenue is dedicated to supporting Christian missions —

            helping spread the Gospel and serve communities in need.

          </p>

        </div>



        <div className="pp-revenue-circle">

          <span>20%</span>

          <small>To Missions</small>

        </div>



      </div>

    </section>



  </div>

</div>



      <section style={{ maxWidth: 1100, margin: '60px auto', padding: '0 20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 32 }}>

          {allProducts.map(p => (

            <div key={p._id}

              style={{ border: '1.5px solid #dbeafe', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform .25s,box-shadow .25s', background: '#fff' }}

              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,86,219,0.14)'; }}

              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

              <div style={{ height: 260, overflow: 'hidden', background: '#eef4ff' }}>

                <img

                  src={getImgSrc(p)}

                  alt={p.name}

                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}

                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}

                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}

                  onError={e => { e.target.style.display = 'none'; }}

                />

              </div>

              <div style={{ padding: '22px 24px 28px' }}>

                <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>Christian Product</div>

                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#0e3a8c', margin: '0 0 6px 0' }}>{p.name}</h3>

                {p.bibleVerse && <p style={{ color: '#1a56db', fontSize: 12, fontStyle: 'italic', margin: '0 0 10px 0' }}>— {p.bibleVerse}</p>}

                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7, margin: '0 0 20px 0' }}>{p.description?.slice(0, 80)}...</p>

                <button onClick={() => navigate(`/products/${p._id}`)}

                  style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", width: '100%' }}>

                  View Product →

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

}

