const tokenStore = require('../store/tokenStore');

const isDBConnected = () => {
  try { return require('mongoose').connection.readyState === 1; } catch { return false; }
};

let User;
try { User = require('../models/User'); } catch {}

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    if (isDBConnected()) {
      const user = await User.findOne({ token }).select('-password');
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      req.user = user;
      return next();
    }
    const user = tokenStore.findByToken(token);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) { res.status(500).json({ message: 'Auth error: ' + err.message }); }
};

const adminOnly = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    if (isDBConnected()) {
      const user = await User.findOne({ token }).select('-password');
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
      req.user = user;
      return next();
    }
    const user = tokenStore.findByToken(token);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
    req.user = user;
    next();
  } catch (err) { res.status(500).json({ message: 'Auth error: ' + err.message }); }
};

module.exports = { authMiddleware, adminOnly };
