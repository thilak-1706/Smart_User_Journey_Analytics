import React from 'react';
const JourneyPage = () => (
  <div style={{ background:'#f1f3f6', minHeight:'100vh', padding:'1rem' }}>

    {/* ── Header bar ── */}
    <div className="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden">
      <div style={{ height:5, background:'linear-gradient(90deg,#2874f0,#26a541,#ff9f00,#e91e63)' }}/>
      <div className="card-body p-4">
        <h5 className="fw-bold mb-1" style={{ color:'#212121' }}>🗺️ User Journey</h5>
        <p className="text-muted small mb-0">
          How TechGear Store tracks and understands your shopping experience
        </p>
      </div>
    </div>

    {/* ── Journey step tracker ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
      <div style={{ height:4, background:'linear-gradient(90deg,#2874f0,#0062cc)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-4" style={{ color:'#212121' }}>📍 Your Shopping Journey</h6>

        {/* Desktop step flow */}
        <div className="d-none d-md-flex align-items-start gap-0">
          {[
            { step:1, icon:'🔐', title:'Sign Up / Login',  desc:'Create your account. All activity is linked to your profile.', bg:'#e8f4fd', border:'#2874f0', color:'#1565c0' },
            { step:2, icon:'🛍️', title:'Browse Products',  desc:'Explore 50+ tech products. Every view is recorded.',           bg:'#e8f5e9', border:'#26a541', color:'#1b5e20' },
            { step:3, icon:'🛒', title:'Add to Cart',      desc:'Add items. Cart adds signal buying intent.',                    bg:'#fff8e1', border:'#ff9f00', color:'#e65100' },
            { step:4, icon:'💳', title:'Purchase',         desc:'Complete your order. Updates product metrics in real time.',    bg:'#fce4ec', border:'#e91e63', color:'#880e4f' },
          ].map((s, i, arr) => (
            <div key={s.step} className="d-flex align-items-start flex-grow-1">
              <div className="d-flex flex-column align-items-center text-center flex-grow-1">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                  style={{ width:56, height:56, fontSize:'1.6rem', background:s.bg, border:`2px solid ${s.border}` }}>
                  {s.icon}
                </div>
                <span className="badge rounded-pill mb-2 px-3"
                  style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:'0.68rem', fontWeight:700 }}>
                  Step {s.step}
                </span>
                <h6 className="fw-bold mb-1 small" style={{ color:'#212121' }}>{s.title}</h6>
                <p className="text-muted px-2 mb-0" style={{ fontSize:'0.72rem' }}>{s.desc}</p>
              </div>
              {i < arr.length-1 && (
                <div className="d-flex align-items-center justify-content-center flex-shrink-0 pb-4"
                  style={{ width:40, marginTop:18, color:'#bbb', fontSize:'1.4rem' }}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile step flow */}
        <div className="d-flex flex-column gap-3 d-md-none">
          {[
            { step:1, icon:'🔐', title:'Sign Up / Login',  desc:'Create your account. All activity is linked to your profile.', bg:'#e8f4fd', border:'#2874f0', color:'#1565c0' },
            { step:2, icon:'🛍️', title:'Browse Products',  desc:'Explore 50+ tech products. Every view is recorded.',           bg:'#e8f5e9', border:'#26a541', color:'#1b5e20' },
            { step:3, icon:'🛒', title:'Add to Cart',      desc:'Add items. Cart adds signal buying intent.',                    bg:'#fff8e1', border:'#ff9f00', color:'#e65100' },
            { step:4, icon:'💳', title:'Purchase',         desc:'Complete your order. Updates product metrics in real time.',    bg:'#fce4ec', border:'#e91e63', color:'#880e4f' },
          ].map(s => (
            <div key={s.step} className="d-flex align-items-start gap-3 rounded-3 p-3"
              style={{ background:s.bg, border:`1px solid ${s.border}22` }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width:44, height:44, fontSize:'1.3rem', background:'#fff', border:`2px solid ${s.border}` }}>
                {s.icon}
              </div>
              <div>
                <span className="badge rounded-pill mb-1 px-2"
                  style={{ background:'#fff', color:s.color, border:`1px solid ${s.border}`, fontSize:'0.65rem', fontWeight:700 }}>
                  Step {s.step}
                </span>
                <div className="fw-bold small" style={{ color:'#212121' }}>{s.title}</div>
                <div className="text-muted" style={{ fontSize:'0.72rem' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── What & Why we track ── */}
    <div className="row g-3 mb-3">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
          <div style={{ height:4, background:'linear-gradient(90deg,#2874f0,#0062cc)' }}/>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>📊 What We Track</h6>
            {[
              { icon:'👁️', title:'Product Views',   desc:'Every product page you open',                   bg:'#e8f4fd', color:'#1565c0' },
              { icon:'🛒', title:'Cart Additions',  desc:'Items added to your cart',                      bg:'#fff8e1', color:'#e65100' },
              { icon:'💳', title:'Purchases',       desc:'Completed order items with quantity & price',    bg:'#e8f5e9', color:'#1b5e20' },
              { icon:'📍', title:'Session Data',    desc:'Session start time and duration',                bg:'#fce4ec', color:'#880e4f' },
            ].map(item => (
              <div key={item.title} className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width:42, height:42, background:item.bg, fontSize:'1.3rem' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="fw-semibold small" style={{ color:'#212121' }}>{item.title}</div>
                  <div className="text-muted" style={{ fontSize:'0.72rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
          <div style={{ height:4, background:'linear-gradient(90deg,#26a541,#00c853)' }}/>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color:'#212121' }}>💡 Why We Track</h6>
            {[
              { icon:'🎯', title:'Better Recommendations', desc:'Understand your preferences to suggest relevant products', bg:'#e8f5e9', color:'#1b5e20' },
              { icon:'📈', title:'Improve Products',       desc:'Identify popular items to curate better inventory',       bg:'#fff8e1', color:'#e65100' },
              { icon:'⚡', title:'Faster Experience',      desc:'Optimize shopping flow based on real user behavior',      bg:'#e8f4fd', color:'#1565c0' },
              { icon:'🔒', title:'Your Privacy',           desc:'Data is tied to your account and never shared',           bg:'#fce4ec', color:'#880e4f' },
            ].map(item => (
              <div key={item.title} className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width:42, height:42, background:item.bg, fontSize:'1.3rem' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="fw-semibold small" style={{ color:'#212121' }}>{item.title}</div>
                  <div className="text-muted" style={{ fontSize:'0.72rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* ── About TechGear ── */}
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
      <div style={{ height:4, background:'linear-gradient(90deg,#ff9f00,#ff6d00)' }}/>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-4" style={{ color:'#212121' }}>🛒 About TechGear Store</h6>
        <div className="row g-3">
          {[
            { icon:'🏪', title:'What is TechGear?',       bg:'#e8f4fd', color:'#1565c0',
              text:'TechGear Store is a premium e-commerce platform for technology products. We offer 50+ curated products across phones, laptops, gadgets, and accessories from 30+ global brands.' },
            { icon:'📊', title:'Smart Analytics',         bg:'#e8f5e9', color:'#1b5e20',
              text:'Behind every click is data. TechGear uses a full analytics pipeline — tracking events are stored in MongoDB and analyzed to help the admin make inventory decisions.' },
            { icon:'🔍', title:'Event-Based Tracking',    bg:'#fff8e1', color:'#e65100',
              text:'Our system tracks discrete events: product_viewed, add_to_cart, and purchase — giving a complete picture of the conversion funnel from discovery to purchase.' },
            { icon:'💰', title:'Business Impact',         bg:'#fce4ec', color:'#880e4f',
              text:'Analytics help identify dead products vs hot sellers. This lets the admin optimize inventory, run promotions, and replace slow products.' },
          ].map((p, i) => (
            <div key={i} className="col-md-6">
              <div className="d-flex gap-3 p-3 rounded-3 h-100"
                style={{ background:p.bg, border:`1px solid ${p.color}22` }}>
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width:48, height:48, background:'#fff', fontSize:'1.6rem',
                           border:`1px solid ${p.color}33`, alignSelf:'flex-start' }}>
                  {p.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-1 small" style={{ color:'#212121' }}>{p.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize:'0.72rem', lineHeight:1.5 }}>{p.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Trust badges ── */}
    <div className="card border-0 shadow-sm rounded-3 mt-3 overflow-hidden">
      <div className="card-body py-3 px-4">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {[
            { icon:'🚚', label:'Free Delivery',   color:'#1b5e20' },
            { icon:'↩️', label:'Easy Returns',    color:'#1565c0' },
            { icon:'🔒', label:'Secure Payments', color:'#e65100' },
            { icon:'⭐', label:'Top Brands',       color:'#880e4f' },
          ].map((b,i) => (
            <div key={i} className="d-flex align-items-center gap-2">
              <span style={{ fontSize:'1.2rem' }}>{b.icon}</span>
              <span className="fw-semibold" style={{ fontSize:'0.78rem', color:b.color }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default JourneyPage;