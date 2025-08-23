import React, { useState } from 'react';

function WebsitesSection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.websites || 'Websites & Links');

  const addWebsite = () => {
    const newWebsite = {
      id: Date.now(),
      label: '',
      url: ''
    };
    onUpdate([...data, newWebsite]);
  };

  const updateWebsite = (id, field, value) => {
    onUpdate(data.map(website => 
      website.id === id ? { ...website, [field]: value } : website
    ));
  };

  const removeWebsite = (id) => {
    onUpdate(data.filter(website => website.id !== id));
  };

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('websites', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.websites || 'Websites & Links');
    setIsEditingTitle(false);
  };

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
            <h2>{sectionNames?.websites || 'Websites & Links'}</h2>
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
      <p className="section-description">Add links to your portfolio, LinkedIn, GitHub, and other professional profiles</p>

      <div>
        {(data || []).map((item, index) => (
          <div key={item.id} className="education-item">
            <h3>
              Link {index + 1}
              <div className="item-actions">
                <button 
                  type="button" 
                  className="btn btn--small btn--danger"
                  onClick={() => removeWebsite(item.id)}
                >
                  Remove
                </button>
              </div>
            </h3>

            <div className="experience-grid">
              <div className="form-group">
                <label className="form-label">Label</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g., Portfolio, GitHub, Personal Site"
                  value={item.label}
                  onChange={(e) => updateWebsite(item.id, 'label', e.target.value)}
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label">URL *</label>
                <input 
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => updateWebsite(item.id, 'url', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={addWebsite}>+ Add Link</button>
    </section>
  );
}

export default WebsitesSection;
