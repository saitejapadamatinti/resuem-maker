import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PreviewSection({ steps = [], resumeData }) {
  const [pageGuides, setPageGuides] = useState([]);

  // A4 in points used by jsPDF
  const A4_WIDTH_PT = 595.28;
  const A4_HEIGHT_PT = 841.89;
  // Margins in points (1pt = 1/72 inch)
  const MARGIN_FIRST_TOP_PT = 0;
  const MARGIN_FIRST_BOTTOM_PT = 36; // 0.5 inch
  const MARGIN_OTHER_TOP_PT = 36; // 0.5 inch
  const MARGIN_OTHER_BOTTOM_PT = 36; // 0.5 inch

  useEffect(() => {
    const computeGuides = () => {
      const el = document.querySelector('.resume-preview');
      if (!el) return;
      const widthPx = el.clientWidth;
      const heightPx = el.scrollHeight;
      if (!widthPx || !heightPx) return;

      const pxPerPt = widthPx / A4_WIDTH_PT;
      const pageHeightPx = A4_HEIGHT_PT * pxPerPt;
      const firstTopPx = MARGIN_FIRST_TOP_PT * pxPerPt;
      const firstBottomPx = MARGIN_FIRST_BOTTOM_PT * pxPerPt;
      const otherTopPx = MARGIN_OTHER_TOP_PT * pxPerPt;
      const otherBottomPx = MARGIN_OTHER_BOTTOM_PT * pxPerPt;

      const contentFirstPx = pageHeightPx - firstTopPx - firstBottomPx; // first top is 0 by default
      const contentOtherPx = pageHeightPx - otherTopPx - otherBottomPx;

      const guides = [];
      let y = contentFirstPx + firstBottomPx; // end of first page including bottom margin
      while (y < heightPx) {
        guides.push(Math.round(y));
        y += contentOtherPx + otherTopPx + otherBottomPx; // subsequent pages include both margins
      }
      setPageGuides(guides);
    };
    computeGuides();
    window.addEventListener('resize', computeGuides);
    return () => window.removeEventListener('resize', computeGuides);
  }, [steps, resumeData]);

  const downloadPDF = async () => {
    const element = document.querySelector('.resume-preview');
    if (!element) return;

    // Hide on-screen guides during capture so they don't appear in the PDF
    const guides = Array.from(element.querySelectorAll('.page-guide'));
    const prevDisplays = guides.map(g => g.style.display);
    guides.forEach(g => { g.style.display = 'none'; });

    try {
      const targetScale = Math.min(4, (window.devicePixelRatio || 1) * 2);
      const canvas = await html2canvas(element, {
        scale: targetScale,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidthPt = pdf.internal.pageSize.getWidth();
      const pageHeightPt = pdf.internal.pageSize.getHeight();

      const pxPerPtCanvas = canvas.width / pageWidthPt;
      const pageHeightPx = Math.floor(pageHeightPt * pxPerPtCanvas);

      const firstTopPx = Math.floor(MARGIN_FIRST_TOP_PT * pxPerPtCanvas);
      const firstBottomPx = Math.floor(MARGIN_FIRST_BOTTOM_PT * pxPerPtCanvas);
      const otherTopPx = Math.floor(MARGIN_OTHER_TOP_PT * pxPerPtCanvas);
      const otherBottomPx = Math.floor(MARGIN_OTHER_BOTTOM_PT * pxPerPtCanvas);

      // Helper to test if a row is mostly white to avoid cutting through text
      const ctxFull = canvas.getContext('2d');
      const isRowMostlyWhite = (rowY) => {
        if (rowY < 0 || rowY >= canvas.height) return true;
        const sample = ctxFull.getImageData(0, rowY, canvas.width, 1).data;
        let nonWhite = 0;
        for (let i = 0; i < sample.length; i += 16) { // sample every 4th pixel
          const r = sample[i], g = sample[i + 1], b = sample[i + 2];
          if (r < 245 || g < 245 || b < 245) { nonWhite++; if (nonWhite > 2) return false; }
        }
        return true;
      };

      let y = 0;
      let pageIndex = 0;

      while (y < canvas.height) {
        const isFirst = pageIndex === 0;
        const topPx = isFirst ? firstTopPx : otherTopPx;
        const bottomPx = isFirst ? firstBottomPx : otherBottomPx;
        const contentHeightPx = pageHeightPx - topPx - bottomPx;

        // propose a cut at the bottom of the content area
        let cut = Math.min(y + contentHeightPx, canvas.height);
        // search a safe cut line upwards first, then downwards
        let safeCut = cut;
        const searchRange = 32; // px
        let found = false;
        for (let dy = 0; dy <= searchRange; dy++) {
          const row = cut - dy;
          if (row <= y + 8) break;
          if (isRowMostlyWhite(row)) { safeCut = row; found = true; break; }
        }
        if (!found) {
          for (let dy = 1; dy <= searchRange; dy++) {
            const row = cut + dy;
            if (row >= canvas.height) break;
            if (isRowMostlyWhite(row)) { safeCut = row; found = true; break; }
          }
        }
        if (!found && safeCut <= y) {
          // fallback at least 24px to progress and avoid infinite loop
          safeCut = Math.min(y + Math.max(24, contentHeightPx), canvas.height);
        }

        const sliceHeight = Math.max(1, safeCut - y);

        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = topPx + sliceHeight + bottomPx;

        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          sliceHeight,
          0,
          topPx,
          canvas.width,
          sliceHeight
        );

        const imgData = pageCanvas.toDataURL('image/png');
        const imgWidthPt = pageWidthPt;
        const imgHeightPt = (pageCanvas.height / canvas.width) * pageWidthPt;

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidthPt, imgHeightPt);

        y = safeCut;
        pageIndex += 1;
      }

      const name = resumeData.contact.fullName ? resumeData.contact.fullName.replace(/\s+/g, '_') : 'resume';
      pdf.save(`${name}.pdf`);
    } finally {
      // Restore guides
      guides.forEach((g, i) => { g.style.display = prevDisplays[i] || ''; });
    }
  };

  const printResume = () => {
    window.print();
  };

  const allSkills = [
    ...resumeData.skills.technical, 
    ...resumeData.skills.soft, 
    ...resumeData.skills.other
  ];

  const renderSectionByKey = (key) => {
    switch (key) {
      case 'summary':
        return resumeData.summary && (
          <div className="resume-section" key="summary">
            <h2>Professional Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
          </div>
        );
      case 'experience':
        return resumeData.experience.length > 0 && (
          <div className="resume-section" key="experience">
            <h2>Work Experience</h2>
            {resumeData.experience.map(exp => (
              <div key={exp.id} className="experience-entry">
                <div className="entry-header">
                  <div>
                    <div className="entry-title">{exp.title}</div>
                    <div className="entry-company">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                  </div>
                  <div className="entry-date">{exp.startDate} - {exp.endDate}</div>
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="entry-achievements">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      case 'projects':
        return resumeData.projects && resumeData.projects.length > 0 && (
          <div className="resume-section" key="projects">
            <h2>Projects</h2>
            {resumeData.projects.map(project => (
              <div key={project.id} className="experience-entry">
                <div className="entry-header">
                  <div>
                    <div className="entry-title">{project.name}</div>
                    <div className="entry-company">
                      {project.role}
                    </div>
                  </div>
                  {project.link && (
                    <div className="entry-date">
                      <a href={project.link} target="_blank" rel="noreferrer">Link</a>
                    </div>
                  )}
                </div>
                {project.description && (
                  <div style={{ color: 'var(--color-text)' }} dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
              </div>
            ))}
          </div>
        );
      case 'education':
        return resumeData.education.length > 0 && (
          <div className="resume-section" key="education">
            <h2>Education</h2>
            {resumeData.education.map(edu => (
              <div key={edu.id} className="education-entry">
                <div className="entry-header">
                  <div>
                    <div className="entry-title">{edu.degree}</div>
                    <div className="entry-company">
                      {edu.school}{edu.location ? `, ${edu.location}` : ''}
                    </div>
                  </div>
                  <div className="entry-date">{edu.graduationDate}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'skills':
        return allSkills.length > 0 && (
          <div className="resume-section" key="skills">
            <h2>Skills</h2>
            <div className="preview-skills">
              {allSkills.map(skill => (
                <span key={skill} className="preview-skill">{skill}</span>
              ))}
            </div>
          </div>
        );
      case 'websites':
        return resumeData.websites && resumeData.websites.length > 0 && (
          <div className="resume-section" key="websites">
            <h2>Websites • Portfolios • Profiles</h2>
            <div className="preview-skills">
              {resumeData.websites.map(item => (
                <span key={item.id || item.url} className="preview-skill">
                  {item.label ? `${item.label}: ` : ''}
                  {item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a> : ''}
                </span>
              ))}
            </div>
          </div>
        );
      case 'custom':
        return (resumeData.customSections && resumeData.customSections.length > 0) && (
          <div key="custom">
            {resumeData.customSections.map(sec => (
              <div className="resume-section" key={sec.id}>
                {sec.title && <h2>{sec.title}</h2>}
                {Array.isArray(sec.items) && sec.items.length > 0 && (
                  <ul className="entry-achievements">
                    {sec.items.map((it, idx) => (
                      <li key={idx}>
                        <span dangerouslySetInnerHTML={{ __html: it }} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section active">
      <h2>Resume Preview</h2>
      <p className="section-description">Preview how your resume will appear when downloaded</p>
      
      <div className={`resume-preview theme-${(document.querySelector('[data-theme]')?.getAttribute('data-theme')) || 'classic'}`} style={{ position: 'relative' }}>
        <div className="resume-header">
          <h1>{resumeData.contact.fullName || 'Your Name'}</h1>
          <div className="contact-info">
            {resumeData.contact.phone && <span>{resumeData.contact.phone}</span>}
            {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
            {resumeData.contact.location && <span>{resumeData.contact.location}</span>}
            {resumeData.contact.linkedIn && <span>{resumeData.contact.linkedIn}</span>}
          </div>
        </div>

        {/* Body wrapper for themes that need layout */}
        <div className="resume-body">
          {/* Left column (summary, skills, websites) */}
          <div className="resume-left">
            {['summary', 'skills', 'websites'].filter(s => steps.includes(s)).map(renderSectionByKey)}
          </div>
          {/* Right column (experience, projects, education, custom) */}
          <div className="resume-right">
            {['experience', 'projects', 'education', 'custom'].filter(s => steps.includes(s)).map(renderSectionByKey)}
          </div>
        </div>

        {pageGuides.map((y, idx) => (
          <div key={idx} className="page-guide" style={{ position: 'absolute', left: 0, right: 0, top: y, height: 0, borderTop: '1px dashed var(--color-border)', pointerEvents: 'none' }} />
        ))}
      </div>
      
      <div className="preview-actions">
        <button className="btn btn--primary btn--lg" onClick={downloadPDF}>
          Download as PDF
        </button>
        <button className="btn btn--outline btn--lg" onClick={printResume}>
          Print Resume
        </button>
      </div>
    </section>
  );
}

export default PreviewSection;
