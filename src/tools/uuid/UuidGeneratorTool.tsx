import React, { useState } from 'react';
import { Fingerprint, RefreshCw, Copy, Trash2, Check, Download, Sparkles } from 'lucide-react';
import { generateUuidV4 } from '../../lib/cryptoUtils';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';
import { useAppStore } from '../../stores/useAppStore';

type UuidFormat = 'standard' | 'nohyphens' | 'braces' | 'quotes';

export const UuidGeneratorTool: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [format, setFormat] = useState<UuidFormat>('standard');
  const [uuids, setUuids] = useState<string[]>(() => {
    return Array.from({ length: 5 }, () => generateUuidV4());
  });

  const addToast = useAppStore((s) => s.addToast);

  const formatUuid = (raw: string): string => {
    let result = raw;
    if (format === 'nohyphens') {
      result = result.replace(/-/g, '');
    }
    if (uppercase) {
      result = result.toUpperCase();
    } else {
      result = result.toLowerCase();
    }
    if (format === 'braces') {
      result = `{${result}}`;
    } else if (format === 'quotes') {
      result = `"${result}"`;
    }
    return result;
  };

  const handleGenerate = () => {
    const list = Array.from({ length: quantity }, () => generateUuidV4());
    setUuids(list);
    addToast({
      type: 'success',
      title: `Generated ${quantity} UUIDs`,
      duration: 2000,
    });
  };

  const handleClear = () => {
    setUuids([]);
  };

  const formattedUuids = uuids.map(formatUuid);
  const allUuidsText = formattedUuids.join('\n');

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-[#8B7CFF]" />
            UUID / GUID Generator
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Generate cryptographically secure Version-4 UUIDs with custom batch quantities, case options, and delimiters.
          </p>
        </div>
      </div>

      {/* Generator Configuration Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 text-xs text-[#929BAA]">
            <span>Count:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-[#171D28] text-[#F3F5F9] border border-[#252D3A] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#8B7CFF]/50 cursor-pointer"
            >
              <option value={1}>1 UUID</option>
              <option value={5}>5 UUIDs</option>
              <option value={10}>10 UUIDs</option>
              <option value={25}>25 UUIDs</option>
              <option value={50}>50 UUIDs</option>
              <option value={100}>100 UUIDs</option>
            </select>
          </div>

          {/* Regenerate CTA */}
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#8B7CFF] hover:bg-[#7867FB] rounded-lg transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>

          {uuids.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F07178] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Format Options */}
        <div className="flex items-center gap-3 text-xs text-[#929BAA] flex-wrap">
          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setFormat('standard')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                format === 'standard' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setFormat('nohyphens')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                format === 'nohyphens' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              No Hyphens
            </button>
            <button
              type="button"
              onClick={() => setFormat('braces')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                format === 'braces' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              {'{ Braces }'}
            </button>
            <button
              type="button"
              onClick={() => setFormat('quotes')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                format === 'quotes' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
              }`}
            >
              "Quoted"
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-[#252D3A] text-[#8B7CFF] focus:ring-0 bg-[#171D28]"
            />
            <span>Uppercase</span>
          </label>
        </div>
      </div>

      {/* UUIDs Output List */}
      {uuids.length > 0 ? (
        <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0D1017] border-b border-[#252D3A] flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
              Generated UUIDs ({formattedUuids.length})
            </span>
            <div className="flex items-center gap-2">
              <DownloadButton content={allUuidsText} filename="uuids.txt" label="Download All" />
              <CopyButton textToCopy={allUuidsText} label="Copy All UUIDs" />
            </div>
          </div>

          <div className="divide-y divide-[#252D3A]/50 max-h-[480px] overflow-y-auto">
            {formattedUuids.map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#171D28]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono-code text-[#697386] w-6">{index + 1}.</span>
                  <span className="font-mono-code text-xs sm:text-sm text-[#F3F5F9] select-all tracking-wide">
                    {id}
                  </span>
                </div>
                <CopyButton textToCopy={id} size="sm" variant="ghost" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[#697386] bg-[#11151D] border border-dashed border-[#252D3A] rounded-xl">
          <p className="text-sm">No UUIDs in list</p>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-3 px-3.5 py-1.5 text-xs text-white bg-[#8B7CFF] rounded-lg cursor-pointer"
          >
            Generate UUIDs
          </button>
        </div>
      )}
    </div>
  );
};
