import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const inp = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #dbeafe', borderRadius: 8,
  fontSize: 14, fontFamily: "'Lato',sans-serif", outline: 'none', background: '#f8faff',
  marginTop: 4, boxSizing: 'border-box', color: '#1f2937'
};
const cardStyle = {
  background: '#fff', borderRadius: 16, padding: '28px',
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
  // track which order IDs have had a message sent — persisted in localStorage
  const [sentOrders, setSentOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sentOrders');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

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
    setExtraFiles(files);
    setExtraPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.description) return toast.error('Name and description are required.');
    if (!editingProduct && !productFile) return toast.error('Please select a product image.');
    const fd = new FormData();
    Object.entries(productForm).forEach(([k, v]) => fd.append(k, v));
    if (productFile) fd.append('image', productFile);
    if (videoFile) fd.append('video', videoFile);
    extraFiles.forEach(f => fd.append('images', f));
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added! Visible to customers now.');
      }
      cancelProductForm();
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product.'); }
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
      // mark this order as having a sent message and persist to localStorage
      setSentOrders(prev => {
        const updated = new Set([...prev, messageOrder._id]);
        try { localStorage.setItem('sentOrders', JSON.stringify([...updated])); } catch {}
        return updated;
      });
      setMessageText('__SENT__');
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

  const btnPrimary = { background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 13 };
  const btnDanger = { background: '#fee2e2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 7, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" };
  const btnEdit = { background: '#eef4ff', color: '#1a56db', border: '1.5px solid #dbeafe', borderRadius: 7, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>

      {/* Message Modal */}
      {messageOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {messageText === '__SENT__' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#10b981', marginTop: 0, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
                  Your message has been sent successfully to<br />
                  <strong style={{ color: '#0e3a8c' }}>{messageOrder.customer.email}</strong>
                </p>
                <button
                  onClick={() => { setMessageOrder(null); setMessageText(''); }}
                  style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 15 }}>
                  OK
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 8 }}>Send Message to Customer</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
                  To: <strong>{messageOrder.customer.name}</strong> ({messageOrder.customer.email})<br />
                  Order: <strong>{messageOrder.product.name}</strong>
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>From</label>
                  <input style={{ ...inp, background: '#f0f0f0', color: '#888' }} value="productpotter@gmail.com" readOnly />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>To</label>
                  <input style={{ ...inp, background: '#f0f0f0', color: '#888' }} value={messageOrder.customer.email} readOnly />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Message *</label>
                  <textarea
                    style={{ ...inp, height: 120, resize: 'vertical' }}
                    placeholder="Type your message to the customer..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={sendMessage} disabled={sendingMessage}
                    style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: sendingMessage ? 'not-allowed' : 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 13, opacity: sendingMessage ? 0.7 : 1, flex: 1 }}>
                    {sendingMessage ? '⏳ Sending...' : '📧 Send Message'}
                  </button>
                  <button onClick={() => { setMessageOrder(null); setMessageText(''); }}
                    style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0e3a8c,#1a56db)', padding: '28px 32px', color: '#fff' }}>
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
      <div style={{ background: '#fff', borderBottom: '1.5px solid #dbeafe', padding: '16px 32px', display: 'flex', gap: 40, overflowX: 'auto' }}>
        {[['📦', products.length, 'Products'], ['🛒', orders.length, 'Orders'], ['💬', feedbacks.length, 'Feedbacks'], ['✅', feedbacks.filter(f => f.approved).length, 'Approved']].map(([icon, count, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 100 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0e3a8c' }}>{count}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 180px)' }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: '#fff', borderRight: '1.5px solid #dbeafe', padding: '24px 0', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ width: '100%', padding: '13px 24px', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === t.id ? 700 : 400, fontFamily: "'Lato',sans-serif", background: activeTab === t.id ? '#eef4ff' : 'transparent', color: activeTab === t.id ? '#1a56db' : '#374151', borderLeft: activeTab === t.id ? '3px solid #1a56db' : '3px solid transparent', transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', margin: 0 }}>Manage Products</h2>
                <button onClick={openAdd} style={btnPrimary}>+ Add New Product</button>
              </div>

              {showProductForm && (
                <div style={{ ...cardStyle, marginBottom: 28 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 20 }}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
                    {[['Product Name *', 'name'], ['Bible Verse', 'bibleVerse'], ['Inspirational Sentence', 'inspirationalSentence'], ['Color Description', 'colorDescription'], ['Design Description', 'designDescription'], ['Theme Description', 'themeDescription']].map(([label, field]) => (
                      <div key={field}>
                        <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
                        <input style={inp} value={productForm[field]} onChange={e => setProductForm({ ...productForm, [field]: e.target.value })} placeholder={label.replace(' *', '')} />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Description *</label>
                    <textarea style={{ ...inp, height: 100, resize: 'vertical' }} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description" />
                  </div>

                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                        Main Image {!editingProduct && '*'}
                      </label>
                      <div onClick={() => fileRef.current.click()}
                        style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8faff', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {productPreview ? (
                          <img src={productPreview} alt="preview" style={{ width: '100%', maxHeight: 140, objectFit: 'contain', borderRadius: 8 }} />
                        ) : (
                          <div>
                            <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload main image</div>
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>JPG, PNG, WEBP</div>
                          </div>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                        Video (Optional)
                      </label>
                      <div onClick={() => videoRef.current.click()}
                        style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8faff', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {videoPreview ? (
                          <video src={videoPreview} style={{ width: '100%', maxHeight: 140, borderRadius: 8 }} controls />
                        ) : (
                          <div>
                            <div style={{ fontSize: 28, marginBottom: 6 }}>🎥</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload video</div>
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>MP4, MOV, AVI, MKV</div>
                          </div>
                        )}
                      </div>
                      <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                      Additional Images (Optional — up to 10)
                    </label>
                    <div onClick={() => extraImagesRef.current.click()}
                      style={{ border: '2px dashed #dbeafe', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f8faff' }}>
                      {extraPreviews.length > 0 ? (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                          {extraPreviews.map((src, i) => (
                            <img key={i} src={src} alt={`extra ${i}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #dbeafe' }} />
                          ))}
                          <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef4ff', borderRadius: 8, border: '2px dashed #1a56db', fontSize: 24, color: '#1a56db', cursor: 'pointer', fontWeight: 700 }}>+</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>Click to upload multiple images</div>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Customer can scroll through all images</div>
                        </div>
                      )}
                    </div>
                    <input ref={extraImagesRef} type="file" accept="image/*" multiple onChange={handleExtraImages} style={{ display: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                    <input type="checkbox" id="vis" checked={productForm.isVisible} onChange={e => setProductForm({ ...productForm, isVisible: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label htmlFor="vis" style={{ fontSize: 14, color: '#374151', cursor: 'pointer' }}>Visible to customers</label>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={saveProduct} style={btnPrimary}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                    <button onClick={cancelProductForm} style={{ ...btnEdit, background: '#f3f4f6', color: '#374151', border: 'none' }}>Cancel</button>
                  </div>
                </div>
              )}

              {products.length === 0 && !showProductForm ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 16, border: '1.5px solid #dbeafe', color: '#6b7280' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <p>No products yet. Click "Add New Product" to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
                  {products.map(p => (
                    <div key={p._id} style={cardStyle}>
                      <div style={{ height: 160, borderRadius: 10, overflow: 'hidden', background: '#eef4ff', marginBottom: 8 }}>
                        <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      {p.images && p.images.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
                          {p.images.map((img, i) => (
                            <img key={i} src={`${IMG_BASE}/uploads/${img}`} alt={`extra ${i}`}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #dbeafe', flexShrink: 0 }}
                              onError={e => e.target.style.display = 'none'} />
                          ))}
                        </div>
                      )}
                      {p.video && (
                        <div style={{ fontSize: 11, color: '#1a56db', marginBottom: 8, fontWeight: 700 }}>🎥 Video attached</div>
                      )}
                      <h4 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', margin: '0 0 4px 0', fontSize: 16 }}>{p.name}</h4>
                      <p style={{ fontSize: 12, color: p.isVisible ? '#10b981' : '#f59e0b', margin: '0 0 8px 0', fontWeight: 700 }}>{p.isVisible ? '✅ Visible' : '🔒 Hidden'}</p>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 14px 0', lineHeight: 1.6 }}>{p.description?.slice(0, 70)}...</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ ...btnEdit, flex: 1 }}>✏️ Edit</button>
                        <button onClick={() => deleteProduct(p._id)} style={{ ...btnDanger, flex: 1 }}>🗑️ Delete</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', margin: 0 }}>Manage Materials & Prices</h2>
                <button onClick={openAddMat} style={btnPrimary}>+ Add Material</button>
              </div>

              <div style={{ ...cardStyle, marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#0e3a8c', marginTop: 0, marginBottom: 20 }}>
                  {editingMaterial ? `Edit: ${editingMaterial.name}` : 'Add New Material'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Name *</label>
                    <input style={inp} value={matForm.name} onChange={e => setMatForm({ ...matForm, name: e.target.value })} placeholder="e.g., Wood, Metal, Glass" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Price (₹) *</label>
                    <input style={inp} type="number" min="1" value={matForm.price} onChange={e => setMatForm({ ...matForm, price: e.target.value })} placeholder="Enter price in rupees" />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Description</label>
                  <input style={inp} value={matForm.description} onChange={e => setMatForm({ ...matForm, description: e.target.value })} placeholder="Brief description of this material" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Circle Color</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <input type="color" value={matForm.color} onChange={e => setMatForm({ ...matForm, color: e.target.value })}
                      style={{ width: 52, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: matForm.color, border: '2px solid #dbeafe' }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{matForm.color}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={saveMaterial} style={btnPrimary}>{editingMaterial ? 'Update Material' : 'Add Material'}</button>
                  {editingMaterial && (
                    <button onClick={() => { setEditingMaterial(null); setMatForm(EMPTY_MAT); }}
                      style={{ ...btnEdit, background: '#f3f4f6', color: '#374151', border: 'none' }}>Cancel</button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {materials.map(m => (
                  <div key={m._id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: m.color, border: '2px solid #dbeafe', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 16 }}>{m.name}</span>
                        {m.isDefault && <span style={{ fontSize: 11, background: '#eef4ff', color: '#1a56db', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>Default</span>}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>{m.description}</div>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#1a56db', fontWeight: 700, minWidth: 80, textAlign: 'right' }}>₹{m.price}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEditMat(m)} style={btnEdit}>✏️ Edit</button>
                      <button onClick={() => deleteMat(m)}
                        style={{ ...btnDanger, opacity: m.isDefault ? 0.4 : 1, cursor: m.isDefault ? 'not-allowed' : 'pointer' }}>
                        🗑️ {m.isDefault ? 'Protected' : 'Delete'}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', margin: 0 }}>All Orders</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Total: <strong style={{ color: '#0e3a8c' }}>{orders.length}</strong></div>
                  <button onClick={fetchAll} style={{ ...btnEdit, fontSize: 12 }}>🔄 Refresh</button>
                </div>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 16, color: '#6b7280', border: '1.5px solid #dbeafe' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                  <p>No orders yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {orders.map(o => (
                    <div key={o._id} style={{ ...cardStyle, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                        {/* CHANGED: Message button shows Message ✓ style after sending */}
                        <button onClick={() => { setMessageOrder(o); setMessageText(''); }}
                          style={{
                            background: '#fff',
                            color: '#1a56db',
                            border: sentOrders.has(o._id) ? '2px solid #1a56db' : '1.5px solid #dbeafe',
                            borderRadius: 8,
                            padding: sentOrders.has(o._id) ? '6px 16px' : '6px 12px',
                            fontSize: sentOrders.has(o._id) ? 13 : 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: "'Lato',sans-serif",
                            background: sentOrders.has(o._id) ? '#fff' : '#eef4ff',
                          }}>
                          {sentOrders.has(o._id) ? 'Message ✓' : '📧 Message'}
                        </button>
                        <button onClick={() => deleteOrder(o._id)} style={{ ...btnDanger, padding: '6px 12px' }}>
                          🗑️ Delete
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20, paddingRight: 180 }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Customer</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 15, marginBottom: 4 }}>👤 {o.customer?.name}</div>
                          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 3 }}>📧 {o.customer?.email}</div>
                          <div style={{ fontSize: 13, color: '#6b7280' }}>📱 {o.customer?.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Product</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 15, marginBottom: 4 }}>{o.product?.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{o.product?.description?.slice(0, 60)}...</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Material & Price</div>
                          <div style={{ fontWeight: 700, color: '#0e3a8c', fontSize: 15, marginBottom: 6 }}>{o.material?.name}</div>
                          <div style={{ fontSize: 26, color: '#1a56db', fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>₹{o.material?.price}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#1a56db', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Date & Status</div>
                          <div style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>
                            📅 {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: o.status === 'Pending' ? '#fef3c7' : o.status === 'Processing' ? '#dbeafe' : o.status === 'Delivered' ? '#d1fae5' : '#fee2e2', color: o.status === 'Pending' ? '#92400e' : o.status === 'Processing' ? '#1e40af' : o.status === 'Delivered' ? '#065f46' : '#dc2626' }}>
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
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', marginBottom: 28 }}>Manage Feedback</h2>
              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 16, color: '#6b7280', border: '1.5px solid #dbeafe' }}>
                  <p>No feedback submitted yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {feedbacks.map(f => (
                    <div key={f._id} style={{ ...cardStyle, borderLeft: `4px solid ${f.approved ? '#10b981' : '#f59e0b'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, color: '#0e3a8c' }}>{f.name}</span>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>{f.email}</span>
                            <span style={{ color: '#f59e0b' }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                          </div>
                          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 6px 0' }}>"{f.message}"</p>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(f.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '4px 12px', borderRadius: 20, background: f.approved ? '#d1fae5' : '#fef3c7', color: f.approved ? '#065f46' : '#92400e', fontSize: 12, fontWeight: 700 }}>
                            {f.approved ? '✅ Published' : '⏳ Pending'}
                          </span>
                          <button onClick={() => toggleFeedback(f._id, !f.approved)} style={f.approved ? btnDanger : btnEdit}>
                            {f.approved ? 'Hide' : '✅ Approve'}
                          </button>
                          <button onClick={() => deleteFeedback(f._id)} style={btnDanger}>🗑️ Delete</button>
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
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', marginBottom: 28 }}>Edit About Us</h2>
              <div style={cardStyle}>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, marginTop: 0 }}>This text appears on the About Us page visible to all visitors.</p>
                <textarea value={aboutText} onChange={e => setAboutText(e.target.value)}
                  style={{ ...inp, height: 360, resize: 'vertical', fontSize: 14, lineHeight: 1.8 }}
                  placeholder="Write your About Us content here..." />
                <button onClick={saveAbout} style={{ ...btnPrimary, marginTop: 16 }}>Save Changes</button>
              </div>
            </div>
          )}

          {/* ── CONTACT ── */}
          {activeTab === 'contact' && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#0e3a8c', marginBottom: 28 }}>Edit Contact Info</h2>
              <div style={cardStyle}>
                {[['Phone Number', 'phone', '📱', '+91 XXXXX XXXXX'], ['Email Address', 'email', '📧', 'productpotter@gmail.com'], ['WhatsApp Number', 'whatsapp', '💬', '+91 XXXXX XXXXX'], ['Instagram Handle', 'instagram', '📸', '@pottersproductions'], ['Business Address', 'address', '📍', 'City, State, India']].map(([label, field, icon, ph]) => (
                  <div key={field} style={{ marginBottom: 20 }}>
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
