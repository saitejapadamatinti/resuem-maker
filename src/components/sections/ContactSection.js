import React from 'react';

function ContactSection({ data, onUpdate }) {
  const handleInputChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <section className="section active">
      <h2>Contact Information</h2>
      <p className="section-description">Enter your basic contact details</p>
      
      <form className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name *</label>
          <input 
            type="text" 
            className="form-control" 
            id="fullName" 
            value={data.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={data.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number *</label>
          <input 
            type="tel" 
            className="form-control" 
            id="phone" 
            value={data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="location">City, State *</label>
          <input 
            type="text" 
            className="form-control" 
            id="location" 
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group span-2">
          <label className="form-label" htmlFor="linkedIn">LinkedIn URL</label>
          <input 
            type="url" 
            className="form-control" 
            id="linkedIn" 
            value={data.linkedIn || ''}
            onChange={(e) => handleInputChange('linkedIn', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </form>
    </section>
  );
}

export default ContactSection;
