// backend/routes/admin.js
const router = require('express').Router();
const mongoose = require('mongoose');

const Component = require('../models/Component');
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const BorrowRequest = require('../models/BorrowRequest');
const LoginLog = require('../models/LoginLog');

const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

/*
  All admin routes require authentication + ADMIN role.
  We apply the middlewares individually so responses are explicit.
*/

// GET /api/admin/stats
router.get(
  '/stats',
  jwtAuth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    // totals
    const [ totalComponents, totalUsers, borrowedCount, pendingRequests ] = await Promise.all([
      Component.countDocuments({ archived: { $ne: true } }),
      User.countDocuments({}),
      BorrowRecord.countDocuments({ status: 'BORROWED' }),
      BorrowRequest.countDocuments({ status: 'PENDING' })
    ]);

    // lowStock: count components where qtyAvailable <= threshold (treat missing threshold as 0)
    const lowAgg = await Component.aggregate([
      { $match: { archived: { $ne: true } } },
      { $project: { qtyAvailable: 1, threshold: { $ifNull: ['$threshold', 0] } } },
      { $match: { $expr: { $lte: ['$qtyAvailable', '$threshold'] } } },
      { $count: 'low' }
    ]);
    const lowStock = lowAgg.length ? lowAgg[0].low : 0;

    res.json({
      data: {
        totalComponents,
        lowStock,
        totalUsers,
        borrowedCount,
        pendingRequests
      }
    });
  })
);

// GET /api/admin/recent-activity
// Optional query params: limit (default 20), types (comma separated: borrowRequest,borrowRecord,login)
router.get(
  '/recent-activity',
  jwtAuth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10)));
    const typesQuery = (req.query.types || '').split(',').map(t => t.trim()).filter(Boolean);
    const includeRequests = !typesQuery.length || typesQuery.includes('borrowRequest');
    const includeRecords = !typesQuery.length || typesQuery.includes('borrowRecord');
    const includeLogins = !typesQuery.length || typesQuery.includes('login');

    const promises = [];
    if (includeRequests) promises.push(BorrowRequest.find().sort({ createdAt: -1 }).limit(limit).populate('userId','name email').lean());
    else promises.push(Promise.resolve([]));
    if (includeRecords) promises.push(BorrowRecord.find().sort({ borrowDate: -1 }).limit(limit).populate('userId','name email').lean());
    else promises.push(Promise.resolve([]));
    if (includeLogins) promises.push(LoginLog.find().sort({ createdAt: -1 }).limit(limit).populate('userId','name email').lean());
    else promises.push(Promise.resolve([]));

    const [ reqs, recs, logs ] = await Promise.all(promises);

    const unified = [];

    reqs.forEach(r => unified.push({
      type: 'borrowRequest',
      id: r._id,
      user: r.userId ? { id: r.userId._id, name: r.userId.name, email: r.userId.email } : null,
      status: r.status,
      items: r.items,
      timestamp: r.createdAt,
      meta: { desiredDueDate: r.desiredDueDate, remarks: r.remarks }
    }));

    recs.forEach(rr => unified.push({
      type: 'borrowRecord',
      id: rr._id,
      user: rr.userId ? { id: rr.userId._id, name: rr.userId.name, email: rr.userId.email } : null,
      status: rr.status,
      items: rr.items,
      timestamp: rr.borrowDate || rr.createdAt,
      meta: { dueDate: rr.dueDate, returnDate: rr.returnDate, remarks: rr.remarks }
    }));

    logs.forEach(l => unified.push({
      type: 'login',
      id: l._id,
      user: l.userId ? { id: l.userId._id, name: l.userId.name, email: l.userId.email } : null,
      status: l.success ? 'login_success' : 'login_failed',
      timestamp: l.createdAt,
      meta: { ip: l.ip, userAgent: l.userAgent, email: l.email }
    }));

    // sort by timestamp desc and trim to requested limit
    unified.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ data: unified.slice(0, limit) });
  })
);

// GET /api/admin/overdue?page=1&limit=20
router.get(
  '/overdue',
  jwtAuth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const now = new Date();
    const filter = { status: 'BORROWED', dueDate: { $lt: now } };

    const [ total, items ] = await Promise.all([
      BorrowRecord.countDocuments(filter),
      BorrowRecord.find(filter)
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate('userId','name email')
        .populate('items.componentId','name serialNumber')
        .lean()
    ]);

    const enriched = items.map(it => {
      const overdueDays = it.dueDate ? Math.floor((now - new Date(it.dueDate)) / (1000*60*60*24)) : null;
      return { ...it, overdueDays };
    });

    res.json({ data: enriched, meta: { total, page, limit } });
  })
);

module.exports = router;
