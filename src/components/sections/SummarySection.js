import React, { useState } from 'react';
import RichTextEditor from '../controls/RichTextEditor';
import ATSSummaryGenerator from '../../utils/ATSSummaryGenerator';

function SummarySection({ data, onUpdate, sectionNames, onUpdateSectionNames, resumeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.summary || 'Professional Summary');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState(null);
  const [showJobDescInput, setShowJobDescInput] = useState(false);

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('summary', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.summary || 'Professional Summary');
    setIsEditingTitle(false);
  };

  const handleChange = (html) => {
    onUpdate(html);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setGenerationResults(null);

    try {
      const styles = ATSSummaryGenerator.getAvailableStyles();
      const results = {};
      
      // Generate summaries for all styles
      styles.forEach(style => {
        const result = ATSSummaryGenerator.generateATSOptimizedSummary(
          resumeData,
          jobDescription,
          style.id
        );
        results[style.id] = {
          ...result,
          styleName: style.name,
          styleDescription: style.description
        };
      });
      
      setGenerationResults(results);
      
    } catch (error) {
      console.error('Error generating summaries:', error);
      setGenerationResults({
        error: 'Failed to generate summaries. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSummary = (summary) => {
    if (summary) {
      onUpdate(summary);
      setGenerationResults(null);
    }
  };

  const textOnly = (() => {
    const temp = document.createElement('div');
    temp.innerHTML = data || '';
    return (temp.textContent || '').trim();
  })();

  return (
    <section className="section active">
      <div className="section-header-with-edit">
        {isEditingTitle ? (
          <div className="title-edit-container">
            <input
              type="text"
              className="title-edit-input"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') handleTitleCancel();
              }}
              autoFocus
            />
            <div className="title-edit-actions">
              <button 
                className="btn btn--sm btn--primary" 
                onClick={handleTitleSave}
              >
                ✓
              </button>
              <button 
                className="btn btn--sm btn--outline" 
                onClick={handleTitleCancel}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="section-title-display">
            <h2>{sectionNames?.summary || 'Professional Summary'}</h2>
            <button 
              className="btn btn--sm btn--outline title-edit-btn"
              onClick={() => setIsEditingTitle(true)}
              title="Edit section title"
            >
              ✏️
            </button>
          </div>
        )}
      </div>
      <p className="section-description">Write a compelling summary that highlights your key qualifications and experience</p>
      
      {/* ATS Summary Generator */}
      <div className="ats-generator-section">
        <div className="generator-header">
          <h3>🚀 ATS Summary Generator</h3>
          <p>Generate an ATS-optimized summary based on your resume data and job requirements</p>
        </div>
        
        <div className="generator-controls">
          <button 
            className="btn btn--outline btn--sm"
            onClick={() => setShowJobDescInput(!showJobDescInput)}
            style={{ marginBottom: '1rem' }}
          >
            {showJobDescInput ? '🔼 Hide' : '🔽 Add'} Job Description (Optional)
          </button>
          
          {showJobDescInput && (
            <div className="form-group">
              <label className="form-label">Job Description (for keyword matching)</label>
              <textarea
                className="form-control"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to optimize your summary for specific keywords..."
                rows="4"
                style={{ resize: 'vertical' }}
              />
            </div>
          )}
          

          
          <button 
            className="btn btn--primary"
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {isGenerating ? '⏳ Generating...' : '✨ Generate ATS-Optimized Summary'}
          </button>
        </div>
        
        {generationResults && (
          <div className="generation-results-container">
            {generationResults.error ? (
              <div className="generation-result error">
                <div className="error-message">
                  <h4>❌ Generation Error</h4>
                  <p>{generationResults.error}</p>
                </div>
              </div>
            ) : (
              <div className="all-summaries">
                <div className="summaries-header">
                  <h4>🎯 Generated Summaries</h4>
                  <p>Choose the style that best represents your professional profile:</p>
                </div>
                
                <div className="summaries-grid">
                  {Object.entries(generationResults).map(([styleId, result]) => (
                    <div key={styleId} className="summary-option">
                      <div className="summary-header">
                        <div className="style-info">
                          <h5>{result.styleName}</h5>
                          <p className="style-description">{result.styleDescription}</p>
                        </div>
                        <div className="ats-score">
                          <span className={`score ${result.score >= 90 ? 'excellent' : result.score >= 75 ? 'good' : 'needs-improvement'}`}>
                            {result.score}/100
                          </span>
                        </div>
                      </div>
                      
                      {result.error ? (
                        <div className="summary-error">
                          <p>{result.error}</p>
                        </div>
                      ) : (
                        <>
                          <div className="generated-summary">
                            <p>{result.summary}</p>
                          </div>
                          
                          {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                            <div className="matched-keywords">
                              <strong>Keywords:</strong> {result.matchedKeywords.slice(0, 5).join(', ')}
                              {result.matchedKeywords.length > 5 && ` +${result.matchedKeywords.length - 5} more`}
                            </div>
                          )}
                          
                          <div className="summary-actions">
                            <button 
                              className="btn btn--primary btn--sm"
                              onClick={() => handleUseSummary(result.summary)}
                            >
                              ✅ Use This Summary
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="global-actions">
                  <button 
                    className="btn btn--outline"
                    onClick={() => setGenerationResults(null)}
                  >
                    ❌ Dismiss All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="summary">Professional Summary *</label>
        <RichTextEditor 
          value={data || ''}
          onChange={handleChange}
          placeholder="Results-driven professional with X years of experience..."
        />
        <div className="char-counter">
          <span>{textOnly.length}</span> characters (Recommended: 50-150 words)
        </div>
      </div>
    </section>
  );
}

export default SummarySection;
