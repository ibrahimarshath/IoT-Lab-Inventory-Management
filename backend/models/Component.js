// backend/models/Component.js
const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  serialNumber: { type: String },
  sku: { type: String },
  description: { type: String },
  productLink: { type: String },
  vendorDetails: { type: String },
  qtyAvailable: { type: Number, default: 0 },
  threshold: { type: Number, default: 0 },
  cost: { type: Number },
  photos: [String],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  remarks: { type: String },
  archived: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Component', ComponentSchema);
