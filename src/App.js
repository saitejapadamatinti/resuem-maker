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
import ReactGA from "react-ga4";

// PDF.js requires a worker matching the installed pdfjs-dist version.
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
} catch {}

const STORAGE_KEY = 'ats-resume-builder:data:v1';
const STORAGE_STEPS_KEY = 'ats-resume-builder:steps:v1';
const STORAGE_STEP_INDEX_KEY = 'ats-resume-builder:currentStep:v1';

const TRACKING_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
if (TRACKING_ID) ReactGA.initialize(TRACKING_ID);
function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(['usage-guide', 'contact', 'websites', 'summary', 'experience', 'education', 'projects', 'skills', 'ats-guide', 'preview']);
  
  const [resumeData, setResumeData] = useState({
    contact: {},
    websites: [],
    summary: '',
    experience: [],
    education: [],
    projects: [],
    customSections: [],
    skills: { technical: [], soft: [], other: [] },
    targetJobDescription: '',
    coverLetterDraft: '',
    coverLetterCompany: '',
    coverLetterRole: '',
    importedText: '',
    sectionNames: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      websites: 'Websites & Links'
    }
  });
  const [theme, setTheme] = useState('professional');



  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setResumeData(parsed);
      }

      let storedSteps = null;
      let restoredSteps = null;
      const rawSteps = localStorage.getItem(STORAGE_STEPS_KEY);
      if (rawSteps) {
        storedSteps = JSON.parse(rawSteps);
        if (Array.isArray(storedSteps) && storedSteps.length) {
          // Upgrade older saved navigation while retaining the user's section order.
          restoredSteps = ['usage-guide'];
          storedSteps.forEach(step => {
            if (step !== 'usage-guide' && step !== 'ats-guide') restoredSteps.push(step);
          });
          if (!restoredSteps.includes('ats-guide')) {
            const skillsIndex = restoredSteps.indexOf('skills');
            restoredSteps.splice(skillsIndex >= 0 ? skillsIndex + 1 : restoredSteps.length - 1, 0, 'ats-guide');
          }
          if (!restoredSteps.includes('preview')) restoredSteps.push('preview');
          setSteps(restoredSteps);
        }
      }

      const rawIndex = localStorage.getItem(STORAGE_STEP_INDEX_KEY);
      if (rawIndex !== null) {
        const idx = Number(rawIndex);
        const oldStepKey = Array.isArray(storedSteps) ? storedSteps[idx] : null;
        const mappedIndex = oldStepKey && restoredSteps ? restoredSteps.indexOf(oldStepKey) : idx;
        setCurrentStep(Number.isFinite(mappedIndex) ? Math.max(0, Math.min(mappedIndex, (restoredSteps || steps).length - 1)) : 0);
      }
    } catch {}
  }, []);

  // Debounced local autosave
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(steps));
        localStorage.setItem(STORAGE_STEP_INDEX_KEY, String(currentStep));
        localStorage.setItem('ats-resume-builder:theme', theme);
      } catch {}
    }, 350);
    return () => clearTimeout(t);
  }, [resumeData, steps, currentStep, theme]);

  useEffect(() => {
    try {
      // Keep every resume on the single professional design, including older saved drafts.
      localStorage.setItem('ats-resume-builder:theme', 'professional');
      setTheme('professional');
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
      skills: sample.skills || { technical: [], soft: [], other: [] },
      customSections: sample.customSections || [],
      targetJobDescription: '',
      coverLetterDraft: '',
      coverLetterCompany: '',
      coverLetterRole: '',
      importedText: '',
      sectionNames: {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        websites: 'Websites & Links'
      }
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
    setResumeData({ 
      contact: {}, 
      websites: [], 
      summary: '', 
      experience: [], 
      education: [], 
      projects: [], 
      customSections: [],
      targetJobDescription: '',
      coverLetterDraft: '',
      coverLetterCompany: '',
      coverLetterRole: '',
      importedText: '',
      skills: { technical: [], soft: [], other: [] },
      sectionNames: {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        websites: 'Websites & Links'
      }
    });
    setSteps(['usage-guide', 'contact', 'websites', 'summary', 'experience', 'education', 'projects', 'skills', 'ats-guide', 'preview']);
    setCurrentStep(0);
  };

  const exportJson = () => {
    try {
      const payload = {
        resumeData,
        steps,
        currentStep,
        schemaVersion: 2,
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
      targetJobDescription: source.targetJobDescription || '',
      coverLetterDraft: source.coverLetterDraft || '',
      coverLetterCompany: source.coverLetterCompany || '',
      coverLetterRole: source.coverLetterRole || '',
      importedText: source.importedText || '',
      customSections: Array.isArray(source.customSections) ? source.customSections : [],
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
      })(),
      sectionNames: source.sectionNames || {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        websites: 'Websites & Links'
      }
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
      const valid = json.steps.filter(k => ['usage-guide','contact','websites','summary','experience','education','projects','skills','ats-guide','preview'].includes(k));
      if (valid.length) {
        // Ensure usage-guide is always the first step
        const updatedSteps = ['usage-guide'];
        valid.forEach(step => {
          if (step !== 'usage-guide') {
            updatedSteps.push(step);
          }
        });
        if (!updatedSteps.includes('ats-guide')) updatedSteps.splice(Math.max(updatedSteps.indexOf('skills') + 1, 1), 0, 'ats-guide');
        if (!updatedSteps.includes('preview')) updatedSteps.push('preview');
        setSteps(updatedSteps);
      }
    }
    if (typeof json.currentStep === 'number') {
      const idx = Math.max(0, Math.min(json.currentStep, steps.length - 1));
      setCurrentStep(idx);
    }
  };

  const openPdfDocument = (arrayBuffer) => {
    // PDF.js may transfer its input buffer to the worker. Always parse a fresh copy,
    // so OCR can reopen the original bytes if text extraction finds no text.
    const bytes = new Uint8Array(arrayBuffer.slice(0));
    return pdfjsLib.getDocument({ data: bytes, isEvalSupported: false }).promise;
  };

  const extractTextWithPdfJs = async (arrayBuffer) => {
    const pdf = await openPdfDocument(arrayBuffer);
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
    const pdf = await openPdfDocument(arrayBuffer);
    let text = '';
    const maxPages = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 3 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas is unavailable for OCR rendering.');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
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
      let textExtractionError = null;
      try {
        text = await extractTextWithPdfJs(arrayBuffer);
      } catch (error) {
        textExtractionError = error;
        console.warn('PDF text layer extraction failed; attempting OCR:', error);
      }

      // Image-only and low-text PDFs need OCR. This path is automatic.
      if (!text || text.replace(/\\s/g, '').length < 120) {
        const ocrText = await extractTextWithOcr(arrayBuffer);
        if (ocrText && ocrText.length > text.length) text = ocrText;
      }

      if (!text || text.replace(/\\s/g, '').length < 30) {
        alert('No readable text was found, even after OCR. The PDF may be password-protected, damaged, or too low-resolution. Try opening it and choosing Print → Save as PDF, then import the new file.');
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
        skills: sections.skills,
        customSections: [],
        targetJobDescription: '',
        importedText: text,
        sectionNames: {
          summary: 'Professional Summary',
          experience: 'Work Experience',
          education: 'Education',
          projects: 'Projects',
          skills: 'Skills',
          websites: 'Websites & Links'
        }
      });
      setCurrentStep(0);
    } catch (e) {
      console.error('PDF import failed:', e);
      const detail = String(e?.message || '').toLowerCase();
      if (detail.includes('password') || detail.includes('encrypted')) {
        alert('This PDF is password-protected. Remove the password and try importing it again.');
      } else if (detail.includes('worker') || detail.includes('fake worker')) {
        alert('The PDF reader could not load its worker. Check your internet connection and refresh the app. OCR is attempted automatically when PDF pages can be rendered.');
      } else {
        alert('PDF import failed. Try Print → Save as PDF and upload the new file. If the file is a scan, use a clear, upright, high-resolution scan.');
      }
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
        onChangeTheme={() => setTheme('professional')}
        onImportResume={importResume}
        onImportPdf={importPdf}
        currentResumeData={resumeData}
        onLoadResume={(data) => importResume({ resumeData: data })}
        authKey="auto" // Options: 'auto', 'always', 'never', 'guest-only', 'user-only'
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
          theme={theme}
        />
        <ATSPanel 
          resumeData={resumeData}
          currentStep={currentStep}
        />
      </div>
      <div style={{ display: 'none' }} data-theme={theme} />
      
      <Footer />
    </div>
  );
}

export default App;
