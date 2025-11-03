import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LatexPreviewProps {
  latex: string;
}

export function LatexPreview({ latex }: LatexPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      toast.success("LaTeX code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Generated LaTeX</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Copy this code and paste it into Overleaf or your LaTeX editor
          </p>
        </div>
        <Button onClick={handleCopy} variant="default">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy LaTeX
            </>
          )}
        </Button>
      </div>
      <Card className="p-6 bg-card">
        <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {latex}
        </pre>
      </Card>
    </div>
  );
}
