import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-secondary py-5 border-top border-dark mt-5" id="about-section">
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
              Smart Campus Maintenance Management System. A full-stack academic web platform integrating ReactJS, Bootstrap 5, Express.js REST API, and Node.js.
            </p>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#home" className="text-secondary text-decoration-none">Home</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Categories</a></li>
              <li><a href="#how-it-works" className="text-secondary text-decoration-none">How It Works</a></li>
              <li><a href="#report-section" className="text-secondary text-decoration-none">Report Issue</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Coverage</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#categories" className="text-secondary text-decoration-none">Academic Blocks A-D</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Hostels &amp; Residences</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Computing &amp; Wi-Fi</a></li>
              <li><a href="#categories" className="text-secondary text-decoration-none">Central Workshop Labs</a></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6 className="text-white fw-semibold small text-uppercase mb-3">Central Facilities</h6>
            <p className="small text-secondary mb-1">24/7 Operations Desk</p>
            <p className="font-monospace text-safety-orange fw-bold mb-1">+91 11 2345 6789</p>
            <p className="small text-secondary mb-0">facilities@campus.edu</p>
          </div>
        </div>
        <div className="border-top border-dark pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small">
          <p className="mb-0">&copy; 2026 FixIt Campus Facilities. Final Integrated Full-Stack Application.</p>
          <div className="d-flex gap-2">
            <span className="badge bg-safety-orange text-white">Full-Stack Linked</span>
            <span className="text-secondary">React + Bootstrap + Express + Node</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
