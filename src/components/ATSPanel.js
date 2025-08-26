import React from 'react';
import { applicationData } from '../data/applicationData';

function ATSPanel({ resumeData, currentStep }) {
  const getPlain = (html) => {
    const el = document.createElement('div');
    el.innerHTML = html || '';
    return (el.textContent || '').trim();
  };

  const calculateATSScore = () => {
    let score = 15; // Enhanced base score
    const maxScore = 100;
    
    // Contact info (20 points - more generous)
    const requiredContacts = ['fullName', 'email', 'phone', 'location'];
    const filledContacts = requiredContacts.filter(field => resumeData.contact[field]?.trim()).length;
    score += (filledContacts / requiredContacts.length) * 20;
    
    // Summary (15 points - enhanced scoring) - strip HTML
    const summaryLen = getPlain(resumeData.summary).length;
    if (summaryLen > 50) score += 15;
    else if (summaryLen > 30) score += 12;
    else if (summaryLen > 10) score += 8;
    
    // Experience (25 points - enhanced)
    if (resumeData.experience.length > 0) {
      score += 10; // Base points for having experience
      const hasQuantifiableResults = resumeData.experience.some(exp => 
        exp.achievements && exp.achievements.some(achievement => /\d+/.test(achievement))
      );
      if (hasQuantifiableResults) score += 15; // Bonus for quantifiable results
      
      // Additional bonus for multiple experience entries
      if (resumeData.experience.length >= 2) score += 3;
      if (resumeData.experience.length >= 3) score += 2;
    }
    
    // Education (10 points - enhanced)
    if (resumeData.education.length > 0) {
      score += 10;
      if (resumeData.education.length >= 2) score += 2; // Bonus for multiple entries
    }

    // Projects (10 points - enhanced)
    if (resumeData.projects && resumeData.projects.length > 0) {
      score += 10;
      if (resumeData.projects.length >= 2) score += 3; // Bonus for multiple projects
    }
    
    // Skills (20 points - more generous)
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.other.length;
    if (totalSkills >= 8) score += 20;
    else if (totalSkills >= 5) score += 18;
    else if (totalSkills >= 3) score += 15;
    else if (totalSkills >= 1) score += 10;
    
    // Skill diversity bonus
    if (resumeData.skills.technical.length > 0 && resumeData.skills.soft.length > 0) score += 3;
    if (resumeData.skills.other.length > 0) score += 2;
    
    // Additional comprehensive data bonuses
    if (resumeData.contact.linkedIn) score += 3; // LinkedIn profile
    if (resumeData.websites && resumeData.websites.length > 0) score += 2; // Professional websites
    
    // Company recognition bonus
    const hasMultipleCompanies = resumeData.experience.length > 1;
    if (hasMultipleCompanies) score += 2;
    
    // Date completeness bonus
    const hasCompleteDates = resumeData.experience.every(exp => exp.startDate && exp.endDate);
    if (hasCompleteDates && resumeData.experience.length > 0) score += 3;
    
    // Format compliance (5 points - standard)
    score += 5; 
    
    return Math.min(Math.round(score), maxScore);
  };

  const getATSTips = () => {
    const tips = [];
    
    if (!resumeData.contact.fullName) tips.push("Add your full name");
    if (!resumeData.contact.email) tips.push("Add your email address");
    if (!resumeData.contact.phone) tips.push("Add your phone number");
    if (!resumeData.contact.location) tips.push("Add your location (city, state)");
    if (!resumeData.contact.linkedIn) tips.push("Add your LinkedIn profile for better visibility");
    
    if (!getPlain(resumeData.summary) || getPlain(resumeData.summary).length < 50) {
      tips.push("Write a compelling professional summary (50+ characters)");
    }
    
    if (resumeData.experience.length === 0) {
      tips.push("Add your work experience with specific achievements");
    } else {
      const hasQuantifiableResults = resumeData.experience.some(exp => 
        exp.achievements && exp.achievements.some(achievement => /\d+/.test(achievement))
      );
      if (!hasQuantifiableResults) {
        tips.push("Include quantifiable results (numbers, percentages, metrics)");
      }
    }
    
    if (resumeData.education.length === 0) {
      tips.push("Add your education background");
    }
    
    if (!resumeData.projects || resumeData.projects.length === 0) {
      tips.push("Add 1-3 relevant projects showcasing your skills");
    }
    
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.other.length;
    if (totalSkills < 5) {
      tips.push("Add more relevant skills (aim for 8-12 total)");
    }
    
    if (totalSkills < 8) {
      tips.push("Consider adding both technical and soft skills");
    }
    
    // Add specific ATS optimization tips based on user's data
    if (score >= 90) {
      tips.push("✅ Excellent! Your resume is well-optimized for ATS");
    } else if (score >= 75) {
      tips.push("🚀 Almost perfect! Consider using the ATS Summary Generator");
    } else {
      tips.push("🎯 Try the ATS Summary Generator to improve your score");
    }
    
    return tips;
  };

  const score = calculateATSScore();
  const tips = getATSTips();

  const getScoreColor = () => {
    if (score >= 90) return 'var(--color-success)';
    if (score >= 75) return '#4F46E5'; // Blue for good scores
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getScoreMessage = () => {
    if (score >= 90) return '🎉 Excellent! ATS-optimized';
    if (score >= 75) return '🚀 Great! Almost there';
    if (score >= 60) return '💪 Getting better';
    return '🎯 Needs improvement';
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
        <div className="score-message" style={{ color: getScoreColor(), marginTop: '8px', fontWeight: '500', textAlign: 'center' }}>
          {getScoreMessage()}
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
        <h3>Your Skills</h3>
        <div>
          {resumeData.skills.technical.slice(0, 8).map(keyword => (
            <div key={keyword} className="keyword-tag">
              {keyword}
            </div>
          ))}
          {resumeData.skills.soft.slice(0, 4).map(keyword => (
            <div key={keyword} className="keyword-tag">
              {keyword}
            </div>
          ))}
          {(resumeData.skills.technical.length + resumeData.skills.soft.length === 0) && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
              Add skills in the Skills section to see them here
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ATSPanel;
