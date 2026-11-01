import React, { useState, useMemo } from 'react';
import { Palette, Copy, Check, Sliders, ShieldCheck, Sparkles } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const ColorConverterTool: React.FC = () => {
  const [hexInput, setHexInput] = useState<string>('#8B7CFF');

  // Convert HEX to RGB
  const hexToRgb = (hexStr: string): { r: number; g: number; b: number } | null => {
    let clean = hexStr.replace(/^#/, '').trim();
    if (clean.length === 3) {
      clean = clean
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
      return null;
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  };

  // Calculate relative luminance for WCAG contrast
  const getLuminance = (r: number, g: number, b: number): number => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (lum1: number, lum2: number): number => {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const colorData = useMemo(() => {
    const rgb = hexToRgb(hexInput);
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    const hexUpper = rgbToHex(rgb.r, rgb.g, rgb.b);
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const hsvString = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    const cssVars = `--color-primary: ${hexUpper};\n--color-primary-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n--color-primary-hsl: ${hsl.h}, ${hsl.s}%, ${hsl.l}%;`;

    // Contrast calculations
    const lum = getLuminance(rgb.r, rgb.g, rgb.b);
    const contrastWhite = getContrastRatio(lum, 1.0);
    const contrastBlack = getContrastRatio(lum, 0.0);

    // Tints & Shades
    const tints = [0.2, 0.4, 0.6, 0.8].map((factor) => {
      const tr = Math.round(rgb.r + (255 - rgb.r) * factor);
      const tg = Math.round(rgb.g + (255 - rgb.g) * factor);
      const tb = Math.round(rgb.b + (255 - rgb.b) * factor);
      return rgbToHex(tr, tg, tb);
    });

    const shades = [0.2, 0.4, 0.6, 0.8].map((factor) => {
      const sr = Math.round(rgb.r * (1 - factor));
      const sg = Math.round(rgb.g * (1 - factor));
      const sb = Math.round(rgb.b * (1 - factor));
      return rgbToHex(sr, sg, sb);
    });

    return {
      rgb,
      hsl,
      hsv,
      cmyk,
      hexUpper,
      rgbString,
      rgbaString,
      hslString,
      hsvString,
      cmykString,
      cssVars,
      contrastWhite: contrastWhite.toFixed(2),
      contrastBlack: contrastBlack.toFixed(2),
      passWhiteAA: contrastWhite >= 4.5,
      passBlackAA: contrastBlack >= 4.5,
      tints,
      shades,
    };
  }, [hexInput]);

  const updateRgbChannel = (channel: 'r' | 'g' | 'b', val: number) => {
    if (!colorData) return;
    const updated = { ...colorData.rgb, [channel]: val };
    setHexInput(rgbToHex(updated.r, updated.g, updated.b));
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#8B7CFF]" />
            Color Converter & Palette Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Convert HEX, RGB, HSL, HSV, and CMYK models with live RGB sliders and WCAG contrast check.
          </p>
        </div>
      </div>

      {/* Primary Color Picker & Swatch Row */}
      <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col md:flex-row gap-6 items-center">
        {/* Large Visual Swatch */}
        <div
          className="w-full md:w-56 h-36 rounded-xl border border-[#252D3A] flex items-center justify-center shadow-lg transition-all"
          style={{ backgroundColor: colorData?.hexUpper || '#8B7CFF' }}
        >
          <span className="font-mono-code font-bold text-sm px-2.5 py-1 rounded-md bg-black/50 text-white backdrop-blur-xs">
            {colorData?.hexUpper || hexInput}
          </span>
        </div>

        {/* Inputs and Sliders */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorData?.hexUpper || '#8B7CFF'}
                onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                title="Select color visually"
              />
              <span className="text-xs text-[#929BAA]">Visual Pick</span>
            </div>

            <div className="flex-1 flex items-center bg-[#0D1017] border border-[#252D3A] rounded-lg px-3 py-2 focus-within:border-[#8B7CFF]/50">
              <span className="text-[#697386] font-mono-code mr-1">HEX:</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#8B7CFF"
                className="w-full bg-transparent font-mono-code text-sm text-[#F3F5F9] border-none outline-none"
              />
            </div>
          </div>

          {/* Interactive RGB Sliders */}
          {colorData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono-code text-[#697386]">
                  <span className="text-[#F07178] font-bold">R</span>
                  <span>{colorData.rgb.r}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.r}
                  onChange={(e) => updateRgbChannel('r', Number(e.target.value))}
                  className="w-full accent-[#F07178] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono-code text-[#697386]">
                  <span className="text-[#32C48D] font-bold">G</span>
                  <span>{colorData.rgb.g}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.g}
                  onChange={(e) => updateRgbChannel('g', Number(e.target.value))}
                  className="w-full accent-[#32C48D] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono-code text-[#697386]">
                  <span className="text-[#6C8CFF] font-bold">B</span>
                  <span>{colorData.rgb.b}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.b}
                  onChange={(e) => updateRgbChannel('b', Number(e.target.value))}
                  className="w-full accent-[#6C8CFF] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Quick presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-[#697386]">Presets:</span>
            {['#8B7CFF', '#6C8CFF', '#32C48D', '#E8B45B', '#F07178', '#090B10', '#11151D', '#F3F5F9'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setHexInput(c)}
                className="w-6 h-6 rounded-md border border-[#252D3A] hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>

      {colorData ? (
        <div className="space-y-6">
          {/* Formats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8B7CFF]">HEX</span>
                <CopyButton textToCopy={colorData.hexUpper} size="sm" />
              </div>
              <span className="font-mono-code text-sm font-bold text-[#F3F5F9]">{colorData.hexUpper}</span>
            </div>

            <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8B7CFF]">RGB</span>
                <CopyButton textToCopy={colorData.rgbString} size="sm" />
              </div>
              <span className="font-mono-code text-sm font-bold text-[#F3F5F9]">{colorData.rgbString}</span>
            </div>

            <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8B7CFF]">HSL</span>
                <CopyButton textToCopy={colorData.hslString} size="sm" />
              </div>
              <span className="font-mono-code text-sm font-bold text-[#F3F5F9]">{colorData.hslString}</span>
            </div>

            <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8B7CFF]">CMYK</span>
                <CopyButton textToCopy={colorData.cmykString} size="sm" />
              </div>
              <span className="font-mono-code text-sm font-bold text-[#F3F5F9]">{colorData.cmykString}</span>
            </div>
          </div>

          {/* CSS Variables Export */}
          <div className="p-4 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA] block">
                CSS Variables Export
              </span>
              <pre className="font-mono-code text-xs text-[#F3F5F9] mt-1 whitespace-pre-wrap">{colorData.cssVars}</pre>
            </div>
            <CopyButton textToCopy={colorData.cssVars} label="Copy CSS Vars" />
          </div>

          {/* WCAG Accessibility Contrast Ratings */}
          <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA] block">
              WCAG 2.1 Accessibility Contrast Checker
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: colorData.hexUpper }}
              >
                <div className="text-white">
                  <div className="text-sm font-bold">White Text on Color</div>
                  <div className="text-xs opacity-90 font-mono-code">{colorData.contrastWhite}:1 ratio</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    colorData.passWhiteAA ? 'bg-black/60 text-emerald-300' : 'bg-black/60 text-red-300'
                  }`}
                >
                  {colorData.passWhiteAA ? 'Pass (AA)' : 'Fail (AA)'}
                </span>
              </div>

              <div
                className="p-4 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: colorData.hexUpper }}
              >
                <div className="text-black">
                  <div className="text-sm font-bold">Black Text on Color</div>
                  <div className="text-xs opacity-90 font-mono-code">{colorData.contrastBlack}:1 ratio</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    colorData.passBlackAA ? 'bg-white/70 text-emerald-900' : 'bg-white/70 text-red-900'
                  }`}
                >
                  {colorData.passBlackAA ? 'Pass (AA)' : 'Fail (AA)'}
                </span>
              </div>
            </div>
          </div>

          {/* Tints & Shades Generator */}
          <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#929BAA] block">
              Generated Tints & Shades
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[...colorData.shades.reverse(), colorData.hexUpper, ...colorData.tints].map((hexVal, idx) => (
                <div
                  key={idx}
                  onClick={() => setHexInput(hexVal)}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div
                    className="w-full h-12 rounded-lg border border-[#252D3A] group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: hexVal }}
                  />
                  <span className="text-[10px] font-mono-code text-[#697386] mt-1 group-hover:text-[#F3F5F9]">
                    {hexVal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[#F07178] bg-[#11151D] border border-[#252D3A] rounded-xl font-mono-code text-xs">
          Invalid HEX color code. Please provide a valid 3-digit or 6-digit HEX format (e.g. #8B7CFF).
        </div>
      )}
    </div>
  );
};
