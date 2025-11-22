import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { generateEnhancedResume, downloadResumePDF, chatWithAI } from "@/services/resumeApi";
import { parseResumeText } from "@/utils/resumeParser";

const Index = () => {
  const [rawResume, setRawResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedLatex, setGeneratedLatex] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  // Chat state for resume Q&A
  type ChatMessage = { role: 'user' | 'assistant'; text: string };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  const leftCardRef = useRef<HTMLDivElement>(null);
  const [leftCardHeight, setLeftCardHeight] = useState<number>(0);

  // Sync left card height to right card
  useEffect(() => {
    const updateHeight = () => {
      if (leftCardRef.current) {
        setLeftCardHeight(leftCardRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [rawResume, jobDescription]);

  const handleGenerate = async () => {
    if (!rawResume.trim()) {
      toast.error("Please enter your resume details");
      return;
    }
    setLoading(true);
    try {
      const resumeData = parseResumeText(rawResume);
      const { latexCode } = await generateEnhancedResume(
        resumeData,
        jobDescription || "General software engineering position"
      );
      setGeneratedLatex(latexCode);
      toast.success("AI-enhanced resume generated!");
    } catch (error: any) {
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
    } catch (error: any) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#130b2c] via-[#1d1538] to-[#241c46] text-foreground">
      {/* Header */}
      <header className="py-4 border-b border-[#2f2255] shadow-[0_0_15px_rgba(120,60,255,0.1)] bg-gradient-to-b from-[#0d081a] to-[#17102d] relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:h-16 gap-4 md:gap-0">
          {/* Logo Section */}
          <div className="flex-1 flex justify-start w-full md:w-auto">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(120,60,255,0.15)]">
              HireMeNow
            </h1>
          </div>


          {/* Centered Title Section */}
          <div className="text-center w-full md:w-auto">
            <h2 className="text-l sm:text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(120,60,255,0.15)]">
              ATS-Optimized Resume Builder
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 hidden sm:block mt-1">
              Create polished, AI-enhanced LaTeX resumes
            </p>
          </div>

          {/* Right Spacer */}
          <div className="hidden md:flex flex-1 justify-end"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
          {/* Left Column - Inputs */}
          <div className="space-y-6" ref={leftCardRef}>
            <Card className="p-4 sm:p-6 bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-100">
                Your Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm sm:text-base font-medium mb-2 block text-gray-300">
                    1. Your Raw Experience or Current Resume
                  </label>
                  <Textarea
                    value={rawResume}
                    onChange={(e) => setRawResume(e.target.value)}
                    placeholder="Paste your resume here..."
                    className="min-h-[220px] sm:min-h-[280px] font-mono text-sm sm:text-base resize-y bg-[#140a26] text-gray-100 border-[#3a2a66] focus-visible:ring-2 focus-visible:ring-violet-400"
                  />
                </div>

                <div>
                  <label className="text-sm sm:text-base font-medium mb-2 block text-gray-300">
                    2. Target Job Description
                  </label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste target job description here..."
                    className="min-h-[220px] sm:min-h-[280px] font-mono text-sm sm:text-base resize-y bg-[#140a26] text-gray-100 border-[#3a2a66] focus-visible:ring-2 focus-visible:ring-violet-400"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full sm:h-12 h-10 text-sm sm:text-base md:text-lg font-medium bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:opacity-90 transition-opacity text-white shadow-[0_0_16px_rgba(120,60,255,0.25)] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                  {loading ? "Generating with AI..." : "Generate AI-Enhanced Resume"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Generated LaTeX */}
          <div className="flex flex-col">
            <Card
              className="p-4 sm:p-6 flex flex-col bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md"
              style={{ height: leftCardHeight || "auto" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
                  Generated Overleaf-Ready LaTeX
                </h2>
                {generatedLatex && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      disabled={loading}
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
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="flex items-center gap-2 text-sm border-[#3a2a66] hover:bg-[#2b1f4a]"
                    >
                      <Download className="w-4 h-4 text-violet-400" />
                      {loading ? "Generating..." : "Download PDF"}
                    </Button>
                  </div>
                )}
              </div>

              {generatedLatex ? (
                <div className="bg-[#120a25] border border-[#3a2a66] rounded-lg p-4 overflow-auto flex-1">
                  <pre className="text-xs sm:text-sm md:text-base font-mono whitespace-pre-wrap break-words text-gray-200">
                    {generatedLatex}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base italic">
                  Your AI-generated LaTeX code will appear here.
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="max-w-7xl mx-auto mt-10">
          <Card className="p-4 sm:p-6 bg-[#1a1231]/80 border border-[#3a2a66] shadow-[0_0_18px_rgba(100,60,200,0.1)] backdrop-blur-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
              Resume & Job Q&A
            </h2>

            {/* Chat messages */}
            <div className="mt-2 max-h-[300px] overflow-y-auto space-y-3 px-2 py-1 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-gray-800">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <span
                    className={`max-w-[75%] px-3 py-2 break-words rounded-lg ${msg.role === "user"
                      ? "bg-violet-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-200 rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="mt-4 flex space-x-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your resume..."
                className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-[#140a26] text-gray-100 border border-[#3a2a66] rounded-md focus-visible:ring-2 focus-visible:ring-violet-400 px-3 py-2"
              />
              <Button
                onClick={async () => {
                  if (!chatInput.trim()) return;
                  const userMsg: ChatMessage = { role: "user", text: chatInput.trim() };
                  setChatMessages((prev) => [...prev, userMsg]);
                  setChatInput("");

                  try {
                    const reply = await chatWithAI(rawResume, jobDescription, userMsg.text);
                    const aiMsg: ChatMessage = { role: "assistant", text: reply };
                    setChatMessages((prev) => [...prev, aiMsg]);
                  } catch (error) {
                    toast.error("Failed to get AI response");
                    console.error(error);
                  }
                }}
                disabled={loading}
                className="h-10 sm:h-12 px-4 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-md transition-colors shadow-[0_0_6px_rgba(120,60,255,0.25)] flex items-center justify-center"
              >
                Send
              </Button>
            </div>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default Index;
