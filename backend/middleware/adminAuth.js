const jwt = require('jsonwebtoken');

/**
 * Middleware to protect admin-only routes.
 * Expects the token in the `x-auth-token` header.
 * Sets `req.admin` to the decoded payload: { id, role }
 */
module.exports = function adminAuth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token must carry an admin payload (not a hospital user token)
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Access denied: admin token required' });
    }

    req.admin = decoded.admin; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
