export function generateSimpleLatex(rawResume: string, jobDescription: string): string {
  // Helper function to escape LaTeX special characters
  const escapeLatex = (str: string): string => {
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[&%$#_{}]/g, "\\$&")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
  };

  // 🔧 Robust text cleaning - removes bullets, HTML entities, normalizes whitespace
  const cleanText = (raw: string): string => {
    if (!raw || raw.trim() === "") return "";
    let s = String(raw);

    // Remove common HTML entity bullets
    s = s.replace(/&bull;|&middot;|&#8226;|&#149;/gi, " ");

    // Remove Unicode bullet characters
    s = s.replace(/[\u2022\u25CF\u25AA\u25AB\u2219\u2023\u2024\u2027\u2756\u2043]/g, " ");

    // Remove leading bullet markers from start of lines: "- ", "* ", "• ", etc.
    s = s.split("\n")
      .map(line => line.replace(/^\s*([*\-\u2022\u2023\u25CF•\u00B7\+]|&bull;|&middot;)\s*/u, ""))
      .join("\n");

    // Remove HTML tags
    s = s.replace(/<\/?[^>]+(>|$)/g, " ");

    // Normalize whitespace on each line
    s = s.split("\n")
      .map(line => line.replace(/\s+/g, " ").trim())
      .join("\n");

    return s.trim();
  };

  // 🔧 Smart bullet point extraction with SIMPLE LOGIC:
  // Split ONLY if there's a full stop (.) followed by another sentence starting with capital letter
  // Otherwise: keep as single bullet point
  const extractBulletPoints = (content: string): string[] => {
    if (!content || content.trim() === "") return [];

    // Clean the content first
    const cleaned = cleanText(content);
    
    // Split into lines
    const lines = cleaned.split("\n").map(l => l.trim()).filter(Boolean);
    
    const bullets: string[] = [];

    for (const line of lines) {
      // Skip section headers (all caps or keyword headers)
      if (
        line === line.toUpperCase() || 
        /^(education|experience|projects?|skills?|technical|work|employment|summary|objective):?$/i.test(line)
      ) {
        continue;
      }

      // Collapse any remaining newlines in the line into spaces
      const collapsed = line.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
      
      // Check if line contains ". " followed by capital letter (multiple sentences)
      const hasMultipleSentences = /\.\s+[A-Z]/.test(collapsed);

      if (hasMultipleSentences) {
        // Split by ". " when followed by capital letter (new sentence)
        const sentences = collapsed
          .split(/\.(?=\s+[A-Z])/)
          .map(sentence => {
            const trimmed = sentence.trim();
            // Add back the period if it was removed
            return trimmed.endsWith('.') ? trimmed : trimmed + '.';
          })
          .filter(s => s.length > 3); // Filter out very short fragments
        
        bullets.push(...sentences);
      } else {
        // Keep entire line as one bullet
        bullets.push(collapsed);
      }
    }

    return bullets.filter(b => b.length > 10); // Filter out very short fragments
  };

  // Parse the raw resume text to extract information
  const lines = rawResume.split("\n").filter((line) => line.trim());

  // Try to extract contact info (first few lines usually)
  let name = "Your Name";
  let phone = "Your Phone";
  let email = "Your Email";
  let linkedin = "Your LinkedIn";
  let github = "Your GitHub";

  // Simple heuristic parsing
  if (lines.length > 0) {
    name = cleanText(lines[0]);
  }
  if (lines.length > 1) {
    const contactLine = lines.slice(1, 4).join(" | ");
    const emailMatch = contactLine.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = contactLine.match(/[\d\s()+-]+/);
    const linkedinMatch = contactLine.match(/linkedin\.com\/[^\s|]+/);
    const githubMatch = contactLine.match(/github\.com\/[^\s|]+/);

    if (emailMatch) email = emailMatch[0];
    if (phoneMatch) phone = phoneMatch[0].trim();
    if (linkedinMatch) linkedin = linkedinMatch[0];
    if (githubMatch) github = githubMatch[0];
  }

  // Extract sections
  const educationIndex = rawResume.toLowerCase().indexOf("education");
  const experienceIndex = rawResume.toLowerCase().indexOf("experience");
  const projectsIndex = rawResume.toLowerCase().indexOf("project");
  const skillsIndex = rawResume.toLowerCase().indexOf("skill");

  let educationContent = "";
  let experienceContent = "";
  let projectsContent = "";
  let skillsContent = "";

  if (educationIndex !== -1) {
    const nextSection = Math.min(
      ...[experienceIndex, projectsIndex, skillsIndex, rawResume.length].filter((i) => i > educationIndex)
    );
    educationContent = rawResume.substring(educationIndex, nextSection);
  }

  if (experienceIndex !== -1) {
    const nextSection = Math.min(
      ...[educationIndex, projectsIndex, skillsIndex, rawResume.length].filter((i) => i > experienceIndex)
    );
    experienceContent = rawResume.substring(experienceIndex, nextSection);
  }

  if (projectsIndex !== -1) {
    const nextSection = Math.min(
      ...[educationIndex, experienceIndex, skillsIndex, rawResume.length].filter((i) => i > projectsIndex)
    );
    projectsContent = rawResume.substring(projectsIndex, nextSection);
  }

  if (skillsIndex !== -1) {
    const nextSection = Math.min(
      ...[educationIndex, experienceIndex, projectsIndex, rawResume.length].filter((i) => i > skillsIndex)
    );
    skillsContent = rawResume.substring(skillsIndex, nextSection);
  }

  // 🔧 Format sections with smart bullet grouping
  const formatSection = (content: string): string => {
    if (!content) return "  \\resumeItem{Add your information here}";
    
    const bullets = extractBulletPoints(content);
    
    if (bullets.length === 0) {
      return "  \\resumeItem{Add your information here}";
    }

    return bullets.map((bullet) => `    \\resumeItem{${escapeLatex(bullet)}}`).join("\n");
  };

  // Generate the complete LaTeX document
  return `\\documentclass[letterpaper,11pt]{article}



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
  \\vspace{-4pt}\\scshape\\raggedright\\bfseries\\small
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

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

   {\\Large \\scshape \\textbf{${escapeLatex(name)}}} \\\\[1mm] % Reduced from 2mm

\\footnotesize \\raisebox{-0.1\\height}

\\faPhone\\ \\underline{\\textbf{${escapeLatex(phone)}}} ~ 

\\faEnvelope\\ \\underline{\\textbf{${escapeLatex(email)}}} ~ 

\\end{center}

%-----------EDUCATION-----------
\\section{EDUCATION} 
\\resumeSubHeadingListStart
  \\resumeItemListStart
${formatSection(educationContent) || "    \\resumeItem{Add your education details}"}
  \\resumeItemListEnd
\\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{TECHNICAL SKILLS}

\\resumeSubHeadingListStart

  \\resumeItemListStart

${formatSection(skillsContent) || "    \\resumeItem{\\textbf{Languages:} }\\n    \\resumeItem{\\textbf{Libraries/Frameworks/Databases:} }\\n    \\resumeItem{\\textbf{Tools and Technologies:} }"}
  \\resumeItemListEnd

\\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{EXPERIENCE}
\\resumeSubHeadingListStart
  \\resumeItemListStart
${formatSection(experienceContent) || "    \\resumeItem{Add your experience details}"}
  \\resumeItemListEnd
\\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{PROJECTS} 
\\resumeSubHeadingListStart
  \\resumeItemListStart
${formatSection(projectsContent) || "    \\resumeItem{Add your project details}"}
  \\resumeItemListEnd
\\resumeSubHeadingListEnd

\\end{document}`;
}