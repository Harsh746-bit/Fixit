import React from 'react';

export default function Navbar({ backendConnected, currentUser }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: '🛡️ Admin Mode', class: 'bg-danger text-white' };
      case 'staff':
        return { label: '🛠️ Staff / Technician', class: 'bg-info text-dark' };
      case 'student':
      default:
        return { label: '👨‍🎓 Student View', class: 'bg-primary text-white' };
    }
  };

  const roleInfo = getRoleBadge(currentUser ? currentUser.role : 'student');

  return (
    <>
      <aside className="academic-badge-bar bg-charcoal text-light py-1 border-bottom border-dark">
        <div className="container d-flex flex-wrap justify-content-between align-items-center small gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-safety-orange text-white">FINAL FULL-STACK</span>
            <span className="text-secondary d-none d-md-inline">FixIt Integrated Platform with RBAC</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Active RBAC Role Indicator & Switcher Trigger */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-secondary d-none d-sm-inline">Active Role:</span>
              <span className={`badge ${roleInfo.class} px-2 py-1 fw-bold`} style={{ fontSize: '0.75rem' }}>
                {roleInfo.label}
              </span>
              <button 
                type="button" 
                className="btn btn-outline-light btn-sm py-0 px-2 fw-semibold"
                style={{ fontSize: '0.75rem', lineHeight: '1.6' }}
                data-bs-toggle="modal" 
                data-bs-target="#rbacModal"
                title="Switch User Role to test RBAC permissions"
              >
                <i className="bi bi-person-gear me-1 text-safety-orange"></i> Switch Role
              </button>
            </div>

            <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3">
              <span className="pulse-dot"></span>
              <span className="small text-secondary d-none d-sm-inline">
                {backendConnected ? 'Express API: Online' : 'Connecting to Backend...'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-dark bg-charcoal shadow-sm py-3" aria-label="Main Navigation">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center gap-2" href="#home">
              <span className="brand-icon d-inline-flex align-items-center justify-content-center bg-safety-orange text-white rounded-1">
                <i className="bi bi-tools fs-5"></i>
              </span>
              <span className="brand-text">
                <strong className="text-white">FixIt</strong>
                <small className="d-block text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                  Smart Campus Facilities &bull; RBAC
                </small>
              </span>
            </a>

            <button
              className="navbar-toggler border-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#fixitNavbar"
              aria-controls="fixitNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="fixitNavbar">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium">
                <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#categories">Categories</a></li>
                <li className="nav-item"><a className="nav-link" href="#how-it-works">How It Works</a></li>
                <li className="nav-item"><a className="nav-link" href="#report-section">Report Issue</a></li>
                <li className="nav-item"><a className="nav-link" href="#dashboard-section">Issues Dashboard</a></li>
                <li className="nav-item">
                  <a className="nav-link text-safety-orange fw-bold cursor-pointer" href="#" data-bs-toggle="modal" data-bs-target="#rbacModal">
                    <i className="bi bi-shield-check me-1"></i> RBAC Matrix
                  </a>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-2">
                <a href="#report-section" className="btn btn-safety-orange text-white btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 shadow-sm">
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>Report Issue</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
