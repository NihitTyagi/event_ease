const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

/**
 * @desc Middleware to protect routes by verifying JWT token.
 * It checks for a token in the Authorization header, verifies it,
 * and attaches the decoded user information to the request object.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database using the id from the token payload
      // and attach it to the request object, excluding the password
      req.user = await User.findById(decoded.user.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * @desc Middleware to grant access only to admin users.
 * This should be used after the 'protect' middleware.
 */
const admin = (req, res, next) => {
  // Check if the user object exists and if their role is 'admin'
  if (req.user && req.user.role === 'admin') {
    // If user is an admin, proceed to the next middleware or route handler
    next();
  } else {
    // If user is not an admin, send a 403 Forbidden status
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
