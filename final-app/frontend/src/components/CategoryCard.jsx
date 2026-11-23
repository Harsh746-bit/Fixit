import React from 'react';

export default function CategoryCard({ icon, title, description, sla, onSelectCategory }) {
  return (
    <div className="col-md-6 col-lg-4">
      <article className="category-card card h-100 border rounded-2 p-3 bg-white shadow-xs">
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className="category-icon-box bg-warm-white text-safety-orange rounded-1 mb-3">
              <i className={`bi ${icon} fs-3`}></i>
            </div>
            <h3 className="h5 fw-bold text-charcoal mb-2">{title}</h3>
            <p className="text-slate small mb-3">{description}</p>
          </div>
          <div className="category-footer pt-3 border-top d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-slate border">Avg SLA: {sla}</span>
            <a 
              href="#report-section" 
              className="btn btn-link text-safety-orange p-0 text-decoration-none fw-semibold small"
              onClick={() => onSelectCategory && onSelectCategory(title)}
            >
              Report This &rarr;
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
