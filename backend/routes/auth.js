// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LoginLog = require('../models/loginlog');
const { signToken } = require('../utils/jwt');
const { requireRole } = require('../middleware/jwtAuth');

// helpers for allowed domain
function getAllowedDomainsFromEnv() {
  const csv = process.env.ALLOWED_EMAIL_DOMAINS;
  if (csv && csv.trim()) return csv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const single = process.env.ALLOWED_EMAIL_DOMAIN;
  return single ? [single.trim().toLowerCase()] : [];
}
function isAllowedEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const addr = email.trim().toLowerCase();
  const allowed = getAllowedDomainsFromEnv();
  if (!allowed.length) return true; // dev
  return allowed.some(domain => addr.endsWith(`@${domain}`));
}

// register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const adminSecret = req.body.adminSecret || req.header('x-admin-secret');

    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });

    if (!isAllowedEmail(email)) return res.status(403).json({ message: 'Registration restricted to college email addresses' });

    let finalRole = (role && typeof role === 'string') ? role.toUpperCase() : 'USER';
    if (finalRole === 'ADMIN') {
      if (!process.env.ADMIN_SECRET) return res.status(500).json({ message: 'Admin registration not enabled' });
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(403).json({ message: 'Admin registration requires correct adminSecret' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email: email.toLowerCase(), role: finalRole });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user);
    return res.status(201).json({ message: 'Registered', data: { user: user.toJSON(), token } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    if (!isAllowedEmail(email)) return res.status(403).json({ message: 'Login restricted to college email addresses' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      await LoginLog.create({ email, success: false, ip: req.ip, userAgent: req.headers['user-agent'] });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      await LoginLog.create({ userId: user._id, email: user.email, role: user.role, success: false, ip: req.ip, userAgent: req.headers['user-agent'] });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await LoginLog.create({ userId: user._id, email: user.email, role: user.role, success: true, ip: req.ip, userAgent: req.headers['user-agent'] });

    const token = signToken(user);
    return res.json({ message: 'Logged in', data: { user: user.toJSON(), token } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// delete user (admin only)
router.delete('/delete-user', requireRole('ADMIN'), async (req, res) => {
  try {
    const { email, id, purgeLogs } = req.body;
    if (!email && !id) return res.status(400).json({ message: 'Provide email or id' });

    const query = id ? { _id: id } : { email: (email||'').toLowerCase() };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount <= 1) return res.status(400).json({ message: 'Cannot delete the last admin account' });
    }

    const deleted = await User.findByIdAndDelete(user._id);
    if (purgeLogs) await LoginLog.deleteMany({ $or: [{ userId: user._id }, { email: user.email }] });

    return res.json({ message: 'User deleted', deleted: deleted ? deleted.toJSON() : null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
