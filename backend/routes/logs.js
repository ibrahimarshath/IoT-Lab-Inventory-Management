const router = require('express').Router();
const InventoryLog = require('../models/inventoryLog');
const ActionLog = require('../models/ActionLog');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// Protected routes: admin only for now
router.use(jwtAuth);
router.use(requireRole('ADMIN'));

// GET inventory logs with basic filters
router.get('/inventory', asyncHandler(async (req, res) => {
  const { componentId, actorEmail, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (componentId) filter.componentId = componentId;
  if (actorEmail) filter.actorEmail = actorEmail;
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    InventoryLog.countDocuments(filter),
    InventoryLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean()
  ]);
  res.json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
}));

// GET action logs
router.get('/actions', asyncHandler(async (req, res) => {
  const { action, actorEmail, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (action) filter.action = action;
  if (actorEmail) filter.actorEmail = actorEmail;
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    ActionLog.countDocuments(filter),
    ActionLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean()
  ]);
  res.json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
}));

module.exports = router;
