// routes/iot.js
const router = require('express').Router();
const IoTDevice = require('../models/IoTDevice');
const { jwtAuth, requireRole } = require('../middleware/jwtAuth');
const asyncHandler = require('../middleware/asyncHandler');

// list devices (admin)
router.get('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const list = await IoTDevice.find().sort({ name: 1 });
  res.json({ data: list });
}));

// create device (admin)
router.post('/', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const d = await IoTDevice.create(req.body);
  res.status(201).json({ data: d });
}));

// update status
router.put('/:id/status', jwtAuth, requireRole('ADMIN'), asyncHandler(async (req,res) => {
  const { isOnline } = req.body;
  const d = await IoTDevice.findByIdAndUpdate(req.params.id, { isOnline, lastSeen: isOnline ? new Date() : undefined }, { new: true });
  if (!d) return res.status(404).json({ message: 'Not found' });
  res.json({ data: d });
}));

module.exports = router;
