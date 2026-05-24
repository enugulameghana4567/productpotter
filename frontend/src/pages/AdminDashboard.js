import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #dbeafe', borderRadius: 8,
  fontSize: 14, fontFamily: "'Lato',sans-serif", outline: 'none', background: '#f8faff',
  marginTop: 4, boxSizing: 'border-box', color: '#1f2937'
};
const cardStyle = {
  background: '#fff', borderRadius: 16, padding: '20px',
  border: '1.5px solid #dbeafe', boxShadow: '0 2px 16px rgba(26,86,219,0.06)'
};
const IMG_BASE = process.env.REACT_APP_API_URL || '';
const EMPTY_PRODUCT = { name: '', description: '', bibleVerse: '', inspirationalSentence: '', colorDescription: '', designDescription: '', themeDescription: '', isVisible: true };
const EMPTY_MAT = { name: '', description: '', price: '', color: '#8B5E3C' };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [aboutText, setAboutText] = useState('');
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '', whatsapp: '', instagram: '', address: '' });

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [productFile, setProductFile] = useState(null);
  const [productPreview, setProductPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);
  const fileRef = useRef();
  const videoRef = useRef();
  const extraImagesRef = useRef();

  const [editingMaterial, setEditingMaterial] = useState(null);
  const [matForm, setMatForm] = useState(EMPTY_MAT);

  const [messageOrder, setMessageOrder] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchAll = () => {
    API.get('/products/all').then(r => setProducts(r.data)).catch(() => {});
    API.get('/materials/all').then(r => setMaterials(r.data)).catch(() => {
      API.get('/materials').then(r => setMaterials(r.data)).catch(() => {});
    });
    API.get('/orders').then(r => setOrders(r.data)).catch(() => {});
    API.get('/feedback/all').then(r => setFeedbacks(r.data)).catch(() => {});
    API.get('/settings/about').then(r => setAboutText(r.data?.value || '')).catch(() => {});
    API.get('/settings/contact').then(r => setContactInfo(r.data?.value || { phone: '', email: '', whatsapp: '', instagram: '', address: '' })).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const getImg = p => {
    if (!p?.image) return '';
    if (p.image.startsWith('/images/') || p.image.startsWith('http')) return p.image;
    return `${IMG_BASE}/uploads/${p.image}`;
  };

  const getVideo = p => {
    if (!p?.video) return '';
    return `${IMG_BASE}/uploads/${p.video}`;
  };

  const tabs = [
    { id: 'products', label: '📦 Products' },
    { id: 'materials', label: '🔵 Materials' },
    { id: 'orders', label: '📋 Orders' },
    { id: 'feedback', label: '💬 Feedback' },
    { id: 'about', label: '📄 About Us' },
    { id: 'contact', label: '📞 Contact' }
  ];

  const openAdd = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setProductFile(null);
    setProductPreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setExtraFiles([]);
    setExtraPreviews([]);
    setShowProductForm(true);
  };

  const openEdit = p => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '', description: p.description || '',
      bibleVerse: p.bibleVerse || '', inspirationalSentence: p.inspirationalSentence || '',
      colorDescription: p.colorDescription || '', designDescription: p.designDescription || '',
      themeDescription: p.themeDescription || '', isVisible: p.isVisible !== false
    });
    setProductFile(null);
    setProductPreview(getImg(p));
    setVideoFile(null);
    setVideoPreview(getVideo(p));
    setExtraFiles([]);
    setExtraPreviews((p.images || []).map(img => `${IMG_BASE}/uploads/${img}`));
    setShowProductForm(true);
  };

  const cancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setProductFile(null);
    setProductPreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setExtraFiles([]);
    setExtraPreviews([]);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setProductFile(file);
    setProductPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleExtraImages = e => {
    const files = Array.from(e.target.files);
    setExtraFiles(prev => {
      const newFiles = [...prev, ...files];
      return newFiles;
    });
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setExtraPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeExtraImage = (index) => {
    setExtraFiles(prev => prev.filter((_, i) => i !== index));
    setExtraPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.description) {
      return toast.error('Name and description are required.');
    }
    if (!editingProduct && !productFile) {
      return toast.error('Please select a product image.');
    }

    const fd = new FormData();
    fd.append('name', productForm.name);
    fd.append('description', productForm.description);
    fd.append('bibleVerse', productForm.bibleVerse || '');
    fd.append('inspirationalSentence', productForm.inspirationalSentence || '');
    fd.append('colorDescription', productForm.colorDescription || '');
    fd.append('designDescription', productForm.designDescription || '');
    fd.append('themeDescription', productForm.themeDescription || '');
    fd.append('isVisible', productForm.isVisible);

    if (productFile) fd.append('image', productFile);
    if (videoFile) fd.append('video', videoFile);
    extraFiles.forEach(f => fd.append('images', f));

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated!');
      } else {
        await API.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added! Visible to customers now.');
      }
      cancelProductForm();
      fetchAll();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const deleteProduct = async id => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Product deleted.'); fetchAll(); }
    catch { toast.error('Failed to delete product.'); }
  };

  const openAddMat = () => { setEditingMaterial(null); setMatForm(EMPTY_MAT); };
  const openEditMat = m => {
    setEditingMaterial(m);
    setMatForm({ name: m.name, description: m.description || '', price: m.price, color: m.color });
  };

  const saveMaterial = async () => {
    if (!matForm.name || !matForm.price) return toast.error('Name and price are required.');
    try {
      if (editingMaterial) {
        await API.put(`/materials/${editingMaterial._id}`, matForm);
        toast.success('Material updated!');
      } else {
        await API.post('/materials', matForm);
        toast.success('Material added!');
      }
      setEditingMaterial(null);
      setMatForm(EMPTY_MAT);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save material.'); }
  };

  const deleteMat = async m => {
    if (m.isDefault) return toast.error('Cannot delete default materials.');
    if (!window.confirm(`Delete "${m.name}"?`)) return;
    try { await API.delete(`/materials/${m._id}`); toast.success('Material deleted.'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete.'); }
  };

  const deleteOrder = async id => {
    if (!window.confirm('Delete this order?')) return;
    try { await API.delete(`/orders/${id}`); toast.success('Order deleted.'); fetchAll(); }
    catch { toast.error('Failed to delete order.'); }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return toast.error('Please enter a message.');
    setSendingMessage(true);
    try {
      await API.post(`/orders/${messageOrder._id}/message`, { message: messageText });
      setMessageText('__SENT__');
      fetchAll(); // refresh to get updated messageSent from DB
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    }
    setSendingMessage(false);
  };

  const toggleFeedback = async (id, approved) => {
    await API.put(`/feedback/${id}/approve`, { approved });
    toast.success(approved ? 'Feedback approved!' : 'Feedback hidden.');
    fetchAll();
  };

  const deleteFeedback = async id => {
    await API.delete(`/feedback/${id}`);
    toast.success('Feedback deleted.');
    fetchAll();
  };

  const saveAbout = async () => { await API.put('/settings/about', { value: aboutText }); toast.success('About Us updated!'); };
  const saveContact = async () => { await API.put('/settings/contact', { value: contactInfo }); toast.success('Contact info updated!'); };

  const handleTabChange = (tabId) => { setActiveTab(tabId); };

  const btnPrimary = { background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 13 };
  const btnDanger = { background: '#fee2e2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 7, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" };
  const btnEdit = { background: '#eef4ff', color: '#1a56db', border: '1.5px solid #dbeafe', borderRadius: 7, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>
      <style>{`
        .admin-sidebar { width: 220px; background: #fff; border-right: 1.5px solid #dbeafe; padding: 24px 0; flex-shrink: 0; }
        .admin-content { flex: 1; padding: 24px; overflow-y: auto; min-width: 0; }
        .admin-body { display: flex; min-height: calc(100vh - 180px); }
        .mobile-tab-bar { display: none; }
        .product-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .image-video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .order-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; padding-right: 140px; }
        .order-actions { position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; flex-direction: column; align-items: flex-end; }
        .mat-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-body { flex-direction: column; }
          .admin-content { padding: 12px; }
          .mobile-tab-bar { display: flex; overflow-x: auto; background: #fff; border-bottom: 1.5px solid #dbeafe; padding: 0; gap: 0; -webkit-overflow-scrolling: touch; }
          .mobile-tab-bar::-webkit-scrollbar { display: none; }
          .mobile-tab-btn { flex-shrink: 0; padding: 11px 12px; border: none; border-bottom: 3px solid transparent; background: transparent; cursor: pointer; font-size: 11px; font-weight: 700; font-family: 'Lato', sans-serif; color: #6b7280; white-space: nowrap; }
          .mobile-tab-btn.active { color: #1a56db; border-bottom: 3px solid #1a56db; background: #eef4ff; }
          .product-form-grid { grid-template-columns: 1fr !important; }
          .image-video-grid { grid-template-columns: 1fr !important; }
          .order-card-grid { grid-template-columns: 1fr 1fr !important; padding-right: 0 !important; }
          .order-actions { position: static !important; flex-direction: row !important; margin-bottom: 12px; }
          .mat-price-grid { grid-template-columns: 1fr !important; }
          .admin-stats { gap: 16px !important; padding: 12px 16px !important; }
          .admin-header { padding: 16px !important; }
          .admin-header h1 { font-size: 20px !important; }
          .mat-row { flex-wrap: wrap; gap: 10px !important; }
        }
      `}</style>

      {/* Message Modal */}
      {messageOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 500, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {messageText === '__SENT__' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#10b981', marginTop: 0, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
                  Message sent successfully to<br />
                  <strong style={{ color: '#0e3a8c' }}>{messageOrder.customer.email}</strong>
                </p>
                <button onClick={() => { setMessageOrder(null); setMessageText(''); }}
                  style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 15 }}>
                  OK
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 8 }}>Send Message to Customer</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                  To: <strong>{messageOrder.customer.name}</strong> — {messageOrder.customer.email}<br />
                  Order: <strong>{messageOrder.product.name}</strong>
                </p>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>From</label>
                  <input style={{ ...inp, background: '#f0f0f0', color: '#888' }} value="productpotter@gmail.com" readOnly />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>To</label>
                  <input style={{ ...inp, background: '#f0f0f0', color: '#888' }} value={messageOrder.customer.email} readOnly />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Message *</label>
                  <textarea style={{ ...inp, height: 100, resize: 'vertical' }}
                    placeholder="Type your message to the customer..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={sendMessage} disabled={sendingMessage}
                    style={{ ...btnPrimary, opacity: sendingMessage ? 0.7 : 1, flex: 1, cursor: sendingMessage ? 'not-allowed' : 'pointer' }}>
                    {sendingMessage ? '⏳ Sending...' : '📧 Send Message'}
                  </button>
                  <button onClick={() => { setMessageOrder(null); setMessageText(''); }}
                    style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-header" style={{ background: 'linear-gradient(135deg,#0e3a8c,#1a56db)', padding: '28px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, margin: 0 }}>✦ Admin Dashboard</h1>
            <p style={{ color: '#b3d1ff', margin: '6px 0 0', fontSize: 14 }}>Potters Productions Management Panel</p>
          </div>
          <button onClick={fetchAll}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontFamily: "'Lato',sans-serif" }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ background: '#fff', borderBottom: '1.5px solid #dbeafe', padding: '16px 32px', display: 'flex', gap: 32, overflowX: 'auto' }}>
        {[['📦', products.length, 'Products'], ['🛒', orders.length, 'Orders'], ['💬', feedbacks.length, 'Feedbacks'], ['✅', feedbacks.filter(f => f.approved).length, 'Approved']].map(([icon, count, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 80 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0e3a8c' }}>{count}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Tab Bar */}
      <div className="mobile-tab-bar">
        {tabs.map(t => (
          <button key={t.id} className={`mobile-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTabChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-body">

        {/* Desktop Sidebar */}
        <div className="admin-sidebar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => handleTabChange(t.id)}
              style={{ width: '100%', padding: '13px 24px', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === t.id ? 700 : 400, fontFamily: "'Lato',sans-serif", background: activeTab === t.id ? '#eef4ff' : 'transparent', color: activeTab === t.id ? '#1a56db' : '#374151', borderLeft: activeTab === t.id ? '3px solid #1a56db' : '3px solid transparent', transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="admin-content">

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', margin: 0 }}>Manage Products</h2>
                <button onClick={openAdd} style={btnPrimary}>+ Add New Product</button>
              </div>

              {showProductForm && (
                <div style={{ ...cardStyle, marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 16 }}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>

                  <div className="product-form-grid">
                    {[['Product Name *', 'name'], ['Bible Verse', 'bibleVerse'], ['Inspirational Sentence', 'inspirationalSentence'], ['Color Description', 'colorDescription'], ['Design Description', 'designDescription'], ['Theme Description', 'themeDescription']].map(([label, field]) => (
                      <div key={field}>
                        <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
                        <input style={inp} value={productForm[field]} onChange={e => setProductForm({ ...productForm, [field]: e.target.value })} placeholder={label.replace(' *', '')} />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Description *</label>
                    <textarea style={{ ...inp, height: 90, resize: 'vertical' }} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description" />
                  </div>

                  <div className="image-video-grid">
                    <div>
                      <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                        Main Image {!editingProduct && '*'}
                      </label>
                      <div onClick={() => fileRef.current.click()}
                        style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8faff', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {productPreview ? (
                          <img src={productPreview} alt="preview" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 8 }} />
                        ) : (
                          <div>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload image</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>JPG, PNG, WEBP</div>
                          </div>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                        Video (Optional)
                      </label>
                      <div onClick={() => videoRef.current.click()}
                        style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8faff', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {videoPreview ? (
                          <video src={videoPreview} style={{ width: '100%', maxHeight: 120, borderRadius: 8 }} controls />
                        ) : (
                          <div>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>🎥</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload video</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>MP4, MOV, AVI</div>
                          </div>
                        )}
                      </div>
                      <input ref={videoRef} type="file" accept="video/mp4,video/mov,video/avi,video/mkv,video/webm" onChange={handleVideoChange} style={{ display: 'none' }} />
                    </div>
                  </div>

                  {/* Extra Images - accumulate, can remove individual */}
                  <div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                      Additional Images (Optional — scroll through on product page)
                    </label>
                    <div style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '14px', background: '#f8faff' }}>
                      {extraPreviews.length > 0 ? (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {extraPreviews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img src={src} alt={`extra ${i}`}
                                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #dbeafe' }} />
                              <button onClick={() => removeExtraImage(i)}
                                style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                                ×
                              </button>
                            </div>
                          ))}
                          <div onClick={() => extraImagesRef.current.click()}
                            style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef4ff', borderRadius: 8, border: '2px dashed #1a56db', fontSize: 24, color: '#1a56db', cursor: 'pointer', fontWeight: 700 }}>+</div>
                        </div>
                      ) : (
                        <div onClick={() => extraImagesRef.current.click()} style={{ textAlign: 'center', cursor: 'pointer' }}>
                          <div style={{ fontSize: 24, marginBottom: 4 }}>🖼️</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload multiple images</div>
                        </div>
                      )}
                    </div>
                    <input ref={extraImagesRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleExtraImages} style={{ display: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                    <input type="checkbox" id="vis" checked={productForm.isVisible} onChange={e => setProductForm({ ...productForm, isVisible: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label htmlFor="vis" style={{ fontSize: 14, color: '#374151', cursor: 'pointer' }}>Visible to customers</label>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                    <button onClick={saveProduct} style={btnPrimary}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                    <button onClick={cancelProductForm} style={{ ...btnEdit, background: '#f3f4f6', color: '#374151', border: 'none' }}>Cancel</button>
                  </div>
                </div>
              )}

              {products.length === 0 && !showProductForm ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16, border: '1.5px solid #dbeafe', color: '#6b7280' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <p>No products yet. Click "Add New Product" to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                  {products.map(p => (
                    <div key={p._id} style={cardStyle}>
                      <div style={{ height: 140, borderRadius: 10, overflow: 'hidden', background: '#eef4ff', marginBottom: 8 }}>
                        <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      {p.images && p.images.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginBottom: 8, overflowX: 'auto' }}>
                          {p.images.map((img, i) => (
                            <img key={i} src={`${IMG_BASE}/uploads/${img}`} alt={`extra ${i}`}
                              style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #dbeafe', flexShrink: 0 }}
                              onError={e => e.target.style.display = 'none'} />
                          ))}
                        </div>
                      )}
                      {p.video && <div style={{ fontSize: 11, color: '#1a56db', marginBottom: 6, fontWeight: 700 }}>🎥 Video</div>}
                      <h4 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', margin: '0 0 4px 0', fontSize: 15 }}>{p.name}</h4>
                      <p style={{ fontSize: 11, color: p.isVisible ? '#10b981' : '#f59e0b', margin: '0 0 6px 0', fontWeight: 700 }}>{p.isVisible ? '✅ Visible' : '🔒 Hidden'}</p>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px 0', lineHeight: 1.5 }}>{p.description?.slice(0, 60)}...</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={{ ...btnEdit, flex: 1, fontSize: 12, padding: '7px 10px' }}>✏️ Edit</button>
                        <button onClick={() => deleteProduct(p._id)} style={{ ...btnDanger, flex: 1, fontSize: 12, padding: '7px 10px' }}>🗑️ Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MATERIALS ── */}
          {activeTab === 'materials' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', margin: 0 }}>Manage Materials & Prices</h2>
                <button onClick={openAddMat} style={btnPrimary}>+ Add Material</button>
              </div>

              <div style={{ ...cardStyle, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 16 }}>
                  {editingMaterial ? `Edit: ${editingMaterial.name}` : 'Add New Material'}
                </h3>
                <div className="mat-price-grid">
                  <div>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Name *</label>
                    <input style={inp} value={matForm.name} onChange={e => setMatForm({ ...matForm, name: e.target.value })} placeholder="e.g., Wood, Metal" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Price (₹) *</label>
                    <input style={inp} type="number" min="1" value={matForm.price} onChange={e => setMatForm({ ...matForm, price: e.target.value })} placeholder="Enter price" />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Description</label>
                  <input style={inp} value={matForm.description} onChange={e => setMatForm({ ...matForm, description: e.target.value })} placeholder="Brief description" />
                </div>

                {/* Circle color only - no rectangle */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Circle Color</label>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10 }}>
                    <input type="color" value={matForm.color} onChange={e => setMatForm({ ...matForm, color: e.target.value })}
                      style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }} id="colorPicker" />
                    <div
                      onClick={() => document.getElementById('colorPicker').click()}
                      style={{ width: 52, height: 52, borderRadius: '50%', background: matForm.color, border: '3px solid #dbeafe', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform .2s' }}
                      title="Click to change color"
                    />
                    <div>
                      <div style={{ fontSize: 13, color: '#374151', fontWeight: 700 }}>{matForm.color}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Click circle to pick color</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={saveMaterial} style={btnPrimary}>{editingMaterial ? 'Update Material' : 'Add Material'}</button>
                  {editingMaterial && (
                    <button onClick={() => { setEditingMaterial(null); setMatForm(EMPTY_MAT); }}
                      style={{ ...btnEdit, background: '#f3f4f6', color: '#374151', border: 'none' }}>Cancel</button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {materials.map(m => (
                  <div key={m._id} className="mat-row" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                    {/* Circle only */}
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: m.color, border: '2px solid #dbeafe', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 15 }}>{m.name}</span>
                        {m.isDefault && <span style={{ fontSize: 10, background: '#eef4ff', color: '#1a56db', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>Default</span>}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{m.description}</div>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#1a56db', fontWeight: 700, flexShrink: 0 }}>₹{m.price}</div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => openEditMat(m)} style={{ ...btnEdit, padding: '6px 10px', fontSize: 12 }}>✏️</button>
                      <button onClick={() => deleteMat(m)}
                        style={{ ...btnDanger, padding: '6px 10px', fontSize: 12, opacity: m.isDefault ? 0.4 : 1, cursor: m.isDefault ? 'not-allowed' : 'pointer' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', margin: 0 }}>All Orders</h2>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Total: <strong style={{ color: '#0e3a8c' }}>{orders.length}</strong></div>
                  <button onClick={fetchAll} style={{ ...btnEdit, fontSize: 12 }}>🔄 Refresh</button>
                </div>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16, color: '#6b7280', border: '1.5px solid #dbeafe' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                  <p>No orders yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.map(o => (
                    <div key={o._id} style={{ ...cardStyle, position: 'relative' }}>
                      <div className="order-actions">
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { setMessageOrder(o); setMessageText(''); }}
                            style={{ background: '#eef4ff', color: '#1a56db', border: '1.5px solid #dbeafe', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                            📧 Msg
                          </button>
                          <button onClick={() => deleteOrder(o._id)} style={{ ...btnDanger, padding: '6px 10px', fontSize: 12 }}>
                            🗑️ Del
                          </button>
                        </div>

                        {/* Permanent message sent indicator from DB */}
                        {o.messageSent?.sent && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#d1fae5', padding: '4px 10px', borderRadius: 8, marginTop: 6 }}>
                            <span style={{ fontSize: 14 }}>✅</span>
                            <div>
                              <div style={{ fontSize: 11, color: '#065f46', fontWeight: 700 }}>Message sent</div>
                              <div style={{ fontSize: 10, color: '#065f46' }}>
                                {new Date(o.messageSent.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="order-card-grid">
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Customer</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 14, marginBottom: 3 }}>👤 {o.customer?.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2, wordBreak: 'break-all' }}>📧 {o.customer?.email}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>📱 {o.customer?.phone || 'N/A'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Product</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 14, marginBottom: 3 }}>{o.product?.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{o.product?.description?.slice(0, 50)}...</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Material</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 14, marginBottom: 4 }}>{o.material?.name}</div>
                          <div style={{ fontSize: 22, color: '#1a56db', fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>₹{o.material?.price}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Date</div>
                          <div style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>
                            📅 {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: o.status === 'Pending' ? '#fef3c7' : o.status === 'Processing' ? '#dbeafe' : o.status === 'Delivered' ? '#d1fae5' : '#fee2e2', color: o.status === 'Pending' ? '#92400e' : o.status === 'Processing' ? '#1e40af' : o.status === 'Delivered' ? '#065f46' : '#dc2626' }}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── FEEDBACK ── */}
          {activeTab === 'feedback' && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', marginBottom: 20 }}>Manage Feedback</h2>
              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16, color: '#6b7280', border: '1.5px solid #dbeafe' }}>
                  <p>No feedback submitted yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {feedbacks.map(f => (
                    <div key={f._id} style={{ ...cardStyle, borderLeft: `4px solid ${f.approved ? '#10b981' : '#f59e0b'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 14 }}>{f.name}</span>
                            <span style={{ fontSize: 11, color: '#6b7280', wordBreak: 'break-all' }}>{f.email}</span>
                          </div>
                          <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 6 }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                          <p style={{ color: '#374151', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 6px 0' }}>"{f.message}"</p>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(f.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, background: f.approved ? '#d1fae5' : '#fef3c7', color: f.approved ? '#065f46' : '#92400e', fontSize: 11, fontWeight: 700 }}>
                            {f.approved ? '✅ Live' : '⏳ Pending'}
                          </span>
                          <button onClick={() => toggleFeedback(f._id, !f.approved)} style={{ ...f.approved ? btnDanger : btnEdit, padding: '6px 10px', fontSize: 12 }}>
                            {f.approved ? 'Hide' : '✅'}
                          </button>
                          <button onClick={() => deleteFeedback(f._id)} style={{ ...btnDanger, padding: '6px 10px', fontSize: 12 }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ABOUT US ── */}
          {activeTab === 'about' && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', marginBottom: 20 }}>Edit About Us</h2>
              <div style={cardStyle}>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 10, marginTop: 0 }}>This text appears on the About Us page visible to all visitors.</p>
                <textarea value={aboutText} onChange={e => setAboutText(e.target.value)}
                  style={{ ...inp, height: 280, resize: 'vertical', fontSize: 14, lineHeight: 1.8 }}
                  placeholder="Write your About Us content here..." />
                <button onClick={saveAbout} style={{ ...btnPrimary, marginTop: 14 }}>Save Changes</button>
              </div>
            </div>
          )}

          {/* ── CONTACT ── */}
          {activeTab === 'contact' && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0e3a8c', marginBottom: 20 }}>Edit Contact Info</h2>
              <div style={cardStyle}>
                {[['Phone Number', 'phone', '📱', '+91 XXXXX XXXXX'], ['Email Address', 'email', '📧', 'productpotter@gmail.com'], ['WhatsApp Number', 'whatsapp', '💬', '+91 XXXXX XXXXX'], ['Instagram Handle', 'instagram', '📸', '@pottersproductions'], ['Business Address', 'address', '📍', 'City, State, India']].map(([label, field, icon, ph]) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{icon} {label}</label>
                    <input style={inp} value={contactInfo[field] || ''} onChange={e => setContactInfo({ ...contactInfo, [field]: e.target.value })} placeholder={ph} />
                  </div>
                ))}
                <button onClick={saveContact} style={btnPrimary}>Save Contact Info</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}