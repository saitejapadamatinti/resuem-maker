import React, { useState } from 'react';

function ATSOptimizationGuide({ resumeData, onNavigateToSection }) {
  const [activeTab, setActiveTab] = useState('keywords');

  const missingContactFields = [];
  if (!resumeData.contact?.phone) missingContactFields.push('Phone number');
  if (!resumeData.contact?.email) missingContactFields.push('Email address');
  if (!resumeData.contact?.location) missingContactFields.push('City, State');
  if (!resumeData.contact?.linkedIn) missingContactFields.push('LinkedIn URL');

  const missingSections = [];
  if (!resumeData.experience?.length) missingSections.push('Work Experience');
  if (!resumeData.education?.length) missingSections.push('Education');
  if (!resumeData.skills?.technical?.length && !resumeData.skills?.soft?.length) missingSections.push('Skills');

  const keywordSuggestions = {
    hardSkills: [
      'Frontend Development',
      'Responsive Web Design',
      'Back-End Web Development',
      'Web Development',
      'Software Development principles',
      'JavaScript',
      'React',
      'HTML/CSS',
      'Modern Web Technologies',
      'User Interface Components',
      'Optimizing Applications',
      'Maximum Speed',
      'Scalability',
      'Technical Feasibility'
    ],
    softSkills: [
      'Problem-solving skills',
      'Attention to detail',
      'Ability to work independently',
      'Remote work capability',
      'Collaboration',
      'Communication',
      'Leadership',
      'Time management',
      'Analytical thinking',
      'Adaptability'
    ],
    otherKeywords: [
      'User interface components',
      'Modern web technologies',
      'Collaborating with designers',
      'Collaborating with backend developers',
      'Creating responsive web designs',
      'Optimizing applications',
      'UI/UX designs',
      'Healthcare industry experience',
      'Cross-functional collaboration',
      'Technical feasibility assessment'
    ]
  };

  const renderKeywordsTab = () => (
    <div className="ats-guide-content">
      <h3>Missing Keywords by Category</h3>
      
      <div className="keyword-category">
        <h4 className="high-impact">🔴 Hard Skills (High Impact - 0%)</h4>
        <p>Add these technical skills to your Skills section:</p>
        <div className="keyword-grid">
          {keywordSuggestions.hardSkills.map((skill, index) => (
            <span key={index} className="keyword-tag technical">{skill}</span>
          ))}
        </div>
      </div>

      <div className="keyword-category">
        <h4 className="low-impact">🟡 Soft Skills (Low Impact - 0%)</h4>
        <p>Include these in your Skills section and experience descriptions:</p>
        <div className="keyword-grid">
          {keywordSuggestions.softSkills.map((skill, index) => (
            <span key={index} className="keyword-tag soft">{skill}</span>
          ))}
        </div>
      </div>

      <div className="keyword-category">
        <h4 className="medium-impact">🟠 Other Keywords (Medium Impact - 0%)</h4>
        <p>Incorporate these phrases in your experience descriptions:</p>
        <div className="keyword-grid">
          {keywordSuggestions.otherKeywords.map((keyword, index) => (
            <span key={index} className="keyword-tag other">{keyword}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionsTab = () => (
    <div className="ats-guide-content">
      <h3>Missing Resume Sections</h3>
      
      {missingContactFields.length > 0 && (
        <div className="missing-section">
          <h4>📞 Contact Details</h4>
          <p>Missing: {missingContactFields.join(', ')}</p>
          <button 
            className="guide-button"
            onClick={() => onNavigateToSection('contact')}
          >
            Complete Contact Info
          </button>
        </div>
      )}

      {missingSections.includes('Work Experience') && (
        <div className="missing-section">
          <h4>💼 Work Experience</h4>
          <p>Add your work history with quantifiable achievements</p>
          <button 
            className="guide-button"
            onClick={() => onNavigateToSection('experience')}
          >
            Add Experience
          </button>
        </div>
      )}

      {missingSections.includes('Education') && (
        <div className="missing-section">
          <h4>🎓 Education</h4>
          <p>Include degree in Computer Science or Information Technology</p>
          <button 
            className="guide-button"
            onClick={() => onNavigateToSection('education')}
          >
            Add Education
          </button>
        </div>
      )}

      {missingSections.includes('Skills') && (
        <div className="missing-section">
          <h4>🛠️ Skills</h4>
          <p>Add technical and soft skills relevant to the job</p>
          <button 
            className="guide-button"
            onClick={() => onNavigateToSection('skills')}
          >
            Add Skills
          </button>
        </div>
      )}
    </div>
  );

  const renderOptimizationTab = () => (
    <div className="ats-guide-content">
      <h3>ATS Optimization Steps</h3>
      
      <div className="optimization-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Complete All Sections</h4>
            <p>Fill out Contact, Experience, Education, and Skills sections with real data</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Add Target Job Description</h4>
            <p>Go to Summary section and paste the job description you're applying for</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Generate ATS Summary</h4>
            <p>Use the ATS Summary Generator to create optimized summaries</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h4>Include Quantifiable Achievements</h4>
            <p>Add numbers, percentages, and dollar amounts to your experience</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h4>Match Job Title</h4>
            <p>Ensure your target job title appears in your experience or summary</p>
          </div>
        </div>
      </div>

      <div className="ats-tips">
        <h4>Pro Tips for 90+ ATS Score:</h4>
        <ul>
          <li>Use exact keywords from the job description</li>
          <li>Include industry-specific terminology</li>
          <li>Add measurable achievements (increased X by Y%)</li>
          <li>Match the job title in your experience or summary</li>
          <li>Include relevant technical certifications</li>
          <li>Use standard section headings (Experience, Education, Skills)</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="ats-optimization-guide">
      <div className="guide-header">
        <h2>🎯 ATS Optimization Guide</h2>
        <p>Complete guide to improve your ATS score from 0% to 90+</p>
      </div>

      <div className="guide-tabs">
        <button 
          className={`tab-button ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Missing Keywords
        </button>
        <button 
          className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          Missing Sections
        </button>
        <button 
          className={`tab-button ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          Optimization Steps
        </button>
      </div>

      <div className="guide-content">
        {activeTab === 'keywords' && renderKeywordsTab()}
        {activeTab === 'sections' && renderSectionsTab()}
        {activeTab === 'optimization' && renderOptimizationTab()}
      </div>
    </div>
  );
}

export default ATSOptimizationGuide;