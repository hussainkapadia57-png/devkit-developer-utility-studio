import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../../lib/toolsData';
import { useAppStore } from '../../stores/useAppStore';
import { IconRenderer } from './IconRenderer';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, recordToolVisit } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search on Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        return;
      }

      if (!isSearchOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          const tool = filteredTools[selectedIndex];
          recordToolVisit(tool.id);
          setIsSearchOpen(false);
          navigate(tool.path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, filteredTools, selectedIndex, navigate, setIsSearchOpen, recordToolVisit]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-xs transition-opacity"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-[#252D3A] bg-[#11151D] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#252D3A] gap-3 bg-[#0D1017]">
          <Search className="w-5 h-5 text-[#8B7CFF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search developer tools by name, category, or keyword..."
            className="w-full bg-transparent text-sm text-[#F3F5F9] placeholder-[#697386] border-none outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#697386] hover:text-[#F3F5F9] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-code text-[#697386] border border-[#252D3A] rounded">
            ESC
          </span>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#252D3A]/40">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    recordToolVisit(tool.id);
                    setIsSearchOpen(false);
                    navigate(tool.path);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#171D28] text-[#F3F5F9]' : 'text-[#929BAA] hover:bg-[#171D28]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-md border ${
                        isSelected
                          ? 'bg-[#1D2532] border-[#8B7CFF]/50 text-[#8B7CFF]'
                          : 'bg-[#171D28] border-[#252D3A] text-[#929BAA]'
                      }`}
                    >
                      <IconRenderer name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F3F5F9]">{tool.name}</span>
                        <span className="text-[11px] text-[#697386]">· {tool.category}</span>
                      </div>
                      <p className="text-xs text-[#697386] line-clamp-1">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] text-[#8B7CFF] font-mono-code">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#697386]">
              <p className="text-sm">No tools matching "{query}"</p>
              <p className="text-xs mt-1 text-[#697386]/80">Try searching for json, base64, hash, jwt, regex, or diff</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0D1017] border-t border-[#252D3A] flex items-center justify-between text-[11px] text-[#697386] font-mono-code">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>{filteredTools.length} tools available</span>
        </div>
      </div>
    </div>
  );
};
