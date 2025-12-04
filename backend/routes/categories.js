// backend/routes/categories.js
const router = require('express').Router();
const Category = require('../models/Category');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// GET all categories
router.get('/', asyncHandler(async (req, res) => {
  const list = await Category.find().sort({ name: 1 });
  res.json({ data: list });
}));

// GET single
router.get('/:id', asyncHandler(async (req, res) => {
  const c = await Category.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json({ data: c });
}));

// Admin create - idempotent: returns existing if same name exists
router.post('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });

  const trimmed = name.trim();
  const existing = await Category.findOne({ name: trimmed });
  if (existing) return res.status(200).json({ message: 'Category already exists', data: existing });

  const created = await Category.create({ name: trimmed, description });
  return res.status(201).json({ data: created });
}));

// Admin update
router.put('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json({ data: c });
}));

// Admin delete
router.delete('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
}));

module.exports = router;
