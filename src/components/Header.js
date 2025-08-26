import React, { useRef, useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { authHelpers } from '../lib/supabase';

function Header({ theme = 'classic', onChangeTheme, onImportResume, onImportPdf, authKey = 'auto' }) {
  const fileInputRef = useRef(null);
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authLoading, setAuthLoading] = useState(true);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await authHelpers.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user in header:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Determine if auth buttons should be shown based on authKey
  const shouldShowAuth = () => {
    if (authKey === 'always') return true;
    if (authKey === 'never') return false;
    if (authKey === 'guest-only') return !user;
    if (authKey === 'user-only') return !!user;
    // Default 'auto' behavior: show auth options when appropriate
    return true;
  };
  
  // Authentication handlers
  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      await authHelpers.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData?.user);
    setIsAuthModalOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const handleImportClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const buf = await file.arrayBuffer();
        onImportPdf && onImportPdf(buf);
      } else {
        const text = await file.text();
        const json = JSON.parse(text);
        onImportResume && onImportResume(json);
      }
    } catch (err) {
      console.error('Import failed', err);
      alert('Import failed. Please provide a valid JSON or PDF resume.');
    } finally {
      e.target.value = '';
    }
  };
  return (
    <header className="app-header">
      <div className="container header-bar">
        <div className="header-left">
          <div className="logo-mark">sai</div>
        </div>
        <div className="header-center">
          <h1 className="app-title">ATS Resume Builder</h1>
        </div>
        <div className="header-right">
          {shouldShowAuth() && (
            <div className="auth-section">
              {authLoading ? (
                <div className="auth-loading">
                  <span className="loading-spinner"></span>
                  <span className="loading-text">Loading...</span>
                </div>
              ) : user ? (
                <div className="user-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.user_metadata?.full_name ? 
                        user.user_metadata.full_name.charAt(0).toUpperCase() : 
                        user.email.charAt(0).toUpperCase()
                      }
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {user.user_metadata?.full_name || 'User'}
                      </div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    className="btn btn--outline btn--sm sign-out-btn"
                    onClick={handleSignOut}
                    title="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button 
                    className="btn btn--outline auth-btn"
                    onClick={() => openAuthModal('signin')}
                  >
                    <span className="auth-icon">🔐</span>
                    Sign In
                  </button>
                  <button 
                    className="btn btn--primary auth-btn signup-btn"
                    onClick={() => openAuthModal('signup')}
                  >
                    <span className="auth-icon">✨</span>
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
          
          <input 
            ref={fileInputRef}
            type="file"
            accept="application/json,application/pdf,.json,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <select className="form-control" value={theme} onChange={(e) => {
            console.log('Theme changed in Header to:', e.target.value);
            onChangeTheme && onChangeTheme(e.target.value);
          }}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="compact">Compact</option>
            <option value="professional">Professional</option>
            <option value="twocol">Two Column</option>
          </select>
          <button className="btn btn--outline" onClick={handleImportClick}>Import JSON/PDF</button>
        </div>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </header>
  );
}

export default Header;
