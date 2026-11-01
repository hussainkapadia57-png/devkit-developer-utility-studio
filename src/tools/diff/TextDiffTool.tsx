import React, { useState, useMemo } from 'react';
import { GitCompare, ArrowLeftRight, Trash2, Plus, Minus, Columns2, AlignJustify } from 'lucide-react';
import { computeTextDiff, DiffResult } from '../../lib/diffUtils';
import { useAppStore } from '../../stores/useAppStore';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let sum = 0;
  for (var i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}

export default calculateTotal;`;

const SAMPLE_MODIFIED = `function calculateTotal(items, discount = 0) {
  // Use modern reduce with discount support
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal * (1 - discount);
  return Math.max(0, total);
}

export default calculateTotal;`;

export const TextDiffTool: React.FC = () => {
  const [original, setOriginal] = useState<string>(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const addToast = useAppStore((s) => s.addToast);

  const processedOriginal = useMemo(() => {
    let text = original;
    if (ignoreWhitespace) text = text.replace(/[ \t]+/g, ' ').trim();
    if (ignoreCase) text = text.toLowerCase();
    return text;
  }, [original, ignoreWhitespace, ignoreCase]);

  const processedModified = useMemo(() => {
    let text = modified;
    if (ignoreWhitespace) text = text.replace(/[ \t]+/g, ' ').trim();
    if (ignoreCase) text = text.toLowerCase();
    return text;
  }, [modified, ignoreWhitespace, ignoreCase]);

  const diffResult: DiffResult = useMemo(() => {
    return computeTextDiff(processedOriginal, processedModified);
  }, [processedOriginal, processedModified]);

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    addToast({
      type: 'info',
      title: 'Swapped original and modified texts',
      duration: 2000,
    });
  };

  const handleClearBoth = () => {
    setOriginal('');
    setModified('');
    addToast({
      type: 'info',
      title: 'Cleared both editors',
      duration: 2000,
    });
  };

  const loadSample = () => {
    setOriginal(SAMPLE_ORIGINAL);
    setModified(SAMPLE_MODIFIED);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-[#8B7CFF]" />
            Text Diff Checker
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Compare two versions of code or text with unified or side-by-side view, ignore whitespace, and line metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Action Controls & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#6C8CFF]" />
            Swap
          </button>

          <button
            type="button"
            onClick={handleClearBoth}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F07178] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Both
          </button>

          {/* Unified vs Split view switcher */}
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5 ml-2">
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'unified' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              Unified
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'split' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              Split Side-by-Side
            </button>
          </div>
        </div>

        {/* Diff Metrics & Comparison Flags */}
        <div className="flex items-center gap-4 text-xs font-mono-code flex-wrap">
          <label className="flex items-center gap-1.5 text-[#929BAA] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-[#252D3A] text-[#8B7CFF] focus:ring-0 bg-[#171D28]"
            />
            <span>Ignore Whitespace</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#32C48D]">
              <Plus className="w-3.5 h-3.5" />
              <span>+{diffResult.additions}</span>
            </span>
            <span className="text-[#697386]">·</span>
            <span className="flex items-center gap-1 text-[#F07178]">
              <Minus className="w-3.5 h-3.5" />
              <span>-{diffResult.deletions}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Input Editors Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F07178]">Original Text (Before)</span>
            <span className="text-xs text-[#697386] font-mono-code">{original.split(/\r?\n/).length} lines</span>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text version..."
            className="w-full h-48 sm:h-56 p-3.5 font-mono-code text-xs text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed overflow-auto"
            spellCheck={false}
          />
        </div>

        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#32C48D]">Modified Text (After)</span>
            <span className="text-xs text-[#697386] font-mono-code">{modified.split(/\r?\n/).length} lines</span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text version..."
            className="w-full h-48 sm:h-56 p-3.5 font-mono-code text-xs text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed overflow-auto"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Computed Diff View */}
      <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#0D1017] border-b border-[#252D3A]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
            {viewMode === 'unified' ? 'Unified Comparison Diff' : 'Side-by-Side Comparison Diff'}
          </span>
          <span className="text-xs font-mono-code text-[#697386]">
            {diffResult.lines.length} comparison lines
          </span>
        </div>

        {viewMode === 'unified' ? (
          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full border-collapse font-mono-code text-xs">
              <tbody>
                {diffResult.lines.map((line, idx) => {
                  let rowBg = 'hover:bg-[#171D28]/30';
                  let indicator = ' ';
                  let indicatorClass = 'text-transparent';
                  let textClass = 'text-[#929BAA]';

                  if (line.type === 'added') {
                    rowBg = 'bg-[#32C48D]/10 hover:bg-[#32C48D]/15';
                    indicator = '+';
                    indicatorClass = 'text-[#32C48D] font-bold';
                    textClass = 'text-[#32C48D]';
                  } else if (line.type === 'removed') {
                    rowBg = 'bg-[#F07178]/10 hover:bg-[#F07178]/15';
                    indicator = '-';
                    indicatorClass = 'text-[#F07178] font-bold';
                    textClass = 'text-[#F07178] line-through opacity-85';
                  }

                  return (
                    <tr key={idx} className={`${rowBg} transition-colors border-b border-[#252D3A]/20`}>
                      <td className="w-10 sm:w-12 py-1 px-2 text-right text-[11px] text-[#697386] select-none border-r border-[#252D3A]/40">
                        {line.originalLineNumber ?? ''}
                      </td>
                      <td className="w-10 sm:w-12 py-1 px-2 text-right text-[11px] text-[#697386] select-none border-r border-[#252D3A]/40">
                        {line.modifiedLineNumber ?? ''}
                      </td>
                      <td className={`w-6 sm:w-8 py-1 text-center select-none ${indicatorClass}`}>
                        {indicator}
                      </td>
                      <td className={`py-1 px-3 whitespace-pre-wrap break-all ${textClass}`}>
                        {line.text || ' '}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Side by Side Split View */
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#252D3A] overflow-x-auto max-h-[480px]">
            {/* Left Side: Original removals & unchanged */}
            <div className="font-mono-code text-xs">
              <div className="px-3 py-1.5 bg-[#0D1017] text-[#F07178] text-[11px] font-semibold uppercase border-b border-[#252D3A]">
                Original (Deletions)
              </div>
              <div className="divide-y divide-[#252D3A]/20">
                {diffResult.lines.map((line, idx) => {
                  if (line.type === 'added') return null;
                  return (
                    <div
                      key={idx}
                      className={`flex py-1 px-3 ${
                        line.type === 'removed' ? 'bg-[#F07178]/10 text-[#F07178]' : 'text-[#929BAA]'
                      }`}
                    >
                      <span className="w-8 text-[11px] text-[#697386] select-none shrink-0">
                        {line.originalLineNumber}
                      </span>
                      <span className="break-all whitespace-pre-wrap">{line.text || ' '}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Modified additions & unchanged */}
            <div className="font-mono-code text-xs">
              <div className="px-3 py-1.5 bg-[#0D1017] text-[#32C48D] text-[11px] font-semibold uppercase border-b border-[#252D3A]">
                Modified (Additions)
              </div>
              <div className="divide-y divide-[#252D3A]/20">
                {diffResult.lines.map((line, idx) => {
                  if (line.type === 'removed') return null;
                  return (
                    <div
                      key={idx}
                      className={`flex py-1 px-3 ${
                        line.type === 'added' ? 'bg-[#32C48D]/10 text-[#32C48D]' : 'text-[#929BAA]'
                      }`}
                    >
                      <span className="w-8 text-[11px] text-[#697386] select-none shrink-0">
                        {line.modifiedLineNumber}
                      </span>
                      <span className="break-all whitespace-pre-wrap">{line.text || ' '}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
