import React, { useState } from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function ProjectsSection({ data, onUpdate }) {
  const [projectCounter, setProjectCounter] = useState(1);

  const addProject = () => {
    const newProject = {
      id: projectCounter,
      name: '',
      role: '',
      link: '',
      description: ''
    };
    onUpdate([...(data || []), newProject]);
    setProjectCounter(prev => prev + 1);
  };

  const updateProject = (id, field, value) => {
    const updated = (data || []).map(p => p.id === id ? { ...p, [field]: value } : p);
    onUpdate(updated);
  };

  const removeProject = (id) => {
    onUpdate((data || []).filter(p => p.id !== id));
  };

  return (
    <section className="section active">
      <h2>Projects</h2>
      <p className="section-description">Showcase notable projects relevant to your target role</p>

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
