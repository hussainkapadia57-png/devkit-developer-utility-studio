import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { IconRenderer } from './IconRenderer';

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, recordToolVisit } = useAppStore();
  const favorited = isFavorite(tool.id);

  const handleCardClick = () => {
    recordToolVisit(tool.id);
    navigate(tool.path);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-5 bg-[#11151D] hover:bg-[#171D28] border border-[#252D3A] hover:border-[#3B465A] rounded-xl transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
    >
      <div>
        {/* Top row: Icon + Category unboxed text + Favorite button */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#171D28] border border-[#252D3A] text-[#8B7CFF] group-hover:border-[#8B7CFF]/30 transition-colors">
              <IconRenderer name={tool.iconName} className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#697386] tracking-wide">
              {tool.category}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFavoriteClick}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 rounded-lg text-[#697386] hover:text-[#E8B45B] hover:bg-[#1D2532] transition-colors"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                favorited ? 'fill-[#E8B45B] text-[#E8B45B]' : 'text-current'
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#F3F5F9] group-hover:text-[#8B7CFF] transition-colors mb-1.5">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#929BAA] leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      {/* Bottom row: Clean Open tool action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#252D3A]/60 text-xs text-[#697386] group-hover:text-[#F3F5F9] transition-colors">
        <span className="font-mono-code text-[11px] text-[#697386]">client-side offline</span>
        <div className="flex items-center gap-1 font-medium text-[#8B7CFF]">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
