import React, { useState } from 'react';
import { Minimize2, Sparkles, AlertCircle, FileCode, Check, RefreshCw } from 'lucide-react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { useAppStore } from '../../stores/useAppStore';

type MinifierType = 'html' | 'css' | 'js';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <!-- DevKit Web Studio Header -->
  <head>
    <meta charset="UTF-8" />
    <title>   DevKit Application   </title>
    <style>
      body {
        margin: 0;
        background-color: #090B10;
      }
    </style>
  </head>
  <body>
    <header class="app-header   main-nav">
      <h1>Hello, World!</h1>
      <!-- Navigation link items -->
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#tools">Tools</a></li>
      </ul>
    </header>
  </body>
</html>`;

const SAMPLE_CSS = `/* DevKit Design Tokens & Component Styles */
:root {
  --primary-color: #8B7CFF;
  --bg-color: #090B10;
  --text-main: #F3F5F9;
}

.developer-card {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background-color: var(--bg-color);
  border: 1px solid #252D3A;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.developer-card:hover {
  border-color: var(--primary-color);
}
`;

const SAMPLE_JS = `// DevKit Production Utility Function
function processDeveloperPayload(rawData, options) {
  var config = options || {};
  var startTime = Date.now();
  
  if (!rawData || rawData.length === 0) {
    return { success: false, items: [], elapsedMs: 0 };
  }

  var transformed = rawData.map(function(item) {
    return {
      id: item.id,
      normalized: String(item.val).trim().toLowerCase(),
      timestamp: startTime
    };
  });

  return {
    success: true,
    items: transformed,
    elapsedMs: Date.now() - startTime
  };
}
`;

export const MinifierTool: React.FC = () => {
  const [type, setType] = useState<MinifierType>('html');
  const [input, setInput] = useState<string>(SAMPLE_HTML);
  const [output, setOutput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addToast = useAppStore((s) => s.addToast);

  // Client-side HTML minifier
  const minifyHtml = (html: string): string => {
    return html
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  // Client-side CSS minifier
  const minifyCss = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s*([\{\}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Client-side JS minifier using terser with fallback
  const minifyJs = async (code: string): Promise<string> => {
    try {
      const terser = await import('terser');
      if (terser && typeof terser.minify === 'function') {
        const result = await terser.minify(code, {
          mangle: { toplevel: false },
          compress: {
            dead_code: true,
            drop_debugger: true,
          },
          format: { comments: false },
        });
        if (result.code) {
          return result.code;
        }
      }
    } catch (err: any) {
      console.warn('Terser minification fallback:', err);
    }

    // High performance lexical fallback
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*/g, '$1')
      .replace(/\s*([=+\-*/%&|!<>?:;,{}()[\]])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Quick beautifier
  const handleBeautify = () => {
    if (!input.trim()) return;
    try {
      if (type === 'css') {
        const formatted = input
          .replace(/\{/g, ' {\n  ')
          .replace(/\}/g, '\n}\n')
          .replace(/;/g, ';\n  ')
          .trim();
        setOutput(formatted);
      } else if (type === 'html') {
        let formatted = '';
        let indent = 0;
        input.split(/>\s*</).forEach((element) => {
          if (element.match(/^\/\w/)) indent = Math.max(0, indent - 1);
          formatted += '  '.repeat(indent) + '<' + element + '>\n';
          if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br')) {
            indent++;
          }
        });
        setOutput(formatted.trim().replace(/^<</, '<').replace(/>>$/, '>'));
      } else {
        // Simple JS indentation
        const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        setOutput(lines.join('\n'));
      }
      addToast({
        type: 'success',
        title: 'Source code formatted',
        duration: 2000,
      });
    } catch (err: any) {
      setError(`Beautification error: ${err.message}`);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let minified = '';
      if (type === 'html') {
        minified = minifyHtml(input);
      } else if (type === 'css') {
        minified = minifyCss(input);
      } else {
        minified = await minifyJs(input);
      }

      setOutput(minified);
      addToast({
        type: 'success',
        title: `${type.toUpperCase()} Minified`,
        duration: 2000,
      });
    } catch (err: any) {
      setError(`Minification error: ${err.message}`);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const switchType = (newType: MinifierType) => {
    setType(newType);
    setOutput('');
    setError(null);
    if (newType === 'html') setInput(SAMPLE_HTML);
    else if (newType === 'css') setInput(SAMPLE_CSS);
    else setInput(SAMPLE_JS);
  };

  // Compression metrics
  const origBytes = new TextEncoder().encode(input).length;
  const miniBytes = output ? new TextEncoder().encode(output).length : 0;
  const savingsBytes = output ? Math.max(0, origBytes - miniBytes) : 0;
  const percentageSaved = origBytes > 0 && output ? ((savingsBytes / origBytes) * 100).toFixed(1) : '0';

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const getFileExtension = () => {
    if (type === 'html') return 'index.min.html';
    if (type === 'css') return 'styles.min.css';
    return 'script.min.js';
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Minimize2 className="w-6 h-6 text-[#8B7CFF]" />
            HTML / CSS / JavaScript Minifier
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Compress and optimize web assets offline with byte analytics and formatting tools.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Format selector */}
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => switchType('html')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                type === 'html' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA]'
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => switchType('css')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                type === 'css' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA]'
              }`}
            >
              CSS
            </button>
            <button
              type="button"
              onClick={() => switchType('js')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                type === 'js' ? 'bg-[#8B7CFF] text-white shadow-xs' : 'text-[#929BAA]'
              }`}
            >
              JavaScript
            </button>
          </div>

          <button
            type="button"
            onClick={handleMinify}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#8B7CFF] hover:bg-[#7867FB] rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Compressing...' : `Minify ${type.toUpperCase()}`}</span>
          </button>

          <button
            type="button"
            onClick={handleBeautify}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Unminify / Format</span>
          </button>
        </div>

        {/* Compression Statistics */}
        {output && (
          <div className="flex items-center gap-3 text-xs font-mono-code flex-wrap">
            <span className="text-[#929BAA]">
              Original: <strong className="text-[#F3F5F9]">{formatSize(origBytes)}</strong>
            </span>
            <span className="text-[#697386]">→</span>
            <span className="text-[#929BAA]">
              Minified: <strong className="text-[#32C48D]">{formatSize(miniBytes)}</strong>
            </span>
            <span className="text-[#697386]">·</span>
            <span className="text-[#32C48D] font-bold">Saved {percentageSaved}%</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-mono-code bg-[#F07178]/10 text-[#F07178] border border-[#F07178]/30 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dual Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CodeEditor
          label={`Original ${type.toUpperCase()} Source`}
          value={input}
          onChange={(val) => setInput(val)}
          placeholder={`Enter raw ${type.toUpperCase()} code...`}
          height="h-64 sm:h-80"
          showClear={true}
          showCopy={true}
          downloadFilename={`original.${type}`}
          error={error}
        />

        <CodeEditor
          label={`Minified ${type.toUpperCase()} Output`}
          value={output}
          placeholder="Minified output will appear here..."
          readOnly={true}
          height="h-64 sm:h-80"
          showClear={false}
          showCopy={true}
          downloadFilename={getFileExtension()}
        />
      </div>
    </div>
  );
};
