import React, { useMemo, useState } from 'react';

const STOP_WORDS = new Set(['the','and','for','with','you','your','our','are','this','that','will','from','have','has','who','what','their','they','them','into','our','about','years','year','work','role','team','ability','strong','good','excellent','experience','looking','required','preferred','using','use','skills','skill']);

function tokenize(value = '') {
  return (value.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g) || [])
    .filter(word => !STOP_WORDS.has(word));
}

function ATSOptimizationGuide({ resumeData = {}, onNavigateToSection = () => {} }) {
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('match');
  const [showAll, setShowAll] = useState(false);

  const resumeText = useMemo(() => {
    const parts = [
      resumeData.contact?.fullName, resumeData.contact?.email, resumeData.contact?.phone,
      resumeData.contact?.location, resumeData.summary,
      ...(resumeData.experience || []).flatMap(item => [item.title, item.company, item.location, ...(item.achievements || [])]),
      ...(resumeData.education || []).flatMap(item => [item.degree, item.school, item.location]),
      ...(resumeData.projects || []).flatMap(item => [item.name, item.role, item.description]),
      ...Object.values(resumeData.skills || {}).flat()
    ];
    return parts.filter(Boolean).join(' ').replace(/<[^>]*>/g, ' ').toLowerCase();
  }, [resumeData]);

  const analysis = useMemo(() => {
    const terms = [...new Set(tokenize(jobDescription))];
    const matched = terms.filter(term => resumeText.includes(term));
    const missing = terms.filter(term => !resumeText.includes(term));
    const score = terms.length ? Math.round((matched.length / terms.length) * 100) : 0;
    return { terms, matched, missing, score };
  }, [jobDescription, resumeText]);

  const checks = [
    { label: 'Full name', ok: Boolean(resumeData.contact?.fullName?.trim()), section: 'contact' },
    { label: 'Professional email', ok: Boolean(resumeData.contact?.email?.trim()), section: 'contact' },
    { label: 'Phone number', ok: Boolean(resumeData.contact?.phone?.trim()), section: 'contact' },
    { label: 'Professional summary', ok: Boolean(resumeData.summary?.replace(/<[^>]*>/g, '').trim()), section: 'summary' },
    { label: 'Work experience', ok: Boolean(resumeData.experience?.length), section: 'experience' },
    { label: 'Education', ok: Boolean(resumeData.education?.length), section: 'education' },
    { label: 'Skills', ok: Boolean(Object.values(resumeData.skills || {}).some(items => items?.length)), section: 'skills' },
    { label: 'Projects', ok: Boolean(resumeData.projects?.length), section: 'projects' }
  ];
  const complete = checks.filter(check => check.ok).length;
  const readiness = Math.round((complete / checks.length) * 100);
  const visibleMissing = showAll ? analysis.missing : analysis.missing.slice(0, 24);

  return (
    <section className="section active ats-optimization-guide">
      <div className="guide-header">
        <p className="eyebrow">RESUME INTELLIGENCE</p>
        <h2>ATS & Job Match Studio</h2>
        <p className="section-description">Check resume completeness and compare its wording with a specific job description. This is a guidance estimate, not a guarantee of ATS results.</p>
      </div>

      <div className="ats-studio-summary">
        <div className="ats-studio-score"><strong>{readiness}%</strong><span>Resume completeness</span></div>
        <div className="ats-studio-progress"><div style={{ width: readiness + '%' }} /></div>
        <span>{complete} of {checks.length} core sections covered</span>
      </div>

      <div className="guide-tabs" role="tablist" aria-label="ATS tools">
        <button type="button" className={activeTab === 'match' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('match')}>Job match</button>
        <button type="button" className={activeTab === 'checklist' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('checklist')}>Resume checklist</button>
      </div>

      {activeTab === 'match' && (
        <div className="ats-guide-content">
          <label className="form-label" htmlFor="job-description-match">Paste the target job description</label>
          <textarea id="job-description-match" className="form-control job-description-input" rows="9" value={jobDescription} onChange={event => setJobDescription(event.target.value)} placeholder="Paste the complete job description here. Include responsibilities, qualifications and required technologies." />
          {jobDescription.trim() ? (
            <div className="job-match-results">
              <div className="job-match-score"><strong>{analysis.score}%</strong><span>Keyword overlap</span></div>
              <div className="keyword-match-columns">
                <div><h4>Found in your resume ({analysis.matched.length})</h4><div className="keyword-grid">{analysis.matched.slice(0, 36).map(word => <span className="keyword-tag technical" key={word}>{word}</span>)}</div></div>
                <div><h4>Not found ({analysis.missing.length})</h4><div className="keyword-grid">{visibleMissing.map(word => <span className="keyword-tag missing" key={word}>{word}</span>)}</div>{analysis.missing.length > 24 && <button type="button" className="btn btn--outline btn--sm" onClick={() => setShowAll(value => !value)}>{showAll ? 'Show fewer' : 'Show all keywords'}</button>}</div>
              </div>
              <p className="ats-disclaimer">Add a missing term only when it truthfully reflects your skills or experience. Similar wording may also be recognized by hiring systems.</p>
            </div>
          ) : <div className="empty-state">Add a job description to see keyword overlap and missing terms.</div>}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="ats-checklist">
          {checks.map(check => <button type="button" className="ats-check-item" key={check.label} onClick={() => onNavigateToSection(check.section)}><span className={check.ok ? 'check-status complete' : 'check-status'}>{check.ok ? '✓' : '○'}</span><span>{check.label}</span><span className="check-action">{check.ok ? 'Review' : 'Complete'} →</span></button>)}
          <p className="ats-disclaimer">A complete resume is not automatically an effective resume. Prioritize relevant evidence, clear formatting and truthful, measurable achievements.</p>
        </div>
      )}
    </section>
  );
}

export default ATSOptimizationGuide;
