import React, { useState } from 'react';
import RichTextEditor from '../controls/RichTextEditor';

function CustomSectionsSection({ data, onUpdate }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [hoveredSection, setHoveredSection] = useState(null);

  // Predefined section templates
  const sectionTemplates = [
    {
      id: 'achievements',
      title: 'Achievements & Awards',
      description: 'Highlight your accomplishments, awards, and recognitions',
      icon: '🏆',
      color: '#FFD700',
      separator: 'dots',
      items: ['Received Employee of the Year Award 2023', 'Led team of 15 developers to deliver project 2 weeks early', 'Increased customer satisfaction by 25% through process improvements']
    },
    {
      id: 'certifications',
      title: 'Certifications',
      description: 'List your professional certifications and licenses',
      icon: '📜',
      color: '#4CAF50',
      separator: 'lines',
      items: ['AWS Certified Solutions Architect - Associate', 'Certified Scrum Master (CSM)', 'Google Cloud Professional Cloud Architect']
    },
    {
      id: 'publications',
      title: 'Publications',
      description: 'Share your research papers, articles, or technical publications',
      icon: '📚',
      color: '#2196F3',
      separator: 'arrows',
      items: ['"Machine Learning in Healthcare" - IEEE Conference 2023', 'Technical blog: "Building Scalable Microservices"', 'Open source contribution to React.js documentation']
    },
    {
      id: 'languages',
      title: 'Languages',
      description: 'List your language proficiencies',
      icon: '🌍',
      color: '#9C27B0',
      separator: 'circles',
      items: ['English (Native)', 'Spanish (Fluent)', 'French (Intermediate)', 'Mandarin (Basic)']
    },
    {
      id: 'volunteer',
      title: 'Volunteer Experience',
      description: 'Showcase your community involvement and volunteer work',
      icon: '🤝',
      color: '#FF9800',
      separator: 'stars',
      items: ['Mentored 10 junior developers through coding bootcamp', 'Organized local tech meetup with 50+ attendees', 'Volunteered at local food bank - 100+ hours']
    },
    {
      id: 'interests',
      title: 'Interests & Hobbies',
      description: 'Share your personal interests and hobbies',
      icon: '🎯',
      color: '#E91E63',
      separator: 'hearts',
      items: ['Open source contributor', 'Amateur photographer', 'Hiking and outdoor activities', 'Chess enthusiast']
    }
  ];

  // Available separator styles
  const separatorOptions = [
    { value: 'none', label: 'None', icon: '—', description: 'No visual separator' },
    { value: 'dots', label: 'Dots', icon: '•••', description: 'Simple dot separators' },
    { value: 'lines', label: 'Lines', icon: '▬▬▬', description: 'Horizontal line separators' },
    { value: 'arrows', label: 'Arrows', icon: '▶▶▶', description: 'Arrow separators' },
    { value: 'circles', label: 'Circles', icon: '●●●', description: 'Circle separators' },
    { value: 'stars', label: 'Stars', icon: '★★★', description: 'Star separators' },
    { value: 'hearts', label: 'Hearts', icon: '♥♥♥', description: 'Heart separators' },
    { value: 'diamonds', label: 'Diamonds', icon: '♦♦♦', description: 'Diamond separators' },
    { value: 'squares', label: 'Squares', icon: '■■■', description: 'Square separators' },
    { value: 'triangles', label: 'Triangles', icon: '▲▲▲', description: 'Triangle separators' }
  ];

  const addSection = (template = null) => {
    const newSection = template ? {
      id: Date.now(),
      title: template.title,
      items: template.items.map(item => item),
      template: template.id,
      color: template.color,
      separator: template.separator
    } : {
      id: Date.now(),
      title: 'Custom Section',
      items: [''],
      template: 'custom',
      color: '#6B7280',
      separator: 'dots'
    };
    
    const next = [...(data || []), newSection];
    onUpdate(next);
    setShowTemplates(false);
  };

  const removeSection = (id) => {
    if (window.confirm('Are you sure you want to remove this section? This action cannot be undone.')) {
      onUpdate((data || []).filter(s => s.id !== id));
    }
  };

  const updateSectionTitle = (id, title) => {
    onUpdate((data || []).map(s => s.id === id ? { ...s, title } : s));
  };

  const updateSectionSeparator = (id, separator) => {
    onUpdate((data || []).map(s => s.id === id ? { ...s, separator } : s));
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
    const section = (data || []).find(s => s.id === secId);
    if (section && section.items.length <= 1) {
      alert('Each section must have at least one item.');
      return;
    }
    
    onUpdate((data || []).map(s => {
      if (s.id !== secId) return s;
      const items = (s.items || []).filter((_, i) => i !== idx);
      return { ...s, items };
    }));
  };

  const moveSection = (fromIndex, toIndex) => {
    const sections = [...(data || [])];
    const [movedSection] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, movedSection);
    onUpdate(sections);
  };

  const duplicateSection = (id) => {
    const section = (data || []).find(s => s.id === id);
    if (section) {
      const duplicated = {
        ...section,
        id: Date.now(),
        title: `${section.title} (Copy)`,
        items: [...section.items]
      };
      onUpdate([...(data || []), duplicated]);
    }
  };

  const clearSection = (id) => {
    if (window.confirm('Are you sure you want to clear all items in this section? This will remove all content but keep the section structure.')) {
      onUpdate((data || []).map(s => s.id === id ? { ...s, items: [''] } : s));
    }
  };

  const toggleSection = (id) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedSections(newCollapsed);
  };

  const onDragStart = (index) => (e) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const onDragOver = (index) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveSection(dragIndex, index);
    setDragIndex(null);
    const draggedElement = e.target.closest('.custom-section-item');
    if (draggedElement) {
      draggedElement.style.opacity = '';
    }
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '';
    setDragIndex(null);
  };

  const getTemplateIcon = (templateId) => {
    const template = sectionTemplates.find(t => t.id === templateId);
    return template ? template.icon : '📝';
  };

  const getTemplateColor = (templateId) => {
    const template = sectionTemplates.find(t => t.id === templateId);
    return template ? template.color : '#6B7280';
  };

  const getSectionStatus = (section) => {
    const itemCount = section.items?.length || 0;
    const hasContent = section.items?.some(item => item.trim().length > 0) || false;
    
    if (itemCount === 0) return { status: 'empty', label: 'Empty', color: '#EF4444' };
    if (!hasContent) return { status: 'draft', label: 'Draft', color: '#F59E0B' };
    if (itemCount < 2) return { status: 'minimal', label: 'Minimal', color: '#10B981' };
    return { status: 'complete', label: 'Complete', color: '#059669' };
  };

  const getEmptySectionsCount = () => {
    return (data || []).filter(section => {
      const itemCount = section.items?.length || 0;
      const hasContent = section.items?.some(item => item.trim().length > 0) || false;
      return itemCount === 0 || !hasContent;
    }).length;
  };

  return (
    <section className="section active">
      <div className="section-header-enhanced">
        <div className="header-content">
          <h2>Custom Sections</h2>
          <p className="section-description">
            Add your own sections like Achievements, Certificates, Publications, Languages, and more. 
            Use templates to get started quickly or create your own custom sections.
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{data?.length || 0}</span>
            <span className="stat-label">Sections</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{getEmptySectionsCount()}</span>
            <span className="stat-label">Need Attention</span>
          </div>
        </div>
      </div>

      {/* Section Templates Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose a Section Template</h3>
              <p className="modal-subtitle">Select a template to get started quickly with pre-filled content</p>
              <button className="modal-close" onClick={() => setShowTemplates(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div className="template-grid">
                {sectionTemplates.map(template => (
                  <div 
                    key={template.id} 
                    className="template-card"
                    onClick={() => addSection(template)}
                    style={{ '--template-color': template.color }}
                  >
                    <div className="template-header">
                      <div className="template-icon" style={{ backgroundColor: template.color + '20' }}>
                        {template.icon}
                      </div>
                      <div className="template-badge">Template</div>
                    </div>
                    <h4>{template.title}</h4>
                    <p>{template.description}</p>
                    <div className="template-preview">
                      <strong>Sample items:</strong>
                      <ul>
                        {template.items.slice(0, 2).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                        {template.items.length > 2 && <li>...</li>}
                      </ul>
                    </div>
                    <div className="template-footer">
                      <div className="template-meta">
                        <span className="template-item-count">{template.items.length} items</span>
                        <span className="template-separator">
                          Separator: {separatorOptions.find(opt => opt.value === template.separator)?.icon}
                        </span>
                      </div>
                      <button className="btn btn--sm btn--primary">Use Template</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--outline" onClick={() => setShowTemplates(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={() => addSection()}>Create Empty Section</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Sections List */}
      <div className="custom-sections-container">
        {(data || []).map((sec, sidx) => {
          const status = getSectionStatus(sec);
          const isCollapsed = collapsedSections.has(sec.id);
          const isHovered = hoveredSection === sec.id;
          
          return (
            <div 
              key={sec.id} 
              className={`custom-section-item ${isCollapsed ? 'collapsed' : ''} ${isHovered ? 'hovered' : ''}`}
              draggable
              onDragStart={onDragStart(sidx)}
              onDragOver={onDragOver(sidx)}
              onDrop={onDrop(sidx)}
              onDragEnd={onDragEnd}
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{ '--section-color': getTemplateColor(sec.template) }}
            >
              <div className="section-header">
                <div className="section-title-container">
                  <div className="section-icon" style={{ backgroundColor: getTemplateColor(sec.template) + '20' }}>
                    {getTemplateIcon(sec.template)}
                  </div>
                  <div className="section-info">
                    <input 
                      type="text" 
                      className="form-control section-title-input" 
                      value={sec.title}
                      onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                      placeholder="Section Title (e.g., Achievements)"
                    />
                    <div className="section-meta">
                      <span className="section-status" style={{ color: status.color }}>
                        {status.label}
                      </span>
                      <span className="section-template">
                        {sec.template !== 'custom' ? 'Template' : 'Custom'}
                      </span>
                    </div>
                    <div className="separator-selector">
                      <label className="separator-label">Separator:</label>
                      <div className="separator-preview">
                        <select 
                          className="form-control separator-select"
                          value={sec.separator || 'dots'}
                          onChange={(e) => updateSectionSeparator(sec.id, e.target.value)}
                          title="Choose visual separator style for items"
                        >
                          {separatorOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="separator-preview-display">
                          {separatorOptions.find(opt => opt.value === (sec.separator || 'dots'))?.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-actions">
                  <button 
                    type="button" 
                    className="btn btn--sm btn--outline action-btn" 
                    onClick={() => toggleSection(sec.id)}
                    title={isCollapsed ? "Expand section" : "Collapse section"}
                  >
                    {isCollapsed ? '▶️' : '▼'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn--sm btn--outline action-btn" 
                    onClick={() => duplicateSection(sec.id)}
                    title="Duplicate section"
                  >
                    📋
                  </button>
                  <button 
                    type="button" 
                    className="btn btn--sm btn--outline action-btn" 
                    onClick={() => clearSection(sec.id)}
                    title="Clear all items"
                  >
                    🗑️
                  </button>
                  <button 
                    type="button" 
                    className="btn btn--sm btn--danger action-btn" 
                    onClick={() => removeSection(sec.id)}
                    title="Remove section"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <>
                  <div className="section-content">
                    <div className="items-container">
                      {(sec.items || []).map((item, idx) => (
                        <div key={idx} className="item-container">
                          <div className="item-separator">
                            {sec.separator !== 'none' && (
                              <span className="separator-icon">
                                {separatorOptions.find(opt => opt.value === (sec.separator || 'dots'))?.icon}
                              </span>
                            )}
                          </div>
                          <div className="item-content">
                            <RichTextEditor 
                              value={item} 
                              onChange={(html) => updateItem(sec.id, idx, html)} 
                              placeholder={`Add ${sec.title.toLowerCase()} item ${idx + 1}...`}
                              maxLength={300}
                            />
                          </div>
                          <button 
                            type="button" 
                            className="btn btn--sm btn--danger item-remove-btn" 
                            onClick={() => removeItem(sec.id, idx)}
                            title="Remove item"
                            disabled={sec.items.length <= 1}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      type="button" 
                      className="btn btn--outline add-item-btn" 
                      onClick={() => addItem(sec.id)}
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="section-footer">
                    <div className="footer-left">
                      <span className="item-count">
                        {sec.items.length} item{sec.items.length !== 1 ? 's' : ''}
                      </span>
                      <span className="section-status-badge" style={{ backgroundColor: status.color + '20', color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <div className="footer-right">
                      <span className="drag-hint">Drag to reorder</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Custom Sections Yet</h3>
          <p>Start by adding your first custom section. Choose from our templates or create your own.</p>
        </div>
      )}

      {/* Add Section Buttons */}
      <div className="add-section-actions">
        <button className="btn btn--primary btn--lg" onClick={() => setShowTemplates(true)}>
          📋 Choose Template
        </button>
        <button className="btn btn--outline btn--lg" onClick={() => addSection()}>
          + Create Empty Section
        </button>
      </div>

      {/* Help Text */}
      <div className="help-text">
        <h4>💡 Tips for Custom Sections:</h4>
        <ul>
          <li><strong>Use templates</strong> to get started quickly with common section types</li>
          <li><strong>Be specific</strong> - include numbers, dates, and measurable results</li>
          <li><strong>Keep it relevant</strong> - only include sections that add value to your resume</li>
          <li><strong>Use action verbs</strong> to start each item (e.g., "Led", "Developed", "Achieved")</li>
          <li><strong>Drag sections</strong> to reorder them in your resume</li>
          <li><strong>Collapse sections</strong> to focus on specific content</li>
          <li><strong>Choose separators</strong> to visually distinguish items (dots, lines, arrows, etc.)</li>
        </ul>
        
        <div className="separator-help">
          <h5>🎨 Visual Separator Options:</h5>
          <div className="separator-examples">
            {separatorOptions.filter(opt => opt.value !== 'none').map(option => (
              <div key={option.value} className="separator-example">
                <span className="example-icon">{option.icon}</span>
                <span className="example-label">{option.label}</span>
              </div>
            ))}
          </div>
          <p className="separator-note">
            <strong>Note:</strong> Separators help organize your content and make your resume more visually appealing. 
            Choose styles that match your professional image and the industry you're targeting.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CustomSectionsSection;
