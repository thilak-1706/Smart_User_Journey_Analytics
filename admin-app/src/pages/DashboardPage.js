import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAdminAuth } from '../context/AuthContext';

// ── Chart: Vertical Bar ───────────────────────────────────────────────────────
const BarChart = ({ data = [], color = '#dc3545', height = 140 }) => {
  if (!data.length || data.every(d => d.value === 0))
    return <div className="text-center text-muted py-4 small">No data yet</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ overflowX:'auto' }}>
      <div className="d-flex align-items-end gap-1" style={{ height, minWidth: data.length * 36 }}>
        {data.map((d, i) => {
          const barH = Math.max((d.value / max) * (height - 30), d.value > 0 ? 6 : 0);
          return (
            <div key={i} className="d-flex flex-column align-items-center flex-grow-1" style={{ minWidth:32 }}>
              <div className="text-muted text-center fw-bold" style={{ fontSize:'0.6rem', marginBottom:2 }}>
                {d.value > 0 ? d.value : ''}
              </div>
              <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background: d.color || color,
                            height: barH, opacity:0.88, transition:'height 0.5s ease' }}
                title={`${d.label}: ${d.value}`} />
              <div className="text-muted text-center text-truncate w-100" style={{ fontSize:'0.58rem', marginTop:3, maxWidth:60 }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Chart: Donut ──────────────────────────────────────────────────────────────
const DonutChart = ({ segments = [], size = 150, label = 'Total' }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!total) return <div className="text-center text-muted py-4 small">No data yet</div>;
  const cx = size/2, cy = size/2, r = size*0.36, inner = size*0.20;
  let angle = -Math.PI / 2;
  const arcs = segments.map(seg => {
    const frac = seg.value / total;
    const sweep = frac * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const path = frac >= 1
      ? `M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx-0.001} ${cy-r} Z`
      : `M ${x1} ${y1} A ${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x2} ${y2} L ${cx} ${cy} Z`;
    return { ...seg, path, frac };
  });
  return (
    <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center">
      <svg width={size} height={size} style={{ flexShrink:0 }}>
        {arcs.filter(a => a.frac > 0).map((a, i) => (
          <path key={i} d={a.path} fill={a.color} stroke="#fff" strokeWidth={2.5}>
            <title>{a.label}: {a.value}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={inner} fill="#fff" />
        <text x={cx} y={cy-6}  textAnchor="middle" fontSize={10} fill="#888">{label}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#333">{total.toLocaleString()}</text>
      </svg>
      <div className="d-flex flex-column gap-2">
        {segments.map((s, i) => (
          <div key={i} className="d-flex align-items-center gap-2 small">
            <div style={{ width:11, height:11, borderRadius:3, background:s.color, flexShrink:0 }} />
            <span className="text-muted">{s.label}</span>
            <span className="fw-bold">{s.value.toLocaleString()}</span>
            {total > 0 && <span className="text-muted">({Math.round(s.value/total*100)}%)</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Chart: Sparkline ─────────────────────────────────────────────────────────
const Sparkline = ({ values = [], color = '#198754', height = 70, labels = [] }) => {
  if (!values.length || values.every(v => v === 0))
    return <div className="text-center text-muted py-3 small">No activity yet</div>;
  const max = Math.max(...values, 1);
  const w = 300, h = height - 14, pad = 8;
  const pts = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length-1, 1)) * (w - pad*2);
    const y = h - pad - (v/max)*(h - pad*2);
    return [x, y];
  });
  const polyline = pts.map(p => p.join(',')).join(' ');
  const area = `M ${pts[0][0]} ${h} ` + pts.map(p => `L ${p[0]} ${p[1]}`).join(' ') + ` L ${pts[pts.length-1][0]} ${h} Z`;
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height:h, display:'block' }}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sg)" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke="#fff" strokeWidth={1.5}>
            <title>{labels[i] || i}: {values[i]}</title>
          </circle>
        ))}
      </svg>
      {labels.length > 0 && (
        <div className="d-flex justify-content-between mt-1">
          {labels.map((l,i) => (
            <div key={i} className="text-muted text-center" style={{ fontSize:'0.58rem', flex:1 }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Stat KPI Card ─────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, color, link, sub }) => (
  <Link to={link} className="text-decoration-none">
    <div className={`card border-0 shadow-sm h-100 border-top border-4 border-${color}`}
      style={{ transition:'transform 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      <div className="card-body text-center py-3 px-2">
        <div style={{ fontSize:'1.8rem' }}>{icon}</div>
        <div className={`fw-bold text-${color}`} style={{ fontSize:'1.5rem', lineHeight:1.2 }}>{value ?? '—'}</div>
        <div className="small text-muted fw-semibold">{label}</div>
        {sub && <div className="text-muted mt-1" style={{ fontSize:'0.68rem' }}>{sub}</div>}
      </div>
    </div>
  </Link>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [overview, setOverview] = useState(null);
  const [users,    setUsers]    = useState([]);
  const [products, setProducts] = useState([]);
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    Promise.all([
      adminAPI.overview(), adminAPI.users(), adminAPI.products(), adminAPI.recentEvents(),
    ]).then(([ov, us, pr, ev]) => {
      setOverview(ov.data); setUsers(us.data||[]); setProducts(pr.data||[]); setEvents(ev.data||[]);
      setLoading(false);
    }).catch(err => { setError(err.response?.data?.message||'Failed to load'); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-danger" style={{ width:'3rem', height:'3rem' }}/>
      <p className="mt-3 text-muted">Loading dashboard...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;

  // ── Derived data ────────────────────────────────────────────────────────────
  const eventDonut = [
    { label:'Views',     value: events.filter(e=>e.actionType==='product_viewed').length, color:'#0dcaf0' },
    { label:'Cart Adds', value: events.filter(e=>e.actionType==='add_to_cart').length,    color:'#ffc107' },
    { label:'Purchases', value: events.filter(e=>e.actionType==='purchase').length,       color:'#198754' },
  ];

  const topProducts = [...products]
    .sort((a,b) => b.totalPurchases - a.totalPurchases).slice(0,8)
    .map(p => ({ label: p.productName.split(' ').slice(0,2).join(' '), value: p.totalPurchases }));

  const catColors = { Phones:'#0d6efd', Laptops:'#198754', Gadgets:'#ffc107', Accessories:'#0dcaf0' };
  const catRevMap = {};
  products.forEach(p => { catRevMap[p.category] = (catRevMap[p.category]||0) + (p.totalRevenue||0); });
  const catDonut = Object.entries(catRevMap).map(([cat, rev]) => ({
    label:cat, value:Math.round(rev/1000), color:catColors[cat]||'#6c757d'
  }));

  const statusBars = [
    { label:'🔥 Hot',    value:products.filter(p=>p.status==='hot').length,    color:'#dc3545' },
    { label:'📈 Normal', value:products.filter(p=>p.status==='normal').length, color:'#198754' },
    { label:'📉 Slow',   value:products.filter(p=>p.status==='slow').length,   color:'#fd7e14' },
    { label:'💀 Dead',   value:products.filter(p=>p.status==='dead').length,   color:'#6c757d' },
  ];

  // Events by hour (last 8 hours)
  const now = Date.now();
  const hourBuckets = Array(8).fill(0);
  events.forEach(e => {
    const hrs = (now - new Date(e.createdAt).getTime()) / 3600000;
    if (hrs < 8) hourBuckets[Math.min(7, Math.floor(hrs))]++;
  });
  const sparkValues = [...hourBuckets].reverse();
  const sparkLabels = ['7h','6h','5h','4h','3h','2h','1h','Now'];

  // Purchase activity by user (bar)
  const userBars = [...users]
    .sort((a,b)=>(b.stats?.purchases||0)-(a.stats?.purchases||0)).slice(0,6)
    .map(u => ({ label:u.name?.split(' ')[0]||u.email?.split('@')[0], value:u.stats?.purchases||0 }));

  // Revenue by category bar
  const revBars = Object.entries(catRevMap)
    .map(([cat,rev]) => ({ label:cat, value:Math.round(rev/1000), color:catColors[cat]||'#6c757d' }))
    .sort((a,b)=>b.value-a.value);

  const kpis = [
    { label:'Total Users',     value:overview?.totalUsers,    icon:'👥', color:'primary', link:'/users',   sub:`${users.filter(u=>u.stats?.purchases>0).length} have purchased` },
    { label:'Total Events',    value:overview?.totalEvents,   icon:'📋', color:'info',    link:'/events',  sub:`${eventDonut[0].value} views` },
    { label:'Purchases',       value:overview?.totalPurchases,icon:'💳', color:'success', link:'/tracker', sub:`${products.filter(p=>p.status==='hot').length} hot products` },
    { label:'Revenue',         value:`₹${((overview?.totalRevenue||0)/1000).toFixed(1)}K`, icon:'💰', color:'warning', link:'/sales-board', sub:'Total across all products' },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div className="card border-0 shadow mb-4 d-none d-md-block"
        style={{ background:'linear-gradient(135deg,#1a0000,#450000)', color:'#fff' }}>
        <div className="card-body py-3 px-4">
          <div className="row align-items-center">
            <div className="col-9">
              <h4 className="fw-bold text-danger mb-1">⚙️ Admin Dashboard</h4>
              <p className="text-light mb-0 small">
                WELCOME, <strong>{admin?.name}</strong> · <strong>{overview?.totalUsers}</strong> users · <strong>{overview?.totalEvents}</strong> events · <strong>{products.length}</strong> products tracked
              </p>
            </div>
            <div className="col-3 text-end">
              <div style={{ fontSize:'3rem' }}>⚙️</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="row g-2 g-md-3 mb-4">
        {kpis.map((k,i) => (
          <div key={i} className="col-6 col-md-3">
            <KpiCard {...k} />
          </div>
        ))}
      </div>
      
      {/* Top seller banner */}
      {overview?.topProduct && (
        <div className="alert alert-warning border-0 shadow-sm mb-4 d-flex align-items-center gap-3 flex-wrap">
          <span style={{ fontSize:'2rem' }}>{overview.topProduct.emoji||'📦'}</span>
          <div className="flex-grow-1">
            <strong>🏆 Top Seller:</strong> {overview.topProduct.productName}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-warning text-dark">{overview.topProduct.totalPurchases} purchases</span>
            <span className="badge bg-success">₹{(overview.topProduct.totalRevenue||0).toLocaleString('en-IN')} revenue</span>
          </div>
        </div>
      )}

      {/* Row 1: Event donut + Top products bar */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small d-flex justify-content-between align-items-center">
              <span>📊 Events Breakdown</span>
              <Link to="/events" className="badge bg-secondary text-decoration-none" style={{ fontSize:'0.62rem' }}>View All</Link>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center py-4">
              <DonutChart segments={eventDonut} size={160} label="Events" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small d-flex justify-content-between align-items-center">
              <span>🏆 Top 8 Products by Purchases</span>
              <Link to="/sales-board" className="badge bg-warning text-dark text-decoration-none" style={{ fontSize:'0.62rem' }}>Full Board</Link>
            </div>
            <div className="card-body px-3 pt-3 pb-2">
              <BarChart data={topProducts} color="#dc3545" height={150} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Revenue donut + Status bar */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small">
              💰 Revenue by Category (₹K)
            </div>
            <div className="card-body d-flex align-items-center justify-content-center py-4">
              <DonutChart segments={catDonut} size={160} label="₹K" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small">📦 Product Performance Status</div>
            <div className="card-body px-3 pt-3 pb-2">
              <BarChart data={statusBars} height={120} />
              <div className="d-flex gap-3 flex-wrap mt-2 justify-content-center">
                {statusBars.map((s,i) => (
                  <div key={i} className="d-flex align-items-center gap-1 small">
                    <div style={{ width:10, height:10, borderRadius:2, background:s.color }} />
                    <span className="text-muted">{s.label}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Activity sparkline + Revenue by category bar */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small">
              📈 Event Activity — Last 8 Hours
            </div>
            <div className="card-body px-3 pt-3 pb-2">
              <Sparkline values={sparkValues} color="#0dcaf0" height={100} labels={sparkLabels} />
              <div className="text-center text-muted mt-1" style={{ fontSize:'0.7rem' }}>
                Total in window: <strong>{sparkValues.reduce((s,v)=>s+v,0)}</strong> events
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small">💹 Revenue by Category</div>
            <div className="card-body px-3 pt-3 pb-2">
              <BarChart data={revBars} height={120} />
              <div className="text-center text-muted mt-1" style={{ fontSize:'0.7rem' }}>
                Values in ₹ thousands
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: User purchases bar + Top users table */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small">👥 Top Users by Purchases</div>
            <div className="card-body px-3 pt-3 pb-2">
              <BarChart data={userBars} color="#6f42c1" height={130} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold small d-flex justify-content-between">
              <span>🏅 Top 5 Users — Leaderboard</span>
              <Link to="/users" className="badge bg-secondary text-decoration-none" style={{ fontSize:'0.62rem' }}>All Users</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width:44 }}>#</th>
                      <th>User</th>
                      <th className="text-center" style={{ width:70 }}>Buys</th>
                      <th className="text-end" style={{ width:110 }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...users].sort((a,b)=>(b.stats?.purchases||0)-(a.stats?.purchases||0)).slice(0,5).map((u,i) => (
                      <tr key={i}>
                        <td className="text-center fw-bold" style={{ fontSize:'1.1rem' }}>
                          {i===0?'🥇':i===1?'🥈':i===2?'🥉':<span className="text-muted small">#{i+1}</span>}
                        </td>
                        <td>
                          <div className="small fw-semibold">{u.name}</div>
                          <div className="text-muted" style={{ fontSize:'0.65rem' }}>{u.email}</div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-success px-2">{u.stats?.purchases||0}</span>
                        </td>
                        <td className="text-end fw-bold text-success small">
                          ₹{(u.stats?.revenue||0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {users.length===0 && (
                      <tr><td colSpan={4} className="text-center text-muted py-3 small">No users yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <h6 className="fw-bold text-muted text-uppercase mb-3 small" style={{ letterSpacing:'1px' }}>Quick Access</h6>
      <div className="row g-3">
        {[
          { to:'/users',       icon:'👥', label:'All Users',        desc:'User list & purchase history', color:'primary' },
          { to:'/sales-board', icon:'🏆', label:'Sales Board',      desc:'Products ranked by sales',     color:'warning' },
          { to:'/tracker',     icon:'🛒', label:'Purchase Tracker', desc:'Product performance metrics',  color:'success' },
          { to:'/events',      icon:'📋', label:'Recent Events',    desc:'Live event feed all users',    color:'info'    },
        ].map((n,i) => (
          <div key={i} className="col-6 col-md-3">
            <Link to={n.to} className="text-decoration-none">
              <div className={`card border-0 shadow-sm text-center h-100 border-bottom border-4 border-${n.color}`}
                style={{ transition:'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <div className="card-body py-3">
                  <div style={{ fontSize:'2rem' }}>{n.icon}</div>
                  <h6 className="fw-bold mt-2 mb-1 small">{n.label}</h6>
                  <p className="text-muted mb-0" style={{ fontSize:'0.72rem' }}>{n.desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
