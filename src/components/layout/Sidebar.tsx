import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  Star,
  History,
  Settings,
  Info,
  Github,
  ChevronLeft,
  ChevronRight,
  Database,
  FileCode,
  Shield,
  FileText,
  Code,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { CATEGORIES } from '../../lib/toolsData';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { sidebarCollapsed, toggleSidebar, favorites, recentTools } = useAppStore();
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/tools?category=${encodeURIComponent(categoryName)}`);
    if (onCloseMobile) onCloseMobile();
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-4 h-4 shrink-0" />;
      case 'FileCode':
        return <FileCode className="w-4 h-4 shrink-0" />;
      case 'Shield':
        return <Shield className="w-4 h-4 shrink-0" />;
      case 'FileText':
        return <FileText className="w-4 h-4 shrink-0" />;
      case 'Code':
        return <Code className="w-4 h-4 shrink-0" />;
      case 'RefreshCw':
        return <RefreshCw className="w-4 h-4 shrink-0" />;
      default:
        return <Code className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-[#0D1017] border-r border-[#252D3A] transition-all duration-200 select-none ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand & Main Navigation Area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#252D3A]">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 overflow-hidden text-left"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-[#F3F5F9]">DevKit</span>
                  <span className="text-[10px] font-mono-code text-[#8B7CFF] px-1 py-0.2 bg-[#8B7CFF]/10 rounded">
                    v1.0.0
                  </span>
                </div>
                <span className="text-[10px] text-[#697386] truncate">Developer Utility Studio</span>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-[#697386] hover:text-[#F3F5F9] hover:bg-[#171D28] transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="p-3 space-y-1">
          <NavLink
            to="/"
            end
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
              }`
            }
            title="Overview"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Overview</span>}
          </NavLink>

          <NavLink
            to="/tools"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
              }`
            }
            title="All Tools"
          >
            <Grid className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>All Tools</span>}
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
              }`
            }
            title="Favorites"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 shrink-0 text-[#E8B45B]" />
              {!sidebarCollapsed && <span>Favorites</span>}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono-code text-[#697386]">{favorites.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/history"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
              }`
            }
            title="Recently Used"
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Recently Used</span>}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono-code text-[#697386]">{recentTools.length}</span>
            )}
          </NavLink>
        </div>

        {/* Categories Section */}
        <div className="px-3 pt-3 pb-2 border-t border-[#252D3A]">
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#697386]">
              Tool Categories
            </div>
          )}

          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                title={cat.name}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] transition-colors text-left"
              >
                {getCategoryIcon(cat.iconName)}
                {!sidebarCollapsed && <span className="truncate">{cat.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-[#252D3A] space-y-1">
        <NavLink
          to="/settings"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
            }`
          }
          title="Settings"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <NavLink
          to="/about"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30'
                : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] border border-transparent'
            }`
          }
          title="About DevKit"
        >
          <Info className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>About</span>}
        </NavLink>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28] transition-colors"
          title="GitHub Repository"
        >
          <Github className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>GitHub Repo</span>}
        </a>
      </div>
    </aside>
  );
};
