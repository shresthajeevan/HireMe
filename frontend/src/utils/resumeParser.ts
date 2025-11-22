import { ResumeData } from '@/services/resumeApi';

/**
 * Parse raw resume text into structured ResumeData format
 * This is a simple parser - you can enhance it based on your needs
 */
export function parseResumeText(rawText: string): ResumeData {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    // Initialize result
    const result: ResumeData = {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        education: [],
        technicalSkills: {
            languages: '',
            frameworks: '',
            tools: ''
        },
        experience: [],
        projects: []
    };

    // Extract contact info
    const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const emailMatch = rawText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
    const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);

    if (phoneMatch) result.phone = phoneMatch[0];
    if (emailMatch) result.email = emailMatch[0];
    if (linkedinMatch) result.linkedin = linkedinMatch[0].replace(/https?:\/\/(www\.)?/, '');
    if (githubMatch) result.github = githubMatch[0].replace(/https?:\/\/(www\.)?/, '');

    // Extract name (usually first line)
    for (const line of lines.slice(0, 5)) {
        if (!line.match(/@/) && !line.match(/\d{3}[-.\s]?\d{3}/) &&
            !line.match(/linkedin/i) && !line.match(/github/i) &&
            line.length > 3 && line.length < 50) {
            result.name = line;
            break;
        }
    }
    if (!result.name) result.name = lines[0] || 'Your Name';

    // Find section indices
    const educationIndex = rawText.toLowerCase().indexOf('education');
    const experienceIndex = rawText.toLowerCase().indexOf('experience');
    const projectsIndex = rawText.toLowerCase().indexOf('project');
    const skillsIndex = rawText.toLowerCase().indexOf('skill');

    // Extract sections
    let currentSection = '';
    let currentItem: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const upperLine = line.toUpperCase();

        // Detect section headers
        if (upperLine.includes('EDUCATION')) { currentSection = 'education'; continue; }
        if (upperLine.includes('TECHNICAL SKILLS') || upperLine === 'SKILLS') { currentSection = 'skills'; continue; }
        if (upperLine.includes('EXPERIENCE')) { currentSection = 'experience'; continue; }
        if (upperLine.includes('PROJECTS')) { currentSection = 'projects'; continue; }

        // Parse education
        if (currentSection === 'education') {
            const isUniversity = line.match(/university|college|institute|school/i);
            const isDegree = line.match(/bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\./i);

            if (isUniversity) {
                if (currentItem) result.education.push(currentItem);
                currentItem = {
                    university: line,
                    graduationDate: '',
                    degree: '',
                    location: '',
                    coursework: '',
                    gpa: ''
                };
            } else if (isDegree && currentItem) {
                currentItem.degree = line;
            } else if (currentItem) {
                const gpaMatch = line.match(/GPA[:\s]*([0-9.\/]+)/i);
                if (gpaMatch) currentItem.gpa = gpaMatch[1];
                if (line.match(/coursework/i)) {
                    currentItem.coursework = line.replace(/[-•]\s*(?:relevant\s+)?coursework[:\s]*/i, '');
                }
            }
        }

        // Parse skills
        if (currentSection === 'skills') {
            const cleanLine = line.replace(/^[-•]\s*/, '');
            if (cleanLine.match(/languages?:/i)) {
                result.technicalSkills.languages = cleanLine.replace(/languages?:/i, '').trim();
            } else if (cleanLine.match(/frameworks?|libraries|databases/i)) {
                result.technicalSkills.frameworks = cleanLine.replace(/^[^:]+:\s*/, '');
            } else if (cleanLine.match(/tools?|technologies|software/i)) {
                result.technicalSkills.tools = cleanLine.replace(/^[^:]+:\s*/, '');
            }
        }

        // Parse experience
        if (currentSection === 'experience') {
            if (!line.startsWith('-') && !line.startsWith('•') && line.length > 3) {
                if (currentItem) result.experience.push(currentItem);
                currentItem = {
                    jobTitle: line,
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    achievements: []
                };
            } else if (currentItem && (line.startsWith('-') || line.startsWith('•'))) {
                currentItem.achievements.push(line.replace(/^[-•]\s*/, ''));
            }
        }

        // Parse projects
        if (currentSection === 'projects') {
            if (!line.startsWith('-') && !line.startsWith('•') && line.length > 3) {
                if (currentItem) result.projects.push(currentItem);
                const parts = line.split(/[|–—]/);
                const projectName = parts[0]?.trim() || '';
                const rest = parts.slice(1).join('').trim();
                const githubMatch = rest.match(/(https?:\/\/)?github\.com\/[\w-]+\/[\w-]+/i);
                currentItem = {
                    name: projectName,
                    techStack: rest.replace(githubMatch ? githubMatch[0] : '', '').trim(),
                    githubUrl: githubMatch ? githubMatch[0] : '',
                    descriptions: []
                };
            } else if (currentItem && (line.startsWith('-') || line.startsWith('•'))) {
                currentItem.descriptions.push(line.replace(/^[-•]\s*/, ''));
            }
        }
    }

    // Push last items
    if (currentSection === 'education' && currentItem) result.education.push(currentItem);
    if (currentSection === 'experience' && currentItem) result.experience.push(currentItem);
    if (currentSection === 'projects' && currentItem) result.projects.push(currentItem);

    return result;
}
