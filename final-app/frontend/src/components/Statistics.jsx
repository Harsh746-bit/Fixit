import React from 'react';

export default function Statistics({ stats }) {
  const { total = 0, pending = 0, inProgress = 0, resolved = 0 } = stats || {};

  return (
    <section className="stats-section py-4 bg-white border-bottom">
      <div className="container">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2 bg-warm-white">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-slate small fw-semibold text-uppercase">Total Issues</span>
                <i className="bi bi-collection-fill text-charcoal"></i>
              </div>
              <div className="h3 fw-bold text-charcoal mb-0">{total}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2 bg-amber-subtle border-amber">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-amber small fw-semibold text-uppercase">Pending</span>
                <i className="bi bi-hourglass-split text-amber"></i>
              </div>
              <div className="h3 fw-bold text-amber mb-0">{pending}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#FFF3EB', borderColor: 'rgba(232, 117, 42, 0.4)' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-safety-orange small fw-semibold text-uppercase">In Progress</span>
                <i className="bi bi-gear-wide-connected text-safety-orange"></i>
              </div>
              <div className="h3 fw-bold text-safety-orange mb-0">{inProgress}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2 bg-green-subtle border-green">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-green small fw-semibold text-uppercase">Resolved</span>
                <i className="bi bi-check-circle-fill text-green"></i>
              </div>
              <div className="h3 fw-bold text-green mb-0">{resolved}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
