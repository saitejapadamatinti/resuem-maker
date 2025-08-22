import React, { useEffect, useRef } from 'react';

function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    handleInput();
  };

  const handleInput = () => {
    if (!ref.current) return;
    onChange && onChange(ref.current.innerHTML);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); exec('bold'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); exec('italic'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') { e.preventDefault(); exec('underline'); }
  };

  return (
    <div>
      <div className="rte-toolbar" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button type="button" className="btn btn--sm btn--outline" onClick={() => exec('bold')}><strong>B</strong></button>
        <button type="button" className="btn btn--sm btn--outline" onClick={() => exec('italic')}><em>I</em></button>
        <button type="button" className="btn btn--sm btn--outline" onClick={() => exec('underline')}><u>U</u></button>
        <button type="button" className="btn btn--sm btn--outline" onClick={() => exec('insertUnorderedList')}>• List</button>
      </div>
      <div 
        ref={ref}
        className="form-control"
        style={{ minHeight: 120, overflowY: 'auto' }}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

export default RichTextEditor;
