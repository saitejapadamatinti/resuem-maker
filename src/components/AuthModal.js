import React, { useState } from 'react';
import { authHelpers } from '../lib/supabase';

function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setError('');
    setSuccess('');
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        setError('Full name is required');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'signup') {
        result = await authHelpers.signUp(
          formData.email,
          formData.password,
          {
            full_name: formData.fullName,
            display_name: formData.fullName
          }
        );
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setTimeout(() => {
          onSuccess && onSuccess(result.data);
          handleModeSwitch('signin');
        }, 2000);
        
      } else {
        result = await authHelpers.signIn(formData.email, formData.password);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setSuccess('Signed in successfully!');
        setTimeout(() => {
          onSuccess && onSuccess(result.data);
          onClose();
        }, 1000);
      }
      
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span className="auth-icon">🔐</span>
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h3>
          <p className="modal-subtitle">
            {mode === 'signin' 
              ? 'Access your saved resumes from anywhere' 
              : 'Save your resumes to the cloud and access them anywhere'
            }
          </p>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder={mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {error && (
              <div className="auth-message auth-error">
                <span className="message-icon">❌</span>
                {error}
              </div>
            )}

            {success && (
              <div className="auth-message auth-success">
                <span className="message-icon">✅</span>
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn--primary btn--full-width btn--lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <span className="auth-btn-icon">
                    {mode === 'signin' ? '🚀' : '✨'}
                  </span>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-switch">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="auth-link" 
                  onClick={() => handleModeSwitch('signup')}
                  disabled={loading}
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="auth-link" 
                  onClick={() => handleModeSwitch('signin')}
                  disabled={loading}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="auth-benefits">
              <h4>✨ Benefits of Creating an Account:</h4>
              <ul>
                <li>🔄 Sync resumes across all your devices</li>
                <li>☁️ Secure cloud backup of all your data</li>
                <li>📱 Access your resumes from anywhere</li>
                <li>🎯 Never lose your work again</li>
                <li>🚀 Future premium features</li>
              </ul>
            </div>
          )}

          <div className="auth-security">
            <p className="security-note">
              🔒 Your data is encrypted and secure. We never share your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;