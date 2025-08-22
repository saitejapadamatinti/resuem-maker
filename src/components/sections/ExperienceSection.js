import React, { useState } from 'react';

function ExperienceSection({ data, onUpdate }) {
  const [experienceCounter, setExperienceCounter] = useState(1);

  const addExperience = () => {
    const newExperience = {
      id: experienceCounter,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    };
    
    onUpdate([...data, newExperience]);
    setExperienceCounter(prev => prev + 1);
  };

  const updateExperience = (id, field, value) => {
    const updatedData = data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updatedData);
  };

  const updateAchievement = (expId, index, value) => {
    const updatedData = data.map(exp => {
      if (exp.id === expId) {
        const newAchievements = [...exp.achievements];
        newAchievements[index] = value;
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    });
    onUpdate(updatedData);
  };

  const addAchievement = (expId) => {
    const updatedData = data.map(exp => {
      if (exp.id === expId) {
        return { ...exp, achievements: [...exp.achievements, ''] };
      }
      return exp;
    });
    onUpdate(updatedData);
  };

  const removeAchievement = (expId, index) => {
    const updatedData = data.map(exp => {
      if (exp.id === expId) {
        const newAchievements = exp.achievements.filter((_, i) => i !== index);
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    });
    onUpdate(updatedData);
  };

  const removeExperience = (id) => {
    onUpdate(data.filter(exp => exp.id !== id));
  };

  return (
    <section className="section active">
      <h2>Work Experience</h2>
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
