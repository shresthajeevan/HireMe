export function generateSimpleLatex(rawResume: string, jobDescription: string): string {
  // Helper function to escape LaTeX special characters
  const escapeLatex = (str: string): string => {
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[&%$#_{}]/g, "\\$&")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
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
    name = lines[0];
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

  // Format as bullet points
  const formatSection = (content: string): string => {
    if (!content) return "  \\resumeItem{Add your information here}";
    
    const lines = content
      .split("\n")
      .filter((line) => line.trim() && !line.toLowerCase().includes("education") && !line.toLowerCase().includes("experience") && !line.toLowerCase().includes("project") && !line.toLowerCase().includes("skill"))
      .map((line) => line.trim());

    return lines.map((line) => `    \\resumeItem{${escapeLatex(line)}}`).join("\n");
  };

  // Generate the complete LaTeX document
  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{setspace}
\\setstretch{1.2}

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

\\setlength{\\multicolsep}{-4.0pt}
\\setlength{\\columnsep}{-2pt}

\\usepackage[margin=1.5cm]{geometry}

\\pagestyle{fancy}
\\fancyhf{}
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

\\renewcommand\\labelitemi{\\textbullet}

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1\\vspace{-3pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-3pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-8pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-8pt}
}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=1em, label=\\textbullet]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
   {\\Large \\scshape \\textbf{${escapeLatex(name)}}} \\\\[1mm]
   \\footnotesize
   \\faPhone\\ \\underline{\\textbf{${escapeLatex(phone)}}} ~ 
   \\faEnvelope\\ \\underline{\\textbf{${escapeLatex(email)}}} ~
   \\faLinkedin\\ \\underline{\\textbf{${escapeLatex(linkedin)}}} ~
   \\faGithub\\ \\underline{\\textbf{${escapeLatex(github)}}}
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
${formatSection(skillsContent) || "    \\resumeItem{\\textbf{Languages:} }\\n    \\resumeItem{\\textbf{Frameworks/Libraries/Databases:} }\\n    \\resumeItem{\\textbf{Tools and Technologies:} }"}
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
