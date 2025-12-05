const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String,
  action: { type: String, enum: ['CREATE','UPDATE','DELETE','STOCK_INC','STOCK_DEC','IMPORT'], required: true },
  delta: { type: Number, default: 0 }, // positive for increment, negative for decrement
  beforeQty: Number,
  afterQty: Number,
  remark: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.models.InventoryLog || mongoose.model('InventoryLog', InventoryLogSchema);
