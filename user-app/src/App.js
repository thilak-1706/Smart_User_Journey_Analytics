import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import SignupPage    from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage  from './pages/ProductsPage';
import CartPage      from './pages/CartPage';
import CheckoutPage  from './pages/CheckoutPage';
import OrdersPage    from './pages/OrdersPage';
import JourneyPage   from './pages/JourneyPage';

const Toast = ({ toasts }) => (
  <div style={{ position:'fixed', bottom:16, right:16, zIndex:9999, display:'flex', flexDirection:'column', gap:8, maxWidth:'90vw' }}>
    {toasts.map(t => (
      <div key={t.id} className={`alert alert-${t.type} shadow mb-0 py-2 px-3`} style={{ minWidth:220 }}>
        {t.msg}
      </div>
    ))}
  </div>
);

const AppLayout = ({ onToast }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div style={{ display:'flex' }}>
      <Sidebar onToast={onToast} isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1035 }}
        />
      )}
      <main style={{
        marginLeft: 0,
        flex: 1,
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '1rem',
        paddingTop: '4rem', // space for mobile top bar
      }}
        className="main-content">
        <style>{`
          @media(min-width:992px){
            .main-content { margin-left:240px !important; padding:2rem !important; padding-top:2rem !important; }
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage  onToast={onToast} />} />
          <Route path="/signup" element={<SignupPage onToast={onToast} />} />
          <Route element={<AppLayout onToast={onToast} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products"  element={<ProductsPage  onToast={onToast} />} />
            <Route path="/cart"      element={<CartPage      onToast={onToast} />} />
            <Route path="/orders"    element={<OrdersPage    onToast={onToast} />} />
            <Route path="/checkout"  element={<CheckoutPage  onToast={onToast} />} />
            <Route path="/journey"   element={<JourneyPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast toasts={toasts} />
      </BrowserRouter>
    </AuthProvider>
  );
}
