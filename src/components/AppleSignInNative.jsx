import React, { useEffect, useState } from 'react';
import authService from '../services/authService';
import { APPLE_CONFIG } from '../config/api';
import './AppleSignInNative.css';

/**
 * Apple Sign-In Native Component (Using Apple's JS SDK directly)
 * This approach uses the native Apple JS SDK without any React wrapper
 */
const AppleSignInNative = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Apple SDK is loaded
    if (!window.AppleID) {
      console.error('Apple JS SDK not loaded');
      setError('Apple Sign-In SDK failed to load');
      return;
    }

    // Initialize Apple Sign-In
    try {
      window.AppleID.auth.init({
        clientId: APPLE_CONFIG.clientId,
        scope: APPLE_CONFIG.scope,
        redirectURI: APPLE_CONFIG.redirectURI,
        state: APPLE_CONFIG.state,
        nonce: APPLE_CONFIG.nonce,
        usePopup: APPLE_CONFIG.usePopup,
      });

      // Success handler
      const handleSuccess = async (event) => {
        setIsLoading(true);
        setError(null);

        try {
          const { authorization, user } = event.detail;

          console.log('Apple authorization:', authorization);
          console.log('Apple user:', user);

          // Prepare payload
          const payload = {
            id_token: authorization.id_token,
            code: authorization.code,
            user: user,
          };

          // Send to backend
          const result = await authService.loginWithApple(payload);

          console.log('Login successful:', result);

          // Call success callback
          if (onSuccess) {
            onSuccess(result);
          } else {
            window.location.href = '/dashboard';
          }
        } catch (err) {
          console.error('Login failed:', err);
          setError(err.message || 'Failed to sign in with Apple');
          
          if (onError) {
            onError(err);
          }
        } finally {
          setIsLoading(false);
        }
      };

      // Error handler
      const handleFailure = (event) => {
        console.error('Apple Sign-In failed:', event.detail);
        setError('Apple Sign-In was cancelled or failed');
        setIsLoading(false);
        
        if (onError) {
          onError(event.detail);
        }
      };

      // Add event listeners
      document.addEventListener('AppleIDSignInOnSuccess', handleSuccess);
      document.addEventListener('AppleIDSignInOnFailure', handleFailure);

      // Cleanup
      return () => {
        document.removeEventListener('AppleIDSignInOnSuccess', handleSuccess);
        document.removeEventListener('AppleIDSignInOnFailure', handleFailure);
      };
    } catch (err) {
      console.error('Failed to initialize Apple Sign-In:', err);
      setError('Failed to initialize Apple Sign-In');
    }
  }, [onSuccess, onError]);

  return (
    <div className="apple-signin-native-container">
      <div
        id="appleid-signin"
        className="apple-signin-native-button"
        data-color="black"
        data-border="true"
        data-type="sign in"
        data-border-radius="12"
        data-height="56"
      >
        {isLoading && (
          <div className="loading-overlay">
            <span className="spinner"></span>
          </div>
        )}
      </div>

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

export default AppleSignInNative;
