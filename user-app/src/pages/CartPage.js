import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localCart } from '../services/api';

const CAT_ACCENT = {
  Phones:      { bg:'#e8f4fd' },
  Laptops:     { bg:'#eafaf1' },
  Gadgets:     { bg:'#fff8e1' },
  Accessories: { bg:'#fce4ec' },
};

const CartPage = ({ onToast }) => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { setCart(localCart.get()); }, []);

  const update = (id, qty) => {
    const c = localCart.get()
      .map(i => i.id === id ? { ...i, quantity: qty } : i)
      .filter(i => i.quantity > 0);
    localCart.set(c);
    setCart(c);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const remove = (id, name) => {
    const c = localCart.get().filter(i => i.id !== id);
    localCart.set(c);
    setCart(c);
    window.dispatchEvent(new Event('cartUpdated'));
    onToast?.(`Removed ${name}`, 'info');
  };

  const total   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = Math.round(total * 0.05);
  const items   = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (cart.length === 0) return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="card border-0 shadow-sm rounded-3 text-center py-5 px-4" style={{ maxWidth:400 }}>
        <div style={{ fontSize:'5rem' }}>🛒</div>
        <h5 className="fw-bold mt-3 mb-2">Your cart is empty!</h5>
        <p className="text-muted small mb-4">
          Looks like you haven't added anything yet.<br/>
          Explore our tech products and fill it up!
        </p>
        <button
          className="btn fw-bold rounded-pill px-5 py-2"
          style={{ background:'linear-gradient(90deg,#ff9f00,#ff6d00)', color:'#fff', border:'none' }}
          onClick={() => navigate('/products')}>
          🛍️ Browse Products
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

      {/* ── Header bar ── */}
      <div className="card border-0 shadow-sm mb-3 rounded-3"
        style={{ background:'linear-gradient(90deg,#1a1a1a,#2d2d2d)' }}>
        <div className="card-body py-3 px-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h5 className="fw-bold text-white mb-0">🛒 Shopping Cart</h5>
              <small style={{ color:'rgba(255,255,255,0.55)' }}>
                {cart.length} product{cart.length>1?'s':''} · {items} item{items>1?'s':''} total
              </small>
            </div>
            <button
              className="btn btn-sm fw-bold rounded-pill px-4"
              style={{ background:'#ff9f00', color:'#fff', border:'none' }}
              onClick={() => navigate('/products')}>
              + Add More
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">

        {/* ── Cart items ── */}
        <div className="col-lg-8">

          {/* Free delivery banner */}
          <div className="rounded-3 px-3 py-2 mb-3 d-flex align-items-center gap-2"
            style={{ background:'#e8f5e9', border:'1px solid #a5d6a7' }}>
            <span style={{ fontSize:'1.2rem' }}>🚚</span>
            <span className="small fw-semibold" style={{ color:'#1b5e20' }}>
              Your order qualifies for FREE delivery!
            </span>
          </div>

          {cart.map((item, idx) => {
            const acBg = (CAT_ACCENT[item.category] || { bg:'#f5f5f5' }).bg;
            return (
              <div key={item.id} className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden"
                style={{ border:'1px solid #e0e0e0' }}>

                {/* Top accent line */}
                <div style={{ height:3, background: idx%2===0
                  ? 'linear-gradient(90deg,#2874f0,#0062cc)'
                  : 'linear-gradient(90deg,#26a541,#00c853)' }}/>

                <div className="card-body p-3">
                  <div className="d-flex gap-3 align-items-start">

                    {/* Product image tile */}
                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width:80, height:80, background:acBg, fontSize:'2.8rem' }}>
                      {item.emoji}
                    </div>

                    {/* Product info */}
                    <div className="flex-grow-1">
                      <div className="fw-bold mb-1" style={{ color:'#212121', fontSize:'0.95rem', lineHeight:1.3 }}>
                        {item.name}
                      </div>
                      <div className="d-flex gap-2 mb-2 flex-wrap">
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background:acBg, color:'#333', border:'1px solid #ddd', fontSize:'0.65rem' }}>
                          {item.category}
                        </span>
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background:'#f5f5f5', color:'#555', border:'1px solid #ddd', fontSize:'0.65rem' }}>
                          {item.brand}
                        </span>
                        <span className="text-success fw-semibold" style={{ fontSize:'0.72rem' }}>
                          ✅ In Stock
                        </span>
                      </div>

                      {/* Price */}
                      <div className="fw-bold" style={{ fontSize:'1.1rem', color:'#212121' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                        <span className="text-muted fw-normal ms-2" style={{ fontSize:'0.75rem' }}>per unit</span>
                      </div>

                      {/* Subtotal */}
                      {item.quantity > 1 && (
                        <div style={{ fontSize:'0.78rem', color:'#26a541', fontWeight:600 }}>
                          Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Right: qty + remove */}
                    <div className="d-flex flex-column align-items-end gap-2">

                      {/* Quantity stepper */}
                      <div className="d-flex align-items-center gap-0 rounded-3 overflow-hidden"
                        style={{ border:'1.5px solid #e0e0e0' }}>
                        <button
                          className="btn btn-sm px-3 py-1 fw-bold"
                          style={{ background:'#f5f5f5', border:'none', color:'#333', fontSize:'1rem' }}
                          onClick={() => update(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="fw-bold px-3 py-1"
                          style={{ background:'#fff', minWidth:36, textAlign:'center', fontSize:'0.95rem', color:'#212121' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm px-3 py-1 fw-bold"
                          style={{ background:'#f5f5f5', border:'none', color:'#333', fontSize:'1rem' }}
                          onClick={() => update(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        className="btn btn-sm rounded-pill px-3"
                        style={{ background:'#fce4ec', color:'#c62828', border:'1px solid #ef9a9a', fontSize:'0.75rem', fontWeight:600 }}
                        onClick={() => remove(item.id, item.name)}>
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue shopping */}
          <button
            className="btn w-100 fw-semibold rounded-3 py-2"
            style={{ background:'#fff', border:'1.5px dashed #2874f0', color:'#2874f0', fontSize:'0.88rem' }}
            onClick={() => navigate('/products')}>
            ← Continue Shopping
          </button>
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden"
            style={{ position:'sticky', top:20 }}>

            {/* Orange accent bar */}
            <div style={{ height:4, background:'linear-gradient(90deg,#ff9f00,#ff6d00)' }}/>

            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">🧾 Price Details</h6>

              {/* Item breakdown */}
              <div className="d-flex flex-column gap-2 mb-3">
                {cart.map(i => (
                  <div key={i.id} className="d-flex justify-content-between align-items-start gap-2">
                    <span className="text-muted small text-truncate" style={{ maxWidth:160 }}>
                      {i.emoji} {i.name} ×{i.quantity}
                    </span>
                    <span className="fw-semibold small flex-shrink-0">
                      ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dashed divider */}
              <div style={{ borderTop:'1px dashed #e0e0e0', margin:'0.75rem 0' }}/>

              {/* Totals */}
              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Price ({items} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Delivery Charges</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Discount (5%)</span>
                  <span className="fw-semibold" style={{ color:'#26a541' }}>
                    − ₹{savings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Solid divider */}
              <div style={{ borderTop:'2px solid #e0e0e0', paddingTop:'0.75rem', marginBottom:'0.75rem' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total Amount</span>
                  <span className="fw-bold" style={{ fontSize:'1.25rem', color:'#212121' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Savings highlight */}
              <div className="rounded-3 px-3 py-2 mb-3 text-center"
                style={{ background:'#e8f5e9', border:'1px solid #a5d6a7' }}>
                <span className="small fw-semibold" style={{ color:'#1b5e20' }}>
                  🎁 You will save ₹{savings.toLocaleString('en-IN')} on this order!
                </span>
              </div>

              {/* Checkout button */}
              <button
                className="btn btn-lg fw-bold w-100 rounded-3 py-2"
                style={{
                  background:'linear-gradient(90deg,#ff9f00,#ff6d00)',
                  color:'#fff', border:'none', fontSize:'1rem',
                  boxShadow:'0 4px 16px #ff9f0066',
                }}
                onClick={() => navigate('/checkout')}>
                💳 Proceed to Checkout
              </button>

              {/* Trust badges */}
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                {['🔒 Secure', '↩️ Easy Returns', '🚚 Free Delivery'].map((b,i) => (
                  <span key={i} style={{ fontSize:'0.68rem', color:'#888', fontWeight:600 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;