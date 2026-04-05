import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';

const COLORS = { product_viewed:'info', add_to_cart:'warning', purchase:'success' };
const ICONS  = { product_viewed:'👁️', add_to_cart:'🛒', purchase:'💳' };

const EventsPage = () => {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState('');
  const [filter,   setFilter]   = useState('all');
  const [error,    setError]    = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    adminAPI.recentEvents()
      .then(r => { setEvents(r.data); setLoading(false); })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmtTime = d => new Date(d).toLocaleString('en-IN', {
    day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', hour12:true,
  });

  const confirm = (msg, fn) => { if (window.confirm(msg)) fn(); };

  // ── Single row delete — also resets ProductStat ───────────────────────────
  const doDeleteOne = async (event) => {
    const id = event._id;
    if (!id) { setEvents(prev => prev.filter(e => e !== event)); return; }
    setDeleting(id);
    try {
      await adminAPI.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch { alert('Delete failed — check server'); }
    finally   { setDeleting(''); }
  };

  // ── Delete all events (clear all) ────────────────────────────────────────
  const doDeleteAll = async () => {
    setDeleting('all');
    try { await adminAPI.deleteAllEvents(); setEvents([]); }
    catch { alert('Delete failed'); }
    finally { setDeleting(''); }
  };

  // ── Delete currently filtered set ─────────────────────────────────────────
  const doDeleteFiltered = async () => {
    if (filter === 'all') { doDeleteAll(); return; }
    setDeleting('type_' + filter);
    try {
      await adminAPI.deleteEventsByType(filter);
      setEvents(prev => prev.filter(e => e.actionType !== filter));
    } catch { alert('Delete failed'); }
    finally { setDeleting(''); }
  };

  const filtered = filter === 'all' ? events : events.filter(e => e.actionType === filter);
  const counts = {
    views:     events.filter(e => e.actionType === 'product_viewed').length,
    cart:      events.filter(e => e.actionType === 'add_to_cart').length,
    purchases: events.filter(e => e.actionType === 'purchase').length,
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-danger"/>
      <p className="mt-2 text-muted small">Loading events...</p>
    </div>
  );

  const Spin = ({ busy, onClick, children, className, style }) => (
    <button className={className} style={style} onClick={onClick} disabled={!!deleting}>
      {busy ? <span className="spinner-border spinner-border-sm"/> : children}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">📋 Recent Events</h4>
          <p className="text-muted small mb-0">
            Last 100 events across all users ·
            <span className="text-success fw-semibold ms-1">✅ Deletes update user dashboard in real-time</span>
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={load} disabled={!!deleting}>🔄 Refresh</button>
          <Spin busy={deleting==='all'} className="btn btn-danger btn-sm fw-semibold"
            onClick={() => confirm('Delete ALL events? This will reset all user stats and product counts.', doDeleteAll)}>
            🗑️ Clear All
          </Spin>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Info banner */}
      <div className="alert alert-info py-2 small mb-3 d-flex align-items-center gap-2">
        <span>ℹ️</span>
        <span><strong>Real-time sync:</strong> Deleting events removes them from the database and resets product stats. User dashboard counts update on their next refresh.</span>
      </div>

      {/* KPI cards */}
      <div className="row g-3 mb-4">
        {[
          { label:'Product Views',  value:counts.views,     color:'info',    icon:'👁️' },
          { label:'Cart Additions', value:counts.cart,      color:'warning', icon:'🛒' },
          { label:'Purchases',      value:counts.purchases, color:'success', icon:'💳' },
          { label:'Total Events',   value:events.length,    color:'primary', icon:'📊' },
        ].map((c,i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm border-top border-4 border-${c.color}`}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize:'1.5rem' }}>{c.icon}</div>
                <div className={`fs-4 fw-bold text-${c.color}`}>{c.value}</div>
                <div className="small text-muted">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + bulk delete filtered */}
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center justify-content-between">
        <div className="d-flex gap-2 flex-wrap">
          {[
            { key:'all',            label:'All Events'   },
            { key:'product_viewed', label:'👁️ Views'     },
            { key:'add_to_cart',    label:'🛒 Cart'       },
            { key:'purchase',       label:'💳 Purchases'  },
          ].map(f => (
            <button key={f.key}
              className={`btn btn-sm fw-semibold ${filter===f.key?'btn-dark':'btn-outline-secondary'}`}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        {filtered.length > 0 && (
          <Spin busy={deleting==='all'||deleting==='type_'+filter}
            className="btn btn-outline-danger btn-sm fw-semibold"
            onClick={() => confirm(
              `Delete ${filter==='all'?'ALL':'all "'+filter.replace(/_/g,' ')+'"'} events (${filtered.length})? Product stats will reset.`,
              doDeleteFiltered
            )}>
            🗑️ Delete {filter==='all'?'All':'Filtered'} ({filtered.length})
          </Spin>
        )}
      </div>

      {/* Table — only row-level delete button, NO sub-links */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width:110 }}>Time</th>
                <th>User</th>
                <th style={{ width:145 }}>Event</th>
                <th>Product</th>
                <th style={{ width:55 }} className="text-center">Qty</th>
                <th style={{ width:115 }} className="text-center">Value</th>
                <th style={{ width:64  }} className="text-center">Del</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-5 text-muted">No events found</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e._id||i} style={{ opacity: deleting===e._id ? 0.4 : 1 }}>

                  {/* Time */}
                  <td className="text-muted small" style={{ whiteSpace:'nowrap' }}>{fmtTime(e.createdAt)}</td>

                  {/* User — name + email only, NO sub-link */}
                  <td>
                    <div className="fw-semibold small">{e.userName}</div>
                    <div className="text-muted" style={{ fontSize:'0.65rem' }}>{e.userEmail}</div>
                  </td>

                  {/* Event type — badge only, NO sub-link */}
                  <td>
                    <span className={`badge bg-${COLORS[e.actionType]||'secondary'} text-${['product_viewed','add_to_cart'].includes(e.actionType)?'dark':'white'}`}>
                      {ICONS[e.actionType]} {e.actionType?.replace(/_/g,' ')}
                    </span>
                  </td>

                  {/* Product — name + category only, NO sub-link */}
                  <td>
                    {e.productName
                      ? <div>
                          <div className="small fw-semibold">{e.productName}</div>
                          <div className="text-muted" style={{ fontSize:'0.65rem' }}>{e.category}</div>
                        </div>
                      : <span className="text-muted small">—</span>}
                  </td>

                  <td className="text-center small">{e.actionType==='purchase' ? e.quantity||1 : '—'}</td>
                  <td className="text-center fw-bold text-success small">
                    {e.actionType==='purchase' && e.price
                      ? `₹${((e.price)*(e.quantity||1)).toLocaleString('en-IN')}` : '—'}
                  </td>

                  {/* ONLY row-level delete button */}
                  <td className="text-center">
                    <Spin busy={deleting===e._id}
                      className="btn btn-danger btn-sm py-0 px-2"
                      style={{ fontSize:'0.75rem' }}
                      onClick={() => confirm(
                        `Delete this event? The product's stats will be recalculated.`,
                        () => doDeleteOne(e)
                      )}>
                      🗑️
                    </Spin>
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot className="table-light">
                <tr>
                  <td colSpan={6} className="small text-muted">Showing {filtered.length} of {events.length} events</td>
                  <td className="text-center">
                    <Spin busy={deleting==='all'||deleting==='type_'+filter}
                      className="btn btn-danger btn-sm py-0 px-2"
                      style={{ fontSize:'0.72rem' }}
                      onClick={() => confirm('Delete all visible events?', doDeleteFiltered)}>
                      🗑️ All
                    </Spin>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
