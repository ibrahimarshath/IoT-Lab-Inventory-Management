// backend/routes/components.js
const router = require('express').Router();
const mongoose = require('mongoose');

const Component = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');
const { createComponentValidation } = require('../middleware/validators');
const { logInventory, logAction } = require('../utils/logService');

// LIST components (public)
// GET /api/components? q, page, limit
router.get('/', asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const filter = { archived: { $ne: true } };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { serialNumber: { $regex: q, $options: 'i' } }
    ];
  }

  const [items, total] = await Promise.all([
    Component.find(filter).skip(skip).limit(limit).sort({ name: 1 }).lean(),
    Component.countDocuments(filter)
  ]);

  res.json({ data: items, meta: { total, page, limit } });
}));

// GET single component
router.get('/:id', asyncHandler(async (req, res) => {
  const comp = await Component.findById(req.params.id).lean();
  if (!comp || comp.archived) return res.status(404).json({ message: 'Component not found' });
  res.json({ data: comp });
}));

// CREATE component (ADMIN)
// POST /api/components
router.post('/', jwtAuth, requireRole('ADMIN'), createComponentValidation, asyncHandler(async (req, res) => {
  const payload = req.body;

  // create
  const comp = await Component.create(payload);

  // log action
  await logAction({
    actorId: req.user ? req.user.id : null,
    actorEmail: req.user ? req.user.email : null,
    action: 'CREATE_COMPONENT',
    targetType: 'Component',
    targetId: comp._id,
    details: { name: comp.name }
  });

  // log inventory initial (if qtyAvailable provided)
  if (typeof comp.qtyAvailable === 'number') {
    await logInventory({
      componentId: comp._id,
      actorId: req.user ? req.user.id : null,
      actorEmail: req.user ? req.user.email : null,
      action: 'STOCK_INC',
      delta: comp.qtyAvailable,
      beforeQty: null,
      afterQty: comp.qtyAvailable,
      remark: 'Initial stock on create'
    });
  }

  res.status(201).json({ data: comp });
}));

// UPDATE component (ADMIN)
// PUT /api/components/:id
router.put('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const comp = await Component.findById(req.params.id);
  if (!comp) return res.status(404).json({ message: 'Component not found' });

  const before = comp.qtyAvailable;

  // update fields
  Object.assign(comp, req.body);
  await comp.save();

  // If qty changed, log inventory delta
  if (typeof req.body.qtyAvailable === 'number') {
    const after = comp.qtyAvailable;
    const delta = after - (before == null ? 0 : before);
    if (delta !== 0) {
      await logInventory({
        componentId: comp._id,
        actorId: req.user ? req.user.id : null,
        actorEmail: req.user ? req.user.email : null,
        action: delta > 0 ? 'STOCK_INC' : 'STOCK_DEC',
        delta,
        beforeQty: before,
        afterQty: after,
        remark: 'Manual stock update via admin'
      });
    }
  }

  await logAction({
    actorId: req.user ? req.user.id : null,
    actorEmail: req.user ? req.user.email : null,
    action: 'UPDATE_COMPONENT',
    targetType: 'Component',
    targetId: comp._id,
    details: { changes: req.body }
  });

  res.json({ data: comp });
}));

// SOFT DELETE component (ADMIN)
// DELETE /api/components/:id
router.delete('/:id', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const comp = await Component.findById(req.params.id);
  if (!comp) return res.status(404).json({ message: 'Component not found' });

  comp.archived = true;
  await comp.save();

  await logAction({
    actorId: req.user ? req.user.id : null,
    actorEmail: req.user ? req.user.email : null,
    action: 'DELETE_COMPONENT',
    targetType: 'Component',
    targetId: comp._id
  });

  res.json({ message: 'Component archived', data: comp });
}));

module.exports = router;
