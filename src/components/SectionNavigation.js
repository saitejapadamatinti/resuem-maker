import React from 'react';

function SectionNavigation({ currentStep, totalSteps, onPrevious, onNext }) {
  return (
    <div className="section-navigation">
      <button 
        className="btn btn--outline" 
        onClick={onPrevious}
        style={{ display: currentStep === 0 ? 'none' : 'inline-flex' }}
      >
        Previous
      </button>
      <button 
        className="btn btn--primary" 
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
      >
        {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
      </button>
    </div>
  );
}

export default SectionNavigation;
