import React, { useRef } from 'react';

function Header({ theme = 'classic', onChangeTheme, onImportResume, onImportPdf }) {
  const fileInputRef = useRef(null);
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
    <header className="app-header">
      <div className="container header-bar">
        <div className="header-left">
          <div className="logo-mark">sai</div>
        </div>
        <div className="header-center">
          <h1 className="app-title">ATS Resume Builder</h1>
        </div>
        <div className="header-right">
          <button className="btn btn--outline" onClick={handleImportClick}>Import JSON/PDF</button>
          <input 
            ref={fileInputRef}
            type="file"
            accept="application/json,application/pdf,.json,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <select className="form-control" value={theme} onChange={(e) => onChangeTheme && onChangeTheme(e.target.value)}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="compact">Compact</option>
            <option value="professional">Professional</option>
            <option value="twocol">Two Column</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
