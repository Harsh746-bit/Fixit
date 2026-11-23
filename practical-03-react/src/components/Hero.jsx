import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section py-5 border-bottom bg-warm-white">
      <div className="container py-lg-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-white border border-light-gray rounded-1 mb-3 shadow-xs">
              <span className="status-indicator-dot bg-safety-orange" style={{ width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
              <span className="small fw-semibold text-charcoal text-uppercase" style={{ letterSpacing: '0.5px' }}>
                University Facilities Dispatch
              </span>
            </div>
            <h1 className="display-5 fw-bold text-charcoal lh-tight mb-3">
              Campus Problems? <br />
              <span className="text-safety-orange">Let's Fix Them.</span>
            </h1>
            <p className="lead text-slate mb-4">
              Report maintenance issues, track their progress in real time, and help keep your campus classrooms, labs, and hostels running smoothly.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="#report-section" className="btn btn-safety-orange text-white btn-lg px-4 py-3 fw-bold rounded-1 shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>Report an Issue
              </a>
              <a href="#dashboard-section" className="btn btn-outline-charcoal btn-lg px-4 py-3 fw-bold rounded-1">
                <i className="bi bi-search me-2"></i>View Active Issues
              </a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="workflow-visual-card bg-white p-4 rounded-2 border shadow-sm">
              <div className="workflow-header d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-safety-orange fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold text-charcoal">Campus Facilities Engine</h6>
                    <small className="text-slate">Automated React Lifecycle</small>
                  </div>
                </div>
                <span className="badge bg-green-subtle text-green border border-green px-2 py-1">React State Active</span>
              </div>

              <div className="d-flex flex-column gap-2">
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-safety-orange text-white rounded-circle p-2" style={{ width: '28px', height: '28px' }}>01</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">Controlled Form Submission</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Client-side field validation with RegEx.</p>
                  </div>
                </div>
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-amber text-charcoal fw-bold rounded-circle p-2" style={{ width: '28px', height: '28px' }}>02</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">State Mutation &amp; Filtering</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Hooks dynamically re-calculate status metrics.</p>
                  </div>
                </div>
                <div className="p-3 rounded-1 border border-light-gray bg-warm-white d-flex align-items-center gap-3">
                  <div className="badge bg-green text-white rounded-circle p-2" style={{ width: '28px', height: '28px' }}>03</div>
                  <div>
                    <h6 className="fw-bold mb-0 text-charcoal small">Verification &amp; Resolution</h6>
                    <p className="text-slate small mb-0" style={{ fontSize: '0.8rem' }}>Interactive status switcher &amp; delete modal.</p>
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
