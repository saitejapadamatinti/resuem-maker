# ATS Resume Builder

A React-based resume studio for building, reviewing, tailoring and exporting professional resumes. The app is local-first: your draft is saved in the browser, with optional Supabase authentication and cloud resume management when configured.

## Features

### Resume editor
- Guided sections for contact details, professional links, summary, work experience, education, projects and skills.
- Add, edit and remove experience, achievements, education, project and custom-section entries.
- Reorder resume sections from the navigation sidebar.
- Six ready-to-use FlowCV-inspired templates with a visual gallery and instant live preview: Modern Minimal, Classic Clean, Executive, Compact, First Job and Contemporary.
- ATS-conscious single-column layouts, responsive template cards, typography, spacing, section order, page guides and export controls.
- Sample resume data to explore the editor without entering personal information.

### ATS and job tailoring
- Live resume-readiness checklist based on actual content, not an inflated or guaranteed ATS score.
- Paste a job description to compare the unique terms it contains with the terms present in your resume.
- Review matched and missing wording and navigate directly to incomplete resume sections.
- Keep the target job description with the resume draft so it remains available after reload or JSON backup import.
- Cover-letter first-draft builder using details already present in your resume. Edit the draft, copy it or download it as a text file.

> Keyword overlap and completeness are practical editing aids, not predictions of a particular employer's ATS result. Add keywords only when they accurately describe your skills and experience.

### Import, export and saving
- Import and export the app's JSON resume backup format.
- Import text-based or scanned PDF resumes; PDF text extraction is attempted first, with OCR as a fallback.
- Export a selectable-text PDF, print/save as PDF, plain text, JSON and a preview image.
- Automatically save the current draft in browser storage and provide a manual Save Now action.
- Optional Supabase sign-in and cloud resume management.

### Responsive and privacy-conscious defaults
- The editor works on mobile and tablet widths as well as desktop.
- Google Analytics is disabled unless a measurement ID is explicitly configured.
- Supabase credentials are read from environment variables. Never place a Supabase service-role key in a client-side environment variable.

## Getting started

### Requirements
- Node.js and npm.
- A modern browser.

### Install
```bash
git clone https://github.com/saitejapadamatinti/resuem-maker.git
cd resuem-maker
npm install
```

### Configure optional services
Copy `.env.example` to `.env.local`.

For cloud authentication and storage, set:
```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

For optional analytics, set:
```env
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The app can be used locally without enabling analytics. Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to configure the Supabase project and database table. Never use the Supabase service-role key in the browser.

### Run locally
```bash
npm start
```

Open http://localhost:3000.

### Create a production build
```bash
npm run build
```

### Run tests
```bash
npm test
```

## Project structure

```
src/
├── components/
│   ├── controls/             # Reusable editor controls
│   ├── sections/             # Resume entry forms and preview/export
│   ├── ATSOptimizationGuide.js
│   ├── ATSPanel.js           # Readiness checklist
│   ├── AuthModal.js
│   ├── CloudResumeManager.js
│   ├── Header.js
│   ├── MainContent.js
│   └── Sidebar.js
├── data/                     # Sample resume and app guidance
├── lib/                      # Supabase client and data helpers
├── utils/                    # ATS summary generation helpers
├── App.js
├── index.css
└── styles.css
```

## Important notes

- Browser autosave is scoped to the browser profile and device. Use JSON export for a portable backup.
- Cloud saving requires a correctly configured Supabase project and the database setup described in `SUPABASE_SETUP.md`.
- PDF extraction is best-effort. OCR can misread columns, dates, icons and unusual layouts; always verify imported fields before using the resume.
- A PDF or screenshot-style export is not automatically ATS-safe. Prefer the selectable-text PDF or plain-text output for systems that parse document content.
- Do not add skills, metrics, employment history or qualifications that you cannot substantiate.

## License

MIT
