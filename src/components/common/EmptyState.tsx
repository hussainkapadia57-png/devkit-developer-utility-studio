import React from 'react';
import { LucideIcon, Search, Star, History, Terminal } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Terminal,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#252D3A] bg-[#11151D]/60 max-w-lg mx-auto">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#171D28] border border-[#252D3A] text-[#8B7CFF] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F3F5F9] mb-1.5">{title}</h3>
      <p className="text-xs text-[#929BAA] max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-[#8B7CFF] hover:bg-[#7867FB] rounded-lg transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
