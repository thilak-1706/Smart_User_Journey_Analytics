import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

const AdminSidebar = ({ onToast, isOpen, setOpen }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); onToast?.('Logged out', 'info'); navigate('/'); };
  const close = () => setOpen(false);

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { to:'/dashboard',   icon:'📊', label:'Dashboard'        },
        { to:'/users',       icon:'👥', label:'All Users'        },
      ]
    },
    {
      title: 'PRODUCTS',
      items: [
        { to:'/products',    icon:'📦', label:'Product Catalog'  },
        { to:'/sales-board', icon:'🏆', label:'Sales Board'      },
        { to:'/tracker',     icon:'🛒', label:'Purchase Tracker' },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { to:'/events',      icon:'📋', label:'Recent Events'    },
        { to:'/journey',     icon:'🗺️', label:'Journey'          },
      ]
    },
  ];

  if (!admin) return null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="d-flex d-lg-none align-items-center justify-content-between px-3"
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:1040, height:52,
                 background:'linear-gradient(90deg,#1a0000,#2d0000)' }}>
        <button className="btn btn-sm btn-outline-danger" onClick={() => setOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize:'1.2rem' }}>⚙️</span>
          <span className="fw-bold text-danger small">TechGear Admin</span>
        </div>
        <span className="badge bg-danger" style={{ fontSize:'0.62rem' }}>Admin</span>
      </div>

      {/* Sidebar */}
      <div className="d-flex flex-column text-white"
        style={{
          width:240, minHeight:'100vh', position:'fixed', top:0, left:0, zIndex:1036,
          overflowY:'auto',
          background:'linear-gradient(180deg,#1a0000 0%,#2d0000 100%)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform 0.28s cubic-bezier(.4,0,.2,1)',
        }}
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
        <div className="px-3 py-4 text-center" style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize:'2.2rem' }}>⚙️</div>
          <div className="fw-bold text-danger mt-1" style={{ fontSize:'1.1rem', letterSpacing:'0.5px' }}>TechGear Admin</div>
          <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', letterSpacing:'2px', textTransform:'uppercase' }}>Control Panel</div>
        </div>

        {/* Admin info */}
        <div className="px-3 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center fw-bold"
              style={{ width:38, height:38, fontSize:'1rem', flexShrink:0 }}>
              {admin?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div className="fw-semibold small text-truncate text-white">{admin?.name}</div>
              <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.45)', wordBreak:'break-all' }}>{admin?.email}</div>
            </div>
          </div>
          <span className="badge bg-danger" style={{ fontSize:'0.62rem' }}>🔑 Administrator</span>
        </div>

        {/* Nav groups */}
        <nav className="flex-grow-1 py-2">
          {navGroups.map(group => (
            <div key={group.title} className="mb-1">
              <div className="px-3 pt-3 pb-1"
                style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'1.5px',
                         color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>
                {group.title}
              </div>
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 px-3 py-2 mx-2 rounded-2 mb-1 text-decoration-none ${
                      isActive ? 'bg-danger text-white fw-semibold' : 'text-white-50'
                    }`
                  }
                  style={{ transition:'all 0.15s', fontSize:'0.85rem' }}
                  onClick={close}>
                  <span style={{ fontSize:'1rem', minWidth:20, textAlign:'center' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button className="btn btn-outline-danger btn-sm w-100 fw-semibold" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
