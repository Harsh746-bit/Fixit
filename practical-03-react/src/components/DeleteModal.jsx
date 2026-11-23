import React from 'react';

export default function DeleteModal({ isOpen, issue, onConfirm, onCancel }) {
  if (!isOpen || !issue) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content rounded-2 border shadow">
            <div className="modal-header bg-charcoal text-white">
              <h5 className="modal-title h6 fw-bold">
                <i className="bi bi-trash3-fill text-danger me-2"></i>Delete Campus Ticket?
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <p className="mb-2 fw-semibold text-charcoal">Are you sure you want to delete this maintenance ticket?</p>
              <p className="text-slate small mb-3">
                Ticket Reference: <strong className="font-monospace text-danger">{issue.id}</strong> — {issue.location}
              </p>
              <div className="alert alert-warning small mb-0">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                This action cannot be undone. The ticket will be removed from React state.
              </div>
            </div>
            <div className="modal-footer bg-warm-white">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-sm px-3" onClick={() => onConfirm(issue.id)}>
                Delete Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
