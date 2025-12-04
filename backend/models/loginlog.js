// backend/models/LoginLog.js
const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  role: String,
  success: Boolean,
  ip: String,
  userAgent: String
}, { timestamps: true });

// If model already compiled (due to hot-reload), reuse it.
module.exports = mongoose.models.LoginLog || mongoose.model('LoginLog', LoginLogSchema);
