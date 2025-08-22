import React, { useState, useRef } from 'react';

function Sidebar({ currentStep, steps, progress, onStepClick, onReorderSteps, onLoadSample, onImportResume, onImportPdf, onSaveNow, onClearAll, onAddCustom, theme, onChangeTheme }) {
  const [dragIndex, setDragIndex] = useState(null);
  const fileInputRef = useRef(null);

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
    console.log('onDrop called with index:', index, 'dragIndex:', dragIndex);
    if (dragIndex === null || dragIndex === index) return;
    const newOrder = [...steps];
    const [moved] = newOrder.splice(dragIndex, 1);
    newOrder.splice(index, 0, moved);
    console.log('New order after drop:', newOrder);
    setDragIndex(null);
    // Reset opacity of dragged element
    const draggedElement = e.target.closest('.nav-step');
    if (draggedElement) {
      draggedElement.style.opacity = '';
    }
    onReorderSteps && onReorderSteps(newOrder);
  };

  const onDragEnd = (e) => {
    // Reset opacity of dragged element
    e.target.style.opacity = '';
    setDragIndex(null);
  };

  const handleImportClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const buf = await file.arrayBuffer();
        onImportPdf && onImportPdf(buf);
      } else {
        const text = await file.text();
        const json = JSON.parse(text);
        onImportResume && onImportResume(json);
      }
    } catch (err) {
      console.error('Import failed', err);
      alert('Import failed. Please provide a valid JSON or PDF resume.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <nav className="sidebar">
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress)}% Complete</span>
      </div>
      
      <ul className="nav-steps">
        {console.log('Steps in Sidebar:', steps)}
        {steps.map((step, index) => (
          <li 
            key={step + index}
            className={`nav-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            onClick={() => onStepClick(index)}
            draggable
            onDragStart={onDragStart(index)}
            onDragOver={onDragOver(index)}
            onDrop={onDrop(index)}
            onDragEnd={onDragEnd}
          >
            <span className={`step-number ${step === 'usage-guide' ? 'step-number--guide' : ''}`}>
              {step === 'usage-guide' ? '📖' : index + 1}
            </span>
            <span className="step-title">
              {step === 'usage-guide' && 'Usage Guide'}
              {step === 'contact' && 'Contact Info'}
              {step === 'websites' && 'Websites & Profiles'}
              {step === 'summary' && 'Summary'}
              {step === 'experience' && 'Experience'}
              {step === 'education' && 'Education'}
              {step === 'projects' && 'Projects'}
              {step === 'custom' && 'Custom'}
              {step === 'skills' && 'Skills'}
              {step === 'preview' && 'Preview'}
            </span>
            <span className="drag-handle" title="Drag to reorder">
              ⋮⋮
            </span>
          </li>
        ))}
      </ul>

      <div className="sidebar-actions">
        <button 
          className="btn btn--secondary btn--full-width" 
          onClick={onLoadSample}
        >
          Load Sample Data
        </button>
        
        <button 
          className="btn btn--secondary btn--full-width" 
          onClick={onSaveNow}
          style={{ marginTop: 8 }}
        >
          Save Now
        </button>
        <button 
          className="btn btn--outline btn--full-width" 
          onClick={onClearAll}
          style={{ marginTop: 8 }}
        >
          Clear Data
        </button>
        <button 
          className="btn btn--primary btn--full-width" 
          onClick={() => onAddCustom && onAddCustom('Custom Section')}
          style={{ marginTop: 8 }}
        >
          + Add Custom Section
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
