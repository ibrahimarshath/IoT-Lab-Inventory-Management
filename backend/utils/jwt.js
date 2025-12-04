// utils/jwt.js
const jwt = require('jsonwebtoken');

function signToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
