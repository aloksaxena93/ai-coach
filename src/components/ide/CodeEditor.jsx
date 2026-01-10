import React, { useState, useRef } from 'react';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CodeEditor({ code, onChange, language = 'python', onRun }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-slate-400 hover:text-white hover:bg-[#30363d]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="h-7 px-2 text-slate-400 hover:text-white hover:bg-[#30363d]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="py-4 px-2 bg-[#0d1117] text-right select-none overflow-hidden border-r border-[#21262d]"
          style={{ minWidth: '3rem' }}
        >
          {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
            <div
              key={i + 1}
              className="text-xs leading-6 text-slate-600 font-mono"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="absolute inset-0 w-full h-full py-4 px-4 bg-transparent text-slate-200 font-mono text-sm leading-6 resize-none outline-none caret-blue-400"
            placeholder="// Start writing your solution here..."
            style={{
              tabSize: 4,
            }}
          />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-t border-[#30363d]">
        <div className="text-xs text-slate-500">
          {lineCount} lines • {code.length} characters
        </div>
        <Button
          size="sm"
          onClick={onRun}
          className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Run Code
        </Button>
      </div>
    </div>
  );
}

