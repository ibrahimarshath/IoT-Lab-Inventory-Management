// backend/routes/components.js
const router = require('express').Router();
const Component = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// Public: list
router.get('/', asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const filter = { archived: false };
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Component.find(filter).skip(skip).limit(Number(limit)).sort({ name: 1 }),
    Component.countDocuments(filter)
  ]);
  res.json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
}));

// Public: get single
router.get('/:id', asyncHandler(async (req, res) => {
  const comp = await Component.findById(req.params.id).populate('categories tags');
  if (!comp || comp.archived) return res.status(404).json({ message: 'Component not found' });
  res.json({ data: comp });
}));

// Admin: create
router.post('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const comp = new Component(req.body);
  await comp.save();
  res.status(201).json({ data: comp });
}));

// Admin: update
router.put('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const comp = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!comp) return res.status(404).json({ message: 'Component not found' });
  res.json({ data: comp });
}));

// Admin: soft delete
router.delete('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const comp = await Component.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
  if (!comp) return res.status(404).json({ message: 'Component not found' });
  res.json({ message: 'Component archived', data: comp });
}));

module.exports = router;
