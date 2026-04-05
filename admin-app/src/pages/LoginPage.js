import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

const AdminLoginPage = ({ onToast }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login, admin } = useAdminAuth();
  const navigate = useNavigate();

  if (admin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      onToast?.('Welcome, Admin! 🔑', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex" style={{ background: 'linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#450000 100%)' }}>
      {/* Left panel */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5" style={{ flex: 1 }}>
        <div style={{ fontSize: '5rem' }}>⚙️</div>
        <h1 className="fw-bold text-danger mt-3 mb-2">Admin Portal</h1>
        <p className="text-light text-center" style={{ maxWidth: 360 }}>
          Full control over the TechGear Store. Monitor users, track purchases, and analyze product performance.
        </p>
        <div className="row g-3 mt-3" style={{ maxWidth: 360 }}>
          {[['👥','All Users'],['📦','All Products'],['💰','Revenue'],['📊','Full Analytics']].map(([ic,lb]) => (
            <div className="col-6" key={lb}>
              <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded p-2">
                <span>{ic}</span><span className="small">{lb}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="d-flex align-items-center justify-content-center p-4" style={{ flex: 1 }}>
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 420 }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '2.5rem' }}>🔑</div>
              <h4 className="fw-bold mb-1">Admin Sign In</h4>
              <p className="text-muted small">Authorized personnel only</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Admin Email</label>
                <input type="email" className="form-control form-control-lg" placeholder="admin@techgear.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input type="password" className="form-control form-control-lg" placeholder="Admin password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : '🔑 Admin Sign In'}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              New admin? <Link to="/signup" className="fw-bold text-danger text-decoration-none">Register Admin Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
