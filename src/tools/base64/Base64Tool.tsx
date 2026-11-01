import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { useAppStore } from '../../stores/useAppStore';
import { Binary, ArrowLeftRight, AlertCircle, Upload, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [input, setInput] = useState<string>('Hello, DevKit! 🚀 Essential Developer Tools.');
  const [output, setOutput] = useState<string>('');
  const [dataUri, setDataUri] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = useAppStore((s) => s.addToast);

  // UTF-8 Unicode to Base64 using TextEncoder
  const utf8ToBase64 = (str: string, isUrlSafe: boolean): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (isUrlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
    }
    return base64;
  };

  // Base64 to UTF-8 Unicode using TextDecoder
  const base64ToUtf8 = (str: string): string => {
    let clean = str.trim();
    // Strip data URI prefix if present
    const dataUriMatch = clean.match(/^data:[^;]+;base64,(.+)$/);
    if (dataUriMatch) {
      clean = dataUriMatch[1];
    }
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }

    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(bytes);
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setDataUri('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const res = utf8ToBase64(input, urlSafe);
        setOutput(res);
        setDataUri(`data:text/plain;charset=utf-8;base64,${res}`);
        setError(null);
      } else {
        const res = base64ToUtf8(input);
        setOutput(res);
        setError(null);
      }
    } catch (err: any) {
      setError(mode === 'decode' ? 'Invalid Base64 string or malformed UTF-8 sequence' : err.message);
      setOutput('');
    }
  }, [input, mode, urlSafe]);

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
    const currentOutput = output;
    setInput(currentOutput);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setError(null);
  };

  // Convert local file to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Content = result.split(',')[1] || result;
      setInput(base64Content);
      setMode('decode');
      setDataUri(result);
      addToast({
        type: 'success',
        title: `Loaded ${file.name}`,
        duration: 2500,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Detect if content is an image base64
  const isImageBase64 = (() => {
    const candidate = mode === 'decode' ? input : output;
    if (candidate.startsWith('data:image/')) return true;
    if (candidate.startsWith('/9j/') || candidate.startsWith('iVBORw0KGgo') || candidate.startsWith('R0lGODlh')) {
      return true;
    }
    return false;
  })();

  const imagePreviewSrc = (() => {
    const candidate = mode === 'decode' ? input : output;
    if (candidate.startsWith('data:image/')) return candidate;
    if (candidate.startsWith('/9j/')) return `data:image/jpeg;base64,${candidate}`;
    if (candidate.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${candidate}`;
    if (candidate.startsWith('R0lGODlh')) return `data:image/gif;base64,${candidate}`;
    return null;
  })();

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Binary className="w-6 h-6 text-[#8B7CFF]" />
            Base64 Encoder / Decoder
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Encode and decode text, files, and images with full UTF-8 Unicode and URL-safe compatibility.
          </p>
        </div>

        {/* File to Base64 trigger */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="base64-file-picker"
          />
          <label
            htmlFor="base64-file-picker"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#8B7CFF]" />
            Load File to Base64
          </label>
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
              Encode to Base64
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'decode' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA] hover:text-[#F3F5F9]'
              }`}
            >
              Decode from Base64
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

          {dataUri && mode === 'encode' && (
            <CopyButton textToCopy={dataUri} label="Copy as Data URI" size="sm" variant="ghost" />
          )}
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 text-xs text-[#929BAA]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-[#252D3A] text-[#8B7CFF] focus:ring-0 bg-[#171D28]"
            />
            <span>URL-safe variant (- and _)</span>
          </label>
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
          label={mode === 'encode' ? 'Plaintext (UTF-8 Input)' : 'Base64 Encoded Input'}
          value={input}
          onChange={(val) => setInput(val)}
          placeholder={mode === 'encode' ? 'Type or paste plain text...' : 'Paste Base64 encoded string...'}
          height="h-64 sm:h-80"
          showClear={true}
          showCopy={true}
          downloadFilename={mode === 'encode' ? 'input.txt' : 'input.b64'}
          error={error}
        />

        <CodeEditor
          label={mode === 'encode' ? 'Base64 Result' : 'Decoded Plaintext (UTF-8)'}
          value={output}
          placeholder="Processed result will appear here in real time..."
          readOnly={true}
          height="h-64 sm:h-80"
          showClear={false}
          showCopy={true}
          downloadFilename={mode === 'encode' ? 'output.b64' : 'output.txt'}
        />
      </div>

      {/* Image Preview Box if Base64 string represents an image */}
      {imagePreviewSrc && (
        <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#8B7CFF]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
              Decoded Base64 Image Preview
            </span>
          </div>
          <div className="p-3 bg-[#0D1017] border border-[#252D3A] rounded-lg flex items-center justify-center max-h-60 overflow-hidden">
            <img
              src={imagePreviewSrc}
              alt="Base64 Preview"
              className="max-h-52 object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
