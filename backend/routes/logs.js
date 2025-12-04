// routes/logs.js
const router = require('express').Router();
const LoginLog = require('../models/LoginLog');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/login-logs', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const { success, email, page = 1, limit = 200, from, to } = req.query;
  const filter = {};
  if (typeof success !== 'undefined') filter.success = success === 'true';
  if (email) filter.email = email.toLowerCase();
  if (from || to) filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) filter.createdAt.$lte = new Date(to);

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const logs = await LoginLog.find(filter).populate('userId','name email role').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ data: logs });
}));

module.exports = router;
