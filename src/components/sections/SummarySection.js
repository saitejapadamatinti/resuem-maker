import React from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function SummarySection({ data, onUpdate }) {
  const handleChange = (html) => {
    onUpdate(html);
  };

  const textOnly = (() => {
    const temp = document.createElement('div');
    temp.innerHTML = data || '';
    return (temp.textContent || '').trim();
  })();

  return (
    <section className="section active">
      <h2>Professional Summary</h2>
      <p className="section-description">Write 2-4 sentences highlighting your experience and key qualifications</p>
      
      <div className="form-group">
        <label className="form-label" htmlFor="summary">Professional Summary *</label>
        <RichTextEditor 
          value={data || ''}
          onChange={handleChange}
          placeholder="Results-driven professional with X years of experience..."
        />
        <div className="char-counter">
          <span>{textOnly.length}</span> characters (Recommended: 50-150 words)
        </div>
      </div>
    </section>
  );
}

export default SummarySection;
