import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ATSPanel from './components/ATSPanel';
import Footer from './components/Footer';
import { applicationData } from './data/applicationData';
import './App.css';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Disable external worker; we'll run without a worker to avoid fetch issues
try { pdfjsLib.GlobalWorkerOptions.workerSrc = undefined; } catch {}

const STORAGE_KEY = 'ats-resume-builder:data:v1';
const STORAGE_STEPS_KEY = 'ats-resume-builder:steps:v1';
const STORAGE_STEP_INDEX_KEY = 'ats-resume-builder:currentStep:v1';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(['contact', 'websites', 'summary', 'experience', 'education', 'projects', 'skills', 'preview']);
  const [resumeData, setResumeData] = useState({
    contact: {},
    websites: [],
    summary: '',
    experience: [],
    education: [],
    projects: [],
    customSections: [],
    skills: { technical: [], soft: [], other: [] }
  });
  const [theme, setTheme] = useState('classic');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setResumeData(parsed);
      }
      const rawSteps = localStorage.getItem(STORAGE_STEPS_KEY);
      if (rawSteps) {
        const parsedSteps = JSON.parse(rawSteps);
        if (Array.isArray(parsedSteps) && parsedSteps.length) setSteps(parsedSteps);
      }
      const rawIndex = localStorage.getItem(STORAGE_STEP_INDEX_KEY);
      if (rawIndex !== null) {
        const idx = Number(rawIndex);
        setCurrentStep(Number.isNaN(idx) ? 0 : Math.max(0, idx));
      }
    } catch {}
  }, []);

  // Autosave on changes (debounced by microtask via setTimeout)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(steps));
        localStorage.setItem(STORAGE_STEP_INDEX_KEY, String(currentStep));
        localStorage.setItem('ats-resume-builder:theme', theme);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [resumeData, steps, currentStep, theme]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ats-resume-builder:theme');
      if (savedTheme) setTheme(savedTheme);
    } catch {}
  }, []);

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const reorderSteps = (newSteps) => {
    const currentKey = steps[currentStep];
    setSteps(newSteps);
    const newIndex = newSteps.indexOf(currentKey);
    setCurrentStep(newIndex >= 0 ? newIndex : 0);
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const loadSample = () => {
    const sample = applicationData.sampleResume;
    setResumeData({
      contact: sample.contact || {},
      websites: sample.websites || [],
      summary: sample.summary || '',
      experience: sample.experience || [],
      education: sample.education || [],
      projects: sample.projects || [],
      skills: sample.skills || { technical: [], soft: [], other: [] }
    });
    setCurrentStep(0);
  };

  const saveNow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(steps));
      localStorage.setItem(STORAGE_STEP_INDEX_KEY, String(currentStep));
      alert('Progress saved locally.');
    } catch {
      alert('Could not save locally (storage full or disabled).');
    }
  };

  const clearAll = () => {
    if (!window.confirm('Clear all saved data?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEPS_KEY);
      localStorage.removeItem(STORAGE_STEP_INDEX_KEY);
    } catch {}
    setResumeData({ contact: {}, websites: [], summary: '', experience: [], education: [], projects: [], skills: { technical: [], soft: [], other: [] } });
    setSteps(['contact', 'websites', 'summary', 'experience', 'education', 'projects', 'skills', 'preview']);
    setCurrentStep(0);
  };

  const exportJson = () => {
    try {
      const payload = {
        resumeData,
        steps,
        currentStep,
        exportedAt: new Date().toISOString()
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Could not export JSON.');
    }
  };

  const normalizeImportedResume = (input) => {
    if (!input || typeof input !== 'object') return null;
    const source = input.resumeData && typeof input.resumeData === 'object' ? input.resumeData : input;
    const directShape = {
      contact: source.contact || {
        fullName: source.fullName || source.name || '',
        phone: source.phone || (source.basics && source.basics.phone) || '',
        email: source.email || (source.basics && source.basics.email) || '',
        location: source.location || (source.basics && source.basics.location && (source.basics.location.city || source.basics.location.region)) || '',
        linkedIn: source.linkedIn || (source.basics && source.basics.profiles && (source.basics.profiles.find(p => /linkedin/i.test(p.network)) || {}).url) || ''
      },
      websites: source.websites || (source.basics && source.basics.profiles ? source.basics.profiles.map((p, idx) => ({ id: idx + 1, label: p.network, url: p.url })) : []),
      summary: source.summary || (source.basics && source.basics.summary) || '',
      experience: Array.isArray(source.experience) ? source.experience : (Array.isArray(source.work) ? source.work.map((w, i) => ({
        id: i + 1,
        title: w.position || '',
        company: w.name || '',
        location: (w.location || ''),
        startDate: w.startDate || '',
        endDate: w.endDate || (w.isCurrent ? 'Present' : ''),
        achievements: Array.isArray(w.highlights) ? w.highlights : []
      })) : []),
      education: Array.isArray(source.education) ? source.education : (Array.isArray(source.educationHistory) ? source.educationHistory : (Array.isArray(source.education) ? source.education : [])),
      projects: Array.isArray(source.projects) ? source.projects : [],
      skills: (() => {
        if (source.skills && (Array.isArray(source.skills.technical) || Array.isArray(source.skills.soft) || Array.isArray(source.skills.other))) {
          return source.skills;
        }
        if (Array.isArray(source.skills)) {
          return {
            technical: source.skills.map(s => s.name || s),
            soft: [],
            other: []
          };
        }
        return { technical: [], soft: [], other: [] };
      })()
    };

    directShape.experience = (directShape.experience || []).map((e, idx) => ({ id: e.id || idx + 1, ...e }));
    directShape.education = (directShape.education || []).map((e, idx) => ({ id: e.id || idx + 1, degree: e.degree || e.studyType || '', school: e.school || e.institution || '', location: e.location || '', graduationDate: e.graduationDate || e.endDate || '' }));
    directShape.projects = (directShape.projects || []).map((p, idx) => ({ id: p.id || idx + 1, name: p.name || '', role: p.role || p.position || '', link: p.link || p.url || '', description: p.description || (Array.isArray(p.highlights) ? p.highlights.join(' ') : '') }));

    return directShape;
  };

  const importResume = (json) => {
    const normalized = normalizeImportedResume(json);
    if (!normalized) return;
    setResumeData(normalized);
    setCurrentStep(0);
    if (Array.isArray(json.steps)) {
      const valid = json.steps.filter(k => ['contact','websites','summary','experience','education','projects','skills','preview'].includes(k));
      if (valid.length) setSteps(valid);
    }
    if (typeof json.currentStep === 'number') {
      const idx = Math.max(0, Math.min(json.currentStep, steps.length - 1));
      setCurrentStep(idx);
    }
  };

  const extractTextWithPdfJs = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorker: false }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(it => (it.str || ''));
      fullText += strings.join(' ') + '\n';
    }
    return fullText.trim();
  };

  const extractTextWithOcr = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorker: false }).promise;
    let text = '';
    const maxPages = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 3 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png');
      const result = await Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
      text += (result.data && result.data.text ? result.data.text : '') + '\n';
    }
    return text.trim();
  };

  const importPdf = async (arrayBuffer) => {
    try {
      let text = '';
      try {
        text = await extractTextWithPdfJs(arrayBuffer);
      } catch {}

      if (!text || text.length < 200) {
        const ocrText = await extractTextWithOcr(arrayBuffer);
        if (ocrText && ocrText.length > text.length) text = ocrText;
      }

      if (!text || text.length < 50) {
        alert('Could not read the PDF. If it is scanned, try a higher-quality scan or share a sample.');
        return;
      }

      const contact = {
        fullName: (text.match(/^([A-Z][A-Za-z\s\-']{2,})$/m) || [,''])[1] || '',
        email: (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [,''])[1] || (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || '',
        phone: (text.match(/(\+?\d[\d\s\-()]{8,}\d)/) || [,''])[1] || '',
        location: (text.match(/\b([A-Za-z]+,\s*[A-Za-z]{2,})\b/) || [,''])[1] || '',
        linkedIn: (text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[A-Za-z0-9_\-/]+/i) || [,''])[1] || ''
      };

      const websites = Array.from(new Set([
        ...(text.match(/https?:\/\/[^\s)]+/g) || [])
      ])).slice(0, 15).map((url, idx) => ({ id: idx + 1, label: '', url }));

      const sections = {
        experience: [],
        education: [],
        projects: [],
        skills: { technical: [], soft: [], other: [] }
      };

      const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
      let current = null;
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (/^work experience|experience$/.test(lower)) { current = 'experience'; continue; }
        if (/^education$/.test(lower)) { current = 'education'; continue; }
        if (/^projects?$/.test(lower)) { current = 'projects'; continue; }
        if (/^skills?$/.test(lower)) { current = 'skills'; continue; }

        if (current === 'skills') {
          const tokens = line.split(/[,•\u2022;]\s*/).map(s => s.trim()).filter(Boolean);
          sections.skills.technical.push(...tokens);
        } else if (current === 'projects') {
          if (line.length > 3) sections.projects.push({ id: sections.projects.length + 1, name: line, role: '', link: '', description: '' });
        } else if (current === 'education') {
          if (line.length > 3) sections.education.push({ id: sections.education.length + 1, degree: '', school: line, location: '', graduationDate: '' });
        } else if (current === 'experience') {
          if (line.length > 3) sections.experience.push({ id: sections.experience.length + 1, title: line, company: '', location: '', startDate: '', endDate: '', achievements: [] });
        }
      }

      setResumeData({
        contact,
        websites,
        summary: '',
        experience: sections.experience,
        education: sections.education,
        projects: sections.projects,
        skills: sections.skills
      });
      setCurrentStep(0);
    } catch (e) {
      console.error('PDF import failed', e);
      alert('Could not read the PDF. Try a clearer text-based PDF or enable OCR.');
    }
  };

  const addCustomStep = (title = 'Custom Section') => {
    // Ensure custom step present in steps
    if (!steps.includes('custom')) {
      const idx = Math.max(steps.indexOf('skills'), 0);
      const newSteps = [...steps];
      newSteps.splice(idx + 1, 0, 'custom');
      setSteps(newSteps);
    }
    // Ensure at least one custom section
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections && prev.customSections.length ? prev.customSections : [{ id: Date.now(), title, items: [] }]
    }));
  };

  return (
    <div className="app">
      <Header 
        theme={theme}
        onChangeTheme={setTheme}
        onImportResume={importResume}
        onImportPdf={importPdf}
      />
      <div className="app-layout">
        <Sidebar 
          currentStep={currentStep}
          steps={steps}
          progress={calculateProgress()}
          onStepClick={goToStep}
          onReorderSteps={reorderSteps}
          onLoadSample={loadSample}
          onImportResume={importResume}
          onImportPdf={importPdf}
          onSaveNow={saveNow}
          onExportJson={exportJson}
          onClearAll={clearAll}
          onAddCustom={addCustomStep}
          theme={theme}
          onChangeTheme={setTheme}
        />
        <MainContent 
          steps={steps}
          currentStep={currentStep}
          resumeData={resumeData}
          onUpdateData={updateResumeData}
          onStepChange={goToStep}
          onExportJson={exportJson}
        />
        <ATSPanel 
          resumeData={resumeData}
          currentStep={currentStep}
        />
      </div>
      <div style={{ display: 'none' }} data-theme={theme} />
      <div className='large-screen-message'>Please Open Laptop or Desktop</div>
      <Footer />
    </div>
  );
}

export default App;
