/**
 * Authentication & Role-Based Access Control (RBAC) Middleware
 * FixIt — Smart Campus Maintenance Management System
 */

const jwt = require('jsonwebtoken');
const { USERS, ROLE_PERMISSIONS } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'fixit-super-secret-jwt-key-2026';

/**
 * Generates signed JWT for a given user object
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

/**
 * Authentication Middleware:
 * Inspects 'Authorization: Bearer <token>' or fallback 'x-user-role' header
 */
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const roleHeader = req.headers['x-user-role'];

  // 1. Check Bearer Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.user.permissions = ROLE_PERMISSIONS[decoded.role] || ROLE_PERMISSIONS.student;
      return next();
    } catch (err) {
      console.warn('[RBAC Auth] Invalid or expired JWT token:', err.message);
      // Fall through to check roleHeader
    }
  }

  // 2. Convenience header for quick role testing (x-user-role: admin / staff / student)
  if (roleHeader) {
    const matchedUser = USERS.find(u => u.role.toLowerCase() === roleHeader.toLowerCase());
    if (matchedUser) {
      req.user = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        department: matchedUser.department,
        permissions: ROLE_PERMISSIONS[matchedUser.role]
      };
      return next();
    }
  }

  // 3. Default to guest student
  const defaultStudent = USERS.find(u => u.role === 'student');
  req.user = {
    id: defaultStudent.id,
    name: defaultStudent.name,
    email: defaultStudent.email,
    role: 'student',
    department: defaultStudent.department,
    permissions: ROLE_PERMISSIONS.student
  };
  next();
};

/**
 * Authorization Guard:
 * Rejects requests with HTTP 403 Forbidden if user lacks required role
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required to perform this action."
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'student';
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole);

    if (!isAllowed) {
      console.warn(`[RBAC Access Denied] User '${req.user.name}' with role '${userRole}' tried to access '${req.method} ${req.originalUrl}'. Required: [${allowedRoles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `Access denied: Role '${userRole}' lacks permission to execute this operation. Required role: ${allowedRoles.join(' or ')}.`,
        requiredRoles: allowedRoles,
        currentRole: userRole,
        user: {
          name: req.user.name,
          email: req.user.email
        }
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  requireRole,
  generateToken,
  JWT_SECRET
};
