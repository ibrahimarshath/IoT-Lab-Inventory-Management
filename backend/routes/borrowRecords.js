// backend/routes/borrowRecords.js
const router = require('express').Router();
const mongoose = require('mongoose');

const BorrowRecord = require('../models/BorrowRecord');
const Component = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');
const { logInventory, logAction } = require('../utils/logService');

/*
  GET /api/borrow-records
  Admin: all records. User: own records.
*/
router.get('/', jwtAuth, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Login required' });
  if (req.user.role === 'ADMIN') {
    const all = await BorrowRecord.find().populate('userId','name email').sort({ borrowDate: -1 });
    return res.json({ data: all });
  }
  const own = await BorrowRecord.find({ userId: req.user.id }).populate('items.componentId').sort({ borrowDate: -1 });
  res.json({ data: own });
}));

/*
  POST /api/borrow-records/:id/return
  Mark a borrow record as returned and restore component stock.
*/
router.post('/:id/return', jwtAuth, asyncHandler(async (req, res) => {
  const rec = await BorrowRecord.findById(req.params.id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  if (String(req.user.id) !== String(rec.userId) && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  if (rec.status === 'RETURNED') return res.status(400).json({ message: 'Already returned' });

  // Use transaction if possible, fallback if not
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // reload in session
    const recForUpdate = await BorrowRecord.findById(req.params.id).session(session);
    if (!recForUpdate) throw new Error('Record not found during return');

    // increment stock for each item
    for (const it of recForUpdate.items) {
      await Component.findByIdAndUpdate(it.componentId, { $inc: { qtyAvailable: it.quantity } }, { session });
    }

    recForUpdate.status = 'RETURNED';
    recForUpdate.returnDate = new Date();
    await recForUpdate.save({ session });

    await session.commitTransaction();
    session.endSession();

    // logging outside transaction
    for (const it of rec.items) {
      const compAfter = await Component.findById(it.componentId).lean();
      await logInventory({
        componentId: it.componentId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'STOCK_INC',
        delta: it.quantity,
        beforeQty: compAfter.qtyAvailable - it.quantity,
        afterQty: compAfter.qtyAvailable,
        remark: 'Return'
      });
    }

    await logAction({
      actorId: req.user.id,
      actorEmail: req.user.email,
      action: 'RETURN_BORROW',
      targetType: 'BorrowRecord',
      targetId: rec._id
    });

    return res.json({ message: 'Returned', data: recForUpdate });
  } catch (err) {
    const msg = err && err.message ? err.message : '';
    console.warn('Return transaction failed:', msg);
    if (session) {
      try { await session.abortTransaction(); session.endSession(); } catch(_) {}
    }

    // fallback: try to increment each component (best-effort) then update record
    try {
      for (const it of rec.items) {
        await Component.findByIdAndUpdate(it.componentId, { $inc: { qtyAvailable: it.quantity } });
        const compAfter = await Component.findById(it.componentId).lean();
        await logInventory({
          componentId: it.componentId,
          actorId: req.user.id,
          actorEmail: req.user.email,
          action: 'STOCK_INC',
          delta: it.quantity,
          beforeQty: compAfter.qtyAvailable - it.quantity,
          afterQty: compAfter.qtyAvailable,
          remark: 'Return (fallback)'
        });
      }
      rec.status = 'RETURNED';
      rec.returnDate = new Date();
      await rec.save();

      await logAction({
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'RETURN_BORROW',
        targetType: 'BorrowRecord',
        targetId: rec._id
      });

      return res.json({ message: 'Returned (fallback)', data: rec });
    } catch (finalErr) {
      console.error('Return fallback failed', finalErr);
      return res.status(500).json({ message: 'Return failed' });
    }
  }
}));

module.exports = router;
