const mongoose = require('mongoose');

const ActionLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String,
  action: { type: String, required: true }, // e.g., 'APPROVE_BORROW', 'REJECT_BORROW', 'LOGIN', ...
  targetType: String, // e.g., 'BorrowRequest','Component'
  targetId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.models.ActionLog || mongoose.model('ActionLog', ActionLogSchema);
