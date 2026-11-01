import React from 'react';
import { Terminal, Shield, Cpu, Lock, CheckCircle2, Github, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#252D3A]">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9]">DevKit</h1>
              <span className="text-xs font-mono-code text-[#8B7CFF] bg-[#8B7CFF]/15 px-2 py-0.5 rounded border border-[#8B7CFF]/30">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-[#697386]">Developer Utility Studio · One Workspace. Essential Developer Tools.</p>
          </div>
        </div>
      </div>

      {/* Overview Manifesto */}
      <section className="p-6 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <h2 className="text-base font-semibold text-[#F3F5F9]">The DevKit Mission</h2>
        <p className="text-sm text-[#929BAA] leading-relaxed">
          Modern software development often requires juggling a dozen ad-hoc converter websites — each loaded with ads,
          tracking trackers, and questionable server-side logging of sensitive payloads. DevKit replaces that chaotic workflow
          with a unified, elegant, and uncompromisingly private developer workspace.
        </p>
        <p className="text-sm text-[#929BAA] leading-relaxed">
          Every tool inside DevKit executes <strong>strictly client-side</strong> using standard browser Web APIs.
          No keys, tokens, passwords, or code snippets ever leave your local device.
        </p>
      </section>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-2">
          <div className="flex items-center gap-2.5 text-[#32C48D]">
            <Shield className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#F3F5F9]">Zero Server Dependency</h3>
          </div>
          <p className="text-xs text-[#929BAA] leading-relaxed">
            All 12 utilities run entirely in browser memory. JSON parsing, Base64 conversion, Web Crypto hashing, and syntax
            tokenization happen locally.
          </p>
        </div>

        <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-2">
          <div className="flex items-center gap-2.5 text-[#8B7CFF]">
            <Cpu className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#F3F5F9]">Offline & Portable</h3>
          </div>
          <p className="text-xs text-[#929BAA] leading-relaxed">
            Compiled with relative asset paths (<code className="font-mono-code text-[#F3F5F9]">base: "./"</code>). The
            entire bundle can be extracted from a ZIP and hosted on any local static server.
          </p>
        </div>

        <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-2">
          <div className="flex items-center gap-2.5 text-[#6C8CFF]">
            <Lock className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#F3F5F9]">No Analytics or Telemetry</h3>
          </div>
          <p className="text-xs text-[#929BAA] leading-relaxed">
            No Google Analytics, no tracking pixels, and no remote session monitors. Your development environment stays
            clean and unobserved.
          </p>
        </div>

        <div className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-2">
          <div className="flex items-center gap-2.5 text-[#E8B45B]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#F3F5F9]">Standardized Design System</h3>
          </div>
          <p className="text-xs text-[#929BAA] leading-relaxed">
            Engineered with tailored dark slate tokens, JetBrains Mono code surfaces, keyboard ergonomics, and WCAG AA contrast.
          </p>
        </div>
      </div>

      {/* Offline & Distribution Guide */}
      <section className="p-6 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <h2 className="text-base font-semibold text-[#F3F5F9]">Local Execution & Distribution</h2>
        <div className="text-xs text-[#929BAA] space-y-3 leading-relaxed">
          <p>
            To run DevKit locally on your machine or deploy it to an intranet without external network connectivity:
          </p>

          <div className="p-4 bg-[#0D1017] border border-[#252D3A] rounded-lg font-mono-code space-y-2 text-[#F3F5F9]">
            <div className="text-[#697386]"># 1. Build the production bundle</div>
            <div>npm run build</div>
            <div className="text-[#697386] pt-1"># 2. Serve the static dist folder using any local server</div>
            <div>npx serve dist -l 3000</div>
            <div className="text-[#697386] pt-1"># Or with Python</div>
            <div>python3 -m http.server 3000 --directory dist</div>
          </div>

          <p>
            Because modern browser security models restrict features like <code className="text-[#F3F5F9]">crypto.subtle</code> and
            Worker/ESM loading over <code className="text-[#F3F5F9]">file://</code> URLs, running through a lightweight local static server
            guarantees 100% functionality.
          </p>
        </div>
      </section>

      {/* License and Links */}
      <section className="p-6 bg-[#11151D] border border-[#252D3A] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-semibold text-[#F3F5F9] block">MIT Open Source License</span>
          <span className="text-xs text-[#697386]">Free for personal, academic, and commercial developer use.</span>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#F3F5F9] bg-[#171D28] hover:bg-[#1D2532] border border-[#252D3A] hover:border-[#3B465A] rounded-lg transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>GitHub Repository</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
      </section>
    </div>
  );
};
