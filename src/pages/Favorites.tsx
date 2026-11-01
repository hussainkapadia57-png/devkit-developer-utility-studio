import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getToolById } from '../lib/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { EmptyState } from '../components/common/EmptyState';
import { useAppStore } from '../stores/useAppStore';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useAppStore();

  const favoriteTools = favorites.map((id) => getToolById(id)).filter(Boolean);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#252D3A]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5F9] flex items-center gap-2">
            <Star className="w-6 h-6 text-[#E8B45B] fill-[#E8B45B]" />
            Favorite Developer Tools
          </h1>
          <p className="text-xs sm:text-sm text-[#929BAA] mt-1">
            Quickly access your pinned utilities. Favourites are saved locally in your browser storage.
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool!.id} tool={tool!} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No favorite tools yet"
          description="Click the star icon on any tool card in the catalog or dashboard to pin it here for quick access."
          action={{
            label: 'Browse All Tools',
            onClick: () => navigate('/tools'),
          }}
        />
      )}
    </div>
  );
};
