import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import CategorySection from './components/CategorySection';
import HowItWorks from './components/HowItWorks';
import ReportForm from './components/ReportForm';
import IssueDashboard from './components/IssueDashboard';
import DeleteModal from './components/DeleteModal';
import Footer from './components/Footer';
import { initialIssues } from './data/sampleIssues';

export default function App() {
  const [issues, setIssues] = useState(initialIssues);
  const [nextIdNumber, setNextIdNumber] = useState(1007);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleAddIssue = (newIssue) => {
    // Functional state update: setIssues([...issues, newIssue])
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    setNextIdNumber(prev => prev + 1);
    showToast('Issue Reported Successfully', `Reference ID: ${newIssue.id}`, 'success');

    // Smooth scroll down to dashboard
    const el = document.getElementById('dashboard-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStatusChange = (issueId, newStatus) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
    showToast('Status Updated', `Ticket ${issueId} changed to "${newStatus}"`, 'info');
  };

  const handleRequestDelete = (issue) => {
    setDeleteTarget(issue);
  };

  const handleConfirmDelete = (issueId) => {
    setIssues(prevIssues => prevIssues.filter(i => i.id !== issueId));
    setDeleteTarget(null);
    showToast('Issue Deleted', `Ticket ${issueId} removed from state.`, 'danger');
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Hero />
      <Statistics issues={issues} />
      <CategorySection />
      <HowItWorks />

      <main className="container py-5">
        <div className="row g-4">
          {/* Left Column: Intake Form */}
          <div className="col-lg-5" id="report-section">
            <ReportForm
              onAddIssue={handleAddIssue}
              nextId={`FIX-${nextIdNumber}`}
            />
          </div>

          {/* Right Column: Search, Filter & Issue Cards */}
          <div className="col-lg-7">
            <IssueDashboard
              issues={issues}
              onStatusChange={handleStatusChange}
              onRequestDelete={handleRequestDelete}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        issue={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* React Toast Notification */}
      {toast.show && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-white bg-charcoal border-0 shadow">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i
                  className={`fs-5 bi ${
                    toast.type === 'danger'
                      ? 'bi-exclamation-octagon-fill text-danger'
                      : 'bi-check-circle-fill text-safety-orange'
                  }`}
                ></i>
                <div>
                  <div className="fw-bold">{toast.title}</div>
                  <small className="text-light">{toast.message}</small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
