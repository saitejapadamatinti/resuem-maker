import React, { useState } from 'react';

function EducationSection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.education || 'Education');

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      graduationDate: ''
    };
    onUpdate([...data, newEdu]);
  };

  const updateEducation = (id, field, value) => {
    onUpdate(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('education', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.education || 'Education');
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
            <h2>{sectionNames?.education || 'Education'}</h2>
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
      <p className="section-description">Include your degrees, certifications, and relevant coursework</p>
      
      <div id="education-list">
        {data.map((edu) => (
          <div key={edu.id} className="education-item">
            <h3>
              Education {data.indexOf(edu) + 1}
              <div className="item-actions">
                <button 
                  type="button" 
                  className="btn btn--small btn--danger" 
                  onClick={() => removeEducation(edu.id)}
                >
                  Remove
                </button>
              </div>
            </h3>
            <div className="experience-grid">
              <div className="form-group">
                <label className="form-label">Degree *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">School Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Date</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  placeholder="May 2020"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn btn--primary" onClick={addEducation}>
        + Add Education
      </button>
    </section>
  );
}

export default EducationSection;
