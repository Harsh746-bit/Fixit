import React from 'react';

export default function IssueCard({ issue, onStatusChange, onRequestDelete }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'badge-priority-Critical';
      case 'High': return 'badge-priority-High';
      case 'Medium': return 'badge-priority-Medium';
      case 'Low': return 'badge-priority-Low';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge-status-Pending';
      case 'In Progress': return 'badge-status-InProgress';
      case 'Resolved': return 'badge-status-Resolved';
      default: return 'bg-light text-slate';
    }
  };

  return (
    <article className="issue-card" data-id={issue.id}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-charcoal font-monospace">{issue.id}</span>
          <span className={`badge ${getPriorityBadgeClass(issue.priority)}`}>{issue.priority} Priority</span>
          <span className="badge bg-light text-slate border">{issue.category}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${getStatusBadgeClass(issue.status)} font-semibold`}>{issue.status}</span>
        </div>
      </div>

      <h4 className="h6 fw-bold text-charcoal mb-1">{issue.location}</h4>
      <p className="small text-secondary mb-3">{issue.description}</p>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top border-light-gray small">
        <div className="text-slate">
          <i className="bi bi-person-circle me-1"></i>{issue.name} &bull; 
          <span className="text-secondary ms-1">{issue.date}</span>
          {issue.contact && (
            <span className="ms-1">&bull; <i className="bi bi-telephone me-1"></i>+91 {issue.contact}</span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Status update select */}
          <select
            className="form-select form-select-sm"
            style={{ fontSize: '0.82rem', fontWeight: '600', padding: '0.25rem 0.5rem', width: 'auto' }}
            value={issue.status}
            onChange={(e) => onStatusChange(issue.id, e.target.value)}
            aria-label={`Change status for ticket ${issue.id}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Delete button */}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm px-2 py-1"
            onClick={() => onRequestDelete(issue)}
            title="Delete ticket"
            aria-label={`Delete ticket ${issue.id}`}
          >
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </article>
  );
}
