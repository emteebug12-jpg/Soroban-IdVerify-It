"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export default function CopyButton({ value, className = "", label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-slate-200 ${className}`}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.42L8.5 12.086l6.79-6.795a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a2 2 0 00-2 2v9a2 2 0 002 2h7a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0010.586 3H7z" />
            <path d="M4 6a2 2 0 00-2 2v9a2 2 0 002 2h7a2 2 0 002-2H6a2 2 0 01-2-2V6z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
