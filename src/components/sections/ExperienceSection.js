import React, { useState } from 'react';

function ExperienceSection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.experience || 'Work Experience');

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: []
    };
    onUpdate([...data, newExp]);
  };

  const updateExperience = (id, field, value) => {
    onUpdate(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (expId) => {
    onUpdate(data.map(exp => 
      exp.id === expId 
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    ));
  };

  const updateAchievement = (expId, index, value) => {
    onUpdate(data.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            achievements: exp.achievements.map((achievement, i) => 
              i === index ? value : achievement
            )
          }
        : exp
    ));
  };

  const removeAchievement = (expId, index) => {
    onUpdate(data.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            achievements: exp.achievements.filter((_, i) => i !== index)
          }
        : exp
    ));
  };

  const removeExperience = (id) => {
    onUpdate(data.filter(exp => exp.id !== id));
  };

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('experience', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.experience || 'Work Experience');
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
            <h2>{sectionNames?.experience || 'Work Experience'}</h2>
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
      <p className="section-description">List your work history in reverse chronological order</p>
      
      <div id="experience-list">
        {data.map((exp) => (
          <div key={exp.id} className="experience-item">
            <h3>
              Work Experience {data.indexOf(exp) + 1}
              <div className="item-actions">
                <button 
                  type="button" 
                  className="btn btn--small btn--danger" 
                  onClick={() => removeExperience(exp.id)}
                >
                  Remove
                </button>
              </div>
            </h3>
            <div className="experience-grid">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="Jan 2020" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  placeholder="Present"
                />
              </div>
            </div>
            <div className="achievement-list">
              <label className="form-label">Key Achievements</label>
              <div>
                {exp.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={achievement}
                      onChange={(e) => updateAchievement(exp.id, index, e.target.value)}
                      placeholder="Describe a key achievement with quantifiable results..."
                    />
                    <button 
                      type="button" 
                      className="btn btn--small btn--danger" 
                      onClick={() => removeAchievement(exp.id, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn--small btn--outline" 
                  onClick={() => addAchievement(exp.id)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn btn--primary" onClick={addExperience}>
        + Add Experience
      </button>
    </section>
  );
}

export default ExperienceSection;
