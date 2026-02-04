import React, { useState, useEffect } from 'react';
import authService from './services/authService';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import AppleCallback from './pages/AppleCallback';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/auth-customer/apple/callback" element={<AppleCallback />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <LoginPage />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
