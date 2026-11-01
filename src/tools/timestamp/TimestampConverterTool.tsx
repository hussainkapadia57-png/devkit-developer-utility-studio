import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Copy, Calendar, RefreshCw, AlertCircle, Globe } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

const WORLD_ZONES = [
  { name: 'UTC / GMT', zone: 'UTC' },
  { name: 'US Pacific (PST/PDT)', zone: 'America/Los_Angeles' },
  { name: 'US Eastern (EST/EDT)', zone: 'America/New_York' },
  { name: 'London (BST/GMT)', zone: 'Europe/London' },
  { name: 'Central Europe (CET)', zone: 'Europe/Berlin' },
  { name: 'Tokyo (JST)', zone: 'Asia/Tokyo' },
  { name: 'India (IST)', zone: 'Asia/Kolkata' },
];

export const TimestampConverterTool: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);

  // Conversion 1: Timestamp -> Date
  const [timestampInput, setTimestampInput] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Conversion 2: Date -> Timestamp
  const [dateInput, setDateInput] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  // Live ticking timer
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Evaluate parsed date from timestamp
  const parsedDateResult = (() => {
    const trimmed = timestampInput.trim();
    if (!trimmed) return null;

    const num = Number(trimmed);
    if (isNaN(num)) {
      return { error: 'Invalid numeric timestamp' };
    }

    const ms = unit === 'seconds' ? num * 1000 : num;
    const dateObj = new Date(ms);

    if (isNaN(dateObj.getTime())) {
      return { error: 'Timestamp out of range' };
    }

    // Relative time calculation
    const nowMs = Date.now();
    const diffSec = Math.floor((nowMs - ms) / 1000);
    let relative = '';
    if (Math.abs(diffSec) < 60) {
      relative = 'Just now';
    } else {
      const isPast = diffSec > 0;
      const absSec = Math.abs(diffSec);
      const minutes = Math.floor(absSec / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) relative = `${days} day${days > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
      else if (hours > 0) relative = `${hours} hour${hours > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
      else relative = `${minutes} minute${minutes > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`;
    }

    const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMin = -new Date().getTimezoneOffset();
    const offsetFormatted = `UTC${offsetMin >= 0 ? '+' : ''}${Math.floor(offsetMin / 60)}:${Math.abs(offsetMin % 60)
      .toString()
      .padStart(2, '0')}`;

    return {
      dateObj,
      iso: dateObj.toISOString(),
      utc: dateObj.toUTCString(),
      local: dateObj.toLocaleString(),
      relative,
      timezone: `${timezoneName} (${offsetFormatted})`,
    };
  })();

  // Evaluate converted timestamp from date input
  const convertedTimestampResult = (() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;

    const sec = Math.floor(d.getTime() / 1000);
    const ms = d.getTime();

    return {
      seconds: sec,
      milliseconds: ms,
    };
  })();

  const setTimestampToNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestampInput(String(now));
    setUnit('seconds');
  };

  const adjustTimestamp = (secondsDelta: number) => {
    const currentNum = Number(timestampInput) || Math.floor(Date.now() / 1000);
    const updated = unit === 'seconds' ? currentNum + secondsDelta : currentNum + secondsDelta * 1000;
    setTimestampInput(String(updated));
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#8B7CFF]" />
            Unix Timestamp Converter
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Convert epoch timestamps to formatted dates, multi-timezone comparisons, and reverse date parsing.
          </p>
        </div>
      </div>

      {/* Live Current Epoch Clock Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#11151D] border border-[#252D3A] rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#8B7CFF]/15 text-[#8B7CFF]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#697386] block">
              Current Epoch Timestamp
            </span>
            <span className="text-lg font-mono-code font-bold text-[#F3F5F9]">{currentEpoch}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isLive
                ? 'bg-[#32C48D]/10 text-[#32C48D] border-[#32C48D]/30'
                : 'bg-[#171D28] text-[#929BAA] border-[#252D3A]'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live Ticking' : 'Paused'}</span>
          </button>

          <CopyButton textToCopy={String(currentEpoch)} label="Copy Epoch" />
        </div>
      </div>

      {/* Section 1: Timestamp to Date Conversion */}
      <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252D3A]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">
            Timestamp to Human-Readable Date
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={setTimestampToNow}
              className="text-xs text-[#8B7CFF] hover:underline"
            >
              Fill with Current Time
            </button>
            <span className="text-[#697386]">·</span>
            <button
              type="button"
              onClick={() => adjustTimestamp(-86400)}
              className="text-xs text-[#929BAA] hover:text-[#F3F5F9]"
            >
              -1 Day
            </button>
            <button
              type="button"
              onClick={() => adjustTimestamp(86400)}
              className="text-xs text-[#929BAA] hover:text-[#F3F5F9]"
            >
              +1 Day
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-[#0D1017] border border-[#252D3A] rounded-lg px-3 py-2 focus-within:border-[#8B7CFF]/50">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1735689600"
              className="w-full bg-transparent font-mono-code text-sm text-[#F3F5F9] border-none outline-none placeholder-[#697386]"
            />
          </div>

          <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setUnit('seconds')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                unit === 'seconds' ? 'bg-[#8B7CFF] text-white' : 'text-[#929BAA]'
              }`}
            >
              Seconds
            </button>
            <button
              type="button"
              onClick={() => setUnit('milliseconds')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                unit === 'milliseconds' ? 'bg-[#8B7CFF] text-white' : 'text-[#929BAA]'
              }`}
            >
              Milliseconds
            </button>
          </div>
        </div>

        {parsedDateResult && 'error' in parsedDateResult && (
          <div className="flex items-center gap-2 p-3 text-xs font-mono-code bg-[#F07178]/10 text-[#F07178] border border-[#F07178]/30 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parsedDateResult.error}</span>
          </div>
        )}

        {parsedDateResult && !('error' in parsedDateResult) && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-[#0D1017] border border-[#252D3A] rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#697386] block mb-1">UTC Time</span>
                  <span className="font-mono-code text-xs text-[#F3F5F9] break-words">{parsedDateResult.utc}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#252D3A]/60 flex justify-end">
                  <CopyButton textToCopy={parsedDateResult.utc} size="sm" variant="ghost" />
                </div>
              </div>

              <div className="p-3 bg-[#0D1017] border border-[#252D3A] rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#697386] block mb-1">
                    Local Time ({parsedDateResult.timezone})
                  </span>
                  <span className="font-mono-code text-xs text-[#F3F5F9] break-words">{parsedDateResult.local}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#252D3A]/60 flex justify-end">
                  <CopyButton textToCopy={parsedDateResult.local} size="sm" variant="ghost" />
                </div>
              </div>

              <div className="p-3 bg-[#0D1017] border border-[#252D3A] rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#697386] block mb-1">ISO 8601</span>
                  <span className="font-mono-code text-xs text-[#8B7CFF] break-words">{parsedDateResult.iso}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#252D3A]/60 flex justify-end">
                  <CopyButton textToCopy={parsedDateResult.iso} size="sm" variant="ghost" />
                </div>
              </div>
            </div>

            {/* World Timezones Comparison */}
            <div className="p-3.5 bg-[#0D1017] border border-[#252D3A] rounded-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8B7CFF]" />
                Major World Timezones
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {WORLD_ZONES.map((wz) => {
                  const formatted = new Intl.DateTimeFormat('en-US', {
                    timeZone: wz.zone,
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  }).format(parsedDateResult.dateObj);

                  return (
                    <div key={wz.zone} className="p-2 rounded bg-[#11151D] border border-[#252D3A]/60 text-xs">
                      <span className="text-[#697386] block text-[11px]">{wz.name}</span>
                      <span className="font-mono-code text-[#F3F5F9] font-medium">{formatted}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Date to Timestamp Conversion */}
      <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9] pb-3 border-b border-[#252D3A]">
          Date to Unix Timestamp
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="p-2.5 bg-[#0D1017] border border-[#252D3A] rounded-lg font-mono-code text-xs text-[#F3F5F9] outline-none focus:border-[#8B7CFF]/50"
          />
        </div>

        {convertedTimestampResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-[#0D1017] border border-[#252D3A] rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#697386] block">Seconds Epoch</span>
                <span className="text-sm font-mono-code font-bold text-[#F3F5F9]">
                  {convertedTimestampResult.seconds}
                </span>
              </div>
              <CopyButton textToCopy={String(convertedTimestampResult.seconds)} size="sm" />
            </div>

            <div className="p-3.5 bg-[#0D1017] border border-[#252D3A] rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#697386] block">Milliseconds Epoch</span>
                <span className="text-sm font-mono-code font-bold text-[#F3F5F9]">
                  {convertedTimestampResult.milliseconds}
                </span>
              </div>
              <CopyButton textToCopy={String(convertedTimestampResult.milliseconds)} size="sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
