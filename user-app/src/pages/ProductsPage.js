import { useState, useCallback, useRef } from 'react';
import { products, categories, getCategoryColor } from '../data/products';
import { analyticsAPI, localCart, localEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Category accent colours (Flipkart/Amazon style — clean light palette)
const CAT_ACCENT = {
  Phones:      { bg: '#e8f4fd', border: '#2874f0', tag: '#2874f0', tagText: '#fff' },
  Laptops:     { bg: '#eafaf1', border: '#26a541', tag: '#26a541', tagText: '#fff' },
  Gadgets:     { bg: '#fff8e1', border: '#ff9f00', tag: '#ff9f00', tagText: '#fff' },
  Accessories: { bg: '#fce4ec', border: '#e91e63', tag: '#e91e63', tagText: '#fff' },
  All:         { bg: '#f5f5f5', border: '#e0e0e0', tag: '#555',    tagText: '#fff' },
};

const accent = (category) => CAT_ACCENT[category] || CAT_ACCENT.All;

const Stars = ({ rating, size = '0.8rem' }) => (
  <span style={{ fontSize: size, color: '#ff9f00', letterSpacing: 1 }}>
    {'★'.repeat(Math.round(rating))}
    <span style={{ color: '#ccc' }}>{'★'.repeat(5 - Math.round(rating))}</span>
    <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 4 }}>{rating}</span>
  </span>
);

const ProductsPage = ({ onToast }) => {
  const { user } = useAuth();
  const [category, setCategory] = useState('All');
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);
  const [sortBy,   setSortBy]   = useState('default');

  const sessionId = useRef(
    sessionStorage.getItem('u_session') || (() => {
      const id = 'sess_' + Math.random().toString(36).slice(2);
      sessionStorage.setItem('u_session', id);
      return id;
    })()
  ).current;

  const track = useCallback(async (product, actionType) => {
    const ev = {
      sessionId,
      userId:      user?.id,
      productId:   product.id,
      productName: product.name,
      category:    product.category,
      price:       product.price,
      emoji:       product.emoji,
      brand:       product.brand,
      actionType,
    };
    localEvents.add({ ...ev, timestamp: new Date().toISOString() });
    window.dispatchEvent(new Event('eventsUpdated'));
    try { await analyticsAPI.track(ev); } catch {}
  }, [user, sessionId]);

  const viewProduct = (p) => { setModal(p); track(p, 'product_viewed'); };

  const addToCart = (p) => {
    const cart = localCart.get();
    const ex = cart.find(i => i.id === p.id);
    if (ex) ex.quantity++;
    else cart.push({ ...p, quantity: 1 });
    localCart.set(cart);
    window.dispatchEvent(new Event('cartUpdated'));
    track(p, 'add_to_cart');
    onToast?.(`🛒 ${p.name} added to cart`, 'success');
  };

  let filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  if (sortBy === 'price_asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortBy === 'price_desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortBy === 'rating')     filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '1rem' }}>

      {/* ── Top search bar — Amazon/Flipkart style ── */}
      <div className="card border-0 shadow-sm mb-3 rounded-3"
        style={{ background: 'linear-gradient(90deg,#2874f0,#0062cc)' }}>
        <div className="card-body py-3 px-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="flex-grow-1">
              <h5 className="fw-bold text-white mb-0">🛍️ TechGear Store</h5>
              <small style={{ color: 'rgba(255,255,255,0.75)' }}>
                {filtered.length} of {products.length} products
              </small>
            </div>
            <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: 500 }}>
              <input
                type="text"
                className="form-control rounded-pill shadow-sm"
                placeholder="🔍  Search products, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', fontSize: '0.9rem' }}
              />
              <select
                className="form-select rounded-pill shadow-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ maxWidth: 160, border: 'none', fontSize: '0.82rem' }}
              >
                <option value="default">Sort: Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {categories.map(c => {
          const ac = accent(c);
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="btn btn-sm fw-semibold rounded-pill"
              style={{
                background:   active ? ac.tag    : '#fff',
                color:        active ? ac.tagText : '#333',
                border:       `1.5px solid ${active ? ac.tag : '#ddd'}`,
                fontSize:     '0.8rem',
                padding:      '4px 14px',
                transition:   '0.2s',
                boxShadow:    active ? `0 2px 8px ${ac.tag}55` : 'none',
              }}>
              {c}
              <span className="ms-1" style={{ opacity: 0.75, fontSize: '0.72rem' }}>
                ({c === 'All' ? products.length : products.filter(p => p.category === c).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── No results ── */}
      {filtered.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '3.5rem' }}>🔍</div>
          <p className="text-muted mt-2">No products found for "<strong>{search}</strong>"</p>
          <button className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear filters
          </button>
        </div>
      )}

      {/* ── Product grid — Flipkart/Amazon card style ── */}
      <div className="row g-3">
        {filtered.map(p => {
          const ac = accent(p.category);
          return (
            <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
              <div
                className="h-100 d-flex flex-column bg-white rounded-3 overflow-hidden"
                style={{
                  border:     `1px solid #e0e0e0`,
                  transition: 'box-shadow 0.22s, transform 0.22s',
                  cursor:     'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Product image area — coloured bg like Flipkart */}
                <div
                  className="d-flex align-items-center justify-content-center position-relative"
                  style={{
                    background: ac.bg,
                    height: 160,
                    borderBottom: `2px solid ${ac.border}22`,
                  }}
                  onClick={() => viewProduct(p)}
                >
                  <span style={{ fontSize: '4.5rem' }}>{p.emoji}</span>

                  {/* Category tag top-left */}
                  <span
                    className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill fw-bold"
                    style={{
                      background: ac.tag,
                      color:      ac.tagText,
                      fontSize:   '0.6rem',
                      letterSpacing: '0.5px',
                    }}>
                    {p.category.toUpperCase()}
                  </span>

                  {/* Rating badge top-right */}
                  <span
                    className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
                    style={{ background: '#388e3c', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>
                    ★ {p.rating}
                  </span>
                </div>

                {/* Card body */}
                <div className="d-flex flex-column flex-grow-1 p-3">

                  {/* Brand */}
                  <div className="text-muted fw-semibold mb-1"
                    style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {p.brand}
                  </div>

                  {/* Product name */}
                  <h6
                    className="fw-bold mb-1"
                    style={{ fontSize: '0.88rem', color: '#212121', lineHeight: 1.4,
                             display: '-webkit-box', WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.name}
                  </h6>

                  {/* Specs */}
                  <p className="text-muted mb-2"
                    style={{ fontSize: '0.72rem', lineHeight: 1.4, flexGrow: 1,
                             display: '-webkit-box', WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.specs}
                  </p>

                  {/* Stars */}
                  <div className="mb-2">
                    <Stars rating={p.rating} />
                  </div>

                  {/* Price row */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="fw-bold" style={{ fontSize: '1.15rem', color: '#212121' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-success fw-semibold" style={{ fontSize: '0.72rem' }}>
                      Free Delivery
                    </span>
                  </div>

                  {/* Action buttons — Flipkart style */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm flex-grow-1 fw-semibold rounded-pill"
                      style={{
                        background: '#fff',
                        border: `1.5px solid ${ac.border}`,
                        color: ac.border,
                        fontSize: '0.78rem',
                      }}
                      onClick={() => viewProduct(p)}>
                      View
                    </button>
                    <button
                      className="btn btn-sm flex-grow-1 fw-bold rounded-pill text-white"
                      style={{
                        background: `linear-gradient(135deg, ${ac.tag}, ${ac.border})`,
                        border: 'none',
                        fontSize: '0.78rem',
                        boxShadow: `0 2px 8px ${ac.tag}55`,
                      }}
                      onClick={() => addToCart(p)}>
                      🛒 Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal — Amazon product detail style ── */}
      {modal && (
        <div
          className="modal show d-block"
          style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1055 }}
          onClick={() => setModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 520 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">

              {/* Modal image header */}
              <div
                className="d-flex align-items-center justify-content-center position-relative py-4"
                style={{ background: accent(modal.category).bg, minHeight: 180 }}>
                <span style={{ fontSize: '7rem' }}>{modal.emoji}</span>
                <button
                  className="btn-close position-absolute top-0 end-0 m-3"
                  onClick={() => setModal(null)} />
              </div>

              {/* Modal body */}
              <div className="modal-body px-4 pb-0 pt-3">

                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    className="badge rounded-pill px-2 py-1"
                    style={{
                      background: accent(modal.category).tag,
                      color: accent(modal.category).tagText,
                      fontSize: '0.65rem',
                    }}>
                    {modal.category}
                  </span>
                  <span className="text-muted fw-semibold"
                    style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {modal.brand}
                  </span>
                </div>

                <h5 className="fw-bold mb-1" style={{ color: '#212121', lineHeight: 1.35 }}>
                  {modal.name}
                </h5>

                <div className="mb-2">
                  <Stars rating={modal.rating} size="0.95rem" />
                </div>

                {/* Specs box */}
                <div className="rounded-3 p-3 mb-3"
                  style={{ background: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                  <div className="fw-semibold mb-1" style={{ fontSize: '0.78rem', color: '#555' }}>
                    🔧 Specifications
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#333' }}>{modal.specs}</div>
                </div>

                {/* Price */}
                <div className="d-flex align-items-baseline gap-3 mb-1">
                  <span className="fw-bold" style={{ fontSize: '1.6rem', color: '#212121' }}>
                    ₹{modal.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-success fw-semibold small">✅ In Stock</span>
                </div>
                <div className="text-success small mb-3">🚚 Free delivery · Easy 10-day returns</div>
              </div>

              {/* Modal footer */}
              <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
                <button
                  className="btn fw-semibold flex-grow-1 rounded-pill"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${accent(modal.category).border}`,
                    color: accent(modal.category).border,
                  }}
                  onClick={() => setModal(null)}>
                  Close
                </button>
                <button
                  className="btn fw-bold flex-grow-1 rounded-pill text-white"
                  style={{
                    background: `linear-gradient(135deg, ${accent(modal.category).tag}, ${accent(modal.category).border})`,
                    border: 'none',
                    boxShadow: `0 3px 12px ${accent(modal.category).tag}66`,
                  }}
                  onClick={() => { addToCart(modal); setModal(null); }}>
                  🛒 Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;