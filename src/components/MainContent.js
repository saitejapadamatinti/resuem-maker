import React from 'react';
import UsageGuide from './UsageGuide';
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

function MainContent({ steps, currentStep, resumeData, onUpdateData, onStepChange, onExportJson, theme }) {
  const renderSection = () => {
    const step = steps[currentStep];
    switch (step) {
      case 'usage-guide':
        return <UsageGuide />;
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
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
          />
        );
      case 'summary':
        return (
          <SummarySection 
            data={resumeData.summary}
            onUpdate={(data) => onUpdateData('summary', data)}
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
            resumeData={resumeData}
          />
        );
      case 'experience':
        return (
          <ExperienceSection 
            data={resumeData.experience}
            onUpdate={(data) => onUpdateData('experience', data)}
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
          />
        );
      case 'education':
        return (
          <EducationSection 
            data={resumeData.education}
            onUpdate={(data) => onUpdateData('education', data)}
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
          />
        );
      case 'projects':
        return (
          <ProjectsSection 
            data={resumeData.projects}
            onUpdate={(data) => onUpdateData('projects', data)}
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
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
            sectionNames={resumeData.sectionNames}
            onUpdateSectionNames={(key, value) => {
              const updatedSectionNames = { ...resumeData.sectionNames, [key]: value };
              onUpdateData('sectionNames', updatedSectionNames);
            }}
          />
        );
      case 'preview':
        return (
          <PreviewSection 
            steps={steps}
            resumeData={resumeData}
            onExportJson={onExportJson}
            theme={theme}
            onUpdateData={onUpdateData}
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
