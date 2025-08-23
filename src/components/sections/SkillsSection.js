import React, { useState } from 'react';
import { applicationData } from '../../data/applicationData';

function SkillsSection({ data, onUpdate, sectionNames, onUpdateSectionNames }) {
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(sectionNames?.skills || 'Skills');

  const extraSkills = [
    "JavaScript","TypeScript","Python","Java","C","C++","C#","Go","Rust","Ruby","PHP","Swift","Kotlin","R","MATLAB",
    "HTML","CSS","Sass","LESS","React.js","Next.js","Angular","Vue.js","Node.js","Express.js","Django","Flask","Ruby on Rails",
    "MySQL","PostgreSQL","MongoDB","SQLite","Redis","Oracle DB","Firebase","DynamoDB",
    "AWS","Azure","Google Cloud","Docker","Kubernetes","CI/CD","Terraform","Ansible","Jenkins","Git",
    "React Native","Flutter","Swift","Kotlin","Android Studio","Xcode",
    "Visual Studio Code","IntelliJ IDEA","Eclipse","Postman","Figma","Adobe XD","GitHub","GitLab","Jira","Confluence","Slack","Trello",
    "SQL","NoSQL","Pandas","NumPy","TensorFlow","PyTorch","Power BI","Tableau","Excel","Data Visualization","Machine Learning","Artificial Intelligence","Big Data",
    "TCP/IP","HTTP/HTTPS","DNS","Firewall","VPN","Cybersecurity","Ethical Hacking","Penetration Testing","Network Administration",
    "AWS EC2","S3","Lambda","Azure Functions","Google Cloud Functions","Serverless Architecture",
    "Blockchain","IoT","AR/VR","Quantum Computing","Robotics","API Development","REST API","GraphQL",
    "Problem Solving","Critical Thinking","Teamwork","Communication Skills","Time Management","Adaptability","Leadership","Creativity","Attention to Detail","Project Management","Analytical Skills","Customer Service","Collaboration","Decision Making","Conflict Resolution"
  ];

  const allSkills = Array.from(new Set([
    ...applicationData.commonKeywords.skills,
    ...applicationData.commonKeywords.technical,
    ...applicationData.commonKeywords.soft,
    ...extraSkills
  ]));

  const handleSkillInput = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput.trim());
      setSkillInput('');
      setShowSuggestions(false);
    }
  };

  const addSkill = (skillName) => {
    if (!skillName) return;
    
    // Determine skill category
    let category = 'other';
    if (applicationData.commonKeywords.technical.includes(skillName)) {
      category = 'technical';
    } else if (applicationData.commonKeywords.soft.includes(skillName)) {
      category = 'soft';
    }
    
    // Check if skill already exists
    const allSkills = [...data.technical, ...data.soft, ...data.other];
    if (allSkills.includes(skillName)) return;
    
    const updatedSkills = {
      ...data,
      [category]: [...data[category], skillName]
    };
    onUpdate(updatedSkills);
  };

  const removeSkill = (skillName, category) => {
    const updatedSkills = {
      ...data,
      [category]: data[category].filter(skill => skill !== skillName)
    };
    onUpdate(updatedSkills);
  };

  const getFilteredSuggestions = () => {
    const query = skillInput.toLowerCase();
    return allSkills.filter(skill => 
      skill.toLowerCase().includes(query) && query.length > 0
    ).slice(0, 5);
  };

  const handleSuggestionClick = (skill) => {
    addSkill(skill);
    setSkillInput('');
    setShowSuggestions(false);
  };

  const handleTitleSave = () => {
    if (onUpdateSectionNames && editingTitle.trim()) {
      onUpdateSectionNames('skills', editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(sectionNames?.skills || 'Skills');
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
            <h2>{sectionNames?.skills || 'Skills'}</h2>
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
      <p className="section-description">List both technical and soft skills relevant to your target role</p>
      
      <div className="skills-input-group">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Type a skill and press Enter"
          value={skillInput}
          onChange={handleSkillInput}
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && (
          <div className="skill-suggestions show">
            {getFilteredSuggestions().map(skill => (
              <div 
                key={skill} 
                className="skill-suggestion"
                onClick={() => handleSuggestionClick(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="skills-container">
        <div className="skill-category">
          <h3>Technical Skills</h3>
          <div className="skills-tags">
            {data.technical.map(skill => (
              <div key={skill} className="skill-tag">
                {skill}
                <button 
                  onClick={() => removeSkill(skill, 'technical')} 
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="skill-category">
          <h3>Soft Skills</h3>
          <div className="skills-tags">
            {data.soft.map(skill => (
              <div key={skill} className="skill-tag">
                {skill}
                <button 
                  onClick={() => removeSkill(skill, 'soft')} 
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="skill-category">
          <h3>Other Skills</h3>
          <div className="skills-tags">
            {data.other.map(skill => (
              <div key={skill} className="skill-tag">
                {skill}
                <button 
                  onClick={() => removeSkill(skill, 'other')} 
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
