import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import CategorySection from './components/CategorySection';
import HowItWorks from './components/HowItWorks';
import ReportForm from './components/ReportForm';
import IssueDashboard from './components/IssueDashboard';
import DeleteModal from './components/DeleteModal';
import RoleSwitcher from './components/RoleSwitcher';
import Footer from './components/Footer';
import * as api from './services/api';

export default function App() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });
  const [currentUser, setCurrentUser] = useState(() => api.getActiveUser());

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Initial Load from Express API
  const loadData = async () => {
    try {
      setLoading(true);
      const [issuesRes, statsRes] = await Promise.all([
        api.getIssues(),
        api.getStatistics()
      ]);
      setIssues(issuesRes.data || []);
      setStats(statsRes.data || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
      setBackendOnline(true);
    } catch (err) {
      console.warn('Backend API connection warning:', err.message);
      setBackendOnline(false);
      showToast('API Notice', 'Connecting to Express Backend at port 5000...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Role Switching
  const handleRoleSelect = async (newRole) => {
    try {
      const result = await api.switchRole(newRole);
      setCurrentUser(result.user);
      showToast('RBAC Role Switched', `Active identity changed to ${result.user.name} (${newRole.toUpperCase()})`, 'info');
      
      // Auto close modal if bootstrap is available
      const modalEl = document.getElementById('rbacModal');
      if (modalEl && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
    } catch (err) {
      showToast('Role Switch Failed', err.message, 'danger');
    }
  };

  // Handle Create Issue -> POST /api/issues
  const handleIssueCreated = async (formData) => {
    try {
      const result = await api.createIssue(formData);
      showToast('Issue Reported Successfully', `Reference ID: ${result.referenceId || result.data.id}`, 'success');
      await loadData();
      
      const dashboardEl = document.getElementById('dashboard-section');
      if (dashboardEl) dashboardEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      const isForbidden = err.status === 403 || err.message.includes('Access denied');
      showToast(
        isForbidden ? '403 Forbidden (RBAC)' : 'Submission Failed',
        err.message || 'Error communicating with backend.',
        'danger'
      );
      throw err;
    }
  };

  // Handle Status Change -> PATCH /api/issues/:id/status
  const handleStatusChange = async (issueId, newStatus) => {
    // Client-side quick check
    if (!currentUser.permissions.canUpdateStatus) {
      return showToast(
        '403 Forbidden (RBAC)',
        `Your current role '${currentUser.role.toUpperCase()}' cannot update status. Switch to Staff or Admin.`,
        'danger'
      );
    }

    try {
      // Optimistic update
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
      
      await api.updateIssueStatus(issueId, newStatus);
      showToast('Status Updated', `Ticket ${issueId} updated to "${newStatus}"`, 'info');
      
      // Sync fresh statistics
      const statsRes = await api.getStatistics().catch(() => null);
      if (statsRes && statsRes.data) setStats(statsRes.data);
    } catch (err) {
      const isForbidden = err.status === 403 || err.message.includes('Access denied');
      showToast(isForbidden ? '403 Forbidden (RBAC)' : 'Update Failed', err.message, 'danger');
      loadData(); // Revert on error
    }
  };

  // Handle Delete Issue -> DELETE /api/issues/:id
  const handleRequestDelete = (issue) => {
    if (!currentUser.permissions.canDelete) {
      return showToast(
        '403 Forbidden (RBAC)',
        `Deletion is restricted to Administrators only. Current role: '${currentUser.role.toUpperCase()}'.`,
        'danger'
      );
    }
    setDeleteTarget(issue);
  };

  const handleConfirmDelete = async (issueId) => {
    try {
      setDeleting(true);
      await api.deleteIssue(issueId);
      setDeleteTarget(null);
      showToast('Issue Deleted', `Ticket ${issueId} permanently deleted.`, 'danger');
      await loadData();
    } catch (err) {
      const isForbidden = err.status === 403 || err.message.includes('Access denied');
      showToast(isForbidden ? '403 Forbidden (RBAC)' : 'Delete Failed', err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar backendConnected={backendOnline} currentUser={currentUser} />
      <Hero />
      <Statistics stats={stats} />
      <CategorySection />
      <HowItWorks />

      <main className="container py-5">
        <div className="row g-4">
          {/* Left: Form */}
          <div className="col-lg-5" id="report-section">
            <ReportForm onIssueCreated={handleIssueCreated} loading={loading} />
          </div>

          {/* Right: Dashboard */}
          <div className="col-lg-7">
            <IssueDashboard
              issues={issues}
              onStatusChange={handleStatusChange}
              onRequestDelete={handleRequestDelete}
              loading={loading}
              currentUser={currentUser}
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
        deleting={deleting}
      />

      {/* RBAC Role Switcher Modal */}
      <RoleSwitcher
        currentUser={currentUser}
        onRoleSelect={handleRoleSelect}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-white bg-charcoal border-0 shadow">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i
                  className={`fs-5 bi ${
                    toast.type === 'danger'
                      ? 'bi-exclamation-octagon-fill text-danger'
                      : toast.type === 'info'
                      ? 'bi-info-circle-fill text-warning'
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
