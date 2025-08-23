import React, { useState } from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function ProjectsSection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.projects || 'Projects');

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      role: '',
      link: '',
      description: ''
    };
    onUpdate([...data, newProject]);
  };

  const updateProject = (id, field, value) => {
    onUpdate(data.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id) => {
    onUpdate(data.filter(project => project.id !== id));
  };

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('projects', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.projects || 'Projects');
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
            <h2>{sectionNames?.projects || 'Projects'}</h2>
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
      <p className="section-description">Showcase your key projects and contributions</p>

      <div>
        {(data || []).map((project, index) => (
          <div key={project.id} className="education-item">
            <h3>
              Project {index + 1}
              <div className="item-actions">
                <button 
                  type="button" 
                  className="btn btn--small btn--danger"
                  onClick={() => removeProject(project.id)}
                >
                  Remove
                </button>
              </div>
            </h3>

            <div className="experience-grid">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={project.role}
                  onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Link</label>
                <input 
                  type="url" 
                  className="form-control"
                  value={project.link}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/yourrepo"
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label">Description</label>
                <RichTextEditor 
                  value={project.description}
                  onChange={(html) => updateProject(project.id, 'description', html)}
                  placeholder="Briefly describe the project, tech used, and outcomes"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={addProject}>+ Add Project</button>
    </section>
  );
}

export default ProjectsSection;
