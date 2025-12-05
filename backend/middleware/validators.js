const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  next();
};

const registerValidation = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  handleValidation
];

const loginValidation = [
  body('email').isEmail(),
  body('password').exists(),
  handleValidation
];

const createComponentValidation = [
  body('name').isString().isLength({ min: 1 }),
  body('qtyAvailable').optional().isInt({ min: 0 }),
  body('categories').optional().isArray(),
  handleValidation
];

const borrowRequestValidation = [
  body('items').isArray({ min: 1 }),
  body('items.*.componentId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  handleValidation
];

module.exports = { registerValidation, loginValidation, createComponentValidation, borrowRequestValidation };
