import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, History, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import { TOOLS, CATEGORIES, getToolById } from '../lib/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { EmptyState } from '../components/common/EmptyState';
import { useAppStore } from '../stores/useAppStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, recentTools, setIsSearchOpen } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter tools based on category & search
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const favoriteTools = favorites.map((id) => getToolById(id)).filter(Boolean);

  const recentToolsList = recentTools
    .map((item) => {
      const tool = getToolById(item.toolId);
      return tool ? { ...tool, visitedAt: item.timestamp } : null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F9] tracking-tight">
            Your Developer Workspace
          </h1>
          <p className="text-sm text-[#929BAA] max-w-2xl leading-relaxed">
            Essential tools for everyday development, all in one place. Fast, privacy-focused, and processed 100% locally in your browser.
          </p>
        </div>

        {/* Global Live Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-[#8B7CFF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search developer tools by name, description, or category..."
            className="w-full pl-10 pr-24 py-2.5 bg-[#11151D] border border-[#252D3A] hover:border-[#3B465A] focus:border-[#8B7CFF]/60 rounded-xl text-sm text-[#F3F5F9] placeholder-[#697386] outline-none transition-colors shadow-xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-code bg-[#171D28] border border-[#252D3A] rounded text-[#697386]">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      {/* Favourite Tools Section (if any exist and not searching) */}
      {!searchQuery && favoriteTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#E8B45B] fill-[#E8B45B]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">
                Favorite Tools
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/favorites')}
              className="text-xs text-[#8B7CFF] hover:underline cursor-pointer"
            >
              View all ({favorites.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {favoriteTools.slice(0, 3).map((tool) => (
              <ToolCard key={tool!.id} tool={tool!} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used Section (if any exist and not searching) */}
      {!searchQuery && recentToolsList.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#8B7CFF]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">
                Recently Used
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs text-[#8B7CFF] hover:underline cursor-pointer"
            >
              View history ({recentTools.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recentToolsList.slice(0, 3).map((tool) => (
              <ToolCard key={tool!.id} tool={tool!} />
            ))}
          </div>
        </section>
      )}

      {/* All Tools Section with Category Filter Tabs */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#252D3A]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F3F5F9]">
            {searchQuery ? `Search Results (${filteredTools.length})` : 'All Developer Utilities'}
          </h2>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#8B7CFF] text-white shadow-xs'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28]'
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#8B7CFF] text-white shadow-xs'
                    : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching tools found"
            description={`We couldn't find any utilities matching "${searchQuery}". Try searching for JSON, Base64, UUID, or Minifier.`}
            action={{
              label: 'Clear Search',
              onClick: () => {
                setSearchQuery('');
                setSelectedCategory('All');
              },
            }}
          />
        )}
      </section>
    </div>
  );
};
