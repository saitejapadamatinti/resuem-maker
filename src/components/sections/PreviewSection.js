import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PreviewSection({ steps = [], resumeData, onExportJson, theme = 'classic', onUpdateData }) {
  const [pageGuides, setPageGuides] = useState([]);
  const [sectionGap, setSectionGap] = useState(10); // Default gap in pixels
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState('Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [headingSize, setHeadingSize] = useState(18);
  const [headingCase, setHeadingCase] = useState('uppercase');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [bulletStyle, setBulletStyle] = useState('disc');
  const [bulletSymbol, setBulletSymbol] = useState('•');
  const [dateAlign, setDateAlign] = useState('right');
  const [dividerStyle, setDividerStyle] = useState('solid');
  const [showGuides, setShowGuides] = useState(true);
  const [atsFriendly, setAtsFriendly] = useState(true);

  // Debug theme
  console.log('PreviewSection received theme:', theme);

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

  const estimateFileSize = (quality) => {
    const qualitySettings = {
      'high': { scale: 2.5, jpegQuality: 0.92, estimatedSize: '1.5-2 MB', clarity: 'Excellent' },
      'standard': { scale: 2, jpegQuality: 0.88, estimatedSize: '800KB-1.5MB', clarity: 'High' },
      'small': { scale: 1.5, jpegQuality: 0.82, estimatedSize: '400-800KB', clarity: 'Good' }
    };
    return qualitySettings[quality]?.estimatedSize || 'Unknown';
  };

  const getClarityLevel = (quality) => {
    const qualitySettings = {
      'high': 'Excellent',
      'standard': 'High', 
      'small': 'Good'
    };
    return qualitySettings[quality] || 'Unknown';
  };

  const getContentBasedEstimate = () => {
    // Estimate file size based on resume content complexity
    let complexity = 0;
    
    if (resumeData.summary && resumeData.summary.length > 200) complexity += 1;
    if (resumeData.experience && resumeData.experience.length > 3) complexity += 1;
    if (resumeData.education && resumeData.education.length > 2) complexity += 1;
    if (resumeData.projects && resumeData.projects.length > 2) complexity += 1;
    if (resumeData.skills && (resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.other.length) > 15) complexity += 1;
    
    if (complexity <= 2) return 'Low complexity - expect smaller files';
    if (complexity <= 4) return 'Medium complexity - standard file sizes';
    return 'High complexity - may need "Small File" option for 2MB limit';
  };

  // Enhanced PDF generation with styled text-based output for better ATS compatibility
  const generateTextBasedPdf = async () => {
    try {
      // Create text-based PDF using jsPDF directly with professional styling
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 50;
      let yPosition = margin;
      
      // Color scheme matching the visual design
      const colors = {
        primary: [79, 70, 229], // #4f46e5 - matches accentColor
        text: [31, 41, 55], // #1f2937 - dark gray
        secondary: [107, 114, 128], // #6b7280 - medium gray
        light: [243, 244, 246] // #f3f4f6 - light gray
      };
      
      // Generate styled content
      await generateStyledContent(pdf, resumeData, colors, margin, pageWidth, pageHeight);
      
      // Save the PDF
      const name = resumeData.contact.fullName ? resumeData.contact.fullName.replace(/\s+/g, '_') : 'resume';
      pdf.save(`${name}_styled.pdf`);
      
      console.log('✅ Styled text-based PDF generated successfully!');
      alert('✅ Styled PDF generated! This PDF maintains professional formatting while ensuring ATS compatibility with selectable text.');
      
    } catch (error) {
      console.error('Styled PDF generation error:', error);
      alert('❌ Failed to generate styled PDF. Please try the standard PDF option.');
    }
  };
  
  // Generate professionally styled PDF content
  const generateStyledContent = async (pdf, data, colors, margin, pageWidth, pageHeight) => {
    let yPos = margin;
    const lineHeight = 16;
    const sectionSpacing = 25;
    
    // Helper function to check page overflow and add new page if needed
    const checkPageOverflow = (requiredSpace = 50) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };
    
    // Helper function to draw section divider
    const drawSectionDivider = (y, color = colors.primary) => {
      pdf.setDrawColor(...color);
      pdf.setLineWidth(1.5);
      pdf.line(margin, y, pageWidth - margin, y);
    };
    
    // 1. CONTACT HEADER (Styled like the visual resume)
    if (data.contact) {
      checkPageOverflow(80);
      
      // Name - Large and prominent
      if (data.contact.fullName) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor(...colors.text);
        
        const nameWidth = pdf.getStringUnitWidth(data.contact.fullName) * 24 / pdf.internal.scaleFactor;
        const nameX = (pageWidth - nameWidth) / 2; // Center the name
        pdf.text(data.contact.fullName, nameX, yPos);
        yPos += 35;
        
        // Add accent line under name
        drawSectionDivider(yPos - 10, colors.primary);
        yPos += 15;
      }
      
      // Contact details in a professional layout
      const contactDetails = [];
      if (data.contact.email) contactDetails.push({ icon: '✉', text: data.contact.email });
      if (data.contact.phone) contactDetails.push({ icon: '☎', text: data.contact.phone });
      if (data.contact.location) contactDetails.push({ icon: '⌖', text: data.contact.location });
      if (data.contact.linkedIn) contactDetails.push({ icon: '●', text: data.contact.linkedIn });
      
      if (contactDetails.length > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.secondary);
        
        // Arrange contact details in two columns if more than 2 items
        const itemsPerRow = contactDetails.length > 2 ? 2 : contactDetails.length;
        const colWidth = (pageWidth - 2 * margin) / itemsPerRow;
        
        contactDetails.forEach((detail, index) => {
          const col = index % itemsPerRow;
          const row = Math.floor(index / itemsPerRow);
          const x = margin + (col * colWidth);
          const y = yPos + (row * lineHeight);
          
          pdf.text(`${detail.icon} ${detail.text}`, x, y);
        });
        
        yPos += Math.ceil(contactDetails.length / itemsPerRow) * lineHeight + sectionSpacing;
      }
    }
    
    // 2. PROFESSIONAL SUMMARY
    if (data.summary && data.summary.trim()) {
      checkPageOverflow(60);
      
      const summaryText = data.summary.replace(/<[^>]*>/g, '').trim();
      if (summaryText) {
        // Section title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(...colors.primary);
        pdf.text('PROFESSIONAL SUMMARY', margin, yPos);
        yPos += 20;
        
        drawSectionDivider(yPos - 10);
        yPos += 10;
        
        // Summary content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text);
        
        const textLines = pdf.splitTextToSize(summaryText, pageWidth - 2 * margin);
        pdf.text(textLines, margin, yPos);
        yPos += textLines.length * lineHeight + sectionSpacing;
      }
    }
    
    // 3. WORK EXPERIENCE
    if (data.experience && data.experience.length > 0) {
      checkPageOverflow(80);
      
      // Section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.primary);
      pdf.text('WORK EXPERIENCE', margin, yPos);
      yPos += 20;
      
      drawSectionDivider(yPos - 10);
      yPos += 15;
      
      data.experience.forEach((exp, index) => {
        if (exp.title && exp.company) {
          checkPageOverflow(100);
          
          // Job title - prominent and bold
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(...colors.text);
          pdf.text(exp.title, margin, yPos);
          yPos += 18;
          
          // Company and dates on same line
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(...colors.secondary);
          
          let companyDateLine = exp.company || '';
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate || '';
            const endDate = exp.endDate || 'Present';
            companyDateLine += ` | ${startDate} - ${endDate}`;
          }
          
          pdf.text(companyDateLine, margin, yPos);
          yPos += 18;
          
          // Achievements with proper bullet formatting
          if (exp.achievements && exp.achievements.length > 0) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...colors.text);
            
            exp.achievements.forEach(achievement => {
              const cleanText = achievement.replace(/<[^>]*>/g, '').replace(/^[•\-\*]\s*/, '').trim();
              if (cleanText) {
                checkPageOverflow(30);
                
                const bulletText = `• ${cleanText}`;
                const textLines = pdf.splitTextToSize(bulletText, pageWidth - 2 * margin - 15);
                pdf.text(textLines, margin + 10, yPos);
                yPos += textLines.length * 14 + 3;
              }
            });
          }
          
          yPos += 15; // Space between jobs
        }
      });
      
      yPos += 10; // Extra space after section
    }
    
    // 4. EDUCATION
    if (data.education && data.education.length > 0) {
      checkPageOverflow(60);
      
      // Section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.primary);
      pdf.text('EDUCATION', margin, yPos);
      yPos += 20;
      
      drawSectionDivider(yPos - 10);
      yPos += 15;
      
      data.education.forEach(edu => {
        if (edu.degree && edu.school) {
          checkPageOverflow(50);
          
          // Degree
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(...colors.text);
          pdf.text(edu.degree, margin, yPos);
          yPos += 18;
          
          // School and graduation date
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(...colors.secondary);
          
          let schoolLine = edu.school;
          if (edu.graduationDate) {
            schoolLine += ` | ${edu.graduationDate}`;
          }
          
          pdf.text(schoolLine, margin, yPos);
          yPos += 15;
          
          // GPA if available
          if (edu.gpa) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...colors.text);
            pdf.text(`GPA: ${edu.gpa}`, margin, yPos);
            yPos += 15;
          }
          
          yPos += 10;
        }
      });
    }
    
    // 5. SKILLS
    if (data.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0 || data.skills.other?.length > 0)) {
      checkPageOverflow(60);
      
      // Section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.primary);
      pdf.text('SKILLS', margin, yPos);
      yPos += 20;
      
      drawSectionDivider(yPos - 10);
      yPos += 15;
      
      // Technical Skills
      if (data.skills.technical && data.skills.technical.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text);
        pdf.text('Technical Skills:', margin, yPos);
        yPos += 16;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...colors.text);
        const techSkillsText = data.skills.technical.join(' • ');
        const techLines = pdf.splitTextToSize(techSkillsText, pageWidth - 2 * margin);
        pdf.text(techLines, margin + 10, yPos);
        yPos += techLines.length * 14 + 12;
      }
      
      // Soft Skills
      if (data.skills.soft && data.skills.soft.length > 0) {
        checkPageOverflow(30);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text);
        pdf.text('Soft Skills:', margin, yPos);
        yPos += 16;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...colors.text);
        const softSkillsText = data.skills.soft.join(' • ');
        const softLines = pdf.splitTextToSize(softSkillsText, pageWidth - 2 * margin);
        pdf.text(softLines, margin + 10, yPos);
        yPos += softLines.length * 14 + 12;
      }
      
      // Other Skills
      if (data.skills.other && data.skills.other.length > 0) {
        checkPageOverflow(30);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text);
        pdf.text('Other Skills:', margin, yPos);
        yPos += 16;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...colors.text);
        const otherSkillsText = data.skills.other.join(' • ');
        const otherLines = pdf.splitTextToSize(otherSkillsText, pageWidth - 2 * margin);
        pdf.text(otherLines, margin + 10, yPos);
        yPos += otherLines.length * 14 + 12;
      }
    }
    
    // 6. PROJECTS
    if (data.projects && data.projects.length > 0) {
      checkPageOverflow(60);
      
      // Section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.primary);
      pdf.text('PROJECTS', margin, yPos);
      yPos += 20;
      
      drawSectionDivider(yPos - 10);
      yPos += 15;
      
      data.projects.forEach(project => {
        if (project.name) {
          checkPageOverflow(50);
          
          // Project name
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(...colors.text);
          pdf.text(project.name, margin, yPos);
          yPos += 18;
          
          // Project URL if available
          if (project.url) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...colors.secondary);
            pdf.text(project.url, margin, yPos);
            yPos += 15;
          }
          
          // Project description
          if (project.description) {
            const cleanDesc = project.description.replace(/<[^>]*>/g, '').trim();
            if (cleanDesc) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(10);
              pdf.setTextColor(...colors.text);
              
              const descLines = pdf.splitTextToSize(cleanDesc, pageWidth - 2 * margin);
              pdf.text(descLines, margin, yPos);
              yPos += descLines.length * 14 + 15;
            }
          }
          
          yPos += 10;
        }
      });
    }
  };
  
  // Extract structured text content from resume data
  const extractResumeText = (data) => {
    const sections = [];
    
    // Contact Information (Header)
    if (data.contact) {
      const contactContent = [];
      
      // Name as main header
      if (data.contact.fullName) {
        contactContent.push({ type: 'header', text: data.contact.fullName });
      }
      
      // Contact details on separate lines
      if (data.contact.email) {
        contactContent.push({ type: 'text', text: `Email: ${data.contact.email}` });
      }
      if (data.contact.phone) {
        contactContent.push({ type: 'text', text: `Phone: ${data.contact.phone}` });
      }
      if (data.contact.location) {
        contactContent.push({ type: 'text', text: `Location: ${data.contact.location}` });
      }
      if (data.contact.linkedIn) {
        contactContent.push({ type: 'text', text: `LinkedIn: ${data.contact.linkedIn}` });
      }
      
      if (contactContent.length > 0) {
        sections.push({ title: '', content: contactContent });
      }
    }
    
    // Professional Summary
    if (data.summary && data.summary.trim()) {
      const summaryText = data.summary.replace(/<[^>]*>/g, '').trim();
      if (summaryText) {
        sections.push({
          title: 'Professional Summary',
          content: [{ type: 'text', text: summaryText }]
        });
      }
    }
    
    // Work Experience
    if (data.experience && data.experience.length > 0) {
      const expContent = [];
      data.experience.forEach(exp => {
        if (exp.title && exp.company) {
          // Job title and company
          expContent.push({ type: 'header', text: `${exp.title}` });
          expContent.push({ type: 'subheader', text: `${exp.company}` });
          
          // Dates
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate || '';
            const endDate = exp.endDate || 'Present';
            expContent.push({ type: 'text', text: `${startDate} - ${endDate}` });
          }
          
          // Achievements
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(achievement => {
              const cleanText = achievement.replace(/<[^>]*>/g, '').replace(/^[•\-\*]\s*/, '').trim();
              if (cleanText) {
                expContent.push({ type: 'bullet', text: cleanText });
              }
            });
          }
        }
      });
      
      if (expContent.length > 0) {
        sections.push({ title: 'Work Experience', content: expContent });
      }
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      const eduContent = [];
      data.education.forEach(edu => {
        if (edu.degree && edu.school) {
          eduContent.push({ type: 'header', text: edu.degree });
          eduContent.push({ type: 'subheader', text: edu.school });
          
          if (edu.graduationDate) {
            eduContent.push({ type: 'text', text: `Graduated: ${edu.graduationDate}` });
          }
          
          if (edu.gpa) {
            eduContent.push({ type: 'text', text: `GPA: ${edu.gpa}` });
          }
        }
      });
      
      if (eduContent.length > 0) {
        sections.push({ title: 'Education', content: eduContent });
      }
    }
    
    // Skills
    if (data.skills) {
      const skillsContent = [];
      
      if (data.skills.technical && data.skills.technical.length > 0) {
        skillsContent.push({ type: 'subheader', text: 'Technical Skills' });
        skillsContent.push({ type: 'text', text: data.skills.technical.join(', ') });
      }
      
      if (data.skills.soft && data.skills.soft.length > 0) {
        skillsContent.push({ type: 'subheader', text: 'Soft Skills' });
        skillsContent.push({ type: 'text', text: data.skills.soft.join(', ') });
      }
      
      if (data.skills.other && data.skills.other.length > 0) {
        skillsContent.push({ type: 'subheader', text: 'Other Skills' });
        skillsContent.push({ type: 'text', text: data.skills.other.join(', ') });
      }
      
      if (skillsContent.length > 0) {
        sections.push({ title: 'Skills', content: skillsContent });
      }
    }
    
    // Projects
    if (data.projects && data.projects.length > 0) {
      const projectsContent = [];
      data.projects.forEach(project => {
        if (project.name) {
          projectsContent.push({ type: 'header', text: project.name });
          
          if (project.url) {
            projectsContent.push({ type: 'text', text: `URL: ${project.url}` });
          }
          
          if (project.description) {
            const cleanDesc = project.description.replace(/<[^>]*>/g, '').trim();
            if (cleanDesc) {
              projectsContent.push({ type: 'text', text: cleanDesc });
            }
          }
        }
      });
      
      if (projectsContent.length > 0) {
        sections.push({ title: 'Projects', content: projectsContent });
      }
    }
    
    return sections;
  };

  // Original image-based PDF generation (renamed for clarity)
  const generateImageBasedPdf = async (quality = 'standard') => {
    const element = document.querySelector('.resume-preview');
    if (!element) return;

    // Hide on-screen guides during capture so they don't appear in the PDF
    const guides = Array.from(element.querySelectorAll('.page-guide'));
    const prevDisplays = guides.map(g => g.style.display);
    guides.forEach(g => { g.style.display = 'none'; });

    try {
      // Enhanced quality settings with better balance of clarity and file size
      const qualitySettings = {
        'high': { 
          scale: 2.5, 
          jpegQuality: 0.92, 
          description: 'High Quality (~1.5-2MB)',
          compression: 'high'
        },
        'standard': { 
          scale: 2, 
          jpegQuality: 0.88, 
          description: 'Standard Quality (~800KB-1.5MB)',
          compression: 'medium'
        },
        'small': { 
          scale: 1.5, 
          jpegQuality: 0.82, 
          description: 'Small File (~400-800KB)',
          compression: 'low'
        }
      };
      
      const settings = qualitySettings[quality] || qualitySettings.standard;
      const targetScale = Math.min(settings.scale, (window.devicePixelRatio || 1) * 1.8);
      
      // Enhanced html2canvas settings for better quality
      const canvas = await html2canvas(element, {
        scale: targetScale,
        useCORS: true,
        backgroundColor: '#ffffff',
        // Optimize for quality while maintaining reasonable file size
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        logging: false,
        // Enhanced quality settings
        removeContainer: true,
        ignoreElements: (element) => {
          return element.classList.contains('page-guide') || 
                 element.classList.contains('preview-actions') ||
                 element.classList.contains('section-navigation');
        },
        // Better text rendering
        letterRendering: true,
        // Optimize canvas for better quality
        canvasWidth: element.scrollWidth * targetScale,
        canvasHeight: element.scrollHeight * targetScale,
        // Enhanced rendering options
        onclone: (clonedDoc) => {
          // Optimize cloned document for better rendering
          const clonedElement = clonedDoc.querySelector('.resume-preview');
          if (clonedElement) {
            // Ensure fonts are loaded and optimized
            clonedElement.style.fontSmoothing = 'antialiased';
            clonedElement.style.webkitFontSmoothing = 'antialiased';
            // Optimize text rendering
            const textElements = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
            textElements.forEach(el => {
              el.style.textRendering = 'optimizeLegibility';
              el.style.fontFeatureSettings = '"liga" 1, "kern" 1';
            });
          }
        }
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

      // Enhanced white space detection for better page breaks
      const ctxFull = canvas.getContext('2d');
      const isRowMostlyWhite = (rowY) => {
        if (rowY < 0 || rowY >= canvas.height) return true;
        const sample = ctxFull.getImageData(0, rowY, canvas.width, 1).data;
        let nonWhite = 0;
        for (let i = 0; i < sample.length; i += 12) { // More precise sampling
          const r = sample[i], g = sample[i + 1], b = sample[i + 2];
          if (r < 240 || g < 240 || b < 240) { nonWhite++; if (nonWhite > 1) return false; }
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
        const searchRange = 40; // Increased search range for better breaks
        let found = false;
        for (let dy = 0; dy <= searchRange; dy++) {
          const row = cut - dy;
          if (row <= y + 12) break;
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
          // fallback at least 32px to progress and avoid infinite loop
          safeCut = Math.min(y + Math.max(32, contentHeightPx), canvas.height);
        }

        const sliceHeight = Math.max(1, safeCut - y);

        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = topPx + sliceHeight + bottomPx;

        // Enhanced canvas rendering for better quality
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';
        
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

        // Smart JPEG compression based on content
        let jpegQuality = settings.jpegQuality;
        
        // Adjust quality based on content complexity
        const contentComplexity = analyzePageContent(pageCtx, pageCanvas.width, pageCanvas.height);
        if (contentComplexity === 'high') {
          jpegQuality = Math.min(0.95, jpegQuality + 0.05); // Slightly higher quality for complex content
        } else if (contentComplexity === 'low') {
          jpegQuality = Math.max(0.75, jpegQuality - 0.05); // Slightly lower quality for simple content
        }

        // Additional quality optimization for text-heavy areas
        const textDensity = calculateTextDensity(pageCtx, pageCanvas.width, pageCanvas.height);
        if (textDensity > 0.4) {
          jpegQuality = Math.min(0.96, jpegQuality + 0.03); // Higher quality for text-heavy areas
        }

        // Use optimized JPEG format with smart quality adjustment
        const imgData = pageCanvas.toDataURL('image/jpeg', jpegQuality);
        const imgWidthPt = pageWidthPt;
        const imgHeightPt = (pageCanvas.height / canvas.width) * pageWidthPt;

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidthPt, imgHeightPt);

        y = safeCut;
        pageIndex += 1;
      }

      const name = resumeData.contact.fullName ? resumeData.contact.fullName.replace(/\s+/g, '_') : 'resume';
      
      // Get PDF as blob to check file size
      const pdfBlob = pdf.output('blob');
      const fileSizeMB = (pdfBlob.size / (1024 * 1024)).toFixed(2);
      
      // Save the PDF
      pdf.save(`${name}.pdf`);
      
      // Show quality info and file size to user
      const sizeMessage = fileSizeMB <= 2 
        ? `✅ PDF generated successfully! File size: ${fileSizeMB}MB (under 2MB limit)`
        : `⚠️ PDF generated but file size (${fileSizeMB}MB) exceeds 2MB limit. Consider using "Small File" option.`;
      
      console.log(`${settings.description} - ${sizeMessage}`);
      
      // Show user-friendly alert
      if (fileSizeMB <= 2) {
        alert(`PDF downloaded successfully!\n\nQuality: ${settings.description}\nFile size: ${fileSizeMB}MB\n\n✅ File size is under 2MB limit.\n🎯 High clarity maintained with optimized compression.`);
      } else {
        alert(`PDF downloaded successfully!\n\nQuality: ${settings.description}\nFile size: ${fileSizeMB}MB\n\n⚠️ File size exceeds 2MB limit.\n💡 Tip: Use "Small File" option for smaller file sizes.\n🎯 Quality can be maintained with "Standard Quality" option.`);
      }
    } finally {
      // Restore guides
      guides.forEach((g, i) => { g.style.display = prevDisplays[i] || ''; });
    }
  };

  // Function to analyze page content complexity for smart quality adjustment
  const analyzePageContent = (ctx, width, height) => {
    const sampleSize = 100; // Sample 100 pixels
    let textPixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      
      // Check if pixel is likely text
      //  pure white)
      if (pixel[0] < 250 || pixel[1] < 250 || pixel[2] < 250) {
        textPixels++;
      }
      totalPixels++;
    }
    
    const textRatio = textPixels / totalPixels;
    
    if (textRatio > 0.3) return 'high';      // Lots of text/content
    if (textRatio > 0.1) return 'medium';    // Moderate content
    return 'low';                             // Mostly white space
  };

  // Function to calculate text density on a page
  const calculateTextDensity = (ctx, width, height) => {
    const sampleSize = 1000; // Sample more pixels for better density estimation
    let textPixels = 0;
    let totalPixels = 0;

    for (let i = 0; i < sampleSize; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const pixel = ctx.getImageData(x, y, 1, 1).data;

      // Check if pixel is likely text (not pure white)
      if (pixel[0] < 250 || pixel[1] < 250 || pixel[2] < 250) {
        textPixels++;
      }
      totalPixels++;
    }

    return textPixels / totalPixels;
  };

  const printResume = () => {
    window.print();
  };

  const exportPlainText = () => {
    const lines = [];
    const push = (t = '') => lines.push(String(t));
    const joinAchievements = (arr) => (arr || []).map((a) => `- ${a}`).join('\n');

    const c = resumeData.contact || {};
    push(c.fullName || '');
    push([c.email, c.phone, c.location, c.linkedIn].filter(Boolean).join(' | '));
    push('');

    if (resumeData.summary) {
      push('Summary');
      push(resumeData.summary.replace(/<[^>]+>/g, ''));
      push('');
    }

    if (Array.isArray(resumeData.experience) && resumeData.experience.length) {
      push('Experience');
      resumeData.experience.forEach((e) => {
        push(`${e.title || ''} - ${e.company || ''}${e.location ? `, ${e.location}` : ''}`.trim());
        push(`${e.startDate || ''} - ${e.endDate || ''}`.trim());
        const ach = joinAchievements(e.achievements);
        if (ach) push(ach);
        push('');
      });
    }

    if (Array.isArray(resumeData.projects) && resumeData.projects.length) {
      push('Projects');
      resumeData.projects.forEach((p) => {
        push(`${p.name || ''}${p.role ? ` - ${p.role}` : ''}`.trim());
        if (p.link) push(p.link);
        if (p.description) push(p.description.replace(/<[^>]+>/g, ''));
        push('');
      });
    }

    if (Array.isArray(resumeData.education) && resumeData.education.length) {
      push('Education');
      resumeData.education.forEach((e) => {
        push(`${e.degree || ''} - ${e.school || ''}${e.location ? `, ${e.location}` : ''}`.trim());
        if (e.graduationDate) push(e.graduationDate);
        push('');
      });
    }

    const skills = resumeData.skills || { technical: [], soft: [], other: [] };
    const all = [...(skills.technical || []), ...(skills.soft || []), ...(skills.other || [])];
    if (all.length) {
      push('Skills');
      push(all.join(', '));
      push('');
    }

    if (Array.isArray(resumeData.websites) && resumeData.websites.length) {
      push('Websites');
      resumeData.websites.forEach((w) => push([w.label, w.url].filter(Boolean).join(': ')));
      push('');
    }

    const text = lines.join('\n').trim();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(c.fullName || 'resume').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allSkills = [
    ...resumeData.skills.technical, 
    ...resumeData.skills.soft, 
    ...resumeData.skills.other
  ];

  const renderSectionByKey = (key) => {
    const getSectionTitle = (sectionKey) => {
      return resumeData.sectionNames?.[sectionKey] || getDefaultSectionTitle(sectionKey);
    };

    const getDefaultSectionTitle = (sectionKey) => {
      const defaultTitles = {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        websites: 'Websites & Links'
      };
      return defaultTitles[sectionKey] || sectionKey;
    };

    switch (key) {
      case 'summary':
        return resumeData.summary && (
          <div className="resume-section" key="summary">
            <h2>{getSectionTitle('summary')}</h2>
            <div dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
          </div>
        );
      case 'experience':
        return resumeData.experience.length > 0 && (
          <div className="resume-section" key="experience">
            <h2>{getSectionTitle('experience')}</h2>
            {resumeData.experience.map(exp => (
              <div key={exp.id} className="experience-entry">
                <div className="entry-header">
                  <div>
                    <div className="entry-title">{exp.title}</div>
                    <div className="entry-company">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                  </div>
                  <div className="entry-date" style={{ textAlign: dateAlign, marginLeft: dateAlign === 'right' ? 'auto' : 0 }}>{exp.startDate} - {exp.endDate}</div>
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
            <h2>{getSectionTitle('projects')}</h2>
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
                      {atsFriendly ? (
                        <span className="project-link" title={project.link}>{project.link}</span>
                      ) : (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="project-link"
                          title={project.link}
                        >
                          {project.link}
                        </a>
                      )}
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
            <h2>{getSectionTitle('education')}</h2>
            {resumeData.education.map(edu => (
              <div key={edu.id} className="education-entry">
                <div className="entry-header">
                  <div>
                    <div className="entry-title">{edu.degree}</div>
                    <div className="entry-company">
                      {edu.school}{edu.location ? `, ${edu.location}` : ''}
                    </div>
                  </div>
                  <div className="entry-date" style={{ textAlign: dateAlign, marginLeft: dateAlign === 'right' ? 'auto' : 0 }}>{edu.graduationDate}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'skills':
        return allSkills.length > 0 && (
          <div className="resume-section" key="skills">
            <h2>{getSectionTitle('skills')}</h2>
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
            <h2>{getSectionTitle('websites')}</h2>
            <div className="website-links">
              {resumeData.websites.map(item => (
                <div key={item.id || item.url} className="website-item">
                  {item.label && <span className="website-label">{item.label}:</span>}
                  {item.url && (
                    atsFriendly ? (
                      <span className="website-url" title={item.url}>{item.url}</span>
                    ) : (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-url"
                        title={item.url}
                      >
                        {item.url}
                      </a>
                    )
                  )}
                </div>
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
                  <div className="custom-section-content">
                    {sec.items.map((it, idx) => (
                      <div key={idx} className={`custom-section-item-preview separator-${sec.separator || 'dots'}`}>
                        {sec.separator !== 'none' && (
                          <span className="preview-separator">
                            {sec.separator === 'dots' && '•'}
                            {sec.separator === 'lines' && '▬'}
                            {sec.separator === 'arrows' && '▶'}
                            {sec.separator === 'circles' && '●'}
                            {sec.separator === 'stars' && '★'}
                            {sec.separator === 'hearts' && '♥'}
                            {sec.separator === 'diamonds' && '♦'}
                            {sec.separator === 'squares' && '■'}
                            {sec.separator === 'triangles' && '▲'}
                          </span>
                        )}
                        <div className="preview-content" dangerouslySetInnerHTML={{ __html: it }} />
                      </div>
                    ))}
                  </div>
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
      
      {/* Theme indicator for debugging */}
      <div style={{ 
        padding: '8px 16px', 
        background: '#f0f0f0', 
        borderRadius: '8px', 
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
      }}>
        Current Theme: <strong>{theme}</strong>
      </div>
      
      <div 
        className={`resume-preview ${atsFriendly ? 'ats-friendly' : ''} theme-${theme}`}
        style={{ 
          position: 'relative',
          ['--resume-font-family']: fontFamily,
          ['--resume-font-size']: `${fontSize}px`,
          ['--resume-line-height']: lineHeight,
          ['--resume-heading-size']: `${headingSize}px`,
          ['--resume-heading-transform']: atsFriendly ? 'none' : headingCase,
          ['--resume-accent-color']: atsFriendly ? '#000000' : accentColor,
          ['--resume-bullet-style']: bulletStyle,
          ['--resume-bullet-symbol']: `'${bulletSymbol}'`,
          ['--resume-date-align']: dateAlign,
          ['--resume-section-divider-style']: atsFriendly ? 'solid' : dividerStyle
        }}
      >
        <div className="resume-header">
          <h1>{resumeData.contact.fullName || 'Your Name'}</h1>
          <div className="contact-info">
            {resumeData.contact.phone && <span>{resumeData.contact.phone}</span>}
            {resumeData.contact.email && (
              <a 
                href={`mailto:${resumeData.contact.email}`}
                className="contact-link"
                title={resumeData.contact.email}
              >
                {resumeData.contact.email}
              </a>
            )}
            {resumeData.contact.location && <span>{resumeData.contact.location}</span>}
            {resumeData.contact.linkedIn && (
              <a 
                href={resumeData.contact.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
                title={resumeData.contact.linkedIn}
              >
                {resumeData.contact.linkedIn}
              </a>
            )}
          </div>
        </div>

        {/* Body wrapper for themes that need layout */}
        <div className="resume-body">
          {/* Single column layout that respects step order */}
          <div className="resume-content" style={{ gap: `${sectionGap}px` }}>
            {console.log('Steps in PreviewSection:', steps)}
            {console.log('Filtered steps for rendering:', steps.filter(s => ['summary', 'experience', 'projects', 'education', 'skills', 'websites', 'custom'].includes(s)))}
            {steps.filter(s => ['summary', 'experience', 'projects', 'education', 'skills', 'websites', 'custom'].includes(s)).map(renderSectionByKey)}
          </div>
        </div>

        {showGuides && !atsFriendly && pageGuides.map((y, idx) => (
          <div key={idx} className="page-guide" style={{ position: 'absolute', left: 0, right: 0, top: y, height: 0, borderTop: '1px dashed var(--color-border)', pointerEvents: 'none' }} />
        ))}
      </div>
      
      <div className="preview-actions">
        <button className="btn btn--outline btn--lg" onClick={() => setIsStyleModalOpen(true)}>
          Style & Layout
        </button>
        <button className="btn btn--outline btn--lg" onClick={() => setIsDownloadModalOpen(true)}>
          📥 Download & Export
        </button>
      </div>

      {isStyleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStyleModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Style & Layout</h3>
              <button className="modal-close" onClick={() => setIsStyleModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="layout-options">
                <h4>Layout Settings</h4>
                <div className="gap-control">
                  <label htmlFor="section-gap">
                    Section Gap: <span className="gap-value">{sectionGap}px</span>
                  </label>
                  <input
                    type="range"
                    id="section-gap"
                    min="8"
                    max="48"
                    step="4"
                    value={sectionGap}
                    onChange={(e) => setSectionGap(parseInt(e.target.value))}
                    className="gap-slider"
                  />
                  <div className="gap-presets">
                    <button 
                      className={`btn btn--sm ${sectionGap === 12 ? 'btn--primary' : 'btn--outline'}`}
                      onClick={() => setSectionGap(12)}
                    >
                      Compact
                    </button>
                    <button 
                      className={`btn btn--sm ${sectionGap === 24 ? 'btn--primary' : 'btn--outline'}`}
                      onClick={() => setSectionGap(24)}
                    >
                      Standard
                    </button>
                    <button 
                      className={`btn btn--sm ${sectionGap === 36 ? 'btn--primary' : 'btn--outline'}`}
                      onClick={() => setSectionGap(36)}
                    >
                      Spacious
                    </button>
                  </div>
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Font Family</label>
                    <select className="form-control" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                      <option value="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">Inter / System</option>
                      <option value="Georgia, Times New Roman, Times, serif">Serif (Georgia)</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="Arial, Helvetica, sans-serif">Arial</option>
                      <option value="'Calibri', 'Segoe UI', Arial, sans-serif">Calibri</option>
                      <option value="'Garamond', 'Times New Roman', serif">Garamond</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Base Font Size</label>
                    <input className="form-control" type="number" min={12} max={20} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 16)} />
                  </div>
                  <div>
                    <label className="form-label">Line Height</label>
                    <input className="form-control" type="number" min={1.2} max={2} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value) || 1.4)} />
                  </div>
                  <div>
                    <label className="form-label">Heading Size</label>
                    <input className="form-control" type="number" min={14} max={28} value={headingSize} onChange={(e) => setHeadingSize(parseInt(e.target.value) || 18)} />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Heading Case</label>
                    <select className="form-control" value={headingCase} onChange={(e) => setHeadingCase(e.target.value)}>
                      <option value="none">None</option>
                      <option value="capitalize">Capitalize</option>
                      <option value="uppercase">Uppercase</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Accent Color</label>
                    <input className="form-control" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Divider Style</label>
                    <select className="form-control" value={dividerStyle} onChange={(e) => setDividerStyle(e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Dates Alignment</label>
                    <select className="form-control" value={dateAlign} onChange={(e) => setDateAlign(e.target.value)}>
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Bullet Style</label>
                    <select className="form-control" value={bulletStyle} onChange={(e) => setBulletStyle(e.target.value)}>
                      <option value="disc">Disc</option>
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Custom Bullet Symbol</label>
                    <input className="form-control" type="text" maxLength={3} value={bulletSymbol} onChange={(e) => setBulletSymbol(e.target.value || '•')} />
                  </div>
                </div>

                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} />
                    Show page guides
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={atsFriendly} onChange={(e) => setAtsFriendly(e.target.checked)} />
                    ATS-friendly mode
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--primary" onClick={() => setIsStyleModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Download & Export Modal */}
      {isDownloadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDownloadModalOpen(false)}>
          <div className="modal download-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📥 Download & Export Options</h3>
              <p className="modal-subtitle">Choose how you'd like to save or share your resume</p>
              <button className="modal-close" onClick={() => setIsDownloadModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {/* PDF Download Section */}
              <div className="download-section">
                <h4>📄 PDF Download</h4>
                <p className="section-description">Download your resume as a professional PDF document</p>
                
                <div className="pdf-quality-options">
                  <div className="quality-option">
                    <button 
                      className="btn btn--success btn--lg quality-btn" 
                      onClick={() => {
                        generateTextBasedPdf();
                        setIsDownloadModalOpen(false);
                      }}
                    >
                      <div className="quality-header">
                        <span className="quality-icon">🎯</span>
                        <span className="quality-title">Styled Text PDF</span>
                      </div>
                      <div className="quality-details">
                        <span className="file-size">~100-200KB</span>
                        <span className="clarity-level">Professional + ATS</span>
                      </div>
                      <div className="quality-badge ats-badge">Best of Both</div>
                    </button>
                  </div>
                  
                  <div className="quality-option">
                    <button 
                      className="btn btn--primary btn--lg quality-btn" 
                      onClick={() => {
                        generateImageBasedPdf('standard');
                        setIsDownloadModalOpen(false);
                      }}
                    >
                      <div className="quality-header">
                        <span className="quality-icon">🎨</span>
                        <span className="quality-title">Standard Quality</span>
                      </div>
                      <div className="quality-details">
                        <span className="file-size">{estimateFileSize('standard')}</span>
                        <span className="clarity-level">{getClarityLevel('standard')} Clarity</span>
                      </div>
                      <div className="quality-badge">Visual Format</div>
                    </button>
                  </div>
                  
                  <div className="quality-option">
                    <button 
                      className="btn btn--outline btn--lg quality-btn" 
                      onClick={() => {
                        generateImageBasedPdf('small');
                        setIsDownloadModalOpen(false);
                      }}
                    >
                      <div className="quality-header">
                        <span className="quality-icon">📱</span>
                        <span className="quality-title">Small File</span>
                      </div>
                      <div className="quality-details">
                        <span className="file-size">{estimateFileSize('small')}</span>
                        <span className="clarity-level">{getClarityLevel('small')} Clarity</span>
                      </div>
                      <div className="quality-badge">Email Friendly</div>
                    </button>
                  </div>
                  
                  <div className="quality-option">
                    <button 
                      className="btn btn--outline btn--lg quality-btn" 
                      onClick={() => {
                        generateImageBasedPdf('high');
                        setIsDownloadModalOpen(false);
                      }}
                    >
                      <div className="quality-header">
                        <span className="quality-icon">✨</span>
                        <span className="quality-title">High Quality</span>
                      </div>
                      <div className="quality-details">
                        <span className="file-size">{estimateFileSize('high')}</span>
                        <span className="clarity-level">{getClarityLevel('high')} Clarity</span>
                      </div>
                      <div className="quality-badge">Print Ready</div>
                    </button>
                  </div>
                </div>
                
                <div className="quality-info">
                  <div className="pdf-type-explanation">
                    <h5>📋 PDF Format Guide:</h5>
                    <div className="format-info">
                      <div className="format-item">
                        <span className="format-badge text-based">Styled Text PDF</span>
                        <span className="format-desc">Professional styling with selectable text. Perfect for job applications - maintains visual appeal while ensuring ATS compatibility.</span>
                      </div>
                      <div className="format-item">
                        <span className="format-badge visual">Image Format</span>
                        <span className="format-desc">Pixel-perfect visual rendering of your resume design. Best for printing, portfolios, and when exact formatting is critical.</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="file-size-note">
                    💡 <strong>Recommendation:</strong> Use Styled Text PDF for job applications (best of both worlds), Image Format for printing
                  </p>
                  <p className="file-size-limit">
                    📋 <strong>File Size Limit:</strong> Maximum 2MB for most email systems and job portals
                  </p>
                  <p className="content-complexity">
                    📊 <strong>Content Analysis:</strong> {getContentBasedEstimate()}
                  </p>
                </div>
              </div>

              {/* Export Options Section */}
              <div className="download-section">
                <h4>📤 Export Options</h4>
                <p className="section-description">Export your resume in different formats for various use cases</p>
                
                <div className="export-options">
                  <button 
                    className="btn btn--outline btn--lg export-btn"
                    onClick={() => {
                      exportPlainText();
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    <span className="export-icon">📝</span>
                    <div className="export-content">
                      <span className="export-title">Plain Text</span>
                      <span className="export-description">Simple text format for ATS systems</span>
                    </div>
                  </button>
                  
                  <button 
                    className="btn btn--outline btn--lg export-btn"
                    onClick={() => {
                      onExportJson();
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    <span className="export-icon">💾</span>
                    <div className="export-content">
                      <span className="export-title">JSON Data</span>
                      <span className="export-description">Raw data for backup or import</span>
                    </div>
                  </button>
                  
                  <button 
                    className="btn btn--outline btn--lg export-btn"
                    onClick={() => {
                      printResume();
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    <span className="export-icon">🖨️</span>
                    <div className="export-content">
                      <span className="export-title">Print</span>
                      <span className="export-description">Send to printer or save as PDF</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="download-section">
                <h4>⚡ Quick Actions</h4>
                <p className="section-description">Common actions for your resume</p>
                
                <div className="quick-actions">
                  <button 
                    className="btn btn--outline btn--sm quick-btn"
                    onClick={() => {
                      window.open('mailto:?subject=My Resume&body=Please find my resume attached.', '_blank');
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    📧 Email Resume
                  </button>
                  
                  <button 
                    className="btn btn--outline btn--sm quick-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    🔗 Copy Link
                  </button>
                  
                  <button 
                    className="btn btn--outline btn--sm quick-btn"
                    onClick={() => {
                      const element = document.querySelector('.resume-preview');
                      if (element) {
                        html2canvas(element, { scale: 2 }).then(canvas => {
                          const link = document.createElement('a');
                          link.download = 'resume-screenshot.png';
                          link.href = canvas.toDataURL();
                          link.click();
                        });
                      }
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    📸 Screenshot
                  </button>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn--outline" onClick={() => setIsDownloadModalOpen(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={() => setIsDownloadModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PreviewSection;
