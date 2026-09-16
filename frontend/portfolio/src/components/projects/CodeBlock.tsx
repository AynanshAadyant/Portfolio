import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#0A0A0C] overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#121216]/60">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-green-500/80" />
          {title && <span className="ml-2 text-xs font-mono text-[#FAFAFA] font-medium">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">{language}</span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-[#FAFAFA] transition-colors p-1"
            title="Copy code"
            aria-label="Copy code"
          >
            {copied ? <Check className="size-3.5 text-[#10B981]" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-mono leading-relaxed text-[#FAFAFA]/90">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
