import React, { useState } from 'react';

function EducationSection({ data, onUpdate }) {
  const [educationCounter, setEducationCounter] = useState(1);

  const addEducation = () => {
    const newEducation = {
      id: educationCounter,
      degree: '',
      school: '',
      location: '',
      graduationDate: ''
    };
    
    onUpdate([...data, newEducation]);
    setEducationCounter(prev => prev + 1);
  };

  const updateEducation = (id, field, value) => {
    const updatedData = data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedData);
  };

  const removeEducation = (id) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  return (
    <section className="section active">
      <h2>Education</h2>
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
