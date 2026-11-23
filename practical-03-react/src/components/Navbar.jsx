import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <>
      <aside className="academic-badge-bar bg-charcoal text-light py-1 border-bottom border-dark">
        <div className="container d-flex justify-content-between align-items-center small">
          <div>
            <span className="badge bg-safety-orange text-white me-2">PRACTICAL 03</span>
            <span className="text-secondary d-none d-md-inline">Web Technology Lab — ReactJS Components, State &amp; Validation</span>
          </div>
          <div className="text-secondary">
            <span className="me-3"><i className="bi bi-boxes text-safety-orange me-1"></i>Modular Component Hierarchy</span>
            <span className="badge bg-primary">React 18 + Hooks</span>
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
                  React Edition
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
