import React, { useState } from 'react';

function WebsitesSection({ data, onUpdate }) {
  const [counter, setCounter] = useState(1);

  const addWebsite = () => {
    const newItem = {
      id: counter,
      label: '',
      url: ''
    };
    onUpdate([...(data || []), newItem]);
    setCounter(prev => prev + 1);
  };

  const updateWebsite = (id, field, value) => {
    const updated = (data || []).map(w => w.id === id ? { ...w, [field]: value } : w);
    onUpdate(updated);
  };

  const removeWebsite = (id) => {
    onUpdate((data || []).filter(w => w.id !== id));
  };

  return (
    <section className="section active">
      <h2>Websites, Portfolios, Profiles</h2>
      <p className="section-description">Add links to your personal website, portfolio, GitHub, LinkedIn, etc.</p>

      <div>
        {(data || []).map((item, index) => (
          <div key={item.id} className="education-item">
            <h3>
              Link {index + 1}
              <div className="item-actions">
                <button 
                  type="button" 
                  className="btn btn--small btn--danger"
                  onClick={() => removeWebsite(item.id)}
                >
                  Remove
                </button>
              </div>
            </h3>

            <div className="experience-grid">
              <div className="form-group">
                <label className="form-label">Label</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g., Portfolio, GitHub, Personal Site"
                  value={item.label}
                  onChange={(e) => updateWebsite(item.id, 'label', e.target.value)}
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label">URL *</label>
                <input 
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => updateWebsite(item.id, 'url', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={addWebsite}>+ Add Link</button>
    </section>
  );
}

export default WebsitesSection;
