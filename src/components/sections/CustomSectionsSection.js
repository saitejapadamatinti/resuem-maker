import React from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function CustomSectionsSection({ data, onUpdate }) {
  const addSection = () => {
    const next = [...(data || []), { id: Date.now(), title: 'Custom Section', items: [''] }];
    onUpdate(next);
  };

  const removeSection = (id) => {
    onUpdate((data || []).filter(s => s.id !== id));
  };

  const updateSectionTitle = (id, title) => {
    onUpdate((data || []).map(s => s.id === id ? { ...s, title } : s));
  };

  const updateItem = (secId, idx, html) => {
    onUpdate((data || []).map(s => {
      if (s.id !== secId) return s;
      const items = [...(s.items || [])];
      items[idx] = html;
      return { ...s, items };
    }));
  };

  const addItem = (secId) => {
    onUpdate((data || []).map(s => s.id === secId ? { ...s, items: [...(s.items || []), ''] } : s));
  };

  const removeItem = (secId, idx) => {
    onUpdate((data || []).map(s => {
      if (s.id !== secId) return s;
      const items = (s.items || []).filter((_, i) => i !== idx);
      return { ...s, items };
    }));
  };

  return (
    <section className="section active">
      <h2>Custom Sections</h2>
      <p className="section-description">Add your own sections like Achievements, Certificates, Publications, etc.</p>

      <div>
        {(data || []).map((sec, sidx) => (
          <div key={sec.id} className="education-item">
            <h3>
              <input 
                type="text" 
                className="form-control" 
                value={sec.title}
                onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                placeholder="Section Title (e.g., Achievements)"
              />
              <div className="item-actions">
                <button type="button" className="btn btn--small btn--danger" onClick={() => removeSection(sec.id)}>Remove</button>
              </div>
            </h3>

            <div className="achievement-list">
              {(sec.items || []).map((item, idx) => (
                <div key={idx} className="achievement-item" style={{ alignItems: 'stretch' }}>
                  <div style={{ flex: 1 }}>
                    <RichTextEditor value={item} onChange={(html) => updateItem(sec.id, idx, html)} placeholder="Add item..." />
                  </div>
                  <button type="button" className="btn btn--small btn--danger" onClick={() => removeItem(sec.id, idx)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn--small btn--outline" onClick={() => addItem(sec.id)}>+ Add Item</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={addSection}>+ Add Section</button>
    </section>
  );
}

export default CustomSectionsSection;
