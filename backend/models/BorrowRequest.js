// models/BorrowRequest.js
const mongoose = require('mongoose');

const BorrowItemSchema = new mongoose.Schema({
  componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const BorrowRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [BorrowItemSchema], required: true },
  desiredDueDate: Date,
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED','CANCELLED'], default: 'PENDING' },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  decisionAt: Date,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('BorrowRequest', BorrowRequestSchema);
