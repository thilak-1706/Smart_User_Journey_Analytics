import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

const AdminSignupPage = ({ onToast }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', adminCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { signup, admin } = useAdminAuth();
  const navigate = useNavigate();

  if (admin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.adminCode);
      onToast?.('Admin account created! 🔑', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-vh-100 d-flex" style={{ background: 'linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#450000 100%)' }}>
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5" style={{ flex: 1 }}>
        <div style={{ fontSize: '5rem' }}>🔐</div>
        <h1 className="fw-bold text-danger mt-3 mb-2">Admin Registration</h1>
        <p className="text-light text-center" style={{ maxWidth: 360 }}>
          Create an admin account with the secret registration code. Admin accounts have full access to all analytics.
        </p>
        <div className="alert alert-warning mt-4 text-dark small">
          <strong>🔑 Admin Code:</strong> TECHGEAR_ADMIN_2026<br />
          <span className="text-muted">Share this only with authorized personnel.</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center p-4" style={{ flex: 1 }}>
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 420 }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '2.5rem' }}>👤</div>
              <h4 className="fw-bold mb-1">Create Admin Account</h4>
              <p className="text-muted small">Requires admin registration code</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input className="form-control" placeholder="Admin name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input type="email" className="form-control" placeholder="admin@techgear.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={set('password')} minLength={6} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Admin Registration Code <span className="text-danger">*</span></label>
                <input className="form-control" placeholder="Enter admin code" value={form.adminCode} onChange={set('adminCode')} required />
                <div className="form-text">Contact your system administrator for the code.</div>
              </div>
              <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : '🔑 Create Admin Account'}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              Already have an account? <Link to="/login" className="fw-bold text-danger text-decoration-none">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
