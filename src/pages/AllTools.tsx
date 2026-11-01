import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, Search } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../lib/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { EmptyState } from '../components/common/EmptyState';

export const AllTools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filtered = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesQuery =
      !query.trim() ||
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Grid className="w-6 h-6 text-[#8B7CFF]" />
            All Developer Utilities
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Browse and access all 12 client-side developer utilities available in DevKit Studio.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8B7CFF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#11151D] border border-[#252D3A] rounded-lg text-xs text-[#F3F5F9] placeholder-[#697386] outline-none focus:border-[#8B7CFF]/60"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handleSelectCategory('All')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#8B7CFF] text-white shadow-xs'
              : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28]'
          }`}
        >
          All Tools ({TOOLS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = TOOLS.filter((t) => t.category === cat.name).length;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleSelectCategory(cat.name)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#8B7CFF] text-white shadow-xs'
                  : 'text-[#929BAA] hover:text-[#F3F5F9] hover:bg-[#171D28]'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tools found"
          description={`No tools found matching your current filter criteria.`}
          action={{
            label: 'Reset Filters',
            onClick: () => {
              setQuery('');
              handleSelectCategory('All');
            },
          }}
        />
      )}
    </div>
  );
};
