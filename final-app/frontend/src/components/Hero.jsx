import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section py-5 border-bottom bg-warm-white">
      <div className="container py-lg-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-white border border-light-gray rounded-1 mb-3 shadow-xs">
              <span className="pulse-dot"></span>
              <span className="small fw-semibold text-charcoal text-uppercase" style={{ letterSpacing: '0.5px' }}>
                University Facilities &amp; Maintenance Platform
              </span>
            </div>
            <h1 className="display-5 fw-bold text-charcoal lh-tight mb-3">
              Campus Problems? <br />
              <span className="text-safety-orange">Let's Fix Them.</span>
            </h1>
            <p className="lead text-slate mb-4">
              Report maintenance issues, track their progress in real time through our unified REST API, and help keep your campus classrooms, labs, and hostels running smoothly.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <a href="#report-section" className="btn btn-safety-orange text-white btn-lg px-4 py-3 fw-bold rounded-1 shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>Report an Issue
              </a>
              <a href="#dashboard-section" className="btn btn-outline-charcoal btn-lg px-4 py-3 fw-bold rounded-1">
                <i className="bi bi-search me-2"></i>View Active Issues
              </a>
            </div>

            <div className="row g-3 pt-3 border-top border-light-gray">
              <div className="col-4">
                <div className="h4 fw-bold text-charcoal mb-0">98.4%</div>
                <div className="small text-slate">SLA Compliance</div>
              </div>
              <div className="col-4">
                <div className="h4 fw-bold text-charcoal mb-0">&lt; 4 hrs</div>
                <div className="small text-slate">Avg Response</div>
              </div>
              <div className="col-4">
                <div className="h4 fw-bold text-charcoal mb-0">2,400+</div>
                <div className="small text-slate">Resolved YTD</div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="workflow-visual-card bg-white p-4 rounded-2 border shadow-sm">
              <div className="workflow-header d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-safety-orange fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold text-charcoal">Facilities Control Room</h6>
                    <small className="text-slate">Full-Stack Live REST Dispatch</small>
                  </div>
                </div>
                <span className="badge bg-green-subtle text-green border border-green px-2 py-1">Full-Stack Linked</span>
              </div>

              <div className="d-flex flex-column gap-2">
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-safety-orange text-white rounded-circle p-2" style={{ width: '28px', height: '28px' }}>01</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">React Client Validation &amp; POST</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Form data validated and transmitted to Express API.</p>
                  </div>
                </div>
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-amber text-charcoal fw-bold rounded-circle p-2" style={{ width: '28px', height: '28px' }}>02</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">Express Middleware &amp; Controller</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Request sanitized, ID generated, persisted to JSON.</p>
                  </div>
                </div>
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-green text-white rounded-circle p-2" style={{ width: '28px', height: '28px' }}>03</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">Live State Sync &amp; CRUD Updates</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Instant UI reactivity for status changes and deletions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
