import React, { useState } from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function SummarySection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.summary || 'Professional Summary');

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
