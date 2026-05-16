import React, { useState } from 'react';
import { useAuth } from '../App';
import LeadsPage from './LeadsPage';
import AnalyticsPage from './AnalyticsPage';
import AddLeadPage from './AddLeadPage';
import './DashboardLayout.css';

const NAV = [
  { id: 'leads',     label: 'Leads',     icon: '👥' },
  { id: 'add',       label: 'Add Lead',  icon: '➕' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState('leads');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'leads':     return <LeadsPage />;
      case 'add':       return <AddLeadPage onSaved={() => setPage('leads')} />;
      case 'analytics': return <AnalyticsPage />;
      default:          return <LeadsPage />;
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">CRM</div>
          <span>Mini CRM</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => { setPage(item.id); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="main">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h2 className="page-title">
            {NAV.find((n) => n.id === page)?.label}
          </h2>
        </header>

        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}
