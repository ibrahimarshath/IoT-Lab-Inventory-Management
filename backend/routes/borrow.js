// routes/borrow.js
const router = require('express').Router();
const BorrowRequest = require('../models/BorrowRequest');
const BorrowRecord = require('../models/BorrowRecord');
const Component = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// Create borrow request (user)
router.post('/', jwtAuth, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Login required' });
  const { items, desiredDueDate, remarks } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'items required' });

  // basic validation: ensure component ids exist and qty > 0
  for (const it of items) {
    if (!it.componentId || !it.quantity || it.quantity <= 0) return res.status(400).json({ message: 'Invalid item structure' });
    const comp = await Component.findById(it.componentId);
    if (!comp) return res.status(404).json({ message: `Component not found: ${it.componentId}` });
  }

  const reqDoc = await BorrowRequest.create({ userId: req.user.id, items, desiredDueDate, remarks });
  res.status(201).json({ data: reqDoc });
}));

// Admin list (filter by status)
router.get('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const list = await BorrowRequest.find(filter).populate('userId','name email').sort({ createdAt: -1 });
  res.json({ data: list });
}));

// Admin approve/reject a request
router.post('/:id/decision', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { decision, dueDate, remarks } = req.body; // decision: 'APPROVE' | 'REJECT'
  const br = await BorrowRequest.findById(req.params.id);
  if (!br) return res.status(404).json({ message: 'Request not found' });
  if (br.status !== 'PENDING') return res.status(400).json({ message: 'Already decided' });

  if (decision === 'REJECT') {
    br.status = 'REJECTED';
    br.approverId = req.user.id;
    br.decisionAt = new Date();
    br.remarks = remarks || br.remarks;
    await br.save();
    return res.json({ message: 'Rejected', data: br });
  }

  // APPROVE: check stock
  const insufficient = [];
  for (const it of br.items) {
    const comp = await Component.findById(it.componentId);
    if (!comp || comp.qtyAvailable < it.quantity) {
      insufficient.push({ componentId: it.componentId, available: comp ? comp.qtyAvailable : 0 });
    }
  }
  if (insufficient.length) return res.status(409).json({ message: 'Insufficient stock', insufficient });

  // Deduct stock and create borrow record
  const sessionOps = [];
  for (const it of br.items) {
    await Component.findByIdAndUpdate(it.componentId, { $inc: { qtyAvailable: -it.quantity } });
  }

  const record = await BorrowRecord.create({
    userId: br.userId,
    items: br.items,
    borrowDate: new Date(),
    dueDate: dueDate || br.desiredDueDate,
    status: 'BORROWED',
    remarks: remarks || ''
  });

  br.status = 'APPROVED';
  br.approverId = req.user.id;
  br.decisionAt = new Date();
  br.remarks = remarks || br.remarks;
  await br.save();

  res.json({ message: 'Approved', record, request: br });
}));

// User can cancel own pending request
router.post('/:id/cancel', jwtAuth, asyncHandler(async (req, res) => {
  const br = await BorrowRequest.findById(req.params.id);
  if (!br) return res.status(404).json({ message: 'Not found' });
  if (String(br.userId) !== String(req.user.id) && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  if (br.status !== 'PENDING') return res.status(400).json({ message: 'Cannot cancel after decision' });
  br.status = 'CANCELLED';
  await br.save();
  res.json({ message: 'Cancelled', data: br });
}));

module.exports = router;
