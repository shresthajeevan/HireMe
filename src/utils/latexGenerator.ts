import { ResumeData } from "@/components/ResumeForm";

export function generateLatex(data: ResumeData, jobDescription: string): string {
  // Helper function to escape LaTeX special characters
  const escapeLatex = (str: string): string => {
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[&%$#_{}]/g, "\\$&")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
  };

  // Generate education section
  const educationSection = data.education
    .map(
      (edu) => `  \\resumeSubheading
    {${escapeLatex(edu.university)}}{${escapeLatex(edu.graduationDate)}}
    {${escapeLatex(edu.degree)}}{${escapeLatex(edu.location)}} 
  \\resumeItemListStart
    \\resumeItem {\\textbf{Relevant Coursework:} ${escapeLatex(edu.coursework)}}
  \\resumeItemListEnd`
    )
    .join("\n");

  // Generate experience section
  const experienceSection = data.experience
    .map((exp) => {
      const achievements = exp.achievements
        .filter((a) => a.trim())
        .map((achievement) => `    \\resumeItem{${escapeLatex(achievement)}}`)
        .join("\n");

      return `  \\resumeSubheading
    {${escapeLatex(exp.title)}}{${escapeLatex(exp.startDate)} – ${escapeLatex(exp.endDate)}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
  \\resumeItemListStart
${achievements}
  \\resumeItemListEnd`;
    })
    .join("\n");

  // Generate projects section
  const projectsSection = data.projects
    .map((proj) => {
      const descriptions = proj.descriptions
        .filter((d) => d.trim())
        .map((desc) => `    \\resumeItem{${escapeLatex(desc)}}`)
        .join("\n");

      const projectUrl = proj.url ? escapeLatex(proj.url) : "";
      const projectLink = projectUrl
        ? ` -- \\href{${projectUrl}}{\\textbf{\\underline{\\textcolor{blue}{GitHub}}}}`
        : "";

      return `  \\resumeProjectHeading
    {${escapeLatex(proj.name)} $|$ ${escapeLatex(proj.techStack)}${projectLink}}{}
  \\resumeItemListStart
${descriptions}
  \\resumeItemListEnd`;
    })
    .join("\n");

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
   {\\Large \\scshape \\textbf{${escapeLatex(data.name)}}} \\\\[1mm]
   \\footnotesize
   \\faPhone\\ \\underline{\\textbf{${escapeLatex(data.phone)}}} ~ 
   \\faEnvelope\\ \\underline{\\textbf{${escapeLatex(data.email)}}} ~
   \\faLinkedin\\ \\underline{\\textbf{${escapeLatex(data.linkedin)}}} ~
   \\faGithub\\ \\underline{\\textbf{${escapeLatex(data.github)}}}
\\end{center}

%-----------EDUCATION-----------
\\section{EDUCATION} 
\\resumeSubHeadingListStart
${educationSection}
\\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{TECHNICAL SKILLS}
\\resumeSubHeadingListStart
  \\resumeItemListStart
    \\resumeItem{\\textbf{Languages:} ${escapeLatex(data.skills.languages)}}
    \\resumeItem{\\textbf{Frameworks/Libraries/Databases:} ${escapeLatex(data.skills.frameworks)}}
    \\resumeItem{\\textbf{Tools and Technologies:} ${escapeLatex(data.skills.tools)}}
  \\resumeItemListEnd
\\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{EXPERIENCE}
\\resumeSubHeadingListStart
${experienceSection}
\\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{PROJECTS} 
\\resumeSubHeadingListStart
${projectsSection}
\\resumeSubHeadingListEnd

\\end{document}`;
}
