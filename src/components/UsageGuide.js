import React from 'react';

const UsageGuide = () => {
  return (
    <div className="usage-guide">
      <div className="guide-header">
        <h1>How to Use Your ATS Resume Builder</h1>
        <p className="guide-subtitle">
          Follow this step-by-step guide to create a professional, ATS-optimized resume
        </p>
      </div>

      <div className="guide-content">
        {/* Getting Started Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">1</div>
            <h2>Getting Started</h2>
          </div>
          <div className="section-content">
            <div className="info-card">
              <h3>Welcome to Your Resume Builder</h3>
              <p>
                This application is designed to help you create a professional resume that passes 
                Applicant Tracking Systems (ATS) while maintaining a polished, human-readable format.
              </p>
              <div className="feature-highlights">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>ATS-Optimized Formatting</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📝</span>
                  <span>Rich Text Editor</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <span>Real-time ATS Scoring</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💾</span>
                  <span>Auto-save & Export</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">2</div>
            <h2>Contact Information</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Fill in Your Basic Details</h3>
              <p>Start with your personal contact information:</p>
              <ul className="step-list">
                <li><strong>Full Name:</strong> Use your legal name as it appears on official documents</li>
                <li><strong>Email:</strong> Use a professional email address</li>
                <li><strong>Phone:</strong> Include your primary contact number</li>
                <li><strong>Location:</strong> City and State (no need for full address)</li>
                <li><strong>LinkedIn:</strong> Professional profile URL (optional but recommended)</li>
              </ul>
              <div className="tip-box">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>Pro Tip:</strong> Ensure your email and phone are current and professional. 
                  Avoid using personal or outdated contact information.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Summary Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">3</div>
            <h2>Professional Summary</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Craft Your Professional Story</h3>
              <p>Write a compelling summary that highlights your key strengths:</p>
              <ul className="step-list">
                <li><strong>Length:</strong> 3-4 sentences (150-200 words)</li>
                <li><strong>Focus:</strong> Your professional identity and career goals</li>
                <li><strong>Keywords:</strong> Include industry-specific terms</li>
                <li><strong>Tone:</strong> Professional yet engaging</li>
              </ul>
              <div className="example-box">
                <h4>Example Summary:</h4>
                <p className="example-text">
                  "Results-driven software engineer with 5+ years of experience developing scalable 
                  web applications using React, Node.js, and cloud technologies. Proven track record 
                  of leading cross-functional teams and delivering projects on time. Passionate about 
                  clean code, user experience, and staying current with emerging technologies."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">4</div>
            <h2>Work Experience</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Showcase Your Professional Journey</h3>
              <p>Detail your work history with specific achievements:</p>
              <ul className="step-list">
                <li><strong>Company & Title:</strong> Full company name and your job title</li>
                <li><strong>Dates:</strong> Month/Year format (e.g., "Jan 2022 - Present")</li>
                <li><strong>Location:</strong> City, State or Remote</li>
                <li><strong>Description:</strong> Brief overview of your role</li>
                <li><strong>Achievements:</strong> Quantifiable results and accomplishments</li>
              </ul>
              <div className="achievement-tips">
                <h4>Writing Strong Achievements:</h4>
                <ul>
                  <li>Use action verbs (developed, implemented, increased, reduced)</li>
                  <li>Include specific numbers and percentages</li>
                  <li>Focus on impact and results</li>
                  <li>Use industry-relevant keywords</li>
                </ul>
              </div>
              <div className="tip-box">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>Pro Tip:</strong> Use the rich text editor to format your achievements 
                  with bullet points and emphasis. This helps both ATS systems and human readers.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">5</div>
            <h2>Education</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Highlight Your Academic Background</h3>
              <p>Include your educational qualifications:</p>
              <ul className="step-list">
                <li><strong>Degree:</strong> Full degree name (e.g., "Bachelor of Science in Computer Science")</li>
                <li><strong>Institution:</strong> Full university/college name</li>
                <li><strong>Graduation Date:</strong> Month/Year or "Expected [Month] [Year]"</li>
                <li><strong>GPA:</strong> Include if 3.5+ (optional)</li>
                <li><strong>Relevant Coursework:</strong> List key courses related to your target role</li>
              </ul>
              <div className="tip-box">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>Pro Tip:</strong> If you're a recent graduate, place education before experience. 
                  For experienced professionals, education typically goes after experience.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">6</div>
            <h2>Skills & Competencies</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Showcase Your Technical & Soft Skills</h3>
              <p>Organize your skills into relevant categories:</p>
              <ul className="step-list">
                <li><strong>Technical Skills:</strong> Programming languages, tools, software</li>
                <li><strong>Soft Skills:</strong> Communication, leadership, problem-solving</li>
                <li><strong>Industry Skills:</strong> Domain-specific knowledge</li>
                <li><strong>Certifications:</strong> Professional certifications and licenses</li>
              </ul>
              <div className="skills-strategy">
                <h4>Skills Strategy:</h4>
                <ul>
                  <li>Use the skill suggestions to find relevant keywords</li>
                  <li>Prioritize skills mentioned in your target job descriptions</li>
                  <li>Group related skills together for better organization</li>
                  <li>Keep the list focused and relevant to your target role</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">7</div>
            <h2>Projects & Portfolio</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Demonstrate Your Work</h3>
              <p>Showcase relevant projects that highlight your skills:</p>
              <ul className="step-list">
                <li><strong>Project Name:</strong> Clear, descriptive title</li>
                <li><strong>Description:</strong> What the project does and your role</li>
                <li><strong>Technologies:</strong> Tools and technologies used</li>
                <li><strong>Outcome:</strong> Results and impact of the project</li>
                <li><strong>Links:</strong> GitHub, live demo, or portfolio links</li>
              </ul>
              <div className="tip-box">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>Pro Tip:</strong> Focus on projects that demonstrate skills relevant to 
                  your target position. Quality over quantity - 3-5 strong projects are better than 10 mediocre ones.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ATS Optimization Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">8</div>
            <h2>ATS Optimization</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Maximize Your ATS Score</h3>
              <p>Use the ATS panel to optimize your resume:</p>
              <ul className="step-list">
                <li><strong>Real-time Scoring:</strong> Monitor your ATS compatibility score</li>
                <li><strong>Keyword Analysis:</strong> Identify missing important keywords</li>
                <li><strong>Formatting Tips:</strong> Get suggestions for better ATS parsing</li>
                <li><strong>Industry Insights:</strong> Learn what recruiters are looking for</li>
              </ul>
              <div className="ats-tips">
                <h4>ATS Best Practices:</h4>
                <ul>
                  <li>Use standard section headings (Experience, Education, Skills)</li>
                  <li>Include relevant keywords from job descriptions</li>
                  <li>Avoid tables, graphics, or complex formatting</li>
                  <li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
                  <li>Keep formatting simple and clean</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Preview & Export Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">9</div>
            <h2>Preview & Export</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Final Review & Download</h3>
              <p>Review your resume and export in the right format:</p>
              <ul className="step-list">
                <li><strong>Preview:</strong> Review how your resume looks in different themes</li>
                <li><strong>Theme Selection:</strong> Choose from professional, modern, elegant, or compact styles</li>
                <li><strong>Format Check:</strong> Ensure proper spacing and readability</li>
                <li><strong>Export Options:</strong> Download as PDF for best compatibility</li>
              </ul>
              <div className="export-tips">
                <h4>Export Guidelines:</h4>
                <ul>
                  <li><strong>PDF Format:</strong> Best for ATS systems and professional appearance</li>
                  <li><strong>File Naming:</strong> Use format: "FirstName_LastName_Resume.pdf"</li>
                  <li><strong>File Size:</strong> Keep under 5MB for easy uploading</li>
                  <li><strong>Print Test:</strong> Print a copy to check formatting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final Steps Section */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">10</div>
            <h2>Final Steps</h2>
          </div>
          <div className="section-content">
            <div className="step-card">
              <h3>Ready to Apply!</h3>
              <p>Before submitting your resume:</p>
              <ul className="step-list">
                <li><strong>Proofread:</strong> Check for spelling and grammar errors</li>
                <li><strong>Customize:</strong> Tailor keywords for each specific job application</li>
                <li><strong>Test:</strong> Upload to job sites to test ATS compatibility</li>
                <li><strong>Backup:</strong> Save your work for future updates</li>
              </ul>
              <div className="success-box">
                <span className="success-icon">🎉</span>
                <div>
                  <strong>Congratulations!</strong> You've created a professional, ATS-optimized resume. 
                  Remember to update it regularly as you gain new skills and experience.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="guide-section">
          <div className="section-header">
            <div className="step-number">📋</div>
            <h2>Quick Reference</h2>
          </div>
          <div className="section-content">
            <div className="quick-reference">
              <div className="reference-grid">
                <div className="reference-item">
                  <h4>Navigation</h4>
                  <p>Use the sidebar to move between sections. The progress bar shows your completion status.</p>
                </div>
                <div className="reference-item">
                  <h4>Auto-save</h4>
                  <p>Your work is automatically saved as you type. No need to worry about losing progress.</p>
                </div>
                <div className="reference-item">
                  <h4>Rich Text</h4>
                  <p>Use the rich text editor to format your content with bullets, bold text, and emphasis.</p>
                </div>
                <div className="reference-item">
                  <h4>ATS Panel</h4>
                  <p>Monitor your ATS score and get optimization tips in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UsageGuide;
