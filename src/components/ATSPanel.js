import React, { useMemo } from 'react';

const stripHtml = value => {
  if (!value) return '';
  const node = document.createElement('div');
  node.innerHTML = value;
  return (node.textContent || '').trim();
};

function ATSPanel({ resumeData = {} }) {
  const checks = useMemo(() => {
    const contact = resumeData.contact || {};
    const skills = resumeData.skills || {};
    const experiences = resumeData.experience || [];
    const totalSkills = [...(skills.technical || []), ...(skills.soft || []), ...(skills.other || [])].filter(Boolean).length;
    const summary = stripHtml(resumeData.summary);
    return [
      { label: 'Name and contact details', done: Boolean(contact.fullName && contact.email && contact.phone) },
      { label: 'Professional summary', done: summary.length >= 40 },
      { label: 'Work experience', done: experiences.length > 0 },
      { label: 'Measurable achievements', done: experiences.some(item => (item.achievements || []).some(line => /\d/.test(line))) },
      { label: 'Education', done: Boolean(resumeData.education?.length) },
      { label: 'Relevant skills', done: totalSkills >= 5 },
      { label: 'Projects', done: Boolean(resumeData.projects?.length) },
      { label: 'Professional links', done: Boolean(contact.linkedIn || resumeData.websites?.length) }
    ];
  }, [resumeData]);

  const score = Math.round(checks.filter(item => item.done).length / checks.length * 100);
  const next = checks.find(item => !item.done);
  const color = score >= 80 ? 'var(--color-success)' : score >= 55 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <aside className="ats-panel">
      <div className="ats-score">
        <p className="eyebrow">LIVE FEEDBACK</p>
        <h3>Resume readiness</h3>
        <div className="score-circle" style={{ background: color }}><span className="score-value">{score}</span><span className="score-label">/100</span></div>
        <p className="score-message">{score >= 80 ? 'Strong foundation' : score >= 55 ? 'Good progress' : 'Room to improve'}</p>
      </div>
      <div className="optimization-tips">
        <h3>Quality checklist</h3>
        <ul className="readiness-list">{checks.map(item => <li key={item.label}><span className={item.done ? 'readiness-check done' : 'readiness-check'}>{item.done ? '✓' : '○'}</span>{item.label}</li>)}</ul>
        {next && <p className="next-step-tip"><strong>Next improvement</strong><br />{next.label}</p>}
      </div>
      <div className="keyword-suggestions">
        <h3>Top skills</h3>
        <div>{(resumeData.skills?.technical || []).slice(0, 8).map((keyword, index) => <span key={keyword + index} className="keyword-tag">{keyword}</span>)}</div>
      </div>
      <p className="ats-disclaimer">Indicative checklist only. No score can guarantee an ATS pass or interview.</p>
    </aside>
  );
}

export default ATSPanel;
