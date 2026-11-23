import React, { useState } from 'react';

const ROLES_INFO = [
  {
    id: 'student',
    title: 'Student / Faculty',
    badge: '👨‍🎓 Student',
    badgeClass: 'bg-primary text-white',
    name: 'Harsh Bhanarkar',
    email: 'student@campus.edu',
    dept: 'Software Engineering',
    description: 'General campus members. Can browse tickets, track resolution progress, and submit new facilities complaints.',
    permissions: [
      { label: 'View Campus Tickets', allowed: true },
      { label: 'Report New Issue', allowed: true },
      { label: 'Update Ticket Status', allowed: false },
      { label: 'Delete Tickets', allowed: false }
    ]
  },
  {
    id: 'staff',
    title: 'Facilities Technician',
    badge: '🛠️ Staff / Technician',
    badgeClass: 'bg-info text-dark',
    name: 'Vikram Engineer',
    email: 'staff@campus.edu',
    dept: 'Facilities & Maintenance',
    description: 'Maintenance field staff. Dispatched to repair campus issues; can update issue status from Pending to In Progress or Resolved.',
    permissions: [
      { label: 'View Campus Tickets', allowed: true },
      { label: 'Report New Issue', allowed: true },
      { label: 'Update Ticket Status', allowed: true },
      { label: 'Delete Tickets', allowed: false }
    ]
  },
  {
    id: 'admin',
    title: 'Operations Administrator',
    badge: '🛡️ Administrator',
    badgeClass: 'bg-danger text-white',
    name: 'Dr. Rachel Green',
    email: 'admin@campus.edu',
    dept: 'Campus Operations & Chief Warden',
    description: 'Executive governance. Full oversight to create, update statuses, audit system metrics, and permanently delete tickets.',
    permissions: [
      { label: 'View Campus Tickets', allowed: true },
      { label: 'Report New Issue', allowed: true },
      { label: 'Update Ticket Status', allowed: true },
      { label: 'Delete Tickets', allowed: true }
    ]
  }
];

export default function RoleSwitcher({ currentUser, onRoleSelect }) {
  const [switching, setSwitching] = useState(false);

  const handleSelect = async (roleId) => {
    if (roleId === currentUser.role) return;
    setSwitching(true);
    try {
      await onRoleSelect(roleId);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="modal fade" id="rbacModal" tabIndex="-1" aria-labelledby="rbacModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-charcoal text-white py-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-safety-orange fs-6 px-2 py-1">RBAC</span>
              <h5 className="modal-title h6 fw-bold mb-0" id="rbacModalLabel">
                Role-Based Access Control (RBAC) Switcher
              </h5>
            </div>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body p-4 bg-warm-white">
            <p className="small text-secondary mb-4">
              Select an identity below to test role-restricted permissions. The Express backend enforces these roles on 
              <code>POST /api/issues</code>, <code>PATCH /api/issues/:id/status</code>, and <code>DELETE /api/issues/:id</code>.
            </p>

            <div className="row g-3">
              {ROLES_INFO.map(r => {
                const isActive = currentUser.role === r.id;
                return (
                  <div key={r.id} className="col-12 col-md-4">
                    <div 
                      className={`card h-100 p-3 transition-all cursor-pointer ${isActive ? 'border-2 border-safety-orange shadow-sm bg-white' : 'border bg-light'}`}
                      style={{ borderRadius: '10px' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge ${r.badgeClass} px-2 py-1 small`}>
                          {r.badge}
                        </span>
                        {isActive && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle small fw-bold">
                            Active
                          </span>
                        )}
                      </div>

                      <h6 className="fw-bold text-charcoal mb-1">{r.title}</h6>
                      <div className="small text-slate fw-semibold">{r.name}</div>
                      <div className="small text-secondary mb-2" style={{ fontSize: '0.75rem' }}>{r.dept}</div>
                      <p className="small text-secondary mb-3" style={{ fontSize: '0.8rem', minHeight: '48px' }}>
                        {r.description}
                      </p>

                      <div className="pt-2 border-top border-light-gray mb-3 small" style={{ fontSize: '0.75rem' }}>
                        {r.permissions.map((p, idx) => (
                          <div key={idx} className="d-flex justify-content-between py-1">
                            <span>{p.label}</span>
                            <span className={p.allowed ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                              {p.allowed ? '✓ Yes' : '✕ No'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm w-100 mt-auto fw-semibold ${isActive ? 'btn-outline-charcoal disabled' : 'btn-safety-orange text-white'}`}
                        disabled={isActive || switching}
                        onClick={() => handleSelect(r.id)}
                      >
                        {isActive ? 'Current Active Role' : `Switch to ${r.title}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-footer bg-white border-top py-2">
            <span className="small text-secondary me-auto">
              <i className="bi bi-shield-lock-fill text-safety-orange me-1"></i>
              Active Token: Signed JWT (HS256) | Express Middleware Guard
            </span>
            <button type="button" className="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
