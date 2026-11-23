import React from 'react';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  onClearFilters
}) {
  return (
    <div className="card border rounded-2 p-3 bg-white shadow-xs mb-4">
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-7">
          <div className="input-group">
            <span className="input-group-text bg-warm-white border-end-0 text-slate">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by ID, category, location, or keyword..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-5 text-md-end">
          <button className="btn btn-outline-secondary btn-sm w-100 w-md-auto" onClick={onClearFilters}>
            <i className="bi bi-arrow-counterclockwise me-1"></i>Clear Filters
          </button>
        </div>
      </div>

      <div className="row g-2">
        <div className="col-4">
          <label htmlFor="filter-cat" className="form-label small fw-semibold text-slate mb-1">Category</label>
          <select
            id="filter-cat"
            className="form-select form-select-sm"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Internet">Internet</option>
            <option value="Furniture">Furniture</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>

        <div className="col-4">
          <label htmlFor="filter-stat" className="form-label small fw-semibold text-slate mb-1">Status</label>
          <select
            id="filter-stat"
            className="form-select form-select-sm"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="col-4">
          <label htmlFor="filter-prio" className="form-label small fw-semibold text-slate mb-1">Priority</label>
          <select
            id="filter-prio"
            className="form-select form-select-sm"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}
