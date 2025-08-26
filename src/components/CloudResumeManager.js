import React, { useState, useEffect } from 'react';
import { authHelpers, resumeHelpers } from '../lib/supabase';

function CloudResumeManager({ isOpen, onClose, onLoadResume, currentResumeData, onSaveSuccess }) {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeName, setResumeName] = useState('My Resume');

  useEffect(() => {
    if (isOpen) {
      loadUserAndResumes();
    }
  }, [isOpen]);

  const loadUserAndResumes = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await authHelpers.getCurrentUser();
      
      if (user) {
        setUser(user);
        const { data: resumesData, error: resumesError } = await resumeHelpers.loadResumes();
        
        if (resumesError) {
          throw new Error(resumesError);
        }
        
        setResumes(resumesData || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    if (!resumeName.trim()) {
      setError('Please enter a resume name');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: saveError } = await resumeHelpers.saveResume(
        currentResumeData,
        resumeName.trim()
      );

      if (saveError) {
        throw new Error(saveError);
      }

      setSuccess('Resume saved successfully to the cloud!');
      await loadUserAndResumes(); // Refresh the list
      onSaveSuccess && onSaveSuccess();

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setError(error.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadResume = async (resume) => {
    try {
      onLoadResume(resume.data);
      setSuccess(`Loaded "${resume.name}" successfully!`);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError('Failed to load resume');
    }
  };

  const handleDeleteResume = async (resume) => {
    if (!window.confirm(`Are you sure you want to delete "${resume.name}"?`)) {
      return;
    }

    try {
      const { error: deleteError } = await resumeHelpers.deleteResume(resume.id);
      
      if (deleteError) {
        throw new Error(deleteError);
      }

      setSuccess('Resume deleted successfully');
      await loadUserAndResumes(); // Refresh the list
    } catch (error) {
      setError(error.message || 'Failed to delete resume');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal cloud-resume-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span className="cloud-icon">☁️</span>
            Cloud Resume Manager
          </h3>
          <p className="modal-subtitle">
            Save your current resume to the cloud or load a previously saved resume
          </p>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-section">
              <div className="loading-spinner large"></div>
              <p>Loading your resumes...</p>
            </div>
          ) : (
            <>
              {/* Save Current Resume Section */}
              <div className="cloud-section">
                <h4>💾 Save Current Resume</h4>
                <p className="section-description">
                  Save your current resume to the cloud for backup and access from other devices
                </p>
                
                <div className="save-resume-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="resumeName">Resume Name</label>
                    <input
                      type="text"
                      id="resumeName"
                      className="form-control"
                      placeholder="Enter a name for your resume"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  
                  <button
                    className="btn btn--success btn--lg"
                    onClick={handleSaveResume}
                    disabled={saving || !resumeName.trim()}
                  >
                    {saving ? (
                      <>
                        <span className="loading-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="save-icon">💾</span>
                        Save to Cloud
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Load Resume Section */}
              <div className="cloud-section">
                <h4>📋 Your Saved Resumes</h4>
                <p className="section-description">
                  Click on any resume to load it, or delete resumes you no longer need
                </p>

                {resumes.length > 0 ? (
                  <div className="resumes-list">
                    {resumes.map((resume) => (
                      <div key={resume.id} className="resume-item">
                        <div className="resume-info" onClick={() => handleLoadResume(resume)}>
                          <div className="resume-name">
                            <span className="resume-icon">📄</span>
                            {resume.name}
                          </div>
                          <div className="resume-meta">
                            <span className="resume-date">
                              Updated: {formatDate(resume.updated_at)}
                            </span>
                          </div>
                        </div>
                        <div className="resume-actions">
                          <button
                            className="btn btn--sm btn--primary"
                            onClick={() => handleLoadResume(resume)}
                            title="Load this resume"
                          >
                            Load
                          </button>
                          <button
                            className="btn btn--sm btn--outline"
                            onClick={() => handleDeleteResume(resume)}
                            title="Delete this resume"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-resumes">
                    <div className="empty-icon">📭</div>
                    <p>No saved resumes found</p>
                    <p className="empty-hint">
                      Save your current resume above to get started with cloud storage
                    </p>
                  </div>
                )}
              </div>

              {/* User Info Section */}
              <div className="cloud-section user-info-section">
                <h4>👤 Account Information</h4>
                <div className="user-info">
                  <div className="user-detail">
                    <span className="user-label">Email:</span>
                    <span className="user-value">{user?.email}</span>
                  </div>
                  <div className="user-detail">
                    <span className="user-label">Saved Resumes:</span>
                    <span className="user-value">{resumes.length}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="cloud-message cloud-error">
              <span className="message-icon">❌</span>
              {error}
            </div>
          )}

          {success && (
            <div className="cloud-message cloud-success">
              <span className="message-icon">✅</span>
              {success}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn--outline" onClick={onClose}>
            Close
          </button>
          {resumes.length > 0 && (
            <button 
              className="btn btn--primary" 
              onClick={() => loadUserAndResumes()}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CloudResumeManager;