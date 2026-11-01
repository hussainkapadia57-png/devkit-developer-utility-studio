import React, { useState, useMemo } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, AlertTriangle, Clock, Copy, Download, Info } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { useAppStore } from '../../stores/useAppStore';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggVmFuY2UiLCJyb2xlIjoiU2VuaW9yIEVuZ2luZWVyIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE4OTM0NTYwMDAsImlzcyI6Imh0dHBzOi8vZGV2a2l0LmlvIn0.dt1b5kQp_wZ0B8x9V4f3L6a7M2n8K0p_wZ0B8x9V4f3';

const STANDARD_CLAIMS: { [key: string]: string } = {
  iss: 'Issuer of the token',
  sub: 'Subject (unique user identifier)',
  aud: 'Audience intended recipient',
  exp: 'Expiration timestamp',
  nbf: 'Not before timestamp',
  iat: 'Issued at timestamp',
  jti: 'Unique JWT ID',
};

export const JwtDecoderTool: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>(SAMPLE_JWT);
  const addToast = useAppStore((s) => s.addToast);

  // Safe base64url decoding
  const decodeBase64Url = (str: string): string => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string');
    }
    const binary = atob(output);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const decodedData = useMemo(() => {
    const raw = tokenInput.trim();
    if (!raw) return null;

    const parts = raw.split('.');
    if (parts.length < 2) {
      return { error: 'Invalid JWT structure: A valid JWT must contain at least 2 or 3 dot-separated segments.' };
    }

    try {
      const headerStr = decodeBase64Url(parts[0]);
      const payloadStr = decodeBase64Url(parts[1]);
      const signature = parts[2] || '';

      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      const exp = payloadObj.exp ? Number(payloadObj.exp) : null;
      const iat = payloadObj.iat ? Number(payloadObj.iat) : null;
      const nbf = payloadObj.nbf ? Number(payloadObj.nbf) : null;

      const nowSeconds = Math.floor(Date.now() / 1000);
      let isExpired: boolean | null = null;
      let expMessage = '';

      if (exp) {
        if (exp < nowSeconds) {
          isExpired = true;
          const diff = nowSeconds - exp;
          const mins = Math.floor(diff / 60);
          const hours = Math.floor(mins / 60);
          const days = Math.floor(hours / 24);
          expMessage = `Token expired ${
            days > 0 ? `${days} day(s)` : hours > 0 ? `${hours} hour(s)` : `${mins} minute(s)`
          } ago (${new Date(exp * 1000).toLocaleString()})`;
        } else {
          isExpired = false;
          const diff = exp - nowSeconds;
          const mins = Math.floor(diff / 60);
          const hours = Math.floor(mins / 60);
          const days = Math.floor(hours / 24);
          expMessage = `Token is active for the next ${
            days > 0 ? `${days} day(s)` : hours > 0 ? `${hours} hour(s)` : `${mins} minute(s)`
          } (${new Date(exp * 1000).toLocaleString()})`;
        }
      }

      return {
        header: headerObj,
        payload: payloadObj,
        headerFormatted: JSON.stringify(headerObj, null, 2),
        payloadFormatted: JSON.stringify(payloadObj, null, 2),
        signature,
        exp,
        iat,
        nbf,
        isExpired,
        expMessage,
        rawHeader: parts[0],
        rawPayload: parts[1],
        rawSignature: parts[2] || '',
      };
    } catch (err: any) {
      return { error: `Failed to decode JWT: ${err.message}` };
    }
  }, [tokenInput]);

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-[#8B7CFF]" />
            JWT Decoder & Token Inspector
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Decode token header, inspect claims, explain standard parameters, and check expiration time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTokenInput(SAMPLE_JWT)}
          className="px-3 py-1.5 text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          Load Sample JWT
        </button>
      </div>

      {/* Security Warning Callout */}
      <div className="flex items-start gap-3 p-3.5 bg-[#E8B45B]/10 border border-[#E8B45B]/20 rounded-xl text-xs text-[#E8B45B]">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Security Notice:</strong> JWT decoding is purely visual JSON inspection,{' '}
          <em>not</em> signature verification. Without the server's private secret key, authenticity cannot be confirmed.
          All processing runs strictly in your local browser memory.
        </div>
      </div>

      {/* Token Input Box with Segment Color Markers */}
      <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0D1017] border-b border-[#252D3A]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA]">Encoded JWT</span>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono-code">
              <span className="text-[#F07178]">Header</span>
              <span>·</span>
              <span className="text-[#8B7CFF]">Payload</span>
              <span>·</span>
              <span className="text-[#6C8CFF]">Signature</span>
            </div>
          </div>
          {tokenInput && (
            <button
              type="button"
              onClick={() => setTokenInput('')}
              className="text-xs text-[#697386] hover:text-[#F07178] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste your JSON Web Token (e.g. eyJhbGci...)"
          className="w-full h-24 sm:h-28 p-3.5 font-mono-code text-xs sm:text-sm text-[#F3F5F9] placeholder-[#697386] bg-transparent resize-none border-none outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Decoded Inspection Section */}
      {decodedData?.error ? (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-[#F07178]/10 border border-[#F07178]/30 text-xs font-mono-code text-[#F07178]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{decodedData.error}</span>
        </div>
      ) : decodedData ? (
        <div className="space-y-5">
          {/* Expiration Status Pill/Card */}
          {decodedData.exp && (
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono-code ${
                decodedData.isExpired
                  ? 'bg-[#F07178]/10 border-[#F07178]/30 text-[#F07178]'
                  : 'bg-[#32C48D]/10 border-[#32C48D]/30 text-[#32C48D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{decodedData.expMessage}</span>
              </div>
              <span className="font-semibold uppercase tracking-wider">
                {decodedData.isExpired ? 'EXPIRED' : 'ACTIVE'}
              </span>
            </div>
          )}

          {/* Timestamps Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#11151D] border border-[#252D3A] rounded-xl text-xs">
              <span className="text-[#697386] font-medium block mb-1">Issued At (iat)</span>
              <span className="font-mono-code text-[#F3F5F9]">
                {decodedData.iat ? new Date(decodedData.iat * 1000).toLocaleString() : 'Not present'}
              </span>
            </div>
            <div className="p-3 bg-[#11151D] border border-[#252D3A] rounded-xl text-xs">
              <span className="text-[#697386] font-medium block mb-1">Expiration Time (exp)</span>
              <span className="font-mono-code text-[#F3F5F9]">
                {decodedData.exp ? new Date(decodedData.exp * 1000).toLocaleString() : 'Not present'}
              </span>
            </div>
            <div className="p-3 bg-[#11151D] border border-[#252D3A] rounded-xl text-xs">
              <span className="text-[#697386] font-medium block mb-1">Not Before (nbf)</span>
              <span className="font-mono-code text-[#F3F5F9]">
                {decodedData.nbf ? new Date(decodedData.nbf * 1000).toLocaleString() : 'Not present'}
              </span>
            </div>
          </div>

          {/* Header & Payload Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Header Box */}
            <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F07178]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F07178]">
                    Header: Algorithm & Token Type
                  </span>
                </div>
                <CopyButton textToCopy={decodedData.headerFormatted || ''} />
              </div>
              <pre className="p-4 font-mono-code text-xs sm:text-sm text-[#F3F5F9] leading-relaxed overflow-x-auto max-h-72">
                {decodedData.headerFormatted}
              </pre>
            </div>

            {/* Payload Box */}
            <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8B7CFF]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7CFF]">
                    Payload: Claims Data
                  </span>
                </div>
                <CopyButton textToCopy={decodedData.payloadFormatted || ''} />
              </div>
              <pre className="p-4 font-mono-code text-xs sm:text-sm text-[#F3F5F9] leading-relaxed overflow-x-auto max-h-72">
                {decodedData.payloadFormatted}
              </pre>
            </div>
          </div>

          {/* Standard Claims Explanations */}
          {decodedData.payload && (
            <div className="p-4 rounded-xl border border-[#252D3A] bg-[#11151D] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#929BAA]">
                <Info className="w-3.5 h-3.5 text-[#8B7CFF]" />
                Detected Standard Claims
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {Object.keys(decodedData.payload).map((key) => {
                  if (STANDARD_CLAIMS[key]) {
                    return (
                      <div key={key} className="p-2 rounded bg-[#0D1017] border border-[#252D3A]/60">
                        <span className="font-mono-code text-[#8B7CFF] font-semibold">{key}</span>: {STANDARD_CLAIMS[key]}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Signature Segment */}
          <div className="rounded-xl border border-[#252D3A] bg-[#11151D] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0D1017] border-b border-[#252D3A]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6C8CFF]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6C8CFF]">
                  Signature Checksum
                </span>
              </div>
              {decodedData.signature && <CopyButton textToCopy={decodedData.signature} />}
            </div>
            <div className="p-3.5 font-mono-code text-xs text-[#929BAA] break-all leading-relaxed">
              {decodedData.signature || 'No signature segment detected (unsigned token)'}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
