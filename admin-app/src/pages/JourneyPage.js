const AdminJourneyPage = () => (
  <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

    {/* ── Header bar ── */}
    <div className="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden">
      <div style={{ height:5, background:'linear-gradient(90deg,#1a0000,#dc3545,#ff6b6b,#1a0000)' }}/>
      <div className="card-body p-4">
        <h5 className="fw-bold mb-1" style={{ color:'#212121' }}>🗺️ About the Admin Journey</h5>
        <p className="text-muted small mb-0">
          Everything you need to know about the TechGear Admin Panel — what it does, how it works, and how to use it.
        </p>
      </div>
    </div>

    {/* ── What is the Admin Panel ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
      <div style={{ height:4, background:'linear-gradient(90deg,#dc3545,#c62828)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-2" style={{ color:'#212121' }}>⚙️ What is the Admin Panel?</h6>
        <p className="text-muted small mb-3">
          The TechGear Admin Panel is a dedicated control center for administrators to monitor, analyze, and understand
          how users interact with the TechGear Store in real time. It gives full visibility into user activity,
          product performance, and purchase behavior — all from one place.
        </p>
        <div className="row g-3">
          {[
            { icon:'👥', title:'User Management',     desc:'See every registered user, their activity stats, purchase history, and total spend.',                    bg:'#e8f4fd', color:'#1565c0', border:'#2874f0' },
            { icon:'📦', title:'Product Intelligence',desc:'Track views, cart additions, and purchases for all 50 products. Spot hot sellers and dead stock instantly.', bg:'#e8f5e9', color:'#1b5e20', border:'#26a541' },
            { icon:'🏆', title:'Sales Board',          desc:'Live leaderboard of all products ranked by units sold. Starts at 0 and grows as users purchase.',          bg:'#fff8e1', color:'#e65100', border:'#ff9f00' },
            { icon:'📋', title:'Event Stream',         desc:'Real-time feed of every action taken across the platform — views, cart adds, and purchases.',               bg:'#fce4ec', color:'#880e4f', border:'#e91e63' },
          ].map((item, i) => (
            <div key={i} className="col-md-6">
              <div className="d-flex gap-3 p-3 rounded-3 h-100"
                style={{ background:item.bg, border:`1px solid ${item.border}22` }}>
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width:44, height:44, background:'#fff', fontSize:'1.5rem', border:`1px solid ${item.border}33`, alignSelf:'flex-start' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="fw-bold small mb-1" style={{ color:'#212121' }}>{item.title}</div>
                  <div className="text-muted" style={{ fontSize:'0.75rem' }}>{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Admin Workflow steps ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
      <div style={{ height:4, background:'linear-gradient(90deg,#1565c0,#2874f0)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>🚀 How the Admin Journey Works</h6>
        <div className="row g-3">
          {[
            { step:1, icon:'🔑', title:'Admin Registers',   desc:'Create an account using the secret code. Role is set to "admin" — unlocks all protected endpoints.',              bg:'#fce4ec', border:'#e91e63', color:'#880e4f' },
            { step:2, icon:'📊', title:'Views Dashboard',   desc:'Land on the Dashboard showing platform KPIs — total users, events, purchases, revenue, and charts.',            bg:'#e8f4fd', border:'#2874f0', color:'#1565c0' },
            { step:3, icon:'👁️', title:'Monitors Users',    desc:'All Users page lists every shopper with stats. Click any user to see their full purchase event history.',       bg:'#e8f5e9', border:'#26a541', color:'#1b5e20' },
            { step:4, icon:'🏆', title:'Checks Sales Board',desc:'Sales Board shows all 50 products ranked by units sold. Starts at 0, climbs as users purchase.',               bg:'#fff8e1', border:'#ff9f00', color:'#e65100' },
            { step:5, icon:'🛒', title:'Reviews Tracker',   desc:'Purchase Tracker gives performance breakdown — hot, normal, slow, dead — with revenue and conversion rate.',    bg:'#fce4ec', border:'#e91e63', color:'#880e4f' },
            { step:6, icon:'📋', title:'Reads Event Feed',  desc:'Recent Events streams the last 100 user actions across the whole platform, filterable by event type.',          bg:'#e8f4fd', border:'#2874f0', color:'#1565c0' },
          ].map(s => (
            <div key={s.step} className="col-md-4">
              <div className="d-flex gap-3 p-3 rounded-3 h-100"
                style={{ background:s.bg, border:`1px solid ${s.border}33`, borderLeft:`4px solid ${s.border}` }}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge rounded-pill px-2 py-1"
                      style={{ background:'#fff', color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:700 }}>
                      Step {s.step}
                    </span>
                    <span style={{ fontSize:'1.1rem' }}>{s.icon}</span>
                  </div>
                  <div className="fw-bold small mb-1" style={{ color:'#212121' }}>{s.title}</div>
                  <div className="text-muted" style={{ fontSize:'0.72rem', lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Sidebar Guide ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
      <div style={{ height:4, background:'linear-gradient(90deg,#26a541,#00c853)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>🧭 Sidebar Navigation Guide</h6>
        <div className="rounded-3 overflow-hidden" style={{ border:'1px solid #e0e0e0' }}>
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ background:'#f5f5f5' }}>
              <tr>
                <th style={{ width:50, border:0, color:'#555', fontSize:'0.78rem' }}>Icon</th>
                <th style={{ width:160, border:0, color:'#555', fontSize:'0.78rem' }}>Page</th>
                <th style={{ border:0, color:'#555', fontSize:'0.78rem' }}>What You Can Do Here</th>
              </tr>
            </thead>
            <tbody>
              {[
                { icon:'📊', page:'Dashboard',           info:'Overview KPIs — users, events, purchases, revenue, and top-selling product at a glance.',          bg:'#e8f4fd', color:'#1565c0' },
                { icon:'👥', page:'All Users',           info:'Full user list with stats. Click a user to open a modal with their complete purchase history.',      bg:'#e8f5e9', color:'#1b5e20' },
                { icon:'📦', page:'Product Catalog',     info:'Browse all 50 products with real-time sales data overlaid. View-only — no cart.',                   bg:'#fff8e1', color:'#e65100' },
                { icon:'🏆', page:'Sales Board',         info:'Products ranked by units sold. Filters by category, search by name, bar chart per product.',        bg:'#fce4ec', color:'#880e4f' },
                { icon:'🛒', page:'Purchase Tracker',    info:'Performance table with hot/normal/slow/dead labels, revenue, and conversion rates.',                bg:'#e8f4fd', color:'#1565c0' },
                { icon:'📋', page:'Recent Events',       info:'Live feed of the last 100 user actions across the entire platform. Filter by event type.',          bg:'#e8f5e9', color:'#1b5e20' },
                { icon:'🗺️', page:'Journey (this page)', info:'This page — explains what the admin panel does and how to use it.',                                  bg:'#fff8e1', color:'#e65100' },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop:'1px solid #f0f0f0' }}>
                  <td style={{ border:0 }}>
                    <div className="d-flex align-items-center justify-content-center rounded-2"
                      style={{ width:36, height:36, background:row.bg, fontSize:'1.1rem' }}>
                      {row.icon}
                    </div>
                  </td>
                  <td style={{ border:0 }}>
                    <span className="fw-semibold small" style={{ color:row.color }}>{row.page}</span>
                  </td>
                  <td className="text-muted small" style={{ border:0, fontSize:'0.72rem' }}>{row.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ── Access & Security ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div style={{ height:4, background:'linear-gradient(90deg,#ff9f00,#ff6d00)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>🔐 Access & Security</h6>
        <div className="row g-3">
          {[
            { icon:'🛡️', title:'Admin-Only Routes',  desc:'Every admin page is protected by a Bearer token. Without a valid admin token, all API calls return 403 Forbidden.',                         bg:'#fce4ec', color:'#880e4f', border:'#e91e63' },
            { icon:'🔑', title:'Registration Code',  desc:'To create an admin account you must enter the secret code: TECHGEAR_ADMIN_2026. Without it, signup is blocked.',                           bg:'#e8f4fd', color:'#1565c0', border:'#2874f0' },
            { icon:'💾', title:'Persistent Data',    desc:'When MongoDB Atlas is connected, all accounts, events, and stats are saved permanently across restarts. Keep server/.env pointed at your Atlas cluster.', bg:'#e8f5e9', color:'#1b5e20', border:'#26a541' },
            { icon:'🔄', title:'Session Handling',   desc:'Admin sessions are stored in sessionStorage — they expire when the browser tab is closed, keeping the panel secure on shared machines.',   bg:'#fff8e1', color:'#e65100', border:'#ff9f00' },
          ].map((item, i) => (
            <div key={i} className="col-md-6">
              <div className="d-flex gap-3 p-3 rounded-3 h-100"
                style={{ background:item.bg, border:`1px solid ${item.border}22` }}>
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width:44, height:44, background:'#fff', fontSize:'1.5rem', border:`1px solid ${item.border}33`, alignSelf:'flex-start' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="fw-bold small mb-1" style={{ color:'#212121' }}>{item.title}</div>
                  <div className="text-muted" style={{ fontSize:'0.75rem', lineHeight:1.5 }}>{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default AdminJourneyPage;
