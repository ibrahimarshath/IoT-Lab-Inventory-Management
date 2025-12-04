// routes/borrowRecords.js
const router = require('express').Router();
const BorrowRecord = require('../models/BorrowRecord');
const Component = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// list borrow records: admin sees all, user sees own
router.get('/', jwtAuth, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Login required' });
  if (req.user.role === 'ADMIN') {
    const all = await BorrowRecord.find().populate('userId','name email').sort({ borrowDate: -1 });
    return res.json({ data: all });
  }
  const own = await BorrowRecord.find({ userId: req.user.id }).populate('items.componentId').sort({ borrowDate: -1 });
  res.json({ data: own });
}));

// mark as returned
router.post('/:id/return', jwtAuth, asyncHandler(async (req, res) => {
  const rec = await BorrowRecord.findById(req.params.id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  if (String(req.user.id) !== String(rec.userId) && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  if (rec.status === 'RETURNED') return res.status(400).json({ message: 'Already returned' });

  for (const it of rec.items) {
    await Component.findByIdAndUpdate(it.componentId, { $inc: { qtyAvailable: it.quantity } });
  }
  rec.status = 'RETURNED';
  rec.returnDate = new Date();
  await rec.save();
  res.json({ message: 'Returned', data: rec });
}));

module.exports = router;
