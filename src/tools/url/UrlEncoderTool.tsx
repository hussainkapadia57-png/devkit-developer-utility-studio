import React, { useState, useEffect, useMemo } from 'react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { useAppStore } from '../../stores/useAppStore';
import { Link2, ArrowLeftRight, AlertCircle, Copy, SlidersHorizontal, Plus, Trash2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

const SAMPLE_URL =
  'https://devkit.io/search?query=developer tools&filter=json & base64&category=web-dev#section-overview';

export const UrlEncoderTool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [scope, setScope] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState<string>(SAMPLE_URL);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Parameter Builder State
  const [newParamKey, setNewParamKey] = useState<string>('');
  const [newParamVal, setNewParamVal] = useState<string>('');

  const addToast = useAppStore((s) => s.addToast);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const res = scope === 'component' ? encodeURIComponent(input) : encodeURI(input);
        setOutput(res);
        setError(null);
      } else {
        const res = scope === 'component' ? decodeURIComponent(input) : decodeURI(input);
        setOutput(res);
        setError(null);
      }
    } catch (err: any) {
      setError(`Invalid URI sequence: ${err.message}`);
      setOutput('');
    }
  }, [input, mode, scope]);

  const handleSwap = () => {
    if (!output) {
      addToast({
        type: 'warning',
        title: 'Output is empty',
        message: 'Cannot swap without output content',
        duration: 2000,
      });
      return;
    }
    const cur = output;
    setInput(cur);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setError(null);
  };

  // Inspect Query Parameters if the input or decoded result is a valid URL
  const parsedUrl = useMemo(() => {
    const candidate = mode === 'encode' ? input : output || input;
    try {
      const url = new URL(candidate);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return {
        isValid: true,
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        hash: url.hash,
        params,
      };
    } catch {
      return { isValid: false, params: [] };
    }
  }, [input, output, mode]);

  // Modify query parameters and update URL input
  const handleDeleteParam = (keyToDelete: string) => {
    try {
      const url = new URL(input);
      url.searchParams.delete(keyToDelete);
      setInput(url.toString());
      addToast({
        type: 'info',
        title: `Removed parameter ${keyToDelete}`,
        duration: 2000,
      });
    } catch {
      // ignore
    }
  };

  const handleAddParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParamKey.trim()) return;
    try {
      const url = new URL(input);
      url.searchParams.append(newParamKey.trim(), newParamVal);
      setInput(url.toString());
      setNewParamKey('');
      setNewParamVal('');
      addToast({
        type: 'success',
        title: 'Added parameter',
        duration: 2000,
      });
    } catch {
      addToast({
        type: 'warning',
        title: 'Input is not a full URL',
        message: 'Please provide a valid URL like https://example.com?param=val to use the parameter builder',
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Link2 className="w-6 h-6 text-[#8B7CFF]" />
            URL Encoder / Decoder & Query Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Encode and decode URI components or full URLs with interactive query parameter editing.
          </p>
        </div>
      </div>

      {/* Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'encode' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA] hover:text-[#F3F5F9]'
              }`}
            >
              Encode URL
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'decode' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA] hover:text-[#F3F5F9]'
              }`}
            >
              Decode URL
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap input and output"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#6C8CFF]" />
            Swap
          </button>
        </div>

        {/* Component vs Full URL */}
        <div className="flex items-center gap-2 text-xs text-[#929BAA]">
          <span>Encoding Scope:</span>
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setScope('component')}
              title="Encodes special characters including /, ?, &, = (encodeURIComponent)"
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                scope === 'component' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              Component (All chars)
            </button>
            <button
              type="button"
              onClick={() => setScope('full')}
              title="Preserves URL delimiters like ://, ?, # (encodeURI)"
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                scope === 'full' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              Full URL
            </button>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-mono-code bg-[#F07178]/10 border border-[#F07178]/30 text-[#F07178] rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dual Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CodeEditor
          label={mode === 'encode' ? 'Raw URL or String to Encode' : 'Encoded URL or Percent String'}
          value={input}
          onChange={(val) => setInput(val)}
          placeholder="Enter text or URL..."
          height="h-56 sm:h-64"
          showClear={true}
          showCopy={true}
          error={error}
        />

        <CodeEditor
          label={mode === 'encode' ? 'Percent-Encoded Output' : 'Decoded URL String'}
          value={output}
          placeholder="Processed URL will appear here..."
          readOnly={true}
          height="h-56 sm:h-64"
          showClear={false}
          showCopy={true}
          downloadFilename="url-result.txt"
        />
      </div>

      {/* Parsed Query Parameters Inspector & Builder */}
      {parsedUrl.isValid && (
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden space-y-4 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#252D3A]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA] flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B7CFF]" />
              Query Parameters ({parsedUrl.params.length})
            </span>
            <div className="text-xs text-[#697386] font-mono-code">
              Host: <span className="text-[#F3F5F9]">{parsedUrl.host}</span>
            </div>
          </div>

          {/* Add parameter input */}
          <form onSubmit={handleAddParam} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="New Param Key (e.g. debug)"
              value={newParamKey}
              onChange={(e) => setNewParamKey(e.target.value)}
              className="p-2 bg-[#0D1017] border border-[#252D3A] rounded-lg text-xs font-mono-code text-[#F3F5F9] outline-none flex-1"
            />
            <input
              type="text"
              placeholder="Value (e.g. true)"
              value={newParamVal}
              onChange={(e) => setNewParamVal(e.target.value)}
              className="p-2 bg-[#0D1017] border border-[#252D3A] rounded-lg text-xs font-mono-code text-[#F3F5F9] outline-none flex-1"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#8B7CFF] hover:bg-[#7867FB] text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Param
            </button>
          </form>

          {parsedUrl.params.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code">
                <thead className="bg-[#171D28] text-[#697386] border-b border-[#252D3A]">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Parameter Key</th>
                    <th className="py-2.5 px-3 font-medium">Decoded Value</th>
                    <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252D3A]/50">
                  {parsedUrl.params.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#171D28]/40 transition-colors">
                      <td className="py-2.5 px-3 text-[#8B7CFF] font-semibold">{p.key}</td>
                      <td className="py-2.5 px-3 text-[#F3F5F9] break-all">{p.value}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <CopyButton textToCopy={p.value} label="Copy" size="sm" variant="ghost" />
                          <button
                            type="button"
                            onClick={() => handleDeleteParam(p.key)}
                            title="Delete parameter from URL"
                            className="p-1.5 text-[#697386] hover:text-[#F07178] rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
