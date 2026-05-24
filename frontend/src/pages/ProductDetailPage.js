import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const IMG_BASE = process.env.REACT_APP_API_URL || '';

const DEFAULT_PRODUCTS = {
  'default1': { _id: 'default1', name: 'Faith Clipboard', bibleVerse: 'Matthew 19:26', inspirationalSentence: 'With God, nothing is impossible — trust the journey.', description: 'A beautifully crafted clipboard with elegant floral design and the inspiring verse — "With God all things are possible." Perfect for your desk or as a meaningful gift to someone you love.', colorDescription: 'Warm grey background with white floral outlines and peach botanicals.', designDescription: 'Watercolor botanical art with delicate flowers, leaves, and gold accents.', themeDescription: 'Faith and hope — a reminder that God makes all things possible.', image: '/images/product1.jpeg', images: [] },
  'default2': { _id: 'default2', name: 'Rejoice Clipboard', bibleVerse: 'Philippians 4:4', inspirationalSentence: "Rejoice always — God's joy is your strength every single day.", description: 'Elegant dark green clipboard with silver botanical art and the joyful verse — "Rejoice in the Lord always." A stunning piece for any faith-filled home or office space.', colorDescription: 'Deep forest green with silver-toned lettering and botanical illustrations.', designDescription: 'Watercolor eucalyptus and leaf clusters with golden accent details.', themeDescription: 'Joy in the Lord — a daily reminder to rejoice in every circumstance.', image: '/images/product2.jpeg', images: [] },
  'default3': { _id: 'default3', name: 'Strength Clipboard', bibleVerse: 'Philippians 4:13', inspirationalSentence: 'You are stronger than you know — Christ is your strength.', description: 'A serene light blue clipboard adorned with a delicate wildflower wreath and the empowering verse — "I can do all things through Christ who strengtheneth me." Uplifting for every day.', colorDescription: 'Soft sky blue background with multi-colored wildflower wreath in pastels.', designDescription: 'Botanical wildflower wreath with daisies, lavender, and meadow flowers.', themeDescription: 'Strength in Christ — a reminder that you can overcome anything through faith.', image: '/images/product3.jpeg', images: [] },
  'default4': { _id: 'default4', name: 'Wisdom Clipboard', bibleVerse: 'Proverbs 1:7', inspirationalSentence: 'True wisdom begins when we place God first in everything.', description: 'Warm beige clipboard with golden botanical accents and the wisdom scripture — "The fear of the LORD is the beginning of knowledge." A timeless keepsake for any believer.', colorDescription: 'Warm beige/linen background with sage green and golden botanical accents.', designDescription: 'Elegant leafy botanical garlands with gold-tipped branches and earthy tones.', themeDescription: 'Wisdom and knowledge — a beautiful reminder to seek God above all things.', image: '/images/product4.jpeg', images: [] }
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

  const defaultMaterials = [
    { _id: 'm1', name: 'Cardboard', description: 'Sturdy cardboard finish, lightweight and elegant.', price: 300, color: '#8B5E3C' },
    { _id: 'm2', name: 'Thin Plastic', description: 'Smooth silver-toned plastic, durable and sleek.', price: 400, color: '#C0C0C0' },
    { _id: 'm3', name: 'Acrylic Plastic', description: 'Premium white acrylic, crystal-clear and premium quality.', price: 500, color: '#F0F0F0' }
  ];

  useEffect(() => {
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

  const getImg = filename => {
    if (!filename) return '';
    if (filename.startsWith('/images/') || filename.startsWith('http')) return filename;
    return `${IMG_BASE}/uploads/${filename}`;
  };

  const getVideoUrl = p => {
    if (!p?.video) return '';
    return `${IMG_BASE}/uploads/${p.video}`;
  };

  // All media items: images first, then video as last item
  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : [];
  const hasVideo = !!(product?.video);
  // Total items = images + (1 if video)
  const totalItems = allImages.length + (hasVideo ? 1 : 0);

  const handleOrderBooking = async () => {
    if (!selectedMaterial) return toast.error('Please select a material');
    setBooking(true);
    try {
      const savedUser = localStorage.getItem('pp_user');
      const fullUser = savedUser ? JSON.parse(savedUser) : user;
      await API.post('/orders', {
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
        material: { name: selectedMaterial.name, price: selectedMaterial.price }
      });
      toast.success('Order booked successfully! Check your email for confirmation. 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book order. Please try again.');
    }
    setBooking(false);
  };

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#1a56db', fontSize: 20 }}>Loading...</div>
  );

  return (
    <>
      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
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
        .thumb-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .thumb-scroll::-webkit-scrollbar-thumb {
          background: #1a56db;
          border-radius: 2px;
        }
        .thumb-scroll::-webkit-scrollbar-track {
          background: #eef4ff;
          border-radius: 2px;
        }
        .thumb-item {
          flex-shrink: 0;
          width: 68px;
          height: 68px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 2.5px solid #dbeafe;
          transition: border-color .2s, transform .2s;
        }
        .thumb-item:hover {
          transform: scale(1.05);
        }
        .thumb-item.active {
          border-color: #1a56db;
          box-shadow: 0 0 0 2px rgba(26,86,219,0.2);
        }
        .thumb-video {
          background: #0e3a8c;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 2px;
        }
        .dot-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .thumb-item {
            width: 56px;
            height: 56px;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        <button onClick={() => navigate('/products')}
          style={{ background: 'none', border: 'none', color: '#1a56db', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 30, fontFamily: "'Lato',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Products
        </button>

        <div className="detail-grid">

          {/* LEFT: Media Gallery */}
          <div>
            {/* Main display area */}
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid #dbeafe', boxShadow: '0 8px 40px rgba(26,86,219,0.10)', background: '#eef4ff', position: 'relative' }}>

              {/* Show image or video based on activeIndex */}
              {activeIndex < allImages.length ? (
                <img
                  src={getImg(allImages[activeIndex])}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = '/images/product1.jpeg'; }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video
                    src={getVideoUrl(product)}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              {/* Arrow navigation - left */}
              {totalItems > 1 && activeIndex > 0 && (
                <button
                  onClick={() => setActiveIndex(i => i - 1)}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  ‹
                </button>
              )}

              {/* Arrow navigation - right */}
              {totalItems > 1 && activeIndex < totalItems - 1 && (
                <button
                  onClick={() => setActiveIndex(i => i + 1)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  ›
                </button>
              )}
            </div>

            {/* Scrollable thumbnail row - images + video thumb */}
            {totalItems > 1 && (
              <div className="thumb-scroll">
                {allImages.map((img, i) => (
                  <div
                    key={`img-${i}`}
                    className={`thumb-item ${activeIndex === i ? 'active' : ''}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    <img
                      src={getImg(img)}
                      alt={`view ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>
                ))}

                {/* Video thumbnail at end */}
                {hasVideo && (
                  <div
                    className={`thumb-item thumb-video ${activeIndex === allImages.length ? 'active' : ''}`}
                    onClick={() => setActiveIndex(allImages.length)}
                  >
                    <div style={{ fontSize: 22, color: '#fff' }}>▶</div>
                    <div style={{ fontSize: 9, color: '#b3d1ff', fontWeight: 700 }}>VIDEO</div>
                  </div>
                )}
              </div>
            )}

            {/* Dot indicators */}
            {totalItems > 1 && (
              <div className="dot-row">
                {Array.from({ length: totalItems }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      width: i === activeIndex ? 24 : 8,
                      height: 4,
                      borderRadius: 2,
                      background: i === activeIndex ? '#1a56db' : '#dbeafe',
                      cursor: 'pointer',
                      transition: 'all .2s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>Potters Productions</div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,3vw,30px)', color: '#0e3a8c', lineHeight: 1.3, margin: '0 0 10px 0' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
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
              <div style={{ padding: '16px 18px', background: '#f8faff', borderRadius: 12, border: '1.5px solid #dbeafe', marginBottom: 24 }}>
                {product.colorDescription && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px 0', lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Color:</strong> {product.colorDescription}</p>}
                {product.designDescription && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px 0', lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Design:</strong> {product.designDescription}</p>}
                {product.themeDescription && <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}><strong style={{ color: '#0e3a8c' }}>Theme:</strong> {product.themeDescription}</p>}
              </div>
            )}

            {/* Materials */}
            <div style={{ borderTop: '1.5px solid #dbeafe', paddingTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0e3a8c', margin: '0 0 20px 0' }}>Materials</h3>
              <div style={{ display: 'flex', gap: 28, marginBottom: 16, flexWrap: 'wrap' }}>
                {materials.map(m => {
                  const isSelected = selectedMaterial?._id === m._id;
                  const isLight = m.color === '#F0F0F0' || m.color === '#C0C0C0';
                  return (
                    <div key={m._id} onClick={() => setSelectedMaterial(m)}
                      style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: m.color, border: isSelected ? '3px solid #1a56db' : `3px solid ${isLight ? '#d1d5db' : m.color}`, boxShadow: isSelected ? '0 0 0 3px rgba(26,86,219,0.2)' : '0 2px 8px rgba(0,0,0,0.12)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <span style={{ color: isLight ? '#1a56db' : '#fff', fontSize: 20, fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, color: isSelected ? '#1a56db' : '#374151', fontWeight: isSelected ? 700 : 400 }}>{m.name}</span>
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
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}></div>
            </div>

            <button onClick={handleOrderBooking} disabled={booking}
              style={{ width: '100%', background: booking ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 14, padding: '17px', fontSize: 18, fontWeight: 700, cursor: booking ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", boxShadow: '0 4px 20px rgba(26,86,219,0.25)', transition: 'background .2s', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
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