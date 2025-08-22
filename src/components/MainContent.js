import React from 'react';
import ContactSection from './sections/ContactSection';
import WebsitesSection from './sections/WebsitesSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import CustomSectionsSection from './sections/CustomSectionsSection';
import SkillsSection from './sections/SkillsSection';
import PreviewSection from './sections/PreviewSection';
import SectionNavigation from './SectionNavigation';

function MainContent({ steps, currentStep, resumeData, onUpdateData, onStepChange, onExportJson }) {
  const renderSection = () => {
    const step = steps[currentStep];
    switch (step) {
      case 'contact':
        return (
          <ContactSection 
            data={resumeData.contact}
            onUpdate={(data) => onUpdateData('contact', data)}
          />
        );
      case 'websites':
        return (
          <WebsitesSection 
            data={resumeData.websites}
            onUpdate={(data) => onUpdateData('websites', data)}
          />
        );
      case 'summary':
        return (
          <SummarySection 
            data={resumeData.summary}
            onUpdate={(data) => onUpdateData('summary', data)}
          />
        );
      case 'experience':
        return (
          <ExperienceSection 
            data={resumeData.experience}
            onUpdate={(data) => onUpdateData('experience', data)}
          />
        );
      case 'education':
        return (
          <EducationSection 
            data={resumeData.education}
            onUpdate={(data) => onUpdateData('education', data)}
          />
        );
      case 'projects':
        return (
          <ProjectsSection 
            data={resumeData.projects}
            onUpdate={(data) => onUpdateData('projects', data)}
          />
        );
      case 'custom':
        return (
          <CustomSectionsSection 
            data={resumeData.customSections}
            onUpdate={(data) => onUpdateData('customSections', data)}
          />
        );
      case 'skills':
        return (
          <SkillsSection 
            data={resumeData.skills}
            onUpdate={(data) => onUpdateData('skills', data)}
          />
        );
      case 'preview':
        return (
          <PreviewSection 
            steps={steps}
            resumeData={resumeData}
            onExportJson={onExportJson}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      {renderSection()}
      <SectionNavigation 
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={() => onStepChange(currentStep - 1)}
        onNext={() => onStepChange(currentStep + 1)}
      />
    </main>
  );
}

export default MainContent;
