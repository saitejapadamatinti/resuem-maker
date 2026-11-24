import React, { useEffect, useMemo, useState } from 'react';

const STOP_WORDS = new Set(['the','and','for','with','you','your','our','are','this','that','will','from','have','has','who','what','their','they','them','into','our','about','years','year','work','role','team','ability','strong','good','excellent','experience','looking','required','preferred','using','use','skills','skill']);

function tokenize(value = '') {
  return (value.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g) || [])
    .filter(word => !STOP_WORDS.has(word));
}

function ATSOptimizationGuide({ resumeData = {}, targetJobDescription = '', onUpdateJobDescription = () => {}, onUpdateResumeField = () => {}, onNavigateToSection = () => {} }) {
  const [jobDescription, setJobDescription] = useState(targetJobDescription);
  useEffect(() => setJobDescription(targetJobDescription || ''), [targetJobDescription]);
  const [activeTab, setActiveTab] = useState('match');
  const [showAll, setShowAll] = useState(false);

  const resumeText = useMemo(() => {
    const parts = [
      resumeData.contact?.fullName, resumeData.contact?.email, resumeData.contact?.phone,
      resumeData.contact?.location, resumeData.contact?.headline, resumeData.contact?.website, resumeData.summary,
      ...(resumeData.experience || []).flatMap(item => [item.title, item.company, item.location, ...(item.achievements || [])]),
      ...(resumeData.education || []).flatMap(item => [item.degree, item.school, item.location]),
      ...(resumeData.projects || []).flatMap(item => [item.name, item.role, item.description]),
      ...Object.values(resumeData.skills || {}).flat()
    ];
    return parts.filter(Boolean).join(' ').replace(/<[^>]*>/g, ' ').toLowerCase();
  }, [resumeData]);

  const analysis = useMemo(() => {
    const terms = [...new Set(tokenize(jobDescription))];
    const resumeTokens = new Set(tokenize(resumeText));
    const matched = terms.filter(term => resumeTokens.has(term));
    const missing = terms.filter(term => !resumeTokens.has(term));
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

  const generateCoverLetter = () => {
    const plainSummary = (resumeData.summary || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const role = resumeData.coverLetterRole || resumeData.contact?.headline || 'the advertised position';
    const company = resumeData.coverLetterCompany || 'your organization';
    const experience = (resumeData.experience || []).find(item => item.title || item.company);
    const skills = [...(resumeData.skills?.technical || []), ...(resumeData.skills?.other || [])].filter(Boolean).slice(0, 7);
    const highlights = experience?.achievements?.filter(Boolean).slice(0, 2) || [];
    const paragraphs = [
      'Dear Hiring Team,',
      '',
      `I am writing to express my interest in the ${role} opportunity at ${company}. I would welcome the opportunity to contribute my experience and continue growing with your team.`
    ];
    if (plainSummary) paragraphs.push('', plainSummary);
    if (experience) {
      paragraphs.push('', `In my role as ${experience.title || 'a professional'}${experience.company ? ` at ${experience.company}` : ''}, I have developed practical experience relevant to this opportunity.`);
      highlights.forEach(item => paragraphs.push(`• ${item}`));
    }
    if (skills.length) paragraphs.push('', `My relevant skills include ${skills.join(', ')}.`);
    paragraphs.push('', 'I would appreciate the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration.', '', `Sincerely,\n${resumeData.contact?.fullName || '[Your name]'}`);
    onUpdateResumeField('coverLetterDraft', paragraphs.join('\n'));
  };

  const copyCoverLetter = async () => {
    const draft = resumeData.coverLetterDraft || '';
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft); alert('Cover letter copied.'); }
    catch { alert('Clipboard access is unavailable. Select and copy the text manually.'); }
  };

  const copyImportedText = async () => {
    if (!resumeData.importedText) return;
    try { await navigator.clipboard.writeText(resumeData.importedText); alert('Extracted text copied.'); }
    catch { alert('Clipboard access is unavailable. Select and copy the text manually.'); }
  };

  const downloadImportedText = () => {
    if (!resumeData.importedText) return;
    const blob = new Blob([resumeData.importedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'extracted-resume-text.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadCoverLetter = () => {
    const draft = resumeData.coverLetterDraft || '';
    if (!draft) return;
    const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'cover-letter.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
        <button type="button" className={activeTab === 'cover-letter' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('cover-letter')}>Cover letter</button>
        {resumeData.importedText && <button type="button" className={activeTab === 'pdf-text' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('pdf-text')}>PDF text review</button>}
      </div>

      {activeTab === 'match' && (
        <div className="ats-guide-content">
          <label className="form-label" htmlFor="job-description-match">Paste the target job description</label>
          <textarea id="job-description-match" className="form-control job-description-input" rows="9" value={jobDescription} onChange={event => { setJobDescription(event.target.value); onUpdateJobDescription(event.target.value); }} placeholder="Paste the complete job description here. Include responsibilities, qualifications and required technologies." />
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

      {activeTab === 'pdf-text' && (
        <div className="ats-guide-content">
          <h3>Extracted PDF text</h3>
          <p className="section-description">PDF parsing and OCR can misread columns, dates or headings. Review this original extraction against the parsed fields before deleting it.</p>
          <div className="cover-letter-actions"><button type="button" className="btn btn--outline" onClick={copyImportedText}>Copy extracted text</button><button type="button" className="btn btn--outline" onClick={downloadImportedText}>Download .txt</button><button type="button" className="btn btn--outline" onClick={() => onUpdateResumeField('importedText', '')}>Clear extracted text</button></div>
          <label className="form-label" htmlFor="pdf-extracted-text">Extracted content</label>
          <textarea id="pdf-extracted-text" className="form-control job-description-input" rows="18" value={resumeData.importedText} onChange={event => onUpdateResumeField('importedText', event.target.value)} />
        </div>
      )}

      {activeTab === 'cover-letter' && (
        <div className="ats-guide-content cover-letter-builder">
          <h3>Cover Letter Builder</h3>
          <p className="section-description">Create a first draft using only information already present in your resume. Review every sentence and tailor it to the specific job before sending.</p>
          <div className="form-grid">
            <div className="form-group"><label className="form-label" htmlFor="cover-company">Company name</label><input id="cover-company" className="form-control" value={resumeData.coverLetterCompany || ''} onChange={event => onUpdateResumeField('coverLetterCompany', event.target.value)} placeholder="Company name" /></div>
            <div className="form-group"><label className="form-label" htmlFor="cover-role">Target role</label><input id="cover-role" className="form-control" value={resumeData.coverLetterRole || ''} onChange={event => onUpdateResumeField('coverLetterRole', event.target.value)} placeholder="Frontend Developer" /></div>
          </div>
          <div className="cover-letter-actions"><button type="button" className="btn btn--primary" onClick={generateCoverLetter}>Generate first draft</button><button type="button" className="btn btn--outline" onClick={copyCoverLetter} disabled={!resumeData.coverLetterDraft}>Copy</button><button type="button" className="btn btn--outline" onClick={downloadCoverLetter} disabled={!resumeData.coverLetterDraft}>Download .txt</button></div>
          <label className="form-label" htmlFor="cover-letter-draft">Edit your cover letter</label>
          <textarea id="cover-letter-draft" className="form-control job-description-input" rows="16" value={resumeData.coverLetterDraft || ''} onChange={event => onUpdateResumeField('coverLetterDraft', event.target.value)} placeholder="Generate a draft, then personalize it here." />
          <p className="ats-disclaimer">The generated text is a starting point, not an AI-verified application. Confirm all claims, company details and role requirements yourself.</p>
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
