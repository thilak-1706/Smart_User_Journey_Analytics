import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [events, setEvents]   = useState([]);
  const [evLoading, setEvLoading] = useState(false);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    adminAPI.users()
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openUser = async (u) => {
    setSelected(u); setEvLoading(true); setEvents([]);
    try {
      const r = await adminAPI.userEvents(u._id);
      setEvents(r.data);
    } catch {}
    setEvLoading(false);
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/><p className="mt-2 text-muted small">Loading users...</p></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">👥 All Users</h4>
          <p className="text-muted small mb-0">{users.length} registered customers</p>
        </div>
        <input className="form-control w-auto" placeholder="🔍 Search users..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ minWidth: 220 }} />
      </div>

      {/* Summary row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Users', value: users.length, icon: '👥', color: 'primary' },
          { label: 'Total Purchases', value: users.reduce((s,u) => s + (u.stats?.purchases||0), 0), icon: '💳', color: 'success' },
          { label: 'Total Revenue', value: `₹${users.reduce((s,u) => s+(u.stats?.revenue||0),0).toLocaleString('en-IN')}`, icon: '💰', color: 'warning' },
          { label: 'Total Views', value: users.reduce((s,u) => s+(u.stats?.views||0),0), icon: '👁️', color: 'info' },
        ].map((c,i) => (
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

      {/* Users table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-dark text-white fw-bold">User List</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Joined</th>
                <th className="text-center">👁️ Views</th>
                <th className="text-center">🛒 Cart</th>
                <th className="text-center">💳 Purchases</th>
                <th className="text-center">💰 Revenue</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td className="text-muted small">{i + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 34, height: 34, fontSize: '0.8rem', flexShrink: 0 }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="small text-muted">{fmt(u.createdAt)}</td>
                  <td className="text-center"><span className="badge bg-info text-dark">{u.stats?.views || 0}</span></td>
                  <td className="text-center"><span className="badge bg-warning text-dark">{u.stats?.cart || 0}</span></td>
                  <td className="text-center"><span className={`badge bg-${u.stats?.purchases > 0 ? 'success' : 'secondary'}`}>{u.stats?.purchases || 0}</span></td>
                  <td className="text-center fw-bold text-success small">₹{(u.stats?.revenue||0).toLocaleString('en-IN')}</td>
                  <td className="text-center">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => openUser(u)}>
                      📋 Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-4 text-muted">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User detail modal */}
      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <div>
                  <h5 className="modal-title text-warning fw-bold mb-0">{selected.name}</h5>
                  <small className="text-secondary">{selected.email}</small>
                </div>
                <button className="btn-close btn-close-white" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body p-4">
                {/* User stats */}
                <div className="row g-2 mb-4">
                  {[
                    { l: 'Views',     v: selected.stats?.views,     c: 'info',    i: '👁️' },
                    { l: 'Cart',      v: selected.stats?.cart,      c: 'warning', i: '🛒' },
                    { l: 'Purchases', v: selected.stats?.purchases,  c: 'success', i: '💳' },
                    { l: 'Revenue',   v: `₹${(selected.stats?.revenue||0).toLocaleString('en-IN')}`, c: 'danger', i: '💰' },
                  ].map((x, i) => (
                    <div key={i} className="col-3">
                      <div className={`card border-0 bg-light text-center py-2`}>
                        <div>{x.i}</div>
                        <div className={`fw-bold text-${x.c}`}>{x.v ?? 0}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{x.l}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fw-bold mb-2">📦 Purchase History</h6>
                {evLoading ? (
                  <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"/></div>
                ) : events.filter(e => e.actionType === 'purchase').length === 0 ? (
                  <div className="text-center py-3 text-muted small">No purchases yet</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover mb-0">
                      <thead className="table-light"><tr><th>Product</th><th>Category</th><th className="text-center">Qty</th><th className="text-center">Price</th><th>Date</th></tr></thead>
                      <tbody>
                        {events.filter(e => e.actionType === 'purchase').map((e, i) => (
                          <tr key={i}>
                            <td className="small">{e.productName}</td>
                            <td><span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>{e.category}</span></td>
                            <td className="text-center small">{e.quantity}</td>
                            <td className="text-center fw-bold text-success small">₹{((e.price||0)*(e.quantity||1)).toLocaleString('en-IN')}</td>
                            <td className="text-muted small">{fmtTime(e.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
