import React from 'react';
import { cn } from '@/lib/utils';

const LANG_COLORS = {
  python: 'text-yellow-400',
  java: 'text-orange-400',
  cpp: 'text-blue-400',
  javascript: 'text-yellow-300',
};

export default function CodeEditor({ value, onChange, language }) {
  const lines = (value || '').split('\n');

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-[#0d1117] shadow-xl">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-[11px] font-bold font-mono uppercase tracking-widest", LANG_COLORS[language] || 'text-muted-foreground')}>
            {language}
          </span>
        </div>
        <div className="w-16" />
      </div>

      {/* Editor body */}
      <div className="flex min-h-[320px]">
        {/* Line numbers */}
        <div className="flex flex-col items-end px-3 py-4 select-none bg-white/[0.01] border-r border-white/5 min-w-[44px]">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] text-white/20 font-mono leading-6 text-right w-full">{i + 1}</div>
          ))}
        </div>
        {/* Text area */}
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"# Paste or type your code here...\n# CodeMentor will analyze it with your memory context"}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-[13px] font-mono text-[#e6edf3] leading-6 resize-y focus:outline-none placeholder:text-white/15 min-h-[320px] w-full"
        />
      </div>
    </div>
  );
}