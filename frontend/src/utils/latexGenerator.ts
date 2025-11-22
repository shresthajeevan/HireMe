// -------------------- TYPES --------------------
interface ParsedResume {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  education: EducationEntry[];
  technicalSkills: TechnicalSkills;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
}

interface EducationEntry {
  university: string;
  graduationDate: string;
  degree: string;
  location: string;
  coursework?: string;
  gpa?: string;
}

interface TechnicalSkills {
  languages: string;
  frameworks: string;
  tools: string;
}

interface ExperienceEntry {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

interface ProjectEntry {
  name: string;
  techStack: string;
  githubUrl: string;
  descriptions: string[];
}

// -------------------- ESCAPE LATEX --------------------
function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// -------------------- BULLET PARSER --------------------
function parseBullets(text: string): string[] {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map(s => s.trim()).filter(Boolean);
}

// -------------------- RESUME PARSER --------------------
export function parseResume(rawText: string): ParsedResume {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const result: ParsedResume = {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    education: [],
    technicalSkills: { languages: '', frameworks: '', tools: '' },
    experience: [],
    projects: []
  };

  // ----- CONTACT INFO -----
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const emailMatch = rawText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  
  if (phoneMatch) result.phone = phoneMatch[0];
  if (emailMatch) result.email = emailMatch[0];
  if (linkedinMatch) result.linkedin = linkedinMatch[0].replace(/https?:\/\/(www\.)?/, '');
  if (githubMatch) result.github = githubMatch[0].replace(/https?:\/\/(www\.)?/, '');

  // ----- NAME -----
  for (const line of lines.slice(0, 5)) {
    if (!line.match(/@/) && !line.match(/\d{3}[-.\s]?\d{3}/) &&
        !line.match(/linkedin/i) && !line.match(/github/i) &&
        line.length > 3 && line.length < 50) {
      result.name = line;
      break;
    }
  }
  if (!result.name) result.name = lines[0] || 'Your Name';

  // ----- SECTIONS -----
  let currentSection = '';
  let currentItem: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const upperLine = line.toUpperCase();

    if (upperLine.includes('EDUCATION')) { currentSection = 'education'; continue; }
    if (upperLine.includes('TECHNICAL SKILLS') || upperLine === 'SKILLS') { currentSection = 'skills'; continue; }
    if (upperLine.includes('EXPERIENCE')) { currentSection = 'experience'; continue; }
    if (upperLine.includes('PROJECTS')) { currentSection = 'projects'; continue; }

    // ----- EDUCATION -----
    if (currentSection === 'education') {
      const isUniversity = line.match(/university|college|institute|school/i);
      const isDegree = line.match(/bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|associate/i);
      if (isUniversity) {
        if (currentItem) result.education.push(currentItem);
        currentItem = { university: line, graduationDate: '', degree: '', location: '', coursework: '', gpa: '' };
      } else if (isDegree && currentItem) { currentItem.degree = line; }
      else if (currentItem) {
        if (line.match(/GPA/i)) { const m = line.match(/GPA[:\s]*([\d.\/]+)/i); if(m) currentItem.gpa = m[1]; }
        if (line.match(/coursework/i)) { currentItem.coursework = line.replace(/[-•]\s*(?:relevant\s+)?coursework[:\s]*/i,''); }
      }
    }

    // ----- TECHNICAL SKILLS -----
    if (currentSection === 'skills') {
      const cleanLine = line.replace(/^[-•]\s*/, '');
      if (cleanLine.match(/languages?:/i)) result.technicalSkills.languages = cleanLine.replace(/languages?:/i,'').trim();
      else if (cleanLine.match(/frameworks?|libraries|databases/i)) result.technicalSkills.frameworks = result.technicalSkills.frameworks 
        ? `${result.technicalSkills.frameworks}, ${cleanLine.replace(/^[^:]+:\s*/, '')}` 
        : cleanLine.replace(/^[^:]+:\s*/, '');
      else if (cleanLine.match(/tools?|technologies|software/i)) result.technicalSkills.tools = cleanLine.replace(/^[^:]+:\s*/, '');
    }

    // ----- EXPERIENCE -----
    if (currentSection === 'experience') {
      if (!line.startsWith('-') && !line.startsWith('•') && line.length > 3 && !line.match(/^\d{4}/)) {
        if (currentItem) result.experience.push(currentItem);
        currentItem = { jobTitle: line, company: '', location: '', startDate: '', endDate: '', achievements: [] };
      } else if (currentItem && (line.startsWith('-') || line.startsWith('•'))) {
        currentItem.achievements.push(line.replace(/^[-•]\s*/, ''));
      }
    }

    // ----- PROJECTS -----
    if (currentSection === 'projects') {
      if (!line.startsWith('-') && !line.startsWith('•') && line.length > 3) {
        if (currentItem) result.projects.push(currentItem);
        const parts = line.split(/[|–—]/);
        const projectName = parts[0]?.trim() || '';
        const rest = parts.slice(1).join('').trim();
        const githubMatch = rest.match(/(https?:\/\/)?github\.com\/[\w-]+\/[\w-]+/i);
        currentItem = { name: projectName, techStack: rest.replace(githubMatch ? githubMatch[0] : '', '').trim(), githubUrl: githubMatch ? githubMatch[0] : '', descriptions: [] };
      } else if (currentItem && (line.startsWith('-') || line.startsWith('•'))) {
        currentItem.descriptions.push(line.replace(/^[-•]\s*/, ''));
      }
    }
  }

  // ----- PUSH LAST ITEMS -----
  if (currentSection === 'education' && currentItem) result.education.push(currentItem);
  if (currentSection === 'experience' && currentItem) result.experience.push(currentItem);
  if (currentSection === 'projects' && currentItem) result.projects.push(currentItem);

  return result;
}

// -------------------- LATEX GENERATOR --------------------
export function generateLatex(parsed: ParsedResume): string {
  let latex = `\\documentclass[letterpaper,11pt]{article}



\\usepackage{setspace}

\\setstretch{1.2} % Reduced from 1

\\usepackage[T1]{fontenc}

\\usepackage{latexsym}

\\usepackage[empty]{fullpage}

\\usepackage{titlesec}

\\usepackage{marvosym}

\\usepackage[usenames,dvipsnames]{color}

\\usepackage{enumitem}

\\usepackage[hidelinks]{hyperref}

\\usepackage{fancyhdr}

\\usepackage[english]{babel}

\\usepackage{tabularx}

\\usepackage{fontawesome5}

\\usepackage{multicol}

\\setlength{\\multicolsep}{-4.0pt} % Reduced from -3.0pt

\\setlength{\\columnsep}{-2pt} % Reduced from -1pt

\\input{glyphtounicode}

\\usepackage[margin=1.5cm]{geometry} % Reduced from 1.7cm

\\pagestyle{fancy}

\\fancyhf{}

\\fancyfoot{}

\\renewcommand{\\headrulewidth}{0pt}

\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.25in}

\\addtolength{\\textwidth}{0.5in}

\\urlstyle{same}

\\raggedbottom

\\raggedright

\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{

  \\vspace{-4pt}\\scshape\\raggedright\\bfseries\\small % Reduced from -4pt

}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}] % Reduced from -5pt

\\pdfgentounicode=1

% Fix bullet point issue - specify bullet character explicitly

\\renewcommand\\labelitemi{\\textbullet}

% Modify itemize environment to use bullets

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1\\vspace{-3pt}}}} % Reduced from -2pt

\\newcommand{\\resumeSubheading}[4]{

  \\vspace{-3pt}\\item % Reduced from -2pt

    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}

      \\textbf{#1} & \\textbf{\\small #2} \\\\

      \\textit{\\small#3} & \\textit{\\small #4} \\\\

    \\end{tabular*}\\vspace{-8pt} % Reduced from -6pt

}

\\newcommand{\\resumeProjectHeading}[2]{

    \\item

    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}

      \\small#1 & \\textbf{\\small #2}\\\\

    \\end{tabular*}\\vspace{-8pt} % Reduced from -6pt

}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=1em, label=\\textbullet]}

\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}} % Reduced from -3pt

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}

\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{-5pt}} % Reduced from -3pt

\\begin{document}

%----------HEADING----------

\\begin{center}

   {\\Large \\scshape \\textbf{${escapeLatex(parsed.name)}}} \\\\[1mm] % Reduced from 2mm

\\footnotesize \\raisebox{-0.1\\height}

\\faPhone\\ \\underline{\\textbf{${escapeLatex(parsed.phone)}}} ~ 

\\faEnvelope\\ \\underline{\\textbf{${escapeLatex(parsed.email)}}} ~ 

\\end{center}

`;

// EDUCATION
if (parsed.education?.length) {
  latex += `%-----------EDUCATION-----------

\\section{EDUCATION} 

\\resumeSubHeadingListStart

`;
  parsed.education.forEach((edu, index) => {
    const university = escapeLatex(edu.university || '');
    const gradDate = edu.graduationDate ? `Graduated: ${escapeLatex(edu.graduationDate)}` : '';
    const degree = escapeLatex(edu.degree || '');
    let location = escapeLatex(edu.location || '');
    if (edu.gpa) {
      location = `\\textbf{GPA: ${escapeLatex(edu.gpa)}}, ${location}`;
    }
    latex += `  \\resumeSubheading

    {${university}}{${gradDate}}

    {${degree}}{${location}} 

`;
    if (edu.coursework) {
      latex += `  \\resumeItemListStart

    \\resumeItem {\\textbf{Relevant Coursework:} ${escapeLatex(edu.coursework)}}

  \\resumeItemListEnd

`;
    }
  });
  latex += `\\resumeSubHeadingListEnd

`;
}


  // ---------- TECHNICAL SKILLS ----------
  latex += `%-----------TECHNICAL SKILLS-----------

\\section{TECHNICAL SKILLS}

\\resumeSubHeadingListStart

  \\resumeItemListStart

    \\resumeItem{\\textbf{Languages:} ${escapeLatex(parsed.technicalSkills.languages)}}

    \\resumeItem{\\textbf{Libraries/Frameworks/Databases:} ${escapeLatex(parsed.technicalSkills.frameworks)}}

    \\resumeItem{\\textbf{Tools and Technologies:} ${escapeLatex(parsed.technicalSkills.tools)}}

  \\resumeItemListEnd

\\resumeSubHeadingListEnd

`;

  // ---------- EXPERIENCE ----------
  if (parsed.experience.length > 0) {
    latex += `%-----------EXPERIENCE-----------

\\section{EXPERIENCE}

\\resumeSubHeadingListStart

`;
    parsed.experience.forEach(exp => {
      latex += `  \\resumeSubheading

    {${escapeLatex(exp.jobTitle)}}{${escapeLatex(exp.startDate)} – ${escapeLatex(exp.endDate)}}

    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}

  \\resumeItemListStart

`;
      exp.achievements.forEach(ach => parseBullets(ach).forEach(b => latex += `    \\resumeItem{${escapeLatex(b)}}

`));
      latex += `  \\resumeItemListEnd

`;
    });
    latex += `\\resumeSubHeadingListEnd

`;
  }

  // ---------- PROJECTS ----------
  if (parsed.projects.length > 0) {
    latex += `%-----------PROJECTS-----------

\\section{PROJECTS} 

\\resumeSubHeadingListStart

`;
    parsed.projects.forEach((proj, index) => {
      const githubLink = proj.githubUrl ? `\\href{${proj.githubUrl}}{\\textbf{\\underline{\\textcolor{blue}{GitHub}}}}` : '';
      const projectTitle = `\\textbf{${escapeLatex(proj.name)} $|$ ${escapeLatex(proj.techStack)}${proj.githubUrl ? ' -- ' : ''}}${githubLink}`;
      latex += `  \\resumeProjectHeading

    {${projectTitle}}{}

  \\resumeItemListStart

`;
      proj.descriptions.forEach(desc => parseBullets(desc).forEach(b => latex += `    \\resumeItem{${escapeLatex(b)}}

`));
      latex += `  \\resumeItemListEnd

`;
      if (index === 0 && parsed.projects.length > 1) {
        latex += `  \\vspace{-9pt} % Reduced spacing after first project

`;
      } else if (index === 1 && parsed.projects.length > 2) {
        latex += `  \\vspace{-8pt} % Reduced spacing after second project

`;
      }
    });
    latex += `\\resumeSubHeadingListEnd

`;
  }

  latex += `\\end{document}`;
  return latex;
}
