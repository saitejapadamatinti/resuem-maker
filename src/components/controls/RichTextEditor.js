import React, { useEffect, useRef, useState } from 'react';

function RichTextEditor({ value, onChange, placeholder, maxLength = 500 }) {
  const ref = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
      updateCharCount();
    }
  }, [value]);

  const updateCharCount = () => {
    if (ref.current) {
      const text = ref.current.textContent || '';
      setCharCount(text.length);
    }
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    handleInput();
    ref.current?.focus();
  };

  const handleInput = () => {
    if (!ref.current) return;
    updateCharCount();
    onChange && onChange(ref.current.innerHTML);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); exec('bold'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); exec('italic'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') { e.preventDefault(); exec('underline'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); exec('undo'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); exec('redo'); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const clearFormatting = () => {
    exec('removeFormat');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      exec('createLink', url);
    }
  };

  const getCharCountColor = () => {
    const percentage = (charCount / maxLength) * 100;
    if (percentage >= 90) return 'var(--color-error)';
    if (percentage >= 75) return 'var(--color-warning)';
    return 'var(--color-text-secondary)';
  };

  return (
    <div className="rich-text-editor">
      <div className={`rte-toolbar ${isFocused ? 'focused' : ''}`}>
        <div className="toolbar-group">
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('bold')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('italic')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('underline')}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-group">
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('insertUnorderedList')}
            title="Bullet List"
          >
            • List
          </button>
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('insertOrderedList')}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="toolbar-group">
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={insertLink}
            title="Insert Link"
          >
            🔗
          </button>
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            🧹
          </button>
        </div>

        <div className="toolbar-group">
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('undo')}
            title="Undo (Ctrl+Z)"
          >
            ↩️
          </button>
          <button 
            type="button" 
            className="btn btn--sm btn--outline toolbar-btn" 
            onClick={() => exec('redo')}
            title="Redo (Ctrl+Y)"
          >
            ↪️
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div 
          ref={ref}
          className={`form-control rich-text-content ${isFocused ? 'focused' : ''}`}
          style={{ 
            minHeight: 120, 
            maxHeight: 300,
            overflowY: 'auto',
            position: 'relative'
          }}
          contentEditable
          onInput={handleInput}
          onBlur={(e) => {
            setIsFocused(false);
            handleInput();
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        
        <div className="editor-footer">
          <div className="char-counter" style={{ color: getCharCountColor() }}>
            {charCount}/{maxLength} characters
          </div>
          <div className="formatting-hint">
            Use Ctrl+B, Ctrl+I, Ctrl+U for quick formatting
          </div>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
