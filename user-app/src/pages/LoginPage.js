import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onToast }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      onToast?.('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }}>
      {/* Left panel */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5" style={{ flex: 1 }}>
        <div style={{ fontSize: '5rem' }}>🛒</div>
        <h1 className="fw-bold text-warning mt-3 mb-2">TechGear Store</h1>
        <p className="text-light text-center" style={{ maxWidth: 360 }}>
          Your one-stop destination for premium tech products. Smartphones, laptops, gadgets &amp; more.
        </p>
        <div className="row g-3 mt-3" style={{ maxWidth: 360 }}>
          {[['📱','50+ Products'],['⚡','Fast Delivery'],['🔒','Secure Payments'],['🎧','24/7 Support']].map(([ic,lb]) => (
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
              <div style={{ fontSize: '2.5rem' }}>🔐</div>
              <h4 className="fw-bold mb-1">Welcome Back</h4>
              <p className="text-muted small">Sign in to your TechGear account</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input type="email" className="form-control form-control-lg" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input type="password" className="form-control form-control-lg" placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : '🚀 Sign In'}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              New to TechGear? <Link to="/signup" className="fw-bold text-warning text-decoration-none">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
