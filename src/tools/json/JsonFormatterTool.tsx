import React, { useState } from 'react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { useAppStore } from '../../stores/useAppStore';
import {
  FileJson,
  Sparkles,
  Minimize,
  Check,
  AlertCircle,
  Wand2,
  ListTree,
  Code2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const SAMPLE_JSON = `{
  "product": "DevKit Studio",
  "version": "1.0.0",
  "isProductionReady": true,
  "settings": {
    "theme": "dark",
    "offlineMode": true,
    "maxHistory": 10
  },
  "modules": [
    { "id": 1, "name": "JSON Formatter", "active": true },
    { "id": 2, "name": "Base64 Encoder", "active": true },
    { "id": 3, "name": "JWT Decoder", "active": true }
  ],
  "metrics": {
    "latencyMs": 0,
    "privacyGuaranteed": 100
  }
}`;

// Collapsible JSON Tree Node Component
const JsonTreeNode: React.FC<{ name?: string; value: any; depth?: number }> = ({
  name,
  value,
  depth = 0,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(depth > 2);

  if (value === null) {
    return (
      <div className="py-0.5 font-mono-code text-xs flex items-center gap-1.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {name && <span className="text-[#8B7CFF] font-semibold">{name}:</span>}
        <span className="text-[#F07178] italic">null</span>
      </div>
    );
  }

  const valueType = typeof value;

  if (valueType === 'boolean') {
    return (
      <div className="py-0.5 font-mono-code text-xs flex items-center gap-1.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {name && <span className="text-[#8B7CFF] font-semibold">{name}:</span>}
        <span className="text-[#E8B45B] font-bold">{value ? 'true' : 'false'}</span>
      </div>
    );
  }

  if (valueType === 'number') {
    return (
      <div className="py-0.5 font-mono-code text-xs flex items-center gap-1.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {name && <span className="text-[#8B7CFF] font-semibold">{name}:</span>}
        <span className="text-[#32C48D]">{value}</span>
      </div>
    );
  }

  if (valueType === 'string') {
    return (
      <div className="py-0.5 font-mono-code text-xs flex items-center gap-1.5" style={{ paddingLeft: `${depth * 16}px` }}>
        {name && <span className="text-[#8B7CFF] font-semibold">{name}:</span>}
        <span className="text-[#929BAA] break-all">"{value}"</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const keys = Object.keys(value);
  const count = keys.length;

  return (
    <div className="py-0.5 font-mono-code text-xs" style={{ paddingLeft: `${depth * 16}px` }}>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1 text-left hover:bg-[#171D28] py-0.5 px-1 rounded transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-[#697386]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#697386]" />}
        {name && <span className="text-[#8B7CFF] font-semibold">{name}:</span>}
        <span className="text-[#697386]">
          {isArray ? `Array[${count}]` : `Object{${count}}`}
        </span>
      </button>

      {!collapsed && (
        <div className="border-l border-[#252D3A]/60 ml-2">
          {keys.map((k) => (
            <JsonTreeNode key={k} name={isArray ? undefined : k} value={value[k]} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [output, setOutput] = useState<string>('');
  const [parsedObject, setParsedObject] = useState<any>(null);
  const [indentOption, setIndentOption] = useState<'2' | '4' | 'tab'>('2');
  const [viewTab, setViewTab] = useState<'code' | 'tree'>('code');
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    error?: string;
    line?: number;
    column?: number;
  } | null>(null);

  const addToast = useAppStore((s) => s.addToast);

  const getIndent = () => {
    if (indentOption === '4') return 4;
    if (indentOption === 'tab') return '\t';
    return 2;
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setParsedObject(null);
      setValidationStatus(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setOutput(formatted);
      setParsedObject(parsed);
      setValidationStatus({ isValid: true });
      addToast({
        type: 'success',
        title: 'JSON Formatted',
        duration: 2000,
      });
    } catch (err: any) {
      parseJsonError(err.message);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setParsedObject(parsed);
      setValidationStatus({ isValid: true });
      addToast({
        type: 'success',
        title: 'JSON Minified',
        duration: 2000,
      });
    } catch (err: any) {
      parseJsonError(err.message);
    }
  };

  const handleValidate = () => {
    if (!input.trim()) {
      addToast({
        type: 'warning',
        title: 'Input is empty',
        duration: 2000,
      });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setParsedObject(parsed);
      setValidationStatus({ isValid: true });
      addToast({
        type: 'success',
        title: 'Valid JSON Payload',
        duration: 2500,
      });
    } catch (err: any) {
      parseJsonError(err.message);
    }
  };

  // Helper to fix common JSON syntax errors
  const handleFixCommonIssues = () => {
    if (!input.trim()) return;

    let repaired = input
      // Convert single quotes around keys/strings to double quotes
      .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"')
      // Remove trailing commas before } or ]
      .replace(/,\s*([\}\]])/g, '$1')
      // Quote unquoted keys (e.g. { foo: 1 } -> { "foo": 1 })
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    try {
      const parsed = JSON.parse(repaired);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setInput(formatted);
      setOutput(formatted);
      setParsedObject(parsed);
      setValidationStatus({ isValid: true });
      addToast({
        type: 'success',
        title: 'Repaired & formatted JSON',
        message: 'Fixed unquoted keys, single quotes, or trailing commas',
        duration: 3000,
      });
    } catch (err: any) {
      addToast({
        type: 'warning',
        title: 'Could not auto-repair JSON',
        message: 'Please check the syntax error highlight below',
        duration: 3000,
      });
      parseJsonError(err.message);
    }
  };

  const parseJsonError = (rawMsg: string) => {
    let line: number | undefined;
    let column: number | undefined;

    const lineMatch = rawMsg.match(/line\s+(\d+)/i);
    const colMatch = rawMsg.match(/column\s+(\d+)/i) || rawMsg.match(/position\s+(\d+)/i);

    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (colMatch) column = parseInt(colMatch[1], 10);

    setValidationStatus({
      isValid: false,
      error: rawMsg,
      line,
      column,
    });

    addToast({
      type: 'error',
      title: 'Invalid JSON',
      message: rawMsg,
      duration: 3000,
    });
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setOutput('');
    setParsedObject(null);
    setValidationStatus(null);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <FileJson className="w-6 h-6 text-[#8B7CFF]" />
            JSON Formatter & Validator
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Format, minify, inspect syntax, and explore JSON structures with line-error debugging and collapsible tree view.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleFixCommonIssues}
            title="Auto-repair single quotes, trailing commas, and unquoted keys"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E8B45B] hover:text-white bg-[#E8B45B]/10 hover:bg-[#E8B45B]/20 border border-[#E8B45B]/30 rounded-lg transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto-Repair JSON
          </button>

          <button
            type="button"
            onClick={loadSample}
            className="px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Action Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B7CFF] hover:bg-[#7867FB] rounded-lg transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Format (Ctrl+Enter)
          </button>

          <button
            type="button"
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <Minimize className="w-3.5 h-3.5 text-[#6C8CFF]" />
            Minify
          </button>

          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#32C48D]" />
            Validate
          </button>
        </div>

        {/* View and Indent Options */}
        <div className="flex items-center gap-3 text-xs text-[#929BAA] flex-wrap">
          {/* Indent selector */}
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setIndentOption('2')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                indentOption === '2' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              2 spaces
            </button>
            <button
              type="button"
              onClick={() => setIndentOption('4')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                indentOption === '4' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              4 spaces
            </button>
            <button
              type="button"
              onClick={() => setIndentOption('tab')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                indentOption === 'tab' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              Tab
            </button>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewTab('code')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewTab === 'code' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
            <button
              type="button"
              onClick={() => {
                if (!parsedObject && input) {
                  try {
                    setParsedObject(JSON.parse(input));
                  } catch {
                    // ignore
                  }
                }
                setViewTab('tree');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewTab === 'tree' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              Tree
            </button>
          </div>
        </div>
      </div>

      {/* Validation Banner */}
      {validationStatus && (
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs font-mono-code ${
            validationStatus.isValid
              ? 'bg-[#32C48D]/10 border-[#32C48D]/30 text-[#32C48D]'
              : 'bg-[#F07178]/10 border-[#F07178]/30 text-[#F07178]'
          }`}
        >
          {validationStatus.isValid ? (
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-semibold">
              {validationStatus.isValid ? 'Valid JSON Syntax' : 'JSON Syntax Error'}
            </div>
            {validationStatus.error && <p className="mt-1 opacity-90">{validationStatus.error}</p>}
            {validationStatus.line && (
              <p className="mt-0.5 text-[11px] opacity-80">
                Location: Line {validationStatus.line}
                {validationStatus.column ? `, Column ${validationStatus.column}` : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dual Workspace Editors / Tree View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CodeEditor
          label="Input JSON"
          value={input}
          onChange={(val) => {
            setInput(val);
            setValidationStatus(null);
          }}
          placeholder="Paste unformatted or raw JSON here..."
          height="h-72 sm:h-96"
          showClear={true}
          showCopy={true}
          downloadFilename="input.json"
          error={validationStatus && !validationStatus.isValid ? validationStatus.error : null}
          onExecute={handleFormat}
        />

        {viewTab === 'code' ? (
          <CodeEditor
            label="Formatted Output"
            value={output || (validationStatus?.isValid && input ? input : '')}
            placeholder="Formatted or minified output will appear here..."
            readOnly={true}
            height="h-72 sm:h-96"
            showClear={false}
            showCopy={true}
            downloadFilename="formatted.json"
          />
        ) : (
          <div className="flex flex-col rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
            <div className="px-3.5 py-2.5 bg-[#0D1017] border-b border-[#252D3A] flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
                Interactive JSON Tree
              </span>
              <span className="text-[11px] font-mono-code text-[#697386]">Click nodes to collapse</span>
            </div>
            <div className="h-72 sm:h-96 p-4 overflow-auto bg-[#11151D]">
              {parsedObject ? (
                <JsonTreeNode value={parsedObject} />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#697386]">
                  Click "Format JSON" or enter valid JSON to view the interactive tree structure
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
