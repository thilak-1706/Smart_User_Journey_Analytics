import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AuthContext';
import AdminSidebar from './components/Sidebar';

import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import DashboardPage    from './pages/DashboardPage';
import UsersPage        from './pages/UsersPage';
import ProductsPage     from './pages/ProductsPage';
import SalesBoardPage   from './pages/SalesBoardPage';
import PurchaseTrackerPage from './pages/PurchaseTrackerPage';
import EventsPage       from './pages/EventsPage';
import JourneyPage      from './pages/JourneyPage';

const Toast = ({ toasts }) => (
  <div style={{ position:'fixed', bottom:16, right:16, zIndex:9999, display:'flex', flexDirection:'column', gap:8, maxWidth:'90vw' }}>
    {toasts.map(t => (
      <div key={t.id} className={`alert alert-${t.type} shadow mb-0 py-2 px-3`} style={{ minWidth:220 }}>
        {t.msg}
      </div>
    ))}
  </div>
);

const AdminLayout = ({ onToast }) => {
  const { admin } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!admin) return <Navigate to="/login" replace />;
  return (
    <div style={{ display:'flex' }}>
      <AdminSidebar onToast={onToast} isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1035 }} />
      )}
      <main style={{ flex:1, minHeight:'100vh', background:'#f4f6f9', padding:'1rem', paddingTop:'4rem' }}
        className="admin-main">
        <style>{`
          @media(min-width:992px){
            .admin-main { margin-left:240px !important; padding:2rem !important; padding-top:2rem !important; }
          }
        `}</style>
        <Outlet context={{ onToast }} />
      </main>
    </div>
  );
};

export default function App() {
  const [toasts, setToasts] = useState([]);
  const onToast = useCallback((msg, type='success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage  onToast={onToast} />} />
          <Route path="/signup" element={<SignupPage onToast={onToast} />} />
          <Route path="/"       element={<Navigate to="/login" replace />} />
          <Route element={<AdminLayout onToast={onToast} />}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/users"       element={<UsersPage />} />
            <Route path="/products"    element={<ProductsPage />} />
            <Route path="/sales-board" element={<SalesBoardPage />} />
            <Route path="/tracker"     element={<PurchaseTrackerPage />} />
            <Route path="/events"      element={<EventsPage />} />
            <Route path="/journey"     element={<JourneyPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toast toasts={toasts} />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
