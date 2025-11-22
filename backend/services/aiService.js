import { GoogleGenAI } from "@google/genai";

/**
 * AI Service for Resume Enhancement
 * Uses Google Gemini AI to analyze job descriptions and enhance resume content
 */

/**
 * Escape LaTeX special characters
 */
function escapeLatex(text) {
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

/**
 * Enhance resume content using AI
 * @param {Object} resumeData - User's resume information
 * @param {string} jobDescription - Target job description
 * @returns {Promise<Object>} Enhanced resume data
 */
export async function enhanceResume(resumeData, jobDescription) {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const ai = new GoogleGenAI({ apiKey });

    // Create comprehensive prompt for AI
    const prompt = `You are an expert resume writer and ATS optimization specialist. Your task is to enhance a resume to match a specific job description while maintaining truthfulness and the candidate's actual experience.

**Job Description:**
${jobDescription}

**Current Resume Data:**
${JSON.stringify(resumeData, null, 2)}

**Your Tasks:**
1. Extract key skills, technologies, and keywords from the job description
2. Rewrite experience bullet points using strong action verbs (e.g., "Developed", "Implemented", "Optimized", "Led", "Architected")
3. Incorporate relevant keywords from the job description naturally into the experience and project descriptions
4. Improve clarity and impact of all descriptions
5. Prioritize skills that match the job description
6. Ensure all content is ATS-friendly (no special characters that break LaTeX)

**CRITICAL REQUIREMENTS:**
- Maintain factual accuracy - do not fabricate experience
- Keep the same structure as the input
- Output valid JSON only
- Do NOT use special characters like _, %, &, $, #, {, }, ~, ^ in the text (they will be escaped later)
- Use professional, concise language
- Each bullet point should be impactful and quantifiable when possible
- **TECHNICAL SKILLS:** EXTRACT skills directly from the input resume. Do NOT invent skills. Do NOT include soft skills like 'Leadership', 'Communication', 'Critical Thinking', or 'Problem Solving' in the Technical Skills section. Only include hard technical skills (languages, tools, software, frameworks) that the candidate actually lists or implies in their experience.

**Output Format (JSON only, no markdown):**
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "linkedin": "string",
  "github": "string",
  "education": [
    {
      "university": "string",
      "degree": "string",
      "graduationDate": "string",
      "location": "string",
      "gpa": "string (optional)",
      "coursework": "string (optional, relevant courses)"
    }
  ],
  "technicalSkills": [
    {
      "category": "string (e.g., Languages, Tools, Frameworks, Core Competencies)",
      "skills": "comma-separated list of skills"
    }
  ],
  "experience": [
    {
      "jobTitle": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "achievements": ["array of enhanced bullet points with strong action verbs"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "techStack": "string",
      "githubUrl": "string (optional)",
      "descriptions": ["array of enhanced bullet points"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const enhancedData = JSON.parse(jsonText);

    return enhancedData;
  } catch (error) {
    console.error('AI Enhancement Error:', error);
    throw new Error(`Failed to enhance resume: ${error.message}`);
  }
}

/**
 * Chat about resume using AI.
 * @param {string} rawResume - The raw resume text.
 * @param {string} jobDescription - Optional job description.
 * @param {string} message - User's question or comment.
 * @returns {Promise<string>} AI response.
 */
export async function chatAboutResume(rawResume, jobDescription = '', message) {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert resume advisor. The user has provided their raw resume text and a target job description. They ask the following question about their resume or how to improve it:

User Message: ${message}

Resume Text:
${rawResume}

Job Description:
${jobDescription}

Provide a concise, helpful answer (no markdown) focusing on actionable suggestions, keyword alignment, and improvements. Keep the response under 200 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;
    // Remove any markdown code fences if present
    if (text.startsWith('```')) {
      text = text.replace(/```[a-z]*\n?/g, '').replace(/```\n?$/g, '');
    }
    return text.trim();
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error(`Failed to chat about resume: ${error.message}`);
  }
}

/**
 * Generate LaTeX code from enhanced resume data
 * @param {Object} data - Enhanced resume data
 * @returns {string} Complete LaTeX document
 */
export function generateLatexFromData(data) {
  let latex = `\\documentclass[letterpaper,11pt]{article}

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
\\input{glyphtounicode}
\\usepackage[margin=1.5cm]{geometry}

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
\\footnotesize \\raisebox{-0.1\\height}
\\faPhone\\ \\underline{\\textbf{${escapeLatex(data.phone)}}} ~ 
\\faEnvelope\\ \\underline{\\textbf{${escapeLatex(data.email)}}} ~ 
`;

  // Add LinkedIn and GitHub if available
  if (data.linkedin) {
    latex += `\\faLinkedin\\ \\underline{\\textbf{${escapeLatex(data.linkedin)}}} ~ \n`;
  }
  if (data.github) {
    latex += `\\faGithub\\ \\underline{\\textbf{${escapeLatex(data.github)}}}\n`;
  }

  latex += `\\end{center}\n\n`;

  // EDUCATION
  if (data.education && data.education.length > 0) {
    latex += `%-----------EDUCATION-----------
\\section{EDUCATION} 
\\resumeSubHeadingListStart
`;
    data.education.forEach(edu => {
      const university = escapeLatex(edu.university || '');
      const gradDate = edu.graduationDate ? escapeLatex(edu.graduationDate) : '';
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
    \\resumeItem{\\textbf{Relevant Coursework:} ${escapeLatex(edu.coursework)}}
  \\resumeItemListEnd
`;
      }
    });
    latex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // TECHNICAL SKILLS
  if (data.technicalSkills && data.technicalSkills.length > 0) {
    latex += `%-----------TECHNICAL SKILLS-----------
\\section{TECHNICAL SKILLS}
\\resumeSubHeadingListStart
  \\resumeItemListStart
`;
    data.technicalSkills.forEach(skillGroup => {
      if (skillGroup.category && skillGroup.skills) {
        latex += `    \\resumeItem{\\textbf{${escapeLatex(skillGroup.category)}:} ${escapeLatex(skillGroup.skills)}}\n`;
      }
    });
    latex += `  \\resumeItemListEnd
\\resumeSubHeadingListEnd\n\n`;
  }

  // EXPERIENCE
  if (data.experience && data.experience.length > 0) {
    latex += `%-----------EXPERIENCE-----------
\\section{EXPERIENCE}
\\resumeSubHeadingListStart
`;
    data.experience.forEach(exp => {
      latex += `  \\resumeSubheading
    {${escapeLatex(exp.jobTitle)}}{${escapeLatex(exp.startDate)} – ${escapeLatex(exp.endDate)}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
  \\resumeItemListStart
`;
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          latex += `    \\resumeItem{${escapeLatex(achievement)}}\n`;
        });
      }
      latex += `  \\resumeItemListEnd
`;
    });
    latex += `\\resumeSubHeadingListEnd\n\n`;
  }

  // PROJECTS
  if (data.projects && data.projects.length > 0) {
    latex += `%-----------PROJECTS-----------
\\section{PROJECTS} 
\\resumeSubHeadingListStart
`;
    data.projects.forEach(proj => {
      const githubLink = proj.githubUrl ? `\\href{${proj.githubUrl}}{\\textbf{\\underline{\\textcolor{blue}{GitHub}}}}` : '';
      const projectTitle = `\\textbf{${escapeLatex(proj.name)} $|$ ${escapeLatex(proj.techStack)}${proj.githubUrl ? ' -- ' : ''}}${githubLink}`;
      latex += `  \\resumeProjectHeading
    {${projectTitle}}{}
  \\resumeItemListStart
`;
      if (proj.descriptions && proj.descriptions.length > 0) {
        proj.descriptions.forEach(desc => {
          latex += `    \\resumeItem{${escapeLatex(desc)}}\n`;
        });
      }
      latex += `  \\resumeItemListEnd
`;
    });
    latex += `\\resumeSubHeadingListEnd\n\n`;
  }

  latex += `\\end{document}`;
  return latex;
}
