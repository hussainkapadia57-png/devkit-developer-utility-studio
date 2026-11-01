import React, { useState } from 'react';
import { Type, Copy, Trash2, Check, Sparkles } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

const SAMPLE_TEXT = 'developer utility studio workspace for modern software engineers';

export const CaseConverterTool: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);

  // Extract clean words from any string (handles underscores, hyphens, camelCase, spaces)
  const extractWords = (str: string): string[] => {
    if (!str.trim()) return [];
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const words = extractWords(inputText);

  // Conversion algorithms
  const toUppercase = (text: string) => text.toUpperCase();
  const toLowercase = (text: string) => text.toLowerCase();

  const toTitleCase = (text: string) => {
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const toSentenceCase = (text: string) => {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (wList: string[]) => {
    if (wList.length === 0) return '';
    return wList
      .map((w, idx) => (idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join('');
  };

  const toPascalCase = (wList: string[]) => {
    return wList.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };

  const toSnakeCase = (wList: string[]) => {
    return wList.map((w) => w.toLowerCase()).join('_');
  };

  const toKebabCase = (wList: string[]) => {
    return wList.map((w) => w.toLowerCase()).join('-');
  };

  const toConstantCase = (wList: string[]) => {
    return wList.map((w) => w.toUpperCase()).join('_');
  };

  const toDotCase = (wList: string[]) => {
    return wList.map((w) => w.toLowerCase()).join('.');
  };

  const toPathCase = (wList: string[]) => {
    return wList.map((w) => w.toLowerCase()).join('/');
  };

  const toHeaderCase = (wList: string[]) => {
    return wList.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
  };

  const conversions = [
    { label: 'camelCase', value: toCamelCase(words), description: 'Standard variable & property identifier' },
    { label: 'PascalCase', value: toPascalCase(words), description: 'Class, type & component identifier' },
    { label: 'snake_case', value: toSnakeCase(words), description: 'Database columns & Python convention' },
    { label: 'kebab-case', value: toKebabCase(words), description: 'URL slugs, CSS classnames & filenames' },
    { label: 'CONSTANT_CASE', value: toConstantCase(words), description: 'Global constants & env vars' },
    { label: 'UPPERCASE', value: toUppercase(inputText), description: 'All characters capitalized' },
    { label: 'lowercase', value: toLowercase(inputText), description: 'All characters in lowercase' },
    { label: 'Title Case', value: toTitleCase(inputText), description: 'First letter of each word capitalized' },
    { label: 'Sentence case', value: toSentenceCase(inputText), description: 'First letter of each sentence capitalized' },
    { label: 'dot.case', value: toDotCase(words), description: 'Package names & dot-separated keys' },
    { label: 'path/case', value: toPathCase(words), description: 'Filepath & route segments' },
    { label: 'Header-Case', value: toHeaderCase(words), description: 'HTTP request & response headers' },
  ];

  const charsCount = inputText.length;
  const charsNoSpaces = inputText.replace(/\s+/g, '').length;
  const wordsCount = words.length;
  const linesCount = inputText ? inputText.split(/\r?\n/).length : 0;
  const readingTimeSec = Math.max(1, Math.round((wordsCount / 200) * 60));

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Type className="w-6 h-6 text-[#8B7CFF]" />
            String Case Converter
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Convert strings between all programming naming conventions with detailed character analytics.
          </p>
        </div>
      </div>

      {/* Input Text Box */}
      <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0D1017] border-b border-[#252D3A]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">Input String</span>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono-code text-[#697386] hidden sm:flex items-center gap-2">
              <span>{wordsCount} words</span>
              <span>·</span>
              <span>{charsCount} chars ({charsNoSpaces} without spaces)</span>
              <span>·</span>
              <span>~{readingTimeSec}s read</span>
            </div>
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs text-[#697386] hover:text-[#F07178] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to convert across all naming conventions..."
          className="w-full h-24 sm:h-28 p-4 font-mono-code text-xs sm:text-sm text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Conversions Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conversions.map((conv) => (
          <div
            key={conv.label}
            className="p-4 bg-[#11151D] border border-[#252D3A] hover:border-[#3B465A] rounded-xl transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-[#8B7CFF]">{conv.label}</span>
                <span className="text-[11px] text-[#697386] block mt-0.5">{conv.description}</span>
              </div>
              <CopyButton textToCopy={conv.value} size="sm" />
            </div>

            <div className="p-2.5 mt-2 bg-[#0D1017] border border-[#252D3A] rounded-lg font-mono-code text-xs text-[#F3F5F9] break-all select-all min-h-[40px] flex items-center">
              {conv.value || <span className="text-[#697386]">Awaiting input...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
