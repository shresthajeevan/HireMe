import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { generateSimpleLatex } from "@/utils/simpleLatexGenerator";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [rawResume, setRawResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedLatex, setGeneratedLatex] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!rawResume.trim()) {
      toast.error("Please enter your resume details");
      return;
    }
    const latex = generateSimpleLatex(rawResume, jobDescription);
    setGeneratedLatex(latex);
    toast.success("LaTeX resume generated!");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#130b2c] via-[#1d1538] to-[#241c46] text-foreground">
      {/* Header */}
     <header className="py-12 text-center border-b border-[#2f2255] shadow-[0_0_15px_rgba(120,60,255,0.1)] bg-gradient-to-b from-[#0d081a] to-[#17102d]">
  <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(120,60,255,0.15)]">
    HireMeNow — ATS-Optimized Resume Builder
  </h1>
  <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
    Create polished, AI-enhanced LaTeX resumes optimized for applicant tracking systems.
  </p>
</header>


      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 pt-10">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <Card className="p-6 bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Your Details
              </h2>
              <div className="space-y-6">
                {/* Raw Resume Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">
                    1. Your Raw Experience or Current Resume
                  </label>
                  <Textarea
                    value={rawResume}
                    onChange={(e) => setRawResume(e.target.value)}
                    placeholder={`John Doe
(123) 456-7890 | john.doe@email.com | linkedin.com/in/johndoe | github.com/johndoe

EDUCATION
State University, Anytown, USA
Bachelor of Science in Computer Science, May 2024
GPA: 3.8/4.0

EXPERIENCE
Software Engineer Intern, Tech Solutions Inc. (May 2023 - Aug 2023)
- Built and optimized UI components for the main web app.
- Improved performance and fixed bugs.
- Participated in team sprints and code reviews.`}
                    className="min-h-[280px] font-mono text-sm resize-y bg-[#140a26] text-gray-100 border-[#3a2a66] focus-visible:ring-2 focus-visible:ring-violet-400"
                  />
                </div>

                {/* Job Description Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">
                    2. Target Job Description
                  </label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={`Job Title: Frontend Engineer, Core Platform

Responsibilities:
- Develop, test, and maintain high-quality user-facing features.
- Collaborate with PMs, designers, and backend engineers.
- Optimize performance across devices and browsers.`}
                    className="min-h-[280px] font-mono text-sm resize-y bg-[#140a26] text-gray-100 border-[#3a2a66] focus-visible:ring-2 focus-visible:ring-violet-400"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:opacity-90 transition-opacity text-white shadow-[0_0_16px_rgba(120,60,255,0.25)]"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Overleaf-Ready Resume
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Generated LaTeX */}
          <div>
            <Card className="p-6 h-full bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  Generated Overleaf-Ready LaTeX
                </h2>
                {generatedLatex && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-sm border-[#3a2a66] hover:bg-[#2b1f4a]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-violet-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-violet-400" />
                        Copy
                      </>
                    )}
                  </Button>
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
                  Your AI-generated LaTeX code will appear here.
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="max-w-7xl mx-auto mt-10">
          <Card className="p-6 bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-100">
              Resume & Job Q&A
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Coming soon — interactive Q&A to help tailor your resume perfectly
              for your target role.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
