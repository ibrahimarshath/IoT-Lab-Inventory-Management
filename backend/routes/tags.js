// routes/tags.js
const router = require('express').Router();
const Tag = require('../models/tag');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(async (req,res) => {
  const list = await Tag.find().sort({ text: 1 });
  res.json({ data: list });
}));

router.post('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const t = await Tag.create(req.body);
  res.status(201).json({ data: t });
}));

router.put('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const t = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json({ data: t });
}));

router.delete('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  await Tag.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
}));

module.exports = router;
