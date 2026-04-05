import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';

const DashboardPage = () => {
  const { user, sessionStart } = useAuth();
  const [summary, setSummary] = useState({ productViews:0, addToCart:0, purchases:0, totalEvents:0 });
  const [loading, setLoading] = useState(true);

  // Always fetch from server so admin deletes reflect immediately
  const fetchSummary = useCallback(() => {
    setLoading(true);
    analyticsAPI.summary()
      .then(r => { setSummary(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSummary();
    // Re-fetch when window gains focus (user switches back from admin panel)
    const onFocus = () => fetchSummary();
    window.addEventListener('focus', onFocus);
    // Also re-fetch when events are updated locally
    window.addEventListener('eventsUpdated', fetchSummary);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('eventsUpdated', fetchSummary);
    };
  }, [fetchSummary]);

  const sessionStr = sessionStart
    ? sessionStart.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })
    : 'Just now';

  const cards = [
    { label:'Products Viewed', value:summary.productViews, icon:'👁️', color:'primary'  },
    { label:'Added to Cart',   value:summary.addToCart,    icon:'🛒', color:'warning'  },
    { label:'Purchases Made',  value:summary.purchases,    icon:'💳', color:'success'  },
    { label:'Total Events',    value:summary.totalEvents,  icon:'📊', color:'info'     },
  ];

  const quickLinks = [
    { to:'/products', icon:'🛍️', label:'Browse Products', desc:'50+ tech products',  color:'warning' },
    { to:'/cart',     icon:'🛒', label:'My Cart',          desc:'View cart items',    color:'success' },
    { to:'/orders',   icon:'📦', label:'My Orders',        desc:'Track your orders',  color:'primary' },
    { to:'/journey',  icon:'🗺️', label:'Journey',          desc:'About TechGear',     color:'info'    },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div className="card border-0 shadow mb-4"
        style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', color:'#fff' }}>
        <div className="card-body py-3 px-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h4 className="fw-bold text-warning mb-1">👋 Hello, {user?.name}!</h4>
              <p className="text-light mb-1 small">📧 {user?.email}</p>
              <p className="mb-0 small">⏰ Session started: <span className="text-warning fw-semibold">{sessionStr}</span></p>
            </div>
            <div className="col-md-4 text-center d-none d-md-block">
              <div style={{ fontSize:'3.5rem' }}>🛒</div>
              <span className="badge bg-warning text-dark">TechGear Store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity cards */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-muted text-uppercase mb-0 small">Your Activity</h6>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchSummary} disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm"/> : '🔄'} Refresh
        </button>
      </div>

      <div className="row g-2 g-md-3 mb-4">
        {cards.map((c, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className={`card border-0 shadow-sm h-100 border-top border-4 border-${c.color}`}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize:'1.8rem' }}>{c.icon}</div>
                <div className={`fs-3 fw-bold text-${c.color}`}>
                  {loading ? <span className="spinner-border spinner-border-sm"/> : c.value}
                </div>
                <div className="small text-muted">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live sync notice */}
      <div className="alert alert-light border small py-2 mb-4 d-flex align-items-center gap-2">
        <span>🔄</span>
        <span>These counts are live from the server. They update instantly when you refresh or switch back to this tab.</span>
      </div>

      {/* Quick links */}
      <h6 className="fw-bold text-muted text-uppercase mb-3 small">Quick Access</h6>
      <div className="row g-2 g-md-3 mb-4">
        {quickLinks.map((l, i) => (
          <div className="col-6 col-md-3" key={i}>
            <Link to={l.to} className="text-decoration-none">
              <div className={`card border-0 shadow-sm text-center h-100 border-bottom border-4 border-${l.color}`}
                style={{ transition:'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <div className="card-body py-3">
                  <div style={{ fontSize:'2rem' }}>{l.icon}</div>
                  <h6 className="fw-bold mt-2 mb-1 small">{l.label}</h6>
                  <p className="text-muted mb-0" style={{ fontSize:'0.72rem' }}>{l.desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Platform info */}
      <h6 className="fw-bold text-muted text-uppercase mb-3 small">Platform Info</h6>
      <div className="row g-2 g-md-3">
        {[
          { icon:'📱', title:'Premium Products',   text:'50+ curated tech products from top global brands.' },
          { icon:'🔒', title:'Secure Shopping',    text:'Session-based auth and encrypted storage.' },
          { icon:'⚡', title:'Real-time Tracking', text:'Every action is tracked and synced with the server.' },
          { icon:'💡', title:'Smart Analytics',    text:'Live insights from your browsing and purchase behavior.' },
        ].map((p, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <div style={{ fontSize:'2rem' }}>{p.icon}</div>
              <h6 className="fw-bold mt-2 small">{p.title}</h6>
              <p className="text-muted mb-0" style={{ fontSize:'0.72rem' }}>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
