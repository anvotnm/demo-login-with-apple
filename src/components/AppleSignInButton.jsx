import React, { useState } from 'react';
import AppleSignin from 'react-apple-signin-auth';
import authService from '../services/authService';
import { APPLE_CONFIG } from '../config/api';
import './AppleSignInButton.css';

/**
 * Apple Sign-In Button Component (Using react-apple-signin-auth)
 * This is the recommended approach with a React library
 */
const AppleSignInButton = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAppleLogin = async (response) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Apple response:', response);

      // Prepare payload for backend
      const payload = {
        id_token: response.authorization.id_token,
        code: response.authorization.code,
        user: response.user, // Only available on first sign-in
      };

      // Send to backend
      const result = await authService.loginWithApple(payload);

      console.log('Login successful:', result);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Apple login failed:', err);
      setError(err.message || 'Failed to sign in with Apple');
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleError = (error) => {
    console.error('Apple Sign-In error:', error);
    setError('Apple Sign-In was cancelled or failed');
    
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="apple-signin-container">
      <AppleSignin
        authOptions={{
          clientId: APPLE_CONFIG.clientId,
          scope: APPLE_CONFIG.scope,
          redirectURI: APPLE_CONFIG.redirectURI,
          state: APPLE_CONFIG.state,
          nonce: APPLE_CONFIG.nonce,
          usePopup: APPLE_CONFIG.usePopup,
        }}
        onSuccess={handleAppleLogin}
        onError={handleAppleError}
        uiType="dark"
        className="apple-signin-button"
        buttonExtraChildren={
          isLoading ? (
            <span className="button-content">
              <span className="spinner"></span>
              Signing in...
            </span>
          ) : (
            'Continue with Apple'
          )
        }
      />

      {error && (
        <div className="error-message animate-fade-in">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default AppleSignInButton;
