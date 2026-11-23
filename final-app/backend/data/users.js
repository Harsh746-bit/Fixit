/**
 * User & Role Data Store for RBAC
 * Pre-configured campus roles for testing and evaluation
 */

const USERS = [
  {
    id: "USR-001",
    name: "Harsh Bhanarkar (Student)",
    email: "student@campus.edu",
    password: "password123",
    role: "student",
    department: "Software Engineering",
    description: "Can submit issues, track progress, and view campus statistics. Cannot alter statuses or delete records."
  },
  {
    id: "USR-002",
    name: "Vikram Engineer (Technician / Staff)",
    email: "staff@campus.edu",
    password: "password123",
    role: "staff",
    department: "Facilities & Maintenance",
    description: "Can view issues, submit reports, and update dispatch status (Pending -> In Progress -> Resolved). Cannot delete records."
  },
  {
    id: "USR-003",
    name: "Dr. Rachel Green (Administrator)",
    email: "admin@campus.edu",
    password: "password123",
    role: "admin",
    department: "Campus Operations & Chief Warden",
    description: "Full administrative governance: create, update statuses, permanently delete records, and manage system operations."
  }
];

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

module.exports = { USERS, ROLE_PERMISSIONS };
