import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';

const CAT_COLOR = { Phones:'primary', Laptops:'success', Gadgets:'warning', Accessories:'info' };
const CATS = ['All','Phones','Laptops','Gadgets','Accessories','Cancelled Orders'];

const SalesBoardPage = () => {
  const [data,      setData]      = useState(null);
  const [cancelled, setCancelled] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('All');
  const [search,    setSearch]    = useState('');
  const [error,     setError]     = useState('');
  const [deleting,  setDeleting]  = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    Promise.all([adminAPI.salesBoard(), adminAPI.cancelledOrders()])
      .then(([sb, co]) => {
        setData(sb.data);
        setCancelled(co.data || []);
        setLoading(false);
      })
      .catch(e => { setError(e.response?.data?.message || 'Failed to load'); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-danger mb-3" style={{ width:'3rem', height:'3rem' }}/>
      <p className="text-muted">Loading sales board...</p>
    </div>
  );
  if (error)  return <div className="alert alert-danger">{error}</div>;
  if (!data)  return null;

  const { board, summary } = data;
  const maxSold = Math.max(...board.map(p => p.unitsSold), 1);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ fontSize:'1.3rem' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize:'1.3rem' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize:'1.3rem' }}>🥉</span>;
    return <span className="text-muted fw-bold small">#{rank}</span>;
  };

  // ── Delete product stat (resets to 0 in user-app too) ─────────────────────
  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Reset all stats for "${productName}"?\n\nThis removes all events for this product and resets its counts to 0. The user's dashboard will reflect this on next refresh.`)) return;
    setDeleting(productId);
    try {
      await adminAPI.deleteProductStat(productId);
      // Refresh board
      const sb = await adminAPI.salesBoard();
      setData(sb.data);
    } catch { alert('Delete failed — check server'); }
    finally { setDeleting(''); }
  };

  // ── Delete a cancelled order event ────────────────────────────────────────
  const deleteCancelledEvent = async (id) => {
    if (!window.confirm('Remove this cancelled order record?')) return;
    setDeleting(id);
    try {
      await adminAPI.deleteEvent(id);
      setCancelled(prev => prev.filter(e => e._id !== id));
    } catch { alert('Delete failed'); }
    finally { setDeleting(''); }
  };

  // ── Filtered sales board ──────────────────────────────────────────────────
  const salesFiltered = board.filter(p =>
    (filter === 'All' || p.category === filter) &&
    (!search || p.productName.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Cancelled orders grouped by orderId ───────────────────────────────────
  const cancelledGroups = {};
  cancelled.forEach(e => {
    const key = e.orderId || e._id;
    if (!cancelledGroups[key]) cancelledGroups[key] = { orderId: key, items:[], cancelledAt: e.createdAt, userName: e.userName, userEmail: e.userEmail };
    cancelledGroups[key].items.push(e);
  });
  const cancelledList = Object.values(cancelledGroups).sort((a,b) => new Date(b.cancelledAt)-new Date(a.cancelledAt));

  const fmtDate = d => new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

  const Spin = ({ busy, onClick, children, className, style }) => (
    <button className={className} style={style} onClick={onClick} disabled={!!deleting}>
      {busy ? <span className="spinner-border spinner-border-sm"/> : children}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1">🏆 Product Sales Board</h4>
          <p className="text-muted small mb-0">
            All {summary.totalProducts} products ranked by units sold · Deleting resets user counts
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <input className="form-control form-control-sm" placeholder="🔍 Search product..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth:200 }} />
          <button className="btn btn-outline-secondary btn-sm" onClick={load}>🔄</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-top border-4 border-danger text-center py-3">
            <div style={{ fontSize:'1.8rem' }}>📦</div>
            <div className="fs-3 fw-bold text-danger">{summary.totalProducts}</div>
            <div className="small text-muted">Total Products</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-top border-4 border-success text-center py-3">
            <div style={{ fontSize:'1.8rem' }}>🛍️</div>
            <div className="fs-3 fw-bold text-success">{summary.totalSold}</div>
            <div className="small text-muted">Total Units Sold</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-top border-4 border-warning text-center py-3">
            <div style={{ fontSize:'1.8rem' }}>💰</div>
            <div className="fs-3 fw-bold text-warning">₹{summary.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="small text-muted">Total Revenue</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-top border-4 border-danger text-center py-3">
            <div style={{ fontSize:'1.8rem' }}>❌</div>
            <div className="fs-3 fw-bold text-danger">{cancelledList.length}</div>
            <div className="small text-muted">Cancelled Orders</div>
          </div>
        </div>
      </div>

      {/* Top 3 podium — only on sales tabs */}
      {filter !== 'Cancelled Orders' && board.filter(p => p.unitsSold > 0).length >= 1 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-bold bg-dark text-white">🏆 Top Sellers</div>
          <div className="card-body">
            <div className="row g-3 justify-content-center">
              {board.filter(p => p.unitsSold > 0).slice(0,3).map((p,i) => (
                <div className="col-md-4" key={p.productId}>
                  <div className={`card border-0 text-center h-100 ${i===0?'bg-warning bg-opacity-10 border-warning border':'bg-light'}`}>
                    <div className="card-body py-3 position-relative">
                      <div style={{ fontSize:'2.5rem' }}>{p.emoji}</div>
                      <div style={{ fontSize:i===0?'2rem':'1.4rem' }}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                      <h6 className="fw-bold mt-1 small">{p.productName}</h6>
                      <span className={`badge bg-${CAT_COLOR[p.category]}`}>{p.category}</span>
                      <div className="mt-2">
                        <div className="fw-bold text-success fs-5">{p.unitsSold} sold</div>
                        <div className="text-muted small">₹{p.totalRevenue.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category tabs — including Cancelled Orders */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`btn btn-sm fw-semibold ${filter===c ? (c==='Cancelled Orders'?'btn-danger':'btn-dark') : 'btn-outline-secondary'}`}>
            {c==='Cancelled Orders' ? '❌ ' : ''}{c}
            <span className="badge bg-secondary ms-1">
              {c==='All'               ? board.length
               :c==='Cancelled Orders' ? cancelledList.length
               : board.filter(p => p.category===c).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── CANCELLED ORDERS TAB ─────────────────────────────────────────── */}
      {filter === 'Cancelled Orders' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-danger text-white fw-bold d-flex justify-content-between align-items-center">
            <span>❌ Cancelled Orders — {cancelledList.length} orders</span>
            <small className="opacity-75">From user-app cancellations</small>
          </div>
          {cancelledList.length === 0 ? (
            <div className="card-body text-center py-5 text-muted">
              <div style={{ fontSize:'3rem' }}>📭</div>
              <p className="mt-2">No cancelled orders yet</p>
              <small>When users cancel orders in the store, they appear here</small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Products</th>
                    <th>Cancelled At</th>
                    <th style={{ width:90 }}>Total Value</th>
                    <th style={{ width:64 }} className="text-center">Del</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledList.map(group => {
                    const total = group.items.reduce((s,e)=>(s+(e.price||0)*(e.quantity||1)),0);
                    const ids   = group.items.map(e=>e._id).filter(Boolean);
                    return (
                      <tr key={group.orderId} style={{ opacity: ids.some(id=>deleting===id) ? 0.4:1 }}>
                        <td>
                          <div className="fw-bold small text-danger">#{group.orderId?.slice(-8)||'—'}</div>
                        </td>
                        <td>
                          <div className="small fw-semibold">{group.userName}</div>
                          <div className="text-muted" style={{ fontSize:'0.65rem' }}>{group.userEmail}</div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {group.items.map((e,i) => (
                              <span key={i} className="badge bg-light text-dark border" style={{ fontSize:'0.7rem' }}>
                                {e.emoji} {e.productName} ×{e.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="small text-muted" style={{ whiteSpace:'nowrap' }}>
                          {fmtDate(group.cancelledAt)}
                        </td>
                        <td className="fw-bold text-danger small">
                          ₹{total.toLocaleString('en-IN')}
                        </td>
                        <td className="text-center">
                          {/* Delete all events in this cancelled order group */}
                          <Spin
                            busy={ids.some(id=>deleting===id)}
                            className="btn btn-danger btn-sm py-0 px-2"
                            style={{ fontSize:'0.75rem' }}
                            onClick={async () => {
                              if (!window.confirm(`Delete cancelled order #${group.orderId?.slice(-8)}?\nThis removes it from this list and also removes it from the user's visible cancelled orders count.`)) return;
                              setDeleting(ids[0]);
                              try {
                                await Promise.all(ids.map(id => adminAPI.deleteEvent(id)));
                                setCancelled(prev => prev.filter(e => !ids.includes(e._id)));
                              } catch { alert('Delete failed'); }
                              finally { setDeleting(''); }
                            }}>
                            🗑️
                          </Spin>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-dark">
                  <tr>
                    <td colSpan={4} className="fw-bold">TOTAL CANCELLED VALUE</td>
                    <td className="fw-bold text-danger">
                      ₹{cancelledList.reduce((s,g)=>s+g.items.reduce((ss,e)=>ss+(e.price||0)*(e.quantity||1),0),0).toLocaleString('en-IN')}
                    </td>
                    <td/>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* ── SALES TABLE TAB ─────────────────────────────────────────────── */
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span className="fw-bold">📊 Complete Sales Table — {salesFiltered.length} products</span>
            <small className="text-secondary">Sorted by units sold ↓ · 🗑️ resets stats to 0</small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width:60 }}>Rank</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th style={{ width:110 }}>Unit Price</th>
                  <th style={{ width:110 }} className="text-center">Units Sold</th>
                  <th style={{ width:140 }} className="text-center">Total Revenue</th>
                  <th style={{ width:130 }}>Sales Bar</th>
                  <th style={{ width:64  }} className="text-center">Del</th>
                </tr>
              </thead>
              <tbody>
                {salesFiltered.map(p => {
                  const barW = maxSold > 0 ? Math.round((p.unitsSold/maxSold)*100) : 0;
                  const rowCls = p.unitsSold===0?'':p.rank<=3?'table-warning':'';
                  const isBusy = deleting === p.productId;
                  return (
                    <tr key={p.productId} className={rowCls} style={{ opacity:isBusy?0.4:1 }}>
                      <td className="text-center">{getRankBadge(p.rank)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize:'1.5rem', minWidth:28 }}>{p.emoji}</span>
                          <div>
                            <div className="fw-semibold small">{p.productName}</div>
                            <div className="text-muted" style={{ fontSize:'0.65rem' }}>ID: {p.productId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${CAT_COLOR[p.category]||'secondary'}`} style={{ fontSize:'0.7rem' }}>
                          {p.category}
                        </span>
                      </td>
                      <td className="fw-semibold text-success small">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="text-center">
                        {p.unitsSold===0
                          ? <span className="badge bg-light text-muted border">0</span>
                          : <span className="badge bg-success fs-6 px-3">{p.unitsSold}</span>}
                      </td>
                      <td className="text-center fw-bold">
                        {p.totalRevenue===0
                          ? <span className="text-muted small">₹0</span>
                          : <span className="text-success">₹{p.totalRevenue.toLocaleString('en-IN')}</span>}
                      </td>
                      <td>
                        <div style={{ background:'#e9ecef', borderRadius:4, height:9, minWidth:70 }}>
                          <div style={{ width:`${barW}%`, height:'100%', borderRadius:4, minWidth:barW>0?5:0,
                            background:p.rank===1?'#ffc107':p.rank<=3?'#fd7e14':p.unitsSold>0?'#198754':'#dee2e6',
                            transition:'width 0.4s ease' }}/>
                        </div>
                        {p.unitsSold>0 && <div className="text-muted mt-1" style={{ fontSize:'0.62rem' }}>{barW}% of top</div>}
                      </td>
                      {/* Delete product stat — resets to 0 in user-app too */}
                      <td className="text-center">
                        <Spin
                          busy={isBusy}
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          style={{ fontSize:'0.72rem' }}
                          onClick={() => deleteProduct(p.productId, p.productName)}>
                          🗑️
                        </Spin>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="table-dark">
                <tr>
                  <td colSpan={4} className="fw-bold">TOTAL</td>
                  <td className="text-center fw-bold text-warning fs-6">{summary.totalSold}</td>
                  <td className="text-center fw-bold text-warning">₹{summary.totalRevenue.toLocaleString('en-IN')}</td>
                  <td colSpan={2}/>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesBoardPage;
