const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    education: Array<{
        university: string;
        degree: string;
        graduationDate: string;
        location: string;
        gpa?: string;
        coursework?: string;
    }>;
    technicalSkills: {
        languages: string;
        frameworks: string;
        tools: string;
    };
    experience: Array<{
        jobTitle: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        achievements: string[];
    }>;
    projects: Array<{
        name: string;
        techStack: string;
        githubUrl?: string;
        descriptions: string[];
    }>;
}

export interface GenerateResponse {
    success: boolean;
    latexCode: string;
    enhancedData: ResumeData;
}

/**
 * Generate AI-enhanced resume using backend API
 */
export async function generateEnhancedResume(
    resumeData: ResumeData,
    jobDescription: string
): Promise<GenerateResponse> {
    const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate resume');
    }

    return response.json();
}

/**
 * Download PDF from LaTeX code
 */
export async function downloadResumePDF(
    latexCode: string,
    filename = 'resume.pdf'
): Promise<void> {
    const response = await fetch(`${API_BASE}/api/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate PDF');
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Chat with AI about resume
 */
export async function chatWithAI(
    rawResume: string,
    jobDescription: string,
    message: string
): Promise<string> {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawResume, jobDescription, message })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Chat failed');
    }

    const data = await response.json();
    return data.reply;
}
