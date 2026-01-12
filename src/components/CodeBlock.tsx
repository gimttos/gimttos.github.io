import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  onCopy: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, onCopy }) => {
  const [isCopiedLocal, setIsCopiedLocal] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopiedLocal(true);
      onCopy(); // Trigger global toast
      setTimeout(() => setIsCopiedLocal(false), 2000);
    });
  };

  return (
    <div className="relative group border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm mt-6">
      <div className="absolute top-0 right-0 p-2 z-10">
        <button
          onClick={handleCopyClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-md transition-colors border border-zinc-300 backdrop-blur-sm opacity-90 hover:opacity-100"
          title="코드 복사"
        >
          {isCopiedLocal ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {isCopiedLocal ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      {/* Code Container with Scroll */}
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-zinc-50 p-6 text-sm font-mono leading-relaxed">
        <pre className="whitespace-pre-wrap break-all text-zinc-800">
          <code>{code}</code>
        </pre>
      </div>
      
      <div className="bg-zinc-100 px-4 py-2 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between items-center">
        <span>Tampermonkey JavaScript</span>
        <span>{code.split('\n').length} lines</span>
      </div>
    </div>
  );
};

export default CodeBlock;