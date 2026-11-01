import React, { useRef, useState } from 'react';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { Trash2, WrapText, Hash } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  label?: string;
  badge?: React.ReactNode;
  height?: string;
  showStats?: boolean;
  showClear?: boolean;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  showWrapToggle?: boolean;
  downloadFilename?: string;
  actions?: React.ReactNode;
  error?: string | null;
  className?: string;
  onExecute?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter content...',
  readOnly = false,
  label,
  badge,
  height = 'h-64 sm:h-80',
  showStats = true,
  showClear = true,
  showCopy = true,
  showLineNumbers = false,
  showWrapToggle = true,
  downloadFilename,
  actions,
  error,
  className = '',
  onExecute,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [lineNumbersVisible, setLineNumbersVisible] = useState<boolean>(showLineNumbers);

  const lines = value ? value.split(/\r?\n/) : [''];
  const linesCount = value ? lines.length : 0;
  const charsCount = value.length;
  const byteSize = new TextEncoder().encode(value).length;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
      textareaRef.current?.focus();
    }
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (onExecute) {
        e.preventDefault();
        onExecute();
      }
      return;
    }

    if (e.key === 'Tab' && !readOnly && onChange) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated = value.substring(0, start) + '  ' + value.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden transition-all duration-150 ${
        error ? 'border-[#F07178]' : 'focus-within:border-[#8B7CFF]/50'
      } ${className}`}
    >
      {/* Editor Header Bar */}
      {(label || actions || showCopy || downloadFilename || showClear || showWrapToggle) && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A] gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {label && (
              <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">{label}</span>
            )}
            {badge}
          </div>

          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {actions}

            {/* Word wrap toggle */}
            {showWrapToggle && (
              <button
                type="button"
                onClick={() => setWordWrap(!wordWrap)}
                title={wordWrap ? 'Disable word wrap (horizontal scroll)' : 'Enable word wrap'}
                aria-label="Toggle word wrap"
                className={`p-1.5 rounded-lg border transition-colors ${
                  wordWrap
                    ? 'bg-[#1D2532] text-[#8B7CFF] border-[#8B7CFF]/30'
                    : 'text-[#697386] hover:text-[#929BAA] border-transparent hover:bg-[#171D28]'
                }`}
              >
                <WrapText className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Line numbers toggle */}
            <button
              type="button"
              onClick={() => setLineNumbersVisible(!lineNumbersVisible)}
              title={lineNumbersVisible ? 'Hide line numbers' : 'Show line numbers'}
              aria-label="Toggle line numbers"
              className={`p-1.5 rounded-lg border transition-colors ${
                lineNumbersVisible
                  ? 'bg-[#1D2532] text-[#8B7CFF] border-[#8B7CFF]/30'
                  : 'text-[#697386] hover:text-[#929BAA] border-transparent hover:bg-[#171D28]'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
            </button>

            {downloadFilename && <DownloadButton content={value} filename={downloadFilename} disabled={!value} />}
            {showCopy && <CopyButton textToCopy={value} />}

            {showClear && !readOnly && onChange && value && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear editor"
                aria-label="Clear input"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F07178] hover:bg-[#171D28] rounded-lg transition-colors border border-transparent hover:border-[#252D3A]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Editor Body: Optional Line Numbers + Textarea */}
      <div className={`relative flex w-full ${height} bg-[#11151D] overflow-hidden`}>
        {lineNumbersVisible && (
          <div className="hidden sm:block py-3 px-2 bg-[#0D1017]/90 border-r border-[#252D3A]/60 font-mono-code text-[11px] text-[#697386] text-right select-none overflow-hidden max-w-[45px] shrink-0 leading-relaxed">
            {lines.slice(0, 300).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
            {lines.length > 300 && <div>...</div>}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          wrap={wordWrap ? 'soft' : 'off'}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="flex-1 w-full h-full p-3 sm:p-4 font-mono-code text-xs sm:text-sm text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed overflow-auto selection:bg-[#8B7CFF]/30 select-text"
        />
      </div>

      {/* Error banner if validation failed */}
      {error && (
        <div className="px-3.5 py-2 text-xs font-mono text-[#F07178] bg-[#F07178]/10 border-t border-[#F07178]/20 break-words">
          {error}
        </div>
      )}

      {/* Editor Status Bar */}
      {showStats && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0D1017]/80 border-t border-[#252D3A] text-[11px] text-[#697386] font-mono-code flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span>
              {linesCount} {linesCount === 1 ? 'line' : 'lines'}
            </span>
            <span>·</span>
            <span>{charsCount} chars</span>
            <span>·</span>
            <span>{formatBytes(byteSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{wordWrap ? 'Wrap ON' : 'Wrap OFF'}</span>
            <span>·</span>
            <span>{readOnly ? 'Output' : 'Editable'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
