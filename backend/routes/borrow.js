// backend/routes/borrow.js
const router = require('express').Router();
const mongoose = require('mongoose');

const BorrowRequest = require('../models/BorrowRequest');
const BorrowRecord  = require('../models/BorrowRecord');
const Component     = require('../models/Component');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');
const { borrowRequestValidation } = require('../middleware/validators');
const { logInventory, logAction } = require('../utils/logService');

/**
 * Helper: fallback approval (no transactions)
 * Performs atomic findOneAndUpdate per component with qtyAvailable >= needed.
 * If any update fails it rolls back previously applied decrements.
 */
async function approveFallback(reqForUpdate, approver, dueDate, remarks) {
  const updatedComponents = [];
  const insufficient = [];

  for (const it of reqForUpdate.items) {
    const comp = await Component.findOneAndUpdate(
      { _id: it.componentId, qtyAvailable: { $gte: it.quantity } },
      { $inc: { qtyAvailable: -it.quantity } },
      { new: true }
    ).lean();

    if (!comp) {
      insufficient.push({ componentId: it.componentId, quantity: it.quantity });
      break;
    } else {
      updatedComponents.push({ componentId: it.componentId, qty: it.quantity, afterQty: comp.qtyAvailable });
    }
  }

  if (insufficient.length) {
    // rollback
    for (const u of updatedComponents) {
      try {
        await Component.findByIdAndUpdate(u.componentId, { $inc: { qtyAvailable: u.qty } });
      } catch (err) {
        console.error('Rollback failed for component', u.componentId, err);
      }
    }
    return { success: false, code: 409, insufficient };
  }

  // create borrow record
  const record = await BorrowRecord.create({
    userId: reqForUpdate.userId,
    items: reqForUpdate.items,
    borrowDate: new Date(),
    dueDate: dueDate ? new Date(dueDate) : reqForUpdate.desiredDueDate,
    status: 'BORROWED',
    remarks: remarks || ''
  });

  // update request
  reqForUpdate.status = 'APPROVED';
  reqForUpdate.approverId = approver.id;
  reqForUpdate.decisionAt = new Date();
  reqForUpdate.remarks = remarks || reqForUpdate.remarks;
  await reqForUpdate.save();

  // Log actions and inventory
  await logAction({
    actorId: approver.id,
    actorEmail: approver.email,
    action: 'APPROVE_BORROW',
    targetType: 'BorrowRequest',
    targetId: reqForUpdate._id,
    details: { recordId: record._id }
  });

  for (const u of updatedComponents) {
    await logInventory({
      componentId: u.componentId,
      actorId: approver.id,
      actorEmail: approver.email,
      action: 'STOCK_DEC',
      delta: -u.qty,
      beforeQty: u.afterQty + u.qty,
      afterQty: u.afterQty,
      remark: 'Approved borrow (fallback)'
    });
  }

  return { success: true, record, request: reqForUpdate };
}

/*
  POST /api/borrow
  Create borrow request (user)
*/
router.post('/', jwtAuth, borrowRequestValidation, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Login required' });

  const { items, desiredDueDate, remarks } = req.body;

  // validate items exist and quantities
  for (const it of items) {
    if (!it.componentId || !it.quantity || it.quantity <= 0) {
      return res.status(400).json({ message: 'Each item must have componentId and positive quantity' });
    }
    const comp = await Component.findById(it.componentId).lean();
    if (!comp) return res.status(404).json({ message: `Component not found: ${it.componentId}` });
  }

  const doc = await BorrowRequest.create({
    userId: req.user.id,
    items,
    desiredDueDate: desiredDueDate ? new Date(desiredDueDate) : undefined,
    remarks
  });

  await logAction({
    actorId: req.user.id,
    actorEmail: req.user.email,
    action: 'CREATE_BORROW_REQUEST',
    targetType: 'BorrowRequest',
    targetId: doc._id,
    details: { items: doc.items }
  });

  res.status(201).json({ message: 'Request created', data: doc });
}));

/*
  GET /api/borrow
  Admin list (optional ?status)
*/
router.get('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const list = await BorrowRequest.find(filter).sort({ createdAt: -1 }).populate('userId','name email');
  res.json({ data: list });
}));

/*
  POST /api/borrow/:id/decision
  Body: { decision: 'APPROVE'|'REJECT', dueDate?, remarks? }
*/
router.post('/:id/decision', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { decision, dueDate, remarks } = req.body;
  if (!['APPROVE','REJECT'].includes(decision)) return res.status(400).json({ message: 'decision must be APPROVE or REJECT' });

  const reqDoc = await BorrowRequest.findById(req.params.id);
  if (!reqDoc) return res.status(404).json({ message: 'Request not found' });
  if (reqDoc.status !== 'PENDING') return res.status(400).json({ message: 'Request already processed' });

  if (decision === 'REJECT') {
    reqDoc.status = 'REJECTED';
    reqDoc.approverId = req.user.id;
    reqDoc.decisionAt = new Date();
    reqDoc.remarks = remarks || reqDoc.remarks;
    await reqDoc.save();

    await logAction({
      actorId: req.user.id,
      actorEmail: req.user.email,
      action: 'REJECT_BORROW',
      targetType: 'BorrowRequest',
      targetId: reqDoc._id,
      details: { remarks }
    });

    return res.json({ message: 'Request rejected', data: reqDoc });
  }

  // APPROVE: try transaction, fallback if transactions not available
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // reload inside session
    const reqForUpdate = await BorrowRequest.findById(req.params.id).session(session);
    if (!reqForUpdate) throw new Error('Request disappeared');

    // check availability
    const insufficient = [];
    for (const it of reqForUpdate.items) {
      const comp = await Component.findById(it.componentId).session(session);
      if (!comp) {
        insufficient.push({ componentId: it.componentId, reason: 'not found' });
      } else if (comp.qtyAvailable < it.quantity) {
        insufficient.push({ componentId: it.componentId, available: comp.qtyAvailable });
      }
    }
    if (insufficient.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'Insufficient stock', insufficient });
    }

    // deduct stock
    for (const it of reqForUpdate.items) {
      await Component.findByIdAndUpdate(it.componentId, { $inc: { qtyAvailable: -it.quantity } }, { session });
    }

    // create borrow record (in session)
    const [record] = await BorrowRecord.create([{
      userId: reqForUpdate.userId,
      items: reqForUpdate.items,
      borrowDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : reqForUpdate.desiredDueDate,
      status: 'BORROWED',
      remarks: remarks || ''
    }], { session });

    // mark request approved
    reqForUpdate.status = 'APPROVED';
    reqForUpdate.approverId = req.user.id;
    reqForUpdate.decisionAt = new Date();
    reqForUpdate.remarks = remarks || reqForUpdate.remarks;
    await reqForUpdate.save({ session });

    // commit
    await session.commitTransaction();
    session.endSession();

    // after commit: write action & inventory logs (outside transaction)
    await logAction({
      actorId: req.user.id,
      actorEmail: req.user.email,
      action: 'APPROVE_BORROW',
      targetType: 'BorrowRequest',
      targetId: reqForUpdate._id,
      details: { recordId: record._id }
    });

    for (const it of reqForUpdate.items) {
      // log inventory by reading current qty
      const compAfter = await Component.findById(it.componentId).lean();
      await logInventory({
        componentId: it.componentId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'STOCK_DEC',
        delta: -it.quantity,
        beforeQty: compAfter.qtyAvailable + it.quantity,
        afterQty: compAfter.qtyAvailable,
        remark: 'Approved borrow (transaction)'
      });
    }

    return res.json({ message: 'Request approved', record, request: reqForUpdate });
  } catch (err) {
    // if the error indicates transactions are not supported, try fallback
    const msg = err && err.message ? err.message : '';
    console.warn('Transaction attempt failed (message):', msg);

    if (session) {
      try { await session.abortTransaction(); session.endSession(); } catch(_) {}
    }

    // If the error mentions replica set / transaction support, run fallback approval
    if (msg && (msg.includes('replica set') || msg.includes('Transaction numbers are only allowed') || msg.includes('transientTransactionError'))) {
      const reqForUpdate = await BorrowRequest.findById(req.params.id);
      const result = await approveFallback(reqForUpdate, { id: req.user.id, email: req.user.email }, dueDate, remarks);
      if (!result.success) return res.status(result.code || 500).json({ message: 'Insufficient stock', insufficient: result.insufficient });
      return res.json({ message: 'Request approved (fallback)', record: result.record, request: result.request });
    }

    // otherwise rethrow so global handler handles it
    throw err;
  }
}));

/*
  POST /api/borrow/:id/cancel
  cancel own pending request
*/
router.post('/:id/cancel', jwtAuth, asyncHandler(async (req, res) => {
  const br = await BorrowRequest.findById(req.params.id);
  if (!br) return res.status(404).json({ message: 'Not found' });
  if (String(br.userId) !== String(req.user.id) && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  if (br.status !== 'PENDING') return res.status(400).json({ message: 'Cannot cancel after decision' });

  br.status = 'CANCELLED';
  await br.save();

  await logAction({
    actorId: req.user.id,
    actorEmail: req.user.email,
    action: 'CANCEL_BORROW',
    targetType: 'BorrowRequest',
    targetId: br._id
  });

  res.json({ message: 'Cancelled', data: br });
}));

module.exports = router;
