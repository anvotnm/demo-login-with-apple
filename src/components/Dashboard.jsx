import React, { useEffect, useState } from 'react';
import authService from '../services/authService';
import './Dashboard.css';

/**
 * Dashboard Component
 * Displays user information after successful login
 */
const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.href = '/';
      return;
    }

    // Get user data
    const userData = authService.getCurrentUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header animate-fade-in">
          <div className="header-content">
            <h1>Welcome Back! 👋</h1>
            <button onClick={handleLogout} className="logout-button">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* User Info Card */}
        <div className="user-card animate-slide-in">
          <div className="user-card-header">
            <div className="user-avatar">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="user-info">
              <h2>{user.full_name || 'User'}</h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="user-card-body">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value">{user.id}</span>
              </div>
              
              {user.phone && (
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user.phone}</span>
                </div>
              )}

              {user.appleId && (
                <div className="info-item">
                  <span className="info-label">Apple ID</span>
                  <span className="info-value">{user.appleId}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Account Type</span>
                <span className="info-value">
                  <span className="badge badge-apple">
                    <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple Sign-In
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon feature-icon-primary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3>Secure Authentication</h3>
            <p>Your account is protected with Apple's industry-leading security</p>
          </div>

          <div className="feature-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon feature-icon-success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3>Privacy First</h3>
            <p>Your personal information is never shared without permission</p>
          </div>

          <div className="feature-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon feature-icon-accent">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Fast & Easy</h3>
            <p>Sign in with just one tap using your Apple ID</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
