// middleware/jwtAuth.js
const jwt = require('jsonwebtoken');

async function jwtAuth(req, res, next) {
  const auth = req.header('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role === 'ADMIN' || req.user.role === role) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  };
}

module.exports = { jwtAuth, requireRole };
