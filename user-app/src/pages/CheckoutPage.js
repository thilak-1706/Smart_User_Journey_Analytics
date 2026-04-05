import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localCart, localEvents, localOrders, analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CAT_ACCENT = {
  Phones:      { bg:'#e8f4fd' },
  Laptops:     { bg:'#eafaf1' },
  Gadgets:     { bg:'#fff8e1' },
  Accessories: { bg:'#fce4ec' },
};

const CheckoutPage = ({ onToast }) => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const cart      = localCart.get();

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    address: '', city: '', pin: '', card: '', expiry: '', cvv: '',
    payMethod: 'card',
  });
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const total     = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings   = Math.round(total * 0.05);
  const delivery  = 0;
  const set       = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderId   = 'TG' + Date.now().toString().slice(-8);
    const sessionId = sessionStorage.getItem('u_session') || 'no-session';

    for (const item of cart) {
      const ev = {
        sessionId, userId: user?.id, productId: item.id, productName: item.name,
        category: item.category, price: item.price, quantity: item.quantity,
        emoji: item.emoji, brand: item.brand, actionType: 'purchase',
      };
      localEvents.add({ ...ev, timestamp: new Date().toISOString() });
      try { await analyticsAPI.track(ev); } catch {}
    }

    const order = {
      orderId, items: cart.map(i => ({ ...i })), total,
      delivery: { name: form.name, email: form.email, address: form.address, city: form.city, pin: form.pin },
      status: 'active', placedAt: new Date().toISOString(),
    };
    localOrders.add(order);
    setPlacedOrder(order);
    localCart.clear();
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('eventsUpdated'));
    window.dispatchEvent(new Event('ordersUpdated'));
    setLoading(false);
    setSuccess(true);
    onToast?.('🎉 Order placed successfully!', 'success');
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (cart.length === 0 && !success) return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="card border-0 shadow-sm rounded-3 text-center py-5 px-4" style={{ maxWidth:400 }}>
        <div style={{ fontSize:'4rem' }}>🛒</div>
        <h5 className="fw-bold mt-3 mb-2">Your cart is empty</h5>
        <p className="text-muted small mb-4">Add items to your cart before checking out.</p>
        <button className="btn fw-bold rounded-pill px-5 py-2"
          style={{ background:'linear-gradient(90deg,#ff9f00,#ff6d00)', color:'#fff', border:'none' }}
          onClick={() => navigate('/products')}>
          🛍️ Browse Products
        </button>
      </div>
    </div>
  );

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success && placedOrder) return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'2rem' }}>
      <div className="card border-0 shadow-sm rounded-3 text-center py-5 px-4" style={{ maxWidth:520, margin:'0 auto' }}>
        {/* Green top bar */}
        <div style={{ height:6, background:'linear-gradient(90deg,#26a541,#00c853)',
                      borderRadius:'12px 12px 0 0', margin:'-2rem -2rem 2rem' }}/>
        <div style={{ fontSize:'5rem' }}>🎉</div>
        <h4 className="fw-bold mt-3 mb-1" style={{ color:'#1b5e20' }}>Order Placed Successfully!</h4>
        <p className="text-muted small mb-3">
          Thank you, <strong>{user?.name}</strong>! Your order is confirmed.
        </p>

        {/* Order ID card */}
        <div className="rounded-3 py-3 px-4 mb-3 text-start"
          style={{ background:'#e8f5e9', border:'1px solid #a5d6a7' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Order ID</span>
            <span className="fw-bold" style={{ color:'#1b5e20', letterSpacing:'1px' }}>
              #{placedOrder.orderId}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Amount Paid</span>
            <span className="fw-bold" style={{ color:'#e65100', fontSize:'1.1rem' }}>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Estimated Delivery</span>
            <span className="fw-semibold small" style={{ color:'#1b5e20' }}>
              🚚 {new Date(Date.now()+5*24*60*60*1000).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
            </span>
          </div>
        </div>

        {/* Items summary */}
        <div className="text-start rounded-3 p-3 mb-4" style={{ background:'#f5f5f5', border:'1px solid #e0e0e0' }}>
          <div className="small fw-semibold text-muted mb-2">Items ordered</div>
          <div className="d-flex flex-wrap gap-2">
            {placedOrder.items.map((item,i) => (
              <div key={i} className="d-flex align-items-center gap-1 rounded-pill px-2 py-1"
                style={{ background:'#fff', border:'1px solid #e0e0e0', fontSize:'0.75rem' }}>
                <span>{item.emoji}</span>
                <span className="fw-semibold text-truncate" style={{ maxWidth:100 }}>{item.name}</span>
                <span className="text-muted">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <button className="btn fw-bold rounded-pill px-4"
            style={{ background:'linear-gradient(90deg,#ff9f00,#ff6d00)', color:'#fff', border:'none' }}
            onClick={() => navigate('/products')}>
            🛍️ Shop More
          </button>
          <button className="btn fw-bold rounded-pill px-4"
            style={{ background:'#1a1a1a', color:'#fff', border:'none' }}
            onClick={() => navigate('/orders')}>
            📦 My Orders
          </button>
        </div>
      </div>
    </div>
  );

  // ── Checkout form ───────────────────────────────────────────────────────────
  return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-3 rounded-3"
        style={{ background:'linear-gradient(90deg,#1a1a1a,#2d2d2d)' }}> 
        <div className="card-body py-3 px-4">
          <h5 className="fw-bold text-white mb-0">💳 Secure Checkout</h5>
          <small style={{ color:'rgba(255,255,255,0.55)' }}>
            {cart.length} item{cart.length>1?'s':''} · ₹{total.toLocaleString('en-IN')} total
          </small>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="d-flex align-items-center gap-0 mb-4 px-1" style={{ overflowX:'auto' }}>
        {['Cart', 'Delivery', 'Payment', 'Confirm'].map((step, i) => (
          <div key={i} className="d-flex align-items-center flex-shrink-0">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width:32, height:32, fontSize:'0.8rem',
                  background: i <= 2 ? '#26a541' : '#e0e0e0',
                  color:      i <= 2 ? '#fff'    : '#aaa',
                }}>
                {i <= 2 ? '✓' : i+1}
              </div>
              <div style={{ fontSize:'0.62rem', fontWeight:600, color:i<=2?'#26a541':'#aaa', marginTop:4, whiteSpace:'nowrap' }}>
                {step}
              </div>
            </div>
            {i < 3 && (
              <div style={{ height:3, width:48, background:i<2?'#26a541':'#e0e0e0', margin:'0 2px 20px' }}/>
            )}
          </div>
        ))}
      </div>

      <div className="row g-3">

        {/* ── Left: form ── */}
        <div className="col-lg-7">
          <form onSubmit={handleOrder}>

            {/* Delivery card */}
            <div className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
              <div style={{ height:4, background:'linear-gradient(90deg,#2874f0,#0062cc)' }}/>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width:26, height:26, background:'#2874f0', fontSize:'0.75rem' }}>1</span>
                  Delivery Details
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Full Name</label>
                    <input className="form-control rounded-3" value={form.name} onChange={set('name')} required
                      style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email</label>
                    <input type="email" className="form-control rounded-3" value={form.email} onChange={set('email')} required
                      style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Street Address</label>
                    <input className="form-control rounded-3" placeholder="House no., Street, Area"
                      value={form.address} onChange={set('address')} required
                      style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">City</label>
                    <input className="form-control rounded-3" value={form.city} onChange={set('city')} required
                      style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">PIN Code</label>
                    <input className="form-control rounded-3" maxLength={6} placeholder="6-digit PIN"
                      value={form.pin} onChange={set('pin')} required
                      style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment card */}
            <div className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
              <div style={{ height:4, background:'linear-gradient(90deg,#26a541,#00c853)' }}/>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width:26, height:26, background:'#26a541', fontSize:'0.75rem' }}>2</span>
                  Payment Method
                </h6>

                {/* Payment method tabs */}
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {[
                    { key:'card', label:'💳 Card' },
                    { key:'upi',  label:'📱 UPI'  },
                    { key:'cod',  label:'💵 COD'  },
                  ].map(m => (
                    <button key={m.key} type="button"
                      className="btn btn-sm fw-semibold rounded-pill"
                      style={{
                        background: form.payMethod===m.key ? '#1a1a1a' : '#fff',
                        color:      form.payMethod===m.key ? '#fff'    : '#333',
                        border:     `1.5px solid ${form.payMethod===m.key ? '#1a1a1a' : '#ddd'}`,
                        fontSize:   '0.8rem',
                      }}
                      onClick={() => setForm(f => ({ ...f, payMethod:m.key }))}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {form.payMethod === 'card' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Card Number</label>
                      <input className="form-control rounded-3" placeholder="1234 5678 9012 3456" maxLength={19}
                        value={form.card}
                        onChange={e => setForm(f => ({ ...f, card: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() }))}
                        required style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem', letterSpacing:'2px' }}/>
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-muted">Expiry Date</label>
                        <input className="form-control rounded-3" placeholder="MM / YY"
                          value={form.expiry} onChange={set('expiry')} required
                          style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-muted">CVV</label>
                        <input type="password" className="form-control rounded-3" placeholder="• • •"
                          maxLength={3} value={form.cvv} onChange={set('cvv')} required
                          style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem', letterSpacing:'4px' }}/>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3 p-2 rounded-3"
                      style={{ background:'#e8f5e9', border:'1px solid #a5d6a7' }}>
                      <span>🔒</span>
                      <span className="small text-muted">Your card information is encrypted and secure</span>
                    </div>
                  </div>
                )}

                {form.payMethod === 'upi' && (
                  <div>
                    <label className="form-label small fw-semibold text-muted">UPI ID</label>
                    <input className="form-control rounded-3" placeholder="yourname@upi"
                      required style={{ border:'1.5px solid #e0e0e0', fontSize:'0.9rem' }}/>
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      {['GPay','PhonePe','Paytm','BHIM'].map(app => (
                        <span key={app} className="badge rounded-pill px-3 py-2 fw-semibold"
                          style={{ background:'#f5f5f5', color:'#555', border:'1px solid #e0e0e0', fontSize:'0.78rem' }}>
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {form.payMethod === 'cod' && (
                  <div className="rounded-3 p-3" style={{ background:'#fff8e1', border:'1px solid #ffe082' }}>
                    <div className="fw-semibold small mb-1">💵 Cash on Delivery</div>
                    <div className="text-muted small">Pay ₹{total.toLocaleString('en-IN')} when your order is delivered.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Place order button */}
            <button type="submit"
              className="btn btn-lg fw-bold w-100 rounded-3 py-3"
              style={{
                background: loading ? '#ccc' : 'linear-gradient(90deg,#ff9f00,#ff6d00)',
                color: '#fff', border:'none', fontSize:'1.05rem',
                boxShadow: loading ? 'none' : '0 4px 16px #ff9f0066',
                transition: '0.2s',
              }}
              disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"/>Processing your order...</>
                : `🎉 Place Order — ₹${total.toLocaleString('en-IN')}`}
            </button>

            <div className="text-center mt-2 text-muted" style={{ fontSize:'0.75rem' }}>
              🔒 Secure checkout · Free cancellation before delivery
            </div>
          </form>
        </div>

        {/* ── Right: order summary ── */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden" style={{ position:'sticky', top:20 }}>
            <div style={{ height:4, background:'linear-gradient(90deg,#ff9f00,#ff6d00)' }}/>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">🧾 Order Summary</h6>

              {/* Items */}
              <div className="d-flex flex-column gap-3 mb-3">
                {cart.map(item => (
                  <div key={item.id} className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width:52, height:52, background:(CAT_ACCENT[item.category]||{bg:'#f5f5f5'}).bg, fontSize:'1.8rem' }}>
                      {item.emoji}
                    </div>
                    <div className="flex-grow-1">
                      <div className="small fw-semibold" style={{ color:'#212121', lineHeight:1.3 }}>{item.name}</div>
                      <div className="text-muted" style={{ fontSize:'0.7rem' }}>Qty: {item.quantity}</div>
                    </div>
                    <div className="fw-bold text-end" style={{ color:'#212121', whiteSpace:'nowrap' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:'1px dashed #e0e0e0', marginBottom:'1rem' }}/>

              {/* Price breakdown */}
              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Subtotal ({cart.length} item{cart.length>1?'s':''})</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Delivery</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">You save</span>
                  <span className="fw-semibold" style={{ color:'#26a541' }}>₹{savings.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ borderTop:'2px solid #e0e0e0', paddingTop:'0.75rem' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total Amount</span>
                  <span className="fw-bold" style={{ fontSize:'1.3rem', color:'#212121' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-success small mt-1">
                  🎁 You're saving ₹{savings.toLocaleString('en-IN')} on this order!
                </div>
              </div>
            </div>

            {/* Safe shopping badges */}
            <div className="px-4 pb-3">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {['🔒 Secure', '↩️ Easy Returns', '🚚 Free Delivery'].map((b,i) => (
                  <span key={i} style={{ fontSize:'0.7rem', color:'#888', fontWeight:600 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;