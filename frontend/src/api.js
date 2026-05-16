// Centralised API helper — all requests go through here
// In production set REACT_APP_API_URL to your backend URL
// e.g. https://your-backend.onrender.com
const BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

function getToken() {
  return localStorage.getItem('crm_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// Auth
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name, email, password) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const getMe = () => request('/auth/me');

// Leads
export const getLeads = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined))
  ).toString();
  return request(`/leads${qs ? `?${qs}` : ''}`);
};

export const getLead = (id) => request(`/leads/${id}`);

export const createLead = (data) =>
  request('/leads', { method: 'POST', body: JSON.stringify(data) });

export const updateLead = (id, data) =>
  request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteLead = (id) =>
  request(`/leads/${id}`, { method: 'DELETE' });

export const addNote = (id, text) =>
  request(`/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ text }) });

export const deleteNote = (leadId, noteId) =>
  request(`/leads/${leadId}/notes/${noteId}`, { method: 'DELETE' });

export const getAnalytics = () => request('/leads/analytics');
