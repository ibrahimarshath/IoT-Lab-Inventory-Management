// routes/admin.js
const router = require('express').Router();
const Component = require('../models/Component');
const BorrowRecord = require('../models/BorrowRecord');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/stats', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const lowStock = await Component.countDocuments({ qtyAvailable: { $lte: 5 }, archived: false });
  const totalComponents = await Component.countDocuments({ archived: false });
  const borrowedCount = await BorrowRecord.countDocuments({ status: 'BORROWED' });
  res.json({ data: { lowStock, totalComponents, borrowedCount } });
}));

module.exports = router;
