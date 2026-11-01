import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, ShieldAlert, Key } from 'lucide-react';
import { HashAlgorithm } from '../../lib/cryptoUtils';
import { CopyButton } from '../../components/common/CopyButton';

interface HashOutputState {
  algorithm: HashAlgorithm;
  bits: number;
  hash: string;
  isLegacy?: boolean;
}

const DEFAULT_TEXT = 'DevKit — Developer Utility Studio';

export const HashGeneratorTool: React.FC = () => {
  const [inputText, setInputText] = useState<string>(DEFAULT_TEXT);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'hex' | 'base64'>('hex');
  const [enableHmac, setEnableHmac] = useState<boolean>(false);
  const [hmacSecret, setHmacSecret] = useState<string>('secret-key');

  const [hashes, setHashes] = useState<HashOutputState[]>([
    { algorithm: 'SHA-256', bits: 256, hash: '' },
    { algorithm: 'SHA-512', bits: 512, hash: '' },
    { algorithm: 'SHA-384', bits: 384, hash: '' },
    { algorithm: 'SHA-1', bits: 160, hash: '', isLegacy: true },
  ]);

  // Web Crypto standard digest or HMAC calculation
  useEffect(() => {
    let isCancelled = false;

    const runHashes = async () => {
      if (!inputText) {
        setHashes((prev) => prev.map((h) => ({ ...h, hash: '' })));
        return;
      }

      try {
        const algorithms: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1'];
        const results = await Promise.all(
          algorithms.map(async (algo) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputText);

            let buffer: ArrayBuffer;

            if (enableHmac && hmacSecret) {
              const keyData = encoder.encode(hmacSecret);
              const cryptoKey = await window.crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: { name: algo } },
                false,
                ['sign']
              );
              buffer = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
            } else {
              buffer = await window.crypto.subtle.digest(algo, data);
            }

            const byteArray = new Uint8Array(buffer);

            if (outputFormat === 'base64') {
              let binary = '';
              for (let i = 0; i < byteArray.byteLength; i++) {
                binary += String.fromCharCode(byteArray[i]);
              }
              return btoa(binary);
            } else {
              return Array.from(byteArray)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
            }
          })
        );

        if (!isCancelled) {
          setHashes([
            { algorithm: 'SHA-256', bits: 256, hash: results[0] },
            { algorithm: 'SHA-512', bits: 512, hash: results[1] },
            { algorithm: 'SHA-384', bits: 384, hash: results[2] },
            { algorithm: 'SHA-1', bits: 160, hash: results[3], isLegacy: true },
          ]);
        }
      } catch (err) {
        console.error('Hashing error:', err);
      }
    };

    runHashes();
    return () => {
      isCancelled = true;
    };
  }, [inputText, enableHmac, hmacSecret, outputFormat]);

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#8B7CFF]" />
            Cryptographic Hash & HMAC Generator
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Compute SHA digests and HMAC keyed signatures locally with Hex and Base64 output formats.
          </p>
        </div>
      </div>

      {/* Security Advisory Callout */}
      <div className="flex items-start gap-3 p-3.5 bg-[#171D28] border border-[#252D3A] rounded-xl text-xs text-[#929BAA]">
        <ShieldAlert className="w-4 h-4 text-[#E8B45B] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#F3F5F9] font-medium">Standards Note:</strong> SHA-256 and SHA-512 are industry
          standard. <strong>SHA-1</strong> is retained solely for legacy integrity verification and checksum checking.
        </div>
      </div>

      {/* Configuration & Input Controls */}
      <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252D3A]/60">
          <div className="flex items-center gap-4 text-xs text-[#929BAA] flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableHmac}
                onChange={(e) => setEnableHmac(e.target.checked)}
                className="rounded border-[#252D3A] text-[#8B7CFF] focus:ring-0 bg-[#171D28]"
              />
              <span className="font-medium text-[#F3F5F9]">Enable HMAC (Keyed Hash)</span>
            </label>

            <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setOutputFormat('hex')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  outputFormat === 'hex' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
                }`}
              >
                Hex Output
              </button>
              <button
                type="button"
                onClick={() => setOutputFormat('base64')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  outputFormat === 'base64' ? 'bg-[#1D2532] text-[#8B7CFF] font-semibold' : 'text-[#697386]'
                }`}
              >
                Base64 Output
              </button>
            </div>

            {outputFormat === 'hex' && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-[#252D3A] text-[#8B7CFF] focus:ring-0 bg-[#171D28]"
                />
                <span>Uppercase</span>
              </label>
            )}
          </div>

          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-[#697386] hover:text-[#F07178] transition-colors"
            >
              Clear Input
            </button>
          )}
        </div>

        {/* HMAC Secret input if enabled */}
        {enableHmac && (
          <div className="flex items-center gap-2 bg-[#0D1017] border border-[#252D3A] rounded-lg px-3 py-2">
            <Key className="w-4 h-4 text-[#8B7CFF] shrink-0" />
            <input
              type="text"
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
              placeholder="Enter HMAC Secret Key..."
              className="w-full bg-transparent font-mono-code text-xs text-[#F3F5F9] outline-none"
            />
          </div>
        )}

        {/* Text Input Panel */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to generate cryptographic digests..."
          className="w-full h-28 sm:h-32 p-3 font-mono-code text-xs sm:text-sm text-[#F3F5F9] placeholder-[#697386] bg-[#0D1017] border border-[#252D3A] rounded-lg resize-none outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Generated Hashes List */}
      <div className="space-y-3.5">
        {hashes.map((item) => {
          let displayHash = item.hash;
          if (outputFormat === 'hex' && uppercase) {
            displayHash = displayHash.toUpperCase();
          }

          return (
            <div
              key={item.algorithm}
              className={`p-4 rounded-xl border bg-[#11151D] transition-all ${
                item.isLegacy ? 'border-[#252D3A]/80' : 'border-[#252D3A]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-[#F3F5F9]">
                    {enableHmac ? `HMAC-${item.algorithm}` : item.algorithm}
                  </span>
                  <span className="text-[11px] font-mono-code text-[#697386]">· {item.bits} bits</span>
                  {item.isLegacy && !enableHmac && (
                    <span className="text-[10px] text-[#E8B45B] bg-[#E8B45B]/10 px-1.5 py-0.5 rounded font-mono-code">
                      Legacy / Checksum only
                    </span>
                  )}
                </div>

                <CopyButton textToCopy={displayHash} label="Copy Hash" size="sm" />
              </div>

              <div className="p-3 bg-[#0D1017] border border-[#252D3A] rounded-lg font-mono-code text-xs text-[#8B7CFF] break-all leading-relaxed select-text">
                {displayHash || <span className="text-[#697386]">Awaiting input...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
