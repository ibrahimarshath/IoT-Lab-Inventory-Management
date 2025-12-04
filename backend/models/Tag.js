// models/Tag.js
const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Tag', TagSchema);
