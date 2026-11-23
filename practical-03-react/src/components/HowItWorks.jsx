import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-5 bg-white border-top border-bottom">
      <div className="container py-lg-3">
        <div className="section-header text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span className="badge bg-safety-orange text-white text-uppercase px-2 py-1 mb-2">Streamlined Lifecycle</span>
          <h2 className="h2 fw-bold text-charcoal mb-2">How FixIt Works</h2>
          <p className="text-slate">From first report to verified closure in three transparent steps.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="p-4 rounded-2 bg-warm-white border h-100">
              <div className="font-monospace text-safety-orange fw-bold fs-2 mb-3">01</div>
              <h4 className="fw-bold text-charcoal mb-2 h5">1. Report Problem</h4>
              <p className="text-slate small mb-0">Fill out our structured form with specific location details, category, and urgency level. You will receive an instant Reference ID (e.g. <code>FIX-1001</code>).</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-4 rounded-2 bg-warm-white border h-100">
              <div className="font-monospace text-safety-orange fw-bold fs-2 mb-3">02</div>
              <h4 className="fw-bold text-charcoal mb-2 h5">2. Track in Real-Time</h4>
              <p className="text-slate small mb-0">The facilities control room assigns an authorized technician. Track status changes from <strong>Pending</strong> to <strong>In Progress</strong>.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-4 rounded-2 bg-warm-white border h-100">
              <div className="font-monospace text-safety-orange fw-bold fs-2 mb-3">03</div>
              <h4 className="fw-bold text-charcoal mb-2 h5">3. Resolution Verified</h4>
              <p className="text-slate small mb-0">Technicians complete repairs and mark the ticket <strong>Resolved</strong>. Quality audits ensure student satisfaction and lasting maintenance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
