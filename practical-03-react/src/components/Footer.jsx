import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-secondary py-5 border-top border-dark mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-icon d-inline-flex align-items-center justify-content-center bg-safety-orange text-white rounded-1 p-1">
                <i className="bi bi-tools fs-6"></i>
              </span>
              <strong className="text-white fs-5">FixIt</strong>
            </div>
            <p className="small text-secondary">
              Smart Campus Maintenance Management System. Built using ReactJS, Vite, Bootstrap 5, and state management hooks.
            </p>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#home" className="text-secondary text-decoration-none">Home</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Categories</a></li>
              <li><a href="#how-it-works" className="text-secondary text-decoration-none">How It Works</a></li>
              <li><a href="#report-section" className="text-secondary text-decoration-none">Report Issue</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Service Scope</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#categories" className="text-secondary text-decoration-none">Electrical &amp; Power</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Plumbing Systems</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Wi-Fi &amp; Networks</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Lab Equipment</a></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Facilities Contact</h6>
            <p className="small text-secondary mb-1">Central University Operations</p>
            <p className="font-monospace text-safety-orange fw-bold mb-1">+91 11 2345 6789</p>
            <p className="small text-secondary mb-0">facilities@campus.edu</p>
          </div>
        </div>
        <div className="border-top border-dark pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small">
          <p className="mb-0">&copy; 2026 FixIt Campus Facilities. Practical 03 React Application.</p>
          <div className="d-flex gap-2">
            <span className="badge bg-secondary">Practical 03 Build</span>
            <span className="text-secondary">ReactJS + Hooks + Bootstrap 5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
