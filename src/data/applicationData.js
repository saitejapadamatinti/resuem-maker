export const applicationData = {
  atsOptimizationTips: [
    "Use standard section headings like 'Work Experience' instead of creative titles",
    "Include job titles exactly as they appear in job descriptions",
    "Use simple, clean formatting without graphics or images",
    "Save resume as .doc or .pdf format for ATS compatibility",
    "Use standard fonts like Arial, Calibri, or Times New Roman",
    "Include both full terms and acronyms (e.g., 'Search Engine Optimization (SEO)')",
    "Use bullet points instead of paragraphs for work experience",
    "Keep margins at least 0.5 inches on all sides",
    "Use reverse chronological order for work experience",
    "Include quantifiable results and achievements"
  ],
  commonKeywords: {
    skills: ["Project Management", "Data Analysis", "Customer Service", "Microsoft Office", "Leadership", "Communication", "Problem Solving", "Team Collaboration", "Strategic Planning", "Budget Management"],
    technical: ["Python", "SQL", "JavaScript", "Adobe Creative Suite", "Salesforce", "Google Analytics", "Microsoft Excel", "PowerPoint", "Word", "Outlook"],
    soft: ["Leadership", "Communication", "Problem-solving", "Teamwork", "Adaptability", "Time Management", "Critical Thinking", "Creativity", "Attention to Detail", "Customer Focus"]
  },
  resumeSections: [
    {
      id: "contact",
      title: "Contact Information",
      required: true,
      fields: ["fullName", "phone", "email", "location", "linkedIn"]
    },
    {
      id: "summary", 
      title: "Professional Summary",
      required: true,
      description: "2-3 sentences highlighting your experience and key qualifications"
    },
    {
      id: "experience",
      title: "Work Experience", 
      required: true,
      description: "List your work history in reverse chronological order"
    },
    {
      id: "education",
      title: "Education",
      required: true,
      description: "Include your degrees, certifications, and relevant coursework"
    },
    {
      id: "skills",
      title: "Skills",
      required: true,
      description: "List both technical and soft skills relevant to your target role"
    }
  ],
  sampleResume: {
    contact: {
      fullName: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      location: "New York, NY",
      linkedIn: "linkedin.com/in/sarahjohnson"
    },
    summary: "Results-driven Marketing Manager with 5+ years of experience developing comprehensive digital marketing strategies. Proven track record of increasing brand awareness by 40% and generating $2M+ in revenue through strategic campaigns.",
    experience: [
      {
        id: 1,
        title: "Senior Marketing Manager",
        company: "TechCorp Solutions",
        location: "New York, NY", 
        startDate: "Jan 2022",
        endDate: "Present",
        achievements: [
          "Led cross-functional team of 8 to develop integrated marketing campaigns resulting in 35% increase in lead generation",
          "Managed $500K annual marketing budget and achieved 150% ROI on digital advertising spend",
          "Implemented marketing automation platform reducing campaign deployment time by 60%"
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: "Master of Business Administration (MBA)",
        school: "Columbia Business School",
        location: "New York, NY",
        graduationDate: "May 2020"
      }
    ],
    skills: { 
      technical: ["Digital Marketing", "Google Analytics", "Marketing Automation", "SEO/SEM", "Email Marketing"],
      soft: ["Project Management", "Data Analysis", "Content Strategy", "Social Media Marketing", "Budget Management"],
      other: []
    }
  }
};
