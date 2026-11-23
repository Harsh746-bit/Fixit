/**
 * Authentication & Role Switching Routes
 * Practical & Full-Stack RBAC Integration
 */

const express = require('express');
const router = express.Router();
const { USERS, ROLE_PERMISSIONS } = require('../data/users');
const { generateToken, authenticateUser } = require('../middleware/auth');

// @desc   User login
// @route  POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  let user = null;
  if (role) {
    user = USERS.find(u => u.role.toLowerCase() === role.toLowerCase());
  } else if (email) {
    user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with provided credentials."
    });
  }

  if (password && password !== user.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid password."
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: `Logged in successfully as ${user.name} (${user.role.toUpperCase()})`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: ROLE_PERMISSIONS[user.role]
    }
  });
});

// @desc   Switch role quickly for demonstration / evaluation
// @route  POST /api/auth/switch-role
router.post('/switch-role', (req, res) => {
  const { role } = req.body;
  if (!role || !ROLE_PERMISSIONS[role.toLowerCase()]) {
    return res.status(400).json({
      success: false,
      message: `Invalid role specified. Supported roles: ${Object.keys(ROLE_PERMISSIONS).join(', ')}`
    });
  }

  const user = USERS.find(u => u.role.toLowerCase() === role.toLowerCase());
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: `Active session switched to '${role.toUpperCase()}' role.`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: ROLE_PERMISSIONS[user.role]
    }
  });
});

// @desc   Get current authenticated user info & active permissions
// @route  GET /api/auth/me
router.get('/me', authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    availableRoles: USERS.map(u => ({
      role: u.role,
      name: u.name,
      email: u.email,
      department: u.department,
      description: u.description,
      permissions: ROLE_PERMISSIONS[u.role]
    }))
  });
});

// @desc   Get role permissions matrix
// @route  GET /api/auth/roles
router.get('/roles', (req, res) => {
  res.status(200).json({
    success: true,
    roles: USERS.map(u => ({
      role: u.role,
      name: u.name,
      email: u.email,
      department: u.department,
      description: u.description,
      permissions: ROLE_PERMISSIONS[u.role]
    })),
    permissionsMatrix: ROLE_PERMISSIONS
  });
});

module.exports = router;
