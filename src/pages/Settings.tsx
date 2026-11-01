import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Shield, Trash2, Sliders, Check } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

export const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    historyEnabled,
    setHistoryEnabled,
    sidebarCollapsed,
    setSidebarCollapsed,
    clearAllData,
  } = useAppStore();

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#252D3A]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#8B7CFF]" />
          Workspace Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
          Customize your interface layout, color scheme, and local browser data storage preferences.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <section className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">Appearance & Theme</h2>
          <p className="text-xs text-[#929BAA] mt-0.5">Select your preferred color scheme for DevKit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#8B7CFF]/15 border-[#8B7CFF] text-[#F3F5F9]'
                : 'bg-[#171D28] border-[#252D3A] text-[#929BAA] hover:border-[#3B465A]'
            }`}
          >
            <Moon className="w-5 h-5 text-[#8B7CFF]" />
            <div>
              <div className="text-xs font-semibold text-[#F3F5F9]">Dark Theme</div>
              <div className="text-[11px] text-[#697386]">Default engineered slate</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              theme === 'light'
                ? 'bg-[#8B7CFF]/15 border-[#8B7CFF] text-[#F3F5F9]'
                : 'bg-[#171D28] border-[#252D3A] text-[#929BAA] hover:border-[#3B465A]'
            }`}
          >
            <Sun className="w-5 h-5 text-[#E8B45B]" />
            <div>
              <div className="text-xs font-semibold text-[#F3F5F9]">Light Theme</div>
              <div className="text-[11px] text-[#697386]">High-contrast day mode</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              theme === 'system'
                ? 'bg-[#8B7CFF]/15 border-[#8B7CFF] text-[#F3F5F9]'
                : 'bg-[#171D28] border-[#252D3A] text-[#929BAA] hover:border-[#3B465A]'
            }`}
          >
            <Monitor className="w-5 h-5 text-[#6C8CFF]" />
            <div>
              <div className="text-xs font-semibold text-[#F3F5F9]">System Auto</div>
              <div className="text-[11px] text-[#697386]">Match OS preference</div>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Interface Density & Layout */}
      <section className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">Interface & Density</h2>
          <p className="text-xs text-[#929BAA] mt-0.5">Fine-tune spacing and sidebar behavior.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#252D3A]/60">
            <div>
              <span className="text-xs font-semibold text-[#F3F5F9] block">Layout Density</span>
              <span className="text-xs text-[#697386]">Adjust padding inside utility work areas</span>
            </div>
            <div className="flex items-center bg-[#171D28] border border-[#252D3A] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  density === 'comfortable' ? 'bg-[#8B7CFF] text-white' : 'text-[#929BAA]'
                }`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  density === 'compact' ? 'bg-[#8B7CFF] text-white' : 'text-[#929BAA]'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#F3F5F9] block">Desktop Sidebar State</span>
              <span className="text-xs text-[#697386]">Start with sidebar expanded or icon-only</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                sidebarCollapsed
                  ? 'bg-[#171D28] text-[#929BAA] border-[#252D3A]'
                  : 'bg-[#8B7CFF]/15 text-[#8B7CFF] border-[#8B7CFF]/40'
              }`}
            >
              {sidebarCollapsed ? 'Icon Only (Collapsed)' : 'Expanded View'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Privacy & Local Data */}
      <section className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#32C48D]" />
            Privacy Architecture & Storage
          </h2>
          <p className="text-xs text-[#929BAA] mt-0.5">
            DevKit does not send your data to external servers. All operations run locally inside your browser memory.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#252D3A]/60">
            <div>
              <span className="text-xs font-semibold text-[#F3F5F9] block">Track Recently Used Tools</span>
              <span className="text-xs text-[#697386]">
                Only records tool names and timestamps (never your input content or tokens)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={historyEnabled}
                onChange={(e) => setHistoryEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#171D28] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#929BAA] peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B7CFF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#F3F5F9] block">Reset All Stored Data</span>
              <span className="text-xs text-[#697386]">Clears all favorites, recents, and local settings</span>
            </div>
            <button
              type="button"
              onClick={clearAllData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F07178] hover:bg-[#F07178]/10 border border-[#F07178]/30 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        </div>
      </section>

      {/* 4. About & License */}
      <section className="p-5 bg-[#11151D] border border-[#252D3A] rounded-xl space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">About DevKit</h2>
        <div className="text-xs text-[#929BAA] space-y-2 leading-relaxed">
          <p>
            <strong className="text-[#F3F5F9]">DevKit — Developer Utility Studio</strong> v1.0.0
          </p>
          <p>One Workspace. Essential Developer Tools. Distributed under the permissive MIT Open Source License.</p>
          <p>
            Designed for 100% offline-compatible operation. No cloud telemetry, no analytics beacons, and no backend
            dependencies.
          </p>
        </div>
      </section>
    </div>
  );
};
