import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="min-vh-100" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)' }}>
    {/* Navbar */}
    <nav className="d-flex justify-content-between align-items-center px-4 py-3">
      <div className="d-flex align-items-center gap-2 text-white fw-bold fs-5">
        <span>🛒</span>
        <span className="text-warning">TechGear</span>
        <span>Store</span>
      </div>
      <div className="d-flex gap-2">
        <Link to="/login"  className="btn btn-outline-light btn-sm">Login</Link>
        <Link to="/signup" className="btn btn-warning btn-sm fw-bold">Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <div className="container text-center text-white py-5 mt-3">
      <div style={{ fontSize: '5rem' }} className="mb-3">🛒</div>
      <h1 className="display-3 fw-bold mb-3">
        <span className="text-warning">TechGear</span> Store
      </h1>
      <p className="lead text-light mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
        Discover 50+ premium technology products — from the latest smartphones to cutting-edge laptops, gadgets, and accessories.
      </p>
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link to="/signup" className="btn btn-warning btn-lg fw-bold px-5">🚀 Shop Now</Link>
        <Link to="/login"  className="btn btn-outline-light btn-lg px-5">Sign In</Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mt-5 justify-content-center">
        {[['50+','Products'],['30+','Brands'],['4','Categories'],['₹','Best Prices']].map(([v,l]) => (
          <div className="col-6 col-md-3" key={l}>
            <div className="bg-white bg-opacity-10 rounded-3 p-3">
              <div className="fs-2 fw-bold text-warning">{v}</div>
              <div className="text-light small">{l}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Category preview */}
    <div className="container pb-5">
      <h3 className="text-white text-center fw-bold mb-4">Shop by Category</h3>
      <div className="row g-3 justify-content-center">
        {[
          ['📱','Phones','8 products'],
          ['💻','Laptops','10 products'],
          ['⌚','Gadgets','22 products'],
          ['🔌','Accessories','10 products'],
        ].map(([ic,nm,ct]) => (
          <div className="col-6 col-md-3" key={nm}>
            <div className="card border-0 text-center h-100 bg-white bg-opacity-10 text-white">
              <div className="card-body py-4">
                <div style={{ fontSize: '2.5rem' }}>{ic}</div>
                <h6 className="fw-bold mt-2 mb-1 text-warning">{nm}</h6>
                <small className="text-light">{ct}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <footer className="text-center text-secondary py-3 border-top border-secondary">
      <small>🛒 TechGear Store © 2026 — Smart User Journey Analytics</small>
    </footer>
  </div>
);

export default LandingPage;
