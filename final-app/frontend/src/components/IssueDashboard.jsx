import React, { useState } from 'react';
import FilterBar from './FilterBar';
import IssueCard from './IssueCard';

export default function IssueDashboard({
  issues,
  onStatusChange,
  onRequestDelete,
  loading,
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredIssues = issues.filter(issue => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = !search ||
      issue.id.toLowerCase().includes(search) ||
      issue.category.toLowerCase().includes(search) ||
      issue.location.toLowerCase().includes(search) ||
      issue.description.toLowerCase().includes(search) ||
      issue.name.toLowerCase().includes(search);

    const matchesCategory = (selectedCategory === 'All' || issue.category === selectedCategory);
    const matchesStatus = (selectedStatus === 'All' || issue.status === selectedStatus);
    const matchesPriority = (selectedPriority === 'All' || issue.priority === selectedPriority);

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  const isFiltered = searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All';

  return (
    <div id="dashboard-section">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onClearFilters={handleClearFilters}
      />

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="h6 fw-bold text-charcoal mb-0">
          Active Campus Tickets (<span className="text-safety-orange">{filteredIssues.length}</span>)
        </h3>
        <div className="d-flex align-items-center gap-2">
          {currentUser && (
            <span className="small text-secondary me-2 d-none d-md-inline">
              Viewing as: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          )}
          <span className="badge bg-light text-slate border">
            {isFiltered ? 'Active filters applied' : 'Showing all items'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 border rounded-2 bg-white">
          <div className="spinner-border text-safety-orange mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-slate small mb-0">Fetching campus tickets from Express REST API...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-5 border rounded-2 bg-white shadow-xs">
          <i className="bi bi-inbox fs-1 text-slate mb-2 d-block"></i>
          <h5 className="fw-bold text-charcoal">No Matching Issues Found</h5>
          <p className="text-slate small mb-3">Try adjusting your search query or clear active filters.</p>
          <button className="btn btn-outline-charcoal btn-sm" onClick={handleClearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onStatusChange={onStatusChange}
              onRequestDelete={onRequestDelete}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
