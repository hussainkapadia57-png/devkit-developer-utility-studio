import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Menu, Github, Moon, Sun, Keyboard, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { TOOLS } from '../../lib/toolsData';
import { ShortcutsModal } from '../common/ShortcutsModal';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const { setIsSearchOpen, theme, setTheme } = useAppStore();
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Find breadcrumb for current tool or page
  let breadcrumbTitle = 'Overview';
  if (location.pathname === '/tools') {
    breadcrumbTitle = 'All Tools';
  } else if (location.pathname === '/favorites') {
    breadcrumbTitle = 'Favorites';
  } else if (location.pathname === '/history') {
    breadcrumbTitle = 'Recently Used';
  } else if (location.pathname === '/settings') {
    breadcrumbTitle = 'Settings';
  } else if (location.pathname === '/about') {
    breadcrumbTitle = 'About DevKit';
  } else if (location.pathname.startsWith('/tool/')) {
    const currentTool = TOOLS.find((t) => t.path === location.pathname);
    if (currentTool) {
      breadcrumbTitle = currentTool.shortName || currentTool.name;
    }
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-3 sm:px-6 bg-[#090B10]/95 backdrop-blur-md border-b border-[#252D3A]">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clean Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium truncate">
            <Link to="/" className="text-[#697386] hover:text-[#929BAA] transition-colors shrink-0">
              DevKit
            </Link>
            <span className="text-[#697386] shrink-0">/</span>
            <span className="text-[#F3F5F9] truncate font-semibold">{breadcrumbTitle}</span>
          </nav>
        </div>

        {/* Right: Global search bar trigger + Shortcuts + Theme toggle + GitHub */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-[#929BAA] bg-[#11151D] hover:bg-[#171D28] border border-[#252D3A] hover:border-[#3B465A] rounded-lg transition-colors cursor-pointer"
            title="Search tools (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-code bg-[#171D28] border border-[#252D3A] rounded text-[#697386]">
              ⌘K
            </kbd>
          </button>

          {/* Shortcuts Guide */}
          <button
            type="button"
            onClick={() => setShortcutsModalOpen(true)}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
            className="hidden sm:flex p-2 text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] rounded-lg transition-colors border border-transparent hover:border-[#252D3A]"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme quick toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
            className="p-2 text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] rounded-lg transition-colors border border-transparent hover:border-[#252D3A]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E8B45B]" /> : <Moon className="w-4 h-4 text-[#8B7CFF]" />}
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="DevKit Repository on GitHub"
            aria-label="GitHub Repository"
            className="p-2 text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] rounded-lg transition-colors border border-transparent hover:border-[#252D3A]"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      <ShortcutsModal isOpen={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />
    </>
  );
};
