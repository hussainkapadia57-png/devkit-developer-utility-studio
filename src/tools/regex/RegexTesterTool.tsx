import React, { useState, useMemo } from 'react';
import { Terminal, Check, AlertCircle, Copy, Info, Replace, BookOpen } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

interface MatchItem {
  index: number;
  text: string;
  groups: string[];
}

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL', pattern: 'https?:\\/\\/[\\w\\-\\.]+(?::\\d+)?(?:\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]*)?', flags: 'gi' },
  { label: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b', flags: 'g' },
];

const REGEX_CHEATSHEET = [
  { code: '\\d', label: 'Digit (0-9)' },
  { code: '\\w', label: 'Word character (a-z, A-Z, 0-9, _)' },
  { code: '\\s', label: 'Whitespace (space, tab, newline)' },
  { code: '^ / $', label: 'Start / End of line' },
  { code: '*', label: '0 or more occurrences' },
  { code: '+', label: '1 or more occurrences' },
  { code: '?', label: '0 or 1 occurrence (optional)' },
  { code: '{n,m}', label: 'Between n and m occurrences' },
  { code: '(...)', label: 'Capture group' },
  { code: '(?:...)', label: 'Non-capturing group' },
  { code: '(?=...)', label: 'Positive lookahead' },
  { code: '(?!...)', label: 'Negative lookahead' },
];

const DEFAULT_TEST_TEXT = `DevKit v1.0.0 is live!
Contact our lead engineer at alex.vance@devkit.io or support@example.com.
Check https://github.com/devkit/devkit or http://localhost:3000 for local docs.
Server IP: 192.168.1.104
Brand colors: #8B7CFF primary, #32C48D success, #F07178 error.
Release date: 2026-10-30`;

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
  });
  const [testString, setTestString] = useState<string>(DEFAULT_TEST_TEXT);
  const [replaceString, setReplaceString] = useState<string>('[REDACTED]');
  const [activeTab, setActiveTab] = useState<'matches' | 'replace' | 'cheatsheet'>('matches');

  const activeFlagsString = Object.keys(flags)
    .filter((k) => flags[k])
    .join('');

  const evaluation = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, regex: null, replacedText: testString };
    }

    try {
      const regex = new RegExp(pattern, activeFlagsString);
      const matches: MatchItem[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let loopLimit = 1000;
        while ((match = regex.exec(testString)) !== null && loopLimit-- > 0) {
          matches.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
          });
        }
      }

      // Replaced string
      const replacedText = testString.replace(new RegExp(pattern, activeFlagsString), replaceString);

      return { matches, error: null, regex, replacedText };
    } catch (err: any) {
      return { matches: [], error: err.message, regex: null, replacedText: testString };
    }
  }, [pattern, activeFlagsString, testString, flags.g, replaceString]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const applyPreset = (presetPattern: string, presetFlags: string) => {
    setPattern(presetPattern);
    const newFlags: { [key: string]: boolean } = {
      g: presetFlags.includes('g'),
      i: presetFlags.includes('i'),
      m: presetFlags.includes('m'),
      s: presetFlags.includes('s'),
      u: presetFlags.includes('u'),
    };
    setFlags(newFlags);
  };

  // Render highlighted text string
  const renderHighlightedText = () => {
    if (!testString) return <span className="text-[#697386]">No test string provided</span>;
    if (evaluation.error || evaluation.matches.length === 0) {
      return <span>{testString}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    evaluation.matches.forEach((m, idx) => {
      if (m.index > lastIndex) {
        segments.push(testString.substring(lastIndex, m.index));
      }
      segments.push(
        <mark
          key={idx}
          className="bg-[#8B7CFF]/30 text-[#F3F5F9] border-b-2 border-[#8B7CFF] rounded-xs px-0.5"
          title={`Match #${idx + 1} at index ${m.index}`}
        >
          {m.text}
        </mark>
      );
      lastIndex = m.index + m.text.length;
    });

    if (lastIndex < testString.length) {
      segments.push(testString.substring(lastIndex));
    }

    return segments;
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#8B7CFF]" />
            RegEx Tester & Match Inspector
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Build, test, debug regular expressions with interactive match highlighting, substitution, and cheatsheet.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#697386]">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.pattern, p.flags)}
              className="px-2 py-1 text-xs rounded-md bg-[#171D28] hover:bg-[#1D2532] text-[#929BAA] hover:text-[#F3F5F9] border border-[#252D3A] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* RegEx Pattern Input Bar */}
      <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center flex-1 bg-[#0D1017] border border-[#252D3A] rounded-lg px-3 py-2 focus-within:border-[#8B7CFF]/50 transition-colors">
            <span className="text-[#8B7CFF] font-mono-code font-bold mr-2 text-base">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className="flex-1 bg-transparent font-mono-code text-sm text-[#F3F5F9] border-none outline-none placeholder-[#697386]"
            />
            <span className="text-[#8B7CFF] font-mono-code font-bold ml-2 text-base">/</span>
            <span className="text-[#8B7CFF] font-mono-code text-sm ml-1">{activeFlagsString}</span>
          </div>

          {/* Flags Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#171D28] border border-[#252D3A] rounded-lg">
            {[
              { id: 'g', label: 'g', title: 'Global (all matches)' },
              { id: 'i', label: 'i', title: 'Case insensitive' },
              { id: 'm', label: 'm', title: 'Multiline (^ and $ match lines)' },
              { id: 's', label: 's', title: 'Dot matches all (including newline)' },
              { id: 'u', label: 'u', title: 'Unicode support' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFlag(f.id)}
                title={f.title}
                className={`w-7 h-7 flex items-center justify-center font-mono-code text-xs font-semibold rounded transition-colors ${
                  flags[f.id]
                    ? 'bg-[#8B7CFF] text-white shadow-xs'
                    : 'text-[#697386] hover:text-[#F3F5F9] hover:bg-[#1D2532]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Syntax Error */}
        {evaluation.error && (
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#F07178] bg-[#F07178]/10 p-2.5 rounded-lg border border-[#F07178]/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Regex Syntax Error: {evaluation.error}</span>
          </div>
        )}

        {/* Stats Strip & Feature Tabs */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#697386] font-mono-code pt-1 gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[#F3F5F9] font-medium">
              {evaluation.matches.length} {evaluation.matches.length === 1 ? 'match' : 'matches'} found
            </span>
            <span>·</span>
            <span>Active flags: /{activeFlagsString || 'none'}/</span>
          </div>

          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'matches' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              Matches
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('replace')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'replace' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <Replace className="w-3 h-3" />
              Substitute
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'cheatsheet' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Cheatsheet
            </button>
          </div>
        </div>
      </div>

      {/* Cheatsheet Panel */}
      {activeTab === 'cheatsheet' && (
        <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
            Quick RegEx Syntax Cheatsheet
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {REGEX_CHEATSHEET.map((item, idx) => (
              <div key={idx} className="p-2 rounded bg-[#0D1017] border border-[#252D3A] text-xs">
                <span className="font-mono-code text-[#8B7CFF] font-bold block">{item.code}</span>
                <span className="text-[11px] text-[#929BAA]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replace Panel if active */}
      {activeTab === 'replace' && (
        <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
              Replacement Pattern
            </span>
            <span className="text-[11px] text-[#697386]">Supports $1, $2 capture groups</span>
          </div>
          <input
            type="text"
            value={replaceString}
            onChange={(e) => setReplaceString(e.target.value)}
            placeholder="Replacement string (e.g. [REDACTED], $1, etc.)"
            className="w-full p-2.5 bg-[#0D1017] border border-[#252D3A] rounded-lg font-mono-code text-xs text-[#F3F5F9] outline-none focus:border-[#8B7CFF]/50"
          />
        </div>
      )}

      {/* Test String Input & Match Highlighting Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Test String Input Editor */}
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0D1017] border-b border-[#252D3A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">Test Input Text</span>
            <button
              type="button"
              onClick={() => setTestString('')}
              className="text-xs text-[#697386] hover:text-[#F07178] transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter test string to evaluate against the regex..."
            className="w-full h-64 sm:h-72 p-4 font-mono-code text-xs sm:text-sm text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed overflow-auto"
            spellCheck={false}
          />
        </div>

        {/* Live Highlighted Output Display or Replaced String */}
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0D1017] border-b border-[#252D3A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
              {activeTab === 'replace' ? 'Substituted Result' : 'Live Highlighted Matches'}
            </span>
            <CopyButton
              textToCopy={
                activeTab === 'replace'
                  ? evaluation.replacedText
                  : evaluation.matches.map((m) => m.text).join('\n')
              }
              label={activeTab === 'replace' ? 'Copy Result' : 'Copy Matches'}
            />
          </div>
          <div className="w-full h-64 sm:h-72 p-4 font-mono-code text-xs sm:text-sm text-[#929BAA] bg-[#090B10]/40 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
            {activeTab === 'replace' ? evaluation.replacedText : renderHighlightedText()}
          </div>
        </div>
      </div>

      {/* Match Details & Capture Groups Table */}
      {evaluation.matches.length > 0 && activeTab === 'matches' && (
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
          <div className="px-4 py-3 bg-[#0D1017] border-b border-[#252D3A] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
              Match Breakdown & Capture Groups ({evaluation.matches.length})
            </span>
          </div>

          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-[#171D28] text-[#697386] border-b border-[#252D3A]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">#</th>
                  <th className="py-2.5 px-4 font-medium">Match Text</th>
                  <th className="py-2.5 px-4 font-medium">Position</th>
                  <th className="py-2.5 px-4 font-medium">Length</th>
                  <th className="py-2.5 px-4 font-medium">Capture Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D3A]/50">
                {evaluation.matches.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#171D28]/40 transition-colors">
                    <td className="py-2.5 px-4 text-[#8B7CFF]">{idx + 1}</td>
                    <td className="py-2.5 px-4 text-[#F3F5F9] font-semibold">{m.text}</td>
                    <td className="py-2.5 px-4 text-[#697386]">index {m.index}</td>
                    <td className="py-2.5 px-4 text-[#697386]">{m.text.length} chars</td>
                    <td className="py-2.5 px-4 text-[#929BAA]">
                      {m.groups.length > 0
                        ? m.groups.map((g, gIdx) => (
                            <span
                              key={gIdx}
                              className="inline-block mr-2 px-1.5 py-0.5 rounded bg-[#1D2532] text-[#6C8CFF] text-[11px]"
                            >
                              ${gIdx + 1}: {g !== undefined ? g : 'undefined'}
                            </span>
                          ))
                        : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
