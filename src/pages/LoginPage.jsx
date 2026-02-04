import React, { useState } from 'react';
import AppleSignInButton from '../components/AppleSignInButton';
import AppleSignInNative from '../components/AppleSignInNative';
import './LoginPage.css';

const LoginPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('library');

  const handleLoginSuccess = (result) => {
    console.log('Login successful:', result);
    // Reload to trigger App re-render
    window.location.reload();
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
  };

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="bg-gradient-1"></div>
      <div className="bg-gradient-2"></div>
      <div className="bg-gradient-3"></div>

      <div className="login-container">
        {/* Header */}
        <header className="login-header animate-fade-in">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </div>
          <h1>Welcome</h1>
          <p className="subtitle">Sign in with your Apple ID to continue</p>
        </header>

        {/* Login Card */}
        <div className="login-card animate-slide-in">
          {/* Method Selector */}
          <div className="method-selector">
            <button
              className={`method-button ${selectedMethod === 'library' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('library')}
            >
              <svg className="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              React Library
            </button>
            <button
              className={`method-button ${selectedMethod === 'native' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('native')}
            >
              <svg className="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Native SDK
            </button>
          </div>

          {/* Sign-In Button */}
          <div className="signin-wrapper">
            {selectedMethod === 'library' ? (
              <AppleSignInButton
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            ) : (
              <AppleSignInNative
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            )}
          </div>

          {/* Info */}
          <div className="login-info">
            <p className="info-text">
              <svg className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Secure authentication powered by Apple
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="features-list animate-fade-in">
          <div className="feature-item">
            <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Privacy protected</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Fast & secure</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>One-tap login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
