/**
 * RBAC Auth Middleware for Practical 07
 * Enforces role permissions across MongoDB NoSQL operations
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fixit-practical07-jwt-secret-2026';

const ROLE_PERMISSIONS = {
  student: {
    canView: true,
    canCreate: true,
    canUpdateStatus: false,
    canDelete: false
  },
  staff: {
    canView: true,
    canCreate: true,
    canUpdateStatus: true,
    canDelete: false
  },
  admin: {
    canView: true,
    canCreate: true,
    canUpdateStatus: true,
    canDelete: true
  }
};

const USERS = [
  {
    id: "USR-001",
    name: "Harsh Bhanarkar (Student)",
    email: "student@campus.edu",
    role: "student",
    department: "Software Engineering"
  },
  {
    id: "USR-002",
    name: "Vikram Engineer (Staff)",
    email: "staff@campus.edu",
    role: "staff",
    department: "Facilities & Maintenance"
  },
  {
    id: "USR-003",
    name: "Dr. Rachel Green (Admin)",
    email: "admin@campus.edu",
    role: "admin",
    department: "Campus Operations"
  }
];

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const roleHeader = req.headers['x-user-role'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      req.user = decoded;
      req.user.permissions = ROLE_PERMISSIONS[decoded.role] || ROLE_PERMISSIONS.student;
      return next();
    } catch (e) {}
  }

  if (roleHeader) {
    const matched = USERS.find(u => u.role.toLowerCase() === roleHeader.toLowerCase());
    if (matched) {
      req.user = {
        ...matched,
        permissions: ROLE_PERMISSIONS[matched.role]
      };
      return next();
    }
  }

  const defaultUser = USERS[0];
  req.user = {
    ...defaultUser,
    permissions: ROLE_PERMISSIONS.student
  };
  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = (req.user && req.user.role) ? req.user.role.toLowerCase() : 'student';
    if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `RBAC Forbidden: Role '${userRole}' lacks permission for this action. Required role: ${allowedRoles.join(' or ')}.`,
        requiredRoles: allowedRoles,
        currentRole: userRole
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  requireRole,
  USERS,
  ROLE_PERMISSIONS,
  JWT_SECRET
};
