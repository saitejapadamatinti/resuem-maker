/**
 * ATS Summary Generator
 * 
 * Generates ATS-optimized professional summaries based ONLY on:
 * - User's actual resume data (NOT sample/dummy data)
 * - Job description keywords and requirements
 * 
 * Features:
 * - Multiple summary styles (Professional, Results-Driven, Skills-Focused)
 * - 90+ ATS score optimization
 * - Keyword matching and integration
 * - Quantifiable achievements extraction
 * - Complete avoidance of dummy/sample data
 */

class ATSSummaryGenerator {
  constructor() {
    // Common action verbs for ATS optimization
    this.actionVerbs = [
      'achieved', 'improved', 'increased', 'reduced', 'managed', 'led', 'developed',
      'implemented', 'optimized', 'streamlined', 'delivered', 'executed', 'designed',
      'created', 'built', 'launched', 'established', 'coordinated', 'collaborated',
      'analyzed', 'enhanced', 'transformed', 'accelerated', 'maximized', 'generated'
    ];

    // Industry-agnostic professional terms
    this.professionalTerms = [
      'strategic', 'innovative', 'results-driven', 'detail-oriented', 'collaborative',
      'analytical', 'dynamic', 'experienced', 'skilled', 'proven track record',
      'cross-functional', 'stakeholder management', 'process improvement',
      'best practices', 'industry standards', 'quality assurance'
    ];
  }

  /**
   * Enhanced strict validation - Only allows real user-filled data
   */
  containsDummyDataAnywhere(resumeData) {
    const dummyIndicators = [
      'sarah johnson', 'john doe', 'jane smith', 'example.com', 'sample',
      'techcorp solutions', 'lorem ipsum', 'placeholder', 'dummy', 'test@',
      '555-123', '(555)', 'example', 'sample.com', 'demo', 'template',
      'your name', 'your email', 'your phone', 'your location', 'your company',
      'abc company', 'xyz corp', 'company name', 'school name', 'university name',
      'project name', 'project title', 'enter your', 'add your', 'fill in'
    ];

    const checkString = (str) => {
      if (!str || typeof str !== 'string') return false;
      const lowerStr = str.toLowerCase().trim();
      
      // Check for exact matches or partial matches
      return dummyIndicators.some(indicator => {
        return lowerStr.includes(indicator) || 
               lowerStr === indicator ||
               lowerStr.startsWith(indicator) ||
               lowerStr.endsWith(indicator);
      });
    };

    const checkObject = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      
      return Object.values(obj).some(value => {
        if (typeof value === 'string') return checkString(value);
        if (Array.isArray(value)) return value.some(item => 
          typeof item === 'string' ? checkString(item) : checkObject(item)
        );
        if (typeof value === 'object') return checkObject(value);
        return false;
      });
    };

    // Additional validation for minimal data requirements
    const hasMinimalRealData = (
      resumeData.contact?.fullName && 
      resumeData.contact.fullName.trim().length > 2 &&
      !checkString(resumeData.contact.fullName) &&
      (
        (resumeData.experience?.length > 0 && resumeData.experience.some(exp => 
          exp.title && exp.company && !checkString(exp.title) && !checkString(exp.company)
        )) ||
        (resumeData.skills?.technical?.length > 0 || resumeData.skills?.soft?.length > 0) ||
        (resumeData.education?.length > 0 && resumeData.education.some(edu => 
          edu.degree && edu.school && !checkString(edu.degree) && !checkString(edu.school)
        ))
      )
    );

    if (!hasMinimalRealData) {
      return true; // Treat insufficient real data as dummy data
    }

    // Check all sections of resume data
    try {
      return (
        checkObject(resumeData.contact) ||
        checkString(resumeData.summary) ||
        (Array.isArray(resumeData.experience) && resumeData.experience.some(exp => checkObject(exp))) ||
        (Array.isArray(resumeData.education) && resumeData.education.some(edu => checkObject(edu))) ||
        (Array.isArray(resumeData.projects) && resumeData.projects.some(proj => checkObject(proj))) ||
        checkObject(resumeData.skills)
      );
    } catch (error) {
      console.warn('Error checking for dummy data:', error);
      return true; // Default to blocking if we can't validate
    }
  }

  /**
   * Extracts keywords from job description with enhanced accuracy
   */
  extractJobKeywords(jobDescription) {
    if (!jobDescription || typeof jobDescription !== 'string') {
      return { technical: [], soft: [], action: [], industry: [] };
    }

    const text = jobDescription.toLowerCase();
    
    // Enhanced technical keywords with comprehensive patterns for ATS optimization
    const technicalPatterns = [
      // Programming languages and core technologies
      /\b(python|java|javascript|typescript|react|angular|vue|node\.?js|html|css|sql|c\+\+|c#|php|ruby|go|rust|swift|kotlin)\b/g,
      // Frontend Development (High Impact Keywords)
      /\b(frontend development|front.end development|responsive web design|web development|user interface components|ui\/ux)\b/g,
      // Backend Development
      /\b(back.end web development|backend development|server.side development)\b/g,
      // Software Development Principles
      /\b(software development principles|software development|agile methodology|scrum|kanban|version control)\b/g,
      // Modern Web Technologies
      /\b(modern web technologies|progressive web apps|spa|single page applications|pwa)\b/g,
      // Cloud and infrastructure
      /\b(aws|azure|gcp|google cloud|docker|kubernetes|terraform|jenkins|ci\/cd|devops|microservices)\b/g,
      // Databases and data
      /\b(mysql|postgresql|mongodb|redis|elasticsearch|oracle|sql server|nosql|big data)\b/g,
      // Web technologies and APIs
      /\b(api|rest|graphql|json|xml|soap|http|https|oauth|jwt|websockets)\b/g,
      // Frameworks and tools
      /\b(spring|django|flask|express|laravel|rails|bootstrap|tailwind|webpack|git|github|gitlab)\b/g,
      // Performance and Optimization
      /\b(optimizing applications|maximum speed|scalability|performance optimization|technical feasibility)\b/g,
      // Design and Collaboration
      /\b(collaborating with designers|collaborating with backend developers|creating responsive web designs|ui\/ux designs)\b/g,
      // Industry Experience
      /\b(healthcare industry experience|healthcare|fintech|e.commerce|saas|enterprise)\b/g,
      // Data and analytics
      /\b(machine learning|ai|data science|analytics|tableau|power bi|excel|pandas|numpy|tensorflow|pytorch)\b/g,
      // Mobile development
      /\b(ios|android|react native|flutter|xamarin|mobile development)\b/g,
      // Business tools
      /\b(salesforce|hubspot|jira|confluence|asana|trello|slack|microsoft office|google workspace)\b/g
    ];

    // Enhanced soft skills patterns with missing keywords from ATS analysis
    const softSkillPatterns = [
      /\b(leadership|management|communication|collaboration|teamwork|team player)\b/g,
      // Problem-solving and analytical skills (Missing from ATS)
      /\b(problem.solving|problem.solving skills|analytical|critical thinking|decision making|strategic thinking)\b/g,
      // Work style and independence (Missing from ATS)
      /\b(adaptability|flexibility|time management|organization|organizational skills|ability to work independently)\b/g,
      // Remote work capabilities (Missing from ATS)
      /\b(remote work capability|remote work|virtual collaboration|distributed team experience)\b/g,
      // Attention to detail (Missing from ATS)
      /\b(attention to detail|detail.oriented|quality assurance|quality control|meticulous)\b/g,
      /\b(customer service|client relations|stakeholder management|relationship building)\b/g,
      /\b(creativity|innovation|creative thinking|initiative|self.motivated)\b/g,
      /\b(project management|project coordination|planning|scheduling)\b/g
    ];

    // Action verbs commonly used in job descriptions
    const actionPatterns = [
      /\b(develop|build|create|design|implement|maintain|manage|lead|coordinate)\b/g,
      /\b(analyze|optimize|improve|enhance|streamline|automate|troubleshoot)\b/g,
      /\b(collaborate|communicate|present|train|mentor|guide|support)\b/g,
      /\b(deliver|execute|achieve|accomplish|drive|establish|launch)\b/g
    ];

    // Industry and domain terms
    const industryPatterns = [
      /\b(agile|scrum|kanban|waterfall|lean|six sigma|methodology)\b/g,
      /\b(fintech|healthcare|e.commerce|saas|b2b|b2c|enterprise|startup)\b/g,
      /\b(digital transformation|process improvement|best practices|governance)\b/g,
      /\b(compliance|security|gdpr|hipaa|sox|risk management|audit)\b/g,
      /\b(roi|revenue|cost reduction|efficiency|optimization|performance)\b/g,
      /\b(user experience|ux|ui|user interface|customer experience|cx)\b/g
    ];

    const extractMatches = (patterns) => {
      const matches = new Set();
      patterns.forEach(pattern => {
        const found = text.match(pattern) || [];
        found.forEach(match => matches.add(match.trim()));
      });
      return Array.from(matches);
    };

    return {
      technical: extractMatches(technicalPatterns),
      soft: extractMatches(softSkillPatterns),
      action: extractMatches(actionPatterns),
      industry: extractMatches(industryPatterns)
    };
  }

  /**
   * Extracts all skills from user's resume data comprehensively
   */
  extractUserSkills(resumeData) {
    const skills = {
      technical: [],
      soft: [],
      other: [],
      fromExperience: [],
      fromEducation: [],
      fromProjects: []
    };

    try {
      // Direct skills from skills section
      if (resumeData.skills) {
        skills.technical = [...(resumeData.skills.technical || [])];
        skills.soft = [...(resumeData.skills.soft || [])];
        skills.other = [...(resumeData.skills.other || [])];
      }

      // Enhanced skill extraction from experience descriptions
      if (Array.isArray(resumeData.experience)) {
        resumeData.experience.forEach(exp => {
          // Extract from job title
          if (exp.title && typeof exp.title === 'string') {
            const titleSkills = exp.title.match(/\b(manager|developer|engineer|analyst|designer|specialist|coordinator|lead|senior|junior)\b/gi) || [];
            skills.fromExperience.push(...titleSkills);
          }
          
          // Extract from achievements with enhanced patterns
          if (exp.achievements && Array.isArray(exp.achievements)) {
            exp.achievements.forEach(achievement => {
              if (typeof achievement === 'string') {
                // Technical skills
                const techMatches = achievement.match(/\b(python|java|javascript|react|sql|aws|azure|api|git|agile|scrum|excel|powerpoint|word|tableau|salesforce|jira|confluence)\b/gi) || [];
                skills.fromExperience.push(...techMatches);
                
                // Soft skills from context
                const softMatches = achievement.match(/\b(led|managed|coordinated|collaborated|communicated|presented|trained|mentored|analyzed|optimized|improved|developed|implemented|created|designed)\b/gi) || [];
                skills.fromExperience.push(...softMatches);
              }
            });
          }
        });
      }

      // Extract from education
      if (Array.isArray(resumeData.education)) {
        resumeData.education.forEach(edu => {
          if (edu.degree && typeof edu.degree === 'string') {
            const degreeSkills = edu.degree.match(/\b(computer science|engineering|business|marketing|data science|analytics|mathematics|statistics|design|information technology|management)\b/gi) || [];
            skills.fromEducation.push(...degreeSkills);
          }
          
          // Extract from school name for context
          if (edu.school && typeof edu.school === 'string') {
            const schoolContext = edu.school.match(/\b(university|college|institute|school|academy)\b/gi) || [];
            skills.fromEducation.push(...schoolContext);
          }
        });
      }

      // Enhanced extraction from projects
      if (Array.isArray(resumeData.projects)) {
        resumeData.projects.forEach(project => {
          if (project.description && typeof project.description === 'string') {
            // Remove HTML tags first
            const cleanDesc = project.description.replace(/<[^>]*>/g, ' ');
            
            // Technical skills from projects
            const projSkills = cleanDesc.match(/\b(python|java|javascript|react|angular|vue|node|typescript|html|css|sql|mongodb|postgresql|mysql|aws|azure|docker|kubernetes|git|api|rest|graphql|machine learning|ai|data)\b/gi) || [];
            skills.fromProjects.push(...projSkills);
          }
          
          // Extract from project name
          if (project.name && typeof project.name === 'string') {
            const nameSkills = project.name.match(/\b(web|mobile|app|api|dashboard|website|system|platform|tool|application)\b/gi) || [];
            skills.fromProjects.push(...nameSkills);
          }
        });
      }

      // Clean and deduplicate all extracted skills
      Object.keys(skills).forEach(category => {
        skills[category] = [...new Set(skills[category]
          .filter(skill => skill && skill.trim().length > 1)
          .map(skill => skill.trim())
        )];
      });

    } catch (error) {
      console.warn('Error extracting user skills:', error);
    }

    return skills;
  }

  /**
   * Matches and prioritizes ALL skills (technical, soft, other) based on job description relevance
   */
  getRelevantSkills(userSkills, jobKeywords, skillType = 'all') {
    let userSkillList = [];
    let jobSkillList = [];
    
    if (skillType === 'all') {
      // Combine all user skills
      userSkillList = [
        ...(userSkills.technical || []),
        ...(userSkills.soft || []),
        ...(userSkills.other || []),
        ...(userSkills.fromExperience || []),
        ...(userSkills.fromEducation || []),
        ...(userSkills.fromProjects || [])
      ];
      
      // Combine all job keywords
      jobSkillList = [
        ...(jobKeywords.technical || []),
        ...(jobKeywords.soft || []),
        ...(jobKeywords.action || []),
        ...(jobKeywords.industry || [])
      ];
    } else {
      // Specific skill type
      userSkillList = userSkills[skillType] || [];
      jobSkillList = jobKeywords[skillType] || [];
    }
    
    if (jobSkillList.length === 0) {
      // If no job keywords, return top user skills (limited)
      return userSkillList.slice(0, skillType === 'all' ? 6 : 3);
    }
    
    // Find exact and partial matches with relevance scoring
    const matches = [];
    
    userSkillList.forEach(userSkill => {
      jobSkillList.forEach(jobSkill => {
        const userSkillLower = userSkill.toLowerCase();
        const jobSkillLower = jobSkill.toLowerCase();
        
        // Exact match (highest priority)
        if (userSkillLower === jobSkillLower) {
          matches.push({ skill: userSkill, relevance: 100, type: 'exact' });
        }
        // Partial match - user skill contains job skill
        else if (userSkillLower.includes(jobSkillLower)) {
          matches.push({ skill: userSkill, relevance: 80, type: 'contains' });
        }
        // Partial match - job skill contains user skill
        else if (jobSkillLower.includes(userSkillLower)) {
          matches.push({ skill: userSkill, relevance: 70, type: 'contained' });
        }
        // Similar skills (basic matching)
        else if (this.areSimilarSkills(userSkillLower, jobSkillLower)) {
          matches.push({ skill: userSkill, relevance: 60, type: 'similar' });
        }
      });
    });
    
    // Remove duplicates and sort by relevance
    const uniqueMatches = matches.reduce((acc, current) => {
      const existing = acc.find(item => item.skill.toLowerCase() === current.skill.toLowerCase());
      if (!existing || current.relevance > existing.relevance) {
        return [...acc.filter(item => item.skill.toLowerCase() !== current.skill.toLowerCase()), current];
      }
      return acc;
    }, []);
    
    // Sort by relevance and return only the skills
    return uniqueMatches
      .sort((a, b) => b.relevance - a.relevance)
      .map(match => match.skill);
  }
  
  /**
   * Checks if two skills are similar (basic similarity check)
   */
  areSimilarSkills(skill1, skill2) {
    // Define comprehensive skill synonyms and related terms for better ATS matching
    const skillSynonyms = {
      // Frontend Development Keywords
      'javascript': ['js', 'ecmascript', 'node', 'frontend development', 'front-end development'],
      'frontend': ['front-end', 'frontend development', 'front-end development', 'ui development'],
      'responsive': ['responsive web design', 'responsive design', 'mobile-first', 'adaptive design'],
      'web development': ['web dev', 'website development', 'web application development'],
      // UI/UX and Design
      'ui': ['user interface', 'user interface components', 'ui components', 'ui/ux'],
      'ux': ['user experience', 'ui/ux', 'user experience design'],
      // Backend and Development
      'backend': ['back-end', 'backend development', 'back-end web development', 'server-side'],
      'python': ['py'],
      'react': ['reactjs', 'react.js'],
      'angular': ['angularjs'],
      'vue': ['vuejs', 'vue.js'],
      // Web Technologies
      'css': ['css3', 'cascading style sheets', 'styling'],
      'html': ['html5', 'hypertext markup', 'markup'],
      'sql': ['mysql', 'postgresql', 'database'],
      // Cloud and DevOps
      'aws': ['amazon web services', 'cloud'],
      'azure': ['microsoft azure'],
      'docker': ['containerization'],
      'kubernetes': ['k8s', 'container orchestration'],
      // Soft Skills
      'management': ['leadership', 'team lead', 'project management'],
      'communication': ['presentation', 'public speaking'],
      'analysis': ['analytical', 'analyze', 'problem-solving skills'],
      'collaboration': ['teamwork', 'team player', 'collaborating with designers', 'collaborating with backend developers'],
      'attention to detail': ['detail-oriented', 'meticulous', 'quality assurance'],
      'independent': ['ability to work independently', 'self-motivated', 'autonomous'],
      'remote work': ['remote work capability', 'virtual collaboration', 'distributed team'],
      // Performance and Technical
      'optimization': ['optimizing applications', 'performance optimization', 'maximum speed'],
      'scalability': ['scalable', 'scale', 'performance'],
      'technical feasibility': ['technical assessment', 'feasibility analysis'],
      // Industry Experience
      'healthcare': ['healthcare industry experience', 'medical', 'clinical'],
      // Modern Technologies
      'modern web technologies': ['progressive web apps', 'spa', 'pwa', 'single page applications']
    };
    
    // Check if skills are synonyms
    for (const [key, synonyms] of Object.entries(skillSynonyms)) {
      if ((skill1.includes(key) || synonyms.some(syn => skill1.includes(syn))) &&
          (skill2.includes(key) || synonyms.some(syn => skill2.includes(syn)))) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Extracts quantifiable achievements from user's experience
   */
  extractQuantifiableAchievements(resumeData) {
    const achievements = [];

    try {
      if (Array.isArray(resumeData.experience)) {
        resumeData.experience.forEach(exp => {
          if (exp.achievements && Array.isArray(exp.achievements)) {
            exp.achievements.forEach(achievement => {
              if (typeof achievement === 'string') {
                // Look for numbers, percentages, dollar amounts
                const quantifiable = achievement.match(/\d+[%$]?|\$[\d,]+|[\d,]+\+?|\d+x|\d+k\+?/gi);
                if (quantifiable && quantifiable.length > 0) {
                  achievements.push({
                    text: achievement,
                    metrics: quantifiable,
                    company: exp.company || '',
                    title: exp.title || ''
                  });
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.warn('Error extracting achievements:', error);
    }

    return achievements;
  }

  /**
   * Infers professional title from user's education or skills when no job title exists
   */
  inferProfessionalTitle(resumeData) {
    // Try to infer from education
    if (resumeData.education && resumeData.education.length > 0) {
      const degree = resumeData.education[0].degree?.toLowerCase() || '';
      if (degree.includes('computer science') || degree.includes('software')) return 'Software Professional';
      if (degree.includes('engineering')) return 'Engineer';
      if (degree.includes('business') || degree.includes('mba')) return 'Business Professional';
      if (degree.includes('marketing')) return 'Marketing Professional';
      if (degree.includes('design')) return 'Design Professional';
      if (degree.includes('data science') || degree.includes('analytics')) return 'Data Professional';
    }

    // Try to infer from ALL skills (technical, soft, other) for better job title matching
    if (resumeData.skills) {
      // Combine all skill types for comprehensive analysis
      const allSkills = [
        ...(resumeData.skills.technical || []),
        ...(resumeData.skills.soft || []),
        ...(resumeData.skills.other || [])
      ].map(s => s.toLowerCase());
      
      // Frontend Developer (High Priority Match)
      if (allSkills.some(s => s.includes('react') || s.includes('angular') || s.includes('vue') || s.includes('javascript') || s.includes('html') || s.includes('css') || s.includes('frontend') || s.includes('ui/ux'))) return 'Frontend Developer';
      // Backend Developer
      if (allSkills.some(s => s.includes('backend') || s.includes('server') || s.includes('api') || s.includes('database') || s.includes('node') || s.includes('python') || s.includes('java'))) return 'Backend Developer';
      // Full Stack Developer
      if (allSkills.some(s => s.includes('full stack') || s.includes('fullstack'))) return 'Full Stack Developer';
      // Web Developer (General)
      if (allSkills.some(s => s.includes('web development') || s.includes('web') || s.includes('html') || s.includes('css') || s.includes('javascript'))) return 'Web Developer';
      // Software Developer (General Programming)
      if (allSkills.some(s => s.includes('python') || s.includes('javascript') || s.includes('java') || s.includes('programming') || s.includes('coding') || s.includes('software development'))) return 'Software Developer';
      // Specialized Roles
      if (allSkills.some(s => s.includes('marketing') || s.includes('seo') || s.includes('digital marketing') || s.includes('social media'))) return 'Marketing Professional';
      if (allSkills.some(s => s.includes('design') || s.includes('photoshop') || s.includes('creative') || s.includes('ui/ux'))) return 'UX/UI Designer';
      if (allSkills.some(s => s.includes('data') || s.includes('analytics') || s.includes('analysis') || s.includes('statistics'))) return 'Data Analyst';
      if (allSkills.some(s => s.includes('management') || s.includes('leadership') || s.includes('project management'))) return 'Project Manager';
      if (allSkills.some(s => s.includes('sales') || s.includes('customer service') || s.includes('business development'))) return 'Sales Professional';
      if (allSkills.some(s => s.includes('finance') || s.includes('accounting') || s.includes('financial analysis'))) return 'Finance Professional';
      if (allSkills.some(s => s.includes('hr') || s.includes('human resources') || s.includes('recruitment'))) return 'HR Professional';
    }

    return 'Professional'; // Default fallback
  }

  /**
   * Calculates years of experience from resume data accurately
   */
  calculateExperienceYears(resumeData) {
    try {
      if (!Array.isArray(resumeData.experience) || resumeData.experience.length === 0) {
        return 0;
      }

      let totalMonths = 0;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

      resumeData.experience.forEach(exp => {
        if (exp.startDate) {
          // Parse start date
          const startDateMatch = exp.startDate.match(/(\d{1,2})\/(\d{4})|(\d{4})/);
          let startYear, startMonth;
          
          if (startDateMatch) {
            if (startDateMatch[1] && startDateMatch[2]) {
              // Format: MM/YYYY
              startMonth = parseInt(startDateMatch[1]);
              startYear = parseInt(startDateMatch[2]);
            } else if (startDateMatch[3]) {
              // Format: YYYY only
              startYear = parseInt(startDateMatch[3]);
              startMonth = 1; // Default to January if only year provided
            }
          } else {
            return; // Skip if we can't parse the start date
          }
          
          // Parse end date
          let endYear = currentYear;
          let endMonth = currentMonth;
          
          if (exp.endDate && exp.endDate.toLowerCase() !== 'present') {
            const endDateMatch = exp.endDate.match(/(\d{1,2})\/(\d{4})|(\d{4})/);
            
            if (endDateMatch) {
              if (endDateMatch[1] && endDateMatch[2]) {
                // Format: MM/YYYY
                endMonth = parseInt(endDateMatch[1]);
                endYear = parseInt(endDateMatch[2]);
              } else if (endDateMatch[3]) {
                // Format: YYYY only
                endYear = parseInt(endDateMatch[3]);
                endMonth = 12; // Default to December if only year provided
              }
            }
          }
          
          // Calculate months between start and end dates
          const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
          totalMonths += Math.max(0, monthsDiff);
        }
      });

      // Convert months to years and round down for conservative estimate
      const years = Math.floor(totalMonths / 12);
      
      // Return at least 0 years (don't force minimum of 1)
      return Math.max(0, years);
    } catch (error) {
      console.warn('Error calculating experience:', error);
      return 0; // Return 0 instead of 1 for errors
    }
  }

  /**
   * Generates professional summary optimized for 90+ ATS score using ONLY real user data
   */
  generateATSOptimizedSummary(resumeData, jobDescription = '', style = 'professional') {
    // STRICT validation - Prevent use of any dummy/sample data
    if (this.containsDummyDataAnywhere(resumeData)) {
      return {
        summary: '',
        error: 'Please fill in your actual resume information. The ATS Summary Generator requires REAL user data - no sample, dummy, or placeholder information. Please update your contact info, experience, and skills with your genuine professional details.',
        score: 0,
        matchedKeywords: []
      };
    }

    // Enhanced validation for minimum real data requirements
    const hasRealContactInfo = (
      resumeData.contact?.fullName && 
      resumeData.contact.fullName.trim().length > 2 &&
      resumeData.contact.email &&
      resumeData.contact.email.includes('@') &&
      !resumeData.contact.email.includes('example')
    );

    const hasRealExperience = (
      Array.isArray(resumeData.experience) && 
      resumeData.experience.length > 0 &&
      resumeData.experience.some(exp => 
        exp.title && exp.title.trim().length > 2 &&
        exp.company && exp.company.trim().length > 2
      )
    );

    const hasRealSkills = (
      resumeData.skills &&
      (resumeData.skills.technical?.length > 0 || 
       resumeData.skills.soft?.length > 0 || 
       resumeData.skills.other?.length > 0)
    );

    const hasRealEducation = (
      Array.isArray(resumeData.education) &&
      resumeData.education.length > 0 &&
      resumeData.education.some(edu => 
        edu.degree && edu.degree.trim().length > 2 &&
        edu.school && edu.school.trim().length > 2
      )
    );

    // Require at least contact + (experience OR skills OR education)
    if (!hasRealContactInfo) {
      return {
        summary: '',
        error: 'Please complete your contact information with your real name and email address before generating a summary.',
        score: 0,
        matchedKeywords: []
      };
    }

    if (!hasRealExperience && !hasRealSkills && !hasRealEducation) {
      return {
        summary: '',
        error: 'Please add your real work experience, skills, or education information. The generator needs actual professional details to create an effective summary.',
        score: 0,
        matchedKeywords: []
      };
    }

    try {
      const jobKeywords = this.extractJobKeywords(jobDescription);
      const userSkills = this.extractUserSkills(resumeData);
      const achievements = this.extractQuantifiableAchievements(resumeData);
      const experienceYears = this.calculateExperienceYears(resumeData);

      // Get user's actual job titles for professional identity
      const jobTitles = resumeData.experience?.map(exp => exp.title).filter(Boolean) || [];
      const latestTitle = jobTitles[0] || this.inferProfessionalTitle(resumeData);

      // Get relevant skills based on job description matching
      const relevantTechnicalSkills = this.getRelevantSkills(userSkills, jobKeywords, 'technical');
      const relevantSoftSkills = this.getRelevantSkills(userSkills, jobKeywords, 'soft');
      
      // Also extract skills from experience and projects for matching
      const allUserSkills = {
        technical: [...userSkills.technical, ...userSkills.fromExperience, ...userSkills.fromProjects],
        soft: [...userSkills.soft],
        other: [...userSkills.other]
      };
      
      const matchedTechnical = this.getRelevantSkills(allUserSkills, jobKeywords, 'technical');
      const matchedSoft = this.getRelevantSkills(allUserSkills, jobKeywords, 'soft');

      // Generate enhanced summary based on style
      let summary = '';
      
      switch (style) {
        case 'results-driven':
          summary = this.generateResultsDrivenSummary(resumeData, experienceYears, achievements, matchedTechnical, matchedSoft, latestTitle);
          break;
        case 'skills-focused':
          summary = this.generateSkillsFocusedSummary(resumeData, experienceYears, userSkills, matchedTechnical, matchedSoft, latestTitle);
          break;
        default:
          summary = this.generateProfessionalSummary(resumeData, experienceYears, achievements, matchedTechnical, matchedSoft, latestTitle);
      }

      // Enhanced ATS score calculation for 90+ optimization
      const score = this.calculateOptimizedATSScore(summary, jobKeywords, userSkills, achievements, resumeData);

      return {
        summary,
        score,
        matchedKeywords: [...matchedTechnical, ...matchedSoft],
        suggestions: this.generateImprovementSuggestions(score, matchedTechnical, matchedSoft, achievements, resumeData)
      };

    } catch (error) {
      console.error('Error generating summary:', error);
      return {
        summary: '',
        error: 'An error occurred while generating the summary. Please ensure all your resume data is properly filled out and try again.',
        score: 0,
        matchedKeywords: []
      };
    }
  }

  generateProfessionalSummary(resumeData, experienceYears, achievements, matchedTechnical, matchedSoft, latestTitle) {
    // Only use skills that are relevant to job description
    const relevantTechSkills = matchedTechnical.slice(0, 4); // Top 4 most relevant
    const relevantSoftSkills = matchedSoft.slice(0, 3); // Top 3 most relevant
    
    // Build summary focused on relevant skills only
    let summary = '';
    
    // Start with professional identity based on actual experience
    if (experienceYears >= 1) {
      summary = `${latestTitle} with ${experienceYears}+ years of professional experience`;
    } else if (experienceYears === 0 && (resumeData.projects?.length > 0 || resumeData.education?.length > 0)) {
      summary = `${latestTitle} with demonstrated expertise and practical experience`;
    } else {
      summary = `${latestTitle} with foundational expertise`;
    }
    
    // Add technical skills ONLY if they're relevant to job description
    if (relevantTechSkills.length > 0) {
      summary += ` specializing in ${relevantTechSkills.join(', ')}`;
    }
    
    summary += '. ';

    // Add quantifiable achievements from actual experience
    if (achievements.length > 0) {
      const achievement = achievements[0].text
        .replace(/^[•\-\*]\s*/, '')
        .replace(/\.$/, '');
      summary += `Proven track record including ${achievement.toLowerCase()}. `;
    }

    // Add soft skills ONLY if they're relevant to job description
    if (relevantSoftSkills.length > 0) {
      summary += `Strong ${relevantSoftSkills.join(', ')} capabilities`;
    } else if (relevantTechSkills.length > 0) {
      summary += 'Strong professional and technical capabilities';
    } else {
      // If no relevant skills match, use generic professional statement
      summary += 'Strong professional capabilities';
    }
    
    // Add context from actual experience or education
    if (resumeData.experience?.length > 1) {
      summary += ' with experience across multiple organizations.';
    } else if (resumeData.projects?.length > 0) {
      summary += ' with hands-on project experience.';
    } else if (resumeData.education?.length > 0) {
      summary += ' with solid educational foundation.';
    } else {
      summary += ' focused on delivering results.';
    }

    return summary;
  }

  generateResultsDrivenSummary(resumeData, experienceYears, achievements, matchedTechnical, matchedSoft, latestTitle) {
    // Focus on only relevant skills that match job description
    const relevantTechSkills = matchedTechnical.slice(0, 4);
    const relevantSoftSkills = matchedSoft.slice(0, 3);
    
    let summary = `Results-driven ${latestTitle}`;
    
    if (experienceYears >= 1) {
      summary += ` with ${experienceYears}+ years of proven success`;
    } else if (experienceYears === 0) {
      summary += ` with proven ability to deliver results`;
    }
    
    summary += ' delivering measurable business impact. ';

    // Highlight actual quantifiable achievements
    if (achievements.length > 0) {
      const primaryAchievement = achievements[0].text
        .replace(/^[•\-\*]\s*/, '')
        .replace(/\.$/, '');
      summary += `Key accomplishment: ${primaryAchievement.toLowerCase()}`;
      
      if (achievements.length > 1) {
        const secondAchievement = achievements[1].text
          .replace(/^[•\-\*]\s*/, '')
          .replace(/\.$/, '');
        summary += ` and ${secondAchievement.toLowerCase()}`;
      }
      summary += '. ';
    }

    // Add technical skills ONLY if they're relevant to job
    if (relevantTechSkills.length > 0) {
      summary += `Expert in ${relevantTechSkills.join(', ')} `;
    }
    
    // Add relevant soft skills
    if (relevantSoftSkills.length > 0) {
      summary += `with strong ${relevantSoftSkills.join(' and ')} skills. `;
    } else if (relevantTechSkills.length > 0) {
      summary += 'with analytical and strategic execution capabilities. ';
    } else {
      summary += 'with proven execution and delivery capabilities. ';
    }

    // Add context from actual experience
    if (resumeData.experience?.length > 1) {
      summary += 'Demonstrated ability to drive results across multiple roles.';
    } else if (resumeData.projects?.length > 0) {
      summary += 'Proven success in project delivery and execution.';
    } else {
      summary += 'Focused on continuous improvement and performance optimization.';
    }

    return summary;
  }

  generateSkillsFocusedSummary(resumeData, experienceYears, userSkills, matchedTechnical, matchedSoft, latestTitle) {
    // Only use skills that are relevant to job description
    const relevantTechSkills = matchedTechnical.slice(0, 6); // More skills for skills-focused
    const relevantSoftSkills = matchedSoft.slice(0, 4);
    
    let summary = `Skilled ${latestTitle}`;
    
    if (experienceYears >= 1) {
      summary += ` with ${experienceYears}+ years of hands-on experience`;
    } else if (experienceYears === 0) {
      summary += ` with practical hands-on experience`;
    }
    
    // Lead with relevant technical skills only
    if (relevantTechSkills.length > 0) {
      const primaryTech = relevantTechSkills.slice(0, 4);
      summary += ` specializing in ${primaryTech.join(', ')}`;
      
      if (relevantTechSkills.length > 4) {
        summary += ` and ${relevantTechSkills.length - 4} additional relevant technologies`;
      }
      summary += '. ';
    } else {
      summary += ' with technical competencies. ';
    }

    // Add relevant soft skills only
    if (relevantSoftSkills.length > 0) {
      summary += `Demonstrated proficiency in ${relevantSoftSkills.slice(0, 3).join(', ')} `;
    }
    
    // Add context based on actual experience
    if (resumeData.experience?.length > 0) {
      summary += 'with proven ability to apply relevant expertise in professional environments. ';
    } else if (resumeData.projects?.length > 0) {
      summary += 'with practical project experience demonstrating relevant capabilities. ';
    } else if (resumeData.education?.length > 0) {
      summary += 'with solid educational foundation and practical skill development. ';
    }

    // Only add other skills if they're contextually relevant
    if (relevantTechSkills.length === 0 && relevantSoftSkills.length === 0) {
      // Fallback when no skills match job description
      summary += 'Committed to continuous learning and adapting to new requirements.';
    } else {
      summary += 'Focused on delivering value through relevant technical expertise.';
    }

    return summary;
  }

  /**
   * Calculates ATS score with emphasis on job-relevant skills
   */
  calculateOptimizedATSScore(summary, jobKeywords, userSkills, achievements, resumeData) {
    let score = 15; // Base score for having a summary

    try {
      const summaryLower = summary.toLowerCase();
      
      // Get ALL relevant skills for scoring (not just technical and soft)
      const allUserSkills = {
        technical: [...userSkills.technical, ...userSkills.fromExperience, ...userSkills.fromProjects],
        soft: [...userSkills.soft],
        other: [...userSkills.other, ...userSkills.fromEducation]
      };
      
      const relevantTechSkills = this.getRelevantSkills(allUserSkills, jobKeywords, 'technical');
      const relevantSoftSkills = this.getRelevantSkills(allUserSkills, jobKeywords, 'soft');
      const relevantOtherSkills = this.getRelevantSkills(allUserSkills, jobKeywords, 'all');
      
      // Technical skill relevance (30 points + bonuses)
      const techMatches = relevantTechSkills.filter(skill => 
        summaryLower.includes(skill.toLowerCase())
      ).length;
      
      if (jobKeywords.technical.length > 0) {
        // Higher score for job-relevant skills
        score += Math.min(30, techMatches * 8); // 8 points per relevant match
        if (techMatches >= 3) score += 15; // Bonus for multiple relevant matches
      } else {
        // Moderate score if no job description provided
        score += Math.min(20, techMatches * 5);
      }

      // Soft skill relevance (20 points + bonuses)
      const softMatches = relevantSoftSkills.filter(skill =>
        summaryLower.includes(skill.toLowerCase())
      ).length;
      
      if (jobKeywords.soft.length > 0) {
        score += Math.min(20, softMatches * 8); // 8 points per relevant match
        if (softMatches >= 2) score += 10; // Bonus for multiple soft skill matches
      } else {
        score += Math.min(15, softMatches * 5);
      }
      
      // Other skills relevance (10 points)
      const otherMatches = relevantOtherSkills.filter(skill =>
        summaryLower.includes(skill.toLowerCase())
      ).length;
      
      score += Math.min(10, otherMatches * 3); // 3 points per other relevant skill

      // Action verbs and professional language (10 points)
      const actionMatches = this.actionVerbs.filter(verb => 
        summaryLower.includes(verb)
      ).length;
      score += Math.min(10, actionMatches * 2);

      // Quantifiable results (15 points)
      const hasNumbers = /\d+[%$]?|\$[\d,]+|[\d,]+\+?|\d+x|\d+k\+?/.test(summary);
      if (hasNumbers) score += 15;
      if (achievements.length > 1) score += 5; // Bonus for multiple achievements

      // Professional terminology (5 points)
      const profTermMatches = this.professionalTerms.filter(term =>
        summaryLower.includes(term)
      ).length;
      score += Math.min(5, profTermMatches * 1);

      // Comprehensive data bonuses (if any skills are relevant)
      if (relevantTechSkills.length > 0 || relevantSoftSkills.length > 0 || relevantOtherSkills.length > 0) {
        if (resumeData.contact?.location) score += 3;
        if (resumeData.contact?.linkedIn) score += 3;
        if (resumeData.education?.length > 0) score += 3;
        if (resumeData.projects?.length > 0) score += 3;
        
        // Experience diversity
        if (resumeData.experience?.length > 1) score += 3;
        
        // ALL skill diversity bonus (technical, soft, other)
        const totalRelevantSkills = relevantTechSkills.length + relevantSoftSkills.length + relevantOtherSkills.length;
        if (totalRelevantSkills >= 8) score += 8; // Higher bonus for comprehensive skill portfolio
        else if (totalRelevantSkills >= 6) score += 5;
        else if (totalRelevantSkills >= 4) score += 3;
        
        // Bonus for having skills across multiple categories
        let skillCategories = 0;
        if (relevantTechSkills.length > 0) skillCategories++;
        if (relevantSoftSkills.length > 0) skillCategories++;
        if (relevantOtherSkills.length > 0) skillCategories++;
        
        if (skillCategories >= 3) score += 5; // Bonus for well-rounded skill set
        else if (skillCategories >= 2) score += 3;
      }

    } catch (error) {
      console.warn('Error calculating ATS score:', error);
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Generates suggestions for improving ATS score based on user's actual data
   */
  generateImprovementSuggestions(score, matchedTechnical, matchedSoft, achievements, resumeData) {
    const suggestions = [];

    if (score < 90) {
      // Technical skills recommendations
      if (matchedTechnical.length < 3) {
        suggestions.push('Add more relevant technical skills from the job description to your skills section');
      }
      
      // Soft skills recommendations
      if (matchedSoft.length < 2) {
        suggestions.push('Include more soft skills that match common job requirements (leadership, communication, problem-solving)');
      }
      
      // Achievement recommendations
      if (achievements.length === 0) {
        suggestions.push('Add quantifiable achievements with specific numbers, percentages, or dollar amounts to your experience');
      }
      
      // Contact completeness
      if (!resumeData.contact?.location) {
        suggestions.push('Add your location (city, state) to improve local job matching');
      }
      
      if (!resumeData.contact?.linkedIn) {
        suggestions.push('Include your LinkedIn profile URL for better professional visibility');
      }
      
      // Experience depth
      if (resumeData.experience?.length === 1) {
        suggestions.push('Consider adding more work experience entries if you have additional relevant roles');
      }
      
      // Skills diversity
      const totalSkills = (resumeData.skills?.technical?.length || 0) + 
                         (resumeData.skills?.soft?.length || 0) + 
                         (resumeData.skills?.other?.length || 0);
      
      if (totalSkills < 8) {
        suggestions.push('Expand your skills section to include 8-12 relevant skills across technical and soft skill categories');
      }
      
      // Projects recommendation
      if (!resumeData.projects || resumeData.projects.length === 0) {
        suggestions.push('Add 1-3 relevant projects that showcase your skills and impact');
      }
      
      // Education enhancement
      if (!resumeData.education || resumeData.education.length === 0) {
        suggestions.push('Include your educational background to provide additional context');
      }
    }

    // Score-specific recommendations
    if (score >= 90) {
      suggestions.push('🎉 Excellent! Your summary is well-optimized for ATS systems');
    } else if (score >= 80) {
      suggestions.push('Great progress! Fine-tune keywords to reach 90+ score');
    } else if (score >= 70) {
      suggestions.push('Good foundation! Focus on adding more quantifiable achievements');
    } else {
      suggestions.push('Consider using a job description to optimize keyword matching');
    }

    return suggestions;
  }

  /**
   * Gets available summary styles
   */
  getAvailableStyles() {
    return [
      {
        id: 'professional',
        name: 'Professional',
        description: 'Balanced summary highlighting experience and key qualifications'
      },
      {
        id: 'results-driven',
        name: 'Results-Driven',
        description: 'Focuses on measurable achievements and business impact'
      },
      {
        id: 'skills-focused',
        name: 'Skills-Focused',
        description: 'Emphasizes technical and professional competencies'
      }
    ];
  }
}

export default new ATSSummaryGenerator();