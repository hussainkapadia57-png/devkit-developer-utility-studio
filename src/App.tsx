import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Core Pages
import { Dashboard } from './pages/Dashboard';
import { AllTools } from './pages/AllTools';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

// 12 Developer Utilities
import { JsonFormatterTool } from './tools/json/JsonFormatterTool';
import { Base64Tool } from './tools/base64/Base64Tool';
import { JwtDecoderTool } from './tools/jwt/JwtDecoderTool';
import { RegexTesterTool } from './tools/regex/RegexTesterTool';
import { UrlEncoderTool } from './tools/url/UrlEncoderTool';
import { TextDiffTool } from './tools/diff/TextDiffTool';
import { HashGeneratorTool } from './tools/hash/HashGeneratorTool';
import { UuidGeneratorTool } from './tools/uuid/UuidGeneratorTool';
import { TimestampConverterTool } from './tools/timestamp/TimestampConverterTool';
import { MinifierTool } from './tools/minifier/MinifierTool';
import { CaseConverterTool } from './tools/case/CaseConverterTool';
import { ColorConverterTool } from './tools/color/ColorConverterTool';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Main Views */}
          <Route index element={<Dashboard />} />
          <Route path="tools" element={<AllTools />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />

          {/* 12 Dedicated Developer Utilities */}
          <Route path="tool/json-formatter" element={<JsonFormatterTool />} />
          <Route path="tool/base64" element={<Base64Tool />} />
          <Route path="tool/jwt-decoder" element={<JwtDecoderTool />} />
          <Route path="tool/regex-tester" element={<RegexTesterTool />} />
          <Route path="tool/url-encoder" element={<UrlEncoderTool />} />
          <Route path="tool/text-diff" element={<TextDiffTool />} />
          <Route path="tool/hash-generator" element={<HashGeneratorTool />} />
          <Route path="tool/uuid-generator" element={<UuidGeneratorTool />} />
          <Route path="tool/timestamp-converter" element={<TimestampConverterTool />} />
          <Route path="tool/code-minifier" element={<MinifierTool />} />
          <Route path="tool/case-converter" element={<CaseConverterTool />} />
          <Route path="tool/color-converter" element={<ColorConverterTool />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
