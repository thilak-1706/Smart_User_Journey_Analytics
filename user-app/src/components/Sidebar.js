import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { localCart, localOrders } from '../services/api';

const Sidebar = ({ onToast, isOpen, setOpen }) => {
  const { user, logout, sessionStart } = useAuth();
  const navigate = useNavigate();
  const [cartCount,  setCartCount]  = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [elapsed,    setElapsed]    = useState('00:00');

  useEffect(() => {
    const updateCart   = () => setCartCount(localCart.get().reduce((s,i) => s + i.quantity, 0));
    const updateOrders = () => setOrderCount(localOrders.count());
    updateCart(); updateOrders();
    window.addEventListener('cartUpdated',   updateCart);
    window.addEventListener('ordersUpdated', updateOrders);
    return () => {
      window.removeEventListener('cartUpdated',   updateCart);
      window.removeEventListener('ordersUpdated', updateOrders);
    };
  }, []);

  useEffect(() => {
    if (!sessionStart) return;
    const start = sessionStart.getTime();
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      setElapsed(`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const handleLogout = () => { logout(); onToast?.('Logged out', 'info'); navigate('/'); };
  const close = () => setOpen(false);

  const navGroups = [
  {
    title: "SHOP",
    items: [
      { to:'/dashboard', icon:'🏠', label:'Dashboard' },
      { to:'/products',  icon:'🛍️', label:'Products' },
    ]
  },
  {
    title: "CART",
    items: [
      { to:'/cart',     icon:'🛒', label:'Cart', badge: cartCount },
      { to:'/checkout', icon:'💳', label:'Checkout' },
    ]
  },
  {
    title: "ORDERS",
    items: [
      { 
        to:'/orders',  icon:'📦', label:'My Orders' },
    ]
  },
  {
    title:"ABOUT",
    items: [
      { to:'/journey', icon:'🗺️', label:'Journey' },
    ]
  }
];

  if (!user) return null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="d-flex d-lg-none align-items-center justify-content-between px-3 py-2"
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:1040,
                 background:'linear-gradient(90deg,#1a1200,#2d2000)', height:52 }}>
        <button className="btn btn-sm btn-outline-warning" onClick={() => setOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize:'1.2rem' }}>🛒</span>
          <span className="fw-bold text-warning small">TechGear</span>
        </div>
        <div className="d-flex gap-1">
          {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
          {orderCount > 0 && <span className="badge bg-warning text-dark">{orderCount}</span>}
        </div>
      </div>

      {/* Sidebar panel */}
      <div className="d-flex flex-column text-white"
        style={{
          width: 240,
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1036,
          overflowY: 'auto',
          background: 'linear-gradient(180deg,#1a1200 0%,#2d2000 100%)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
        }}
        // Desktop: always visible
        ref={el => {
          if (el) {
            const mq = window.matchMedia('(min-width: 992px)');
            const apply = () => { el.style.transform = mq.matches ? 'translateX(0)' : (isOpen ? 'translateX(0)' : 'translateX(-100%)'); };
            apply();
            mq.addEventListener('change', apply);
          }
        }}
      >
        {/* Logo */}
        <div className="p-3 text-center" style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize:'2rem' }}>🛒</div>
          <div className="fw-bold text-warning fs-6 mt-1">TechGear Store</div>
          <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', letterSpacing:'2px' }}>USER PORTAL</div>
        </div>

        {/* User info */}
        <div className="px-3 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
              style={{ width:38, height:38, fontSize:'1rem', flexShrink:0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div className="fw-semibold small text-truncate text-white">{user.name}</div>
              <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.45)', wordBreak:'break-all' }}>{user.email}</div>
            </div>
          </div>
          <div className="d-flex gap-1 flex-wrap">
            <span className="badge bg-success" style={{ fontSize:'0.62rem' }}>⏱ {elapsed}</span>
            <span className="badge bg-primary"  style={{ fontSize:'0.62rem' }}>👤 User</span>
          </div>
        </div>

        {/* Nav */}
       <nav className="flex-grow-1 py-2">
  {navGroups.map(group => (
    <div key={group.title} className="mb-1">

      {/* group title */}
      <div
        className="px-3 pt-3 pb-1"
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase"
        }}
      >
        {group.title}
      </div>

      {group.items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `d-flex align-items-center gap-3 px-3 py-2 mx-2 rounded-2 mb-1 text-decoration-none ${
              isActive
                ? "bg-warning text-dark fw-semibold"
                : "text-white-50"
            }`
          }
          onClick={close}
        >
          <span style={{ minWidth: 20 }}>{item.icon}</span>
          <span className="flex-grow-1">{item.label}</span>

          {item.badge > 0 && (
            <span className="badge bg-danger">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}

    </div>
  ))}
</nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button className="btn btn-outline-warning btn-sm w-100 fw-semibold" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
