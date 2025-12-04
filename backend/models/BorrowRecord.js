// models/BorrowRecord.js
const mongoose = require('mongoose');

const BorrowRecordItemSchema = new mongoose.Schema({
  componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const BorrowRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [BorrowRecordItemSchema], required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: Date,
  returnDate: Date,
  status: { type: String, enum: ['BORROWED','RETURNED','OVERDUE'], default: 'BORROWED' },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);
