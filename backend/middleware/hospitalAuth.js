const jwt = require('jsonwebtoken');

/**
 * Middleware to protect hospital-only routes.
 * Accepts token in Authorization: Bearer <token> header.
 * Sets req.hospital = { id, role: 'hospital', name? }
 */
module.exports = function hospitalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'hospital') {
      return res.status(403).json({ msg: 'Access denied: hospital token required' });
    }
    req.hospital = { id: decoded.id, role: decoded.role, name: decoded.name || '' };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
