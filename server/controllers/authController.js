const { v4: uuidv4 }  = require('uuid');
const bcrypt          = require('bcryptjs');
const User            = require('../models/User');
const tokenStore      = require('../store/tokenStore');

const genToken  = () => 'tok_' + uuidv4().replace(/-/g, '');
const dbReady   = () => { try { return require('mongoose').connection.readyState === 1; } catch { return false; } };

// ── USER SIGNUP ───────────────────────────────────────────────────────────────
const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const emailLC = email.toLowerCase().trim();
    const token   = genToken();

    if (dbReady()) {
      if (await User.findOne({ email: emailLC }))
        return res.status(409).json({ message: 'Email already registered — please login' });
      const user = new User({ name: name.trim(), email: emailLC, password, token, role: 'user' });
      await user.save();
      console.log(`[DB] ✅ User created: ${emailLC}`);
      return res.status(201).json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' } });
    }

    // MongoDB offline fallback
    if (tokenStore.findByEmail(emailLC)) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const id     = uuidv4();
    tokenStore.add({ id, name: name.trim(), email: emailLC, password: hashed, token, role: 'user' });
    console.warn(`[MEM⚠️] User created in memory (will be lost on restart): ${emailLC}`);
    return res.status(201).json({ token, user: { id, name: name.trim(), email: emailLC, role: 'user' } });
  } catch (err) {
    console.error('userSignup:', err.message);
    res.status(500).json({ message: 'Signup failed — ' + err.message });
  }
};

// ── USER LOGIN ────────────────────────────────────────────────────────────────
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const emailLC = email.toLowerCase().trim();
    const token   = genToken();

    if (dbReady()) {
      const user = await User.findOne({ email: emailLC, role: 'user' });
      if (!user) return res.status(401).json({ message: 'No user account found with this email' });
      if (!(await user.comparePassword(password))) return res.status(401).json({ message: 'Incorrect password' });
      user.token = token;
      await user.save();
      console.log(`[DB] ✅ User login: ${emailLC}`);
      return res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: 'user' } });
    }

    // Memory fallback
    const u = tokenStore.findByEmail(emailLC);
    if (!u || u.role !== 'user') return res.status(401).json({ message: 'No user account found with this email' });
    if (!(await bcrypt.compare(password, u.password))) return res.status(401).json({ message: 'Incorrect password' });
    tokenStore.updateToken(emailLC, token);
    return res.json({ token, user: { id: u.id, name: u.name, email: u.email, role: 'user' } });
  } catch (err) {
    console.error('userLogin:', err.message);
    res.status(500).json({ message: 'Login failed — ' + err.message });
  }
};

// ── ADMIN SIGNUP ──────────────────────────────────────────────────────────────
const adminSignup = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    if (adminCode !== 'TECHGEAR_ADMIN_2026') return res.status(403).json({ message: 'Invalid admin registration code' });
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const emailLC = email.toLowerCase().trim();
    const token   = genToken();

    if (dbReady()) {
      if (await User.findOne({ email: emailLC })) return res.status(409).json({ message: 'Email already registered' });
      const admin = new User({ name: name.trim(), email: emailLC, password, token, role: 'admin' });
      await admin.save();
      console.log(`[DB] ✅ Admin created: ${emailLC}`);
      return res.status(201).json({ token, user: { id: admin._id.toString(), name: admin.name, email: admin.email, role: 'admin' } });
    }

    if (tokenStore.findByEmail(emailLC)) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const id     = uuidv4();
    tokenStore.add({ id, name: name.trim(), email: emailLC, password: hashed, token, role: 'admin' });
    console.warn(`[MEM⚠️] Admin created in memory: ${emailLC}`);
    return res.status(201).json({ token, user: { id, name: name.trim(), email: emailLC, role: 'admin' } });
  } catch (err) {
    console.error('adminSignup:', err.message);
    res.status(500).json({ message: 'Signup failed — ' + err.message });
  }
};

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const emailLC = email.toLowerCase().trim();
    const token   = genToken();

    if (dbReady()) {
      const admin = await User.findOne({ email: emailLC, role: 'admin' });
      if (!admin) return res.status(401).json({ message: 'No admin account found with this email' });
      if (!(await admin.comparePassword(password))) return res.status(401).json({ message: 'Incorrect password' });
      admin.token = token;
      await admin.save();
      console.log(`[DB] ✅ Admin login: ${emailLC}`);
      return res.json({ token, user: { id: admin._id.toString(), name: admin.name, email: admin.email, role: 'admin' } });
    }

    const a = tokenStore.findByEmail(emailLC);
    if (!a || a.role !== 'admin') return res.status(401).json({ message: 'No admin account found with this email' });
    if (!(await bcrypt.compare(password, a.password))) return res.status(401).json({ message: 'Incorrect password' });
    tokenStore.updateToken(emailLC, token);
    return res.json({ token, user: { id: a.id, name: a.name, email: a.email, role: 'admin' } });
  } catch (err) {
    console.error('adminLogin:', err.message);
    res.status(500).json({ message: 'Login failed — ' + err.message });
  }
};

const profile = async (req, res) => {
  try {
    if (dbReady()) {
      const user = await User.findById(req.user._id).select('-password -token');
      return res.json(user);
    }
    const { password: _p, token: _t, ...safe } = req.user;
    res.json(safe);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { userSignup, userLogin, adminSignup, adminLogin, profile };
