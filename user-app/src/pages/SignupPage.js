import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = ({ onToast }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      onToast?.('Account created! Welcome 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-vh-100 d-flex" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }}>
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5" style={{ flex: 1 }}>
        <div style={{ fontSize: '5rem' }}>✨</div>
        <h1 className="fw-bold text-warning mt-3 mb-2">Join TechGear</h1>
        <p className="text-light text-center" style={{ maxWidth: 360 }}>
          Create your account and start exploring 50+ premium technology products with exclusive deals.
        </p>
        <div className="mt-4 text-center">
          {['🎁 Exclusive member deals','📦 Track your orders','⚡ Flash sale alerts','🔒 Secure shopping'].map(t => (
            <div key={t} className="d-flex align-items-center gap-2 mb-2 bg-white bg-opacity-10 rounded px-3 py-2">
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center p-4" style={{ flex: 1 }}>
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 420 }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '2.5rem' }}>👤</div>
              <h4 className="fw-bold mb-1">Create Account</h4>
              <p className="text-muted small">Join thousands of tech enthusiasts</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input type="text" className="form-control" placeholder="Your full name"
                  value={form.name} onChange={set('name')} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input type="email" className="form-control" placeholder="you@example.com"
                  value={form.email} onChange={set('email')} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters"
                  value={form.password} onChange={set('password')} minLength={6} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Repeat password"
                  value={form.confirm} onChange={set('confirm')} required />
              </div>
              <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : '🚀 Create Account'}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              Already have an account? <Link to="/login" className="fw-bold text-warning text-decoration-none">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
