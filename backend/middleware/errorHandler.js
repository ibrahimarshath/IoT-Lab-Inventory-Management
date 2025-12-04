// backend/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error handler caught:', err && err.stack ? err.stack : err);

  // Mongoose duplicate key (E11000)
  if (err && err.code === 11000) {
    const key = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const val = err.keyValue ? err.keyValue[key] : '';
    return res.status(409).json({ message: `Duplicate ${key}: ${val}` });
  }

  // Mongoose validation
  if (err && err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') || 'Validation error' });
  }

  // JWT errors
  if (err && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    return res.status(401).json({ message: err.message || 'Invalid token' });
  }

  const status = err && err.status ? err.status : 500;
  return res.status(status).json({ message: err && err.message ? err.message : 'Server error' });
};
