import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const IMG_BASE = process.env.REACT_APP_API_URL || '';
const UPI_ID = process.env.REACT_APP_UPI_ID || '9000841106-2@ybl';
const UPI_NAME = process.env.REACT_APP_UPI_NAME || 'Potters Productions';

const DEFAULT_PRODUCTS = {
  'default1': { _id: 'default1', name: 'Faith Clipboard', bibleVerse: 'Matthew 19:26', inspirationalSentence: 'With God, nothing is impossible — trust the journey.', description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — "With God all things are possible." Perfect for your desk or as a meaningful gift to someone you love.', colorDescription: 'Warm grey background with white floral outlines and peach botanicals.', designDescription: 'Watercolor botanical art with delicate flowers, leaves, and gold accents.', themeDescription: 'Faith and hope — a reminder that God makes all things possible.', image: '/images/product4.jpeg', imageData: '', images: [], imagesData: [], video: '', videoData: '' },
  'default2': { _id: 'default2', name: 'Rejoice Clipboard', bibleVerse: 'Philippians 4:4', inspirationalSentence: "Rejoice always — God's joy is your strength every single day.", description: 'Elegant dark green clipboard with silver botanical art and the joyful verse — "Rejoice in the Lord always." A stunning piece for any faith-filled home or office space.', colorDescription: 'Deep forest green with silver-toned lettering and botanical illustrations.', designDescription: 'Watercolor eucalyptus and leaf clusters with golden accent details.', themeDescription: 'Joy in the Lord — a daily reminder to rejoice in every circumstance.', image: '/images/product3.jpeg', imageData: '', images: [], imagesData: [], video: '', videoData: '' },
  'default3': { _id: 'default3', name: 'Strength Clipboard', bibleVerse: 'Philippians 4:13', inspirationalSentence: 'You are stronger than you know — Christ is your strength.', description: 'A serene light blue clipboard adorned with a delicate wildflower wreath and the empowering verse — "I can do all things through Christ who strengtheneth me." Uplifting for every day.', colorDescription: 'Soft sky blue background with multi-colored wildflower wreath in pastels.', designDescription: 'Botanical wildflower wreath with daisies, lavender, and meadow flowers.', themeDescription: 'Strength in Christ — a reminder that you can overcome anything through faith.', image: '/images/product2.jpeg', imageData: '', images: [], imagesData: [], video: '', videoData: '' },
  'default4': { _id: 'default4', name: 'Wisdom Clipboard', bibleVerse: 'Proverbs 1:7', inspirationalSentence: 'True wisdom begins when we place God first in everything.', description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture — "The fear of the LORD is the beginning of knowledge." A timeless keepsake for any believer.', colorDescription: 'Warm beige/linen background with sage green and golden botanical accents.', designDescription: 'Elegant leafy botanical garlands with gold-tipped branches and earthy tones.', themeDescription: 'Wisdom and knowledge — a beautiful reminder to seek God above all things.', image: '/images/product1.jpeg', imageData: '', images: [], imagesData: [], video: '', videoData: '' }
};

const getImgSrc = (filename, dataUrl) => {
  if (dataUrl && dataUrl.startsWith('data:')) return dataUrl;
  if (!filename) return '';
  if (filename.startsWith('/images/') || filename.startsWith('http') || filename.startsWith('data:')) return filename;
  return `${IMG_BASE}/uploads/${filename}`;
};

// Universal UPI link - works with PhonePe, Google Pay, Paytm, BHIM (all register as handlers on Android)
const buildUpiUrl = (amount, note) => {
  const params = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  return `upi://pay?${params}`;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [booking, setBooking] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [modalStep, setModalStep] = useState('confirm'); // confirm -> pay -> awaiting
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultMaterials = [
    { _id: 'm1', name: 'Cardboard', description: 'Sturdy cardboard finish, lightweight and elegant. Eco-friendly and great for everyday use.', price: 300, color: '#8B5E3C' },
    { _id: 'm2', name: 'Thin Plastic', description: 'Smooth silver-toned plastic, durable and sleek. Water-resistant surface with a clean finish.', price: 400, color: '#C0C0C0' },
    { _id: 'm3', name: 'Acrylic Plastic', description: 'Premium white acrylic, crystal-clear and premium quality. Long-lasting shine with a luxury feel.', price: 500, color: '#F0F0F0' }
  ];

  useEffect(() => {
    setActiveIndex(0);
    if (DEFAULT_PRODUCTS[id]) {
      setProduct(DEFAULT_PRODUCTS[id]);
    } else {
      API.get(`/products/${id}`)
        .then(r => setProduct(r.data))
        .catch(() => navigate('/products'));
    }
    API.get('/materials')
      .then(r => {
        const mats = r.data.length ? r.data : defaultMaterials;
        setMaterials(mats);
        setSelectedMaterial(mats[0]);
      })
      .catch(() => { setMaterials(defaultMaterials); setSelectedMaterial(defaultMaterials[0]); });
  }, [id]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#1a56db', fontSize: 20 }}>Loading...</div>
  );

  const allImages = [
    { src: getImgSrc(product.image, product.imageData), type: 'image' },
    ...((product.imagesData && product.imagesData.length > 0)
      ? product.imagesData.map((d, i) => ({ src: getImgSrc(product.images?.[i], d), type: 'image' }))
      : (product.images || []).map((img, i) => ({ src: getImgSrc(img, ''), type: 'image' }))
    )
  ].filter(item => item.src);

  const hasVideo = !!(product.videoData || product.video);
  const videoSrc = product.videoData && product.videoData.startsWith('data:')
    ? product.videoData
    : product.video ? `${IMG_BASE}/uploads/${product.video}` : '';

  const totalItems = allImages.length + (hasVideo ? 1 : 0);

  const openConfirm = () => {
    if (!selectedMaterial) return toast.error('Please select a material');
    setModalStep('confirm');
    setShowConfirm(true);
  };

  const closeModal = () => {
    setShowConfirm(false);
    setModalStep('confirm');
    setCreatedOrderId(null);
    setCopied(false);
  };

  const proceedToPaymentStep = async () => {
    // Create the order first, then show the payment step
    setBooking(true);
    try {
      const savedUser = localStorage.getItem('pp_user');
      const fullUser = savedUser ? JSON.parse(savedUser) : user;

      const { data } = await API.post('/orders', {
        customer: {
          name: fullUser.fullName || fullUser.name || 'Customer',
          email: fullUser.email || user.email,
          phone: fullUser.phone || user.phone || 'Not provided'
        },
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          image: product.image || ''
        },
        material: { name: selectedMaterial.name, price: selectedMaterial.price },
        payment: { method: 'UPI' }
      });

      setCreatedOrderId(data.order._id);
      setModalStep('pay');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start order. Please try again.');
    }
    setBooking(false);
  };
const openUpiApp = () => {
  try {
    const note = `${product.name}-${selectedMaterial.name}`.replace(/\s+/g, '');
    const upiUrl = buildUpiUrl(selectedMaterial.price, note);

    console.log('UPI URL:', upiUrl);

    window.location.assign(upiUrl);

    setTimeout(() => {
      setModalStep('awaiting');
    }, 1000);

  } catch (error) {
    console.error('UPI Error:', error);
    toast.error('Unable to open UPI app.');
  }
};

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePaymentConfirm = async () => {
    if (!createdOrderId) return;
    setConfirmingPayment(true);
    try {
      await API.put(`/orders/${createdOrderId}/payment-confirm`);
      toast.success('Thank you! We will verify your payment and confirm your order shortly. 🙏');
      closeModal();
    } catch (err) {
      toast.error('Could not update. If payment was completed, please contact us.');
    }
    setConfirmingPayment(false);
  };

  return (
    <>
      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .main-img-box {
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid #dbeafe;
          box-shadow: 0 8px 40px rgba(26,86,219,0.10);
          background: #eef4ff;
          position: relative;
        }
        .thumb-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-top: 12px;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .thumb-scroll::-webkit-scrollbar { height: 4px; }
        .thumb-scroll::-webkit-scrollbar-thumb { background: #1a56db; border-radius: 2px; }
        .thumb-scroll::-webkit-scrollbar-track { background: #eef4ff; border-radius: 2px; }
        .thumb-item {
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 2.5px solid #dbeafe;
          transition: border-color .2s, transform .15s;
        }
        .thumb-item:hover { transform: scale(1.06); }
        .thumb-item.active { border-color: #1a56db; box-shadow: 0 0 0 2px rgba(26,86,219,0.2); }
        .dot-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.92);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 700;
          color: #1a56db;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          z-index: 10;
          transition: background .2s;
        }
        .arrow-btn:hover { background: #fff; }
        .right-panel {
          display: flex;
          flex-direction: column;
        }
        .material-circles {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .right-panel {
            padding: 0 !important;
          }
          .material-circles {
            gap: 16px !important;
          }
          .thumb-item {
            width: 54px;
            height: 54px;
          }
          .arrow-btn {
            width: 32px;
            height: 32px;
            font-size: 15px;
          }
        }
      `}</style>

      {/* Order / Payment Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>

            {/* STEP 1: Confirm details */}
            {modalStep === 'confirm' && (
              <>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📦</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 10 }}>Confirm Your Order</h3>
                <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, marginBottom: 4 }}>
                  <strong>{product.name}</strong>
                </p>
                <div style={{ background: '#eef4ff', borderRadius: 12, padding: '14px 18px', margin: '14px 0 20px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: 14, color: '#374151' }}>
                    Material: <strong style={{ color: '#0e3a8c' }}>{selectedMaterial?.name}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: 22, color: '#1a56db', fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
                    ₹{selectedMaterial?.price}
                  </p>
                </div>
                <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 22 }}>
                  Are you sure you want to book this order?
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={closeModal}
                    style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                    Cancel
                  </button>
                  <button onClick={proceedToPaymentStep} disabled={booking}
                    style={{ flex: 1, background: booking ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: booking ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif" }}>
                    {booking ? 'Please wait...' : 'OK, Continue'}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Pay via UPI */}
            {modalStep === 'pay' && (
              <>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 6 }}>Pay via UPI</h3>
                <p style={{ color: '#1a56db', fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '6px 0 18px' }}>₹{selectedMaterial?.price}</p>

                <button onClick={openUpiApp}
                  style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  📱 Open My UPI App to Pay
                </button>

                <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 16 }}>
                  Works with PhonePe, Google Pay, Paytm, BHIM & others.<br/>
                  Only works on a mobile phone with a UPI app installed.
                </p>

                <div style={{ background: '#f8faff', border: '1.5px solid #dbeafe', borderRadius: 12, padding: '14px 16px', marginBottom: 16, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: 11, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                    App didn't open? Pay manually:
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontSize: 14, color: '#374151', fontWeight: 700, wordBreak: 'break-all' }}>{UPI_ID}</span>
                    <button onClick={copyUpiId}
                      style={{ flexShrink: 0, background: copied ? '#d1fae5' : '#eef4ff', color: copied ? '#065f46' : '#1a56db', border: '1.5px solid #dbeafe', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#6b7280' }}>
                    Open any UPI app → Send Money → paste this ID → enter ₹{selectedMaterial?.price}
                  </p>
                </div>

                <button onClick={() => setModalStep('awaiting')}
                  style={{ width: '100%', background: '#eef4ff', color: '#1a56db', border: '1.5px solid #dbeafe', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", marginBottom: 10 }}>
                  I've Paid →
                </button>
                <button onClick={closeModal}
                  style={{ width: '100%', background: 'none', color: '#6b7280', border: 'none', padding: '8px', fontSize: 13, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                  Cancel and close
                </button>
              </>
            )}

            {/* STEP 3: Awaiting payment confirmation */}
            {modalStep === 'awaiting' && (
              <>
                <div style={{ fontSize: 44, marginBottom: 12 }}>⏳</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 10 }}>Almost There!</h3>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                  We've recorded your order for <strong>{product.name}</strong> — ₹{selectedMaterial?.price}.
                  Please complete the payment in your UPI app. Once done, tap the button below.
                </p>
                <button onClick={handlePaymentConfirm} disabled={confirmingPayment}
                  style={{ width: '100%', background: confirmingPayment ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: confirmingPayment ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", marginBottom: 10 }}>
                  {confirmingPayment ? 'Updating...' : '✅ I\'ve Completed the Payment'}
                </button>
                <button onClick={() => setModalStep('pay')}
                  style={{ width: '100%', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, cursor: 'pointer', fontFamily: "'Lato',sans-serif", marginBottom: 8 }}>
                  ← Back to payment options
                </button>
                <button onClick={closeModal}
                  style={{ width: '100%', background: 'none', color: '#6b7280', border: 'none', padding: '8px', fontSize: 13, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 60px' }}>
        <button onClick={() => navigate('/products')}
          style={{ background: 'none', border: 'none', color: '#1a56db', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontFamily: "'Lato',sans-serif", display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          ← Back to Products
        </button>

        <div className="detail-grid">

          {/* LEFT: Media Gallery */}
          <div>
            <div className="main-img-box">
              {activeIndex < allImages.length ? (
                <img
                  src={allImages[activeIndex].src}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = '/images/product1.jpeg'; }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video src={videoSrc} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}

              {totalItems > 1 && activeIndex > 0 && (
                <button className="arrow-btn" style={{ left: 10 }} onClick={() => setActiveIndex(i => i - 1)}>‹</button>
              )}
              {totalItems > 1 && activeIndex < totalItems - 1 && (
                <button className="arrow-btn" style={{ right: 10 }} onClick={() => setActiveIndex(i => i + 1)}>›</button>
              )}
            </div>

            {totalItems > 1 && (
              <div className="thumb-scroll">
                {allImages.map((item, i) => (
                  <div key={`img-${i}`} className={`thumb-item ${activeIndex === i ? 'active' : ''}`} onClick={() => setActiveIndex(i)}>
                    <img src={item.src} alt={`view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  </div>
                ))}
                {hasVideo && (
                  <div className={`thumb-item ${activeIndex === allImages.length ? 'active' : ''}`}
                    style={{ background: '#0e3a8c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                    onClick={() => setActiveIndex(allImages.length)}>
                    <span style={{ fontSize: 20, color: '#fff' }}>▶</span>
                    <span style={{ fontSize: 8, color: '#b3d1ff', fontWeight: 700 }}>VIDEO</span>
                  </div>
                )}
              </div>
            )}

            {totalItems > 1 && (
              <div className="dot-row">
                {Array.from({ length: totalItems }).map((_, i) => (
                  <div key={i} onClick={() => setActiveIndex(i)}
                    style={{ width: i === activeIndex ? 24 : 8, height: 4, borderRadius: 2, background: i === activeIndex ? '#1a56db' : '#dbeafe', cursor: 'pointer', transition: 'all .2s' }} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="right-panel">
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>Potters Productions</div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,3vw,30px)', color: '#0e3a8c', lineHeight: 1.3, margin: '0 0 12px 0' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ color: '#f59e0b', fontSize: 16 }}>★★★★★</span>
              <span style={{ color: '#1a56db', fontSize: 13, fontWeight: 700 }}>5.0</span>
              <span style={{ color: '#9ca3af', fontSize: 13 }}>• Handcrafted with Love</span>
            </div>

            {product.inspirationalSentence && (
              <div style={{ padding: '14px 18px', background: '#eef4ff', borderRadius: 10, borderLeft: '3px solid #1a56db', marginBottom: 16 }}>
                <p style={{ margin: 0, color: '#1a56db', fontSize: 14, fontStyle: 'italic', fontFamily: "'Playfair Display',serif", lineHeight: 1.6 }}>
                  "{product.inspirationalSentence}"
                </p>
              </div>
            )}

            {product.bibleVerse && (
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 14px 0' }}>📖 {product.bibleVerse}</p>
            )}

            <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.9, margin: '0 0 18px 0' }}>{product.description}</p>

            {(product.colorDescription || product.designDescription || product.themeDescription) && (
              <div style={{ padding: '14px 16px', background: '#f8faff', borderRadius: 12, border: '1.5px solid #dbeafe', marginBottom: 20 }}>
                {product.colorDescription && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 6px 0', lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Color:</strong> {product.colorDescription}</p>}
                {product.designDescription && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 6px 0', lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Design:</strong> {product.designDescription}</p>}
                {product.themeDescription && <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Theme:</strong> {product.themeDescription}</p>}
              </div>
            )}

            {/* Materials */}
            <div style={{ borderTop: '1.5px solid #dbeafe', paddingTop: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0e3a8c', margin: '0 0 16px 0' }}>Materials</h3>
              <div className="material-circles">
                {materials.map(m => {
                  const isSelected = selectedMaterial?._id === m._id;
                  const isLight = m.color === '#F0F0F0' || m.color === '#C0C0C0';
                  return (
                    <div key={m._id} onClick={() => setSelectedMaterial(m)}
                      style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: m.color, border: isSelected ? '3px solid #1a56db' : `3px solid ${isLight ? '#d1d5db' : m.color}`, boxShadow: isSelected ? '0 0 0 3px rgba(26,86,219,0.2)' : '0 2px 8px rgba(0,0,0,0.12)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <span style={{ color: isLight ? '#1a56db' : '#fff', fontSize: 20, fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: isSelected ? '#1a56db' : '#374151', fontWeight: isSelected ? 700 : 400 }}>{m.name}</span>
                    </div>
                  );
                })}
              </div>
              {selectedMaterial && <p style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>{selectedMaterial.description}</p>}
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#0e3a8c', fontFamily: "'Lato',sans-serif", lineHeight: 1 }}>
                ₹{selectedMaterial?.price || '—'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Inclusive of All Taxes</div>
            </div>

            {/* Order Button */}
            <button onClick={openConfirm} disabled={booking}
              style={{ width: '100%', background: booking ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 17, fontWeight: 700, cursor: booking ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", boxShadow: '0 4px 20px rgba(26,86,219,0.25)', transition: 'background .2s', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxSizing: 'border-box' }}>
              <span>📦</span>
              <span>{booking ? 'Booking...' : 'Order Booking'}</span>
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', margin: 0 }}>
              🙏 A confirmation email will be sent to {user?.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
