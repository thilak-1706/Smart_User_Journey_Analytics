import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fmt = d => new Date(d).toLocaleString('en-IN', {
  day:'2-digit', month:'short', year:'numeric',
  hour:'2-digit', minute:'2-digit', hour12:true,
});

const fmtShort = d => new Date(d).toLocaleString('en-IN', {
  day:'2-digit', month:'short', year:'numeric',
});

// Flipkart-style order step tracker
const OrderSteps = ({ status }) => {
  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
  const cancelledAt = status === 'cancelled' ? 1 : -1;
  const activeStep  = status === 'cancelled' ? -1 : 1; // stays at "Processing" (demo)
  return (
    <div className="d-flex align-items-center gap-0 my-3" style={{ overflowX:'auto' }}>
      {steps.map((step, i) => {
        const done      = status !== 'cancelled' && i <= activeStep;
        const cancelled = status === 'cancelled' && i === 0;
        return (
          <div key={i} className="d-flex align-items-center flex-shrink-0">
            <div className="d-flex flex-column align-items-center" style={{ minWidth:80 }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width:34, height:34, fontSize:'0.85rem',
                  background: cancelled && i===0 ? '#dc3545'
                            : status==='cancelled' ? '#e0e0e0'
                            : done ? '#26a541' : '#e0e0e0',
                  color: (done || (cancelled&&i===0)) ? '#fff' : '#aaa',
                  border: `2px solid ${done?'#26a541':cancelled&&i===0?'#dc3545':'#e0e0e0'}`,
                }}>
                {status==='cancelled' && i===0 ? '✕' : done ? '✓' : i+1}
              </div>
              <div className="text-center mt-1" style={{
                fontSize:'0.62rem', fontWeight:600,
                color: done?'#26a541':status==='cancelled'&&i===0?'#dc3545':'#aaa',
                width:76,
              }}>
                {status==='cancelled' && i===0 ? 'Cancelled' : step}
              </div>
            </div>
            {i < steps.length-1 && (
              <div style={{
                height:3, width:40, flexShrink:0, marginBottom:22,
                background: done && i < activeStep ? '#26a541' : '#e0e0e0',
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrdersPage = ({ onToast }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders,     setOrders]     = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter,     setFilter]     = useState('all');

  const load = () => setOrders(localOrders.get());

  useEffect(() => {
    load();
    window.addEventListener('ordersUpdated', load);
    return () => window.removeEventListener('ordersUpdated', load);
  }, []);

  const handleCancel = (orderId, e) => {
    e.stopPropagation();
    if (!window.confirm(`Cancel order ${orderId}? This cannot be undone.`)) return;
    const sessionId = sessionStorage.getItem('u_session') || 'no-session';
    localOrders.cancel(orderId, user, sessionId);
    load();
    window.dispatchEvent(new Event('ordersUpdated'));
    onToast?.('Order cancelled', 'warning');
  };

  const filtered    = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const activeCount = orders.filter(o => o.status === 'active').length;
  const cancelCount = orders.filter(o => o.status === 'cancelled').length;
  const totalSpent  = orders.filter(o => o.status === 'active').reduce((s,o) => s + o.total, 0);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (orders.length === 0) return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'2rem' }}>
      <div className="card border-0 shadow-sm rounded-3 text-center py-5 px-3" style={{ maxWidth:480, margin:'0 auto' }}>
        <div style={{ fontSize:'5rem' }}>📦</div>
        <h5 className="fw-bold mt-3 mb-2">No orders yet!</h5>
        <p className="text-muted small mb-4">
          Looks like you haven't placed any orders yet.<br/>
          Start shopping and your orders will appear here.
        </p>
        <button className="btn fw-bold rounded-pill px-5 py-2"
          style={{ background:'linear-gradient(90deg,#ff9f00,#ff6d00)', color:'#fff', border:'none' }}
          onClick={() => navigate('/products')}>
          🛍️ Start Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

      {/* ── Page header bar ── */}
      <div className="card border-0 shadow-sm mb-3 rounded-3"
        style={{ background:'linear-gradient(90deg,#1a1a1a,#2d2d2d)' }}>
        <div className="card-body py-3 px-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h5 className="fw-bold text-white mb-0">📦 My Orders</h5>
              <small style={{ color:'rgba(255,255,255,0.55)' }}>
                {orders.length} orders · ₹{totalSpent.toLocaleString('en-IN')} active spend
              </small>
            </div>
            <button
              className="btn btn-sm fw-bold rounded-pill px-4"
              style={{ background:'#ff9f00', color:'#fff', border:'none' }}
              onClick={() => navigate('/products')}>
              🛍️ Shop More
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="row g-2 mb-3">
        {[
          { icon:'📦', label:'Total Orders', value:orders.length,                              bg:'#e3f2fd', color:'#1565c0', border:'#2874f0' },
          { icon:'✅', label:'Active',        value:activeCount,                               bg:'#e8f5e9', color:'#1b5e20', border:'#26a541' },
          { icon:'❌', label:'Cancelled',     value:cancelCount,                               bg:'#fce4ec', color:'#880e4f', border:'#e91e63' },
          { icon:'💰', label:'Total Spent',   value:`₹${totalSpent.toLocaleString('en-IN')}`, bg:'#fff8e1', color:'#e65100', border:'#ff9f00' },
        ].map((c,i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 text-center py-3"
              style={{ background:c.bg, borderLeft:`4px solid ${c.border}` }}>
              <div style={{ fontSize:'1.6rem' }}>{c.icon}</div>
              <div className="fw-bold" style={{ fontSize:'1.2rem', color:c.color }}>{c.value}</div>
              <div className="small fw-semibold" style={{ color:c.color, opacity:0.75 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {[
          { key:'active',    label:`✅ Active (${activeCount})`       },
          { key:'cancelled', label:`❌ Cancelled (${cancelCount})`    },
          { key:'all',       label:`All (${orders.length})`          },
        ].map(f => (
          <button key={f.key}
            className="btn btn-sm fw-semibold rounded-pill"
            style={{
              background: filter===f.key ? '#1a1a1a' : '#fff',
              color:      filter===f.key ? '#fff'    : '#333',
              border:     `1.5px solid ${filter===f.key ? '#1a1a1a' : '#ddd'}`,
              fontSize:   '0.8rem',
            }}
            onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Orders ── */}
      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize:'3rem' }}>🔍</div>
          <p className="mt-2">No orders in this filter</p>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {filtered.map(order => {
          const isExpanded = expandedId === order.orderId;
          const isCancelled = order.status === 'cancelled';

          return (
            <div key={order.orderId} className="card border-0 shadow-sm rounded-3 overflow-hidden"
              style={{ border:'1px solid #e0e0e0' }}>

              {/* ── Colored top accent bar ── */}
              <div style={{ height:4, background: isCancelled
                ? 'linear-gradient(90deg,#dc3545,#ff6b6b)'
                : 'linear-gradient(90deg,#26a541,#00c853)' }}/>

              {/* ── Order header ── */}
              <div className="p-3 p-md-4" style={{ cursor:'pointer' }}
                onClick={() => setExpandedId(isExpanded ? null : order.orderId)}>

                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  {/* Order ID + date */}
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span style={{ fontSize:'1.4rem' }}>{isCancelled ? '❌' : '📦'}</span>
                      <div>
                        <div className="fw-bold" style={{ fontSize:'0.95rem', color:'#212121' }}>
                          Order #{order.orderId}
                        </div>
                        <div className="text-muted" style={{ fontSize:'0.72rem' }}>
                          Placed on {fmt(order.placedAt)}
                        </div>
                      </div>
                    </div>
                    {isCancelled && order.cancelledAt && (
                      <span className="badge rounded-pill px-2 py-1"
                        style={{ background:'#fce4ec', color:'#c62828', fontSize:'0.68rem' }}>
                        Cancelled on {fmtShort(order.cancelledAt)}
                      </span>
                    )}
                  </div>

                  {/* Status + amount */}
                  <div className="text-end">
                    <div className="mb-1">
                      <span className="badge rounded-pill px-3 py-2 fw-semibold"
                        style={{
                          background: isCancelled ? '#fce4ec' : '#e8f5e9',
                          color:      isCancelled ? '#c62828' : '#1b5e20',
                          fontSize:   '0.75rem',
                        }}>
                        {isCancelled ? '❌ Cancelled' : '✅ Active'}
                      </span>
                    </div>
                    <div className="fw-bold" style={{ fontSize:'1.1rem', color:'#212121' }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-muted" style={{ fontSize:'0.7rem' }}>
                      {order.items.length} item{order.items.length>1?'s':''}
                    </div>
                  </div>
                </div>

                {/* ── Order step tracker ── */}
                <OrderSteps status={order.status} />

                {/* ── Product pills ── */}
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                      style={{ background:'#f5f5f5', border:'1px solid #e0e0e0', fontSize:'0.75rem' }}>
                      <span style={{ fontSize:'1rem' }}>{item.emoji}</span>
                      <span className="fw-semibold text-truncate" style={{ maxWidth:110, color:'#333' }}>{item.name}</span>
                      <span className="text-muted">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* ── Action row ── */}
                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                  {!isCancelled ? (
                    <button
                      className="btn btn-sm fw-semibold rounded-pill px-3"
                      style={{ background:'#fce4ec', color:'#c62828', border:'1px solid #ef9a9a', fontSize:'0.8rem' }}
                      onClick={e => handleCancel(order.orderId, e)}>
                      🚫 Cancel Order
                    </button>
                  ) : (
                    <div style={{ fontSize:'0.78rem', color:'#c62828' }}>
                      Order was cancelled
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize:'0.78rem' }}>
                    <span>{isExpanded ? 'Hide details ▲' : 'View details ▼'}</span>
                  </div>
                </div>
              </div>

              {/* ── Expanded detail ── */}
              {isExpanded && (
                <div style={{ background:'#fafafa', borderTop:'1px solid #e0e0e0' }}
                  className="p-3 p-md-4">
                  <div className="row g-3">

                    {/* Items table */}
                    <div className="col-12 col-md-7">
                      <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>🛍️ Ordered Items</h6>
                      <div className="rounded-3 overflow-hidden" style={{ border:'1px solid #e0e0e0' }}>
                        <table className="table table-sm mb-0 align-middle">
                          <thead style={{ background:'#f5f5f5' }}>
                            <tr>
                              <th className="fw-semibold small" style={{ color:'#555', border:0 }}>Product</th>
                              <th className="text-center fw-semibold small" style={{ width:50, color:'#555', border:0 }}>Qty</th>
                              <th className="text-end fw-semibold small" style={{ width:90, color:'#555', border:0 }}>Price</th>
                              <th className="text-end fw-semibold small" style={{ width:100, color:'#555', border:0 }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i} style={{ borderTop:'1px solid #f0f0f0' }}>
                                <td style={{ border:0 }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                                      style={{ width:40, height:40, background:'#f5f5f5', fontSize:'1.4rem' }}>
                                      {item.emoji}
                                    </div>
                                    <div>
                                      <div className="small fw-semibold" style={{ color:'#212121' }}>{item.name}</div>
                                      <div className="text-muted" style={{ fontSize:'0.65rem' }}>{item.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center align-middle small fw-semibold" style={{ border:0 }}>{item.quantity}</td>
                                <td className="text-end align-middle small" style={{ color:'#555', border:0 }}>
                                  ₹{item.price.toLocaleString('en-IN')}
                                </td>
                                <td className="text-end align-middle fw-bold small" style={{ color:'#26a541', border:0 }}>
                                  ₹{(item.price*item.quantity).toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ background:'#fff8e1', borderTop:'2px solid #ffe082' }}>
                              <td colSpan={3} className="fw-bold small" style={{ border:0 }}>Grand Total</td>
                              <td className="text-end fw-bold" style={{ color:'#e65100', fontSize:'1rem', border:0 }}>
                                ₹{order.total.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="col-12 col-md-5">
                      <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>📍 Delivery Address</h6>
                      <div className="rounded-3 p-3 mb-3"
                        style={{ background:'#fff', border:'1px solid #e0e0e0' }}>
                        <div className="d-flex gap-2 align-items-start">
                          <span style={{ fontSize:'1.5rem' }}>🏠</span>
                          <div>
                            <div className="fw-bold small" style={{ color:'#212121' }}>{order.delivery.name}</div>
                            <div className="small text-muted">{order.delivery.email}</div>
                            <div className="small mt-1" style={{ color:'#555' }}>{order.delivery.address}</div>
                            <div className="small" style={{ color:'#555' }}>
                              {order.delivery.city} — <strong>{order.delivery.pin}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estimated delivery or cancellation notice */}
                      {!isCancelled ? (
                        <>
                          <div className="rounded-3 p-3 mb-3 d-flex gap-2 align-items-center"
                            style={{ background:'#e8f5e9', border:'1px solid #a5d6a7' }}>
                            <span style={{ fontSize:'1.3rem' }}>🚚</span>
                            <div>
                              <div className="fw-semibold small" style={{ color:'#1b5e20' }}>Free Delivery</div>
                              <div className="text-muted" style={{ fontSize:'0.72rem' }}>
                                Expected by {new Date(new Date(order.placedAt).getTime()+5*24*60*60*1000).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
                              </div>
                            </div>
                          </div>
                          <button className="btn w-100 fw-semibold rounded-pill"
                            style={{ background:'#fce4ec', color:'#c62828', border:'1px solid #ef9a9a' }}
                            onClick={e => handleCancel(order.orderId, e)}>
                            🚫 Cancel This Order
                          </button>
                        </>
                      ) : (
                        <div className="rounded-3 p-3 d-flex gap-2 align-items-center"
                          style={{ background:'#fce4ec', border:'1px solid #ef9a9a' }}>
                          <span style={{ fontSize:'1.3rem' }}>❌</span>
                          <div>
                            <div className="fw-semibold small" style={{ color:'#c62828' }}>Order Cancelled</div>
                            <div className="text-muted" style={{ fontSize:'0.72rem' }}>
                              {fmt(order.cancelledAt)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;