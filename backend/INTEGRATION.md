# Frontend Integration Guide

This guide shows how to integrate the backend API with your existing React/TypeScript frontend.

## 🔗 Quick Integration

### 1. Update Your Frontend to Call the Backend

Replace the local `generateSimpleLatex` function with API calls to the backend.

#### Create an API Service

Create `src/services/resumeApi.ts`:

```typescript
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
 * Generate AI-enhanced resume
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
export async function downloadResumePDF(latexCode: string, filename = 'resume.pdf'): Promise<void> {
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
```

### 2. Update Your Index.tsx Page

Modify `src/pages/Index.tsx` to use the backend:

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { generateEnhancedResume, downloadResumePDF } from "@/services/resumeApi";

const Index = () => {
  const [rawResume, setRawResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedLatex, setGeneratedLatex] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!rawResume.trim()) {
      toast.error("Please enter your resume details");
      return;
    }

    setLoading(true);
    try {
      // Parse raw resume into structured data
      // You can use your existing parseResume function or create a simple parser
      const resumeData = parseResumeText(rawResume);
      
      // Call backend API
      const { latexCode, enhancedData } = await generateEnhancedResume(
        resumeData,
        jobDescription
      );
      
      setGeneratedLatex(latexCode);
      toast.success("AI-enhanced resume generated!");
    } catch (error) {
      toast.error(error.message || "Failed to generate resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedLatex) {
      toast.error("Generate a resume first");
      return;
    }

    setLoading(true);
    try {
      await downloadResumePDF(generatedLatex);
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error(error.message || "Failed to download PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLatex);
      setCopied(true);
      toast.success("LaTeX code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Helper function to parse raw resume text into structured data
  function parseResumeText(text: string) {
    // Implement your parsing logic here
    // This is a simplified example
    return {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0123",
      education: [],
      technicalSkills: {
        languages: "Python, JavaScript",
        frameworks: "React, Node.js",
        tools: "Git, Docker"
      },
      experience: [],
      projects: []
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#130b2c] via-[#1d1538] to-[#241c46]">
      {/* ... existing header ... */}
      
      <main className="container mx-auto px-4 pb-20 pt-10">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <Card className="p-6 bg-[#1a1231]/80 border border-[#3a2a66]">
              {/* ... existing input fields ... */}
              
              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-12 text-base font-medium"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {loading ? "Generating..." : "Generate AI-Enhanced Resume"}
              </Button>
            </Card>
          </div>

          {/* Right Column - Generated LaTeX */}
          <div>
            <Card className="p-6 h-full bg-[#1a1231]/80 border border-[#3a2a66]">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  Generated LaTeX
                </h2>
                {generatedLatex && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>

              {generatedLatex ? (
                <div className="bg-[#120a25] border border-[#3a2a66] rounded-lg p-4 overflow-auto max-h-[calc(100vh-300px)]">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-200">
                    {generatedLatex}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-60px)] text-gray-500 text-sm italic">
                  Your AI-enhanced LaTeX code will appear here.
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
```

### 3. Add Environment Variable

Create `.env.local` in your frontend root:

```env
VITE_API_URL=http://localhost:3001
```

For production:
```env
VITE_API_URL=https://your-backend-url.com
```

### 4. Test the Integration

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend (in a new terminal):
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 and test:
   - Enter resume details
   - Add job description
   - Click "Generate AI-Enhanced Resume"
   - Click "Download PDF" to get the PDF file

## 🎯 Key Features

### AI Enhancement
The backend will:
- Extract keywords from job description
- Rewrite bullet points with strong action verbs
- Prioritize relevant skills
- Improve clarity and impact
- Ensure ATS optimization

### PDF Generation
- Direct PDF download
- No need to copy/paste into Overleaf
- Professional formatting maintained

## 🐛 Troubleshooting

### CORS Errors
Make sure your frontend URL is in the backend's `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### API Connection Failed
- Verify backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env.local`
- Check browser console for errors

### PDF Download Fails
- Ensure `pdflatex` is installed on the backend server
- Check backend logs for LaTeX compilation errors

## 📱 Production Deployment

When deploying to production:

1. **Backend**: Deploy to Render/Railway/Docker
2. **Frontend**: Update `VITE_API_URL` to your backend URL
3. **CORS**: Add production frontend URL to `ALLOWED_ORIGINS`

Example production setup:
```env
# Backend .env
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app

# Frontend .env.production
VITE_API_URL=https://your-backend.render.com
```
