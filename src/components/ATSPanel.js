import React from 'react';
import { applicationData } from '../data/applicationData';

function ATSPanel({ resumeData, currentStep }) {
  const getPlain = (html) => {
    const el = document.createElement('div');
    el.innerHTML = html || '';
    return (el.textContent || '').trim();
  };

  const calculateATSScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Contact info (20 points)
    const requiredContacts = ['fullName', 'email', 'phone', 'location'];
    const filledContacts = requiredContacts.filter(field => resumeData.contact[field]?.trim()).length;
    score += (filledContacts / requiredContacts.length) * 20;
    
    // Summary (12 points) - strip HTML
    const summaryLen = getPlain(resumeData.summary).length;
    if (summaryLen > 50) score += 12;
    else if (summaryLen > 20) score += 8;
    
    // Experience (22 points)
    if (resumeData.experience.length > 0) {
      score += 8;
      const hasQuantifiableResults = resumeData.experience.some(exp => 
        exp.achievements && exp.achievements.some(achievement => /\d+/.test(achievement))
      );
      if (hasQuantifiableResults) score += 14;
    }
    
    // Education (8 points)
    if (resumeData.education.length > 0) score += 8;

    // Projects (8 points)
    if (resumeData.projects && resumeData.projects.length > 0) score += 8;
    
    // Skills (20 points)
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.other.length;
    if (totalSkills >= 5) score += 20;
    else if (totalSkills >= 3) score += 15;
    else if (totalSkills >= 1) score += 10;
    
    // Format compliance (10 points)
    score += 10; 
    
    return Math.min(Math.round(score), maxScore);
  };

  const getATSTips = () => {
    const tips = [];
    
    if (!resumeData.contact.fullName) tips.push("Add your full name");
    if (!resumeData.contact.email) tips.push("Add your email address");
    if (!resumeData.contact.phone) tips.push("Add your phone number");
    if (!getPlain(resumeData.summary) || getPlain(resumeData.summary).length < 50) tips.push("Write a compelling professional summary");
    if (resumeData.experience.length === 0) tips.push("Add your work experience");
    if (resumeData.education.length === 0) tips.push("Add your education background");
    if (!resumeData.projects || resumeData.projects.length === 0) tips.push("Add 1-3 relevant projects showcasing impact and tech stack");
    
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.other.length;
    if (totalSkills < 5) tips.push("Add more relevant skills (aim for 5-10)");
    
    const hasQuantifiableResults = resumeData.experience.some(exp => 
      exp.achievements && exp.achievements.some(achievement => /\d+/.test(achievement))
    );
    if (!hasQuantifiableResults && resumeData.experience.length > 0) {
      tips.push("Include quantifiable results in your achievements (numbers, percentages, etc.)");
    }
    
    tips.push(...applicationData.atsOptimizationTips.slice(0, 3));
    
    return tips;
  };

  const score = calculateATSScore();
  const tips = getATSTips();

  const getScoreColor = () => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <aside className="ats-panel">
      <div className="ats-score">
        <h3>ATS Score</h3>
        <div 
          className="score-circle"
          style={{ background: getScoreColor() }}
        >
          <span className="score-value">{score}</span>
          <span className="score-label">/100</span>
        </div>
      </div>
      
      <div className="optimization-tips">
        <h3>Optimization Tips</h3>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
      
      <div className="keyword-suggestions">
        <h3>Suggested Keywords</h3>
        <div>
          {applicationData.commonKeywords.skills.slice(0, 8).map(keyword => (
            <div key={keyword} className="keyword-tag">
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default ATSPanel;
