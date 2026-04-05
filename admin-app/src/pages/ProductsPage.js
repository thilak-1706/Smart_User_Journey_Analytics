import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

// ── Full 50-product catalog (matches user-app exactly) ────────────────────────
const CATALOG = [
  // PHONES
  { id:'p1',  name:'iPhone 15 Pro Max',            category:'Phones',      price:159999, emoji:'📱', brand:'Apple',     specs:'256GB | A17 Pro | 48MP' },
  { id:'p2',  name:'Samsung Galaxy S24 Ultra',     category:'Phones',      price:134999, emoji:'📱', brand:'Samsung',   specs:'256GB | Snapdragon 8 Gen 3 | 200MP' },
  { id:'p3',  name:'OnePlus 12',                   category:'Phones',      price:64999,  emoji:'📱', brand:'OnePlus',   specs:'256GB | Snapdragon 8 Gen 3 | 50MP' },
  { id:'p4',  name:'Google Pixel 8 Pro',           category:'Phones',      price:89999,  emoji:'📱', brand:'Google',    specs:'128GB | Tensor G3 | 50MP' },
  { id:'p5',  name:'Xiaomi 14 Pro',                category:'Phones',      price:74999,  emoji:'📱', brand:'Xiaomi',    specs:'256GB | Snapdragon 8 Gen 3 | 50MP' },
  { id:'p6',  name:'Realme GT 5 Pro',              category:'Phones',      price:39999,  emoji:'📱', brand:'Realme',    specs:'256GB | Snapdragon 8 Gen 2 | 50MP' },
  { id:'p7',  name:'Vivo X100 Pro',                category:'Phones',      price:84999,  emoji:'📱', brand:'Vivo',      specs:'256GB | Dimensity 9300 | 50MP' },
  { id:'p8',  name:'OPPO Find X7 Ultra',           category:'Phones',      price:94999,  emoji:'📱', brand:'OPPO',      specs:'256GB | Snapdragon 8 Gen 3 | 50MP' },
  // LAPTOPS
  { id:'l1',  name:'MacBook Pro 16" M3 Max',       category:'Laptops',     price:349999, emoji:'💻', brand:'Apple',     specs:'36GB RAM | 1TB SSD | M3 Max' },
  { id:'l2',  name:'Dell XPS 15',                  category:'Laptops',     price:169999, emoji:'💻', brand:'Dell',      specs:'32GB RAM | 1TB SSD | RTX 4070' },
  { id:'l3',  name:'HP Spectre x360',              category:'Laptops',     price:149999, emoji:'💻', brand:'HP',        specs:'16GB RAM | 512GB SSD | Intel i7' },
  { id:'l4',  name:'Lenovo ThinkPad X1 Carbon',    category:'Laptops',     price:139999, emoji:'💻', brand:'Lenovo',    specs:'16GB RAM | 512GB SSD | Intel i7' },
  { id:'l5',  name:'ASUS ROG Zephyrus G16',        category:'Laptops',     price:189999, emoji:'💻', brand:'ASUS',      specs:'32GB RAM | 1TB SSD | RTX 4080' },
  { id:'l6',  name:'Microsoft Surface Laptop 5',   category:'Laptops',     price:119999, emoji:'💻', brand:'Microsoft', specs:'16GB RAM | 512GB SSD | Intel i7' },
  { id:'l7',  name:'Razer Blade 16',               category:'Laptops',     price:279999, emoji:'💻', brand:'Razer',     specs:'32GB RAM | 1TB SSD | RTX 4090' },
  { id:'l8',  name:'Acer Swift Edge 16',           category:'Laptops',     price:89999,  emoji:'💻', brand:'Acer',      specs:'16GB RAM | 512GB SSD | Ryzen 7' },
  { id:'l9',  name:'MacBook Air M3',               category:'Laptops',     price:119999, emoji:'💻', brand:'Apple',     specs:'16GB RAM | 512GB SSD | M3' },
  { id:'l10', name:'LG Gram 17',                   category:'Laptops',     price:109999, emoji:'💻', brand:'LG',        specs:'16GB RAM | 512GB SSD | Intel i7' },
  // GADGETS
  { id:'g1',  name:'Apple Watch Ultra 2',          category:'Gadgets',     price:89900,  emoji:'⌚', brand:'Apple',     specs:'49mm | Titanium | GPS + Cellular' },
  { id:'g2',  name:'Samsung Galaxy Watch 6 Classic',category:'Gadgets',    price:34999,  emoji:'⌚', brand:'Samsung',   specs:'47mm | Sapphire Glass | Health Monitor' },
  { id:'g3',  name:'Garmin Fenix 7X Pro',          category:'Gadgets',     price:79999,  emoji:'⌚', brand:'Garmin',    specs:'Solar | Multi-sport GPS | 28-day battery' },
  { id:'g4',  name:'Sony WH-1000XM5',              category:'Gadgets',     price:29990,  emoji:'🎧', brand:'Sony',      specs:'30hr battery | ANC | LDAC' },
  { id:'g5',  name:'AirPods Pro 2nd Gen',          category:'Gadgets',     price:24900,  emoji:'🎧', brand:'Apple',     specs:'H2 chip | ANC | Adaptive Audio' },
  { id:'g6',  name:'Bose QuietComfort 45',         category:'Gadgets',     price:26990,  emoji:'🎧', brand:'Bose',      specs:'24hr battery | ANC | Comfortable' },
  { id:'g7',  name:'DJI Mini 4 Pro',               category:'Gadgets',     price:74999,  emoji:'🚁', brand:'DJI',       specs:'4K/60fps | 34-min flight | Obstacle Sensing' },
  { id:'g8',  name:'GoPro Hero 12 Black',          category:'Gadgets',     price:43500,  emoji:'📷', brand:'GoPro',     specs:'5.3K | HyperSmooth 6.0 | Waterproof' },
  { id:'g9',  name:'Meta Quest 3',                 category:'Gadgets',     price:49999,  emoji:'🥽', brand:'Meta',      specs:'Mixed Reality | Snapdragon XR2 Gen 2 | 128GB' },
  { id:'g10', name:'Fitbit Charge 6',              category:'Gadgets',     price:14999,  emoji:'⌚', brand:'Fitbit',    specs:'Heart Rate | GPS | Google integration' },
  { id:'g11', name:'Nothing Phone 2a',             category:'Gadgets',     price:23999,  emoji:'📱', brand:'Nothing',   specs:'12GB RAM | 256GB | Glyph Interface' },
  { id:'g12', name:'Amazon Echo Show 10',          category:'Gadgets',     price:24999,  emoji:'🔊', brand:'Amazon',    specs:'10.1" HD | Alexa | 13MP camera' },
  { id:'t1',  name:'iPad Pro 12.9" M2',            category:'Gadgets',     price:112900, emoji:'📟', brand:'Apple',     specs:'256GB | M2 chip | Mini-LED | 12MP' },
  { id:'t2',  name:'Samsung Galaxy Tab S9 Ultra',  category:'Gadgets',     price:108999, emoji:'📟', brand:'Samsung',   specs:'256GB | Snapdragon 8 Gen 2 | 14.6" AMOLED' },
  { id:'t3',  name:'Microsoft Surface Pro 9',      category:'Gadgets',     price:119999, emoji:'📟', brand:'Microsoft', specs:'16GB RAM | 256GB | Intel i7 | Windows 11' },
  { id:'t4',  name:'OnePlus Pad 2',                category:'Gadgets',     price:39999,  emoji:'📟', brand:'OnePlus',   specs:'256GB | Snapdragon 8 Gen 3 | 12.1" LTPO' },
  { id:'c1',  name:'Sony Alpha A7 IV',             category:'Gadgets',     price:219999, emoji:'📷', brand:'Sony',      specs:'33MP | 4K/60fps | IBIS | Eye-AF' },
  { id:'c2',  name:'Canon EOS R5',                 category:'Gadgets',     price:349999, emoji:'📷', brand:'Canon',     specs:'45MP | 8K RAW | IBIS | Dual Pixel AF' },
  { id:'c3',  name:'Nikon Z8',                     category:'Gadgets',     price:289999, emoji:'📷', brand:'Nikon',     specs:'45.7MP | 8K/60fps | ProRes | IBIS' },
  { id:'gm1', name:'PlayStation 5 Slim',           category:'Gadgets',     price:54990,  emoji:'🎮', brand:'Sony',      specs:'1TB SSD | 4K/120fps | DualSense' },
  { id:'gm2', name:'Xbox Series X',                category:'Gadgets',     price:51990,  emoji:'🎮', brand:'Microsoft', specs:'1TB SSD | 4K/120fps | Game Pass' },
  { id:'gm3', name:'Nintendo Switch OLED',         category:'Gadgets',     price:29999,  emoji:'🎮', brand:'Nintendo',  specs:'7" OLED | 64GB | Handheld/TV mode' },
  { id:'gm4', name:'ASUS ROG Ally',                category:'Gadgets',     price:79999,  emoji:'🎮', brand:'ASUS',      specs:'Ryzen Z1 Extreme | 7" 120Hz | Windows 11' },
  // ACCESSORIES
  { id:'a1',  name:'Apple Magic Keyboard',         category:'Accessories', price:12900,  emoji:'⌨️', brand:'Apple',     specs:'Wireless | Touch ID | Scissor mechanism' },
  { id:'a2',  name:'Logitech MX Master 3S',        category:'Accessories', price:9999,   emoji:'🖱️', brand:'Logitech',  specs:'Wireless | 8K DPI | MagSpeed scroll' },
  { id:'a3',  name:'Anker 100W GaN Charger',       category:'Accessories', price:3999,   emoji:'🔌', brand:'Anker',     specs:'4-port | GaN technology | Foldable' },
  { id:'a4',  name:'Samsung 25000mAh Power Bank',  category:'Accessories', price:4999,   emoji:'🔋', brand:'Samsung',   specs:'25000mAh | 45W Fast charge | 3 ports' },
  { id:'a5',  name:'SanDisk 1TB Portable SSD',     category:'Accessories', price:12999,  emoji:'💾', brand:'SanDisk',   specs:'1050MB/s | USB-C | Shockproof' },
  { id:'a6',  name:'LG 34" UltraWide Monitor',     category:'Accessories', price:54999,  emoji:'🖥️', brand:'LG',        specs:'34" WQHD | 144Hz | HDR | USB-C' },
  { id:'a7',  name:'Elgato Stream Deck MK.2',      category:'Accessories', price:14999,  emoji:'🎛️', brand:'Elgato',    specs:'15 LCD keys | Customizable | USB-C' },
  { id:'a8',  name:'UGREEN USB-C Hub 10-in-1',     category:'Accessories', price:3499,   emoji:'🔌', brand:'UGREEN',    specs:'10 ports | 4K HDMI | 100W PD | SD card' },
  { id:'a9',  name:'Keychron K2 Pro Keyboard',     category:'Accessories', price:8999,   emoji:'⌨️', brand:'Keychron',  specs:'Mechanical | Hot-swap | Wireless | RGB' },
  { id:'a10', name:'Apple AirTag (4 Pack)',         category:'Accessories', price:11900,  emoji:'🏷️', brand:'Apple',     specs:'UWB precision | IPX7 | CR2032 battery' },
];

const CATS = ['All', 'Phones', 'Laptops', 'Gadgets', 'Accessories'];

const CAT_ACCENT = {
  Phones:      { bg:'#e8f4fd', border:'#2874f0', tag:'#2874f0', tagText:'#fff' },
  Laptops:     { bg:'#eafaf1', border:'#26a541', tag:'#26a541', tagText:'#fff' },
  Gadgets:     { bg:'#fff8e1', border:'#ff9f00', tag:'#ff9f00', tagText:'#fff' },
  Accessories: { bg:'#fce4ec', border:'#e91e63', tag:'#e91e63', tagText:'#fff' },
};
const ac = (cat) => CAT_ACCENT[cat] || { bg:'#f5f5f5', border:'#9e9e9e', tag:'#9e9e9e', tagText:'#fff' };

const STATUS_META = {
  hot:    { label:'🔥 Hot',    bg:'#ff5722', text:'#fff' },
  normal: { label:'✅ Normal', bg:'#4caf50', text:'#fff' },
  slow:   { label:'🐢 Slow',  bg:'#ff9800', text:'#fff' },
  dead:   { label:'💀 Dead',  bg:'#9e9e9e', text:'#fff' },
};

const AdminProductsPage = () => {
  const [stats,    setStats]    = useState([]);
  const [category, setCategory] = useState('All');
  const [search,   setSearch]   = useState('');
  const [view,     setView]     = useState('grid');
  const [modal,    setModal]    = useState(null);
  const [sortBy,   setSortBy]   = useState('default');

  useEffect(() => {
    adminAPI.products().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const getStat = (id) => stats.find(s => s.productId === id);

  let filtered = CATALOG.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.brand.toLowerCase().includes(search.toLowerCase()))
  );
  if (sortBy === 'price_asc')   filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortBy === 'price_desc')  filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortBy === 'most_sold')   filtered = [...filtered].sort((a,b) => (getStat(b.id)?.totalPurchases||0) - (getStat(a.id)?.totalPurchases||0));
  if (sortBy === 'most_viewed') filtered = [...filtered].sort((a,b) => (getStat(b.id)?.totalViews||0) - (getStat(a.id)?.totalViews||0));

  return (
    <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

      {/* ── Header bar ── */}
      {/* ── Header bar ── */}
<div className="card border-0 shadow-sm mb-3 rounded-3"
  style={{ background:'linear-gradient(90deg,#1a1a1a,#2d2d2d)' }}>
  <div className="card-body py-3 px-4">
    <div className="d-flex align-items-center gap-3 flex-wrap">
      <div className="flex-grow-1">
        <h5 className="fw-bold text-danger mb-1">📦 Product Catalog</h5>
        <small className="text-light mb-0 small">
          {filtered.length} of {CATALOG.length} products — view-only with live sales overlay
        </small>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <input
          className="form-control rounded-pill shadow-sm"
          placeholder="🔍  Search products, brands..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth:200, border:'none', fontSize:'0.88rem' }}
        />
        <select
          className="form-select rounded-pill shadow-sm"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ maxWidth:170, border:'none', fontSize:'0.82rem' }}>
          <option value="default">Sort: Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="most_sold">Most Sold</option>
          <option value="most_viewed">Most Viewed</option>
        </select>
        <div className="btn-group shadow-sm">
          <button
            className="btn btn-sm rounded-start-pill"
            style={{ background:view==='grid'?'#fff':'rgba(255,255,255,0.15)', color:view==='grid'?'#1a1a1a':'#fff', border:'none', fontWeight:600 }}
            onClick={() => setView('grid')}>⊞ Grid</button>
          <button
            className="btn btn-sm rounded-end-pill"
            style={{ background:view==='table'?'#fff':'rgba(255,255,255,0.15)', color:view==='table'?'#1a1a1a':'#fff', border:'none', fontWeight:600 }}
            onClick={() => setView('table')}>≡ Table</button>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* ── Category pills ── */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {CATS.map(c => {
          const a = ac(c);
          const active = category === c;
          return (
            <button key={c} onClick={() => setCategory(c)}
              className="btn btn-sm fw-semibold rounded-pill"
              style={{
                background: active ? a.tag : '#fff',
                color:      active ? a.tagText : '#333',
                border:     `1.5px solid ${active ? a.tag : '#ddd'}`,
                fontSize:   '0.8rem', padding:'4px 14px',
                boxShadow:  active ? `0 2px 8px ${a.tag}55` : 'none',
                transition: '0.2s',
              }}>
              {c}
              <span className="ms-1" style={{ opacity:0.75, fontSize:'0.72rem' }}>
                ({c==='All' ? CATALOG.length : CATALOG.filter(p=>p.category===c).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── No results ── */}
      {filtered.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize:'3rem' }}>🔍</div>
          <p className="text-muted mt-2">No products match "<strong>{search}</strong>"</p>
          <button className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear filters
          </button>
        </div>
      )}

      {/* ══ GRID VIEW ══════════════════════════════════════════════════════════ */}
      {view === 'grid' && (
        <div className="row g-3">
          {filtered.map(p => {
            const s  = getStat(p.id);
            const a  = ac(p.category);
            const sm = s ? (STATUS_META[s.status] || STATUS_META.dead) : null;
            return (
              <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div
                  className="h-100 d-flex flex-column bg-white rounded-3 overflow-hidden"
                  style={{ border:'1px solid #e0e0e0', transition:'box-shadow 0.22s, transform 0.22s', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.13)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>

                  {/* Image area */}
                  <div
                    className="d-flex align-items-center justify-content-center position-relative"
                    style={{ background:a.bg, height:160, borderBottom:`2px solid ${a.border}22` }}
                    onClick={() => setModal(p)}>
                    <span style={{ fontSize:'4.5rem' }}>{p.emoji}</span>
                    <span className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill fw-bold"
                      style={{ background:a.tag, color:a.tagText, fontSize:'0.6rem', letterSpacing:'0.5px' }}>
                      {p.category.toUpperCase()}
                    </span>
                    {sm && (
                      <span className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill fw-bold"
                        style={{ background:sm.bg, color:sm.text, fontSize:'0.6rem' }}>
                        {sm.label}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="d-flex flex-column flex-grow-1 p-3">
                    <div className="text-muted fw-semibold mb-1"
                      style={{ fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'0.8px' }}>
                      {p.brand}
                    </div>
                    <h6 className="fw-bold mb-1"
                      style={{ fontSize:'0.86rem', color:'#212121', lineHeight:1.4,
                               display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {p.name}
                    </h6>
                    <p className="text-muted mb-2"
                      style={{ fontSize:'0.71rem', lineHeight:1.4,
                               display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {p.specs}
                    </p>
                    <div className="fw-bold mb-3" style={{ fontSize:'1.1rem', color:'#212121' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>

                    {/* Live stats */}
                    {s ? (
                      <div className="row g-1 text-center mt-auto">
                        {[
                          { label:'Views',  value:s.totalViews||0,                                     bg:'#e3f2fd', color:'#1565c0' },
                          { label:'Cart',   value:s.totalAddToCart||0,                                 bg:'#fff8e1', color:'#e65100' },
                          { label:'Sold',   value:s.totalPurchases||0,                                 bg:'#e8f5e9', color:'#1b5e20' },
                          { label:'₹K Rev', value:Math.round((s.totalRevenue||0)/1000)+'K',            bg:'#fce4ec', color:'#880e4f' },
                        ].map((stat,i) => (
                          <div key={i} className="col-3">
                            <div className="rounded-2 py-1" style={{ background:stat.bg }}>
                              <div className="fw-bold" style={{ fontSize:'0.72rem', color:stat.color }}>{stat.value}</div>
                              <div style={{ fontSize:'0.56rem', color:'#888' }}>{stat.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center mt-auto py-2 rounded-2"
                        style={{ background:'#f5f5f5', fontSize:'0.72rem', color:'#aaa' }}>
                        No activity yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ TABLE VIEW ═════════════════════════════════════════════════════════ */}
      {view === 'table' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background:'#1a237e' }}>
                <tr>
                  {['#','Product','Category','Price','Views','Cart','Sold','Revenue','Status'].map(h => (
                    <th key={h} style={{ color:'#fff', fontWeight:600, fontSize:'0.82rem',
                      textAlign: ['Views','Cart','Sold','Revenue','Status'].includes(h) ? 'center' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const s  = getStat(p.id);
                  const a  = ac(p.category);
                  const sm = s ? (STATUS_META[s.status] || STATUS_META.dead) : null;
                  return (
                    <tr key={p.id} style={{ cursor:'pointer' }}
                      onClick={() => setModal(p)}
                      onMouseEnter={e => e.currentTarget.style.background='#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background=''}>
                      <td className="text-muted small">{i+1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                            style={{ width:42, height:42, background:a.bg, fontSize:'1.5rem' }}>
                            {p.emoji}
                          </div>
                          <div>
                            <div className="fw-semibold small">{p.name}</div>
                            <div className="text-muted" style={{ fontSize:'0.68rem' }}>{p.brand} · {p.specs}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge rounded-pill px-2 py-1 fw-semibold"
                          style={{ background:a.tag, color:a.tagText, fontSize:'0.68rem' }}>
                          {p.category}
                        </span>
                      </td>
                      <td className="fw-bold" style={{ color:'#212121', fontSize:'0.88rem' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="text-center">
                        <span className="badge rounded-pill px-2"
                          style={{ background:'#e3f2fd', color:'#1565c0', fontSize:'0.75rem' }}>
                          {s?.totalViews||0}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge rounded-pill px-2"
                          style={{ background:'#fff8e1', color:'#e65100', fontSize:'0.75rem' }}>
                          {s?.totalAddToCart||0}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge rounded-pill px-2 fw-bold"
                          style={{ background:s?.totalPurchases>0?'#e8f5e9':'#f5f5f5',
                                   color:s?.totalPurchases>0?'#1b5e20':'#aaa', fontSize:'0.78rem' }}>
                          {s?.totalPurchases||0}
                        </span>
                      </td>
                      <td className="text-center fw-bold" style={{ color:'#1b5e20', fontSize:'0.82rem' }}>
                        ₹{(s?.totalRevenue||0).toLocaleString('en-IN')}
                      </td>
                      <td className="text-center">
                        {sm
                          ? <span className="badge rounded-pill px-2 py-1"
                              style={{ background:sm.bg, color:sm.text, fontSize:'0.68rem' }}>
                              {sm.label}
                            </span>
                          : <span className="badge rounded-pill px-2"
                              style={{ background:'#f5f5f5', color:'#aaa', fontSize:'0.68rem' }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ PRODUCT DETAIL MODAL ═══════════════════════════════════════════════ */}
      {modal && (
        <div className="modal show d-block"
          style={{ background:'rgba(0,0,0,0.55)', zIndex:1055 }}
          onClick={() => setModal(null)}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth:520 }}
            onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">

              <div className="d-flex align-items-center justify-content-center position-relative py-4"
                style={{ background:ac(modal.category).bg, minHeight:180 }}>
                <span style={{ fontSize:'7rem' }}>{modal.emoji}</span>
                <button className="btn-close position-absolute top-0 end-0 m-3"
                  onClick={() => setModal(null)} />
                {getStat(modal.id) && (
                  <span className="position-absolute bottom-0 end-0 m-3 px-3 py-1 rounded-pill fw-bold small"
                    style={{ background:STATUS_META[getStat(modal.id).status]?.bg||'#9e9e9e', color:'#fff' }}>
                    {STATUS_META[getStat(modal.id).status]?.label||'—'}
                  </span>
                )}
              </div>

              <div className="modal-body px-4 pb-0 pt-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge rounded-pill px-2 py-1 fw-bold"
                    style={{ background:ac(modal.category).tag, color:ac(modal.category).tagText, fontSize:'0.65rem' }}>
                    {modal.category}
                  </span>
                  <span className="text-muted fw-semibold"
                    style={{ fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.6px' }}>
                    {modal.brand}
                  </span>
                </div>

                <h5 className="fw-bold mb-2" style={{ color:'#212121' }}>{modal.name}</h5>

                <div className="rounded-3 p-3 mb-3" style={{ background:'#f5f5f5', border:'1px solid #e0e0e0' }}>
                  <div className="fw-semibold mb-1" style={{ fontSize:'0.78rem', color:'#555' }}>🔧 Specifications</div>
                  <div style={{ fontSize:'0.82rem', color:'#333' }}>{modal.specs}</div>
                </div>

                <div className="fw-bold mb-3" style={{ fontSize:'1.6rem', color:'#212121' }}>
                  ₹{modal.price.toLocaleString('en-IN')}
                </div>

                {getStat(modal.id) ? (
                  <div className="row g-2 mb-3">
                    {[
                      { label:'Total Views',  value:getStat(modal.id).totalViews||0,                                          bg:'#e3f2fd', color:'#1565c0', icon:'👁️' },
                      { label:'Cart Adds',    value:getStat(modal.id).totalAddToCart||0,                                      bg:'#fff8e1', color:'#e65100', icon:'🛒' },
                      { label:'Units Sold',   value:getStat(modal.id).totalPurchases||0,                                      bg:'#e8f5e9', color:'#1b5e20', icon:'💳' },
                      { label:'Revenue',      value:'₹'+(getStat(modal.id).totalRevenue||0).toLocaleString('en-IN'),          bg:'#fce4ec', color:'#880e4f', icon:'💰' },
                    ].map((stat,i) => (
                      <div key={i} className="col-6">
                        <div className="rounded-3 p-2 d-flex align-items-center gap-2" style={{ background:stat.bg }}>
                          <span style={{ fontSize:'1.2rem' }}>{stat.icon}</span>
                          <div>
                            <div className="fw-bold" style={{ fontSize:'0.88rem', color:stat.color }}>{stat.value}</div>
                            <div style={{ fontSize:'0.65rem', color:'#888' }}>{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 rounded-3 mb-3"
                    style={{ background:'#f5f5f5', color:'#aaa', fontSize:'0.82rem' }}>
                    No sales activity yet
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 px-4 pb-4 pt-0">
                <button className="btn fw-bold w-100 rounded-pill"
                  style={{ background:`linear-gradient(135deg,${ac(modal.category).tag},${ac(modal.category).border})`,
                           color:'#fff', border:'none',
                           boxShadow:`0 3px 12px ${ac(modal.category).tag}55` }}
                  onClick={() => setModal(null)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;