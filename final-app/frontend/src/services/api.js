/**
 * ==============================================================================
 * FixIt — Final Full-Stack Application
 * Frontend API Service Layer with RBAC Integration
 * ==============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3002' 
    ? 'http://localhost:5000/api' 
    : '/api');

// Retrieve active auth session from localStorage
export function getActiveUser() {
  try {
    const raw = localStorage.getItem('fixit_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Default student session
  return {
    id: "USR-001",
    name: "Harsh Bhanarkar (Student)",
    email: "student@campus.edu",
    role: "student",
    department: "Software Engineering",
    permissions: {
      canView: true,
      canCreate: true,
      canUpdateStatus: false,
      canDelete: false
    }
  };
}

export function getAuthToken() {
  return localStorage.getItem('fixit_token') || '';
}

export function setActiveUser(user, token) {
  if (user) localStorage.setItem('fixit_user', JSON.stringify(user));
  if (token) localStorage.setItem('fixit_token', token);
}

// Helper to build headers with Authorization & Role
function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  const user = getActiveUser();
  const headers = {
    ...extraHeaders
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (user && user.role) {
    headers['x-user-role'] = user.role;
  }
  return headers;
}

// Auth API Calls
export async function login(roleOrEmail, password = 'password123') {
  const isRole = ['student', 'staff', 'admin'].includes(roleOrEmail.toLowerCase());
  const payload = isRole ? { role: roleOrEmail.toLowerCase(), password } : { email: roleOrEmail, password };

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  setActiveUser(data.user, data.token);
  return data;
}

export async function switchRole(role) {
  const response = await fetch(`${API_BASE_URL}/auth/switch-role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Role switch failed');
  }

  setActiveUser(data.user, data.token);
  return data;
}

export async function getRoleMatrix() {
  const response = await fetch(`${API_BASE_URL}/auth/roles`);
  if (!response.ok) throw new Error('Failed to load RBAC permissions');
  return await response.json();
}

// Issue CRUD API Calls (Authenticated with RBAC Headers)
export async function getIssues(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/issues${queryString}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch issues (${response.status})`);
  }

  return await response.json();
}

export async function getStatistics() {
  const response = await fetch(`${API_BASE_URL}/statistics`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch statistics (${response.status})`);
  }
  return await response.json();
}

export async function createIssue(issueData) {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(issueData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors.join(' ')) || 'Failed to submit issue');
  }

  return data;
}

export async function updateIssueStatus(issueId, status) {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || `Failed to update status for ${issueId}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function deleteIssue(issueId) {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || `Failed to delete ticket ${issueId}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}
