/**
 * FixIt — Practical 07: Client-side AJAX Application Engine
 * Manages full CRUD against Express + MongoDB backend
 */

const API_BASE = '/api/issues';

let currentIssues = [];
let deleteTargetId = null;

function getActiveRole() {
    const sel = document.getElementById('activeRoleSelector');
    return sel ? sel.value : 'admin';
}

function authFetch(url, options = {}) {
    options.headers = options.headers || {};
    if (!(options.headers instanceof Headers) && typeof options.headers === 'object') {
        options.headers['x-user-role'] = getActiveRole();
    }
    return fetch(url, options);
}

document.addEventListener('DOMContentLoaded', () => {
    checkDatabaseHealth();
    loadDashboard();
    setupEventListeners();
});

// 1. Check & display live MongoDB connection details
async function checkDatabaseHealth() {
    try {
        const res = await fetch('/api/db-status');
        const json = await res.json();
        const dbBadge = document.getElementById('dbStatusBadge');
        if (json.success && json.dbInfo) {
            const { isConnected, database, collection, provider } = json.dbInfo;
            if (isConnected) {
                dbBadge.innerHTML = `🟢 MongoDB Connected: <strong>${database}</strong> / Collection: <strong>${collection}</strong>`;
                dbBadge.className = 'badge bg-success p-2 text-wrap';
            } else {
                dbBadge.innerHTML = `🟡 Fallback Mode: <strong>${provider}</strong>`;
                dbBadge.className = 'badge bg-warning text-dark p-2 text-wrap';
            }
        }
    } catch (err) {
        console.error('Failed to query db status:', err);
    }
}

// 2. Fetch and render issues & statistics
async function loadDashboard() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const searchQuery = document.getElementById('searchQuery').value.trim();

    const params = new URLSearchParams();
    if (categoryFilter) params.append('category', categoryFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);

    try {
        const res = await fetch(`${API_BASE}?${params.toString()}`);
        const result = await res.json();

        if (result.success) {
            currentIssues = result.data;
            renderIssuesTable(currentIssues);
            loadStatistics();
        } else {
            showAlert('danger', result.message || 'Error fetching issues.');
        }
    } catch (err) {
        console.error('Error fetching issues:', err);
        showAlert('danger', 'Unable to communicate with the server.');
    }
}

// 3. Fetch summary metrics
async function loadStatistics() {
    try {
        const res = await fetch(`${API_BASE}/stats/summary`);
        const json = await res.json();
        if (json.success) {
            document.getElementById('statTotal').innerText = json.data.total;
            document.getElementById('statPending').innerText = json.data.pending;
            document.getElementById('statInProgress').innerText = json.data.inProgress;
            document.getElementById('statResolved').innerText = json.data.resolved;
        }
    } catch (err) {
        console.error('Error fetching statistics:', err);
    }
}

// 4. Render Issues in Table / Card View
function renderIssuesTable(issues) {
    const tbody = document.getElementById('issuesTableBody');
    const emptyState = document.getElementById('emptyState');
    const activeRole = getActiveRole();

    tbody.innerHTML = '';

    if (!issues || issues.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }
    emptyState.classList.add('d-none');

    issues.forEach(issue => {
        const tr = document.createElement('tr');
        const statusClass = issue.status.replace(/\s+/g, '-');
        
        tr.innerHTML = `
            <td><strong class="text-secondary">${issue.ticketId || issue._id.substring(18)}</strong></td>
            <td>
                <div class="fw-bold">${escapeHtml(issue.title)}</div>
                <small class="text-muted"><i class="bi bi-geo-alt"></i> ${escapeHtml(issue.location)}</small>
            </td>
            <td><span class="badge-category">${escapeHtml(issue.category)}</span></td>
            <td><span class="badge badge-priority-${issue.priority} px-2 py-1 rounded">${issue.priority}</span></td>
            <td>
                <span class="status-pill ${statusClass}">
                    ● ${issue.status}
                </span>
            </td>
            <td>
                <div class="small fw-semibold">${escapeHtml(issue.reporterName)}</div>
                <div class="small text-muted">${escapeHtml(issue.reporterEmail)}</div>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${activeRole === 'student' ? `
                        <button class="btn btn-outline-secondary disabled" title="Students cannot update status (Staff/Admin only)">
                            🔒 Status
                        </button>
                    ` : `
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Status
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="quickStatusChange('${issue._id}', 'Pending')">Pending</a></li>
                            <li><a class="dropdown-item" href="#" onclick="quickStatusChange('${issue._id}', 'In Progress')">In Progress</a></li>
                            <li><a class="dropdown-item" href="#" onclick="quickStatusChange('${issue._id}', 'Resolved')">Resolved</a></li>
                        </ul>
                    `}
                    ${activeRole === 'student' ? `
                        <button class="btn btn-outline-secondary disabled" title="Students cannot edit details (Staff/Admin only)">
                            🔒 Edit
                        </button>
                    ` : `
                        <button class="btn btn-outline-primary" onclick="openEditModal('${issue._id}')" title="Edit">
                            ✏️
                        </button>
                    `}
                    ${activeRole === 'admin' ? `
                        <button class="btn btn-outline-danger" onclick="confirmDelete('${issue._id}', '${escapeHtml(issue.title)}')" title="Delete (Admin Only)">
                            🗑️
                        </button>
                    ` : `
                        <button class="btn btn-outline-secondary disabled" title="Delete restricted to Admin only">
                            🔒
                        </button>
                    `}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. Create Issue with Validation
async function handleCreateIssue(e) {
    e.preventDefault();
    const form = document.getElementById('createIssueForm');
    
    const payload = {
        title: form.title.value.trim(),
        category: form.category.value,
        location: form.location.value.trim(),
        priority: form.priority.value,
        status: form.status.value,
        description: form.description.value.trim(),
        reporterName: form.reporterName.value.trim(),
        reporterEmail: form.reporterEmail.value.trim(),
        reporterPhone: form.reporterPhone.value.trim()
    };

    // Client-side quick check
    if (!payload.title || payload.title.length < 3) {
        return showAlert('warning', 'Title must be at least 3 characters.');
    }
    if (!payload.description || payload.description.length < 10) {
        return showAlert('warning', 'Description must be at least 10 characters.');
    }
    if (payload.reporterPhone && !/^[6-9]\d{9}$/.test(payload.reporterPhone)) {
        return showAlert('warning', 'Please provide a valid 10-digit Indian phone number (starts with 6-9).');
    }

    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (res.status === 201 && result.success) {
            showAlert('success', `Ticket ${result.data.ticketId} saved to MongoDB successfully!`);
            form.reset();
            const modalEl = document.getElementById('createIssueModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            loadDashboard();
        } else {
            const errDetails = result.errors ? result.errors.join(' | ') : result.message;
            showAlert('danger', `Failed to create issue: ${errDetails}`);
        }
    } catch (err) {
        console.error('Error creating issue:', err);
        showAlert('danger', 'Network error while contacting MongoDB server.');
    }
}

// 6. Quick Status Transition (PATCH)
async function quickStatusChange(id, newStatus) {
    try {
        const res = await authFetch(`${API_BASE}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const json = await res.json();
        if (json.success) {
            showAlert('success', `Status updated to "${newStatus}" in MongoDB.`);
            loadDashboard();
        } else {
            showAlert('danger', json.message || 'Status update failed.');
        }
    } catch (err) {
        showAlert('danger', 'Failed to update status.');
    }
}

// 7. Edit Modal Setup & Submit
function openEditModal(id) {
    const issue = currentIssues.find(i => i._id === id || i.ticketId === id);
    if (!issue) return;

    const form = document.getElementById('editIssueForm');
    form.editId.value = issue._id;
    form.editTitle.value = issue.title;
    form.editCategory.value = issue.category;
    form.editLocation.value = issue.location;
    form.editPriority.value = issue.priority;
    form.editStatus.value = issue.status;
    form.editDescription.value = issue.description;
    form.editReporterName.value = issue.reporterName;
    form.editReporterEmail.value = issue.reporterEmail;
    form.editReporterPhone.value = issue.reporterPhone || '';

    const modal = new bootstrap.Modal(document.getElementById('editIssueModal'));
    modal.show();
}

async function handleEditIssue(e) {
    e.preventDefault();
    const form = document.getElementById('editIssueForm');
    const id = form.editId.value;

    const payload = {
        title: form.editTitle.value.trim(),
        category: form.editCategory.value,
        location: form.editLocation.value.trim(),
        priority: form.editPriority.value,
        status: form.editStatus.value,
        description: form.editDescription.value.trim(),
        reporterName: form.editReporterName.value.trim(),
        reporterEmail: form.editReporterEmail.value.trim(),
        reporterPhone: form.editReporterPhone.value.trim()
    };

    try {
        const res = await authFetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (res.status === 200 && result.success) {
            showAlert('success', `Issue updated successfully in MongoDB.`);
            const modalEl = document.getElementById('editIssueModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            loadDashboard();
        } else {
            showAlert('danger', result.message || 'Update failed.');
        }
    } catch (err) {
        showAlert('danger', 'Error updating issue document.');
    }
}

// 8. Delete Confirmation & Execution
function confirmDelete(id, title) {
    deleteTargetId = id;
    document.getElementById('deleteTargetTitle').innerText = title;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

async function executeDelete() {
    if (!deleteTargetId) return;

    try {
        const res = await authFetch(`${API_BASE}/${deleteTargetId}`, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (json.success) {
            showAlert('success', `Issue document deleted from MongoDB collection.`);
            const modalEl = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            deleteTargetId = null;
            loadDashboard();
        } else {
            showAlert('danger', json.message || 'Delete operation failed.');
        }
    } catch (err) {
        showAlert('danger', 'Error during deletion.');
    }
}

// 9. Reset / Seed Sample Data
async function seedSampleData() {
    if (!confirm('This will seed the MongoDB collection with standard campus maintenance issues. Continue?')) {
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
        const json = await res.json();
        if (json.success) {
            showAlert('success', `MongoDB collection seeded with ${json.count} sample documents!`);
            loadDashboard();
        } else {
            showAlert('danger', json.message || 'Seeding failed.');
        }
    } catch (err) {
        showAlert('danger', 'Network error while seeding database.');
    }
}

// Helper: Show Dismissable Alerts
function showAlert(type, message) {
    const container = document.getElementById('alertContainer');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) alert.classList.remove('show');
    }, 5000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function setupEventListeners() {
    document.getElementById('createIssueForm').addEventListener('submit', handleCreateIssue);
    document.getElementById('editIssueForm').addEventListener('submit', handleEditIssue);
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);
    document.getElementById('seedBtn').addEventListener('click', seedSampleData);

    const roleSelector = document.getElementById('activeRoleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', () => {
            renderIssuesTable(currentIssues);
            showAlert('info', `Active RBAC role switched to <strong>${getActiveRole().toUpperCase()}</strong>`);
        });
    }

    document.getElementById('filterCategory').addEventListener('change', loadDashboard);
    document.getElementById('filterStatus').addEventListener('change', loadDashboard);
    document.getElementById('searchQuery').addEventListener('input', () => {
        clearTimeout(window._searchTimer);
        window._searchTimer = setTimeout(loadDashboard, 300);
    });
}
