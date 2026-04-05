import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const PurchaseTracker = () => {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.purchaseTracker()
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>;
  if (!data)   return <div className="alert alert-warning">No data available</div>;

  const { products, totals, statusCounts } = data;

  const filtered = (products || []).filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = !search || p.productName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const STATUS_META = {
    hot:    { label: '🔥 Hot',     badge: 'danger',    bg: '' },
    normal: { label: '✅ Normal',   badge: 'success',   bg: '' },
    slow:   { label: '🐢 Slow',    badge: 'warning',   bg: 'table-warning' },
    dead:   { label: '💀 Not Selling', badge: 'secondary', bg: 'table-danger' },
  };

  const tabs = [
    { key: 'all',    label: 'All',        value: products.length,    color: 'dark' },
    { key: 'hot',    label: '🔥 Hot',     value: statusCounts.hot,   color: 'danger' },
    { key: 'normal', label: '✅ Normal',   value: statusCounts.normal,color: 'success' },
    { key: 'slow',   label: '🐢 Slow',    value: statusCounts.slow,  color: 'warning' },
    { key: 'dead',   label: '💀 Dead',    value: statusCounts.dead,  color: 'secondary' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">🏪 Purchase Tracker</h4>
          <p className="text-muted small mb-0">Global product performance across all users</p>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="🔍 Search products..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ minWidth: 200 }} />
          <button className="btn btn-outline-secondary btn-sm" onClick={load}>🔄</button>
        </div>
      </div>

      {/* Global totals */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Revenue',   value: `₹${(totals.rev||0).toLocaleString('en-IN')}`, icon: '💰', color: 'warning' },
          { label: 'Total Purchases', value: totals.purchases||0, icon: '💳', color: 'success' },
          { label: 'Total Views',     value: totals.views||0,     icon: '👁️', color: 'info' },
          { label: 'Tracked Products',value: products.length,     icon: '📦', color: 'primary' },
        ].map((c, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm border-top border-4 border-${c.color}`}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: '1.5rem' }}>{c.icon}</div>
                <div className={`fs-4 fw-bold text-${c.color}`}>{c.value}</div>
                <div className="small text-muted">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {tabs.map(t => (
          <button key={t.key}
            className={`btn btn-sm ${filter===t.key ? `btn-${t.color}` : `btn-outline-${t.color}`} fw-semibold`}
            onClick={() => setFilter(t.key)}>
            {t.label} <span className="badge bg-white text-dark ms-1">{t.value}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Product</th><th>Category</th>
                <th className="text-center">👁️ Views</th>
                <th className="text-center">🛒 Cart</th>
                <th className="text-center">💳 Sales</th>
                <th className="text-center">💰 Revenue</th>
                <th className="text-center">📈 Conv%</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-5 text-muted">No products found</td></tr>
              ) : filtered.map((p, i) => {
                const m = STATUS_META[p.status] || STATUS_META.dead;
                return (
                  <tr key={p.productId} className={m.bg}>
                    <td className="text-muted small">{i+1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.4rem' }}>{p.emoji||'📦'}</span>
                        <div>
                          <div className="fw-semibold small">{p.productName}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>₹{(p.price||0).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>{p.category}</span></td>
                    <td className="text-center"><span className="badge bg-info text-dark">{p.totalViews||0}</span></td>
                    <td className="text-center"><span className="badge bg-warning text-dark">{p.totalAddToCart||0}</span></td>
                    <td className="text-center">
                      <span className={`badge bg-${p.totalPurchases>0?'success':'secondary'} fs-6`}>{p.totalPurchases||0}</span>
                    </td>
                    <td className="text-center fw-bold text-success small">₹{(p.totalRevenue||0).toLocaleString('en-IN')}</td>
                    <td className="text-center"><span className="badge bg-light text-dark">{p.conversionRate||0}%</span></td>
                    <td className="text-center"><span className={`badge bg-${m.badge}`}>{m.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTracker;
