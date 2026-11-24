import React from 'react';

function ContactSection({ data = {}, onUpdate }) {
  const handleInputChange = (field, value) => onUpdate({ ...data, [field]: value });
  const fields = [
    { name: 'fullName', label: 'Full name', type: 'text', required: true, placeholder: 'e.g. Alex Morgan', span: 'span-2' },
    { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'alex@email.com' },
    { name: 'phone', label: 'Phone number', type: 'tel', required: true, placeholder: '+91 98765 43210' },
    { name: 'location', label: 'City, State, Country', type: 'text', placeholder: 'Hyderabad, Telangana, India', span: 'span-2' },
    { name: 'linkedIn', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/yourprofile', span: 'span-2' },
    { name: 'website', label: 'Portfolio / Website', type: 'url', placeholder: 'https://yourportfolio.com', span: 'span-2' },
    { name: 'headline', label: 'Target job title', type: 'text', placeholder: 'Frontend Developer', span: 'span-2' }
  ];

  return (
    <section className="section active">
      <p className="eyebrow">STEP 01 · YOUR PROFILE</p>
      <h2>Contact Information</h2>
      <p className="section-description">Use professional contact details. Keep your location concise; a full street address is not needed.</p>
      <div className="form-grid">
        {fields.map(field => <div className={`form-group ${field.span || ''}`} key={field.name}>
          <label className="form-label" htmlFor={field.name}>{field.label}{field.required ? ' *' : ''}</label>
          <input className="form-control" id={field.name} type={field.type} value={data[field.name] || ''} required={field.required || false} placeholder={field.placeholder} onChange={event => handleInputChange(field.name, event.target.value)} />
        </div>)}
      </div>
    </section>
  );
}

export default ContactSection;
